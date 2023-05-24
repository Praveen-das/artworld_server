/*
  Warnings:

  - You are about to drop the `status` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "status_type" AS ENUM ('pending', 'processing', 'delivered', 'cancelled');

-- DropForeignKey
ALTER TABLE "sales_order" DROP CONSTRAINT "sales_order_order_status_fkey";

-- AlterTable
ALTER TABLE "sales_order" ADD COLUMN     "status" "status_type" DEFAULT 'pending';

-- DropTable
DROP TABLE "status";
