// Contract helpers + backend API client for the ORBIT dApp.
import { BrowserProvider, Contract, parseEther, parseUnits } from "ethers";
import { API_BASE, CONTRACTS } from "./config";
import { ERC20_ABI, PRESALE_ABI, REFERRAL_ABI, STAKING_ABI } from "./abis";

async function getSigner() {
  const provider = new BrowserProvider(window.ethereum);
  return provider.getSigner();
}

// --- Staking ---
export async function stake(amountOrb) {
  const signer = await getSigner();
  const amount = parseUnits(String(amountOrb), 18);
  const token = new Contract(CONTRACTS.token, ERC20_ABI, signer);
  const approveTx = await token.approve(CONTRACTS.staking, amount);
  await approveTx.wait();
  const staking = new Contract(CONTRACTS.staking, STAKING_ABI, signer);
  return (await staking.stake(amount)).wait();
}

export async function claimRewards() {
  const signer = await getSigner();
  const staking = new Contract(CONTRACTS.staking, STAKING_ABI, signer);
  return (await staking.claim()).wait();
}

// --- Referral ---
export async function setReferrer(referrer) {
  const signer = await getSigner();
  const referral = new Contract(CONTRACTS.referral, REFERRAL_ABI, signer);
  return (await referral.setReferrer(referrer)).wait();
}

// --- Presale ---
export async function buyPresale(bnbAmount) {
  const signer = await getSigner();
  const presale = new Contract(CONTRACTS.presale, PRESALE_ABI, signer);
  return (await presale.buy({ value: parseEther(String(bnbAmount)) })).wait();
}

export async function claimPresale() {
  const signer = await getSigner();
  const presale = new Contract(CONTRACTS.presale, PRESALE_ABI, signer);
  return (await presale.claim()).wait();
}

// --- Backend API (read models from MySQL via FastAPI) ---
// Each call is guarded: a down backend resolves to null instead of throwing,
// so the UI can fall back to placeholders.
const get = (path) =>
  fetch(`${API_BASE}${path}`)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

const post = (path, body) =>
  fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

export const api = {
  stakingHistory: (addr) => get(`/staking/${addr}`),
  referrals: (addr) => get(`/referrals/${addr}`),
  presaleStats: () => get(`/presale/stats`),
  leaderboard: () => get(`/leaderboard`),
  stakingStats: () => get(`/staking/stats`),
  referralStats: () => get(`/referrals/stats`),
  // Referral reward pipeline (no wallet signature — just two addresses).
  submitReferral: (referrer, referee) => post(`/referrals/submit`, { referrer, referee }),
  referralClaim: (referee) => get(`/referrals/claim/${referee}`),
};
