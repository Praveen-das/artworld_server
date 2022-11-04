-- CreateEnum
CREATE TYPE "sex_type" AS ENUM ('M', 'F');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "name" VARCHAR(30) NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "product_id" INTEGER,
    "size" INTEGER NOT NULL,
    "price" SMALLINT NOT NULL,
    "images" TEXT[],
    "id" SERIAL NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material" (
    "name" VARCHAR(20) NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person" (
    "first_name" VARCHAR(20) NOT NULL,
    "middle_name" VARCHAR(20) NOT NULL,
    "last_name" VARCHAR(20) NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "seller" BOOLEAN NOT NULL DEFAULT false,
    "id" SERIAL NOT NULL,
    "company" VARCHAR(60) NOT NULL,
    "street" VARCHAR(60) NOT NULL,
    "city" VARCHAR(40) NOT NULL,
    "state" CHAR(2) NOT NULL,
    "zip_code" INTEGER NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "birth_date" DATE NOT NULL,
    "sex" "sex_type" NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" INTEGER,
    "material_id" INTEGER,
    "seles_person_id" INTEGER,
    "id" SERIAL NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "user_id" INTEGER,
    "product_id" INTEGER,
    "vote" SMALLINT NOT NULL,
    "review" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_item" (
    "item_id" INTEGER,
    "seles_order_id" INTEGER,
    "quantity" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "id" SERIAL NOT NULL,

    CONSTRAINT "sales_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_order" (
    "customer_id" INTEGER,
    "seller_id" INTEGER,
    "timer_order_taken" TIMESTAMP(6) NOT NULL,
    "delivery_time" DATE NOT NULL,
    "order_status" INTEGER,
    "id" SERIAL NOT NULL,
    "purchase_order_number" BIGINT NOT NULL,

    CONSTRAINT "sales_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status" (
    "key" VARCHAR(10) NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_selles_person_id_fkey" FOREIGN KEY ("seles_person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales_item" ADD CONSTRAINT "sales_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales_item" ADD CONSTRAINT "sales_item_seles_order_id_fkey" FOREIGN KEY ("seles_order_id") REFERENCES "sales_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_order_status_fkey" FOREIGN KEY ("order_status") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
