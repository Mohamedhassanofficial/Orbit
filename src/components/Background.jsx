// Fixed cosmic background: aurora gradient wash, a repeating starfield, and
// two slowly drifting blurred glows. Ported 1:1 from the design.
export default function Background() {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background:
            'radial-gradient(1300px 760px at 78% -12%, rgba(31,224,168,0.16), transparent 60%), radial-gradient(1000px 640px at 6% 108%, rgba(56,245,201,0.10), transparent 60%), radial-gradient(760px 540px at 94% 92%, rgba(90,217,255,0.06), transparent 60%), #03100d',
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(1px 1px at 24px 32px,#cfeee4,transparent),radial-gradient(1px 1px at 128px 88px,#ffffff,transparent),radial-gradient(1px 1px at 200px 150px,#9fe9d6,transparent),radial-gradient(1.4px 1.4px at 300px 60px,#ffffff,transparent),radial-gradient(1px 1px at 360px 200px,#bfeede,transparent),radial-gradient(1px 1px at 80px 240px,#e8fff8,transparent),radial-gradient(1.2px 1.2px at 440px 120px,#ffffff,transparent)',
          backgroundSize: '480px 300px',
          backgroundRepeat: 'repeat',
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '-160px',
          right: '-120px',
          zIndex: 0,
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          filter: 'blur(70px)',
          background: 'radial-gradient(circle,rgba(31,224,168,0.22),transparent 70%)',
          animation: 'auroraDrift 28s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-200px',
          left: '-140px',
          zIndex: 0,
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          filter: 'blur(80px)',
          background: 'radial-gradient(circle,rgba(90,217,255,0.14),transparent 70%)',
          animation: 'auroraDrift 36s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}
