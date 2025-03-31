/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Collections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Collections` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `category_id` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `styleId` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `subCategoryId` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `subjectId` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `surfaceId` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `collectionsId` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Style` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Style` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SubCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SubCategory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Subject` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Surface` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Surface` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_collectionsId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_styleId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_surfaceId_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Collections" DROP CONSTRAINT "Collections_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Collections_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "createdAt" SET DEFAULT NOW(),
DROP COLUMN "category_id",
ADD COLUMN     "category_id" INTEGER,
DROP COLUMN "styleId",
ADD COLUMN     "styleId" INTEGER,
DROP COLUMN "subCategoryId",
ADD COLUMN     "subCategoryId" INTEGER,
DROP COLUMN "subjectId",
ADD COLUMN     "subjectId" INTEGER,
DROP COLUMN "surfaceId",
ADD COLUMN     "surfaceId" INTEGER,
DROP COLUMN "collectionsId",
ADD COLUMN     "collectionsId" INTEGER;

-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Style" DROP CONSTRAINT "Style_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Style_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Surface" DROP CONSTRAINT "Surface_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Surface_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "cart_item" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "recently_viewed" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "sales_order" ALTER COLUMN "timer_order_taken" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "wishlist" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_surfaceId_fkey" FOREIGN KEY ("surfaceId") REFERENCES "Surface"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_collectionsId_fkey" FOREIGN KEY ("collectionsId") REFERENCES "Collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
