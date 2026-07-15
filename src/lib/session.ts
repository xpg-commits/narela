import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

// Shared by pages and Server Actions that need "who is asking, and as which
// household member". Redirects instead of throwing when there's no session
// or no active household — every caller is already inside a route that
// proxy.ts / (app)/layout.tsx has already gated, so reaching this function
// without either means the session expired mid-request.
export async function requireActiveMember() {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })
  if (!session) {
    redirect("/login")
  }
  if (!session.session.activeOrganizationId) {
    redirect("/dashboard")
  }

  const member = await auth.api.getActiveMember({ headers: reqHeaders })
  if (!member) {
    redirect("/dashboard")
  }

  return {
    session,
    member,
    householdId: session.session.activeOrganizationId,
  }
}
