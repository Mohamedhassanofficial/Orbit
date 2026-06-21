import Interactive from './Interactive'
import BnbLogo from './BnbLogo'

const headingFamily = "'Space Grotesk','Noto Kufi Arabic','Noto Sans SC',sans-serif"
const btnFamily = "'Space Grotesk','Noto Sans SC','Noto Kufi Arabic',sans-serif"

function StatCard({ value, label, color }) {
  return (
    <div
      style={{
        background: 'rgba(10,32,27,0.5)',
        border: '1px solid rgba(31,224,168,0.14)',
        borderRadius: '14px',
        padding: '18px',
      }}
    >
      <div
        style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontWeight: 700,
          fontSize: '24px',
          color: color || '#eafff8',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '13px', color: '#7fa99e' }}>{label}</div>
    </div>
  )
}

/**
 * Presale "Buy" card. Mirrors the Staking card: an amount input (in BNB), a
 * primary action button with pending/success/error states, and — when wired to
 * a live contract — a BscScan link to the resulting transaction.
 */
export default function Presale({
  t,
  bnbAmount,
  onBnbAmount,
  estTokens,
  estLabel,
  statRate = '100K',
  statCap = '500 BNB',
  showBuyForm,
  bought,
  buyError,
  buyErrText,
  boughtTitle,
  boughtBody,
  pending,
  pendingText,
  txUrl,
  viewTxText,
  onSubmit,
  onReset,
}) {
  return (
    <section
      id="presale"
      style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 28px 56px', scrollMarginTop: '80px' }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 360px', minWidth: '300px' }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#5ad9ff',
              marginBottom: '14px',
            }}
          >
            {t.presaleEyebrow}
          </div>
          <h2
            style={{
              fontFamily: headingFamily,
              fontWeight: 700,
              fontSize: '40px',
              letterSpacing: '-0.01em',
              margin: '0 0 16px',
            }}
          >
            {t.presaleTitle}
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#9fc2b8', margin: '0 0 26px' }}>
            {t.presaleSub}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <StatCard value={statRate} label={t.presaleRateL} color="#5ad9ff" />
            <StatCard value={statCap} label={t.presaleCapL} color="#1fe0a8" />
          </div>
        </div>

        <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(8,28,38,0.7), rgba(12,42,34,0.6))',
              border: '1px solid rgba(90,217,255,0.2)',
              borderRadius: '22px',
              padding: '30px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            }}
          >
            {showBuyForm && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#9fc2b8', marginBottom: '8px' }}>
                  {t.lblBnb}
                </label>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <Interactive
                    as="input"
                    value={bnbAmount}
                    onChange={onBnbAmount}
                    placeholder="0.00"
                    inputMode="decimal"
                    dir="ltr"
                    style={{
                      width: '100%',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '20px',
                      color: '#eafff8',
                      background: 'rgba(3,16,13,0.6)',
                      border: '1px solid rgba(90,217,255,0.22)',
                      borderRadius: '12px',
                      padding: '16px 84px 16px 16px',
                    }}
                    focusStyle={{
                      borderColor: '#5ad9ff',
                      boxShadow: '0 0 0 3px rgba(90,217,255,0.15)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: 600,
                      fontSize: '15px',
                      color: '#5ad9ff',
                    }}
                  >
                    <BnbLogo size={18} />
                    BNB
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(3,16,13,0.5)',
                    border: '1px solid rgba(31,224,168,0.14)',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#9fc2b8' }}>{estLabel}</div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: 700,
                      fontSize: '22px',
                      color: '#1fe0a8',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {estTokens}
                  </div>
                </div>

                {buyError && (
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#ff8da3',
                      background: 'rgba(255,90,120,0.1)',
                      border: '1px solid rgba(255,90,120,0.3)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      marginBottom: '16px',
                    }}
                  >
                    {buyErrText}
                  </div>
                )}

                <Interactive
                  as="button"
                  onClick={pending ? undefined : onSubmit}
                  disabled={pending}
                  style={{
                    width: '100%',
                    fontFamily: btnFamily,
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#03261d',
                    background: 'linear-gradient(135deg,#5ad9ff,#1fe0a8)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: pending ? 'wait' : 'pointer',
                    opacity: pending ? 0.7 : 1,
                    boxShadow: '0 8px 26px rgba(90,217,255,0.28)',
                  }}
                  hoverStyle={
                    pending
                      ? undefined
                      : { transform: 'translateY(-1px)', boxShadow: '0 12px 34px rgba(90,217,255,0.45)' }
                  }
                >
                  {pending ? pendingText : t.buyBtn}
                </Interactive>
              </div>
            )}

            {bought && (
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    margin: '0 auto 18px',
                    background: 'radial-gradient(circle at 35% 30%, #b6ecff, #5ad9ff 50%, #1f6f9c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 40px rgba(90,217,255,0.5)',
                  }}
                >
                  <span style={{ fontSize: '30px', color: '#03261d' }}>✓</span>
                </div>
                <div style={{ fontFamily: btnFamily, fontWeight: 700, fontSize: '24px', marginBottom: '10px' }}>
                  {boughtTitle}
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#9fc2b8', margin: '0 0 16px' }}>
                  {boughtBody}
                </p>
                {txUrl && (
                  <a
                    href={txUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-block',
                      fontSize: '13px',
                      color: '#5ad9ff',
                      textDecoration: 'none',
                      marginBottom: '20px',
                    }}
                  >
                    {viewTxText} ↗
                  </a>
                )}
                <div>
                  <Interactive
                    as="button"
                    onClick={onReset}
                    style={{
                      fontFamily: btnFamily,
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#eafff8',
                      background: 'rgba(12,38,32,0.6)',
                      border: '1px solid rgba(90,217,255,0.25)',
                      borderRadius: '11px',
                      padding: '12px 22px',
                      cursor: 'pointer',
                    }}
                    hoverStyle={{ borderColor: 'rgba(90,217,255,0.6)' }}
                  >
                    {t.buyAgain}
                  </Interactive>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
