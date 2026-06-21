import Interactive from './Interactive'

const headingFamily = "'Space Grotesk','Noto Kufi Arabic','Noto Sans SC',sans-serif"
// Card titles, buttons and the success/staked titles share the SC-before-Kufi
// stack in the design (distinct from the Kufi-first section-heading stack).
const btnFamily = "'Space Grotesk','Noto Sans SC','Noto Kufi Arabic',sans-serif"

const inputStyle = {
  width: '100%',
  fontFamily: "'JetBrains Mono',monospace",
  fontSize: '14px',
  color: '#eafff8',
  background: 'rgba(3,16,13,0.6)',
  border: '1px solid rgba(31,224,168,0.2)',
  borderRadius: '12px',
  padding: '14px 16px',
  marginBottom: '18px',
}
const inputFocus = {
  borderColor: '#1fe0a8',
  boxShadow: '0 0 0 3px rgba(31,224,168,0.15)',
}
const labelStyle = { display: 'block', fontSize: '13px', color: '#9fc2b8', marginBottom: '8px' }

export default function ReferralForm({
  t,
  refSelf,
  refTarget,
  onSelf,
  onTarget,
  refError,
  showRefForm,
  refSubmitted,
  succBody,
  onSubmit,
  onReset,
}) {
  return (
    <section
      id="refer"
      style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 28px 64px', scrollMarginTop: '80px' }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
        <div style={{ flex: '1 1 360px', minWidth: '300px' }}>
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
            {t.referEyebrow}
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
            {t.referTitle}
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#9fc2b8', margin: '0 0 24px' }}>
            {t.referSub}
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {[t.referLi1, t.referLi2, t.referLi3].map((li, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: '11px',
                  alignItems: 'flex-start',
                  fontSize: '15px',
                  color: '#cdeee4',
                }}
              >
                <span style={{ color: '#1fe0a8', fontWeight: 700 }}>✓</span> {li}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(12,42,34,0.7), rgba(8,28,38,0.6))',
              border: '1px solid rgba(31,224,168,0.2)',
              borderRadius: '22px',
              padding: '30px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            }}
          >
            {showRefForm && (
              <div>
                <label style={labelStyle}>{t.lblSelf}</label>
                <Interactive
                  as="input"
                  value={refSelf}
                  onChange={onSelf}
                  placeholder={t.phSelf}
                  dir="ltr"
                  style={inputStyle}
                  focusStyle={inputFocus}
                />
                <label style={labelStyle}>{t.lblTarget}</label>
                <Interactive
                  as="input"
                  value={refTarget}
                  onChange={onTarget}
                  placeholder={t.phTarget}
                  dir="ltr"
                  style={inputStyle}
                  focusStyle={inputFocus}
                />
                {refError && (
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
                    {refError}
                  </div>
                )}
                <Interactive
                  as="button"
                  onClick={onSubmit}
                  style={{
                    width: '100%',
                    fontFamily: btnFamily,
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#03261d',
                    background: 'linear-gradient(135deg,#7fffd4,#1fe0a8)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 26px rgba(31,224,168,0.3)',
                  }}
                  hoverStyle={{
                    transform: 'translateY(-1px)',
                    boxShadow: '0 12px 34px rgba(31,224,168,0.5)',
                  }}
                >
                  {t.btnSubmit}
                </Interactive>
                <div style={{ fontSize: '12px', color: '#7fa99e', textAlign: 'center', marginTop: '14px' }}>
                  {t.submitNote}
                </div>
              </div>
            )}

            {refSubmitted && (
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    margin: '0 auto 18px',
                    background: 'radial-gradient(circle at 35% 30%, #9efce0, #1fe0a8 50%, #0c7a5c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 40px rgba(31,224,168,0.5)',
                  }}
                >
                  <span style={{ fontSize: '30px', color: '#03261d' }}>✓</span>
                </div>
                <div
                  style={{ fontFamily: btnFamily, fontWeight: 700, fontSize: '24px', marginBottom: '10px' }}
                >
                  {t.succTitle}
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#9fc2b8', margin: '0 0 20px' }}>
                  {succBody}
                </p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
                  <div
                    style={{
                      flex: 1,
                      background: 'rgba(3,16,13,0.6)',
                      border: '1px solid rgba(31,224,168,0.16)',
                      borderRadius: '12px',
                      padding: '14px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Space Grotesk',sans-serif",
                        fontWeight: 700,
                        fontSize: '20px',
                        color: '#1fe0a8',
                      }}
                    >
                      {t.succPayoutV}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7fa99e' }}>{t.succPayoutL}</div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: 'rgba(3,16,13,0.6)',
                      border: '1px solid rgba(31,224,168,0.16)',
                      borderRadius: '12px',
                      padding: '14px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Space Grotesk',sans-serif",
                        fontWeight: 700,
                        fontSize: '20px',
                        color: '#5ad9ff',
                      }}
                    >
                      {t.succGuarV}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7fa99e' }}>{t.succGuarL}</div>
                  </div>
                </div>
                <Interactive
                  as="button"
                  onClick={onReset}
                  style={{
                    fontFamily: btnFamily,
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#eafff8',
                    background: 'rgba(12,38,32,0.6)',
                    border: '1px solid rgba(31,224,168,0.25)',
                    borderRadius: '11px',
                    padding: '12px 22px',
                    cursor: 'pointer',
                  }}
                  hoverStyle={{ borderColor: 'rgba(31,224,168,0.6)' }}
                >
                  {t.succAgain}
                </Interactive>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
