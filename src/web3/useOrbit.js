// High-level dApp hook: wraps wallet connection (useWallet) and the contract
// helpers (orbit.js) with pending / txHash / error state for the UI.
import { useCallback, useState } from "react";
import { useWallet } from "./useWallet";
import { buyPresale, claimRewards, stake } from "./orbit";

export function useOrbit() {
  const wallet = useWallet();
  const [pending, setPending] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  // Run a contract call, tracking pending/tx/error. Returns the receipt or null.
  const _send = useCallback(async (fn) => {
    setError(null);
    setTxHash(null);
    setPending(true);
    try {
      const receipt = await fn();
      // ethers v6 receipt exposes .hash
      setTxHash(receipt?.hash ?? null);
      return receipt;
    } catch (e) {
      setError(e?.shortMessage || e?.message || "Transaction failed");
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  const stakeOrb = useCallback((amount) => _send(() => stake(amount)), [_send]);
  const buy = useCallback((bnb) => _send(() => buyPresale(bnb)), [_send]);
  const claim = useCallback(() => _send(() => claimRewards()), [_send]);

  const resetTx = useCallback(() => {
    setTxHash(null);
    setError(null);
  }, []);

  return {
    address: wallet.address,
    connect: wallet.connect,
    connectError: wallet.error,
    pending,
    txHash,
    error,
    stakeOrb,
    buyPresale: buy,
    claimRewards: claim,
    resetTx,
  };
}
