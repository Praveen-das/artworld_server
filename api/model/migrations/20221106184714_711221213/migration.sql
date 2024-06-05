/*
  Warnings:

  - You are about to drop the column `address_line1` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `address_line2` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `middle_name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "address_line1",
DROP COLUMN "address_line2",
DROP COLUMN "country",
DROP COLUMN "postal_code",
DROP COLUMN "telephone",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "alternate_phone" VARCHAR(20),
ADD COLUMN     "name" VARCHAR(60) NOT NULL,
ADD COLUMN     "pincode" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "middle_name",
ALTER COLUMN "username" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "displayName" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
