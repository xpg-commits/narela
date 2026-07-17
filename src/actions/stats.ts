"use server"

import { requireActiveMember } from "@/lib/session"
import { getHouseholdStats } from "@/services/stats"
import { generateHouseholdSummary } from "@/lib/ai/summaryGenerator"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

type ActionResult =
  | { success: true; data: { summary: string } }
  | { success: false; error: string }

export async function generateSummaryAction(): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  try {
    const [stats, household] = await Promise.all([
      getHouseholdStats(householdId),
      auth.api.getFullOrganization({ headers: await headers() }),
    ])
    const summary = await generateHouseholdSummary(household?.name ?? "tu hogar", stats)
    return { success: true, data: { summary } }
  } catch (error) {
    console.error("No se pudo generar el resumen", error)
    return { success: false, error: "No se pudo generar el resumen. Inténtalo de nuevo." }
  }
}
