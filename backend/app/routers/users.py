"""User profile routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..auth import get_current_address
from ..database import get_db
from ..models import User
from ..schemas import UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def me(address: str = Depends(get_current_address), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.wallet_address == address).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{address}", response_model=UserOut)
def get_user(address: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.wallet_address == address.lower()).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
