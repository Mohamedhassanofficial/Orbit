"""Application settings, loaded from environment / .env (see .env.example)."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    database_url: str = "mysql+pymysql://orbit:orbit@localhost:3306/orbit"

    # Auth
    jwt_secret: str = "change-me"
    jwt_expire_minutes: int = 10080  # 7 days
    jwt_algorithm: str = "HS256"

    # Blockchain
    bsc_rpc_url: str = "https://bsc-dataseed.binance.org"
    chain_id: int = 56
    token_address: str = ""
    staking_address: str = ""
    referral_address: str = ""
    presale_address: str = ""
    indexer_start_block: int = 0
    indexer_poll_seconds: int = 10

    # Referral reward automation (Zhang's spec)
    distributor_private_key: str = ""   # backend signer that pushes payouts
    referral_delay_hours: int = 30      # credit 30h after confirmation
    referral_max_hours: int = 72        # …no later than 3 days
    referral_reward_bps: int = 1000     # 10% of the referee's purchase

    # CORS
    cors_origins: str = "http://localhost:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
