/*
  Warnings:

  - You are about to drop the column `cart_itemId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `seles_person_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `seles_order_id` on the `cart_item` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `cart_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_cart_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "product_selles_person_id_fkey";

-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_seles_order_id_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "cart_itemId",
DROP COLUMN "seles_person_id",
ADD COLUMN     "sales_person_id" TEXT;

-- AlterTable
ALTER TABLE "cart_item" DROP COLUMN "seles_order_id",
ADD COLUMN     "customer_id" TEXT NOT NULL,
ADD COLUMN     "product_id" TEXT,
ADD COLUMN     "sales_order_id" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "product_selles_person_id_fkey" FOREIGN KEY ("sales_person_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_sales_order_id_fkey" FOREIGN KEY ("sales_order_id") REFERENCES "sales_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
