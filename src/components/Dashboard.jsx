import Interactive from './Interactive'
import { bscTxUrl } from '../web3/config'

const headingFamily = "'Space Grotesk','Noto Kufi Arabic','Noto Sans SC',sans-serif"
const btnFamily = "'Space Grotesk','Noto Sans SC','Noto Kufi Arabic',sans-serif"
const monoFamily = "'JetBrains Mono',monospace"

const fmt = (n, d = 2) =>
  n == null || Number.isNaN(n) ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: d })

function Card({ children, accent = 'rgba(31,224,168,0.14)' }) {
  return (
    <div
      style={{
        background: 'rgba(10,32,27,0.5)',
        border: `1px solid ${accent}`,
        borderRadius: '18px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      {children}
    </div>
  )
}

function Metric({ label, value, unit, color }) {
  return (
    <div>
      <div style={{ fontFamily: monoFamily, fontSize: '12px', color: '#7fa99e', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '26px', color: color || '#eafff8' }}>
        {value}
        {unit && <span style={{ fontSize: '14px', color: '#7fa99e', marginInlineStart: '6px' }}>{unit}</span>}
      </div>
    </div>
  )
}

function ClaimButton({ label, disabled, pending, pendingText, onClick }) {
  return (
    <Interactive
      as="button"
      onClick={pending || disabled ? undefined : onClick}
      disabled={pending || disabled}
      style={{
        marginTop: '10px',
        fontFamily: btnFamily,
        fontWeight: 600,
        fontSize: '14px',
        color: '#03261d',
        background: 'linear-gradient(135deg,#7fffd4,#1fe0a8)',
        border: 'none',
        borderRadius: '11px',
        padding: '11px 16px',
        cursor: pending || disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : pending ? 0.7 : 1,
        boxShadow: '0 6px 20px rgba(31,224,168,0.28)',
      }}
      hoverStyle={pending || disabled ? undefined : { transform: 'translateY(-1px)' }}
    >
      {pending ? pendingText : label}
    </Interactive>
  )
}

/**
 * Connect-gated account dashboard. In real mode it shows the connected user's
 * live balances/positions; in demo mode (or when not yet connected) it shows the
 * demo snapshot so the section is always meaningful.
 */
export default function Dashboard({
  t,
  web3Enabled,
  connected,
  onConnect,
  balances,
  stake,
  referral,
  presale,
  history,
  loading,
  claimPending,
  claimTxHash,
  onClaimRewards,
  onClaimPresale,
}) {
  const gated = web3Enabled && !connected

  const eyebrow = (
    <div
      style={{
        fontFamily: monoFamily,
        fontSize: '12px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#1fe0a8',
        marginBottom: '14px',
      }}
    >
      {t.dashEyebrow}
    </div>
  )
  const title = (
    <h2 style={{ fontFamily: headingFamily, fontWeight: 700, fontSize: '40px', letterSpacing: '-0.01em', margin: '0 0 16px' }}>
      {t.dashTitle}
    </h2>
  )

  return (
    <section id="dashboard" style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 28px 56px', scrollMarginTop: '80px' }}>
      {eyebrow}
      {title}
      <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#9fc2b8', margin: '0 0 24px', maxWidth: '640px' }}>
        {t.dashSub}
      </p>

      {!web3Enabled && (
        <div
          style={{
            fontFamily: monoFamily,
            fontSize: '12px',
            color: '#5ad9ff',
            background: 'rgba(90,217,255,0.08)',
            border: '1px solid rgba(90,217,255,0.25)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '20px',
            display: 'inline-block',
          }}
        >
          {t.dashDemoNote}
        </div>
      )}

      {gated ? (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(12,42,34,0.7), rgba(8,28,38,0.6))',
            border: '1px solid rgba(31,224,168,0.2)',
            borderRadius: '22px',
            padding: '40px 30px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          }}
        >
          <p style={{ fontSize: '15px', color: '#9fc2b8', margin: '0 0 20px' }}>{t.dashConnectPrompt}</p>
          <Interactive
            as="button"
            onClick={onConnect}
            style={{
              fontFamily: btnFamily,
              fontWeight: 600,
              fontSize: '15px',
              color: '#03261d',
              background: 'linear-gradient(135deg,#7fffd4,#1fe0a8)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 26px',
              cursor: 'pointer',
              boxShadow: '0 8px 26px rgba(31,224,168,0.3)',
            }}
            hoverStyle={{ transform: 'translateY(-1px)', boxShadow: '0 12px 34px rgba(31,224,168,0.5)' }}
          >
            {t.connect}
          </Interactive>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px' }}>
            {/* Balances */}
            <Card>
              <Metric label={t.dashBalOrbL} value={loading ? '…' : fmt(balances?.orb)} unit="ORB" color="#1fe0a8" />
              <div style={{ height: '8px' }} />
              <Metric label={t.dashBalBnbL} value={loading ? '…' : fmt(balances?.bnb, 4)} unit="BNB" color="#5ad9ff" />
            </Card>

            {/* Stake */}
            <Card accent="rgba(90,217,255,0.18)">
              <Metric label={t.dashMyStakeL} value={loading ? '…' : fmt(stake?.staked)} unit="ORB" />
              <div style={{ height: '8px' }} />
              <Metric label={t.dashPendingL} value={loading ? '…' : fmt(stake?.pending)} unit="ORB" color="#1fe0a8" />
              <ClaimButton
                label={t.dashClaimBtn}
                disabled={!stake?.pending}
                pending={claimPending === 'stake'}
                pendingText={t.txPending}
                onClick={onClaimRewards}
              />
            </Card>

            {/* Referrals */}
            <Card>
              <Metric label={t.dashMyRefL} value={loading ? '…' : fmt(referral?.count, 0)} />
              <div style={{ height: '8px' }} />
              <Metric label={t.dashRefEarnedL} value={loading ? '…' : fmt(referral?.earned)} unit="ORB" color="#1fe0a8" />
            </Card>

            {/* Presale */}
            <Card accent="rgba(90,217,255,0.18)">
              <Metric label={t.dashPresaleOwedL} value={loading ? '…' : fmt(presale?.tokensOwed)} unit="ORB" color="#5ad9ff" />
              <ClaimButton
                label={t.dashClaimPresaleBtn}
                disabled={!presale?.tokensOwed}
                pending={claimPending === 'presale'}
                pendingText={t.txPending}
                onClick={onClaimPresale}
              />
            </Card>
          </div>

          {/* Recent activity */}
          <div
            style={{
              marginTop: '16px',
              background: 'rgba(10,32,27,0.5)',
              border: '1px solid rgba(31,224,168,0.14)',
              borderRadius: '18px',
              padding: '22px',
            }}
          >
            <div style={{ fontFamily: monoFamily, fontSize: '12px', color: '#7fa99e', marginBottom: '14px' }}>
              {t.dashRecentL}
            </div>
            {history && history.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.slice(0, 8).map((h, i) => (
                  <div
                    key={h.tx_hash || i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      color: '#cdeee4',
                      borderBottom: '1px solid rgba(31,224,168,0.08)',
                      paddingBottom: '8px',
                    }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{h.action}</span>
                    <span style={{ fontFamily: monoFamily, color: '#9fc2b8' }}>{fmt(Number(h.amount))} ORB</span>
                    {h.tx_hash && !String(h.tx_hash).startsWith('0xdemo') ? (
                      <a href={bscTxUrl(h.tx_hash)} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#5ad9ff', textDecoration: 'none' }}>
                        {t.viewTx} ↗
                      </a>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#5d7a72' }}>—</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '14px', color: '#7fa99e' }}>{t.dashNoActivity}</div>
            )}
          </div>

          {claimTxHash && (
            <div style={{ marginTop: '14px' }}>
              <a href={bscTxUrl(claimTxHash)} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#5ad9ff', textDecoration: 'none' }}>
                {t.viewTx} ↗
              </a>
            </div>
          )}
        </>
      )}
    </section>
  )
}
