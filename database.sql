-- HobbyHub Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    category TEXT,
    upvotes INTEGER DEFAULT 0,
    user_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    user_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Migration script to add user_id and author_name columns to existing tables

-- Add new columns to posts table if they don't exist
DO $$ 
BEGIN
    -- Add user_id column to posts
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='user_id') THEN
        ALTER TABLE posts ADD COLUMN user_id TEXT;
    END IF;
    
    -- Add author_name column to posts
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='author_name') THEN
        ALTER TABLE posts ADD COLUMN author_name TEXT;
    END IF;
END $$;

-- Add new columns to comments table if they don't exist
DO $$ 
BEGIN
    -- Add user_id column to comments
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='user_id') THEN
        ALTER TABLE comments ADD COLUMN user_id TEXT;
    END IF;
    
    -- Add author_name column to comments
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='author_name') THEN
        ALTER TABLE comments ADD COLUMN author_name TEXT;
    END IF;
END $$;

-- Update existing posts with default values (if any exist)
UPDATE posts 
SET 
    user_id = 'legacy_user_' || id::text,
    author_name = 'Legacy User'
WHERE user_id IS NULL OR author_name IS NULL;

-- Update existing comments with default values (if any exist)
UPDATE comments 
SET 
    user_id = 'legacy_user_' || id::text,
    author_name = COALESCE(author, 'Legacy User')  -- Use existing author field if available
WHERE user_id IS NULL OR author_name IS NULL;

-- Now make the columns NOT NULL
ALTER TABLE posts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE posts ALTER COLUMN author_name SET NOT NULL;
ALTER TABLE comments ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE comments ALTER COLUMN author_name SET NOT NULL;

-- Drop the old author column from comments if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='author') THEN
        ALTER TABLE comments DROP COLUMN author;
    END IF;
END $$;

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments(user_id);

-- Ensure other indexes exist
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_upvotes_idx ON posts(upvotes DESC);
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Anyone can view posts" ON posts;
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- Create new policies for posts
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (true);

-- Create new policies for comments  
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own comments" ON comments FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (true); 