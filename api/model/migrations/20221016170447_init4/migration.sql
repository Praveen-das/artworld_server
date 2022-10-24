/*
  Warnings:

  - The primary key for the `sales_order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `order_status` on the `sales_order` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_order_number` on the `sales_order` table. All the data in the column will be lost.
  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `material` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_personId_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_material_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_selles_person_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_product_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sales_item" DROP CONSTRAINT "sales_item_item_id_fkey";

-- DropForeignKey
ALTER TABLE "sales_item" DROP CONSTRAINT "sales_item_seles_order_id_fkey";

-- DropForeignKey
ALTER TABLE "sales_order" DROP CONSTRAINT "sales_order_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "sales_order" DROP CONSTRAINT "sales_order_seller_id_fkey";

-- AlterTable
ALTER TABLE "sales_item" ALTER COLUMN "item_id" SET DATA TYPE TEXT,
ALTER COLUMN "seles_order_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "sales_order" DROP CONSTRAINT "sales_order_pkey",
DROP COLUMN "order_status",
DROP COLUMN "purchase_order_number",
ALTER COLUMN "customer_id" SET DATA TYPE TEXT,
ALTER COLUMN "seller_id" SET DATA TYPE TEXT,
ALTER COLUMN "timer_order_taken" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "timer_order_taken" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sales_order_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sales_order_id_seq";

-- DropTable
DROP TABLE "address";

-- DropTable
DROP TABLE "category";

-- DropTable
DROP TABLE "item";

-- DropTable
DROP TABLE "material";

-- DropTable
DROP TABLE "person";

-- DropTable
DROP TABLE "product";

-- DropTable
DROP TABLE "reviews";

-- CreateTable
CREATE TABLE "User" (
    "first_name" VARCHAR(20) NOT NULL,
    "middle_name" VARCHAR(20),
    "last_name" VARCHAR(20) NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "seller" BOOLEAN NOT NULL DEFAULT false,
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "flat" VARCHAR(60) NOT NULL,
    "company" VARCHAR(60),
    "street" VARCHAR(60) NOT NULL,
    "city" VARCHAR(40) NOT NULL,
    "state" CHAR(2) NOT NULL,
    "zip_code" INTEGER NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "category_id" INTEGER,
    "material_id" INTEGER,
    "seles_person_id" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "name" VARCHAR(30) NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "name" VARCHAR(20) NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vote" SMALLINT NOT NULL,
    "review" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "product_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "size" INTEGER NOT NULL,
    "price" SMALLINT NOT NULL,
    "images" TEXT[],
    "id" TEXT NOT NULL,
    "product_id" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Address_flat_company_street_user_id_key" ON "Address"("flat", "company", "street", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_user_id_product_id_key" ON "Reviews"("user_id", "product_id");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "Material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "product_selles_person_id_fkey" FOREIGN KEY ("seles_person_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales_item" ADD CONSTRAINT "sales_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales_item" ADD CONSTRAINT "sales_item_seles_order_id_fkey" FOREIGN KEY ("seles_order_id") REFERENCES "sales_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
