"""On-chain event indexer.

Polls the ORBIT contracts on BNB Smart Chain and mirrors their events into MySQL
so the API can serve fast history / leaderboard / presale queries.

Run as a separate process:  python -m app.indexer.indexer
"""
import json
import time
from decimal import Decimal

from web3 import Web3

from ..config import get_settings
from ..database import SessionLocal, init_db
from ..models import (
    EventLog,
    PresaleContribution,
    Referral,  # noqa: F401  (kept for schema registration)
    StakingRecord,
    User,
)
from ..worker import distribute_due, make_chain_sender, verify_pending

settings = get_settings()
WEI = Decimal(10) ** 18

# Minimal event ABIs — only what the indexer consumes.
STAKING_EVENTS = [
    {"name": "Staked", "action": "staked"},
    {"name": "Unstaked", "action": "unstaked"},
    {"name": "Claimed", "action": "claimed"},
]


def _w3() -> Web3:
    return Web3(Web3.HTTPProvider(settings.bsc_rpc_url))


def _get_or_create_user(db, address: str) -> User:
    address = address.lower()
    user = db.query(User).filter(User.wallet_address == address).first()
    if user is None:
        user = User(wallet_address=address)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def _already_seen(db, tx_hash: str, log_index: int) -> bool:
    return (
        db.query(EventLog)
        .filter(EventLog.tx_hash == tx_hash, EventLog.log_index == log_index)
        .first()
        is not None
    )


def _record_event(db, contract, name, log):
    db.add(
        EventLog(
            contract=contract.lower(),
            event_name=name,
            block_number=log["blockNumber"],
            tx_hash=log["transactionHash"].hex(),
            log_index=log["logIndex"],
            payload=json.dumps({k: str(v) for k, v in dict(log["args"]).items()}),
        )
    )


def handle_staking(db, w3, contract):
    addr = Web3.to_checksum_address(settings.staking_address)
    c = w3.eth.contract(address=addr, abi=contract)
    for spec in STAKING_EVENTS:
        event = getattr(c.events, spec["name"])
        for log in event.create_filter(from_block="latest").get_all_entries():
            tx = log["transactionHash"].hex()
            if _already_seen(db, tx, log["logIndex"]):
                continue
            user = _get_or_create_user(db, log["args"]["user"])
            amount_key = "amount" if "amount" in log["args"] else "reward"
            db.add(
                StakingRecord(
                    user_id=user.id,
                    action=spec["action"],
                    amount=Decimal(log["args"][amount_key]) / WEI,
                    tx_hash=tx,
                    block_number=log["blockNumber"],
                )
            )
            _record_event(db, settings.staking_address, spec["name"], log)
    db.commit()


def handle_presale(db, w3, contract):
    """Index Presale `Contributed` events → presale_contributions (the source of
    truth for verifying a referee's purchase)."""
    addr = Web3.to_checksum_address(settings.presale_address)
    c = w3.eth.contract(address=addr, abi=contract)
    for log in c.events.Contributed.create_filter(from_block="latest").get_all_entries():
        tx = log["transactionHash"].hex()
        if _already_seen(db, tx, log["logIndex"]):
            continue
        user = _get_or_create_user(db, log["args"]["buyer"])
        db.add(
            PresaleContribution(
                user_id=user.id,
                amount_bnb=Decimal(log["args"]["bnbIn"]) / WEI,
                tokens=Decimal(log["args"]["tokensOut"]) / WEI,
                tx_hash=tx,
                block_number=log["blockNumber"],
            )
        )
        _record_event(db, settings.presale_address, "Contributed", log)
    db.commit()


def run():
    init_db()
    w3 = _w3()
    if not settings.staking_address:
        print("[indexer] No contract addresses configured — set them in .env. Idling.")
    # Load ABIs produced by `hardhat compile` (artifacts) or the bundled app/abi/*.
    with open("app/abi/Staking.json") as f:
        staking_abi = json.load(f)
    with open("app/abi/Presale.json") as f:
        presale_abi = json.load(f)
    with open("app/abi/Referral.json") as f:
        referral_abi = json.load(f)

    send_payout = make_chain_sender(w3, referral_abi)  # None if no distributor key
    print(f"[indexer] Connected={w3.is_connected()} chain={settings.chain_id} "
          f"payouts={'on' if send_payout else 'off'}")

    while True:
        db = SessionLocal()
        try:
            if settings.staking_address:
                handle_staking(db, w3, staking_abi)
            if settings.presale_address:
                handle_presale(db, w3, presale_abi)
            # Referral automation: verify purchases, then push due payouts.
            verify_pending(db)
            if send_payout:
                distribute_due(db, send_payout)
        except Exception as e:  # keep the loop alive on transient RPC errors
            print(f"[indexer] error: {e}")
        finally:
            db.close()
        time.sleep(settings.indexer_poll_seconds)


if __name__ == "__main__":
    run()
