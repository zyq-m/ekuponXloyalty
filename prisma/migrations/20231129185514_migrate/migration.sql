/*
  Warnings:

  - You are about to drop the column `total` on the `Point` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `PointHistory` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Integer`.
  - You are about to drop the column `amount` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `Claim` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `TPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `TWallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `TWallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `TypePoint` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_markedBy_fkey";

-- AlterTable
ALTER TABLE "Cafe" ADD COLUMN     "bank" TEXT;

-- AlterTable
ALTER TABLE "Claim" ALTER COLUMN "claimedAt" DROP NOT NULL,
ALTER COLUMN "claimedAt" DROP DEFAULT,
ALTER COLUMN "markedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Point" DROP COLUMN "total";

-- AlterTable
ALTER TABLE "PointHistory" ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "TWallet" ADD COLUMN     "amount" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount",
ADD COLUMN     "createdOn" TIME NOT NULL DEFAULT CURRENT_TIME;

-- AlterTable
ALTER TABLE "TypePoint" ADD COLUMN     "value" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Claim_transactionId_key" ON "Claim"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "TPoint_transactionId_key" ON "TPoint"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "TWallet_transactionId_key" ON "TWallet"("transactionId");

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_markedBy_fkey" FOREIGN KEY ("markedBy") REFERENCES "Admin"("email") ON DELETE SET NULL ON UPDATE CASCADE;
