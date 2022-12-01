/*
  Warnings:

  - You are about to drop the column `isDefault` on the `Address` table. All the data in the column will be lost.
  - Added the required column `default_address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "isDefault";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "default_address" TEXT NOT NULL;
