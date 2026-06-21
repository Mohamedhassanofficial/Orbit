"""Wallet-signature authentication (Sign-In With Ethereum, nonce challenge)."""
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from eth_account import Account
from eth_account.messages import encode_defunct
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import get_settings

settings = get_settings()
_bearer = HTTPBearer(auto_error=True)


def new_nonce() -> str:
    return secrets.token_hex(16)


def sign_in_message(address: str, nonce: str) -> str:
    """The exact human-readable message the wallet is asked to sign."""
    return (
        "Welcome to ORBIT!\n\n"
        "Sign this message to authenticate.\n"
        f"Address: {address}\n"
        f"Nonce: {nonce}"
    )


def verify_signature(address: str, signature: str, nonce: str) -> bool:
    """Recover the signer from the message + signature and compare addresses."""
    message = encode_defunct(text=sign_in_message(address, nonce))
    try:
        recovered = Account.recover_message(message, signature=signature)
    except Exception:
        return False
    return recovered.lower() == address.lower()


def create_access_token(address: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": address.lower(), "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def get_current_address(
    creds: HTTPAuthorizationCredentials = Depends(_bearer),
) -> str:
    """FastAPI dependency: returns the authenticated wallet address from the JWT."""
    try:
        payload = jwt.decode(
            creds.credentials,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
        return payload["sub"]
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
