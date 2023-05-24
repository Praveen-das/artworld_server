/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_product_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Item_product_id_key" ON "Item"("product_id");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
