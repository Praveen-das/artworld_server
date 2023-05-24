-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "rating" INTEGER,
ALTER COLUMN "createdAt" SET DEFAULT NOW();

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

-- CreateTriggerFunction
-- CREATE OR REPLACE FUNCTION trigger_avg_product_rating()
--     RETURNS trigger
--     LANGUAGE 'plpgsql'
-- AS 
-- $BODY$
-- BEGIN
-- 	UPDATE "Product" SET rating = (SELECT AVG(vote) FROM "Reviews" WHERE "Product".id = NEW.product_id);
-- 	RETURN NEW;
-- END;
-- $BODY$;

-- -- CreateTrigger
-- CREATE TRIGGER trigger_default_address
--     BEFORE INSERT OR UPDATE
--     ON public."Reviews"
--     FOR EACH ROW
--     EXECUTE FUNCTION public.set_trigger();
