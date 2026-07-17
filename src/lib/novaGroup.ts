// NOVA food-processing classification (1 = unprocessed/minimally processed,
// 4 = ultra-processed) mapped to a traffic-light dot. Deliberately not using
// the --member-* palette here — those identify people, this identifies food
// quality, and reusing the same hues would conflate the two at a glance.
const NOVA_COLOR: Record<number, string> = {
  1: "oklch(0.62 0.15 145)", // green — real food
  2: "oklch(0.62 0.15 145)", // processed culinary ingredients (oil, salt…) — still fine
  3: "oklch(0.75 0.15 80)", // amber — processed food
  4: "oklch(0.62 0.19 25)", // red — ultra-processed
}

export function novaGroupColor(novaGroup: number | null | undefined): string | null {
  if (!novaGroup) return null
  return NOVA_COLOR[novaGroup] ?? null
}

export function novaGroupLabel(novaGroup: number | null | undefined): string | null {
  switch (novaGroup) {
    case 1:
    case 2:
      return "Comida real"
    case 3:
      return "Procesado"
    case 4:
      return "Ultraprocesado"
    default:
      return null
  }
}
