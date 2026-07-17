"use client"

import { Button } from "@/components/ui/button"
import { VehicleFormDialog } from "@/components/vehicles/vehicle-form-dialog"

export function CreateVehicleForm() {
  return <VehicleFormDialog trigger={<Button variant="outline">Añadir vehículo</Button>} />
}
