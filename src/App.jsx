import { useEffect, useMemo, useState } from 'react'
import { TR, RTL_LANGS, getInitialLang, persistLang, fill } from './i18n'
import Background from './components/Background'
import Nav from './components/Nav'
import Hero from './components/Hero'
import PriceGoal from './components/PriceGoal'
import HowItWorks from './components/HowItWorks'
import ReferralForm from './components/ReferralForm'
import Staking from './components/Staking'
import Presale from './components/Presale'
import Dashboard from './components/Dashboard'
import PledgeRules from './components/PledgeRules'
import Tokenomics from './components/Tokenomics'
import Footer from './components/Footer'
import { useOrbit } from './web3/useOrbit'
import { useOrbitData } from './web3/useOrbitData'
import { claimRewards as claimStakeTx, claimPresale as claimPresaleTx, api } from './web3/orbit'
import { WEB3_ENABLED, bscTxUrl } from './web3/config'

// 3,420,000 → "3.42M" for compact protocol stats.
const compact = (n) => {
  if (n == null || Number.isNaN(n)) return null
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(Math.round(n))
}

// Mock address returned by the read-only "Connect Wallet" button (the design
// never requests real keys or signatures).
const MOCK_ADDR = '0x7f3a91cd4e2b8a0f6d1e5b7c9a3f8e2d4b6c29b1'

const APR_MAP = { 30: 12, 90: 28, 180: 60 }
const TIERS = [30, 90, 180]
// ORB per 1 BNB during the presale (mirrors contracts/scripts/deploy.js `rate`).
const PRESALE_RATE = 100000

const isAddr = (a) => /^0x[a-fA-F0-9]{40}$/.test((a || '').trim())
const trunc = (a) => (a ? a.trim().slice(0, 6) + '…' + a.trim().slice(-4) : '…')

/**
 * ORBIT ($ORB) one-page app.
 *
 * The three props below mirror the design's editable props:
 *   currentPrice (number) · primaryGoal ('$1' | '$5') · showSupplyBreakdown (bool)
 */
export default function App({ currentPrice = 0.18, primaryGoal = '$1', showSupplyBreakdown = true }) {
  // Restore a saved language choice, else auto-detect from the browser.
  const [lang, setLang] = useState(getInitialLang)
  const [refSelf, setRefSelf] = useState('')
  const [refTarget, setRefTarget] = useState('')
  const [refStatus, setRefStatus] = useState(null) // null | 'submitted'
  const [refError, setRefError] = useState('') // '' | error translation key
  const [stakeAmount, setStakeAmount] = useState('')
  const [stakeTier, setStakeTier] = useState(90)
  const [stakeStatus, setStakeStatus] = useState(null) // null | 'staked' | 'error'
  const [stakeTx, setStakeTx] = useState(null)
  const [presaleBnb, setPresaleBnb] = useState('')
  const [presaleStatus, setPresaleStatus] = useState(null) // null | 'bought' | 'error'
  const [presaleTx, setPresaleTx] = useState(null)
  const [connected, setConnected] = useState(false)
  const [addr, setAddr] = useState('')

  // Live Web3 hook — only its side effects run when WEB3_ENABLED (contracts set).
  const orbit = useOrbit()

  // Live account + protocol data for the dashboard and stat cards.
  const data = useOrbitData(WEB3_ENABLED ? addr || null : null)

  // Dashboard claim flows (independent of the stake/buy forms' pending state).
  const [claimPending, setClaimPending] = useState(null) // null | 'stake' | 'presale'
  const [claimTx, setClaimTx] = useState(null)
  const runClaim = async (kind, fn) => {
    if (!WEB3_ENABLED) return
    setClaimPending(kind)
    try {
      const receipt = await fn()
      if (receipt?.hash) setClaimTx(receipt.hash)
      data.refresh()
    } catch {
      /* surfaced via disabled state; keep UI responsive */
    } finally {
      setClaimPending(null)
    }
  }
  const handleClaimRewards = () => runClaim('stake', claimStakeTx)
  const handleClaimPresale = () => runClaim('presale', claimPresaleTx)

  // Manual language switch — update state and remember the choice across reloads.
  const changeLang = (code) => {
    setLang(code)
    persistLang(code)
  }

  // Merge over English so any key missing in a translation falls back to EN
  // (rather than rendering blank) — used by the newly added presale strings.
  const t = { ...TR.en, ...(TR[lang] || {}) }
  const dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr'

  // Keep the document in sync so RTL flips the whole page, not just the wrapper.
  // (Intentional deviation: the design set `dir` only on the inner wrapper; also
  // setting it on <html> makes the scrollbar/bidi flip correctly for ar/ur.)
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  // ----- handlers -----
  const connect = async () => {
    if (WEB3_ENABLED) {
      await orbit.connect()
      const a = orbit.address
      if (a) {
        setConnected(true)
        setAddr(a)
        setRefSelf((cur) => cur || a)
      }
      return
    }
    // Demo mode: read-only mock address (no wallet / no signature).
    setConnected(true)
    setAddr(MOCK_ADDR)
    setRefSelf((cur) => cur || MOCK_ADDR)
  }

  // Keep local connected state in sync once the wallet resolves an address.
  useEffect(() => {
    if (WEB3_ENABLED && orbit.address) {
      setConnected(true)
      setAddr(orbit.address)
      setRefSelf((cur) => cur || orbit.address)
    }
  }, [orbit.address])

  const submitReferral = async () => {
    if (!isAddr(refSelf)) return setRefError('errSelf')
    if (!isAddr(refTarget)) return setRefError('errTarget')
    if (refSelf.trim().toLowerCase() === refTarget.trim().toLowerCase()) return setRefError('errSame')
    setRefError('')
    // Record the submission with the backend (referrer = you, referee = the wallet
    // you referred). Best-effort: a down backend / demo mode still shows success,
    // and the real verify→30h→payout pipeline runs server-side. No signature.
    api.submitReferral(refSelf.trim(), refTarget.trim())
    setRefStatus('submitted')
  }
  const resetReferral = () => {
    setRefStatus(null)
    setRefTarget('')
  }

  const selectTier = (d) => {
    setStakeTier(d)
    setStakeStatus(null)
  }
  const submitStake = async () => {
    const amt = parseFloat(stakeAmount) || 0
    if (amt <= 0) return setStakeStatus('error')
    if (WEB3_ENABLED) {
      // approve + stake on-chain; receipt.hash surfaces via orbit.txHash
      const receipt = await orbit.stakeOrb(amt)
      if (receipt) {
        setStakeTx(receipt.hash)
        setStakeStatus('staked')
      } else {
        setStakeStatus('error')
      }
      return
    }
    setStakeStatus('staked') // demo mode
  }
  const resetStake = () => {
    setStakeStatus(null)
    setStakeAmount('')
    setStakeTx(null)
    orbit.resetTx()
  }

  const submitBuy = async () => {
    const amt = parseFloat(presaleBnb) || 0
    if (amt <= 0) return setPresaleStatus('error')
    if (WEB3_ENABLED) {
      const receipt = await orbit.buyPresale(amt)
      if (receipt) {
        setPresaleTx(receipt.hash)
        setPresaleStatus('bought')
      } else {
        setPresaleStatus('error')
      }
      return
    }
    setPresaleStatus('bought') // demo mode
  }
  const resetBuy = () => {
    setPresaleStatus(null)
    setPresaleBnb('')
    setPresaleTx(null)
    orbit.resetTx()
  }

  // ----- derived values (mirrors the design's renderVals) -----
  const vals = useMemo(() => {
    const price = Number(currentPrice ?? 0.18)
    const goalVal = primaryGoal === '$5' ? 5 : 1
    const pct = Math.max(2, Math.min(100, (price / goalVal) * 100))
    const fmtX = (x) => (x >= 10 ? x.toFixed(0) : x.toFixed(1)) + '×'
    const fmtN = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 2 })

    const apr = APR_MAP[stakeTier]
    const amt = parseFloat(stakeAmount) || 0
    const est = amt * (apr / 100) * (stakeTier / 365)
    const estReward = fmtN(est) + ' ORB'
    const tierDaysText = stakeTier + t.dayWord

    const tierBtns = TIERS.map((d) => ({
      day: d,
      label: d + t.dayWord,
      aprLabel: APR_MAP[d] + t.aprWord,
      active: stakeTier === d,
      onClick: () => selectTier(d),
    }))

    return {
      price: '$' + price.toFixed(2),
      pgCurrent: fill(t.pgCurrent, { g: primaryGoal }),
      progressW: pct.toFixed(1) + '%',
      progressPctText: pct.toFixed(1) + '%',
      to1: fmtX(1 / price),
      to5: fmtX(5 / price),

      tierBtns,
      estReward,
      estLabel: fill(t.estLabel, { d: tierDaysText }),
      stakedTitle: fill(t.stakedTitle, { n: fmtN(amt) + ' ORB' }),
      stakedBody: fill(t.stakedBody, { d: tierDaysText, p: apr + '%', r: estReward }),

      succBody: fill(t.succBody, { b: trunc(refTarget), a: trunc(refSelf) }),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, currentPrice, primaryGoal, stakeTier, stakeAmount, refSelf, refTarget])

  // ----- presale derived values -----
  const fmtN = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 2 })
  const bnbIn = parseFloat(presaleBnb) || 0
  const estTokensNum = bnbIn * PRESALE_RATE
  const presaleVals = {
    estTokens: fmtN(estTokensNum) + ' ORB',
    estLabel: t.presaleEstLabel,
    boughtTitle: fill(t.boughtTitle, { n: fmtN(estTokensNum) + ' ORB' }),
    boughtBody: fill(t.boughtBody, { b: fmtN(bnbIn) + ' BNB', r: fmtN(estTokensNum) + ' ORB' }),
  }

  // ----- live protocol stats (undefined → component keeps its placeholder) -----
  const pct = (v) => (v == null ? undefined : Math.round(v) + '%')
  const liveStats = {
    stakeStaked: compact(data.stake?.totalStaked) ?? undefined,
    stakeStakers: data.protocolStats?.stakers != null ? data.protocolStats.stakers.toLocaleString('en-US') : undefined,
    stakeLocked: data.stake?.totalStaked != null ? pct((data.stake.totalStaked / 10_000_000) * 100) : undefined,
    stakeApr: pct(data.stake?.aprPct),
    presaleRate: compact(data.presale?.rate) ?? undefined,
    presaleCap: data.presale?.hardCap != null ? fmtN(data.presale.hardCap) + ' BNB' : undefined,
    tokTotal: data.token?.totalSupply != null ? Math.round(data.token.totalSupply).toLocaleString('en-US') : undefined,
  }

  return (
    <div
      dir={dir}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#03100d',
        color: '#eafff8',
        fontFamily: "'Sora','Noto Sans Arabic','Noto Sans SC',system-ui,sans-serif",
        overflowX: 'hidden',
      }}
    >
      <Background />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <Nav
          t={t}
          lang={lang}
          onLangChange={(e) => changeLang(e.target.value)}
          connected={connected}
          connectLabel={connected ? trunc(addr) : t.connect}
          onConnect={connect}
        />

        <Hero t={t} />

        <Dashboard
          t={t}
          web3Enabled={WEB3_ENABLED}
          connected={connected}
          onConnect={connect}
          balances={data.balances}
          stake={data.stake}
          referral={data.referral}
          presale={data.presale}
          history={data.history}
          loading={data.loading}
          claimPending={claimPending}
          claimTxHash={claimTx}
          onClaimRewards={handleClaimRewards}
          onClaimPresale={handleClaimPresale}
        />

        <PriceGoal
          t={t}
          price={vals.price}
          pgCurrent={vals.pgCurrent}
          to1={vals.to1}
          to5={vals.to5}
          progressW={vals.progressW}
          progressPctText={vals.progressPctText}
          goalLabel={primaryGoal}
        />

        <HowItWorks t={t} />

        <ReferralForm
          t={t}
          refSelf={refSelf}
          refTarget={refTarget}
          onSelf={(e) => {
            setRefSelf(e.target.value)
            setRefError('')
          }}
          onTarget={(e) => {
            setRefTarget(e.target.value)
            setRefError('')
          }}
          refError={refError ? t[refError] : ''}
          showRefForm={refStatus !== 'submitted'}
          refSubmitted={refStatus === 'submitted'}
          succBody={vals.succBody}
          onSubmit={submitReferral}
          onReset={resetReferral}
        />

        <Staking
          t={t}
          stakeAmount={stakeAmount}
          onStakeAmount={(e) => {
            setStakeAmount(e.target.value)
            setStakeStatus(null)
          }}
          tierBtns={vals.tierBtns}
          estLabel={vals.estLabel}
          estReward={vals.estReward}
          showStakeForm={stakeStatus !== 'staked'}
          staked={stakeStatus === 'staked'}
          stakeError={stakeStatus === 'error'}
          stakeErrText={t.stakeErr}
          statStaked={liveStats.stakeStaked}
          statStakers={liveStats.stakeStakers}
          statLocked={liveStats.stakeLocked}
          statApr={liveStats.stakeApr}
          stakedTitle={vals.stakedTitle}
          stakedBody={vals.stakedBody}
          pending={WEB3_ENABLED && orbit.pending}
          pendingText={t.txPending}
          txUrl={stakeTx ? bscTxUrl(stakeTx) : null}
          viewTxText={t.viewTx}
          onSubmit={submitStake}
          onReset={resetStake}
        />

        <Presale
          t={t}
          bnbAmount={presaleBnb}
          onBnbAmount={(e) => {
            setPresaleBnb(e.target.value)
            setPresaleStatus((s) => (s === 'error' ? null : s))
          }}
          estTokens={presaleVals.estTokens}
          estLabel={presaleVals.estLabel}
          statRate={liveStats.presaleRate}
          statCap={liveStats.presaleCap}
          showBuyForm={presaleStatus !== 'bought'}
          bought={presaleStatus === 'bought'}
          buyError={presaleStatus === 'error'}
          buyErrText={t.buyErr}
          boughtTitle={presaleVals.boughtTitle}
          boughtBody={presaleVals.boughtBody}
          pending={WEB3_ENABLED && orbit.pending}
          pendingText={t.txPending}
          txUrl={presaleTx ? bscTxUrl(presaleTx) : null}
          viewTxText={t.viewTx}
          onSubmit={submitBuy}
          onReset={resetBuy}
        />

        <PledgeRules t={t} />

        <Tokenomics t={t} showSupply={showSupplyBreakdown} totalSupply={liveStats.tokTotal} />

        <Footer t={t} />
      </div>
    </div>
  )
}
