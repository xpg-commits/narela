import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { requireActiveMember } from "@/lib/session"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FREE_PLAN_MEMBER_LIMIT } from "@/lib/plan"
import { ChangePasswordForm } from "@/components/profile/change-password-form"

export default async function CuentaPage() {
  const { session } = await requireActiveMember()
  const reqHeaders = await headers()
  const household = await auth.api.getFullOrganization({ headers: reqHeaders })

  const planTier = (household as { planTier?: string })?.planTier ?? "FREE"
  const isPremium = planTier === "PREMIUM"

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cuenta</h1>
        <p className="text-muted-foreground">Tus datos y tu plan.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Nombre: </span>
            {session.user.name}
          </p>
          <p>
            <span className="text-muted-foreground">Email: </span>
            {session.user.email}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contraseña</CardTitle>
          <CardDescription>Cambia tu contraseña de acceso.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Plan
            <Badge variant={isPremium ? "default" : "secondary"}>
              {isPremium ? "Premium" : "Gratis"}
            </Badge>
          </CardTitle>
          <CardDescription>
            {isPremium
              ? "Miembros ilimitados en tu hogar."
              : `Hasta ${FREE_PLAN_MEMBER_LIMIT} personas por hogar.`}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
