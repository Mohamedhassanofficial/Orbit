"""ORBIT FastAPI application entrypoint."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import init_db
from .routers import (
    auth,
    leaderboard,
    presale,
    referrals,
    staking,
    users,
)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (use Alembic for real migrations in production).
    init_db()
    yield


app = FastAPI(
    title="ORBIT API",
    version="0.1.0",
    description="Backend for the ORBIT ($ORB) staking + referral dApp on BNB Smart Chain.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for r in (auth, users, staking, referrals, presale, leaderboard):
    app.include_router(r.router)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "chain_id": settings.chain_id}
