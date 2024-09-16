ALTER TABLE "creations" DROP CONSTRAINT "creations_image_id_images_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "creations_image_id_idx";--> statement-breakpoint
ALTER TABLE "creations" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "creations" ADD COLUMN "prompt" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "creations" ADD CONSTRAINT "creations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creations_user_id_idx" ON "creations" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "creations" DROP COLUMN IF EXISTS "image_id";