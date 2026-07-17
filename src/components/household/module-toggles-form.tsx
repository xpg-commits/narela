"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { HOUSEHOLD_MODULES, type HouseholdModuleKey } from "@/lib/modules"
import { updateEnabledModulesAction } from "@/actions/household-settings"

export function ModuleTogglesForm({
  enabledModules,
}: {
  enabledModules: HouseholdModuleKey[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [enabled, setEnabled] = useState<Set<HouseholdModuleKey>>(
    new Set(enabledModules)
  )

  function toggle(key: HouseholdModuleKey, checked: boolean) {
    const previous = enabled
    const next = new Set(enabled)
    if (checked) next.add(key)
    else next.delete(key)
    setEnabled(next)

    startTransition(async () => {
      const result = await updateEnabledModulesAction(Array.from(next))
      if (!result.success) {
        toast.error(result.error)
        setEnabled(previous)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="space-y-1">
      {HOUSEHOLD_MODULES.map((module) => (
        <div
          key={module.key}
          className="list-row justify-between"
        >
          <Label htmlFor={`module-${module.key}`} className="flex-1 cursor-pointer">
            {module.icon} {module.label}
          </Label>
          <Switch
            id={`module-${module.key}`}
            checked={enabled.has(module.key)}
            disabled={pending}
            onCheckedChange={(checked) => toggle(module.key, checked === true)}
          />
        </div>
      ))}
    </div>
  )
}
