import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InviteMemberForm } from "@/components/household/invite-member-form"

const ROLE_LABEL: Record<string, string> = {
  ADULT: "Adulto",
  TEEN: "Adolescente",
  CHILD: "Niño/a",
}

export default async function MiembrosPage() {
  const reqHeaders = await headers()
  const household = await auth.api.getFullOrganization({ headers: reqHeaders })

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Miembros</h1>
        <p className="text-muted-foreground">
          Invita a tu pareja, hijos o abuelos a {household?.name}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invitar a alguien</CardTitle>
          <CardDescription>
            Plan gratuito: hasta 2 personas por hogar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteMemberForm />
        </CardContent>
      </Card>

      <div className="space-y-2">
        {household?.members.map((member) => {
          const visibilityRole = (member as { visibilityRole?: string })
            .visibilityRole
          return (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-md border px-4 py-3"
            >
              <div>
                <p className="font-medium">{member.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
              <Badge variant="secondary">
                {(visibilityRole && ROLE_LABEL[visibilityRole]) ?? "Adulto"}
              </Badge>
            </div>
          )
        })}
      </div>
    </div>
  )
}
