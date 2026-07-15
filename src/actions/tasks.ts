"use server"

import { requireActiveMember } from "@/lib/session"
import { db } from "@/lib/db"
import * as taskService from "@/services/tasks"

type ActionResult = { success: true } | { success: false; error: string }

export async function createTaskAction(formData: FormData): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const title = String(formData.get("title") ?? "").trim()
  if (!title) {
    return { success: false, error: "Ponle un título a la tarea." }
  }

  const dueDateRaw = String(formData.get("dueDate") ?? "").trim()
  const dueDate = dueDateRaw ? new Date(`${dueDateRaw}T00:00:00`) : null

  await taskService.createTask({ householdId, title, dueDate })

  return { success: true }
}

export async function setTaskStatusAction(
  taskId: string,
  done: boolean
): Promise<ActionResult> {
  const { householdId } = await requireActiveMember()

  const task = await db.task.findUnique({
    where: { id: taskId },
    select: { householdId: true },
  })
  if (!task || task.householdId !== householdId) {
    return { success: false, error: "Tarea no encontrada." }
  }

  await taskService.setTaskStatus(taskId, done)
  return { success: true }
}
