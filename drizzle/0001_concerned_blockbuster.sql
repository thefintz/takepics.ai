ALTER TABLE "trainings"
ADD COLUMN "model" jsonb NOT NULL;
--> statement-breakpoint
ALTER TABLE "trainings"
ADD COLUMN "training" jsonb NOT NULL;
--> statement-breakpoint
ALTER TABLE "trainings" DROP COLUMN IF EXISTS "model_name";
--> statement-breakpoint
ALTER TABLE "trainings" DROP COLUMN IF EXISTS "model_url";
--> statement-breakpoint
ALTER TABLE "trainings" DROP COLUMN IF EXISTS "is_person_model";
--> statement-breakpoint
ALTER TABLE "trainings" DROP COLUMN IF EXISTS "eye_color";
--> statement-breakpoint
ALTER TABLE "trainings" DROP COLUMN IF EXISTS "gender";
--> statement-breakpoint
ALTER TABLE "trainings" DROP COLUMN IF EXISTS "status";