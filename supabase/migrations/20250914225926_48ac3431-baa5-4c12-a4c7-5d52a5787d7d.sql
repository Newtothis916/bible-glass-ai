-- Create comprehensive database schema for Ultimate Bible app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'incomplete', 'trialing');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'family');
CREATE TYPE prayer_status AS ENUM ('active', 'answered', 'archived');
CREATE TYPE group_visibility AS ENUM ('public', 'private', 'invite_only');
CREATE TYPE group_member_role AS ENUM ('owner', 'moderator', 'member');
CREATE TYPE message_type AS ENUM ('text', 'verse', 'prayer', 'media');
CREATE TYPE audio_type AS ENUM ('bible', 'sermon', 'podcast', 'music');

-- Users and profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  locale TEXT DEFAULT 'en',
  denomination_pref TEXT[] DEFAULT '{}',
  kids_mode BOOLEAN DEFAULT false,
  onboarding_done BOOLEAN DEFAULT false,
  notification_preferences JSONB DEFAULT '{}',
  reading_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL, -- stripe, revenuecat, etc
  provider_subscription_id TEXT,
  status subscription_status NOT NULL,
  tier subscription_tier NOT NULL DEFAULT 'free',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bible versions
CREATE TABLE public.bible_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- kjv, web, niv, etc
  name TEXT NOT NULL,
  language TEXT NOT NULL,
  license_type TEXT NOT NULL, -- public_domain, licensed, etc
  source TEXT,
  copyright_notice TEXT,
  enabled BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Books
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID REFERENCES public.bible_versions(id) ON DELETE CASCADE NOT NULL,
  order_num INTEGER NOT NULL,
  code TEXT NOT NULL, -- gen, exo, mat, etc
  name TEXT NOT NULL,
  testament TEXT NOT NULL, -- ot, nt
  chapter_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(version_id, code)
);

-- Chapters
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  number INTEGER NOT NULL,
  verse_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(book_id, number)
);

-- Verses
CREATE TABLE public.verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  number INTEGER NOT NULL,
  text TEXT NOT NULL,
  tokens tsvector,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(chapter_id, number)
);

-- User annotations
CREATE TABLE public.highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  verse_id UUID REFERENCES public.verses(id) ON DELETE CASCADE NOT NULL,
  color TEXT NOT NULL DEFAULT 'yellow',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, verse_id)
);

CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  verse_id UUID REFERENCES public.verses(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, verse_id)
);

CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  verse_id UUID REFERENCES public.verses(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  privacy TEXT DEFAULT 'private', -- private, friends, public
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Reading plans
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  locale TEXT DEFAULT 'en',
  cover_url TEXT,
  author TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.plan_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE NOT NULL,
  day_index INTEGER NOT NULL,
  title TEXT,
  passages TEXT[] NOT NULL, -- array of verse references
  devotion_content TEXT,
  prayer_prompt TEXT,
  estimated_minutes INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(plan_id, day_index)
);

CREATE TABLE public.plan_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_date DATE DEFAULT CURRENT_DATE,
  progress_day INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  reminders_time TIME,
  reminders_enabled BOOLEAN DEFAULT true,
  muted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, plan_id)
);

-- Prayer system
CREATE TABLE public.prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  tags TEXT[] DEFAULT '{}',
  status prayer_status DEFAULT 'active',
  privacy TEXT DEFAULT 'private', -- private, circle, public
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.prayer_circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  visibility group_visibility DEFAULT 'private',
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.prayer_circle_members (
  circle_id UUID REFERENCES public.prayer_circles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role group_member_role DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (circle_id, user_id)
);

-- Groups and community
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  visibility group_visibility DEFAULT 'public',
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_premium_only BOOLEAN DEFAULT false,
  invite_code TEXT UNIQUE,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.group_members (
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role group_member_role DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type message_type DEFAULT 'text',
  body TEXT,
  verse_refs TEXT[] DEFAULT '{}',
  media_url TEXT,
  reply_to UUID REFERENCES public.messages(id),
  edited_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audio content
CREATE TABLE public.audio_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type audio_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source_url TEXT NOT NULL,
  version_id UUID REFERENCES public.bible_versions(id),
  book_code TEXT,
  chapter_number INTEGER,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  language TEXT,
  narrator TEXT,
  premium_only BOOLEAN DEFAULT false,
  downloadable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  audio_items JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Gamification
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.user_badges (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE public.streaks (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  current_days INTEGER DEFAULT 0,
  longest_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_type TEXT DEFAULT 'reading', -- reading, prayer, etc
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI queries and responses
CREATE TABLE public.ai_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  context_refs TEXT[] DEFAULT '{}',
  answer_md TEXT,
  citations JSONB DEFAULT '[]',
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  rating INTEGER, -- 1-5
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Resources and study materials
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- commentary, dictionary, map, etc
  author TEXT,
  license TEXT,
  language TEXT DEFAULT 'en',
  content_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audit logging
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_verses_chapter_number ON public.verses(chapter_id, number);
CREATE INDEX idx_verses_tokens ON public.verses USING gin(tokens);
CREATE INDEX idx_verses_embedding ON public.verses USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_highlights_user_verse ON public.highlights(user_id, verse_id);
CREATE INDEX idx_bookmarks_user_verse ON public.bookmarks(user_id, verse_id);
CREATE INDEX idx_notes_user_verse ON public.notes(user_id, verse_id);
CREATE INDEX idx_messages_group_created ON public.messages(group_id, created_at DESC);
CREATE INDEX idx_prayers_user_created ON public.prayers(user_id, created_at DESC);
CREATE INDEX idx_ai_queries_user_created ON public.ai_queries(user_id, created_at DESC);
CREATE INDEX idx_plan_enrollments_user_plan ON public.plan_enrollments(user_id, plan_id);
CREATE INDEX idx_audio_assets_type_premium ON public.audio_assets(type, premium_only);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_queries ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = _user_id 
  ORDER BY 
    CASE role 
      WHEN 'admin' THEN 1 
      WHEN 'moderator' THEN 2 
      WHEN 'user' THEN 3 
    END 
  LIMIT 1;
$$;

-- Create RLS policies
-- Profiles: users can view all but only edit their own
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- User roles: only admins can manage roles
CREATE POLICY "Anyone can view user roles"
ON public.user_roles FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage user roles"
ON public.user_roles FOR ALL
USING (public.get_user_role(auth.uid()) = 'admin');

-- Subscriptions: users can only see their own
CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
ON public.subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
ON public.subscriptions FOR UPDATE
USING (auth.uid() = user_id);

-- User annotations: private to user
CREATE POLICY "Users can manage their own highlights"
ON public.highlights FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bookmarks"
ON public.bookmarks FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notes"
ON public.notes FOR ALL
USING (auth.uid() = user_id);

-- Plan enrollments: private to user
CREATE POLICY "Users can manage their own plan enrollments"
ON public.plan_enrollments FOR ALL
USING (auth.uid() = user_id);

-- Prayers: respect privacy settings
CREATE POLICY "Users can manage their own prayers"
ON public.prayers FOR ALL
USING (auth.uid() = user_id);

-- Prayer circle members: users can see if they're members
CREATE POLICY "Users can view prayer circles they belong to"
ON public.prayer_circle_members FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can leave prayer circles"
ON public.prayer_circle_members FOR DELETE
USING (auth.uid() = user_id);

-- Group members: users can see groups they belong to
CREATE POLICY "Users can view their group memberships"
ON public.group_members FOR SELECT
USING (auth.uid() = user_id);

-- Messages: users can see messages in groups they belong to
CREATE POLICY "Users can view messages in their groups"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = messages.group_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to their groups"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = messages.group_id AND user_id = auth.uid()
  )
);

-- Playlists: private to user unless public
CREATE POLICY "Users can manage their own playlists"
ON public.playlists FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public playlists"
ON public.playlists FOR SELECT
USING (is_public = true);

-- User badges: users can see their own
CREATE POLICY "Users can view their own badges"
ON public.user_badges FOR SELECT
USING (auth.uid() = user_id);

-- Streaks: users can see their own
CREATE POLICY "Users can manage their own streaks"
ON public.streaks FOR ALL
USING (auth.uid() = user_id);

-- AI queries: private to user
CREATE POLICY "Users can manage their own AI queries"
ON public.ai_queries FOR ALL
USING (auth.uid() = user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plan_enrollments_updated_at
  BEFORE UPDATE ON public.plan_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prayers_updated_at
  BEFORE UPDATE ON public.prayers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prayer_circles_updated_at
  BEFORE UPDATE ON public.prayer_circles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();