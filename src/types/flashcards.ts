export interface FlashcardSet {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: string;
  set_id: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface StudyProgress {
  id: string;
  user_id: string;
  flashcard_id: string;
  confidence_level: number;
  last_reviewed: string | null;
  review_count: number;
  created_at: string;
}
