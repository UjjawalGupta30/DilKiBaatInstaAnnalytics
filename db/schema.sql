-- PostgreSQL starter schema for the next integration phase
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  topic TEXT NOT NULL,
  format TEXT NOT NULL,
  hook TEXT,
  script TEXT,
  caption TEXT,
  asset_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('idea','draft','needs_review','approved','scheduled','publishing','published','failed','archived')),
  scheduled_at TIMESTAMPTZ,
  instagram_media_id TEXT,
  instagram_permalink TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trend_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  relevance_score NUMERIC(5,2),
  freshness_score NUMERIC(5,2),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'candidate'
);

CREATE TABLE IF NOT EXISTS post_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reach INTEGER,
  plays INTEGER,
  likes INTEGER,
  comments INTEGER,
  shares INTEGER,
  saves INTEGER,
  profile_activity INTEGER,
  follows INTEGER,
  avg_watch_time_seconds NUMERIC(10,2),
  raw_payload JSONB
);
