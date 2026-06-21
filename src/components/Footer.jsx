import Interactive from './Interactive'
import Logo from './Logo'

const chipBase = {
  fontFamily: "'JetBrains Mono',monospace",
  fontSize: '12px',
  background: 'rgba(10,32,27,0.6)',
  border: '1px solid rgba(31,224,168,0.16)',
  borderRadius: '8px',
  padding: '7px 12px',
}

export default function Footer({ t }) {
  return (
    <footer style={{ borderTop: '1px solid rgba(31,224,168,0.12)', marginTop: '24px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 28px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '26px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
            <Logo size={28} flat idSuffix="-footer" />
            <span
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: 700,
                fontSize: '18px',
                letterSpacing: '0.04em',
              }}
            >
              ORBIT
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ ...chipBase, color: '#7fa99e' }}>BNB Chain · BEP-20</span>
            <span style={{ ...chipBase, color: '#9fc2b8' }}>{t.footerContract}</span>
            <Interactive
              as="a"
              href="#"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: '13px',
                color: '#9fc2b8',
                textDecoration: 'none',
              }}
              hoverStyle={{ color: '#eafff8' }}
            >
              Telegram
            </Interactive>
            <Interactive
              as="a"
              href="#"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: '13px',
                color: '#9fc2b8',
                textDecoration: 'none',
              }}
              hoverStyle={{ color: '#eafff8' }}
            >
              X
            </Interactive>
          </div>
        </div>
        <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#5d7a72', margin: 0, maxWidth: '820px' }}>
          {t.footerDisc}
        </p>
      </div>
    </footer>
  )
}
