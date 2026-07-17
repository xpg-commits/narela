-- AlterTable
ALTER TABLE "ShoppingItem" ADD COLUMN     "addedByMemberId" TEXT,
ADD COLUMN     "checkedByMemberId" TEXT,
ADD COLUMN     "novaGroup" INTEGER;

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_addedByMemberId_fkey" FOREIGN KEY ("addedByMemberId") REFERENCES "householdMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_checkedByMemberId_fkey" FOREIGN KEY ("checkedByMemberId") REFERENCES "householdMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
