"""Auth routes: nonce challenge + signature verification → JWT."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import auth as auth_lib
from ..database import get_db
from ..models import User
from ..schemas import NonceResponse, TokenResponse, VerifyRequest

router = APIRouter(prefix="/auth", tags=["auth"])


def _get_or_create_user(db: Session, address: str) -> User:
    address = address.lower()
    user = db.query(User).filter(User.wallet_address == address).first()
    if user is None:
        user = User(wallet_address=address, nonce=auth_lib.new_nonce())
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@router.get("/nonce", response_model=NonceResponse)
def get_nonce(address: str, db: Session = Depends(get_db)):
    """Issue a fresh nonce for `address`; the wallet signs the returned message."""
    user = _get_or_create_user(db, address)
    user.nonce = auth_lib.new_nonce()
    db.commit()
    return NonceResponse(
        address=user.wallet_address,
        nonce=user.nonce,
        message=auth_lib.sign_in_message(user.wallet_address, user.nonce),
    )


@router.post("/verify", response_model=TokenResponse)
def verify(body: VerifyRequest, db: Session = Depends(get_db)):
    """Verify the signed nonce and return a JWT. Rotates the nonce on success."""
    user = db.query(User).filter(User.wallet_address == body.address.lower()).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Request a nonce first")
    if not auth_lib.verify_signature(user.wallet_address, body.signature, user.nonce):
        raise HTTPException(status_code=401, detail="Signature verification failed")
    # Rotate nonce so the signature can't be replayed.
    user.nonce = auth_lib.new_nonce()
    db.commit()
    token = auth_lib.create_access_token(user.wallet_address)
    return TokenResponse(access_token=token, address=user.wallet_address)
