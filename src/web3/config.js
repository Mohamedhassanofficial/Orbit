// ORBIT Web3 configuration — BNB Smart Chain.
// Fill the contract addresses after deploying (see contracts/scripts/deploy.js),
// or inject them at build time via Vite env vars (VITE_*).

export const BSC_MAINNET = {
  chainId: 56,
  chainIdHex: "0x38",
  name: "BNB Smart Chain",
  rpcUrl: import.meta.env.VITE_BSC_RPC_URL || "https://bsc-dataseed.binance.org",
  explorer: "https://bscscan.com",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
};

export const CONTRACTS = {
  token: import.meta.env.VITE_TOKEN_ADDRESS || "",
  staking: import.meta.env.VITE_STAKING_ADDRESS || "",
  referral: import.meta.env.VITE_REFERRAL_ADDRESS || "",
  presale: import.meta.env.VITE_PRESALE_ADDRESS || "",
};

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// True only when contracts are configured at build time. When false the app
// keeps its built-in demo behavior (mock wallet/stake) so the landing page works
// out of the box without any deployment.
export const WEB3_ENABLED = Boolean(CONTRACTS.staking);

// Link to a transaction on BscScan.
export const bscTxUrl = (hash) => `${BSC_MAINNET.explorer}/tx/${hash}`;
