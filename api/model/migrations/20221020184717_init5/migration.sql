/*
  Warnings:

  - You are about to drop the column `size` on the `Item` table. All the data in the column will be lost.
  - Added the required column `dimension` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "size",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dimension" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "price" SET DATA TYPE INTEGER;
