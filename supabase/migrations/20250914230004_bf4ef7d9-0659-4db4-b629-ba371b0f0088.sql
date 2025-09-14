-- Fix security issues by enabling RLS on remaining public tables and fixing search paths

-- Enable RLS on all remaining public tables
ALTER TABLE public.bible_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public content (bible versions, books, chapters, verses)
CREATE POLICY "Bible content is publicly readable"
ON public.bible_versions FOR SELECT
USING (enabled = true);

CREATE POLICY "Books are publicly readable"
ON public.books FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bible_versions 
    WHERE id = books.version_id AND enabled = true
  )
);

CREATE POLICY "Chapters are publicly readable"
ON public.chapters FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.books b
    JOIN public.bible_versions v ON b.version_id = v.id
    WHERE b.id = chapters.book_id AND v.enabled = true
  )
);

CREATE POLICY "Verses are publicly readable"
ON public.verses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chapters c
    JOIN public.books b ON c.book_id = b.id
    JOIN public.bible_versions v ON b.version_id = v.id
    WHERE c.id = verses.chapter_id AND v.enabled = true
  )
);

-- Plans: public plans readable by all, premium plans only if user has subscription
CREATE POLICY "Public plans are readable by everyone"
ON public.plans FOR SELECT
USING (is_premium = false);

CREATE POLICY "Premium plans readable by premium users"
ON public.plans FOR SELECT
USING (
  is_premium = true AND 
  EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = auth.uid() 
    AND status = 'active' 
    AND tier IN ('premium', 'family')
  )
);

-- Plan days: inherit visibility from their plan
CREATE POLICY "Plan days inherit plan visibility"
ON public.plan_days FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.plans p
    WHERE p.id = plan_days.plan_id
    AND (
      p.is_premium = false 
      OR EXISTS (
        SELECT 1 FROM public.subscriptions s
        WHERE s.user_id = auth.uid() 
        AND s.status = 'active' 
        AND s.tier IN ('premium', 'family')
      )
    )
  )
);

-- Prayer circles: visible based on visibility setting and membership
CREATE POLICY "Public prayer circles are viewable by all"
ON public.prayer_circles FOR SELECT
USING (visibility = 'public');

CREATE POLICY "Private prayer circles viewable by members only"
ON public.prayer_circles FOR SELECT
USING (
  visibility IN ('private', 'invite_only') AND
  EXISTS (
    SELECT 1 FROM public.prayer_circle_members 
    WHERE circle_id = prayer_circles.id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create prayer circles"
ON public.prayer_circles FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Prayer circle owners can update their circles"
ON public.prayer_circles FOR UPDATE
USING (auth.uid() = owner_id);

-- Groups: similar to prayer circles
CREATE POLICY "Public groups are viewable by all"
ON public.groups FOR SELECT
USING (visibility = 'public');

CREATE POLICY "Private groups viewable by members only"
ON public.groups FOR SELECT
USING (
  visibility IN ('private', 'invite_only') AND
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = groups.id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create groups"
ON public.groups FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Group owners can update their groups"
ON public.groups FOR UPDATE
USING (auth.uid() = owner_id);

-- Audio assets: public audio readable by all, premium by subscribers
CREATE POLICY "Public audio assets are readable by everyone"
ON public.audio_assets FOR SELECT
USING (premium_only = false);

CREATE POLICY "Premium audio assets readable by premium users"
ON public.audio_assets FOR SELECT
USING (
  premium_only = true AND 
  EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = auth.uid() 
    AND status = 'active' 
    AND tier IN ('premium', 'family')
  )
);

-- Badges: publicly readable
CREATE POLICY "Badges are publicly readable"
ON public.badges FOR SELECT
USING (true);

-- Resources: public resources readable by all, premium by subscribers
CREATE POLICY "Public resources are readable by everyone"
ON public.resources FOR SELECT
USING (is_premium = false);

CREATE POLICY "Premium resources readable by premium users"
ON public.resources FOR SELECT
USING (
  is_premium = true AND 
  EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = auth.uid() 
    AND status = 'active' 
    AND tier IN ('premium', 'family')
  )
);

-- Audit logs: only admins can view
CREATE POLICY "Only admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- Fix search path for get_user_role function
DROP FUNCTION IF EXISTS public.get_user_role(UUID);
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
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