"""Leaderboard — top stakers and referrers, aggregated from indexed data."""
from fastapi import APIRouter, Depends
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Referral, StakingRecord, User
from ..schemas import LeaderboardEntry

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("", response_model=list[LeaderboardEntry])
def leaderboard(limit: int = 20, db: Session = Depends(get_db)):
    # Net staked per user = staked - unstaked.
    signed = func.sum(
        case(
            (StakingRecord.action == "unstaked", -StakingRecord.amount),
            else_=case((StakingRecord.action == "staked", StakingRecord.amount), else_=0),
        )
    )
    rows = (
        db.query(User.wallet_address.label("address"), signed.label("total_staked"))
        .join(StakingRecord, StakingRecord.user_id == User.id)
        .group_by(User.id)
        .order_by(signed.desc())
        .limit(limit)
        .all()
    )

    out: list[LeaderboardEntry] = []
    for r in rows:
        ref_count = (
            db.query(func.count(Referral.id))
            .filter(Referral.referrer == r.address)
            .scalar()
        )
        out.append(
            LeaderboardEntry(
                address=r.address,
                total_staked=r.total_staked or 0,
                referrals=ref_count or 0,
            )
        )
    return out
