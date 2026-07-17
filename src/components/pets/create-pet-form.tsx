"use client"

import { Button } from "@/components/ui/button"
import { PetFormDialog } from "@/components/pets/pet-form-dialog"

export function CreatePetForm() {
  return <PetFormDialog trigger={<Button variant="outline">Añadir mascota</Button>} />
}
