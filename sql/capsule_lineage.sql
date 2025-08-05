-- GuardianChain Capsule Lineage Schema
-- Tracks provenance history and relationships between Truth Capsules

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Capsule lineage tracking table
CREATE TABLE IF NOT EXISTS capsule_lineage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_capsule UUID REFERENCES capsules(id) ON DELETE CASCADE,
    child_capsule UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL CHECK (action IN ('fork', 'merge', 'edit', 'derive', 'reference', 'verification')),
    metadata JSONB DEFAULT '{}',
    grief_flow DECIMAL(10,4) DEFAULT 0.0,
    influence_score DECIMAL(10,4) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure no duplicate relationships
    UNIQUE(parent_capsule, child_capsule, action)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_capsule_lineage_parent ON capsule_lineage(parent_capsule);
CREATE INDEX IF NOT EXISTS idx_capsule_lineage_child ON capsule_lineage(child_capsule);
CREATE INDEX IF NOT EXISTS idx_capsule_lineage_action ON capsule_lineage(action);
CREATE INDEX IF NOT EXISTS idx_capsule_lineage_created_at ON capsule_lineage(created_at);
CREATE INDEX IF NOT EXISTS idx_capsule_lineage_metadata ON capsule_lineage USING GIN(metadata);

-- DAO certification tracking
CREATE TABLE IF NOT EXISTS dao_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    certified_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reason TEXT,
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    certification_date TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for DAO certifications
CREATE INDEX IF NOT EXISTS idx_dao_certifications_capsule ON dao_certifications(capsule_id);
CREATE INDEX IF NOT EXISTS idx_dao_certifications_status ON dao_certifications(status);
CREATE INDEX IF NOT EXISTS idx_dao_certifications_certified_by ON dao_certifications(certified_by);
CREATE INDEX IF NOT EXISTS idx_dao_certifications_created_at ON dao_certifications(created_at);

-- Capsule mint logs for tracking NFT minting with GTT integration
CREATE TABLE IF NOT EXISTS capsule_mint_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capsule_id UUID NOT NULL REFERENCES capsules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mint_type VARCHAR(20) NOT NULL CHECK (mint_type IN ('stripe', 'gtt', 'free')),
    amount_paid DECIMAL(18,8) DEFAULT 0.0,
    gtt_burned DECIMAL(18,8) DEFAULT 0.0,
    user_tier VARCHAR(20) NOT NULL,
    blockchain_tx_hash VARCHAR(66),
    nft_token_id BIGINT,
    mint_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (mint_status IN ('pending', 'completed', 'failed')),
    stripe_session_id VARCHAR(255),
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for mint logs
CREATE INDEX IF NOT EXISTS idx_capsule_mint_logs_capsule ON capsule_mint_logs(capsule_id);
CREATE INDEX IF NOT EXISTS idx_capsule_mint_logs_user ON capsule_mint_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_capsule_mint_logs_status ON capsule_mint_logs(mint_status);
CREATE INDEX IF NOT EXISTS idx_capsule_mint_logs_tx_hash ON capsule_mint_logs(blockchain_tx_hash);
CREATE INDEX IF NOT EXISTS idx_capsule_mint_logs_created_at ON capsule_mint_logs(created_at);

-- Function to calculate lineage depth
CREATE OR REPLACE FUNCTION calculate_lineage_depth(start_capsule_id UUID)
RETURNS INTEGER AS $$
DECLARE
    max_depth INTEGER := 0;
    current_depth INTEGER;
BEGIN
    WITH RECURSIVE lineage_tree AS (
        -- Base case: start with the given capsule
        SELECT child_capsule, parent_capsule, 0 as depth
        FROM capsule_lineage
        WHERE child_capsule = start_capsule_id
        
        UNION ALL
        
        -- Recursive case: follow parent relationships
        SELECT cl.child_capsule, cl.parent_capsule, lt.depth + 1
        FROM capsule_lineage cl
        INNER JOIN lineage_tree lt ON cl.child_capsule = lt.parent_capsule
        WHERE lt.depth < 100  -- Prevent infinite recursion
    )
    SELECT MAX(depth) INTO current_depth FROM lineage_tree;
    
    RETURN COALESCE(current_depth, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to get capsule descendants (children and their children)
CREATE OR REPLACE FUNCTION get_capsule_descendants(parent_capsule_id UUID)
RETURNS TABLE(descendant_id UUID, relationship_path TEXT[], depth INTEGER) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE descendants AS (
        -- Base case: direct children
        SELECT 
            cl.child_capsule as descendant_id,
            ARRAY[cl.action] as relationship_path,
            1 as depth
        FROM capsule_lineage cl
        WHERE cl.parent_capsule = parent_capsule_id
        
        UNION ALL
        
        -- Recursive case: children of children
        SELECT 
            cl.child_capsule as descendant_id,
            d.relationship_path || cl.action as relationship_path,
            d.depth + 1 as depth
        FROM capsule_lineage cl
        INNER JOIN descendants d ON cl.parent_capsule = d.descendant_id
        WHERE d.depth < 50  -- Prevent infinite recursion
    )
    SELECT * FROM descendants ORDER BY depth, descendant_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update DAO certification status
CREATE OR REPLACE FUNCTION update_dao_certification_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update capsule DAO certification status when certification is approved
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        UPDATE capsules 
        SET 
            dao_certified = TRUE,
            certification_date = NOW()
        WHERE id = NEW.capsule_id;
        
        NEW.certification_date = NOW();
    ELSIF NEW.status != 'approved' AND OLD.status = 'approved' THEN
        -- Remove DAO certification if status changes from approved
        UPDATE capsules 
        SET 
            dao_certified = FALSE,
            certification_date = NULL
        WHERE id = NEW.capsule_id;
        
        NEW.certification_date = NULL;
    END IF;
    
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for DAO certification status updates
DROP TRIGGER IF EXISTS trigger_dao_certification_update ON dao_certifications;
CREATE TRIGGER trigger_dao_certification_update
    BEFORE UPDATE ON dao_certifications
    FOR EACH ROW
    EXECUTE FUNCTION update_dao_certification_status();

-- Function to calculate grief flow in lineage
CREATE OR REPLACE FUNCTION calculate_grief_flow(parent_id UUID, child_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    parent_grief DECIMAL;
    child_grief DECIMAL;
    flow_rate DECIMAL;
BEGIN
    -- Get grief scores for parent and child capsules
    SELECT CAST(grief_score AS DECIMAL) INTO parent_grief 
    FROM capsules WHERE id = parent_id;
    
    SELECT CAST(grief_score AS DECIMAL) INTO child_grief 
    FROM capsules WHERE id = child_id;
    
    -- Calculate flow rate (simplified algorithm)
    IF parent_grief IS NULL OR child_grief IS NULL THEN
        RETURN 0.0;
    END IF;
    
    flow_rate := (parent_grief * 0.3) + (child_grief * 0.7);
    
    RETURN LEAST(flow_rate, 10.0);  -- Cap at 10.0
END;
$$ LANGUAGE plpgsql;

-- Function to update grief flow when lineage is created
CREATE OR REPLACE FUNCTION update_lineage_grief_flow()
RETURNS TRIGGER AS $$
BEGIN
    NEW.grief_flow := calculate_grief_flow(NEW.parent_capsule, NEW.child_capsule);
    NEW.influence_score := NEW.grief_flow * 0.8;  -- Influence based on grief flow
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for lineage grief flow calculation
DROP TRIGGER IF EXISTS trigger_lineage_grief_flow ON capsule_lineage;
CREATE TRIGGER trigger_lineage_grief_flow
    BEFORE INSERT OR UPDATE ON capsule_lineage
    FOR EACH ROW
    EXECUTE FUNCTION update_lineage_grief_flow();

-- View for complete lineage analytics
CREATE OR REPLACE VIEW lineage_analytics AS
SELECT 
    c.id as capsule_id,
    c.title,
    c.author,
    c.dao_certified,
    c.verification_status,
    COUNT(cl_parent.id) as parent_count,
    COUNT(cl_child.id) as child_count,
    AVG(cl_parent.grief_flow) as avg_incoming_grief,
    AVG(cl_child.grief_flow) as avg_outgoing_grief,
    SUM(cl_parent.influence_score) as total_influence_received,
    SUM(cl_child.influence_score) as total_influence_given,
    calculate_lineage_depth(c.id) as lineage_depth
FROM capsules c
LEFT JOIN capsule_lineage cl_parent ON c.id = cl_parent.child_capsule
LEFT JOIN capsule_lineage cl_child ON c.id = cl_child.parent_capsule
GROUP BY c.id, c.title, c.author, c.dao_certified, c.verification_status;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON capsule_lineage TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON dao_certifications TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON capsule_mint_logs TO postgres;
GRANT SELECT ON lineage_analytics TO postgres;
GRANT EXECUTE ON FUNCTION calculate_lineage_depth(UUID) TO postgres;
GRANT EXECUTE ON FUNCTION get_capsule_descendants(UUID) TO postgres;
GRANT EXECUTE ON FUNCTION calculate_grief_flow(UUID, UUID) TO postgres;