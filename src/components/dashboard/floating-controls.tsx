import Link from "next/link"
import { BarChart3Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { AddTaskDialog } from "@/components/tasks/add-task-dialog"

// Fixed to the viewport, mobile-first: the mine/all switcher + a low-key
// "resumen" link sit bottom-left, the primary add-task action bottom-right
// where a thumb naturally rests.
export function FloatingControls({
  ver,
  modulo,
  members,
  currentMemberId,
}: {
  ver?: string
  modulo?: string
  members: { id: string; name: string }[]
  currentMemberId: string
}) {
  const modSuffix = modulo ? `modulo=${modulo}&` : ""

  return (
    <>
      <div className="fixed bottom-5 left-4 z-40 flex items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-full bg-card/90 p-1 text-xs font-medium shadow-[0_4px_16px_-2px_rgba(70,60,140,0.16)] ring-1 ring-foreground/[0.06] backdrop-blur-sm">
          <Link
            href={`/dashboard?${modSuffix}`}
            className={cn(
              "rounded-full px-3.5 py-2 transition-all duration-200 active:scale-95",
              !ver
                ? "bg-primary text-primary-foreground shadow-[0_2px_8px_-1px_rgba(70,60,140,0.4)]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Todos
          </Link>
          <Link
            href={`/dashboard?${modSuffix}ver=mias`}
            className={cn(
              "rounded-full px-3.5 py-2 transition-all duration-200 active:scale-95",
              ver === "mias"
                ? "bg-primary text-primary-foreground shadow-[0_2px_8px_-1px_rgba(70,60,140,0.4)]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Mías
          </Link>
        </div>
        <Link
          href="/resumen"
          className="flex items-center gap-1 rounded-full bg-card/90 px-3.5 py-2.5 text-xs text-muted-foreground shadow-[0_4px_16px_-2px_rgba(70,60,140,0.16)] ring-1 ring-foreground/[0.06] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground active:scale-95"
        >
          <BarChart3Icon className="size-3.5" />
          Resumen
        </Link>
      </div>
      <div className="fixed right-4 bottom-4 z-40">
        <AddTaskDialog members={members} currentMemberId={currentMemberId} floating />
      </div>
    </>
  )
}
