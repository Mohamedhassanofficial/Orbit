# ORBIT · $ORB

**A referral + staking dApp on BNB Smart Chain.** Invite a wallet to buy `$ORB`; the
system verifies the purchase on-chain and automatically pays the referrer **10%** of
what their referral bought — **~30 hours** after confirmation (no later than 3 days),
with **no manual review**. No sign-up: your wallet is your identity.

> **عربي:** منصّة إحالة ورهن (staking) على شبكة BNB. تُرسل عنوان من أحَلته، فيتحقق النظام من
> شرائه على السلسلة ويدفع لك تلقائيًا **10%** من مشترياته بعد **30 ساعة** — بلا تسجيل وبلا
> مراجعة يدوية. يدعم **8 لغات** مع اتجاه RTL للعربية والأردية.

![ORBIT architecture](docs/orbit-architecture.png)

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for the full design and a Mermaid diagram.

---

## Features

- **Automated referral rewards** — submit two wallets → on-chain verification → 10%
  reward, credited automatically ~30h after confirmation (≤ 3 days). No registration,
  no signatures to submit.
- **Staking** — lock `$ORB` across 30 / 90 / 180-day tiers (12% / 28% / 60% APR) to
  earn rewards and shrink the circulating float.
- **Presale** — buy `$ORB` with BNB at a fixed rate; claim after the sale ends.
- **Live dashboard** — connect a wallet to see your balances, staking position +
  pending rewards (claim), referral earnings, and presale allocation — read live from
  the chain and the backend.
- **8 languages** with auto-detection + a manual switcher (remembered across reloads):
  English, 中文, العربية (RTL), Español, Français, Tiếng Việt, اردو (RTL), Hausa.
- **Demo mode** — runs out of the box without any deployment (mock data); switches to
  real on-chain behavior once contract addresses are configured.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + Vite, `ethers` v6, wallet connect (MetaMask / Trust) |
| Backend | Python · **FastAPI**, SQLAlchemy, SIWE wallet auth (JWT) |
| Indexer / worker | **web3.py** — indexes events + runs the referral payout pipeline |
| Database | **MySQL** |
| Smart contracts | **Solidity** (BEP-20) — Token, Staking, Referral, Presale — Hardhat |
| Blockchain | **BNB Smart Chain** + BscScan |
| Infra | Docker Compose (MySQL + API + optional indexer) |

## Repository layout

```
.
├── src/                  # React + Vite frontend
│   ├── components/        # UI sections (Nav, Hero, Staking, Presale, Dashboard, …)
│   ├── web3/              # ethers config, reads, hooks, backend API client
│   └── i18n.js            # 8-language dictionaries
├── backend/              # FastAPI service
│   └── app/
│       ├── routers/       # auth, users, staking, referrals, presale, leaderboard
│       ├── indexer/       # on-chain event indexer
│       ├── worker.py      # referral verify + 30h-delayed payout
│       └── models.py      # MySQL schema (SQLAlchemy)
├── contracts/           # Solidity (OrbitToken, Staking, Referral, Presale) + Hardhat
├── docs/                # architecture diagram
├── docker-compose.yml   # MySQL + API (+ indexer profile)
└── ARCHITECTURE.md
```

## Getting started

### 1. Frontend
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

### 2. Backend + database (Docker)
```bash
cp .env.example .env                     # set JWT_SECRET, contract addresses, etc.
docker compose up --build                # MySQL + API → http://localhost:8000/docs
docker compose --profile indexer up      # also run the indexer + referral worker
```

### 3. Smart contracts
```bash
cd contracts
npm install
cp .env.example .env                      # PRIVATE_KEY, BSCSCAN_API_KEY
npm run deploy:testnet                    # or deploy:mainnet
```
Then put the deployed addresses into `backend/.env` and the frontend env
(`VITE_TOKEN_ADDRESS`, `VITE_STAKING_ADDRESS`, `VITE_REFERRAL_ADDRESS`,
`VITE_PRESALE_ADDRESS`). Without them the app stays in demo mode.

## How the referral reward works

1. **Submit** — the referrer submits their wallet + the referral's wallet
   (`POST /referrals/submit`). No signature required.
2. **Verify** — the indexer records the referral's Presale purchase on-chain; the
   worker confirms it and computes **10%** of the purchased `$ORB`.
3. **Schedule** — payout is scheduled for **30 hours** after confirmation (and no
   later than 3 days).
4. **Distribute** — once due, the backend **distributor** signs and pushes
   `Referral.distribute(...)`, transferring the reward to the referrer's wallet.
5. **Done** — fully automatic, open and verifiable; no manual review.

## Token economics

- **Total supply:** 100,000,000 `$ORB` (fixed, BEP-20).
- **~90,000,000** held by the core team (treasury / market operations).
- **~10,000,000** public float (sold via presale + circulating).
- **Price targets:** $1 → $5 (aspirational milestones for holders).

## Configuration & security

Key env vars (see `.env.example`, `backend/.env.example`, `contracts/.env.example`):
`DATABASE_URL`, `JWT_SECRET`, `BSC_RPC_URL`, the four contract addresses, and the
referral pipeline settings.

⚠️ **`DISTRIBUTOR_PRIVATE_KEY`** is a hot key used by the backend to push referral
payouts. It is a *scoped distributor role* (not the contract owner), must be funded
with BNB for gas, and is **git-ignored** — never commit a real `.env`.

## Disclaimer

`$ORB` is a utility token on BNB Smart Chain. Referral and staking rewards are executed
automatically by on-chain logic; price targets are aspirational, not promises.
Cryptocurrency carries risk — nothing here is financial advice. Always verify the
official contract address before transacting.
