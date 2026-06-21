import { useState } from 'react'

/**
 * Renders any element with inline `style`, plus optional `hoverStyle` /
 * `focusStyle` that are merged in while the element is hovered / focused.
 *
 * This reproduces the design's `style-hover` and `style-focus` attributes:
 * inline styles in React don't support :hover/:focus, and CSS classes can't
 * override inline styles, so we track the state and merge the overrides.
 *
 * Intentional deviation from the DC runtime: that runtime compiles
 * `style-hover`/`style-focus` into generated `:hover`/`:focus` class rules with
 * no `!important`, so they can't beat the element's inline `style` — several of
 * the design's hover/focus effects (nav-link color, ghost-button bg/border,
 * input border-color) are actually inert in the rendered ORBIT.html. Merging the
 * full override on state instead makes every hover/focus the author wrote work,
 * which realizes the design intent.
 *
 *   <Interactive as="a" href="#refer" style={base} hoverStyle={over}>…</Interactive>
 */
export default function Interactive({
  as = 'div',
  style,
  hoverStyle,
  focusStyle,
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}) {
  const Tag = as
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const merged = {
    ...style,
    ...(hovered && hoverStyle ? hoverStyle : null),
    ...(focused && focusStyle ? focusStyle : null),
  }

  return (
    <Tag
      style={merged}
      onMouseEnter={(e) => {
        if (hoverStyle) setHovered(true)
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        if (hoverStyle) setHovered(false)
        onMouseLeave?.(e)
      }}
      onFocus={(e) => {
        if (focusStyle) setFocused(true)
        onFocus?.(e)
      }}
      onBlur={(e) => {
        if (focusStyle) setFocused(false)
        onBlur?.(e)
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
