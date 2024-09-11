CREATE INDEX IF NOT EXISTS "creations_image_id_idx" ON "creations" USING btree ("image_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "images_user_id_idx" ON "images" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");