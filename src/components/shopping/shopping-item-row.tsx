"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Checkbox } from "@/components/ui/checkbox"
import { markItemPurchasedAction, reactivateItemAction } from "@/actions/shopping"
import { memberColorVar } from "@/lib/memberColors"
import { novaGroupColor, novaGroupLabel } from "@/lib/novaGroup"

type Member = { color: string; displayName: string | null; user: { name: string } } | null

export function ShoppingItemRow({
  id,
  name,
  novaGroup,
  addedBy,
  checked = false,
  checkedBy,
}: {
  id: string
  name: string
  novaGroup?: number | null
  addedBy?: Member
  checked?: boolean
  checkedBy?: Member
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const dotColor = novaGroupColor(novaGroup)
  const addedByName = addedBy?.displayName ?? addedBy?.user.name

  return (
    <label
      className={`list-row has-[[data-disabled]]:opacity-60 ${checked ? "bg-muted/50" : ""}`}
    >
      <Checkbox
        checked={checked}
        disabled={pending}
        onCheckedChange={(value) => {
          startTransition(async () => {
            const result =
              value === true
                ? await markItemPurchasedAction(id)
                : await reactivateItemAction(id)
            if (!result.success) {
              toast.error(result.error)
              return
            }
            router.refresh()
          })
        }}
      />
      {dotColor && (
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: dotColor }}
          title={novaGroupLabel(novaGroup) ?? undefined}
          aria-hidden
        />
      )}
      <span className={`flex-1 text-sm ${checked ? "text-muted-foreground line-through" : ""}`}>
        {name}
      </span>
      {addedBy && !checked && (
        <span
          className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-white"
          style={{ backgroundColor: memberColorVar(addedBy.color) }}
          title={`Añadido por ${addedByName}`}
        >
          {addedByName?.trim().charAt(0).toUpperCase() ?? "?"}
        </span>
      )}
      {checked && checkedBy && (
        <span className="text-xs text-muted-foreground">
          {checkedBy.displayName ?? checkedBy.user.name}
        </span>
      )}
    </label>
  )
}
