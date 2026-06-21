# ORBIT Backend (FastAPI)

REST API + on-chain event indexer for the ORBIT ($ORB) dApp on BNB Smart Chain.
Stores off-chain + indexed data in **MySQL**.

## Setup
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # then edit DATABASE_URL, contract addresses, etc.
```

Create the database (MySQL):
```sql
CREATE DATABASE orbit CHARACTER SET utf8mb4;
CREATE USER 'orbit'@'%' IDENTIFIED BY 'orbit';
GRANT ALL PRIVILEGES ON orbit.* TO 'orbit'@'%';
```
Tables are created automatically on startup (`init_db()`), or run `db/init.sql`.

## Run with Docker (recommended)
From the **repo root** — boots MySQL + the API together, one command:
```bash
cp .env.example .env          # optional: set JWT_SECRET, contract addresses
docker compose up --build     # API → http://localhost:8000  (docs at /docs)
docker compose --profile indexer up   # also start the on-chain indexer
```
MySQL data persists in the `db_data` volume; `backend/db/init.sql` runs on first
boot. The API waits for the DB healthcheck before starting.

## Run locally (without Docker)
```bash
uvicorn app.main:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

Run the indexer in a separate process (after contracts are deployed and addresses
are set in `.env`):
```bash
python -m app.indexer.indexer
```

## Endpoints
| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Liveness + chain id |
| GET | `/auth/nonce?address=` | Issue SIWE nonce to sign |
| POST | `/auth/verify` | Verify signature → JWT |
| GET | `/users/me` | Current user (Bearer token) |
| GET | `/staking/{address}` | Staking history |
| GET | `/referrals/{address}` | Referees + bonuses |
| GET | `/presale/stats` · `/presale/{address}` | Presale totals / contributions |
| GET | `/leaderboard` | Top stakers + referrers |

Auth uses **Sign-In With Ethereum**: GET a nonce, sign the returned message with
the wallet, POST the signature to `/auth/verify`, then send the JWT as
`Authorization: Bearer <token>`.
