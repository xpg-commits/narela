"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export function ChangePasswordForm() {
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        Cambiar contraseña
      </Button>
    )
  }

  return (
    <form
      ref={formRef}
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const currentPassword = String(formData.get("currentPassword") ?? "")
        const newPassword = String(formData.get("newPassword") ?? "")
        const confirmPassword = String(formData.get("confirmPassword") ?? "")

        if (newPassword.length < 8) {
          toast.error("La contraseña nueva debe tener al menos 8 caracteres.")
          return
        }
        if (newPassword !== confirmPassword) {
          toast.error("Las contraseñas nuevas no coinciden.")
          return
        }

        startTransition(async () => {
          const { error } = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
          })
          if (error) {
            toast.error(error.message ?? "No se pudo cambiar la contraseña.")
            return
          }
          toast.success("Contraseña actualizada.")
          formRef.current?.reset()
          setOpen(false)
        })
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Contraseña actual</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">Contraseña nueva</Label>
        <Input id="newPassword" name="newPassword" type="password" required minLength={8} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Repite la contraseña nueva</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar contraseña"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
