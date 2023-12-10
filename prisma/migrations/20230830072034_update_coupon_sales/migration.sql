/*
  Warnings:

  - You are about to drop the column `amount` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Sale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "amount",
ADD COLUMN     "total" MONEY NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "amount",
ADD COLUMN     "total" MONEY NOT NULL DEFAULT 0.00;
