-- Study streaks tracking
CREATE TABLE IF NOT EXISTS public.study_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own streaks"
  ON public.study_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks"
  ON public.study_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON public.study_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- Set categories/tags
CREATE TABLE IF NOT EXISTS public.set_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.set_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON public.set_categories FOR SELECT
  USING (true);

-- Junction table for set-category relationship
CREATE TABLE IF NOT EXISTS public.flashcard_set_categories (
  set_id UUID REFERENCES public.flashcard_sets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.set_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (set_id, category_id)
);

ALTER TABLE public.flashcard_set_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view categories for their sets"
  ON public.flashcard_set_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.flashcard_sets
      WHERE flashcard_sets.id = flashcard_set_categories.set_id
      AND flashcard_sets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add categories to their sets"
  ON public.flashcard_set_categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.flashcard_sets
      WHERE flashcard_sets.id = flashcard_set_categories.set_id
      AND flashcard_sets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove categories from their sets"
  ON public.flashcard_set_categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.flashcard_sets
      WHERE flashcard_sets.id = flashcard_set_categories.set_id
      AND flashcard_sets.user_id = auth.uid()
    )
  );

-- User favorites
CREATE TABLE IF NOT EXISTS public.user_favorites (
  user_id UUID NOT NULL,
  set_id UUID REFERENCES public.flashcard_sets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, set_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON public.user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
  ON public.user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
  ON public.user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Study sessions for analytics
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  set_id UUID REFERENCES public.flashcard_sets(id) ON DELETE CASCADE,
  cards_studied INTEGER NOT NULL,
  duration_seconds INTEGER,
  accuracy_percentage DECIMAL(5,2),
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study sessions"
  ON public.study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study sessions"
  ON public.study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions"
  ON public.study_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Achievements system
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  USING (true);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  user_id UUID NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add favorite and difficulty columns to flashcard_sets
ALTER TABLE public.flashcard_sets 
ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
ADD COLUMN IF NOT EXISTS color_theme TEXT DEFAULT 'lavender';

-- Insert some default categories
INSERT INTO public.set_categories (name, color, icon) VALUES
  ('Mathematics', 'hsl(250, 70%, 85%)', 'Calculator'),
  ('Science', 'hsl(160, 70%, 85%)', 'FlaskConical'),
  ('Languages', 'hsl(20, 90%, 88%)', 'Languages'),
  ('History', 'hsl(10, 80%, 85%)', 'Scroll'),
  ('Computer Science', 'hsl(200, 70%, 88%)', 'Code'),
  ('Other', 'hsl(50, 90%, 88%)', 'FolderOpen')
ON CONFLICT DO NOTHING;

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, requirement_type, requirement_value) VALUES
  ('First Steps', 'Create your first flashcard set', 'Star', 'set_count', 1),
  ('Dedicated Learner', 'Study 100 flashcards', 'BookOpen', 'cards_studied', 100),
  ('Week Warrior', 'Maintain a 7-day study streak', 'Flame', 'streak', 7),
  ('Master Creator', 'Create 10 flashcard sets', 'Trophy', 'set_count', 10),
  ('Consistent Scholar', 'Study for 30 days', 'Award', 'total_study_days', 30)
ON CONFLICT DO NOTHING;