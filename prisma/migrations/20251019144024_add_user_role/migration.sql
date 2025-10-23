/*
  Warnings:

  - You are about to drop the `Boat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CaptainProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Charter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CharterAmenity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CharterFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CharterMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pickup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PickupArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Policies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trip` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TripSpecies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TripStartTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TripTechnique` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ANGLER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."CaptainProfile" DROP CONSTRAINT "CaptainProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Charter" DROP CONSTRAINT "Charter_boatId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Charter" DROP CONSTRAINT "Charter_captainId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CharterAmenity" DROP CONSTRAINT "CharterAmenity_charterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CharterFeature" DROP CONSTRAINT "CharterFeature_charterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CharterMedia" DROP CONSTRAINT "CharterMedia_charterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CharterMedia" DROP CONSTRAINT "CharterMedia_tripId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pickup" DROP CONSTRAINT "Pickup_charterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PickupArea" DROP CONSTRAINT "PickupArea_pickupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Policies" DROP CONSTRAINT "Policies_charterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Trip" DROP CONSTRAINT "Trip_charterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TripSpecies" DROP CONSTRAINT "TripSpecies_tripId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TripStartTime" DROP CONSTRAINT "TripStartTime_tripId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TripTechnique" DROP CONSTRAINT "TripTechnique_tripId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'ANGLER';

-- DropTable
DROP TABLE "public"."Boat";

-- DropTable
DROP TABLE "public"."CaptainProfile";

-- DropTable
DROP TABLE "public"."Charter";

-- DropTable
DROP TABLE "public"."CharterAmenity";

-- DropTable
DROP TABLE "public"."CharterFeature";

-- DropTable
DROP TABLE "public"."CharterMedia";

-- DropTable
DROP TABLE "public"."Pickup";

-- DropTable
DROP TABLE "public"."PickupArea";

-- DropTable
DROP TABLE "public"."Policies";

-- DropTable
DROP TABLE "public"."Trip";

-- DropTable
DROP TABLE "public"."TripSpecies";

-- DropTable
DROP TABLE "public"."TripStartTime";

-- DropTable
DROP TABLE "public"."TripTechnique";

-- DropEnum
DROP TYPE "public"."CharterPricingPlan";

-- DropEnum
DROP TYPE "public"."CharterStyle";

-- DropEnum
DROP TYPE "public"."MediaKind";

-- CreateTable
CREATE TABLE "public"."BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "coverImageAlt" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "readingTime" INTEGER,
    "viewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogTag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "BlogComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NewsletterSubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" TIMESTAMP(3),

    CONSTRAINT "NewsletterSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_BlogPostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogPostToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_BlogPostToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogPostToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "public"."BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "public"."BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_published_publishedAt_idx" ON "public"."BlogPost"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_authorId_idx" ON "public"."BlogPost"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "public"."BlogCategory"("slug");

-- CreateIndex
CREATE INDEX "BlogCategory_slug_idx" ON "public"."BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogTag_slug_key" ON "public"."BlogTag"("slug");

-- CreateIndex
CREATE INDEX "BlogTag_slug_idx" ON "public"."BlogTag"("slug");

-- CreateIndex
CREATE INDEX "BlogComment_postId_idx" ON "public"."BlogComment"("postId");

-- CreateIndex
CREATE INDEX "BlogComment_authorId_idx" ON "public"."BlogComment"("authorId");

-- CreateIndex
CREATE INDEX "BlogComment_approved_idx" ON "public"."BlogComment"("approved");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_email_key" ON "public"."NewsletterSubscription"("email");

-- CreateIndex
CREATE INDEX "NewsletterSubscription_email_idx" ON "public"."NewsletterSubscription"("email");

-- CreateIndex
CREATE INDEX "NewsletterSubscription_active_idx" ON "public"."NewsletterSubscription"("active");

-- CreateIndex
CREATE INDEX "_BlogPostToTag_B_index" ON "public"."_BlogPostToTag"("B");

-- CreateIndex
CREATE INDEX "_BlogPostToCategory_B_index" ON "public"."_BlogPostToCategory"("B");

-- AddForeignKey
ALTER TABLE "public"."BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogComment" ADD CONSTRAINT "BlogComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogComment" ADD CONSTRAINT "BlogComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BlogPostToTag" ADD CONSTRAINT "_BlogPostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BlogPostToTag" ADD CONSTRAINT "_BlogPostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."BlogTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BlogPostToCategory" ADD CONSTRAINT "_BlogPostToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BlogPostToCategory" ADD CONSTRAINT "_BlogPostToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
