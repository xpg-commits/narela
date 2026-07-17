import { db } from "@/lib/db"

export type CreateVehicleInput = {
  householdId: string
  alias: string
  make?: string | null
  model?: string | null
  year?: number | null
  plate?: string | null
  notes?: string | null
}

export async function createVehicle(input: CreateVehicleInput) {
  return db.vehicle.create({ data: input })
}

export async function listVehicles(householdId: string) {
  return db.vehicle.findMany({
    where: { householdId },
    orderBy: { createdAt: "asc" },
  })
}

export async function getVehicle(vehicleId: string) {
  return db.vehicle.findUnique({ where: { id: vehicleId } })
}

export type UpdateVehicleInput = {
  alias: string
  make?: string | null
  model?: string | null
  year?: number | null
  plate?: string | null
}

export async function updateVehicle(vehicleId: string, input: UpdateVehicleInput) {
  return db.vehicle.update({ where: { id: vehicleId }, data: input })
}

export async function deleteVehicle(vehicleId: string) {
  return db.vehicle.delete({ where: { id: vehicleId } })
}
