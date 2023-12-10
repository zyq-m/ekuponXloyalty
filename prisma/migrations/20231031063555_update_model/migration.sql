/*
  Warnings:

  - The primary key for the `Point` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Point` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matricNo]` on the table `Point` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricNo` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TPoint" DROP CONSTRAINT "TPoint_pointId_fkey";

-- AlterTable
ALTER TABLE "Point" DROP CONSTRAINT "Point_pkey",
DROP COLUMN "name",
ADD COLUMN     "matricNo" VARCHAR(6) NOT NULL,
ADD COLUMN     "total" MONEY NOT NULL DEFAULT 0.00,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Point_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Point_id_seq";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_DATE,
ALTER COLUMN "createdAt" SET DATA TYPE DATE;

-- CreateTable
CREATE TABLE "PointHistory" (
    "id" TEXT NOT NULL,
    "matricNo" VARCHAR(6) NOT NULL,
    "total" MONEY NOT NULL DEFAULT 0.00,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypePoint" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "TypePoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToken" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "mark" TEXT NOT NULL DEFAULT 'token',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "Point_matricNo_key" ON "Point"("matricNo");

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_matricNo_fkey" FOREIGN KEY ("matricNo") REFERENCES "Student"("matricNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointHistory" ADD CONSTRAINT "PointHistory_matricNo_fkey" FOREIGN KEY ("matricNo") REFERENCES "Student"("matricNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TPoint" ADD CONSTRAINT "TPoint_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "TypePoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
