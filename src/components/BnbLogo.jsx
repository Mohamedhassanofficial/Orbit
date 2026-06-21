// Official BNB (Binance Coin) diamond mark as an inline SVG — crisp at any size,
// no external asset. Color defaults to the BNB brand gold; pass `color` to theme it.
export default function BnbLogo({ size = 18, color = '#F3BA2F' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="BNB"
      role="img"
      style={{ display: 'block', flex: 'none' }}
    >
      <path
        fill={color}
        d="M7.49 9.7 12 5.18l4.51 4.52 2.62-2.62L12 0 4.87 7.08 7.49 9.7ZM0 12l2.62-2.62L5.24 12l-2.62 2.62L0 12Zm7.49 2.3L12 18.82l4.51-4.52 2.62 2.61L12 24l-7.13-7.08-.01-.01 2.63-2.61ZM18.76 12l2.62-2.62L24 12l-2.62 2.62L18.76 12Zm-4.13-.01h.01L12 9.36l-2.2 2.2-.25.25-.01.01v.01l2.45 2.45 2.63-2.63Z"
      />
    </svg>
  )
}
