/*
  Warnings:

  - The values [processing,delivered] on the enum `status_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `sales_order_id` on the `cart_item` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_time` on the `sales_order` table. All the data in the column will be lost.
  - Added the required column `cart_item_id` to the `sales_order` table without a default value. This is not possible if the table is not empty.
  - Made the column `customer_id` on table `sales_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seller_id` on table `sales_order` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "payment_type" AS ENUM ('card', 'cod', 'net_banking', 'upi');

-- AlterEnum
BEGIN;
CREATE TYPE "status_type_new" AS ENUM ('pending', 'shipped', 'completed', 'declined', 'refunded', 'cancelled');
ALTER TABLE "sales_order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "sales_order" ALTER COLUMN "status" TYPE "status_type_new" USING ("status"::text::"status_type_new");
ALTER TYPE "status_type" RENAME TO "status_type_old";
ALTER TYPE "status_type_new" RENAME TO "status_type";
DROP TYPE "status_type_old";
ALTER TABLE "sales_order" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_sales_order_id_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "cart_item" DROP COLUMN "sales_order_id";

-- AlterTable
ALTER TABLE "recently_viewed" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "sales_order" DROP COLUMN "delivery_time",
ADD COLUMN     "cart_item_id" TEXT NOT NULL,
ADD COLUMN     "payment_method" "payment_type" NOT NULL DEFAULT 'card',
ALTER COLUMN "timer_order_taken" SET DEFAULT NOW(),
ALTER COLUMN "customer_id" SET NOT NULL,
ALTER COLUMN "seller_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "wishlist" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_cart_item_id_fkey" FOREIGN KEY ("cart_item_id") REFERENCES "cart_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
