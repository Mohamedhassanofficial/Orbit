// Price-goal "escape velocity" meter: current price, multiples to $1 / $5,
// and a progress bar toward the active goal.
export default function PriceGoal({ t, price, pgCurrent, to1, to5, progressW, progressPctText, goalLabel }) {
  return (
    <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 28px 56px' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(12,42,34,0.6), rgba(8,28,38,0.5))',
          border: '1px solid rgba(31,224,168,0.16)',
          borderRadius: '22px',
          padding: '32px 34px',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '18px',
            marginBottom: '22px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '12px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#7fa99e',
                marginBottom: '8px',
              }}
            >
              {t.pgEyebrow}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: 700,
                  fontSize: '40px',
                  color: '#eafff8',
                }}
              >
                {price}
              </span>
              <span style={{ fontSize: '14px', color: '#7fa99e' }}>{pgCurrent}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#1fe0a8',
                }}
              >
                {to1}
              </div>
              <div style={{ fontSize: '12px', color: '#7fa99e' }}>{t.pgTo1}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#5ad9ff',
                }}
              >
                {to5}
              </div>
              <div style={{ fontSize: '12px', color: '#7fa99e' }}>{t.pgTo5}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            height: '14px',
            borderRadius: '999px',
            background: 'rgba(3,16,13,0.7)',
            border: '1px solid rgba(31,224,168,0.12)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: progressW,
              borderRadius: '999px',
              background: 'linear-gradient(90deg,#1fe0a8,#7fffd4)',
              boxShadow: '0 0 18px rgba(31,224,168,0.6)',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '12px',
            color: '#7fa99e',
          }}
        >
          <span>{t.pgLaunch}</span>
          <span style={{ color: '#1fe0a8' }}>
            {progressPctText} → {goalLabel}
          </span>
          <span>$5.00</span>
        </div>
      </div>
    </section>
  )
}
