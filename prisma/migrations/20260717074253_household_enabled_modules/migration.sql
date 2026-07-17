-- AlterTable
ALTER TABLE "household" ADD COLUMN     "enabledModules" TEXT[] DEFAULT ARRAY['HOME', 'PET', 'VEHICLE', 'CHILD', 'HEALTH', 'SHOPPING']::TEXT[];
