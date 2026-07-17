import Link from "next/link"

import { ALL_FILTER_KEY, filterIcon, filterLabel, type FilterKey } from "@/lib/modules"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/brand/logo"

// Plain server-rendered links with query params — no client JS needed, the
// active chip is just whichever one matches the current URL. Horizontal
// scroll instead of wrapping keeps this a single row on a phone even with
// every module enabled, which is the point (mobile-first quick access).
// Order comes from Configuración del hogar; the primary module (if any) is
// always pinned right after "Todo", overriding custom order for that one.
export function ModuleFilterBar({
  order,
  enabled,
  primaryModuleKey,
  activeModule,
  ver,
}: {
  order: FilterKey[]
  enabled: FilterKey[]
  primaryModuleKey?: string | null
  activeModule?: FilterKey
  ver?: string
}) {
  const verSuffix = ver ? `&ver=${ver}` : ""
  const enabledSet = new Set(enabled)

  const visible = order.filter((key) => enabledSet.has(key))
  const pinned =
    primaryModuleKey && visible.includes(primaryModuleKey as FilterKey)
      ? (primaryModuleKey as FilterKey)
      : null
  const orderedKeys = pinned
    ? [
        ...visible.filter((k) => k === ALL_FILTER_KEY),
        pinned,
        ...visible.filter((k) => k !== ALL_FILTER_KEY && k !== pinned),
      ]
    : visible

  const chips = orderedKeys.map((key) => ({
    key,
    icon: filterIcon(key),
    label: filterLabel(key),
    href:
      key === ALL_FILTER_KEY
        ? `/dashboard?${ver ? `ver=${ver}` : ""}`
        : `/dashboard?modulo=${key}${verSuffix}`,
  }))

  return (
    <div
      data-tour="module-filter"
      className="-mx-6 flex gap-2.5 overflow-x-auto px-6 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {chips.map((chip, i) => {
        const isActive = chip.key === (activeModule ?? ALL_FILTER_KEY)
        return (
          <Link
            key={chip.key}
            href={chip.href}
            style={{ "--stagger": i } as React.CSSProperties}
            className={cn(
              "stagger-in flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95",
              isActive
                ? "bg-primary text-primary-foreground shadow-[0_4px_14px_-2px_rgba(70,60,140,0.35)]"
                : "bg-card text-muted-foreground shadow-[0_1px_2px_rgba(70,60,140,0.04)] ring-1 ring-foreground/[0.06] hover:text-foreground hover:shadow-[0_4px_12px_-2px_rgba(70,60,140,0.12)]"
            )}
          >
            {chip.key === ALL_FILTER_KEY ? (
              <Logo size={15} />
            ) : (
              <span>{chip.icon}</span>
            )}
            {chip.label}
          </Link>
        )
      })}
    </div>
  )
}
