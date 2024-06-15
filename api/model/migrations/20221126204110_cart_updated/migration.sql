/*
  Warnings:

  - The primary key for the `Reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customer_id` on the `cart_item` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `cart_item` table without a default value. This is not possible if the table is not empty.
  - Made the column `product_id` on table `cart_item` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_product_id_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Reviews_id_seq";

-- AlterTable
ALTER TABLE "cart_item" DROP COLUMN "customer_id",
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "product_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "wishlist" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
