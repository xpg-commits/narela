// Two large soft blurred color fields, fixed behind the whole app — the
// moodboard's glow-behind-the-phone look, dialed down to a faint wash so it
// never competes with real content sitting on top.
export function BackgroundOrbs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="bg-orb -top-32 -right-32 size-96 opacity-40"
        style={{ backgroundColor: "var(--gradient-start)" }}
      />
      <div
        className="bg-orb -bottom-40 -left-24 size-[28rem] opacity-30"
        style={{ backgroundColor: "var(--gradient-end)" }}
      />
    </div>
  )
}
