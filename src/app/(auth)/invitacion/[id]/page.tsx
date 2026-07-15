import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { APIError } from "better-auth"

import { auth } from "@/lib/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AcceptInviteButton } from "@/components/household/accept-invite-button"

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  if (!session) {
    redirect(`/login?next=/invitacion/${id}`)
  }

  let invitation
  try {
    invitation = await auth.api.getInvitation({
      query: { id },
      headers: reqHeaders,
    })
  } catch (error) {
    if (error instanceof APIError) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Invitación no disponible</CardTitle>
            <CardDescription>
              {error.body?.message ?? "Este enlace ya no es válido."}
            </CardDescription>
          </CardHeader>
        </Card>
      )
    }
    throw error
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Te han invitado a {invitation.organizationName}</CardTitle>
        <CardDescription>
          Acepta para empezar a compartir tareas, mascotas, vehículos y más.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AcceptInviteButton invitationId={id} />
      </CardContent>
    </Card>
  )
}
