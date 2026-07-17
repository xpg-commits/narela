// Three overlapping circles in a triangular arrangement, blended with
// multiply where they intersect — the "color mixing" diagram look the user
// asked for, minimalist and in the brand palette instead of literal RGB.
export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden
    >
      <g style={{ mixBlendMode: "multiply" }}>
        <circle cx="20" cy="13" r="11" fill="var(--member-terracota)" fillOpacity="0.85" />
        <circle cx="12" cy="26" r="11" fill="var(--member-azul)" fillOpacity="0.85" />
        <circle cx="28" cy="26" r="11" fill="var(--member-mostaza)" fillOpacity="0.85" />
      </g>
    </svg>
  )
}
