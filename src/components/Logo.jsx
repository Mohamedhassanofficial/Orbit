// The orbital ORB mark. `size` controls the SVG box; the nav uses the
// gradient-filled core, the footer uses a flat fill (matching the design).
export default function Logo({ size = 32, flat = false, idSuffix = '' }) {
  const coreId = `orbCore${idSuffix}`
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {!flat && (
        <defs>
          <radialGradient id={coreId} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#9efce0" />
            <stop offset="55%" stopColor="#1fe0a8" />
            <stop offset="100%" stopColor="#0c7a5c" />
          </radialGradient>
        </defs>
      )}
      <ellipse
        cx="16"
        cy="16"
        rx="14.5"
        ry="6.2"
        stroke="#1fe0a8"
        strokeWidth="1.4"
        transform="rotate(-26 16 16)"
        opacity="0.85"
      />
      <circle cx="16" cy="16" r="6" fill={flat ? '#1fe0a8' : `url(#${coreId})`} />
      <circle cx="28" cy="9.6" r="1.9" fill="#7fffd4" />
    </svg>
  )
}
