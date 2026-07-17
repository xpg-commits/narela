"use client"

import { useRef, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { sendSupportMessageAction } from "@/actions/support"

export function SupportForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, startTransition] = useTransition()

  return (
    <form
      ref={formRef}
      className="space-y-4"
      action={(formData: FormData) => {
        startTransition(async () => {
          const result = await sendSupportMessageAction(formData)
          if (!result.success) {
            toast.error(result.error)
            return
          }
          toast.success("Mensaje enviado — te respondemos en breve.")
          formRef.current?.reset()
        })
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="subject">Asunto</Label>
        <Input id="subject" name="subject" placeholder="¿En qué podemos ayudarte?" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea id="message" name="message" rows={5} required />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Enviando…" : "Enviar a soporte"}
      </Button>
    </form>
  )
}
