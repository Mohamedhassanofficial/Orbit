"""Presale routes — contributions and aggregate totals."""
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import PresaleContribution, User
from ..schemas import PresaleContributionOut

router = APIRouter(prefix="/presale", tags=["presale"])


@router.get("/stats")
def presale_stats(db: Session = Depends(get_db)):
    total_bnb = db.query(func.coalesce(func.sum(PresaleContribution.amount_bnb), 0)).scalar()
    total_tokens = db.query(func.coalesce(func.sum(PresaleContribution.tokens), 0)).scalar()
    contributors = db.query(func.count(func.distinct(PresaleContribution.user_id))).scalar()
    return {
        "total_bnb": Decimal(total_bnb),
        "total_tokens": Decimal(total_tokens),
        "contributors": contributors,
    }


@router.get("/{address}", response_model=list[PresaleContributionOut])
def contributions(address: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.wallet_address == address.lower()).first()
    if user is None:
        return []
    return (
        db.query(PresaleContribution)
        .filter(PresaleContribution.user_id == user.id)
        .order_by(PresaleContribution.block_number.desc())
        .all()
    )
