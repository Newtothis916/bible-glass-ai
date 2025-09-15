-- ===================================
-- PHASE 1: CORE FOUNDATION TABLES
-- ===================================

-- Guided Practices system
CREATE TABLE public.practices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    steps INTEGER NOT NULL DEFAULT 4,
    default_passage TEXT,
    estimated_minutes INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    practice_slug TEXT NOT NULL REFERENCES practices(slug),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_sec INTEGER,
    notes_md TEXT,
    passage_ref TEXT,
    steps_completed INTEGER DEFAULT 0,
    step_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.practice_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_slug TEXT NOT NULL REFERENCES practices(slug),
    step_index INTEGER NOT NULL,
    prompt_text TEXT NOT NULL,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(practice_slug, step_index, locale)
);

-- Verse Memory with SRS system
CREATE TABLE public.memory_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.memory_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    deck_id UUID NOT NULL REFERENCES memory_decks(id) ON DELETE CASCADE,
    verse_ref TEXT NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, verse_ref, deck_id)
);

CREATE TABLE public.memory_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES memory_cards(id) ON DELETE CASCADE,
    due_at TIMESTAMP WITH TIME ZONE NOT NULL,
    interval_days INTEGER DEFAULT 1,
    ease_factor REAL DEFAULT 2.5,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    last_grade TEXT CHECK (last_grade IN ('again', 'hard', 'good', 'easy')),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Rule of Life system
CREATE TABLE public.life_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    morning_practices JSONB DEFAULT '[]',
    midday_practices JSONB DEFAULT '[]',
    evening_practices JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.rule_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    rule_id UUID NOT NULL REFERENCES life_rules(id) ON DELETE CASCADE,
    date_iso DATE NOT NULL,
    time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'midday', 'evening')),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    notes TEXT,
    UNIQUE(user_id, rule_id, date_iso, time_slot)
);

-- ===================================
-- PHASE 2: COMMUNITY FEATURES
-- ===================================

-- Accountability Partners system
CREATE TABLE public.accountability_pairs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inviter_id UUID NOT NULL,
    invitee_id UUID NOT NULL,
    plan_id UUID,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'blocked', 'ended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(inviter_id, invitee_id, plan_id)
);

CREATE TABLE public.accountability_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pair_id UUID NOT NULL REFERENCES accountability_pairs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    week_start_iso DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('up', 'down', 'mixed')),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(pair_id, user_id, week_start_iso)
);

CREATE TABLE public.accountability_nudges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pair_id UUID NOT NULL REFERENCES accountability_pairs(id) ON DELETE CASCADE,
    nudger_id UUID NOT NULL,
    nudged_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Groups system (add micro-group support)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS group_type TEXT DEFAULT 'standard' CHECK (group_type IN ('standard', 'micro'));
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS max_members INTEGER;

CREATE TABLE public.group_question_packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    week_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    questions JSONB NOT NULL DEFAULT '[]',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(group_id, week_index)
);

CREATE TABLE public.micro_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    week_start_iso DATE NOT NULL,
    responses JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(group_id, user_id, week_start_iso)
);

-- Prayer Chain system
CREATE TABLE public.prayer_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    slot_minutes INTEGER NOT NULL DEFAULT 30 CHECK (slot_minutes IN (15, 30, 60)),
    start_iso TIMESTAMP WITH TIME ZONE NOT NULL,
    end_iso TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.prayer_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chain_id UUID NOT NULL REFERENCES prayer_chains(id) ON DELETE CASCADE,
    start_iso TIMESTAMP WITH TIME ZONE NOT NULL,
    end_iso TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id UUID,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'completed')),
    claimed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    UNIQUE(chain_id, start_iso)
);

-- ===================================
-- PHASE 3: ADVANCED STUDY FEATURES
-- ===================================

-- Timeline & Atlas system
CREATE TABLE public.bible_timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    description TEXT,
    date_range_start INTEGER, -- Year BCE/CE (negative for BCE)
    date_range_end INTEGER,
    related_passages TEXT[] DEFAULT '{}',
    event_type TEXT CHECK (event_type IN ('creation', 'patriarchs', 'exodus', 'judges', 'kingdom', 'exile', 'return', 'intertestamental', 'gospels', 'acts', 'epistles')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.bible_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    alternative_names TEXT[] DEFAULT '{}',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    related_passages TEXT[] DEFAULT '{}',
    description TEXT,
    map_layer TEXT DEFAULT 'ancient',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Commentary system for inter-tradition notes
CREATE TABLE public.commentary_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tradition TEXT NOT NULL CHECK (tradition IN ('catholic', 'protestant', 'orthodox', 'anglican', 'reformed')),
    version_id UUID,
    book_code TEXT NOT NULL,
    chapter_num INTEGER NOT NULL,
    verse_start INTEGER,
    verse_end INTEGER,
    commentary_text TEXT NOT NULL,
    source_title TEXT,
    source_author TEXT,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator Studio system
CREATE TYPE creator_status AS ENUM ('pending', 'approved', 'suspended', 'rejected');

CREATE TABLE public.creator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    bio TEXT,
    credentials TEXT,
    website_url TEXT,
    social_links JSONB DEFAULT '{}',
    status creator_status DEFAULT 'pending',
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TYPE content_type AS ENUM ('devotion', 'plan', 'study_guide', 'prayer');
CREATE TYPE content_status AS ENUM ('draft', 'submitted', 'in_review', 'approved', 'published', 'rejected');

CREATE TABLE public.content_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    content_type content_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content_md TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    status content_status DEFAULT 'draft',
    review_notes TEXT,
    scheduled_publish_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===================================
-- PHASE 4: FAMILY & SPECIALIZED FEATURES
-- ===================================

-- Family Groups system
CREATE TABLE public.family_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL,
    family_name TEXT NOT NULL,
    child_ids UUID[] DEFAULT '{}',
    shared_plan_ids UUID[] DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Kids Progress system
CREATE TABLE public.kids_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    activity_type TEXT NOT NULL,
    points_earned INTEGER DEFAULT 0,
    badges_earned TEXT[] DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    metadata JSONB DEFAULT '{}'
);

-- Ambient Audio system
CREATE TABLE public.ambient_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL,
    script_text TEXT,
    duration_seconds INTEGER NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.audio_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    track_id UUID NOT NULL REFERENCES ambient_tracks(id),
    duration_listened INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===================================
-- PHASE 5: PLATFORM FEATURES
-- ===================================

-- Organization Accounts system
CREATE TYPE org_tier AS ENUM ('church_free', 'church_pro', 'ministry', 'enterprise');

CREATE TABLE public.organization_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name TEXT NOT NULL,
    admin_user_id UUID NOT NULL,
    member_count INTEGER DEFAULT 0,
    tier org_tier DEFAULT 'church_free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.org_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organization_accounts(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    metric_value INTEGER NOT NULL,
    date_iso DATE NOT NULL,
    is_aggregate BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(org_id, metric_type, date_iso)
);

-- Content Moderation system
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'flagged', 'escalated');

CREATE TABLE public.content_moderation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL,
    content_type TEXT NOT NULL,
    status moderation_status DEFAULT 'pending',
    reviewer_id UUID,
    ai_confidence REAL,
    ai_tags TEXT[] DEFAULT '{}',
    review_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.user_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL,
    reported_content_id UUID NOT NULL,
    reported_user_id UUID,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    moderator_id UUID,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- ===================================
-- CONCEPT MAP & SEARCH ENHANCEMENT
-- ===================================

CREATE TABLE public.concept_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme TEXT NOT NULL,
    description TEXT,
    verse_refs TEXT[] NOT NULL,
    related_topics TEXT[] DEFAULT '{}',
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.search_concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    results JSONB NOT NULL,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===================================
-- TRIGGERS AND FUNCTIONS
-- ===================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_practice_sessions_updated_at BEFORE UPDATE ON practice_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_memory_decks_updated_at BEFORE UPDATE ON memory_decks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_memory_reviews_updated_at BEFORE UPDATE ON memory_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_life_rules_updated_at BEFORE UPDATE ON life_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayer_chains_updated_at BEFORE UPDATE ON prayer_chains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_submissions_updated_at BEFORE UPDATE ON content_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_family_groups_updated_at BEFORE UPDATE ON family_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organization_accounts_updated_at BEFORE UPDATE ON organization_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_concept_clusters_updated_at BEFORE UPDATE ON concept_clusters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- ROW LEVEL SECURITY POLICIES
-- ===================================

-- Enable RLS on all tables
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_question_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE commentary_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambient_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_concepts ENABLE ROW LEVEL SECURITY;

-- Practices - publicly readable, admin manageable
CREATE POLICY "Practices are publicly readable" ON practices FOR SELECT USING (true);
CREATE POLICY "Admins can manage practices" ON practices FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Practice sessions - users manage their own
CREATE POLICY "Users can manage their own practice sessions" ON practice_sessions FOR ALL USING (auth.uid() = user_id);

-- Practice prompts - publicly readable, admin manageable
CREATE POLICY "Practice prompts are publicly readable" ON practice_prompts FOR SELECT USING (true);
CREATE POLICY "Admins can manage practice prompts" ON practice_prompts FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Memory system - users manage their own
CREATE POLICY "Users can manage their own memory decks" ON memory_decks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own memory cards" ON memory_cards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their card reviews" ON memory_reviews FOR SELECT USING (
    EXISTS (SELECT 1 FROM memory_cards WHERE id = memory_reviews.card_id AND user_id = auth.uid())
);
CREATE POLICY "System can manage memory reviews" ON memory_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update memory reviews" ON memory_reviews FOR UPDATE USING (true);

-- Life rules - users manage their own
CREATE POLICY "Users can manage their own life rules" ON life_rules FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own rule completions" ON rule_completions FOR ALL USING (auth.uid() = user_id);

-- Accountability - users can see pairs they're part of
CREATE POLICY "Users can view their accountability pairs" ON accountability_pairs FOR SELECT USING (
    auth.uid() = inviter_id OR auth.uid() = invitee_id
);
CREATE POLICY "Users can create accountability pairs" ON accountability_pairs FOR INSERT WITH CHECK (auth.uid() = inviter_id);
CREATE POLICY "Users can respond to accountability invites" ON accountability_pairs FOR UPDATE USING (auth.uid() = invitee_id);

CREATE POLICY "Users can view their accountability checkins" ON accountability_checkins FOR SELECT USING (
    EXISTS (SELECT 1 FROM accountability_pairs WHERE id = accountability_checkins.pair_id AND (inviter_id = auth.uid() OR invitee_id = auth.uid()))
);
CREATE POLICY "Users can create their own checkins" ON accountability_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view nudges in their pairs" ON accountability_nudges FOR SELECT USING (
    EXISTS (SELECT 1 FROM accountability_pairs WHERE id = accountability_nudges.pair_id AND (inviter_id = auth.uid() OR invitee_id = auth.uid()))
);
CREATE POLICY "Users can send nudges in their pairs" ON accountability_nudges FOR INSERT WITH CHECK (auth.uid() = nudger_id);

-- Group features - inherit from groups table policies
CREATE POLICY "Group members can view question packs" ON group_question_packs FOR SELECT USING (
    EXISTS (SELECT 1 FROM group_members WHERE group_id = group_question_packs.group_id AND user_id = auth.uid())
);
CREATE POLICY "Group admins can manage question packs" ON group_question_packs FOR ALL USING (
    EXISTS (SELECT 1 FROM group_members WHERE group_id = group_question_packs.group_id AND user_id = auth.uid() AND role IN ('admin', 'moderator'))
);

CREATE POLICY "Group members can manage their own checkins" ON micro_checkins FOR ALL USING (
    auth.uid() = user_id AND EXISTS (SELECT 1 FROM group_members WHERE group_id = micro_checkins.group_id AND user_id = auth.uid())
);

-- Prayer chains
CREATE POLICY "Public prayer chains are viewable by all" ON prayer_chains FOR SELECT USING (is_public = true);
CREATE POLICY "Group prayer chains viewable by members" ON prayer_chains FOR SELECT USING (
    is_public = false AND EXISTS (SELECT 1 FROM group_members WHERE group_id = prayer_chains.group_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create prayer chains" ON prayer_chains FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Chain creators can update their chains" ON prayer_chains FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can view prayer slots for accessible chains" ON prayer_slots FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM prayer_chains 
        WHERE id = prayer_slots.chain_id 
        AND (is_public = true OR EXISTS (SELECT 1 FROM group_members WHERE group_id = prayer_chains.group_id AND user_id = auth.uid()))
    )
);
CREATE POLICY "Users can claim and manage prayer slots" ON prayer_slots FOR ALL USING (
    auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM prayer_chains 
        WHERE id = prayer_slots.chain_id 
        AND (is_public = true OR EXISTS (SELECT 1 FROM group_members WHERE group_id = prayer_chains.group_id AND user_id = auth.uid()))
    )
);

-- Study features - public or premium gated
CREATE POLICY "Timeline events are publicly readable" ON bible_timeline_events FOR SELECT USING (true);
CREATE POLICY "Bible locations are publicly readable" ON bible_locations FOR SELECT USING (true);

CREATE POLICY "Free commentary is publicly readable" ON commentary_sets FOR SELECT USING (is_premium = false);
CREATE POLICY "Premium commentary readable by subscribers" ON commentary_sets FOR SELECT USING (
    is_premium = true AND EXISTS (
        SELECT 1 FROM subscriptions 
        WHERE user_id = auth.uid() AND status = 'active' AND tier IN ('premium', 'family')
    )
);

-- Creator system
CREATE POLICY "Users can view creator profiles" ON creator_profiles FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create their own creator profile" ON creator_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own creator profile" ON creator_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Creators can manage their own content" ON content_submissions FOR ALL USING (
    EXISTS (SELECT 1 FROM creator_profiles WHERE id = content_submissions.creator_id AND user_id = auth.uid())
);
CREATE POLICY "Published content is publicly readable" ON content_submissions FOR SELECT USING (status = 'published');

-- Family features
CREATE POLICY "Parents can manage their family groups" ON family_groups FOR ALL USING (auth.uid() = parent_id);
CREATE POLICY "Family members can view their family group" ON family_groups FOR SELECT USING (
    auth.uid() = parent_id OR auth.uid() = ANY(child_ids)
);

CREATE POLICY "Users can view their own kids progress" ON kids_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Parents can view their children's progress" ON kids_progress FOR SELECT USING (
    EXISTS (SELECT 1 FROM family_groups WHERE parent_id = auth.uid() AND user_id = ANY(child_ids))
);
CREATE POLICY "System can manage kids progress" ON kids_progress FOR INSERT WITH CHECK (true);

-- Audio features
CREATE POLICY "Free ambient tracks are publicly readable" ON ambient_tracks FOR SELECT USING (is_premium = false);
CREATE POLICY "Premium ambient tracks readable by subscribers" ON ambient_tracks FOR SELECT USING (
    is_premium = true AND EXISTS (
        SELECT 1 FROM subscriptions 
        WHERE user_id = auth.uid() AND status = 'active' AND tier IN ('premium', 'family')
    )
);

CREATE POLICY "Users can manage their own audio sessions" ON audio_sessions FOR ALL USING (auth.uid() = user_id);

-- Organization features
CREATE POLICY "Org admins can manage their organization" ON organization_accounts FOR ALL USING (auth.uid() = admin_user_id);
CREATE POLICY "Org members can view their organization" ON organization_accounts FOR SELECT USING (
    auth.uid() = admin_user_id OR EXISTS (
        SELECT 1 FROM group_members gm 
        JOIN groups g ON g.id = gm.group_id 
        WHERE g.owner_id = admin_user_id AND gm.user_id = auth.uid()
    )
);

CREATE POLICY "Org admins can view their analytics" ON org_analytics FOR SELECT USING (
    EXISTS (SELECT 1 FROM organization_accounts WHERE id = org_analytics.org_id AND admin_user_id = auth.uid())
);

-- Moderation features
CREATE POLICY "Moderators can view content moderation" ON content_moderation FOR SELECT USING (
    get_user_role(auth.uid()) IN ('admin', 'moderator')
);
CREATE POLICY "System can manage content moderation" ON content_moderation FOR ALL USING (true);

CREATE POLICY "Users can create reports" ON user_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view their own reports" ON user_reports FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Moderators can manage all reports" ON user_reports FOR ALL USING (
    get_user_role(auth.uid()) IN ('admin', 'moderator')
);

-- Search features
CREATE POLICY "Concept clusters are publicly readable" ON concept_clusters FOR SELECT USING (true);
CREATE POLICY "Admins can manage concept clusters" ON concept_clusters FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can view their own search concepts" ON search_concepts FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can create search concepts" ON search_concepts FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ===================================
-- INITIAL DATA
-- ===================================

-- Insert default practices
INSERT INTO practices (slug, title, description, steps, estimated_minutes) VALUES
('lectio_divina', 'Lectio Divina', 'Ancient practice of Scripture meditation in 4 steps: Read, Meditate, Pray, Contemplate', 4, 15),
('daily_examen', 'Daily Examen', 'Ignatian practice of reflecting on God''s presence in your day', 1, 10),
('breath_prayer', 'Breath Prayer', 'Simple prayer synchronized with breathing for centering and peace', 1, 5);

-- Insert practice prompts for Lectio Divina
INSERT INTO practice_prompts (practice_slug, step_index, prompt_text, locale) VALUES
('lectio_divina', 1, 'Read the passage slowly and attentively. What word or phrase draws your attention?', 'en'),
('lectio_divina', 2, 'Meditate on the word or phrase that stood out. What is God saying to you through this?', 'en'),
('lectio_divina', 3, 'Respond to God in prayer. What would you like to say in response to what you''ve heard?', 'en'),
('lectio_divina', 4, 'Rest in God''s presence. Simply be with God, letting go of words and thoughts.', 'en');

-- Insert practice prompts for Daily Examen
INSERT INTO practice_prompts (practice_slug, step_index, prompt_text, locale) VALUES
('daily_examen', 1, 'How did you experience God''s presence today? What are you most grateful for?', 'en');

-- Insert practice prompts for Breath Prayer
INSERT INTO practice_prompts (practice_slug, step_index, prompt_text, locale) VALUES
('breath_prayer', 1, 'Choose a short prayer phrase (like "Jesus, mercy" or "Be still, my soul"). Breathe in on the first part, out on the second.', 'en');