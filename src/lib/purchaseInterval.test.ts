import { describe, expect, it } from "vitest"
import { computeAvgPurchaseIntervalDays, isDueForRepurchase } from "./purchaseInterval"

describe("computeAvgPurchaseIntervalDays", () => {
  it("returns null with fewer than 2 purchases", () => {
    expect(computeAvgPurchaseIntervalDays([])).toBeNull()
    expect(computeAvgPurchaseIntervalDays([new Date("2026-01-01")])).toBeNull()
  })

  it("returns the single gap for two purchases (~15 days apart)", () => {
    const result = computeAvgPurchaseIntervalDays([
      new Date("2026-01-01T00:00:00Z"),
      new Date("2026-01-16T00:00:00Z"),
    ])
    expect(result).toBe(15)
  })

  it("averages multiple gaps", () => {
    const result = computeAvgPurchaseIntervalDays([
      new Date("2026-01-01T00:00:00Z"),
      new Date("2026-01-11T00:00:00Z"), // gap 10
      new Date("2026-01-31T00:00:00Z"), // gap 20
    ])
    expect(result).toBe(15) // (10 + 20) / 2
  })
})

describe("isDueForRepurchase", () => {
  it("is false with no purchase history", () => {
    expect(
      isDueForRepurchase({ lastPurchasedAt: null, avgPurchaseIntervalDays: null })
    ).toBe(false)
  })

  it("is false before the average interval has elapsed", () => {
    const now = new Date("2026-01-10T00:00:00Z")
    expect(
      isDueForRepurchase({
        lastPurchasedAt: new Date("2026-01-01T00:00:00Z"),
        avgPurchaseIntervalDays: 15,
        now,
      })
    ).toBe(false)
  })

  it("is true once the average interval has elapsed", () => {
    const now = new Date("2026-01-16T00:00:00Z")
    expect(
      isDueForRepurchase({
        lastPurchasedAt: new Date("2026-01-01T00:00:00Z"),
        avgPurchaseIntervalDays: 15,
        now,
      })
    ).toBe(true)
  })
})
