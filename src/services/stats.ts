import { startOfWeek, subWeeks, format } from "date-fns"
import { es } from "date-fns/locale"

import { db } from "@/lib/db"

const WEEKS_OF_HISTORY = 12

export type WeeklyCompletionPoint = { weekLabel: string; count: number }

export type MemberContribution = {
  memberId: string
  name: string
  color: string
  count: number
}

export type HouseholdStats = {
  weekly: WeeklyCompletionPoint[]
  byMember: MemberContribution[]
  totalCompleted: number
}

export async function getHouseholdStats(householdId: string): Promise<HouseholdStats> {
  const since = startOfWeek(subWeeks(new Date(), WEEKS_OF_HISTORY - 1), { weekStartsOn: 1 })

  const tasks = await db.task.findMany({
    where: { householdId, status: "DONE", completedAt: { gte: since } },
    select: {
      completedAt: true,
      assignedToMemberId: true,
      assignedTo: {
        select: {
          displayName: true,
          color: true,
          user: { select: { name: true } },
        },
      },
    },
  })

  // Build the full 12-week axis up front so quiet weeks show as zero instead
  // of just not existing on the chart.
  const weekBuckets = new Map<string, number>()
  for (let i = 0; i < WEEKS_OF_HISTORY; i++) {
    const weekStart = startOfWeek(subWeeks(new Date(), WEEKS_OF_HISTORY - 1 - i), {
      weekStartsOn: 1,
    })
    weekBuckets.set(weekStart.toISOString(), 0)
  }

  const memberTotals = new Map<string, MemberContribution>()

  for (const task of tasks) {
    if (task.completedAt) {
      const weekStart = startOfWeek(task.completedAt, { weekStartsOn: 1 }).toISOString()
      weekBuckets.set(weekStart, (weekBuckets.get(weekStart) ?? 0) + 1)
    }

    if (task.assignedToMemberId && task.assignedTo) {
      const existing = memberTotals.get(task.assignedToMemberId)
      const name = task.assignedTo.displayName ?? task.assignedTo.user.name
      if (existing) {
        existing.count += 1
      } else {
        memberTotals.set(task.assignedToMemberId, {
          memberId: task.assignedToMemberId,
          name,
          color: task.assignedTo.color,
          count: 1,
        })
      }
    }
  }

  const weekly = Array.from(weekBuckets.entries()).map(([iso, count]) => ({
    weekLabel: format(new Date(iso), "d MMM", { locale: es }),
    count,
  }))

  const byMember = Array.from(memberTotals.values()).sort((a, b) => b.count - a.count)

  return { weekly, byMember, totalCompleted: tasks.length }
}
