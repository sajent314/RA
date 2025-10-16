-- Drop existing tables
DROP TABLE IF EXISTS "challenge_submissions";
DROP TABLE IF EXISTS "challenges";
DROP TABLE IF EXISTS "positive_energy_interactions";
DROP TABLE IF EXISTS "follows";
DROP TABLE IF EXISTS "profiles";

-- Create new profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    pebi_score INTEGER DEFAULT 0,
    ai_score INTEGER DEFAULT 0,
    at_score INTEGER DEFAULT 0,
    current_grade TEXT DEFAULT 'F',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create hourly_challenges table
CREATE TABLE hourly_challenges (
    id SERIAL PRIMARY KEY,
    hour INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Create challenge_participations table
CREATE TABLE challenge_participations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    challenge_id INTEGER REFERENCES hourly_challenges(id),
    media_url TEXT,
    media_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create positive_energy_interactions table
CREATE TABLE positive_energy_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES profiles(id),
    receiver_id UUID REFERENCES profiles(id),
    target_type TEXT,
    target_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create follows table
CREATE TABLE follows (
    follower_id UUID REFERENCES profiles(id),
    following_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (follower_id, following_id)
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES profiles(id),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
