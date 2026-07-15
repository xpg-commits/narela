import { addDays } from "date-fns"

export type RecurrenceType = "NONE" | "FIXED_SCHEDULE" | "REACTIVE"

export type RecurrenceInput = {
  recurrenceType: RecurrenceType
  recurrenceIntervalDays: number | null
  dueDate: Date | null
  completedAt: Date
}

/**
 * Pure function, no DB access — the two anchors intentionally diverge:
 * - REACTIVE anchors to when the task was actually completed (e.g. "cambiar
 *   filtro" every 30 days after you actually change it).
 * - FIXED_SCHEDULE anchors to the original due date, so a late ITV/seguro
 *   renewal doesn't drift the whole schedule forward.
 */
export function computeNextOccurrence(input: RecurrenceInput): Date | null {
  if (input.recurrenceType === "NONE") return null
  if (!input.recurrenceIntervalDays || input.recurrenceIntervalDays <= 0) return null

  if (input.recurrenceType === "REACTIVE") {
    return addDays(input.completedAt, input.recurrenceIntervalDays)
  }

  // FIXED_SCHEDULE: anchor to the due date if there was one, otherwise fall
  // back to completion date (a fixed-schedule task with no due date has no
  // "theoretical" date to anchor to).
  const anchor = input.dueDate ?? input.completedAt
  return addDays(anchor, input.recurrenceIntervalDays)
}
