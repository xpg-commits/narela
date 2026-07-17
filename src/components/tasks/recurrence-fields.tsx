"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Renders plain named inputs inside whatever <form> wraps it — no local
// submit logic here, the parent form's FormData just won't contain these
// fields at all while collapsed, which is exactly "no repite".
export function RecurrenceFields() {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        🔁 Repetir
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted-foreground">Repetir cada</span>
      <Input
        name="recurrenceIntervalDays"
        type="number"
        min={1}
        placeholder="30"
        className="w-20"
      />
      <span className="text-muted-foreground">días,</span>
      <Select
        name="recurrenceType"
        defaultValue="REACTIVE"
        items={{
          REACTIVE: "desde que la completo",
          FIXED_SCHEDULE: "desde la fecha prevista",
        }}
      >
        <SelectTrigger className="w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="REACTIVE">desde que la completo</SelectItem>
          <SelectItem value="FIXED_SCHEDULE">desde la fecha prevista</SelectItem>
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(false)}
      >
        Quitar
      </Button>
    </div>
  )
}
