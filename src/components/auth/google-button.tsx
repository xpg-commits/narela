"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function GoogleButton({ label }: { label: string }) {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={loading}
      onClick={async () => {
        setLoading(true)
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
        })
      }}
    >
      {loading ? "Conectando…" : label}
    </Button>
  )
}
