/*
  Warnings:

  - Added the required column `modifiedAt` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `review` on the `Reviews` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "modifiedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT NOW(),
ALTER COLUMN "vote" DROP NOT NULL,
ALTER COLUMN "vote" SET DEFAULT 0,
ALTER COLUMN "vote" SET DATA TYPE INTEGER,
DROP COLUMN "review",
ADD COLUMN     "review" JSONB NOT NULL;
