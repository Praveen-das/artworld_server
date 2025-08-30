/*
  Warnings:

  - The values [not_active,active,inactive] on the enum `linked_account_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `productId` to the `linked_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stakeholderId` to the `linked_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "linked_account_status_new" AS ENUM ('created', 'suspended');
ALTER TABLE "linked_account" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "linked_account" ALTER COLUMN "status" TYPE "linked_account_status_new" USING ("status"::text::"linked_account_status_new");
ALTER TYPE "linked_account_status" RENAME TO "linked_account_status_old";
ALTER TYPE "linked_account_status_new" RENAME TO "linked_account_status";
DROP TYPE "linked_account_status_old";
ALTER TABLE "linked_account" ALTER COLUMN "status" SET DEFAULT 'created';
COMMIT;

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "cart_item" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "linked_account" ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "stakeholderId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'created';

-- AlterTable
ALTER TABLE "recently_viewed" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "sales_order" ALTER COLUMN "timer_order_taken" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "wishlist" ALTER COLUMN "createdAt" SET DEFAULT NOW();
