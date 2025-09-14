-- Fix groups table to allow system-created groups without owners
ALTER TABLE public.groups ALTER COLUMN owner_id DROP NOT NULL;

-- Update RLS policies for groups to handle null owners (system groups)
DROP POLICY IF EXISTS "Users can create groups" ON public.groups;
DROP POLICY IF EXISTS "Group owners can update their groups" ON public.groups;

CREATE POLICY "Users can create groups"
ON public.groups FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Group owners can update their groups"
ON public.groups FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "System groups are publicly readable"
ON public.groups FOR SELECT
USING (owner_id IS NULL AND visibility = 'public');

-- Now insert the sample data
-- Insert sample Bible versions
INSERT INTO public.bible_versions (code, name, language, license_type, source, copyright_notice, enabled, is_premium, sort_order) VALUES
('web', 'World English Bible', 'en', 'public_domain', 'World English Bible', 'Public Domain', true, false, 1),
('kjv', 'King James Version', 'en', 'public_domain', 'King James Bible', 'Public Domain (Crown Copyright)', true, false, 2)
ON CONFLICT (code) DO NOTHING;

-- Insert sample books for WEB version
WITH web_version AS (SELECT id FROM public.bible_versions WHERE code = 'web' LIMIT 1)
INSERT INTO public.books (version_id, order_num, code, name, testament, chapter_count) 
SELECT 
  web_version.id,
  book_order,
  book_code,
  book_name,
  testament,
  chapters
FROM web_version,
(VALUES 
  (1, 'gen', 'Genesis', 'ot', 50),
  (2, 'exo', 'Exodus', 'ot', 40),
  (3, 'lev', 'Leviticus', 'ot', 27),
  (19, 'psa', 'Psalms', 'ot', 150),
  (20, 'pro', 'Proverbs', 'ot', 31),
  (40, 'mat', 'Matthew', 'nt', 28),
  (41, 'mar', 'Mark', 'nt', 16),
  (42, 'luk', 'Luke', 'nt', 24),
  (43, 'joh', 'John', 'nt', 21),
  (44, 'act', 'Acts', 'nt', 28),
  (45, 'rom', 'Romans', 'nt', 16),
  (46, '1co', '1 Corinthians', 'nt', 16),
  (47, '2co', '2 Corinthians', 'nt', 13),
  (48, 'gal', 'Galatians', 'nt', 6),
  (49, 'eph', 'Ephesians', 'nt', 6),
  (50, 'phi', 'Philippians', 'nt', 4)
) AS books_data(book_order, book_code, book_name, testament, chapters)
WHERE NOT EXISTS (SELECT 1 FROM public.books WHERE version_id = web_version.id);

-- Insert John chapter 3 for demonstration
WITH john_book AS (SELECT id FROM public.books WHERE code = 'joh' LIMIT 1)
INSERT INTO public.chapters (book_id, number, verse_count)
SELECT john_book.id, 3, 36 FROM john_book
WHERE NOT EXISTS (SELECT 1 FROM public.chapters c JOIN public.books b ON c.book_id = b.id WHERE b.code = 'joh' AND c.number = 3);

-- Insert some sample verses from John 3
WITH john_3_chapter AS (
  SELECT c.id FROM public.chapters c 
  JOIN public.books b ON c.book_id = b.id 
  WHERE b.code = 'joh' AND c.number = 3 
  LIMIT 1
)
INSERT INTO public.verses (chapter_id, number, text)
SELECT 
  john_3_chapter.id,
  verse_num,
  verse_text
FROM john_3_chapter,
(VALUES 
  (1, 'Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews.'),
  (2, 'The same came to him by night, and said to him, "Rabbi, we know that you are a teacher come from God, for no one can do these signs that you do, unless God is with him."'),
  (3, 'Jesus answered him, "Most certainly, I tell you, unless one is born anew, he can''t see God''s Kingdom."'),
  (16, 'For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.'),
  (17, 'For God didn''t send his Son into the world to judge the world, but that the world should be saved through him.')
) AS verses_data(verse_num, verse_text)
WHERE NOT EXISTS (SELECT 1 FROM public.verses v JOIN public.chapters c ON v.chapter_id = c.id JOIN public.books b ON c.book_id = b.id WHERE b.code = 'joh' AND c.number = 3);

-- Insert sample reading plans
INSERT INTO public.plans (title, description, duration_days, is_premium, locale, author, tags) VALUES
('7-Day Foundations', 'Essential Bible passages for new believers covering salvation, faith, love, and hope.', 7, false, 'en', 'Ultimate Bible Team', ARRAY['beginner', 'salvation', 'faith']),
('30-Day Gospel Journey', 'Walk through the life and teachings of Jesus Christ in 30 days.', 30, false, 'en', 'Ultimate Bible Team', ARRAY['jesus', 'gospel', 'discipleship']),
('Psalms of Comfort', 'Find peace and comfort in God''s promises through the Psalms.', 14, true, 'en', 'Dr. Sarah Johnson', ARRAY['comfort', 'psalms', 'peace']),
('Wisdom for Life', 'Practical wisdom from Proverbs for daily living and decision making.', 31, true, 'en', 'Pastor Michael Chen', ARRAY['wisdom', 'proverbs', 'practical'])
ON CONFLICT DO NOTHING;

-- Insert sample badges
INSERT INTO public.badges (slug, title, description, points) VALUES
('first_read', 'First Steps', 'Read your first Bible chapter', 10),
('seven_day_streak', 'Faithful Reader', 'Read Scripture for 7 consecutive days', 50),
('prayer_warrior', 'Prayer Warrior', 'Log 25 prayers in your journal', 75),
('community_helper', 'Community Helper', 'Help others in groups by posting encouragement', 30),
('plan_completer', 'Plan Finisher', 'Complete your first reading plan', 100)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample groups (now with nullable owner_id)
INSERT INTO public.groups (name, description, visibility, owner_id) VALUES
('Welcome Community', 'A friendly place for new believers to ask questions and find encouragement.', 'public', null),
('Prayer Circle', 'Join us in praying for each other and our world.', 'public', null),
('Bible Study Fellowship', 'Deep dive into Scripture together with guided discussions.', 'invite_only', null)
ON CONFLICT DO NOTHING;