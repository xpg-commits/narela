"use client"

import { useEffect, useState } from "react"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const DISMISS_KEY = "wwwelly-install-dismissed"

// Chromium-only experimental event — not in TS's lib.dom.d.ts, so it's typed
// locally rather than guessed from `any`.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

// Nudges browser visitors to install the PWA. Never shown once already
// running standalone (i.e. from the installed app itself) or after being
// dismissed once — this is a one-time suggestion, not a recurring nag.
//
// Android/Chrome can trigger the real install prompt programmatically via
// beforeinstallprompt. iOS Safari has no equivalent API at all (Apple's
// choice, not a gap in this implementation) — "Añadir a pantalla de inicio"
// there is only reachable manually through the Share sheet, so iOS only
// gets instructions, never a button.
export function InstallBanner() {
  const [platform, setPlatform] = useState<"ios" | "android" | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    if (isStandalone) return

    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
    if (isIOS) {
      setPlatform("ios")
      setDismissed(false)
      return
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setPlatform("android")
      setDismissed(false)
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1")
    setDismissed(true)
  }

  async function install() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    dismiss()
  }

  if (dismissed || !platform) return null

  return (
    <div className="flex items-center gap-3 bg-secondary/60 px-4 py-2.5 text-sm">
      <span className="flex-1">
        {platform === "ios"
          ? 'Instala wwwelly: toca compartir y luego "Añadir a pantalla de inicio".'
          : "Instala wwwelly para un acceso más rápido, sin pasar por el navegador."}
      </span>
      {platform === "android" && (
        <Button size="sm" onClick={install}>
          Instalar
        </Button>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar"
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  )
}
