/*
  Warnings:

  - The `alternate_phone` column on the `Address` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `mobile` on the `Address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "mobile",
ADD COLUMN     "mobile" INTEGER NOT NULL,
DROP COLUMN "alternate_phone",
ADD COLUMN     "alternate_phone" INTEGER,
ALTER COLUMN "isDefault" DROP DEFAULT,
ALTER COLUMN "isDefault" SET DATA TYPE TEXT;
