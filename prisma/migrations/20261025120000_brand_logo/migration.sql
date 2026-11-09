-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "logoLightUrl" TEXT NOT NULL DEFAULT '/brand/kriswin-logo-white.svg',
ADD COLUMN     "logoUrl" TEXT NOT NULL DEFAULT '/brand/kriswin-logo.svg',
ALTER COLUMN "primaryColor" SET DEFAULT '#0085B1',
ALTER COLUMN "accentColor" SET DEFAULT '#5DB823';

-- Switch to the logo's brand colours if the previous default colours were never changed
UPDATE "SiteSetting" SET "primaryColor" = '#0085B1' WHERE lower("primaryColor") = '#2563eb';
UPDATE "SiteSetting" SET "accentColor" = '#5DB823' WHERE lower("accentColor") = '#f97316';
