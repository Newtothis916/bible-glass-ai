-- Seed database with initial Bible content and sample data

-- Insert sample Bible versions
INSERT INTO public.bible_versions (code, name, language, license_type, source, copyright_notice, enabled, is_premium, sort_order) VALUES
('web', 'World English Bible', 'en', 'public_domain', 'World English Bible', 'Public Domain', true, false, 1),
('kjv', 'King James Version', 'en', 'public_domain', 'King James Bible', 'Public Domain (Crown Copyright)', true, false, 2);

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
) AS books_data(book_order, book_code, book_name, testament, chapters);

-- Insert John chapter 3 for demonstration
WITH john_book AS (SELECT id FROM public.books WHERE code = 'joh' LIMIT 1)
INSERT INTO public.chapters (book_id, number, verse_count)
SELECT john_book.id, 3, 36 FROM john_book;

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
) AS verses_data(verse_num, verse_text);

-- Insert sample reading plans
INSERT INTO public.plans (title, description, duration_days, is_premium, locale, author, tags) VALUES
('7-Day Foundations', 'Essential Bible passages for new believers covering salvation, faith, love, and hope.', 7, false, 'en', 'Ultimate Bible Team', ARRAY['beginner', 'salvation', 'faith']),
('30-Day Gospel Journey', 'Walk through the life and teachings of Jesus Christ in 30 days.', 30, false, 'en', 'Ultimate Bible Team', ARRAY['jesus', 'gospel', 'discipleship']),
('Psalms of Comfort', 'Find peace and comfort in God''s promises through the Psalms.', 14, true, 'en', 'Dr. Sarah Johnson', ARRAY['comfort', 'psalms', 'peace']),
('Wisdom for Life', 'Practical wisdom from Proverbs for daily living and decision making.', 31, true, 'en', 'Pastor Michael Chen', ARRAY['wisdom', 'proverbs', 'practical']);

-- Insert sample plan days for the 7-Day Foundations plan
WITH foundations_plan AS (SELECT id FROM public.plans WHERE title = '7-Day Foundations' LIMIT 1)
INSERT INTO public.plan_days (plan_id, day_index, title, passages, devotion_content, prayer_prompt, estimated_minutes)
SELECT 
  foundations_plan.id,
  day_num,
  day_title,
  passages_array,
  devotion_text,
  prayer_text,
  minutes
FROM foundations_plan,
(VALUES 
  (1, 'Day 1: God''s Love', ARRAY['John 3:16', 'Romans 5:8'], 'God''s love is the foundation of our faith. In John 3:16, we see the incredible extent of God''s love - He gave His only Son for us. This isn''t just a nice sentiment; it''s the cornerstone of Christianity. Romans 5:8 tells us that while we were still sinners, Christ died for us. This means God''s love isn''t dependent on our goodness or performance.', 'Thank God for His incredible love demonstrated through Jesus Christ. Ask Him to help you understand and experience this love more deeply.', 10),
  (2, 'Day 2: Salvation by Grace', ARRAY['Ephesians 2:8-9', 'Romans 10:9'], 'Salvation cannot be earned through good works or religious activities. Ephesians 2:8-9 makes it clear that we are saved by grace through faith, not by works. This is God''s gift to us. Romans 10:9 shows us how simple yet profound salvation is - confess with your mouth and believe in your heart.', 'Praise God for the gift of salvation. If you haven''t already, consider making Jesus your Lord and Savior today.', 8),
  (3, 'Day 3: New Life in Christ', ARRAY['2 Corinthians 5:17', '1 John 3:1'], 'When we accept Christ, we become new creations. The old has passed away, and the new has come. This transformation is real and immediate. 1 John 3:1 reminds us of our new identity - we are children of God! This changes everything about how we see ourselves and our purpose.', 'Thank God for making you His child and giving you new life. Ask Him to help you live out your new identity in Christ.', 12)
) AS plan_data(day_num, day_title, passages_array, devotion_text, prayer_text, minutes);

-- Insert sample badges
INSERT INTO public.badges (slug, title, description, points) VALUES
('first_read', 'First Steps', 'Read your first Bible chapter', 10),
('seven_day_streak', 'Faithful Reader', 'Read Scripture for 7 consecutive days', 50),
('prayer_warrior', 'Prayer Warrior', 'Log 25 prayers in your journal', 75),
('community_helper', 'Community Helper', 'Help others in groups by posting encouragement', 30),
('plan_completer', 'Plan Finisher', 'Complete your first reading plan', 100);

-- Insert sample groups
INSERT INTO public.groups (name, description, visibility, owner_id) VALUES
('Welcome Community', 'A friendly place for new believers to ask questions and find encouragement.', 'public', null),
('Prayer Circle', 'Join us in praying for each other and our world.', 'public', null),
('Bible Study Fellowship', 'Deep dive into Scripture together with guided discussions.', 'invite_only', null);

-- Insert sample resources
INSERT INTO public.resources (title, type, author, license, language, is_premium, tags) VALUES
('Basic Bible Dictionary', 'dictionary', 'Bible Study Team', 'Creative Commons', 'en', false, ARRAY['reference', 'dictionary']),
('Harmony of the Gospels', 'reference', 'Dr. Matthew Harrison', 'Fair Use', 'en', true, ARRAY['gospels', 'reference', 'harmony']),
('Bible Timeline', 'timeline', 'Historical Research Team', 'Public Domain', 'en', false, ARRAY['history', 'timeline']),
('Advanced Commentary: Romans', 'commentary', 'Dr. Paul Thompson', 'Licensed', 'en', true, ARRAY['commentary', 'romans', 'theology']);

-- Insert sample audio assets
INSERT INTO public.audio_assets (type, title, description, source_url, version_id, book_code, language, narrator, premium_only) VALUES
('bible', 'John Chapter 3 - WEB', 'World English Bible reading of John Chapter 3', 'https://example.com/audio/web/john/3.mp3', (SELECT id FROM public.bible_versions WHERE code = 'web'), 'joh', 'en', 'David Matthews', false),
('sermon', 'Understanding God''s Love', 'A powerful message about experiencing God''s unconditional love', 'https://example.com/sermons/gods-love.mp3', null, null, 'en', 'Pastor Sarah Johnson', false),
('podcast', 'Daily Devotions - Episode 1', 'Short daily encouragement for your spiritual journey', 'https://example.com/podcasts/daily-1.mp3', null, null, 'en', 'Ministry Team', false);