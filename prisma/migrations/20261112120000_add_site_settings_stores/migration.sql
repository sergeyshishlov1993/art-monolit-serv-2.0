-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN "stores" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "citySelectorModal" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "citySwitcherHeader" BOOLEAN NOT NULL DEFAULT true;
