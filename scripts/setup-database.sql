-- GuardianChain Database Schema Setup
-- This file contains the complete database schema for GuardianChain
-- Execute this in your Supabase SQL editor or PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication and profile management
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Newsletter subscribers table for email marketing
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    status VARCHAR DEFAULT 'active'
);

-- Sessions table for user authentication
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Capsules table for truth capsule storage and search
CREATE TABLE IF NOT EXISTS capsules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content JSONB,
    author_id UUID REFERENCES users(id),
    author TEXT, -- Denormalized for search performance
    category TEXT,
    tags TEXT[],
    verification_status VARCHAR DEFAULT 'pending',
    grief_score TEXT DEFAULT '0',
    views TEXT DEFAULT '0',
    likes TEXT DEFAULT '0',
    comments TEXT DEFAULT '0',
    shares TEXT DEFAULT '0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create indexes for optimal performance

-- Session expiration index
CREATE INDEX IF NOT EXISTS idx_session_expire ON sessions(expire);

-- Full-text search support for capsules
CREATE INDEX IF NOT EXISTS idx_capsules_fulltext ON capsules 
USING gin (to_tsvector('english', title || ' ' || coalesce(description, '')));

-- Tag-based filtering for capsules
CREATE INDEX IF NOT EXISTS idx_capsules_tags ON capsules USING gin (tags);

-- Performance indexes for capsules
CREATE INDEX IF NOT EXISTS idx_capsules_author ON capsules(author);
CREATE INDEX IF NOT EXISTS idx_capsules_category ON capsules(category);
CREATE INDEX IF NOT EXISTS idx_capsules_created_at ON capsules(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_capsules_verification_status ON capsules(verification_status);

-- Insert sample data for testing (optional)
INSERT INTO capsules (title, description, author, category, tags, verification_status, grief_score, views, likes, comments, shares)
VALUES 
    (
        'Climate Change Evidence Documentation',
        'Comprehensive analysis of environmental data and research findings spanning three decades of climate research.',
        'EnvironmentalScientist',
        'Scientific Truth',
        ARRAY['climate', 'environment', 'research', 'data', 'science'],
        'verified',
        '92',
        '4521',
        '387',
        '78',
        '42'
    ),
    (
        'Corporate Transparency Report',
        'Internal documents revealing corporate practices and policies affecting employee welfare and environmental impact.',
        'CorporateWhistleblower',
        'Truth Testimony',
        ARRAY['corporate', 'transparency', 'whistleblower', 'policy', 'ethics'],
        'pending',
        '95',
        '1247',
        '89',
        '23',
        '15'
    ),
    (
        'Historical Family Archive',
        'Personal family history and documentation spanning three generations of immigration and cultural preservation.',
        'FamilyHistorian',
        'Personal History',
        ARRAY['family', 'history', 'immigration', 'heritage', 'culture'],
        'verified',
        '78',
        '2894',
        '156',
        '45',
        '28'
    ),
    (
        'Medical Research Integrity Study',
        'Analysis of research methodologies and data integrity in pharmaceutical studies over the past decade.',
        'ResearchEthicist',
        'Medical Truth',
        ARRAY['medical', 'research', 'ethics', 'pharmaceutical', 'integrity'],
        'verified',
        '89',
        '3762',
        '245',
        '67',
        '31'
    ),
    (
        'Educational Policy Impact Analysis',
        'Comprehensive study of educational policies and their real-world impact on student development and learning outcomes.',
        'EduAdvocate',
        'Educational Truth',
        ARRAY['education', 'policy', 'students', 'development', 'learning'],
        'verified',
        '84',
        '2156',
        '189',
        '34',
        '67'
    )
ON CONFLICT (id) DO NOTHING;

-- Create RLS (Row Level Security) policies if using Supabase
-- These ensure data security and proper access control

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE capsules ENABLE ROW LEVEL SECURITY;

-- Public read access for capsules (can be restricted based on requirements)
CREATE POLICY "Allow public read access to verified capsules" ON capsules
    FOR SELECT USING (verification_status = 'verified');

-- Users can insert their own capsules
CREATE POLICY "Users can insert their own capsules" ON capsules
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update their own capsules
CREATE POLICY "Users can update their own capsules" ON capsules
    FOR UPDATE USING (auth.uid() = author_id);

-- Newsletter subscriptions are publicly insertable
CREATE POLICY "Allow public newsletter subscription" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Users can read their own data
CREATE POLICY "Users can read their own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);