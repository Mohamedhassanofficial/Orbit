"""Pydantic request/response models."""
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class NonceResponse(BaseModel):
    address: str
    nonce: str
    message: str


class VerifyRequest(BaseModel):
    address: str
    signature: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    address: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    wallet_address: str
    referred_by: str | None
    created_at: datetime


class StakingRecordOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    action: str
    amount: Decimal
    tx_hash: str
    block_number: int
    created_at: datetime


class ReferralOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    referrer: str
    referee: str
    bonus_amount: Decimal
    paid: bool
    created_at: datetime


class ReferralSubmit(BaseModel):
    referrer: str
    referee: str


class ReferralClaimOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    referrer: str
    referee: str
    status: str
    purchased_amount: Decimal
    reward_amount: Decimal
    verified_at: datetime | None = None
    payout_at: datetime | None = None
    paid_at: datetime | None = None
    tx_hash: str | None = None
    created_at: datetime


class PresaleContributionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    amount_bnb: Decimal
    tokens: Decimal
    tx_hash: str
    created_at: datetime


class LeaderboardEntry(BaseModel):
    address: str
    total_staked: Decimal
    referrals: int
