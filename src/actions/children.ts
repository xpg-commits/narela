"use server"

import { requireActiveMember } from "@/lib/session"
import { db } from "@/lib/db"
import { uploadImage, InvalidImageError } from "@/lib/upload"
import * as childService from "@/services/children"

type ActionResult = { success: true } | { success: false; error: string }

export async function createChildAction(formData: FormData): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const name = String(formData.get("name") ?? "").trim()
  if (!name) {
    return { success: false, error: "Ponle un nombre." }
  }

  const birthDateRaw = String(formData.get("birthDate") ?? "").trim()

  await childService.createChild({
    householdId,
    name,
    birthDate: birthDateRaw ? new Date(`${birthDateRaw}T00:00:00`) : null,
  })

  return { success: true }
}

export async function updateChildAction(
  childId: string,
  formData: FormData
): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const child = await db.child.findUnique({
    where: { id: childId },
    select: { householdId: true },
  })
  if (!child || child.householdId !== householdId) {
    return { success: false, error: "No se encontró ese hijo/a." }
  }

  const name = String(formData.get("name") ?? "").trim()
  if (!name) {
    return { success: false, error: "Ponle un nombre." }
  }

  const birthDateRaw = String(formData.get("birthDate") ?? "").trim()

  await childService.updateChild(childId, {
    name,
    birthDate: birthDateRaw ? new Date(`${birthDateRaw}T00:00:00`) : null,
  })

  return { success: true }
}

export async function deleteChildAction(childId: string): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const child = await db.child.findUnique({
    where: { id: childId },
    select: { householdId: true },
  })
  if (!child || child.householdId !== householdId) {
    return { success: false, error: "No se encontró ese hijo/a." }
  }

  await childService.deleteChild(childId)
  return { success: true }
}

export async function updateChildPhotoAction(
  childId: string,
  formData: FormData
): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const child = await db.child.findUnique({
    where: { id: childId },
    select: { householdId: true },
  })
  if (!child || child.householdId !== householdId) {
    return { success: false, error: "No se encontró ese hijo/a." }
  }

  const file = formData.get("photo")
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Elige una imagen." }
  }

  try {
    const url = await uploadImage(file, `children/${childId}`)
    await db.child.update({ where: { id: childId }, data: { photoUrl: url } })
  } catch (error) {
    if (error instanceof InvalidImageError) {
      return { success: false, error: error.message }
    }
    throw error
  }

  return { success: true }
}
