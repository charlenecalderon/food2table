/*
  Warnings:

  - The values [BUYER,SELLER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
*/

BEGIN;

-- 1) Create the new enum
CREATE TYPE "public"."Role_new" AS ENUM ('USER', 'ADMIN');

-- 2) Add a temporary column using the new enum type
ALTER TABLE "public"."User"
ADD COLUMN "roles_new" "public"."Role_new"[];

-- 3) Copy and transform old values
-- BUYER  -> USER
-- SELLER -> removed
-- ADMIN  -> ADMIN
UPDATE "public"."User"
SET "roles_new" = array_remove(
  array_replace("roles"::text[], 'BUYER', 'USER'),
  'SELLER'
)::"public"."Role_new"[];

-- 4) If you want a default for any null/empty cases, set it after copy
ALTER TABLE "public"."User"
ALTER COLUMN "roles_new" SET DEFAULT ARRAY['USER']::"public"."Role_new"[];

-- Optional: if you never want NULL in roles
UPDATE "public"."User"
SET "roles_new" = ARRAY['USER']::"public"."Role_new"[]
WHERE "roles_new" IS NULL;

ALTER TABLE "public"."User"
ALTER COLUMN "roles_new" SET NOT NULL;

-- 5) Remove old column
ALTER TABLE "public"."User" DROP COLUMN "roles";

-- 6) Rename temp column back to roles
ALTER TABLE "public"."User" RENAME COLUMN "roles_new" TO "roles";

-- 7) Swap enum names
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";

-- 8) Drop old enum
DROP TYPE "public"."Role_old";

COMMIT;