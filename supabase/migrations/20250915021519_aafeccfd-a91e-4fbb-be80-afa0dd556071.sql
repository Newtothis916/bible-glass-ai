-- Fix the enum issue and continue with database setup
-- First, let's check what group_member_role values exist and fix the policies

-- Update the problematic policy to use correct enum values
DROP POLICY IF EXISTS "Group admins can manage question packs" ON group_question_packs;

-- Re-create with correct enum value
CREATE POLICY "Group moderators can manage question packs" ON group_question_packs FOR ALL USING (
    EXISTS (SELECT 1 FROM group_members WHERE group_id = group_question_packs.group_id AND user_id = auth.uid() AND role = 'moderator')
);

-- Also fix any other policies that might have the same issue
DROP POLICY IF EXISTS "Group admins can manage question packs" ON group_question_packs;
DROP POLICY IF EXISTS "Admins can manage practices" ON practices;
DROP POLICY IF EXISTS "Admins can manage practice prompts" ON practice_prompts;
DROP POLICY IF EXISTS "Admins can manage concept clusters" ON concept_clusters;

-- Recreate admin policies using the user_role function instead
CREATE POLICY "Admins can manage practices" ON practices FOR ALL USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can manage practice prompts" ON practice_prompts FOR ALL USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can manage concept clusters" ON concept_clusters FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Add some sample timeline and location data
INSERT INTO bible_timeline_events (event_name, description, date_range_start, date_range_end, related_passages, event_type) VALUES
('Creation', 'God creates the heavens and the earth', NULL, NULL, ARRAY['Genesis 1:1-2:3'], 'creation'),
('The Fall', 'Adam and Eve disobey God in the Garden of Eden', NULL, NULL, ARRAY['Genesis 3:1-24'], 'creation'),
('The Flood', 'God judges the earth with a worldwide flood, saving Noah and his family', NULL, NULL, ARRAY['Genesis 6:1-9:17'], 'patriarchs'),
('Call of Abraham', 'God calls Abraham to leave his homeland and go to the Promised Land', -2100, -2100, ARRAY['Genesis 12:1-9'], 'patriarchs'),
('The Exodus', 'God delivers Israel from slavery in Egypt', -1446, -1446, ARRAY['Exodus 12:1-51'], 'exodus'),
('Giving of the Law', 'God gives the Ten Commandments and the Law at Mount Sinai', -1446, -1445, ARRAY['Exodus 19:1-20:21'], 'exodus'),
('Conquest of Canaan', 'Joshua leads Israel in conquering the Promised Land', -1406, -1400, ARRAY['Joshua 1:1-24:33'], 'judges'),
('United Kingdom Established', 'Saul becomes the first king of Israel', -1050, -1050, ARRAY['1 Samuel 8:1-10:27'], 'kingdom'),
('David Becomes King', 'David is anointed king over all Israel', -1010, -1010, ARRAY['2 Samuel 5:1-5'], 'kingdom'),
('Temple Built', 'Solomon builds the first temple in Jerusalem', -966, -959, ARRAY['1 Kings 6:1-38'], 'kingdom'),
('Kingdom Divided', 'The kingdom splits into Israel (north) and Judah (south)', -931, -931, ARRAY['1 Kings 12:1-33'], 'kingdom'),
('Fall of Israel', 'Assyria conquers the northern kingdom of Israel', -722, -722, ARRAY['2 Kings 17:1-23'], 'exile'),
('Fall of Judah', 'Babylon conquers Jerusalem and destroys the temple', -586, -586, ARRAY['2 Kings 25:1-21'], 'exile'),
('Return from Exile', 'Cyrus allows the Jews to return and rebuild the temple', -538, -538, ARRAY['Ezra 1:1-11'], 'return'),
('Temple Rebuilt', 'The second temple is completed in Jerusalem', -516, -516, ARRAY['Ezra 6:13-22'], 'return'),
('Birth of Jesus', 'Jesus is born in Bethlehem', -4, -4, ARRAY['Matthew 1:18-2:23', 'Luke 2:1-20'], 'gospels'),
('Jesus'' Ministry Begins', 'Jesus is baptized and begins his public ministry', 30, 30, ARRAY['Matthew 3:13-17', 'Mark 1:9-11'], 'gospels'),
('Crucifixion and Resurrection', 'Jesus is crucified and rises from the dead', 33, 33, ARRAY['Matthew 27:32-28:20', 'Mark 15:21-16:20'], 'gospels'),
('Pentecost', 'The Holy Spirit comes upon the disciples', 33, 33, ARRAY['Acts 2:1-31'], 'acts'),
('Paul''s Conversion', 'Saul is converted on the road to Damascus', 35, 35, ARRAY['Acts 9:1-19'], 'acts'),
('Jerusalem Council', 'The apostles decide Gentiles can become Christians', 50, 50, ARRAY['Acts 15:1-35'], 'acts');

-- Add some biblical locations
INSERT INTO bible_locations (name, alternative_names, latitude, longitude, related_passages, description) VALUES
('Jerusalem', ARRAY['City of David', 'Zion'], 31.7683, 35.2137, ARRAY['2 Samuel 5:6-9', '1 Kings 8:1', 'Matthew 21:1-11'], 'The holy city and capital of ancient Israel'),
('Bethlehem', ARRAY['City of David'], 31.7054, 35.2024, ARRAY['Ruth 1:19', '1 Samuel 16:1', 'Matthew 2:1'], 'Birthplace of King David and Jesus Christ'),
('Nazareth', ARRAY[], 32.7019, 35.2963, ARRAY['Matthew 2:23', 'Luke 4:16'], 'Hometown of Jesus where he grew up'),
('Capernaum', ARRAY[], 32.8798, 35.5754, ARRAY['Matthew 4:13', 'Mark 1:21'], 'Fishing town on the Sea of Galilee, center of Jesus'' ministry'),
('Sea of Galilee', ARRAY['Lake Tiberias', 'Sea of Tiberias'], 32.8253, 35.5897, ARRAY['Matthew 4:18', 'John 6:1'], 'Freshwater lake where Jesus called his first disciples'),
('Jordan River', ARRAY[], 32.0000, 35.5000, ARRAY['Joshua 3:14-17', 'Matthew 3:13'], 'River where Jesus was baptized by John the Baptist'),
('Mount Sinai', ARRAY['Mount Horeb'], 28.5394, 33.9734, ARRAY['Exodus 19:1-25', '1 Kings 19:8'], 'Mountain where God gave Moses the Ten Commandments'),
('Babylon', ARRAY[], 32.5355, 44.4275, ARRAY['2 Kings 25:1-21', 'Daniel 1:1-4'], 'Ancient city where the Jews were exiled'),
('Egypt', ARRAY[], 26.8206, 30.8025, ARRAY['Genesis 37:36', 'Exodus 12:40'], 'Land where the Israelites were enslaved for 400 years'),
('Damascus', ARRAY[], 33.5138, 36.2765, ARRAY['Acts 9:1-19'], 'Ancient city where Paul was converted'),
('Rome', ARRAY[], 41.9028, 12.4964, ARRAY['Acts 28:16', 'Romans 1:7'], 'Capital of the Roman Empire, destination of Paul''s missionary journeys'),
('Antioch', ARRAY[], 36.2021, 36.1604, ARRAY['Acts 11:19-26', 'Acts 13:1'], 'First city where believers were called Christians');

-- Add some sample ambient tracks
INSERT INTO ambient_tracks (title, description, audio_url, script_text, duration_seconds, is_premium, tags) VALUES
('Psalm 23 with Nature', 'The Lord is my shepherd, read gently over sounds of flowing water', '/audio/psalm-23-nature.mp3', 'The Lord is my shepherd; I shall not want...', 300, false, ARRAY['psalm', 'nature', 'peace']),
('John 3:16 Meditation', 'For God so loved the world - a meditative reading', '/audio/john-3-16-meditation.mp3', 'For God so loved the world that he gave his one and only Son...', 240, false, ARRAY['gospel', 'love', 'salvation']),
('Philippians 4:6-7 Peace', 'Do not be anxious about anything - with calming background', '/audio/philippians-4-peace.mp3', 'Do not be anxious about anything, but in every situation...', 180, true, ARRAY['peace', 'anxiety', 'prayer']),
('Isaiah 40:31 Strength', 'Those who hope in the Lord will renew their strength', '/audio/isaiah-40-strength.mp3', 'But those who hope in the Lord will renew their strength...', 200, true, ARRAY['strength', 'hope', 'renewal']);

-- Add some sample concept clusters for thematic search
INSERT INTO concept_clusters (theme, description, verse_refs, related_topics) VALUES
('Hope in Suffering', 'Verses about finding hope and strength during difficult times', 
 ARRAY['Romans 5:3-5', 'James 1:2-4', 'Psalm 46:1-3', 'Isaiah 40:31', '2 Corinthians 4:16-18'], 
 ARRAY['perseverance', 'trials', 'comfort', 'strength']),
('God''s Love', 'Passages revealing the depth and breadth of God''s love for humanity',
 ARRAY['John 3:16', 'Romans 8:38-39', '1 John 4:9-10', 'Ephesians 3:17-19', 'Jeremiah 31:3'],
 ARRAY['salvation', 'grace', 'mercy', 'relationship']),
('Prayer and Communication with God', 'Teachings about prayer and how to communicate with God',
 ARRAY['Matthew 6:9-13', 'Philippians 4:6-7', '1 Thessalonians 5:16-18', 'James 5:16', 'Psalm 145:18'],
 ARRAY['worship', 'petition', 'thanksgiving', 'intercession']),
('Wisdom and Decision Making', 'Biblical wisdom for making decisions and living wisely',
 ARRAY['Proverbs 3:5-6', 'James 1:5', 'Psalm 32:8', 'Proverbs 27:17', 'Ecclesiastes 3:1'],
 ARRAY['guidance', 'counsel', 'understanding', 'discernment']),
('Faith and Trust', 'Verses about having faith and trusting in God',
 ARRAY['Hebrews 11:1', 'Proverbs 3:5-6', 'Mark 11:24', 'Romans 10:17', 'Habakkuk 2:4'],
 ARRAY['belief', 'confidence', 'reliance', 'assurance']);

-- Create default memory deck for each user automatically (this will be handled in the API layer)
-- For now, we'll just ensure the structure is ready