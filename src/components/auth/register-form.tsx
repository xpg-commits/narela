"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { GoogleButton } from "@/components/auth/google-button"
import { authClient } from "@/lib/auth-client"

const schema = z.object({
  name: z.string().min(1, "Dinos cómo te llamas."),
  email: z.string().email("Introduce un email válido."),
  password: z.string().min(8, "Al menos 8 caracteres."),
})

export function RegisterForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setServerError(null)
    const { error } = await authClient.signUp.email(values)
    if (error) {
      setServerError(error.message ?? "No se pudo crear la cuenta.")
      return
    }
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
          </Button>
        </form>
      </Form>
      {googleEnabled && (
        <>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            o
            <div className="h-px flex-1 bg-border" />
          </div>
          <GoogleButton label="Continuar con Google" />
        </>
      )}
    </div>
  )
}
