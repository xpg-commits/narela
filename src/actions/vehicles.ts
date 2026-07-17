"use server"

import { requireActiveMember } from "@/lib/session"
import { db } from "@/lib/db"
import { uploadImage, InvalidImageError } from "@/lib/upload"
import * as vehicleService from "@/services/vehicles"

type ActionResult = { success: true } | { success: false; error: string }

export async function createVehicleAction(formData: FormData): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const alias = String(formData.get("alias") ?? "").trim()
  if (!alias) {
    return { success: false, error: "Ponle un nombre al vehículo." }
  }

  const make = String(formData.get("make") ?? "").trim()
  const model = String(formData.get("model") ?? "").trim()
  const plate = String(formData.get("plate") ?? "").trim()
  const yearRaw = String(formData.get("year") ?? "").trim()

  await vehicleService.createVehicle({
    householdId,
    alias,
    make: make || null,
    model: model || null,
    plate: plate || null,
    year: yearRaw ? Number(yearRaw) : null,
  })

  return { success: true }
}

export async function updateVehicleAction(
  vehicleId: string,
  formData: FormData
): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const vehicle = await db.vehicle.findUnique({
    where: { id: vehicleId },
    select: { householdId: true },
  })
  if (!vehicle || vehicle.householdId !== householdId) {
    return { success: false, error: "Vehículo no encontrado." }
  }

  const alias = String(formData.get("alias") ?? "").trim()
  if (!alias) {
    return { success: false, error: "Ponle un nombre al vehículo." }
  }

  const make = String(formData.get("make") ?? "").trim()
  const model = String(formData.get("model") ?? "").trim()
  const plate = String(formData.get("plate") ?? "").trim()
  const yearRaw = String(formData.get("year") ?? "").trim()

  await vehicleService.updateVehicle(vehicleId, {
    alias,
    make: make || null,
    model: model || null,
    plate: plate || null,
    year: yearRaw ? Number(yearRaw) : null,
  })

  return { success: true }
}

export async function deleteVehicleAction(vehicleId: string): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const vehicle = await db.vehicle.findUnique({
    where: { id: vehicleId },
    select: { householdId: true },
  })
  if (!vehicle || vehicle.householdId !== householdId) {
    return { success: false, error: "Vehículo no encontrado." }
  }

  await vehicleService.deleteVehicle(vehicleId)
  return { success: true }
}

export async function updateVehiclePhotoAction(
  vehicleId: string,
  formData: FormData
): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const vehicle = await db.vehicle.findUnique({
    where: { id: vehicleId },
    select: { householdId: true },
  })
  if (!vehicle || vehicle.householdId !== householdId) {
    return { success: false, error: "Vehículo no encontrado." }
  }

  const file = formData.get("photo")
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Elige una imagen." }
  }

  try {
    const url = await uploadImage(file, `vehicles/${vehicleId}`)
    await db.vehicle.update({ where: { id: vehicleId }, data: { photoUrl: url } })
  } catch (error) {
    if (error instanceof InvalidImageError) {
      return { success: false, error: error.message }
    }
    throw error
  }

  return { success: true }
}
