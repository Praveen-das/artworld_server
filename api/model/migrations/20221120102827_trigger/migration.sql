/*
  Warnings:

  - Made the column `isDefault` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "isDefault" SET NOT NULL;

--CreateTriggerFunction
CREATE OR REPLACE FUNCTION set_trigger()
    RETURNS trigger
    LANGUAGE 'plpgsql'
AS 
$BODY$
BEGIN
	UPDATE "Address" SET "isDefault" = false WHERE "isDefault" = true AND "user_id" = NEW."user_id";
  RETURN NEW;
END;
$BODY$;

--CreateTrigger
CREATE TRIGGER trigger_default_address
    BEFORE INSERT OR UPDATE OF "isDefault"
    ON public."Address"
    FOR EACH ROW
    WHEN (new."isDefault" = true)
    EXECUTE FUNCTION public.set_trigger();