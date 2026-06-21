import Interactive from './Interactive'
import Logo from './Logo'
import { langOptions } from '../i18n'

const navLink = {
  color: '#9fc2b8',
  textDecoration: 'none',
}

export default function Nav({ t, lang, onLangChange, connected, connectLabel, onConnect }) {
  const links = [
    { href: '#dashboard', label: t.navDash },
    { href: '#how', label: t.navHow },
    { href: '#refer', label: t.navRefer },
    { href: '#stake', label: t.navStake },
    { href: '#presale', label: t.navBuy },
    { href: '#rules', label: t.navRules },
    { href: '#token', label: t.navToken },
  ]

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backdropFilter: 'blur(14px)',
        background: 'rgba(3,16,13,0.6)',
        borderBottom: '1px solid rgba(31,224,168,0.12)',
      }}
    >
      <div
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '18px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
          <Logo size={32} />
          <span
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontWeight: 700,
              fontSize: '20px',
              letterSpacing: '0.04em',
              color: '#eafff8',
            }}
          >
            ORBIT
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '11px',
              color: '#1fe0a8',
              border: '1px solid rgba(31,224,168,0.3)',
              borderRadius: '6px',
              padding: '2px 6px',
            }}
          >
            $ORB
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '14px',
            color: '#9fc2b8',
            flexWrap: 'wrap',
          }}
        >
          {links.map((l) => (
            <Interactive
              key={l.href}
              as="a"
              href={l.href}
              style={navLink}
              hoverStyle={{ color: '#eafff8' }}
            >
              {l.label}
            </Interactive>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={lang}
            onChange={onLangChange}
            style={{
              fontFamily: "'Sora','Noto Sans Arabic','Noto Sans SC',sans-serif",
              fontSize: '13px',
              color: '#cdeee4',
              background: 'rgba(10,32,27,0.85)',
              border: '1px solid rgba(31,224,168,0.2)',
              borderRadius: '11px',
              padding: '9px 12px',
              cursor: 'pointer',
            }}
          >
            {langOptions.map((o) => (
              <option key={o.code} value={o.code} style={{ color: '#0a1512', background: '#eafff8' }}>
                {o.label}
              </option>
            ))}
          </select>

          <Interactive
            as="button"
            onClick={onConnect}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Space Grotesk',sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              color: '#03261d',
              background: 'linear-gradient(135deg,#7fffd4,#1fe0a8)',
              border: 'none',
              borderRadius: '11px',
              padding: '10px 16px',
              cursor: 'pointer',
              boxShadow: '0 6px 22px rgba(31,224,168,0.3)',
            }}
            hoverStyle={{
              boxShadow: '0 8px 30px rgba(31,224,168,0.5)',
              transform: 'translateY(-1px)',
            }}
          >
            {connected && (
              <span
                style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#03261d' }}
              />
            )}
            <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{connectLabel}</span>
          </Interactive>
        </div>
      </div>
    </nav>
  )
}
