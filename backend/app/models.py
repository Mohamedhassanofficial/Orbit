"""ORM models — mirror of the MySQL schema (see db/init.sql)."""
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    wallet_address: Mapped[str] = mapped_column(String(42), unique=True, index=True)
    nonce: Mapped[str] = mapped_column(String(64), default="")
    referred_by: Mapped[str | None] = mapped_column(String(42), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    stakes: Mapped[list["StakingRecord"]] = relationship(back_populates="user")
    contributions: Mapped[list["PresaleContribution"]] = relationship(
        back_populates="user"
    )


class StakingRecord(Base):
    __tablename__ = "staking_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    action: Mapped[str] = mapped_column(String(16))  # staked | unstaked | claimed
    amount: Mapped[float] = mapped_column(Numeric(38, 18))
    tx_hash: Mapped[str] = mapped_column(String(66), unique=True)
    block_number: Mapped[int] = mapped_column(BigInteger)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped[User] = relationship(back_populates="stakes")


class Referral(Base):
    """A referral-reward claim: referrer submits a referee, the system verifies the
    referee's on-chain purchase, then auto-pays 10% to the referrer after 30h."""

    __tablename__ = "referrals"

    id: Mapped[int] = mapped_column(primary_key=True)
    referrer: Mapped[str] = mapped_column(String(42), index=True)
    referee: Mapped[str] = mapped_column(String(42), unique=True, index=True)
    # pending → verified → paid  (or rejected)
    status: Mapped[str] = mapped_column(String(16), default="pending", index=True)
    purchased_amount: Mapped[float] = mapped_column(Numeric(38, 18), default=0)
    reward_amount: Mapped[float] = mapped_column(Numeric(38, 18), default=0)
    bonus_amount: Mapped[float] = mapped_column(Numeric(38, 18), default=0)  # legacy alias
    paid: Mapped[bool] = mapped_column(Boolean, default=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    payout_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    tx_hash: Mapped[str | None] = mapped_column(String(66), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class PresaleContribution(Base):
    __tablename__ = "presale_contributions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    amount_bnb: Mapped[float] = mapped_column(Numeric(38, 18))
    tokens: Mapped[float] = mapped_column(Numeric(38, 18))
    tx_hash: Mapped[str] = mapped_column(String(66), unique=True)
    block_number: Mapped[int] = mapped_column(BigInteger)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped[User] = relationship(back_populates="contributions")


class EventLog(Base):
    """Raw indexer cursor + audit trail of processed on-chain events."""

    __tablename__ = "events_log"

    id: Mapped[int] = mapped_column(primary_key=True)
    contract: Mapped[str] = mapped_column(String(42), index=True)
    event_name: Mapped[str] = mapped_column(String(64))
    block_number: Mapped[int] = mapped_column(BigInteger, index=True)
    tx_hash: Mapped[str] = mapped_column(String(66))
    log_index: Mapped[int] = mapped_column(BigInteger)
    payload: Mapped[str] = mapped_column(String(2048))  # JSON string
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
