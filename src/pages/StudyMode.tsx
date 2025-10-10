import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, RotateCcw, Home, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Flashcard, FlashcardSet } from "@/types/flashcards";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function StudyMode() {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [set, setSet] = useState<FlashcardSet | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [setId]);

  const loadData = async () => {
    if (!setId) return;

    try {
      const { data: setData, error: setError } = await supabase
        .from("flashcard_sets")
        .select("*")
        .eq("id", setId)
        .single();

      if (setError) throw setError;
      setSet(setData);

      const { data: cardsData, error: cardsError } = await supabase
        .from("flashcards")
        .select("*")
        .eq("set_id", setId)
        .order("created_at");

      if (cardsError) throw cardsError;
      setFlashcards(cardsData || []);
    } catch (error: any) {
      toast.error("Failed to load flashcards");
      console.error(error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav onCreateNew={() => navigate("/dashboard/create")} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav onCreateNew={() => navigate("/dashboard/create")} />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl mb-4">This set doesn't have any flashcards yet</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav onCreateNew={() => navigate("/dashboard/create")} />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">{set?.title}</h1>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <span>Card {currentIndex + 1} of {flashcards.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id + isFlipped}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <Card className="border border-border bg-card shadow-lg min-h-[400px] flex items-center justify-center p-12">
                  <CardContent className="w-full">
                    <div className="text-center space-y-8">
                      <div className="inline-block px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {isFlipped ? "Answer" : "Question"}
                      </div>
                      <p className="text-2xl font-medium leading-relaxed">
                        {isFlipped ? currentCard.answer : currentCard.question}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click to {isFlipped ? "see question" : "reveal answer"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Restart
            </Button>

            <Button onClick={() => navigate("/dashboard")} variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              Dashboard
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
