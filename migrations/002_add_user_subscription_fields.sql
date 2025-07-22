-- Add subscription and AI access fields to user table
ALTER TABLE user ADD COLUMN subscription_tier TEXT DEFAULT 'free';
ALTER TABLE user ADD COLUMN subscription_status TEXT DEFAULT 'active';
ALTER TABLE user ADD COLUMN subscription_expires_at INTEGER;
ALTER TABLE user ADD COLUMN ai_access_enabled INTEGER DEFAULT 0;

-- Update existing users to have the new defaults
UPDATE user SET 
    subscription_tier = 'free',
    subscription_status = 'active',
    ai_access_enabled = 0
WHERE subscription_tier IS NULL;
