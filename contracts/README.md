# ORBIT Smart Contracts (Solidity · BEP-20)

The on-chain layer of the ORBIT (`$ORB`) dApp on **BNB Smart Chain**, built with
Hardhat + OpenZeppelin (`Ownable`, `SafeERC20`, `ReentrancyGuard`). Solidity `0.8.24`.

## Contracts

| Contract | Purpose |
| --- | --- |
| `OrbitToken.sol` | `$ORB` **BEP-20**, fixed supply **100,000,000** (~90M treasury / ~10M float) |
| `Staking.sol` | Stake `$ORB`, accrue linear rewards from a funded pool, claim |
| `Referral.sol` | Pays referrers **10%**; a scoped **distributor** role pushes automated payouts |
| `Presale.sol` | Buy `$ORB` with BNB at a fixed rate; claim after the sale ends |

## Contract API

### OrbitToken (ERC20)
- Name/symbol **ORBIT / ORB**, 18 decimals; `MAX_SUPPLY = 100_000_000e18`.
- Constructor mints the **entire supply to the owner**, who distributes to the
  presale / reward pools / treasury. Standard ERC20 (`transfer`, `approve`,
  `balanceOf`, `allowance`, `totalSupply`).

### Staking
- **Writes:** `stake(amount)`, `unstake(amount)`, `claim()`.
- **Reads:** `pendingRewards(address)`, `stakes(address) → (amount, rewardDebt,
  lastUpdate)`, `totalStaked()`, `aprBps()`.
- **Owner:** `setApr(newAprBps)`, `fund(amount)` (seed the reward pool).
- **Events:** `Staked`, `Unstaked`, `Claimed`, `AprUpdated`.
- Rewards accrue linearly: `amount × aprBps × elapsed / (10_000 × 365d)`.
- ⚠️ The contract uses a **single APR** (`aprBps`, default `1200` = **12%**). The
  frontend's 30 / 90 / 180-day tiers (12% / 28% / 60%) are an **illustrative UX
  estimate** — true per-tier lock terms would require a contract change.

### Referral
- **Writes:** `setReferrer(referrer)` (legacy on-chain binding),
  `distribute(referrer, referee, amount)` — **onlyDistributor**, transfers the reward.
- **Owner:** `setDistributor(address)`, `setBonus(bps)`, `payBonus(referee, base)`,
  `fund(amount)`.
- **Reads:** `bonusBps()` (= `1000`, **10%**), `referrerOf`, `referralCount`, `earned`,
  `distributor`.
- **Events:** `Referred`, `ReferralPaid`, `RewardDistributed`, `BonusUpdated`,
  `DistributorUpdated`.
- The backend computes 10% of the referee's verified purchase off-chain and calls
  `distribute(...)` after the 30-hour delay (see `backend/README.md`).

### Presale
- **Writes:** `buy()` / `receive()` (send BNB while open), `claim()` (after `endTime`).
- **Reads:** `rate()` (ORB per BNB), `hardCap()`, `totalRaised()`, `startTime()`,
  `endTime()`, `contributedBnb(address)`, `tokensOwed(address)`.
- **Owner:** `withdrawBnb(to)`, `withdrawUnsold(to)` (after end).
- **Events:** `Contributed(buyer, bnbIn, tokensOut)` (indexed by the backend), `Claimed`.

## Networks (`hardhat.config.js`)

| Network | chainId | RPC (override via env) |
| --- | --- | --- |
| `bsc` (mainnet) | 56 | `BSC_RPC_URL` |
| `bscTestnet` | 97 | `BSC_TESTNET_RPC_URL` |

## Setup

```bash
cd contracts
npm install
cp .env.example .env        # PRIVATE_KEY, BSCSCAN_API_KEY, (optional) DISTRIBUTOR_ADDRESS
```

| Variable | Purpose |
| --- | --- |
| `PRIVATE_KEY` | Deployer wallet (owner) — **never commit a real key** |
| `BSC_RPC_URL` / `BSC_TESTNET_RPC_URL` | Override the public RPC endpoints |
| `BSCSCAN_API_KEY` | Contract verification on BscScan |
| `DISTRIBUTOR_ADDRESS` | Backend distributor (the `DISTRIBUTOR_PRIVATE_KEY` signer) |

## Compile · test · deploy

```bash
npm run compile             # hardhat compile
npm test                    # supply = 100M, distribute, onlyDistributor, staking
npm run deploy:testnet      # BSC testnet (97)
npm run deploy:mainnet      # BSC mainnet (56)
```

Verify on BscScan:

```bash
npx hardhat verify --network bsc <TOKEN_ADDRESS> <ownerAddress>
npx hardhat verify --network bsc <PRESALE_ADDRESS> <token> <owner> <rate> <start> <end> <hardCap>
```

## Deploy flow (`scripts/deploy.js`)

1. Deploys **Token → Staking → Referral → Presale** (all owned by the deployer).
2. Calls `referral.setDistributor(DISTRIBUTOR_ADDRESS)` (defaults to the deployer).
3. Sizes the presale to the **~10M float**: `rate = 100000` ORB/BNB ×
   `hardCap = 100 BNB` → 10,000,000 ORB max sold.

### After deploying

1. **Distribute the supply** from the owner (holds all 100M): fund Presale (≤10M),
   seed the Referral + Staking reward pools (`fund()` / `transfer`); the remaining
   ~88–90M stays in the treasury.
2. **Fund the distributor** wallet with BNB for gas (it pushes referral payouts).
3. **Wire the addresses** into `backend/.env` (`TOKEN/STAKING/REFERRAL/PRESALE_ADDRESS`)
   and the frontend (`VITE_TOKEN_ADDRESS`, `VITE_STAKING_ADDRESS`,
   `VITE_REFERRAL_ADDRESS`, `VITE_PRESALE_ADDRESS`). Without them the frontend stays in
   demo mode.

## Token economics

- **100,000,000** `$ORB` total — fixed, no further mint.
- **~90M** treasury / market operations (core team).
- **~10M** public float (presale + circulating).
- Holder targets: **$1 → $5** (aspirational).

## Security

- `distribute()` is restricted to the **distributor** role (settable by the owner),
  so the backend hot key can push payouts **without** being the contract owner —
  limiting blast radius if the key leaks.
- Uses OpenZeppelin `Ownable`, `SafeERC20`, `ReentrancyGuard`.
- **Audit before mainnet.** Reward/staking pools must be funded or `claim`/`distribute`
  will revert. Never commit a real `.env` / private key.
