import { db } from "@/lib/db"
import { computeAvgPurchaseIntervalDays, isDueForRepurchase } from "@/lib/purchaseInterval"

export async function getOrCreateDefaultList(householdId: string) {
  const existing = await db.shoppingList.findFirst({ where: { householdId } })
  if (existing) return existing
  return db.shoppingList.create({ data: { householdId } })
}

export async function addShoppingItem(listId: string, name: string) {
  return db.shoppingItem.create({
    data: { listId, name, status: "ACTIVE" },
  })
}

export async function markItemPurchased(itemId: string) {
  const purchasedAt = new Date()

  return db.$transaction(async (tx) => {
    await tx.shoppingItemPurchase.create({ data: { itemId, purchasedAt } })

    const purchases = await tx.shoppingItemPurchase.findMany({
      where: { itemId },
      orderBy: { purchasedAt: "asc" },
      select: { purchasedAt: true },
    })

    const avgPurchaseIntervalDays = computeAvgPurchaseIntervalDays(
      purchases.map((p) => p.purchasedAt)
    )

    return tx.shoppingItem.update({
      where: { id: itemId },
      data: { status: "PURCHASED", lastPurchasedAt: purchasedAt, avgPurchaseIntervalDays },
    })
  })
}

export async function reactivateItem(itemId: string) {
  return db.shoppingItem.update({
    where: { id: itemId },
    data: { status: "ACTIVE" },
  })
}

export async function getShoppingItems(listId: string) {
  const items = await db.shoppingItem.findMany({
    where: { listId, status: { in: ["ACTIVE", "PURCHASED"] } },
    orderBy: { createdAt: "asc" },
  })

  const active = items.filter((i) => i.status === "ACTIVE")
  const suggested = items.filter(
    (i) =>
      i.status === "PURCHASED" &&
      isDueForRepurchase({
        lastPurchasedAt: i.lastPurchasedAt,
        avgPurchaseIntervalDays: i.avgPurchaseIntervalDays,
      })
  )
  // Bought recently, not due yet — kept around so avgPurchaseIntervalDays
  // keeps building and the item doesn't need to be re-typed from scratch.
  const dormant = items.filter(
    (i) => i.status === "PURCHASED" && !suggested.includes(i)
  )

  return { active, suggested, dormant }
}
