-- AlterTable
ALTER TABLE "household" ADD COLUMN     "moduleOrder" TEXT[] DEFAULT ARRAY['ALL', 'HOME', 'PET', 'VEHICLE', 'CHILD', 'HEALTH', 'SHOPPING']::TEXT[],
ADD COLUMN     "primaryModuleKey" TEXT;
