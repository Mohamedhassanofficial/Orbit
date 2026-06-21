import Interactive from './Interactive'

const headingFamily = "'Space Grotesk','Noto Kufi Arabic','Noto Sans SC',sans-serif"

function Stat({ value, label }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontWeight: 700,
          fontSize: '26px',
          color: '#eafff8',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '13px', color: '#7fa99e' }}>{label}</div>
    </div>
  )
}

const divider = { width: '1px', background: 'rgba(31,224,168,0.15)' }

export default function Hero({ t }) {
  return (
    <section
      style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: '64px 28px 40px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '48px',
      }}
    >
      <div style={{ flex: '1 1 440px', minWidth: '320px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#1fe0a8',
            border: '1px solid rgba(31,224,168,0.25)',
            borderRadius: '999px',
            padding: '6px 14px',
            marginBottom: '26px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#1fe0a8',
              boxShadow: '0 0 8px #1fe0a8',
            }}
          />{' '}
          {t.heroBadge}
        </div>

        <h1
          style={{
            fontFamily: headingFamily,
            fontWeight: 700,
            fontSize: '60px',
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
            margin: '0 0 22px',
          }}
        >
          {t.heroTitle1}
          <br />
          <span
            style={{
              background: 'linear-gradient(120deg,#7fffd4,#1fe0a8 50%,#5ad9ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {t.heroTitle2}
          </span>
        </h1>

        <p
          style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#9fc2b8',
            maxWidth: '520px',
            margin: '0 0 34px',
          }}
        >
          {t.heroSub}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '38px' }}>
          <Interactive
            as="a"
            href="#refer"
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontWeight: 600,
              fontSize: '15px',
              color: '#03261d',
              background: 'linear-gradient(135deg,#7fffd4,#1fe0a8)',
              borderRadius: '12px',
              padding: '15px 26px',
              textDecoration: 'none',
              boxShadow: '0 8px 28px rgba(31,224,168,0.32)',
            }}
            hoverStyle={{
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 36px rgba(31,224,168,0.5)',
            }}
          >
            {t.ctaRefer}
          </Interactive>
          <Interactive
            as="a"
            href="#stake"
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontWeight: 600,
              fontSize: '15px',
              color: '#eafff8',
              background: 'rgba(12,38,32,0.6)',
              border: '1px solid rgba(31,224,168,0.25)',
              borderRadius: '12px',
              padding: '15px 26px',
              textDecoration: 'none',
            }}
            hoverStyle={{
              borderColor: 'rgba(31,224,168,0.6)',
              background: 'rgba(12,46,38,0.7)',
            }}
          >
            {t.ctaStake}
          </Interactive>
        </div>

        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <Stat value={t.statRewardV} label={t.statRewardL} />
          <div style={divider} />
          <Stat value={t.statPayoutV} label={t.statPayoutL} />
          <div style={divider} />
          <Stat value={t.statSupplyV} label={t.statSupplyL} />
        </div>
      </div>

      <div
        style={{
          flex: '1 1 360px',
          minWidth: '300px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ position: 'relative', width: '380px', height: '380px' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1px solid rgba(31,224,168,0.22)',
              animation: 'orbSpin 64s linear infinite',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#38f5c9',
                boxShadow: '0 0 14px #38f5c9',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: '52px',
              borderRadius: '50%',
              border: '1px solid rgba(90,217,255,0.2)',
              animation: 'orbSpinRev 48s linear infinite',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: '-5px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#5ad9ff',
                boxShadow: '0 0 12px #5ad9ff',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: '104px',
              borderRadius: '50%',
              border: '1px dashed rgba(31,224,168,0.18)',
              animation: 'orbSpin 80s linear infinite',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '-4px',
                transform: 'translateY(-50%)',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#7fffd4',
                boxShadow: '0 0 10px #7fffd4',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: '138px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #9efce0, #1fe0a8 46%, #0c7a5c)',
              boxShadow: '0 0 70px rgba(31,224,168,0.5), inset 0 0 34px rgba(255,255,255,0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'floaty 6.5s ease-in-out infinite',
            }}
          >
            <span
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: 700,
                fontSize: '30px',
                letterSpacing: '0.02em',
                color: '#03261d',
              }}
            >
              ORB
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
