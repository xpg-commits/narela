// The five accent hues from the brand palette (globals.css --member-*
// tokens) doubling as the picklist for "my tasks are this color" — same
// colors as the theme, not a second competing set.
export const MEMBER_COLORS = {
  terracota: { label: "Terracota", cssVar: "--member-terracota" },
  oliva: { label: "Oliva", cssVar: "--member-oliva" },
  rosa: { label: "Rosa", cssVar: "--member-rosa" },
  azul: { label: "Azul", cssVar: "--member-azul" },
  mostaza: { label: "Mostaza", cssVar: "--member-mostaza" },
} as const

export type MemberColorKey = keyof typeof MEMBER_COLORS

export const DEFAULT_MEMBER_COLOR: MemberColorKey = "terracota"

export function isMemberColorKey(value: unknown): value is MemberColorKey {
  return typeof value === "string" && value in MEMBER_COLORS
}

export function memberColorVar(key: string | null | undefined): string {
  const resolved = isMemberColorKey(key) ? key : DEFAULT_MEMBER_COLOR
  return `var(${MEMBER_COLORS[resolved].cssVar})`
}
