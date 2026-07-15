export const FREE_PLAN_MEMBER_LIMIT = 2

export function memberLimitForPlan(planTier: string | undefined) {
  return planTier === "PREMIUM" ? Number.MAX_SAFE_INTEGER : FREE_PLAN_MEMBER_LIMIT
}
