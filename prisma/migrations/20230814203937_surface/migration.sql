/*
  Warnings:

  - You are about to drop the column `surfaceId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Surface` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_surfaceId_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "surfaceId",
ADD COLUMN     "material_id" INTEGER,
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "createdAt" SET DEFAULT NOW();

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

-- DropTable
DROP TABLE "Surface";

-- CreateTable
CREATE TABLE "Material" (
    "name" VARCHAR(20) NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;
