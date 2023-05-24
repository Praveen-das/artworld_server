-- CreateTriggerFunction
CREATE OR REPLACE FUNCTION trigger_avg_product_rating()
    RETURNS trigger
    LANGUAGE 'plpgsql'
AS 
$BODY$
BEGIN
	UPDATE "Product" SET rating = (SELECT AVG(vote) FROM "Reviews" WHERE "Product".id = NEW.product_id);
	RETURN NEW;
END;
$BODY$;

-- CreateTrigger
CREATE TRIGGER set_avg_product_rating
    BEFORE INSERT OR UPDATE
    ON public."Reviews"
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_avg_product_rating();