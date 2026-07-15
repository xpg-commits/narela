import type { Prisma } from "@/generated/prisma/client"

type VisibilityMember = {
  id: string
  visibilityRole: string
}

/**
 * Single source of truth for "who can see this task". Never duplicate this
 * filter ad hoc in a page or action — a CHILD member seeing a sibling's or
 * adult's task is the easiest privacy bug to introduce by accident here.
 *
 * - CHILD: only tasks assigned to them or explicitly about them.
 * - ADULT / TEEN: every household-wide task, plus anything assigned to or
 *   about them (including ASSIGNED_ONLY tasks addressed to someone else stay
 *   hidden).
 */
export function visibleTaskWhere(member: VisibilityMember): Prisma.TaskWhereInput {
  if (member.visibilityRole === "CHILD") {
    return {
      OR: [{ assignedToMemberId: member.id }, { relatedMemberId: member.id }],
    }
  }

  return {
    OR: [
      { visibility: "HOUSEHOLD" },
      { assignedToMemberId: member.id },
      { relatedMemberId: member.id },
    ],
  }
}
