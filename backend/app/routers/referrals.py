"""Referral routes — submit a referral, track its automated reward, and aggregates."""
import re
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Referral
from ..schemas import ReferralClaimOut, ReferralOut, ReferralSubmit

router = APIRouter(prefix="/referrals", tags=["referrals"])

_ADDR = re.compile(r"^0x[a-fA-F0-9]{40}$")


# Declared before /{address} so these aren't captured as an address.
@router.post("/submit", response_model=ReferralClaimOut, status_code=201)
def submit_referral(body: ReferralSubmit, db: Session = Depends(get_db)):
    """Referrer submits the referee's wallet. The system then verifies the
    referee's on-chain purchase and auto-pays 10% after 30h (no signature needed)."""
    referrer = body.referrer.strip().lower()
    referee = body.referee.strip().lower()
    if not _ADDR.match(referrer) or not _ADDR.match(referee):
        raise HTTPException(status_code=400, detail="Invalid wallet address")
    if referrer == referee:
        raise HTTPException(status_code=400, detail="Addresses must differ")
    existing = db.query(Referral).filter(Referral.referee == referee).first()
    if existing is not None:
        raise HTTPException(status_code=409, detail="This referral was already submitted")
    claim = Referral(referrer=referrer, referee=referee, status="pending")
    db.add(claim)
    db.commit()
    db.refresh(claim)
    return claim


@router.get("/claim/{referee}", response_model=ReferralClaimOut)
def referral_claim(referee: str, db: Session = Depends(get_db)):
    """Status of the referral submitted for `referee` (pending/verified/paid)."""
    claim = db.query(Referral).filter(Referral.referee == referee.strip().lower()).first()
    if claim is None:
        raise HTTPException(status_code=404, detail="No referral submitted for this wallet")
    return claim


@router.get("/stats")
def referral_stats(db: Session = Depends(get_db)):
    """Protocol-wide referral aggregates."""
    total_referrals = db.query(func.count(Referral.id)).scalar()
    total_bonus = db.query(func.coalesce(func.sum(Referral.reward_amount), 0)).scalar()
    return {"total_referrals": total_referrals or 0, "total_bonus": Decimal(total_bonus)}


@router.get("/{address}", response_model=list[ReferralOut])
def referrals_by(address: str, db: Session = Depends(get_db)):
    """All referees invited by `address`."""
    return (
        db.query(Referral)
        .filter(Referral.referrer == address.lower())
        .order_by(Referral.created_at.desc())
        .all()
    )
