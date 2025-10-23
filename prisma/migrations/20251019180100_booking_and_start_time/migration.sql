-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "captainCharterId" TEXT NOT NULL,
    "charterName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "tripName" TEXT NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "startTime" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "days" INTEGER NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "captainDecisionAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "public"."Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_captainCharterId_idx" ON "public"."Booking"("captainCharterId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "public"."Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "public"."Booking"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
