const headingFamily = "'Space Grotesk','Noto Kufi Arabic','Noto Sans SC',sans-serif"
const cardTitleFamily = "'Space Grotesk','Noto Sans SC','Noto Kufi Arabic',sans-serif"

function StepCard({ n, title, desc, highlight }) {
  return (
    <div
      style={{
        background: highlight
          ? 'linear-gradient(135deg, rgba(31,224,168,0.16), rgba(10,32,27,0.5))'
          : 'rgba(10,32,27,0.5)',
        border: highlight ? '1px solid rgba(31,224,168,0.32)' : '1px solid rgba(31,224,168,0.14)',
        borderRadius: '18px',
        padding: '24px',
      }}
    >
      <div
        style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontWeight: 700,
          fontSize: '14px',
          color: '#03261d',
          background: 'linear-gradient(135deg,#7fffd4,#1fe0a8)',
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        {n}
      </div>
      <div
        style={{ fontFamily: cardTitleFamily, fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}
      >
        {title}
      </div>
      <div style={{ fontSize: '14px', lineHeight: 1.55, color: highlight ? '#cdeee4' : '#9fc2b8' }}>
        {desc}
      </div>
    </div>
  )
}

export default function HowItWorks({ t }) {
  const steps = [
    { n: 1, title: t.s1t, desc: t.s1d },
    { n: 2, title: t.s2t, desc: t.s2d },
    { n: 3, title: t.s3t, desc: t.s3d },
    { n: 4, title: t.s4t, desc: t.s4d },
    { n: 5, title: t.s5t, desc: t.s5d, highlight: true },
  ]

  return (
    <section
      id="how"
      style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 28px 64px', scrollMarginTop: '80px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
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
          {t.howEyebrow}
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
          {t.howTitle}
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
          {t.howSub}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          gap: '16px',
        }}
      >
        {steps.map((s) => (
          <StepCard key={s.n} {...s} />
        ))}
      </div>
    </section>
  )
}
