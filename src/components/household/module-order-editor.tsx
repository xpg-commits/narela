"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ChevronUpIcon, ChevronDownIcon, StarIcon } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  filterIcon,
  filterLabel,
  isHouseholdModuleKey,
  type FilterKey,
} from "@/lib/modules"
import {
  updateEnabledModulesAction,
  updateModuleOrderAction,
  updatePrimaryModuleAction,
} from "@/actions/household-settings"

export function ModuleOrderEditor({
  order,
  enabled,
  primaryModuleKey,
}: {
  order: FilterKey[]
  enabled: FilterKey[]
  primaryModuleKey: string | null
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [items, setItems] = useState(order)
  const [enabledSet, setEnabledSet] = useState(new Set(enabled))
  const [primary, setPrimary] = useState(primaryModuleKey)

  function move(index: number, direction: -1 | 1) {
    const next = [...items]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next)
    startTransition(async () => {
      const result = await updateModuleOrderAction(next)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      router.refresh()
    })
  }

  function toggle(key: FilterKey, checked: boolean) {
    const previous = enabledSet
    const next = new Set(enabledSet)
    if (checked) next.add(key)
    else next.delete(key)
    setEnabledSet(next)
    startTransition(async () => {
      const result = await updateEnabledModulesAction(Array.from(next))
      if (!result.success) {
        toast.error(result.error)
        setEnabledSet(previous)
        return
      }
      router.refresh()
    })
  }

  function setAsPrimary(key: string) {
    const previous = primary
    const next = primary === key ? null : key
    setPrimary(next)
    startTransition(async () => {
      const result = await updatePrimaryModuleAction(next)
      if (!result.success) {
        toast.error(result.error)
        setPrimary(previous)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="space-y-1">
      {items.map((key, index) => (
        <div key={key} className="list-row justify-between">
          <div className="flex items-center gap-1">
            <div className="flex flex-col">
              <button
                type="button"
                disabled={pending || index === 0}
                onClick={() => move(index, -1)}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                aria-label="Subir"
              >
                <ChevronUpIcon className="size-3.5" />
              </button>
              <button
                type="button"
                disabled={pending || index === items.length - 1}
                onClick={() => move(index, 1)}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                aria-label="Bajar"
              >
                <ChevronDownIcon className="size-3.5" />
              </button>
            </div>
            <span>{filterIcon(key)}</span>
            <span className="text-sm">{filterLabel(key)}</span>
          </div>
          <div className="flex items-center gap-3">
            {isHouseholdModuleKey(key) && (
              <button
                type="button"
                disabled={pending}
                onClick={() => setAsPrimary(key)}
                title="Marcar como principal"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  primary === key && "text-primary"
                )}
              >
                <StarIcon className={cn("size-4", primary === key && "fill-current")} />
              </button>
            )}
            <Switch
              checked={enabledSet.has(key)}
              disabled={pending}
              onCheckedChange={(checked) => toggle(key, checked === true)}
              aria-label={`Activar ${filterLabel(key)}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
