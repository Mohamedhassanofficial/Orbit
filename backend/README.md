# ORBIT Backend (FastAPI)

REST API + on-chain **indexer** + automated **referral-reward worker** for the ORBIT
(`$ORB`) dApp on BNB Smart Chain. Off-chain and indexed data live in **MySQL**.

## Architecture

Three roles share one codebase:

- **API** (`app/main.py`) — FastAPI REST endpoints + SIWE wallet auth (JWT).
- **Indexer** (`app/indexer/indexer.py`) — polls the chain, mirrors Staking and
  Presale events into MySQL, and on each cycle runs the referral jobs.
- **Worker** (`app/worker.py`) — `verify_pending` (confirm a referee's purchase, compute
  the 10% reward, schedule payout 30h out) and `distribute_due` (after 30h, sign and
  push `Referral.distribute(...)` with the distributor key).

## Setup

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # set DATABASE_URL, JWT_SECRET, contract addresses, …
```

Create the database (MySQL):

```sql
CREATE DATABASE orbit CHARACTER SET utf8mb4;
CREATE USER 'orbit'@'%' IDENTIFIED BY 'orbit';
GRANT ALL PRIVILEGES ON orbit.* TO 'orbit'@'%';
```

Tables are created on startup via `init_db()`; for a manual/fresh schema use
`db/init.sql`. **On schema upgrades** of an existing DB, apply the idempotent
`ALTER`s (the `referrals` table gained `status/purchased_amount/reward_amount/
verified_at/payout_at/paid_at`).

## Run with Docker (recommended)

From the **repo root** — boots MySQL + the API together:

```bash
cp .env.example .env                  # set JWT_SECRET, contract addresses, distributor key
docker compose up --build             # API → http://localhost:8000  (docs at /docs)
docker compose --profile indexer up   # also run the indexer + referral worker
```

MySQL data persists in the `db_data` volume; `backend/db/init.sql` runs on first boot;
the API waits for the DB healthcheck.

## Run locally (without Docker)

```bash
uvicorn app.main:app --reload --port 8000     # API → http://localhost:8000/docs
python -m app.indexer.indexer                 # indexer + referral worker (separate process)
```

The indexer/worker only act once the contract addresses are set in `.env`.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Liveness + chain id |
| GET | `/auth/nonce?address=` | Issue a SIWE nonce to sign |
| POST | `/auth/verify` | Verify the signature → JWT |
| GET | `/users/me` · `/users/{address}` | Current / lookup user |
| GET | `/staking/{address}` | A wallet's staking history |
| GET | `/staking/stats` | Total staked + distinct stakers |
| POST | `/referrals/submit` | Submit `{ referrer, referee }` (starts the pipeline) |
| GET | `/referrals/claim/{referee}` | Claim status: pending / verified / paid |
| GET | `/referrals/{referrer}` | Referees invited by an address |
| GET | `/referrals/stats` | Total referrals + bonuses |
| GET | `/presale/stats` · `/presale/{address}` | Presale totals / a wallet's contributions |
| GET | `/leaderboard` | Top stakers + referrers |

**Auth (Sign-In With Ethereum):** `GET /auth/nonce` → sign the returned message with the
wallet → `POST /auth/verify` → send the JWT as `Authorization: Bearer <token>`.

## Automated referral pipeline

Implements the project spec end to end — no manual review:

1. **Submit** — the referrer posts their wallet + the referral's wallet to
   `POST /referrals/submit` (no signature; just two addresses).
2. **Verify** — the indexer records the referral's **Presale** purchase on-chain; the
   worker confirms it and computes **10%** of the purchased `$ORB`.
3. **Schedule** — payout time is set to **+30 hours** (and no later than 3 days).
4. **Distribute** — once due, the worker signs `Referral.distribute(referrer, referee,
   amount)` with the **distributor** key and transfers the reward to the referrer.
5. **Done** — the claim is marked `paid` with the tx hash.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `mysql+pymysql://orbit:orbit@localhost:3306/orbit` | MySQL DSN |
| `JWT_SECRET` | — | Signs SIWE auth tokens |
| `BSC_RPC_URL` / `CHAIN_ID` | BSC mainnet / `56` | Chain RPC |
| `TOKEN_ADDRESS` / `STAKING_ADDRESS` / `REFERRAL_ADDRESS` / `PRESALE_ADDRESS` | — | Deployed contracts |
| `INDEXER_POLL_SECONDS` | `10` | Indexer/worker loop interval |
| `DISTRIBUTOR_PRIVATE_KEY` | — | Backend signer that pushes referral payouts |
| `REFERRAL_DELAY_HOURS` | `30` | Delay before crediting a reward |
| `REFERRAL_MAX_HOURS` | `72` | Upper bound (≤ 3 days) |
| `REFERRAL_REWARD_BPS` | `1000` | Reward rate (1000 = 10%) |
| `CORS_ORIGINS` | `http://localhost:5173` | Allowed frontend origins |

## Project structure

```
app/
  main.py            # FastAPI app + CORS + lifespan(init_db)
  config.py          # settings (pydantic-settings, .env)
  database.py        # engine, session, Base, init_db
  models.py          # SQLAlchemy models (MySQL schema)
  schemas.py         # Pydantic request/response models
  auth.py            # SIWE nonce + signature verify + JWT
  routers/           # auth, users, staking, referrals, presale, leaderboard
  indexer/indexer.py # event indexer + referral jobs loop
  worker.py          # verify_pending + distribute_due (+ chain sender)
  abi/               # Staking / Presale / Referral event+fn ABIs
db/init.sql          # MySQL schema
```

Tables: `users`, `wallets`, `staking_records`, `referrals`, `presale_contributions`,
`events_log`.

## Security

- **`DISTRIBUTOR_PRIVATE_KEY`** is a *hot key*. It must be set as the Referral
  contract's `distributor` (a scoped role, **not** the owner) and funded with BNB for
  gas; the Referral contract must hold `$ORB` (call `fund()`). It is **git-ignored** —
  never commit a real `.env`.
- Purchase verification uses on-chain Presale contributions; the chain is the source of
  truth, MySQL is a queryable mirror built by the indexer.
