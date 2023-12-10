/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Sale` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matricNo]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cafeId]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_matricNo_key" ON "Coupon"("matricNo");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_cafeId_key" ON "Sale"("cafeId");
