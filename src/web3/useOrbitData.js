// Aggregates live dApp data for an address: on-chain reads + backend API,
// loaded in parallel. Falls back to a demo snapshot when Web3 is not configured,
// and degrades gracefully (nulls) when individual sources fail.
import { useCallback, useEffect, useState } from "react";
import { WEB3_ENABLED } from "./config";
import { api } from "./orbit";
import {
  getBalances,
  getPresaleInfo,
  getReferralInfo,
  getStakePosition,
  getTokenInfo,
} from "./reads";

// Representative values shown in demo mode (mirror the original placeholders).
const DEMO = {
  balances: { orb: 12500, bnb: 1.84 },
  stake: { staked: 3420, pending: 64.2, totalStaked: 3_420_000, aprPct: 60 },
  referral: { count: 7, earned: 318.5, bonusPct: 5 },
  presale: { rate: 100000, totalRaised: 182.5, hardCap: 500, tokensOwed: 250000 },
  token: { totalSupply: 100_000_000 },
  protocolStats: { stakers: 4820, totalReferrals: 1290, presaleContributors: 612 },
  history: [
    { action: "staked", amount: 1000, tx_hash: "0xdemo1", created_at: "2025-06-01T10:00:00Z" },
    { action: "claimed", amount: 42.5, tx_hash: "0xdemo2", created_at: "2025-06-10T12:00:00Z" },
  ],
  leaderboard: [],
};

const empty = {
  balances: null, stake: null, referral: null, presale: null, token: null,
  protocolStats: null, history: [], leaderboard: [],
};

export function useOrbitData(address) {
  const [data, setData] = useState(WEB3_ENABLED ? empty : DEMO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!WEB3_ENABLED) {
      setData(DEMO);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [
        balances, stake, referral, presale, token,
        history, leaderboard, presaleStats, stakingStats, referralStats,
      ] = await Promise.all([
        address ? getBalances(address) : null,
        address ? getStakePosition(address) : getStakePosition(undefined),
        address ? getReferralInfo(address) : null,
        getPresaleInfo(address),
        getTokenInfo(),
        address ? api.stakingHistory(address) : [],
        api.leaderboard(),
        api.presaleStats(),
        api.stakingStats(),
        api.referralStats(),
      ]);
      setData({
        balances,
        stake,
        referral,
        presale,
        token,
        history: Array.isArray(history) ? history : [],
        leaderboard: Array.isArray(leaderboard) ? leaderboard : [],
        protocolStats: {
          stakers: stakingStats?.stakers ?? null,
          totalStaked: stakingStats?.total_staked ?? stake?.totalStaked ?? null,
          totalReferrals: referralStats?.total_referrals ?? null,
          presaleContributors: presaleStats?.contributors ?? null,
        },
      });
    } catch (e) {
      setError(e?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, loading, error, refresh: load };
}
