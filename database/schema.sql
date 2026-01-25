-- PowerCore Unified Dashboard - Database Schema
-- Generated: 2026-01-23
-- Phase 4: Database Schema Updates

-- =============================================================================
-- USERS TABLE (Base table - assumed to exist, but included for reference)
-- =============================================================================
-- Note: If users table doesn't exist, uncomment and create it:
/*
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
*/

-- =============================================================================
-- AGENTS TABLE
-- =============================================================================
-- Core agents table for marketplace and user-owned agents
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  avatar TEXT,                    -- Emoji or image URL
  system_prompt TEXT,
  model VARCHAR(100),             -- e.g., "claude-3-5-sonnet"
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 4096,
  
  -- Creator & Ownership
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_name VARCHAR(255),
  
  -- Pricing & Monetization
  tier VARCHAR(20) DEFAULT 'free',  -- 'free', 'pro', 'enterprise'
  visibility VARCHAR(20) DEFAULT 'private',  -- 'private', 'public', 'marketplace'
  price DECIMAL(10,2) DEFAULT 0,
  price_type VARCHAR(20) DEFAULT 'free',  -- 'one-time', 'monthly', 'free'
  
  -- Stats & Metrics
  installs INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  total_runs INTEGER DEFAULT 0,
  last_used TIMESTAMP,
  
  -- Metadata
  category VARCHAR(100),
  tags TEXT[],
  changelog JSONB,
  reviews_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for agents
CREATE INDEX IF NOT EXISTS idx_agents_creator_id ON agents(creator_id);
CREATE INDEX IF NOT EXISTS idx_agents_visibility ON agents(visibility);
CREATE INDEX IF NOT EXISTS idx_agents_category ON agents(category);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agents_rating ON agents(rating DESC);

-- =============================================================================
-- SKILLS TABLE
-- =============================================================================
-- Modular capabilities that can be equipped to agents
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  manifest JSONB NOT NULL,        -- Skill configuration/manifest
  icon TEXT,                        -- Icon URL or emoji
  
  -- Creator & Ownership
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_name VARCHAR(255),
  
  -- Categorization
  category VARCHAR(100),
  tags TEXT[],
  
  -- Pricing & Monetization
  price DECIMAL(10,2) DEFAULT 0,
  price_type VARCHAR(20) DEFAULT 'free',  -- 'one-time', 'monthly', 'free'
  
  -- Verification & Stats
  verified BOOLEAN DEFAULT false,
  installs INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  
  -- Metadata
  version VARCHAR(50) DEFAULT '1.0.0',
  documentation_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for skills
CREATE INDEX IF NOT EXISTS idx_skills_creator_id ON skills(creator_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_verified ON skills(verified);
CREATE INDEX IF NOT EXISTS idx_skills_rating ON skills(rating DESC);

-- =============================================================================
-- AGENT-SKILL RELATIONSHIPS (Loadouts)
-- =============================================================================
-- Tracks which skills are equipped to which agents
CREATE TABLE IF NOT EXISTS agent_skills (
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  slot_position INTEGER,            -- Position in skill loadout (1-10)
  equipped_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (agent_id, skill_id)
);

-- Indexes for agent_skills
CREATE INDEX IF NOT EXISTS idx_agent_skills_agent_id ON agent_skills(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_skills_skill_id ON agent_skills(skill_id);

-- =============================================================================
-- USER AGENT OWNERSHIP
-- =============================================================================
-- Tracks which agents users own/purchased
CREATE TABLE IF NOT EXISTS user_agents (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP DEFAULT NOW(),
  payment_method VARCHAR(50),       -- 'stripe', 'x402', 'crypto', 'credits', 'free'
  purchase_price DECIMAL(10,2),
  PRIMARY KEY (user_id, agent_id)
);

-- Indexes for user_agents
CREATE INDEX IF NOT EXISTS idx_user_agents_user_id ON user_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_agents_agent_id ON user_agents(agent_id);

-- =============================================================================
-- USER SKILL OWNERSHIP
-- =============================================================================
-- Tracks which skills users own/purchased
CREATE TABLE IF NOT EXISTS user_skills (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP DEFAULT NOW(),
  payment_method VARCHAR(50),       -- 'stripe', 'x402', 'crypto', 'credits', 'free'
  purchase_price DECIMAL(10,2),
  PRIMARY KEY (user_id, skill_id)
);

-- Indexes for user_skills
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);

-- =============================================================================
-- PAYMENT TRANSACTIONS
-- =============================================================================
-- Records all payment transactions across all payment rails
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Item being purchased
  item_type VARCHAR(50) NOT NULL,  -- 'agent', 'skill', 'subscription', 'credits'
  item_id UUID,                      -- Reference to agent/skill/etc.
  
  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  payment_method VARCHAR(50) NOT NULL,  -- 'stripe', 'x402', 'crypto', 'credits'
  
  -- Status tracking
  status VARCHAR(20) NOT NULL,       -- 'pending', 'completed', 'failed', 'refunded'
  
  -- Payment provider metadata
  provider_transaction_id VARCHAR(255),  -- Stripe payment_intent_id, etc.
  metadata JSONB,                    -- Additional payment data
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_item ON payments(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_provider_id ON payments(provider_transaction_id);

-- =============================================================================
-- USER CREDITS
-- =============================================================================
-- Internal credits system for users
CREATE TABLE IF NOT EXISTS user_credits (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0 CHECK (balance >= 0),
  total_earned DECIMAL(10,2) DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- CONTEXT COMPRESSION CACHE (RLM)
-- =============================================================================
-- Recursive Language Model context compression cache
CREATE TABLE IF NOT EXISTS context_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Compression levels
  level1_summaries JSONB,           -- Level 1 summaries (message groups)
  level2_summary TEXT,              -- Level 2 summary (full conversation)
  
  -- Metadata
  raw_message_count INTEGER,
  compressed_message_count INTEGER,
  compression_ratio DECIMAL(5,2),
  
  -- Expiration
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  
  -- Index for efficient lookups
  UNIQUE(agent_id, user_id, created_at)
);

-- Indexes for context_cache
CREATE INDEX IF NOT EXISTS idx_context_cache_agent_user ON context_cache(agent_id, user_id);
CREATE INDEX IF NOT EXISTS idx_context_cache_expires ON context_cache(expires_at) WHERE expires_at IS NOT NULL;

-- =============================================================================
-- REVIEWS & RATINGS
-- =============================================================================
-- User reviews for agents and skills
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Item being reviewed
  item_type VARCHAR(50) NOT NULL,  -- 'agent', 'skill'
  item_id UUID NOT NULL,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  
  -- Metadata
  helpful_count INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Prevent duplicate reviews
  UNIQUE(user_id, item_type, item_id)
);

-- Indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);

-- =============================================================================
-- SUBSCRIPTIONS
-- =============================================================================
-- Recurring subscriptions for agents/skills
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Subscription target
  item_type VARCHAR(50) NOT NULL,  -- 'agent', 'skill'
  item_id UUID NOT NULL,
  
  -- Subscription details
  plan_id VARCHAR(100),            -- Stripe plan ID, etc.
  status VARCHAR(20) NOT NULL,    -- 'active', 'canceled', 'past_due', 'expired'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  
  -- Payment
  payment_method VARCHAR(50),
  amount DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  
  -- Provider metadata
  provider_subscription_id VARCHAR(255),  -- Stripe subscription_id, etc.
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  canceled_at TIMESTAMP
);

-- Indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_item ON subscriptions(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period_end ON subscriptions(current_period_end);

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================
-- Auto-update updated_at timestamp on row updates

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- FUNCTIONS FOR STATS UPDATES
-- =============================================================================

-- Function to update agent stats after review
CREATE OR REPLACE FUNCTION update_agent_stats_after_review()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.item_type = 'agent' THEN
        UPDATE agents
        SET 
            rating = (
                SELECT COALESCE(AVG(rating), 0)
                FROM reviews
                WHERE item_type = 'agent' AND item_id = NEW.item_id
            ),
            reviews_count = (
                SELECT COUNT(*)
                FROM reviews
                WHERE item_type = 'agent' AND item_id = NEW.item_id
            )
        WHERE id = NEW.item_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_agent_stats_after_review
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW
    WHEN (NEW.item_type = 'agent')
    EXECUTE FUNCTION update_agent_stats_after_review();

-- Function to update skill stats after review
CREATE OR REPLACE FUNCTION update_skill_stats_after_review()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.item_type = 'skill' THEN
        UPDATE skills
        SET 
            rating = (
                SELECT COALESCE(AVG(rating), 0)
                FROM reviews
                WHERE item_type = 'skill' AND item_id = NEW.item_id
            )
        WHERE id = NEW.item_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_skill_stats_after_review
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW
    WHEN (NEW.item_type = 'skill')
    EXECUTE FUNCTION update_skill_stats_after_review();

-- =============================================================================
-- COMMENTS & DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE agents IS 'Core agents table for marketplace and user-owned agents';
COMMENT ON TABLE skills IS 'Modular capabilities that can be equipped to agents';
COMMENT ON TABLE agent_skills IS 'Tracks which skills are equipped to which agents (loadouts)';
COMMENT ON TABLE user_agents IS 'Tracks which agents users own/purchased';
COMMENT ON TABLE user_skills IS 'Tracks which skills users own/purchased';
COMMENT ON TABLE payments IS 'Records all payment transactions across all payment rails';
COMMENT ON TABLE user_credits IS 'Internal credits system for users';
COMMENT ON TABLE context_cache IS 'Recursive Language Model context compression cache';
COMMENT ON TABLE reviews IS 'User reviews for agents and skills';
COMMENT ON TABLE subscriptions IS 'Recurring subscriptions for agents/skills';
