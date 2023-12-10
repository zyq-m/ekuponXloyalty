/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Sale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "CouponHistory" (
    "id" TEXT NOT NULL,
    "matricNo" VARCHAR(6) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CouponHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleHistory" (
    "id" TEXT NOT NULL,
    "cafeId" VARCHAR(12) NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SaleHistory_cafeId_key" ON "SaleHistory"("cafeId");

-- AddForeignKey
ALTER TABLE "CouponHistory" ADD CONSTRAINT "CouponHistory_matricNo_fkey" FOREIGN KEY ("matricNo") REFERENCES "Student"("matricNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleHistory" ADD CONSTRAINT "SaleHistory_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "Cafe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
