/*
  Warnings:

  - A unique constraint covering the columns `[otp]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "otp" VARCHAR(6);

-- CreateIndex
CREATE UNIQUE INDEX "Sale_otp_key" ON "Sale"("otp");
