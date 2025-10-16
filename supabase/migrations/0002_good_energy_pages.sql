-- Add verification status to profiles
ALTER TABLE profiles
ADD COLUMN is_verified BOOLEAN DEFAULT false;

-- Add follow type to follows table
ALTER TABLE follows
ADD COLUMN follow_type TEXT DEFAULT 'user' NOT NULL CHECK (follow_type IN ('user', 'good_energy_page'));
