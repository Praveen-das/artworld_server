/*
  Warnings:

  - You are about to drop the column `collectionsId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `styleId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `SubCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_collectionsId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_styleId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_categoryId_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "collectionsId",
DROP COLUMN "styleId",
DROP COLUMN "subCategoryId",
DROP COLUMN "subjectId",
ADD COLUMN     "collections_id" INTEGER,
ADD COLUMN     "style_id" INTEGER,
ADD COLUMN     "subCategory_id" INTEGER,
ADD COLUMN     "subject_id" INTEGER,
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "categoryId",
ADD COLUMN     "category_id" INTEGER;

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
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategory_id_fkey" FOREIGN KEY ("subCategory_id") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_style_id_fkey" FOREIGN KEY ("style_id") REFERENCES "Style"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_collections_id_fkey" FOREIGN KEY ("collections_id") REFERENCES "Collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
