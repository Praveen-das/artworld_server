/*
  Warnings:

  - You are about to drop the column `cart_item_id` on the `sales_order` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `sales_order` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `sales_order` table. All the data in the column will be lost.
  - You are about to drop the column `timer_order_taken` on the `sales_order` table. All the data in the column will be lost.
  - Added the required column `discount` to the `sales_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `sales_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `sales_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `sales_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `sales_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `sales_order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'FAILED');

-- DropForeignKey
ALTER TABLE "sales_order" DROP CONSTRAINT "sales_order_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "sales_order" DROP CONSTRAINT "sales_order_seller_id_fkey";

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
ALTER TABLE "sales_order" DROP COLUMN "cart_item_id",
DROP COLUMN "customer_id",
DROP COLUMN "seller_id",
DROP COLUMN "timer_order_taken",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
ADD COLUMN     "discount" INTEGER NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "sales_person_id" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "wishlist" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "razorpayOrderId" TEXT,
    "paymentId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "sales_orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_razorpayOrderId_key" ON "Order"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_sales_orderId_key" ON "Order"("sales_orderId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sales_orderId_fkey" FOREIGN KEY ("sales_orderId") REFERENCES "sales_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_sales_person_id_fkey" FOREIGN KEY ("sales_person_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
