# ORBIT Smart Contracts (Solidity · BEP-20)

The on-chain layer of the ORBIT (`$ORB`) dApp on **BNB Smart Chain**, built with
Hardhat + OpenZeppelin.

## Contracts

| Contract | Purpose |
| --- | --- |
| `OrbitToken.sol` | `$ORB` **BEP-20**, fixed supply **100,000,000** (~90M treasury / ~10M float) |
| `Staking.sol` | Stake `$ORB` (30/90/180-day tiers), accrue + claim rewards |
| `Referral.sol` | Pays referrers **10%** (`bonusBps = 1000`); a scoped **distributor** role pushes automated payouts via `distribute(referrer, referee, amount)` |
| `Presale.sol` | Buy `$ORB` with BNB at a fixed rate; claim after the sale ends |

## Setup

```bash
cd contracts
npm install
cp .env.example .env        # PRIVATE_KEY, BSCSCAN_API_KEY, (optional) DISTRIBUTOR_ADDRESS
```

## Compile · test · deploy

```bash
npm run compile             # hardhat compile
npm test                    # hardhat tests (supply = 100M, distribute, onlyDistributor, staking)
npm run deploy:testnet      # deploy to BSC testnet (chainId 97)
npm run deploy:mainnet      # deploy to BSC mainnet (chainId 56)
```

`scripts/deploy.js` deploys Token → Staking → Referral → Presale, then sets the
Referral **distributor** to `DISTRIBUTOR_ADDRESS` (defaults to the deployer). Presale is
sized so tokens sold ≤ the ~10M public float (rate `100000` ORB/BNB × `hardCap` 100 BNB).

## Environment

| Variable | Purpose |
| --- | --- |
| `PRIVATE_KEY` | Deployer wallet (owner) — **never commit a real key** |
| `BSC_RPC_URL` / `BSC_TESTNET_RPC_URL` | Override the public RPC endpoints |
| `BSCSCAN_API_KEY` | Contract verification on BscScan |
| `DISTRIBUTOR_ADDRESS` | Address of the backend distributor (the `DISTRIBUTOR_PRIVATE_KEY` signer) |

## After deploying

1. **Distribute the supply** from the owner (holds all 100M): fund Presale (≤10M
   float), and seed the Referral + Staking reward pools (`fund()` / `transfer`). The
   remaining ~88–90M stays in the treasury.
2. **Fund the distributor** wallet with BNB for gas (it pushes referral payouts).
3. **Wire the addresses** into:
   - `backend/.env` → `TOKEN_ADDRESS`, `STAKING_ADDRESS`, `REFERRAL_ADDRESS`, `PRESALE_ADDRESS`.
   - Frontend env → `VITE_TOKEN_ADDRESS`, `VITE_STAKING_ADDRESS`, `VITE_REFERRAL_ADDRESS`,
     `VITE_PRESALE_ADDRESS` (without these the frontend stays in demo mode).

## Security

`Referral.distribute()` is restricted to the **distributor** role (settable by the
owner via `setDistributor`), so the backend hot key can push payouts without being the
contract owner. Contracts use OpenZeppelin `Ownable`, `SafeERC20`, and
`ReentrancyGuard`. Audit before mainnet use.
