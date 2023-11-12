/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `cart_item` table. All the data in the column will be lost.
  - Added the required column `heightInInches` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellingOption` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `widthInInches` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "selling_option" AS ENUM ('ORIGINAL', 'PRINT');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('seller', 'user');

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_conversationId_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "conversationId",
ADD COLUMN     "conversation_id" TEXT,
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "size",
ADD COLUMN     "heightInInches" INTEGER NOT NULL,
ADD COLUMN     "sellingOption" "selling_option" NOT NULL,
ADD COLUMN     "widthInInches" INTEGER NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "user_role" NOT NULL DEFAULT 'user',
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "cart_item" DROP COLUMN "size",
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "recently_viewed" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "sales_order" ALTER COLUMN "timer_order_taken" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "wishlist" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
