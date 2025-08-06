-- GuardianChain User-Scoped Database Schema
-- Complete security-first approach with Row Level Security (RLS)

-- Enable UUID extension for secure primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table - central user management
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  tier TEXT DEFAULT 'SEEKER' CHECK (tier IN ('SEEKER', 'EXPLORER', 'CREATOR', 'SOVEREIGN', 'ADMIN')),
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'canceled', 'expired')),
  onboarding_completed BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-scoped capsules table with complete ownership control
CREATE TABLE capsules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_wallet_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  grief_score INTEGER DEFAULT 0,
  gtt_reward DECIMAL(10,2) DEFAULT 0,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'friends', 'public', 'unlockable')),
  unlock_conditions JSONB DEFAULT '{}',
  time_locked_until TIMESTAMPTZ,
  is_sealed BOOLEAN DEFAULT false,
  is_minted BOOLEAN DEFAULT false,
  nft_token_id TEXT,
  ipfs_hash TEXT,
  media_urls TEXT[],
  tags TEXT[],
  emotional_tags JSONB DEFAULT '{}',
  lineage_parent_id UUID REFERENCES capsules(id),
  remix_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  unlock_count INTEGER DEFAULT 0,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Capsule access permissions - who can see what
CREATE TABLE capsule_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
  granted_to_wallet TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  permission_type TEXT NOT NULL CHECK (permission_type IN ('view', 'unlock', 'remix', 'comment')),
  granted_by_wallet TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(capsule_id, granted_to_wallet, permission_type)
);

-- User capsule unlocks - track who unlocked what and when
CREATE TABLE capsule_unlocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
  unlocked_by_wallet TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  unlock_method TEXT DEFAULT 'standard' CHECK (unlock_method IN ('standard', 'gtt_payment', 'time_release', 'permission')),
  gtt_spent DECIMAL(10,2) DEFAULT 0,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(capsule_id, unlocked_by_wallet)
);

-- User playlists - personal capsule collections
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_wallet_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  capsule_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User vault entries - personal storage and memories
CREATE TABLE vault_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_wallet_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  entry_type TEXT DEFAULT 'memory' CHECK (entry_type IN ('memory', 'document', 'media', 'note')),
  is_encrypted BOOLEAN DEFAULT false,
  encryption_key_hash TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User GTT balances and transactions
CREATE TABLE gtt_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  balance DECIMAL(20,8) DEFAULT 0,
  total_earned DECIMAL(20,8) DEFAULT 0,
  total_spent DECIMAL(20,8) DEFAULT 0,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wallet_address)
);

-- User activity logs
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_wallet_address TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE capsule_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE capsule_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gtt_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile and public profiles" ON profiles
  FOR SELECT USING (
    wallet_address = auth.uid()::text OR 
    wallet_address IN (
      SELECT owner_wallet_address FROM capsules WHERE visibility = 'public'
    )
  );

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (wallet_address = auth.uid()::text);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (wallet_address = auth.uid()::text);

-- RLS Policies for capsules
CREATE POLICY "Users can view capsules they own or have access to" ON capsules
  FOR SELECT USING (
    owner_wallet_address = auth.uid()::text OR
    visibility = 'public' OR
    (visibility = 'friends' AND owner_wallet_address IN (
      SELECT granted_to_wallet FROM capsule_permissions 
      WHERE granted_to_wallet = auth.uid()::text AND permission_type = 'view'
    )) OR
    id IN (
      SELECT capsule_id FROM capsule_permissions 
      WHERE granted_to_wallet = auth.uid()::text AND permission_type = 'view'
    )
  );

CREATE POLICY "Users can insert their own capsules" ON capsules
  FOR INSERT WITH CHECK (owner_wallet_address = auth.uid()::text);

CREATE POLICY "Users can update their own capsules" ON capsules
  FOR UPDATE USING (owner_wallet_address = auth.uid()::text);

CREATE POLICY "Users can delete their own capsules" ON capsules
  FOR DELETE USING (owner_wallet_address = auth.uid()::text);

-- RLS Policies for capsule_permissions
CREATE POLICY "Users can view permissions for their capsules or permissions granted to them" ON capsule_permissions
  FOR SELECT USING (
    granted_by_wallet = auth.uid()::text OR 
    granted_to_wallet = auth.uid()::text
  );

CREATE POLICY "Users can grant permissions for their own capsules" ON capsule_permissions
  FOR INSERT WITH CHECK (granted_by_wallet = auth.uid()::text);

CREATE POLICY "Users can revoke permissions they granted" ON capsule_permissions
  FOR DELETE USING (granted_by_wallet = auth.uid()::text);

-- RLS Policies for capsule_unlocks
CREATE POLICY "Users can view their own unlocks and unlocks of their capsules" ON capsule_unlocks
  FOR SELECT USING (
    unlocked_by_wallet = auth.uid()::text OR
    capsule_id IN (SELECT id FROM capsules WHERE owner_wallet_address = auth.uid()::text)
  );

CREATE POLICY "Users can record their own unlocks" ON capsule_unlocks
  FOR INSERT WITH CHECK (unlocked_by_wallet = auth.uid()::text);

-- RLS Policies for playlists
CREATE POLICY "Users can view their own playlists and public playlists" ON playlists
  FOR SELECT USING (
    owner_wallet_address = auth.uid()::text OR is_public = true
  );

CREATE POLICY "Users can manage their own playlists" ON playlists
  FOR ALL USING (owner_wallet_address = auth.uid()::text);

-- RLS Policies for vault_entries
CREATE POLICY "Users can only access their own vault entries" ON vault_entries
  FOR ALL USING (owner_wallet_address = auth.uid()::text);

-- RLS Policies for gtt_balances
CREATE POLICY "Users can only view their own GTT balance" ON gtt_balances
  FOR ALL USING (wallet_address = auth.uid()::text);

-- RLS Policies for user_activities
CREATE POLICY "Users can only view their own activities" ON user_activities
  FOR ALL USING (user_wallet_address = auth.uid()::text);

-- Create indexes for performance
CREATE INDEX idx_capsules_owner ON capsules(owner_wallet_address);
CREATE INDEX idx_capsules_visibility ON capsules(visibility);
CREATE INDEX idx_capsules_created_at ON capsules(created_at DESC);
CREATE INDEX idx_capsule_permissions_granted_to ON capsule_permissions(granted_to_wallet);
CREATE INDEX idx_capsule_unlocks_user ON capsule_unlocks(unlocked_by_wallet);
CREATE INDEX idx_playlists_owner ON playlists(owner_wallet_address);
CREATE INDEX idx_vault_entries_owner ON vault_entries(owner_wallet_address);
CREATE INDEX idx_gtt_balances_wallet ON gtt_balances(wallet_address);
CREATE INDEX idx_user_activities_user ON user_activities(user_wallet_address);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_capsules_updated_at BEFORE UPDATE ON capsules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON playlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_entries_updated_at BEFORE UPDATE ON vault_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gtt_balances_updated_at BEFORE UPDATE ON gtt_balances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();