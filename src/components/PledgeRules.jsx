const headingFamily = "'Space Grotesk','Noto Kufi Arabic','Noto Sans SC',sans-serif"
const cardTitleFamily = "'Space Grotesk','Noto Sans SC','Noto Kufi Arabic',sans-serif"

function RuleCard({ num, title, desc, highlight }) {
  return (
    <div
      style={{
        background: highlight
          ? 'linear-gradient(135deg, rgba(90,217,255,0.14), rgba(10,32,27,0.5))'
          : 'rgba(10,32,27,0.5)',
        border: highlight ? '1px solid rgba(90,217,255,0.3)' : '1px solid rgba(90,217,255,0.16)',
        borderRadius: '18px',
        padding: '26px',
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: '13px',
          color: '#5ad9ff',
          marginBottom: '14px',
        }}
      >
        {num}
      </div>
      <div
        style={{ fontFamily: cardTitleFamily, fontWeight: 600, fontSize: '19px', marginBottom: '8px' }}
      >
        {title}
      </div>
      <div style={{ fontSize: '14px', lineHeight: 1.55, color: highlight ? '#cdeee4' : '#9fc2b8' }}>
        {desc}
      </div>
    </div>
  )
}

export default function PledgeRules({ t }) {
  const rules = [
    { num: '01', title: t.r1t, desc: t.r1d },
    { num: '02', title: t.r2t, desc: t.r2d },
    { num: '03', title: t.r3t, desc: t.r3d },
    { num: '04', title: t.r4t, desc: t.r4d, highlight: true },
  ]

  return (
    <section
      id="rules"
      style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 28px 64px', scrollMarginTop: '80px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
          {t.rulesEyebrow}
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
          {t.rulesTitle}
        </h2>
        <p
          style={{
            fontSize: '17px',
            color: '#9fc2b8',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {t.rulesSub}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '16px',
        }}
      >
        {rules.map((r) => (
          <RuleCard key={r.num} {...r} />
        ))}
      </div>
    </section>
  )
}
