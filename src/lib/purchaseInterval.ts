/**
 * Pure function, no DB access — average gap in days between consecutive
 * purchases. Needs at least 2 purchases to produce one gap; with 0 or 1
 * purchases there's no interval to learn yet.
 */
export function computeAvgPurchaseIntervalDays(purchaseDatesAsc: Date[]): number | null {
  if (purchaseDatesAsc.length < 2) return null

  const gapsInDays: number[] = []
  for (let i = 1; i < purchaseDatesAsc.length; i++) {
    const gapMs = purchaseDatesAsc[i].getTime() - purchaseDatesAsc[i - 1].getTime()
    gapsInDays.push(gapMs / (24 * 60 * 60 * 1000))
  }

  const avg = gapsInDays.reduce((sum, g) => sum + g, 0) / gapsInDays.length
  return Math.round(avg)
}

/** Whether a dormant (already-purchased) item is due to be suggested again. */
export function isDueForRepurchase(input: {
  lastPurchasedAt: Date | null
  avgPurchaseIntervalDays: number | null
  now?: Date
}): boolean {
  if (!input.lastPurchasedAt || !input.avgPurchaseIntervalDays) return false
  const now = input.now ?? new Date()
  const elapsedDays =
    (now.getTime() - input.lastPurchasedAt.getTime()) / (24 * 60 * 60 * 1000)
  return elapsedDays >= input.avgPurchaseIntervalDays
}
