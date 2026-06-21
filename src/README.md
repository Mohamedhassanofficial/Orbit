# ORBIT Frontend (`src/`)

React 18 + Vite single-page dApp for ORBIT (`$ORB`) on BNB Smart Chain. Entry:
`main.jsx` → `App.jsx`. Run from the **repo root** (`npm run dev` / `npm run build`).

## Structure

```
src/
  main.jsx           # React entry — mounts <App/>
  App.jsx            # all state, derived values, demo/real wiring, section layout
  i18n.js            # 8-language dictionaries + helpers (detect / persist / fill)
  styles.css         # global resets + keyframe animations
  components/        # UI sections + helpers
  web3/              # wallet, contract reads/writes, backend API client
```

## State & data flow

`App.jsx` is the single source of truth. It holds UI state (language, form inputs,
tx/claim status), computes derived view-models (`vals`, `presaleVals`, `liveStats`),
and passes them down as props. Two modes, gated by **`WEB3_ENABLED`**
(`src/web3/config.js`, true only when contract addresses are set):

- **Demo** (default): mock wallet address, forms show success states, dashboard/stat
  cards show representative numbers. Works with no deployment.
- **Real**: `useWallet` connects an injected wallet; `useOrbitData` reads live
  balances/positions from chain + backend; stake/buy/claim send real transactions.

## Components

| Component | Renders |
| --- | --- |
| `Nav` | Logo, links (incl. `#dashboard`), language switcher, Connect Wallet |
| `Hero` | Headline, CTAs, animated orbit rings, top stats |
| `Dashboard` | Connect-gated: balances, stake + claim, referrals, presale + claim, activity |
| `PriceGoal` | "Escape velocity" meter toward $1 / $5 |
| `HowItWorks` | 5-step referral flow |
| `ReferralForm` | Two-wallet submit → backend referral pipeline (read-only, no signature) |
| `Staking` | Amount + tiers + live estimate; success/pending/tx states |
| `Presale` | Buy with BNB (BNB logo), live stats, claim |
| `PledgeRules` · `Tokenomics` | Staking rules · supply breakdown |
| `Footer` | Logo, BNB/Telegram/X marks, contract, disclaimer |
| Helpers | `Background`, `Logo`, `Interactive` (hover/focus), `BnbLogo`/`TelegramLogo`/`XLogo` |

## Web3 layer (`src/web3/`)

| File | Role |
| --- | --- |
| `config.js` | `CONTRACTS`, `WEB3_ENABLED`, `API_BASE`, `BSC_MAINNET`, `bscTxUrl` |
| `abis.js` | Human-readable ABIs (ERC20, Staking, Referral, Presale) |
| `useWallet.js` | Connect (MetaMask/Trust), ensure BSC, SIWE auth, silent auto-reconnect |
| `useOrbit.js` | Write actions (`stakeOrb`, `buyPresale`, `claimRewards`) + pending/tx/error |
| `useOrbitData.js` | Live account + protocol data (on-chain reads + backend), demo fallback |
| `reads.js` | Read helpers: balances, stake position, referral, presale, token supply |
| `orbit.js` | Contract write calls + `api` client (`submitReferral`, `referralClaim`, stats, history) |

## Internationalization (`i18n.js`)

8 languages — English, 中文, العربية (RTL), Español, Français, Tiếng Việt, اردو (RTL),
Hausa. `getInitialLang()` restores a saved choice (`localStorage`) else auto-detects;
`persistLang()` saves the manual pick; `RTL_LANGS` flips direction; `App.jsx` merges
`{ ...TR.en, ...TR[lang] }` so any missing key falls back to English.

**Add a language:** add a block to `TR`, an entry to `langOptions`, and a case in
`detectLang()` (and `RTL_LANGS` if RTL). **Add a string:** add the key to **every**
language block to keep parity (all blocks currently have an identical key set).

## Demo vs real mode (env)

Set these (e.g. in a root `.env` consumed by Vite) to switch on real on-chain behavior:

```
VITE_TOKEN_ADDRESS=…
VITE_STAKING_ADDRESS=…
VITE_REFERRAL_ADDRESS=…
VITE_PRESALE_ADDRESS=…
VITE_API_BASE=http://localhost:8000     # backend
VITE_BSC_RPC_URL=https://bsc-dataseed.binance.org
```

Without the contract addresses the app stays in demo mode.

## Styling

Faithful **inline styles** ported from the original design; the `Interactive` helper
adds `:hover`/`:focus` (inline styles can't, and CSS classes can't override inline).
Global resets and the four keyframe animations (`orbSpin`, `orbSpinRev`, `auroraDrift`,
`floaty`) live in `styles.css`.
