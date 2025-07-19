-- Migration to change age column to birthday column
-- This will drop the age column and add birthday column

-- Add birthday column
ALTER TABLE user ADD COLUMN birthday text;

-- Drop the age column (SQLite doesn't support DROP COLUMN directly, so we need to recreate the table)
-- First, create a backup of the user table data
CREATE TEMPORARY TABLE user_backup AS SELECT * FROM user;

-- Drop the original user table
DROP TABLE user;

-- Recreate the user table with birthday column instead of age
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`birthday` text,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`email` text,
	`display_name` text,
	`profile_image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

-- Recreate the indexes
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);

-- Restore the data (excluding the age column)
INSERT INTO user (id, username, password_hash, email, display_name, profile_image, created_at, updated_at)
SELECT id, username, password_hash, email, display_name, profile_image, created_at, updated_at
FROM user_backup;

-- Drop the backup table
DROP TABLE user_backup;
