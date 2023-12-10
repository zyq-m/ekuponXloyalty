-- AlterTable
ALTER TABLE "CouponHistory" ADD COLUMN     "total" MONEY NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "SaleHistory" ADD COLUMN     "total" MONEY NOT NULL DEFAULT 0.00;
