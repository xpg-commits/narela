import { db } from "@/lib/db"

export type CreateChildInput = {
  householdId: string
  name: string
  birthDate?: Date | null
  notes?: string | null
}

export async function createChild(input: CreateChildInput) {
  return db.child.create({ data: input })
}

export async function listChildren(householdId: string) {
  return db.child.findMany({
    where: { householdId },
    orderBy: { createdAt: "asc" },
  })
}

export async function getChild(childId: string) {
  return db.child.findUnique({ where: { id: childId } })
}

export type UpdateChildInput = {
  name: string
  birthDate?: Date | null
}

export async function updateChild(childId: string, input: UpdateChildInput) {
  return db.child.update({ where: { id: childId }, data: input })
}

export async function deleteChild(childId: string) {
  return db.child.delete({ where: { id: childId } })
}
