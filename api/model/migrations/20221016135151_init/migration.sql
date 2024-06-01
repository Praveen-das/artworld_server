/*
  Warnings:

  - You are about to drop the column `birth_date` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `zip_code` on the `person` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "person" DROP COLUMN "birth_date",
DROP COLUMN "city",
DROP COLUMN "company",
DROP COLUMN "phone",
DROP COLUMN "sex",
DROP COLUMN "state",
DROP COLUMN "street",
DROP COLUMN "zip_code",
ALTER COLUMN "middle_name" DROP NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "address" (
    "flat" VARCHAR(60) NOT NULL,
    "company" VARCHAR(60),
    "street" VARCHAR(60) NOT NULL,
    "city" VARCHAR(40) NOT NULL,
    "state" CHAR(2) NOT NULL,
    "zip_code" INTEGER NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "id" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "address_flat_company_key" ON "address"("flat", "company");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
