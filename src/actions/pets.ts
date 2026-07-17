"use server"

import { requireActiveMember } from "@/lib/session"
import { db } from "@/lib/db"
import { uploadImage, InvalidImageError } from "@/lib/upload"
import * as petService from "@/services/pets"

type ActionResult = { success: true } | { success: false; error: string }

export async function createPetAction(formData: FormData): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const name = String(formData.get("name") ?? "").trim()
  const species = String(formData.get("species") ?? "").trim()
  if (!name || !species) {
    return { success: false, error: "Ponle un nombre y una especie a la mascota." }
  }

  const breed = String(formData.get("breed") ?? "").trim()
  const birthDateRaw = String(formData.get("birthDate") ?? "").trim()

  await petService.createPet({
    householdId,
    name,
    species,
    breed: breed || null,
    birthDate: birthDateRaw ? new Date(`${birthDateRaw}T00:00:00`) : null,
  })

  return { success: true }
}

export async function updatePetAction(petId: string, formData: FormData): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const pet = await db.pet.findUnique({ where: { id: petId }, select: { householdId: true } })
  if (!pet || pet.householdId !== householdId) {
    return { success: false, error: "Mascota no encontrada." }
  }

  const name = String(formData.get("name") ?? "").trim()
  const species = String(formData.get("species") ?? "").trim()
  if (!name || !species) {
    return { success: false, error: "Ponle un nombre y una especie a la mascota." }
  }

  const breed = String(formData.get("breed") ?? "").trim()
  const birthDateRaw = String(formData.get("birthDate") ?? "").trim()

  await petService.updatePet(petId, {
    name,
    species,
    breed: breed || null,
    birthDate: birthDateRaw ? new Date(`${birthDateRaw}T00:00:00`) : null,
  })

  return { success: true }
}

export async function deletePetAction(petId: string): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const pet = await db.pet.findUnique({ where: { id: petId }, select: { householdId: true } })
  if (!pet || pet.householdId !== householdId) {
    return { success: false, error: "Mascota no encontrada." }
  }

  await petService.deletePet(petId)
  return { success: true }
}

export async function updatePetPhotoAction(
  petId: string,
  formData: FormData
): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const pet = await db.pet.findUnique({ where: { id: petId }, select: { householdId: true } })
  if (!pet || pet.householdId !== householdId) {
    return { success: false, error: "Mascota no encontrada." }
  }

  const file = formData.get("photo")
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Elige una imagen." }
  }

  try {
    const url = await uploadImage(file, `pets/${petId}`)
    await db.pet.update({ where: { id: petId }, data: { photoUrl: url } })
  } catch (error) {
    if (error instanceof InvalidImageError) {
      return { success: false, error: error.message }
    }
    throw error
  }

  return { success: true }
}
