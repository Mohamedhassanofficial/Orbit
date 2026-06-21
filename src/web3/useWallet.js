// React hook: connect an injected wallet (MetaMask / Trust), ensure BSC,
// and authenticate against the backend with a signed nonce (SIWE).
import { useCallback, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { API_BASE, BSC_MAINNET } from "./config";

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const eth = typeof window !== "undefined" ? window.ethereum : undefined;

  const ensureBscChain = useCallback(async () => {
    if (!eth) return;
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BSC_MAINNET.chainIdHex }],
      });
    } catch (e) {
      // 4902 = chain not added to the wallet yet
      if (e.code === 4902) {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: BSC_MAINNET.chainIdHex,
              chainName: BSC_MAINNET.name,
              rpcUrls: [BSC_MAINNET.rpcUrl],
              nativeCurrency: BSC_MAINNET.nativeCurrency,
              blockExplorerUrls: [BSC_MAINNET.explorer],
            },
          ],
        });
      }
    }
  }, [eth]);

  const connect = useCallback(async () => {
    setError(null);
    if (!eth) {
      setError("No wallet found. Install MetaMask or Trust Wallet.");
      return;
    }
    try {
      await eth.request({ method: "eth_requestAccounts" });
      await ensureBscChain();
      const provider = new BrowserProvider(eth);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);

      // SIWE: fetch nonce -> sign -> verify -> JWT
      const nonceRes = await fetch(`${API_BASE}/auth/nonce?address=${addr}`).then((r) => r.json());
      const signature = await signer.signMessage(nonceRes.message);
      const verifyRes = await fetch(`${API_BASE}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addr, signature }),
      }).then((r) => r.json());
      setToken(verifyRes.access_token);
    } catch (e) {
      setError(e.message || "Connection failed");
    }
  }, [eth, ensureBscChain]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setToken(null);
  }, []);

  useEffect(() => {
    if (!eth) return;
    const onAccounts = (accs) => (accs.length ? setAddress(accs[0]) : disconnect());
    eth.on?.("accountsChanged", onAccounts);
    return () => eth.removeListener?.("accountsChanged", onAccounts);
  }, [eth, disconnect]);

  // Silent auto-reconnect: if the wallet already authorized this site, restore
  // the address on load (eth_accounts does not prompt). A returning user lands
  // on their dashboard without clicking Connect again.
  useEffect(() => {
    if (!eth) return;
    let cancelled = false;
    eth
      .request({ method: "eth_accounts" })
      .then((accs) => {
        if (!cancelled && accs?.length) setAddress(accs[0]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [eth]);

  return { address, token, error, connect, disconnect };
}
