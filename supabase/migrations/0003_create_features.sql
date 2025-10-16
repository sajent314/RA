-- Create parties table for live streams
CREATE TABLE parties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    privacy_level TEXT DEFAULT 'public' NOT NULL CHECK (privacy_level IN ('public', 'private')),
    max_viewers INTEGER,
    stream_url TEXT,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'live', 'ended')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_challenges table for user-generated challenges
CREATE TABLE user_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    difficulty TEXT,
    estimated_time TEXT,
    media_url TEXT,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now()
);
