"use client"

import { Button } from "@/components/ui/button"
import { ChildFormDialog } from "@/components/children/child-form-dialog"

export function CreateChildForm() {
  return <ChildFormDialog trigger={<Button variant="outline">Añadir hijo/a</Button>} />
}
