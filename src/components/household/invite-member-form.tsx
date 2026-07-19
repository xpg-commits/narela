"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { inviteMember } from "@/actions/household"

export function InviteMemberForm() {
  const [pending, startTransition] = useTransition()

  return (
    <form
      className="flex items-end gap-2"
      action={(formData: FormData) => {
        startTransition(async () => {
          const result = await inviteMember(formData)
          if (!result.success) {
            toast.error(result.error)
            return
          }
          toast.success("Invitación enviada por email.")
        })
      }}
    >
      <div className="flex-1 space-y-2">
        <Label htmlFor="email">Invitar por email</Label>
        <Input id="email" name="email" type="email" placeholder="pareja@ejemplo.com" required />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Invitando…" : "Invitar"}
      </Button>
    </form>
  )
}
