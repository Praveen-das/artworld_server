/*
  Warnings:

  - You are about to drop the column `company` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `flat` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `zip_code` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sales_item` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address_line1` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telephone` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_product_id_fkey";

-- DropForeignKey
ALTER TABLE "sales_item" DROP CONSTRAINT "sales_item_item_id_fkey";

-- DropForeignKey
ALTER TABLE "sales_item" DROP CONSTRAINT "sales_item_seles_order_id_fkey";

-- DropIndex
DROP INDEX "Address_flat_company_street_user_id_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "company",
DROP COLUMN "flat",
DROP COLUMN "phone",
DROP COLUMN "street",
DROP COLUMN "zip_code",
ADD COLUMN     "address_line1" VARCHAR(60) NOT NULL,
ADD COLUMN     "address_line2" VARCHAR(60),
ADD COLUMN     "country" VARCHAR(20) NOT NULL,
ADD COLUMN     "mobile" VARCHAR(20) NOT NULL,
ADD COLUMN     "postal_code" INTEGER NOT NULL,
ADD COLUMN     "telephone" VARCHAR(20) NOT NULL,
ALTER COLUMN "state" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "description",
ADD COLUMN     "cart_itemId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "desc" TEXT NOT NULL,
ADD COLUMN     "discount" INTEGER NOT NULL,
ADD COLUMN     "images" JSONB[],
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "sales_item";

-- CreateTable
CREATE TABLE "cart_item" (
    "quantity" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "id" SERIAL NOT NULL,
    "seles_order_id" TEXT,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_cart_itemId_fkey" FOREIGN KEY ("cart_itemId") REFERENCES "cart_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_seles_order_id_fkey" FOREIGN KEY ("seles_order_id") REFERENCES "sales_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
