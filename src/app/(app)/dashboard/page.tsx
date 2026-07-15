import { headers } from "next/headers"

import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })
  const household = await auth.api.getFullOrganization({ headers: reqHeaders })

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-2 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Buenos días, {session?.user.name?.split(" ")[0] ?? ""} 👋
      </h1>
      <p className="text-muted-foreground">
        {household?.name} tiene {household?.members.length ?? 0}{" "}
        {household?.members.length === 1 ? "miembro" : "miembros"}. El
        dashboard de Hoy / Esta semana / Más adelante llega en la siguiente
        fase.
      </p>
    </div>
  )
}
