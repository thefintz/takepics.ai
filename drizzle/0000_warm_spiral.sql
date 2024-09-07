CREATE TABLE `creations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image_id` integer NOT NULL,
	`data` text NOT NULL,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`url` text NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`image` text NOT NULL
);
