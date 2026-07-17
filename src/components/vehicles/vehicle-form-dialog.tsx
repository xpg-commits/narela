"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createVehicleAction, updateVehicleAction } from "@/actions/vehicles"

type Vehicle = {
  id: string
  alias: string
  make: string | null
  model: string | null
  year: number | null
  plate: string | null
}

export function VehicleFormDialog({
  vehicle,
  trigger,
}: {
  vehicle?: Vehicle
  trigger: React.ReactNode
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{vehicle ? "Editar vehículo" : "Añadir vehículo"}</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          className="grid gap-3 sm:grid-cols-2"
          action={(formData: FormData) => {
            startTransition(async () => {
              const result = vehicle
                ? await updateVehicleAction(vehicle.id, formData)
                : await createVehicleAction(formData)
              if (!result.success) {
                toast.error(result.error)
                return
              }
              setOpen(false)
              router.refresh()
            })
          }}
        >
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="vehicle-alias">Nombre</Label>
            <Input
              id="vehicle-alias"
              name="alias"
              defaultValue={vehicle?.alias}
              placeholder="Coche de Juan"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle-make">Marca (opcional)</Label>
            <Input id="vehicle-make" name="make" defaultValue={vehicle?.make ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle-model">Modelo (opcional)</Label>
            <Input id="vehicle-model" name="model" defaultValue={vehicle?.model ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle-year">Año (opcional)</Label>
            <Input
              id="vehicle-year"
              name="year"
              type="number"
              defaultValue={vehicle?.year ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle-plate">Matrícula (opcional)</Label>
            <Input id="vehicle-plate" name="plate" defaultValue={vehicle?.plate ?? ""} />
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
