-- CreateEnum
CREATE TYPE "sex_type" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "provider_type" AS ENUM ('web', 'google', 'facebook', 'twitter');

-- CreateEnum
CREATE TYPE "status_type" AS ENUM ('pending', 'processing', 'delivered', 'cancelled');

-- CreateTable
CREATE TABLE "User" (
    "displayName" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "photo" TEXT,
    "provider" "provider_type" NOT NULL DEFAULT 'web',
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVerificationRecords" (
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "UserVerificationRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "name" VARCHAR(60) NOT NULL,
    "address" TEXT NOT NULL,
    "city" VARCHAR(40) NOT NULL,
    "state" VARCHAR(20) NOT NULL,
    "pincode" INTEGER NOT NULL,
    "mobile" VARCHAR(20) NOT NULL,
    "alternate_phone" VARCHAR(20),
    "email" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "name" VARCHAR(50) NOT NULL,
    "desc" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "images" JSONB[],
    "defaultImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "id" TEXT NOT NULL,
    "category_id" INTEGER,
    "material_id" INTEGER,
    "seles_person_id" TEXT,
    "cart_itemId" INTEGER,

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
CREATE TABLE "cart_item" (
    "quantity" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "id" SERIAL NOT NULL,
    "seles_order_id" TEXT,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_order" (
    "timer_order_taken" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivery_time" DATE NOT NULL,
    "status" "status_type" DEFAULT 'pending',
    "id" TEXT NOT NULL,
    "customer_id" TEXT,
    "seller_id" TEXT,

    CONSTRAINT "sales_order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_provider_key" ON "User"("email", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_desc_key" ON "Product"("name", "desc");

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
ALTER TABLE "Product" ADD CONSTRAINT "Product_cart_itemId_fkey" FOREIGN KEY ("cart_itemId") REFERENCES "cart_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_seles_order_id_fkey" FOREIGN KEY ("seles_order_id") REFERENCES "sales_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
