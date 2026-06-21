// Telegram paper-plane mark as an inline SVG. Brand blue by default; `color` themes it.
export default function TelegramLogo({ size = 15, color = '#229ED9' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Telegram"
      role="img"
      style={{ display: 'block', flex: 'none' }}
    >
      <path
        fill={color}
        d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.57 8.16-1.86 8.77c-.14.62-.5.77-1.02.48l-2.82-2.08-1.36 1.31c-.15.15-.28.28-.57.28l.2-2.88 5.24-4.74c.23-.2-.05-.32-.35-.12l-6.48 4.08-2.79-.87c-.6-.19-.62-.6.13-.9l10.9-4.2c.5-.18.94.12.78.86Z"
      />
    </svg>
  )
}
