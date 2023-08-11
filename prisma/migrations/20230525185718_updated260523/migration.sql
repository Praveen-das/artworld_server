/*
  Warnings:

  - Added the required column `size` to the `cart_item` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE "cart_item" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
ADD COLUMN     "size" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "recently_viewed" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "sales_order" ALTER COLUMN "timer_order_taken" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "wishlist" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- CreateTable
CREATE TABLE "Social" (
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Social_id_key" ON "Social"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Social_user_id_name_key" ON "Social"("user_id", "name");

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
