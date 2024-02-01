/*
  Warnings:

  - You are about to drop the column `payment_method` on the `sales_order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "cart_item" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "recently_viewed" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "sales_order" DROP COLUMN "payment_method",
ALTER COLUMN "timer_order_taken" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "wishlist" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- DropEnum
DROP TYPE "payment_type";
