// Contract READ layer — live on-chain reads that work with or without a wallet.
// Every function is wrapped so a failure (no deployment / RPC down) returns null,
// letting callers fall back to placeholder values.
import { BrowserProvider, Contract, JsonRpcProvider, formatEther, formatUnits } from "ethers";
import { BSC_MAINNET, CONTRACTS } from "./config";
import { ERC20_ABI, PRESALE_ABI, REFERRAL_ABI, STAKING_ABI } from "./abis";

// Use the injected wallet provider when present (faster, same node as the user);
// otherwise a plain JSON-RPC provider so protocol-wide reads work pre-connect.
function reader() {
  if (typeof window !== "undefined" && window.ethereum) {
    return new BrowserProvider(window.ethereum);
  }
  return new JsonRpcProvider(BSC_MAINNET.rpcUrl);
}

const num = (v, decimals = 18) => Number(formatUnits(v, decimals));

async function safe(fn) {
  try {
    return await fn();
  } catch {
    return null;
  }
}

/** ORB token balance + native BNB balance for an address. */
export function getBalances(address) {
  return safe(async () => {
    const p = reader();
    const token = new Contract(CONTRACTS.token, ERC20_ABI, p);
    const [orb, bnb] = await Promise.all([token.balanceOf(address), p.getBalance(address)]);
    return { orb: num(orb), bnb: Number(formatEther(bnb)) };
  });
}

/** A user's staking position + protocol-wide staking figures. */
export function getStakePosition(address) {
  return safe(async () => {
    const staking = new Contract(CONTRACTS.staking, STAKING_ABI, reader());
    const [s, pending, total, aprBps] = await Promise.all([
      staking.stakes(address),
      staking.pendingRewards(address),
      staking.totalStaked(),
      staking.aprBps(),
    ]);
    return {
      staked: num(s.amount),
      pending: num(pending),
      totalStaked: num(total),
      aprPct: Number(aprBps) / 100,
    };
  });
}

/** A user's referral count + earned bonus. */
export function getReferralInfo(address) {
  return safe(async () => {
    const referral = new Contract(CONTRACTS.referral, REFERRAL_ABI, reader());
    const [count, earned, bonusBps] = await Promise.all([
      referral.referralCount(address),
      referral.earned(address),
      referral.bonusBps(),
    ]);
    return { count: Number(count), earned: num(earned), bonusPct: Number(bonusBps) / 100 };
  });
}

/** Presale params + a user's contribution/allocation. */
export function getPresaleInfo(address) {
  return safe(async () => {
    const presale = new Contract(CONTRACTS.presale, PRESALE_ABI, reader());
    const [rate, raised, cap, owed] = await Promise.all([
      presale.rate(),
      presale.totalRaised(),
      presale.hardCap(),
      address ? presale.tokensOwed(address) : Promise.resolve(0n),
    ]);
    return {
      rate: Number(rate),
      totalRaised: Number(formatEther(raised)),
      hardCap: Number(formatEther(cap)),
      tokensOwed: num(owed),
    };
  });
}

/** Token-wide info (total supply). */
export function getTokenInfo() {
  return safe(async () => {
    const token = new Contract(CONTRACTS.token, ERC20_ABI, reader());
    const total = await token.totalSupply();
    return { totalSupply: num(total) };
  });
}
