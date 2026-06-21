const headingFamily = "'Space Grotesk','Noto Kufi Arabic','Noto Sans SC',sans-serif"
const labelFamily = "'Space Grotesk','Noto Sans SC','Noto Kufi Arabic',sans-serif"

function LegendItem({ swatch, title, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
      <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: swatch, flex: 'none' }} />
      <div>
        <div style={{ fontFamily: labelFamily, fontWeight: 600, fontSize: '16px', color: '#eafff8' }}>
          {title}
        </div>
        <div style={{ fontSize: '13px', color: '#7fa99e' }}>{desc}</div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, valueColor, desc }) {
  return (
    <div
      style={{
        background: 'rgba(10,32,27,0.5)',
        border: '1px solid rgba(31,224,168,0.14)',
        borderRadius: '18px',
        padding: '24px',
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: '12px',
          color: '#7fa99e',
          marginBottom: '8px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontWeight: 700,
          fontSize: '30px',
          color: valueColor || '#eafff8',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '13px', color: '#7fa99e', marginTop: '4px' }}>{desc}</div>
    </div>
  )
}

export default function Tokenomics({ t, showSupply, totalSupply = '100,000,000' }) {
  return (
    <section
      id="token"
      style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 28px 64px', scrollMarginTop: '80px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#1fe0a8',
            marginBottom: '14px',
          }}
        >
          {t.tokEyebrow}
        </div>
        <h2
          style={{
            fontFamily: headingFamily,
            fontWeight: 700,
            fontSize: '42px',
            letterSpacing: '-0.01em',
            margin: '0 0 14px',
          }}
        >
          {t.tokTitle}
        </h2>
        <p
          style={{
            fontSize: '17px',
            color: '#9fc2b8',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {t.tokSub}
        </p>
      </div>

      {showSupply && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(12,42,34,0.55), rgba(8,28,38,0.5))',
            border: '1px solid rgba(31,224,168,0.16)',
            borderRadius: '22px',
            padding: '34px',
            backdropFilter: 'blur(8px)',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              height: '22px',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '22px',
              border: '1px solid rgba(31,224,168,0.14)',
            }}
          >
            <div style={{ width: '90%', background: 'linear-gradient(90deg,#0c7a5c,#1fe0a8)' }} />
            <div style={{ width: '10%', background: 'linear-gradient(90deg,#5ad9ff,#7fffd4)' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
            <LegendItem
              swatch="linear-gradient(135deg,#0c7a5c,#1fe0a8)"
              title={t.treasuryL}
              desc={t.treasuryD}
            />
            <LegendItem
              swatch="linear-gradient(135deg,#5ad9ff,#7fffd4)"
              title={t.floatL}
              desc={t.floatD}
            />
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: '16px',
        }}
      >
        <SummaryCard label={t.tsTotalL} value={totalSupply} desc={t.tsTotalD} />
        <SummaryCard label={t.tsCircL} value="10,000,000" valueColor="#1fe0a8" desc={t.tsCircD} />
        <SummaryCard label={t.tsTargetL} value="$1 → $5" valueColor="#5ad9ff" desc={t.tsTargetD} />
      </div>
    </section>
  )
}
