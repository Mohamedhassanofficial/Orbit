// X (formerly Twitter) mark as an inline SVG. Defaults to the theme text color.
export default function XLogo({ size = 13, color = '#eafff8' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="X"
      role="img"
      style={{ display: 'block', flex: 'none' }}
    >
      <path
        fill={color}
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z"
      />
    </svg>
  )
}
