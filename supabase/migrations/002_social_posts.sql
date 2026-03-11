-- Social posts tracking table
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tweet_text TEXT NOT NULL,
  tweet_type VARCHAR(50) NOT NULL,
  tweet_id VARCHAR(100),
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_posts_posted_at ON social_posts(posted_at DESC);
