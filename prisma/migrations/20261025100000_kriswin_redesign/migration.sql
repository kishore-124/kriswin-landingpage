-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "accentColor" TEXT NOT NULL DEFAULT '#f97316',
ADD COLUMN     "challenges" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "consultPoints" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "faqs" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "industries" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "technologies" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "trustedBy" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "primaryColor" SET DEFAULT '#2563eb',
ALTER COLUMN "companyName" SET DEFAULT 'Kriswin Infotech Private Limited',
ALTER COLUMN "tagline" SET DEFAULT 'Smart software. Real business results.',
ALTER COLUMN "email" SET DEFAULT 'info@kriswin-infotech.com';

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "client" TEXT NOT NULL DEFAULT '',
    "industry" TEXT NOT NULL DEFAULT '',
    "summary" TEXT NOT NULL,
    "challenge" TEXT NOT NULL DEFAULT '',
    "solution" TEXT NOT NULL DEFAULT '',
    "results" TEXT NOT NULL DEFAULT '',
    "techStack" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "readTime" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");
