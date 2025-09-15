-- ===================================
-- SIMPLIFIED INITIAL MIGRATION - CORE TABLES ONLY
-- ===================================

-- Guided Practices system
CREATE TABLE IF NOT EXISTS public.practices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    steps INTEGER NOT NULL DEFAULT 4,
    default_passage TEXT,
    estimated_minutes INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    practice_slug TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_sec INTEGER,
    notes_md TEXT,
    passage_ref TEXT,
    steps_completed INTEGER DEFAULT 0,
    step_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.practice_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_slug TEXT NOT NULL,
    step_index INTEGER NOT NULL,
    prompt_text TEXT NOT NULL,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(practice_slug, step_index, locale)
);

-- Verse Memory with SRS system
CREATE TABLE IF NOT EXISTS public.memory_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.memory_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    deck_id UUID NOT NULL,
    verse_ref TEXT NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, verse_ref, deck_id)
);

CREATE TABLE IF NOT EXISTS public.memory_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL,
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
CREATE TABLE IF NOT EXISTS public.life_rules (
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

CREATE TABLE IF NOT EXISTS public.rule_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    rule_id UUID NOT NULL,
    date_iso DATE NOT NULL,
    time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'midday', 'evening')),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    notes TEXT,
    UNIQUE(user_id, rule_id, date_iso, time_slot)
);

-- Add foreign key constraints
ALTER TABLE practice_sessions ADD CONSTRAINT fk_practice_sessions_practice_slug 
    FOREIGN KEY (practice_slug) REFERENCES practices(slug);
ALTER TABLE memory_cards ADD CONSTRAINT fk_memory_cards_deck_id 
    FOREIGN KEY (deck_id) REFERENCES memory_decks(id) ON DELETE CASCADE;
ALTER TABLE memory_reviews ADD CONSTRAINT fk_memory_reviews_card_id 
    FOREIGN KEY (card_id) REFERENCES memory_cards(id) ON DELETE CASCADE;
ALTER TABLE rule_completions ADD CONSTRAINT fk_rule_completions_rule_id 
    FOREIGN KEY (rule_id) REFERENCES life_rules(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_completions ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Practices are publicly readable" ON practices FOR SELECT USING (true);
CREATE POLICY "Users can manage their own practice sessions" ON practice_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Practice prompts are publicly readable" ON practice_prompts FOR SELECT USING (true);
CREATE POLICY "Users can manage their own memory decks" ON memory_decks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own memory cards" ON memory_cards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their card reviews" ON memory_reviews FOR SELECT USING (
    EXISTS (SELECT 1 FROM memory_cards WHERE id = memory_reviews.card_id AND user_id = auth.uid())
);
CREATE POLICY "System can manage memory reviews" ON memory_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update memory reviews" ON memory_reviews FOR UPDATE USING (true);
CREATE POLICY "Users can manage their own life rules" ON life_rules FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own rule completions" ON rule_completions FOR ALL USING (auth.uid() = user_id);

-- Insert initial practices data
INSERT INTO practices (slug, title, description, steps, estimated_minutes) VALUES
('lectio_divina', 'Lectio Divina', 'Ancient practice of Scripture meditation in 4 steps: Read, Meditate, Pray, Contemplate', 4, 15),
('daily_examen', 'Daily Examen', 'Ignatian practice of reflecting on God''s presence in your day', 1, 10),
('breath_prayer', 'Breath Prayer', 'Simple prayer synchronized with breathing for centering and peace', 1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert practice prompts for Lectio Divina
INSERT INTO practice_prompts (practice_slug, step_index, prompt_text, locale) VALUES
('lectio_divina', 1, 'Read the passage slowly and attentively. What word or phrase draws your attention?', 'en'),
('lectio_divina', 2, 'Meditate on the word or phrase that stood out. What is God saying to you through this?', 'en'),
('lectio_divina', 3, 'Respond to God in prayer. What would you like to say in response to what you''ve heard?', 'en'),
('lectio_divina', 4, 'Rest in God''s presence. Simply be with God, letting go of words and thoughts.', 'en'),
('daily_examen', 1, 'How did you experience God''s presence today? What are you most grateful for?', 'en'),
('breath_prayer', 1, 'Choose a short prayer phrase (like "Jesus, mercy" or "Be still, my soul"). Breathe in on the first part, out on the second.', 'en')
ON CONFLICT (practice_slug, step_index, locale) DO NOTHING;