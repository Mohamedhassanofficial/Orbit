import Interactive from './Interactive'

const headingFamily = "'Space Grotesk','Noto Kufi Arabic','Noto Sans SC',sans-serif"
// Card titles, buttons and the success/staked titles share the SC-before-Kufi
// stack in the design (distinct from the Kufi-first section-heading stack).
const btnFamily = "'Space Grotesk','Noto Sans SC','Noto Kufi Arabic',sans-serif"

function tierStyle(active) {
  return active
    ? {
        flex: 1,
        cursor: 'pointer',
        textAlign: 'center',
        padding: '14px 10px',
        borderRadius: '14px',
        border: '1px solid #5ad9ff',
        background: 'linear-gradient(135deg,#7fffd4,#5ad9ff)',
        boxShadow: '0 8px 26px rgba(90,217,255,0.35)',
      }
    : {
        flex: 1,
        cursor: 'pointer',
        textAlign: 'center',
        padding: '14px 10px',
        borderRadius: '14px',
        border: '1px solid rgba(90,217,255,0.18)',
        background: 'rgba(8,28,38,0.5)',
      }
}

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

export default function Staking({
  t,
  stakeAmount,
  onStakeAmount,
  tierBtns,
  estLabel,
  estReward,
  showStakeForm,
  staked,
  stakeError,
  stakeErrText,
  statStaked = '3.42M',
  statStakers = '4,820',
  statLocked = '34%',
  statApr = '60%',
  stakedTitle,
  stakedBody,
  pending,
  pendingText,
  txUrl,
  viewTxText,
  onSubmit,
  onReset,
}) {
  return (
    <section
      id="stake"
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
            {t.stakeEyebrow}
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
            {t.stakeTitle}
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#9fc2b8', margin: '0 0 26px' }}>
            {t.stakeSub}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <StatCard value={statStaked} label={t.stkStakedL} />
            <StatCard value={statStakers} label={t.stkStakersL} />
            <StatCard value={statLocked} label={t.stkLockedL} color="#5ad9ff" />
            <StatCard value={statApr} label={t.stkAprL} color="#1fe0a8" />
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
            {showStakeForm && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#9fc2b8', marginBottom: '8px' }}>
                  {t.lblAmt}
                </label>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <Interactive
                    as="input"
                    value={stakeAmount}
                    onChange={onStakeAmount}
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
                      padding: '16px 70px 16px 16px',
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
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: 600,
                      fontSize: '15px',
                      color: '#5ad9ff',
                    }}
                  >
                    ORB
                  </span>
                </div>

                <label style={{ display: 'block', fontSize: '13px', color: '#9fc2b8', marginBottom: '8px' }}>
                  {t.lblLock}
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
                  {tierBtns.map((tb) => (
                    <button key={tb.day} onClick={tb.onClick} style={tierStyle(tb.active)}>
                      <div
                        style={{
                          fontFamily: "'Space Grotesk','Noto Sans SC',sans-serif",
                          fontWeight: 600,
                          fontSize: '15px',
                          marginBottom: '4px',
                          color: tb.active ? '#03261d' : '#eafff8',
                        }}
                      >
                        {tb.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '12px',
                          color: tb.active ? '#0a3a2e' : '#5ad9ff',
                        }}
                      >
                        {tb.aprLabel}
                      </div>
                    </button>
                  ))}
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
                    {estReward}
                  </div>
                </div>

                {stakeError && (
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
                    {stakeErrText}
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
                  {pending ? pendingText : t.stakeBtn}
                </Interactive>
              </div>
            )}

            {staked && (
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
                <div
                  style={{ fontFamily: btnFamily, fontWeight: 700, fontSize: '24px', marginBottom: '10px' }}
                >
                  {stakedTitle}
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#9fc2b8', margin: '0 0 16px' }}>
                  {stakedBody}
                </p>
                {txUrl && (
                  <div style={{ marginBottom: '18px' }}>
                    <a
                      href={txUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '13px', color: '#5ad9ff', textDecoration: 'none' }}
                    >
                      {viewTxText} ↗
                    </a>
                  </div>
                )}
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
                  {t.stakedAgain}
                </Interactive>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
