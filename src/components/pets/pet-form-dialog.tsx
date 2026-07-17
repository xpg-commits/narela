"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePickerField } from "@/components/ui/date-picker-field"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createPetAction, updatePetAction } from "@/actions/pets"

type Pet = {
  id: string
  name: string
  species: string
  breed: string | null
  birthDate: Date | null
}

export function PetFormDialog({
  pet,
  trigger,
}: {
  pet?: Pet
  trigger: React.ReactNode
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [birthDate, setBirthDate] = useState(
    pet?.birthDate ? format(pet.birthDate, "yyyy-MM-dd") : ""
  )
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{pet ? "Editar mascota" : "Añadir mascota"}</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          className="grid gap-3 sm:grid-cols-2"
          action={(formData: FormData) => {
            startTransition(async () => {
              const result = pet
                ? await updatePetAction(pet.id, formData)
                : await createPetAction(formData)
              if (!result.success) {
                toast.error(result.error)
                return
              }
              setOpen(false)
              router.refresh()
            })
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="pet-name">Nombre</Label>
            <Input id="pet-name" name="name" defaultValue={pet?.name} placeholder="Toby" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pet-species">Especie</Label>
            <Input
              id="pet-species"
              name="species"
              defaultValue={pet?.species}
              placeholder="Perro"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pet-breed">Raza (opcional)</Label>
            <Input id="pet-breed" name="breed" defaultValue={pet?.breed ?? ""} />
          </div>
          <div className="space-y-2">
            <Label>Fecha de nacimiento (opcional)</Label>
            <DatePickerField
              name="birthDate"
              value={birthDate}
              onChange={setBirthDate}
              captionLayout="dropdown"
            />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando…" : "Guardar"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
