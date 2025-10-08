import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Flashcard {
  question: string;
  answer: string;
}

interface GenerateParams {
  text: string;
  count: number;
  difficulty: "basic" | "intermediate" | "advanced";
}

export function useAIGeneration() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateFlashcards = async ({
    text,
    count,
    difficulty,
  }: GenerateParams): Promise<Flashcard[] | null> => {
    setGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: { text, count, difficulty }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) {
        console.error('Generation error:', error);
        
        if (error.message?.includes('Rate limit')) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else {
          toast.error("Failed to generate flashcards. Please try again.");
        }
        return null;
      }

      if (!data?.flashcards || data.flashcards.length === 0) {
        toast.error("No flashcards generated. Please try with different content.");
        return null;
      }

      toast.success(`Generated ${data.flashcards.length} flashcards!`);
      return data.flashcards;

    } catch (err) {
      console.error('Generation error:', err);
      toast.error("An unexpected error occurred. Please try again.");
      return null;
    } finally {
      setGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    generating,
    progress,
    generateFlashcards,
  };
}
