/*
  Warnings:

  - You are about to drop the column `dimension` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Item` table. All the data in the column will be lost.
  - Added the required column `size` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "dimension",
DROP COLUMN "updatedAt",
ADD COLUMN     "size" INTEGER NOT NULL;
