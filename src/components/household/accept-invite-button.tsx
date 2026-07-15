"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { acceptInvite } from "@/actions/household"

export function AcceptInviteButton({ invitationId }: { invitationId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      className="w-full"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await acceptInvite(invitationId)
          if (!result.success) {
            toast.error(result.error)
          }
        })
      }
    >
      {pending ? "Uniéndote…" : "Unirme al hogar"}
    </Button>
  )
}
