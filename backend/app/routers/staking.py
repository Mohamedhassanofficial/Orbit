"""Staking history + aggregate stats (data is populated by the on-chain indexer)."""
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import StakingRecord, User
from ..schemas import StakingRecordOut

router = APIRouter(prefix="/staking", tags=["staking"])


# Declared before /{address} so "stats" isn't captured as an address.
@router.get("/stats")
def staking_stats(db: Session = Depends(get_db)):
    """Protocol-wide staking aggregates: net staked + distinct staker count."""
    net = func.sum(
        case(
            (StakingRecord.action == "unstaked", -StakingRecord.amount),
            (StakingRecord.action == "staked", StakingRecord.amount),
            else_=0,
        )
    )
    total_staked = db.query(func.coalesce(net, 0)).scalar()
    stakers = db.query(func.count(func.distinct(StakingRecord.user_id))).scalar()
    return {"total_staked": Decimal(total_staked), "stakers": stakers or 0}


@router.get("/{address}", response_model=list[StakingRecordOut])
def staking_history(address: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.wallet_address == address.lower()).first()
    if user is None:
        return []
    return (
        db.query(StakingRecord)
        .filter(StakingRecord.user_id == user.id)
        .order_by(StakingRecord.block_number.desc())
        .all()
    )
