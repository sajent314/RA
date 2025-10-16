-- Drop existing tables in reverse order of dependency
DROP TABLE IF EXISTS "products";
DROP TABLE IF EXISTS "follows";
DROP TABLE IF EXISTS "positive_energy_interactions";
DROP TABLE IF EXISTS "challenge_participations";
DROP TABLE IF EXISTS "challenge_submissions"; -- In case old one exists
DROP TABLE IF EXISTS "hourly_challenges";
DROP TABLE IF EXISTS "challenges"; -- In case old one exists
DROP TABLE IF EXISTS "profiles";

-- Create profiles table with interests
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    interests TEXT[],
    current_grade TEXT DEFAULT 'F',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create activity_logs for daily tracking
CREATE TABLE activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    pebi_score INTEGER DEFAULT 0,
    ai_score INTEGER DEFAULT 0,
    at_score NUMERIC(10, 2) DEFAULT 0, -- For distance in km
    UNIQUE(user_id, log_date)
);

-- Create hourly_challenges table
CREATE TABLE hourly_challenges (
    id SERIAL PRIMARY KEY,
    hour INTEGER UNIQUE NOT NULL CHECK (hour >= 6 AND hour <= 22),
    title TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Create challenge_submissions table
CREATE TABLE challenge_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES hourly_challenges(id),
    media_url TEXT,
    media_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create positive_energy_interactions table
CREATE TABLE positive_energy_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL, -- 'submission' or 'challenge'
    target_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create follows table for curated feed
CREATE TABLE follows (
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (follower_id, following_id)
);

-- Create products table for profile store
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
