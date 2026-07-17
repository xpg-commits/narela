"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckIcon } from "lucide-react"

import { MEMBER_COLORS, type MemberColorKey } from "@/lib/memberColors"
import { updateMyColorAction } from "@/actions/profile"
import { cn } from "@/lib/utils"

export function ColorPickerForm({ currentColor }: { currentColor: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [selected, setSelected] = useState(currentColor)

  return (
    <div className="flex flex-wrap gap-3">
      {(Object.keys(MEMBER_COLORS) as MemberColorKey[]).map((key) => {
        const { label, cssVar } = MEMBER_COLORS[key]
        const isSelected = selected === key
        return (
          <button
            key={key}
            type="button"
            disabled={pending}
            onClick={() => {
              const previous = selected
              setSelected(key)
              startTransition(async () => {
                const result = await updateMyColorAction(key)
                if (!result.success) {
                  toast.error(result.error)
                  setSelected(previous)
                  return
                }
                router.refresh()
              })
            }}
            className={cn(
              "flex size-11 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-background transition-transform hover:scale-105 disabled:opacity-60",
              isSelected ? "ring-foreground/60" : "ring-transparent"
            )}
            style={{ backgroundColor: `var(${cssVar})` }}
            title={label}
          >
            {isSelected && <CheckIcon className="size-4 text-white drop-shadow" />}
          </button>
        )
      })}
    </div>
  )
}
