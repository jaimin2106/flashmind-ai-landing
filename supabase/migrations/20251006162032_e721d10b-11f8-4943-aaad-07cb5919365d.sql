-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create flashcard_sets table
CREATE TABLE public.flashcard_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on flashcard_sets
ALTER TABLE public.flashcard_sets ENABLE ROW LEVEL SECURITY;

-- Flashcard sets policies
CREATE POLICY "Users can view their own flashcard sets"
  ON public.flashcard_sets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create flashcard sets"
  ON public.flashcard_sets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcard sets"
  ON public.flashcard_sets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcard sets"
  ON public.flashcard_sets FOR DELETE
  USING (auth.uid() = user_id);

-- Create flashcards table
CREATE TABLE public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id UUID REFERENCES public.flashcard_sets(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on flashcards
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Flashcards policies - users can only access flashcards from their own sets
CREATE POLICY "Users can view flashcards from their own sets"
  ON public.flashcards FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.flashcard_sets
    WHERE flashcard_sets.id = flashcards.set_id
    AND flashcard_sets.user_id = auth.uid()
  ));

CREATE POLICY "Users can create flashcards in their own sets"
  ON public.flashcards FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.flashcard_sets
    WHERE flashcard_sets.id = flashcards.set_id
    AND flashcard_sets.user_id = auth.uid()
  ));

CREATE POLICY "Users can update flashcards in their own sets"
  ON public.flashcards FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.flashcard_sets
    WHERE flashcard_sets.id = flashcards.set_id
    AND flashcard_sets.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete flashcards from their own sets"
  ON public.flashcards FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.flashcard_sets
    WHERE flashcard_sets.id = flashcards.set_id
    AND flashcard_sets.user_id = auth.uid()
  ));

-- Create study_progress table for tracking user progress
CREATE TABLE public.study_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  flashcard_id UUID REFERENCES public.flashcards(id) ON DELETE CASCADE NOT NULL,
  confidence_level INTEGER DEFAULT 0,
  last_reviewed TIMESTAMPTZ,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, flashcard_id)
);

-- Enable RLS on study_progress
ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;

-- Study progress policies
CREATE POLICY "Users can view their own study progress"
  ON public.study_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study progress"
  ON public.study_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study progress"
  ON public.study_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study progress"
  ON public.study_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flashcard_sets_updated_at
  BEFORE UPDATE ON public.flashcard_sets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flashcards_updated_at
  BEFORE UPDATE ON public.flashcards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();