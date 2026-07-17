"use client"

import { useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CameraIcon } from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

type ActionResult = { success: true } | { success: false; error: string }

// Click-to-upload avatar used for pet/vehicle/child/profile photos — same
// widget everywhere something can "necesitar una foto para ser mejor
// identificado". The action is a Server Action pre-bound to the entity's id
// (e.g. updatePetPhotoAction.bind(null, petId)) passed down from the page.
export function EntityPhotoUpload({
  currentUrl,
  fallbackText,
  fallbackColor,
  uploadAction,
  size = 64,
}: {
  currentUrl?: string | null
  fallbackText: string
  fallbackColor?: string
  uploadAction: (formData: FormData) => Promise<ActionResult>
  size?: number
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => inputRef.current?.click()}
      className="group relative shrink-0 rounded-full disabled:opacity-60"
      style={{ width: size, height: size }}
      aria-label="Cambiar foto"
    >
      <Avatar style={{ width: size, height: size }}>
        {currentUrl && <AvatarImage src={currentUrl} />}
        <AvatarFallback
          style={fallbackColor ? { backgroundColor: fallbackColor, color: "white" } : undefined}
          className="text-lg font-medium"
        >
          {fallbackText}
        </AvatarFallback>
      </Avatar>
      <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
        <CameraIcon className="size-5 text-white" />
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ""
          if (!file) return
          const formData = new FormData()
          formData.set("photo", file)
          startTransition(async () => {
            const result = await uploadAction(formData)
            if (!result.success) {
              toast.error(result.error)
              return
            }
            router.refresh()
          })
        }}
      />
    </button>
  )
}
