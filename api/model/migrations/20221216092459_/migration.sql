-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "createdAt" SET DEFAULT NOW(),
ALTER COLUMN "rating" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "recently_viewed" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "sales_order" ALTER COLUMN "timer_order_taken" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "wishlist" ALTER COLUMN "createdAt" SET DEFAULT NOW();
