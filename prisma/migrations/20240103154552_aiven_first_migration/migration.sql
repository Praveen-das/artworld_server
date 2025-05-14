/*
  Warnings:

  - You are about to drop the column `alternate_phone` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Address` table. All the data in the column will be lost.
  - You are about to alter the column `pincode` on the `Address` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(6)`.
  - You are about to alter the column `mobile` on the `Address` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - You are about to drop the column `default_address` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[default_address_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "linked_account_status" AS ENUM ('not_active', 'active', 'inactive');

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "alternate_phone",
DROP COLUMN "email",
ALTER COLUMN "pincode" SET DATA TYPE VARCHAR(6),
ALTER COLUMN "mobile" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "User" DROP COLUMN "default_address",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "default_address_id" TEXT,
ADD COLUMN     "phoneNumber" VARCHAR(10),
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "cart_item" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "recently_viewed" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "sales_order" ALTER COLUMN "timer_order_taken" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "wishlist" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- CreateTable
CREATE TABLE "linked_account" (
    "id" TEXT NOT NULL,
    "status" "linked_account_status" NOT NULL DEFAULT 'not_active',
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "linked_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Followers" (
    "id" TEXT NOT NULL,
    "followingUserId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Followers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "linked_account_id_key" ON "linked_account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "linked_account_userId_key" ON "linked_account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Followers_id_key" ON "Followers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Followers_followingUserId_userId_key" ON "Followers"("followingUserId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_default_address_id_key" ON "User"("default_address_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_default_address_id_fkey" FOREIGN KEY ("default_address_id") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linked_account" ADD CONSTRAINT "linked_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followers" ADD CONSTRAINT "Followers_followingUserId_fkey" FOREIGN KEY ("followingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followers" ADD CONSTRAINT "Followers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
