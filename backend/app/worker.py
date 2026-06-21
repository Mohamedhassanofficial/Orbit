"""Automated referral-reward pipeline (Zhang's spec).

Two idempotent jobs, run every indexer cycle:
  1. verify_pending   — confirm the referee's on-chain purchase, compute the 10%
                        reward, and schedule payout 30h out (≤ 3 days).
  2. distribute_due   — once payout_at is reached, push the reward to the referrer
                        via Referral.distribute(), signed by the backend distributor.

Pure decision logic is separated from chain/DB I/O (injected callables) so it can be
unit-tested without a node or a funded key.
"""
from datetime import datetime, timedelta, timezone
from decimal import Decimal

from sqlalchemy.orm import Session

from .config import get_settings
from .models import PresaleContribution, Referral, User

settings = get_settings()
WEI = 10**18


def _now() -> datetime:
    """Naive UTC, matching the DB's server-default timestamps."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


# ----- purchase verification -----
def purchased_tokens(db: Session, referee: str) -> Decimal:
    """Total $ORB the referee bought in the presale (sum of indexed contributions)."""
    user = db.query(User).filter(User.wallet_address == referee.lower()).first()
    if user is None:
        return Decimal(0)
    total = (
        db.query(PresaleContribution)
        .with_entities(PresaleContribution.tokens)
        .filter(PresaleContribution.user_id == user.id)
        .all()
    )
    return sum((Decimal(t[0]) for t in total), Decimal(0))


def verify_pending(db: Session, lookup=purchased_tokens, now=None) -> int:
    """Move pending claims whose referee has a confirmed purchase → verified, and
    schedule their payout. Returns how many were verified."""
    now = now or _now()
    delay = timedelta(hours=settings.referral_delay_hours)
    bps = Decimal(settings.referral_reward_bps)
    n = 0
    for claim in db.query(Referral).filter(Referral.status == "pending").all():
        purchased = lookup(db, claim.referee)
        if purchased and purchased > 0:
            claim.purchased_amount = purchased
            claim.reward_amount = (purchased * bps) / Decimal(10_000)
            claim.bonus_amount = claim.reward_amount  # legacy alias
            claim.verified_at = now
            claim.payout_at = now + delay
            claim.status = "verified"
            n += 1
    db.commit()
    return n


def distribute_due(db: Session, send_payout, now=None) -> int:
    """Pay verified claims whose payout time has arrived. `send_payout(referrer,
    referee, reward) -> tx_hash | None` performs the on-chain transfer. Returns how
    many were paid."""
    now = now or _now()
    n = 0
    due = (
        db.query(Referral)
        .filter(Referral.status == "verified", Referral.payout_at <= now)
        .all()
    )
    for claim in due:
        tx_hash = send_payout(claim.referrer, claim.referee, Decimal(claim.reward_amount))
        if tx_hash:
            claim.status = "paid"
            claim.paid = True
            claim.paid_at = now
            claim.tx_hash = tx_hash
            n += 1
    db.commit()
    return n


# ----- on-chain sender (real payout) -----
def make_chain_sender(w3, referral_abi):
    """Build a send_payout() that signs Referral.distribute() with the distributor
    key. Returns None (no-op) if no key/contract is configured."""
    from eth_account import Account

    if not settings.distributor_private_key or not settings.referral_address:
        return None
    acct = Account.from_key(settings.distributor_private_key)
    contract = w3.eth.contract(
        address=w3.to_checksum_address(settings.referral_address), abi=referral_abi
    )

    def send_payout(referrer: str, referee: str, reward: Decimal):
        try:
            amount_wei = int(reward * WEI)
            tx = contract.functions.distribute(
                w3.to_checksum_address(referrer),
                w3.to_checksum_address(referee),
                amount_wei,
            ).build_transaction(
                {
                    "from": acct.address,
                    "nonce": w3.eth.get_transaction_count(acct.address),
                    "chainId": settings.chain_id,
                    "gas": 120000,
                    "gasPrice": w3.eth.gas_price,
                }
            )
            signed = acct.sign_transaction(tx)
            tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
            w3.eth.wait_for_transaction_receipt(tx_hash, timeout=180)
            return tx_hash.hex()
        except Exception as e:  # keep the loop alive; retry next cycle
            print(f"[worker] payout failed for {referrer}: {e}")
            return None

    return send_payout
