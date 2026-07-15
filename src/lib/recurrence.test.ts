import { describe, expect, it } from "vitest"
import { computeNextOccurrence } from "./recurrence"

describe("computeNextOccurrence", () => {
  it("returns null when recurrenceType is NONE", () => {
    const result = computeNextOccurrence({
      recurrenceType: "NONE",
      recurrenceIntervalDays: 30,
      dueDate: null,
      completedAt: new Date("2026-07-15"),
    })
    expect(result).toBeNull()
  })

  it("returns null when there is no interval", () => {
    const result = computeNextOccurrence({
      recurrenceType: "REACTIVE",
      recurrenceIntervalDays: null,
      dueDate: null,
      completedAt: new Date("2026-07-15"),
    })
    expect(result).toBeNull()
  })

  it("REACTIVE anchors to completedAt, ignoring the original due date", () => {
    const result = computeNextOccurrence({
      recurrenceType: "REACTIVE",
      recurrenceIntervalDays: 30,
      dueDate: new Date("2026-07-01"), // was due earlier, but completed late
      completedAt: new Date("2026-07-15"),
    })
    expect(result?.toISOString().slice(0, 10)).toBe("2026-08-14")
  })

  it("FIXED_SCHEDULE anchors to the original due date, not completedAt", () => {
    const result = computeNextOccurrence({
      recurrenceType: "FIXED_SCHEDULE",
      recurrenceIntervalDays: 365,
      dueDate: new Date("2026-07-01"),
      completedAt: new Date("2026-07-20"), // done ~3 weeks late
    })
    // Next occurrence should NOT drift by the 19-day delay.
    expect(result?.toISOString().slice(0, 10)).toBe("2027-07-01")
  })

  it("FIXED_SCHEDULE falls back to completedAt when there was no due date", () => {
    const result = computeNextOccurrence({
      recurrenceType: "FIXED_SCHEDULE",
      recurrenceIntervalDays: 90,
      dueDate: null,
      completedAt: new Date("2026-07-15"),
    })
    expect(result?.toISOString().slice(0, 10)).toBe("2026-10-13")
  })
})
