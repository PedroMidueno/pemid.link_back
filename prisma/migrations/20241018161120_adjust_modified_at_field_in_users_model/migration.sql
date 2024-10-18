-- AlterTable
ALTER TABLE "users" ALTER COLUMN "modified_at" DROP NOT NULL,
ALTER COLUMN "modified_at" DROP DEFAULT;
