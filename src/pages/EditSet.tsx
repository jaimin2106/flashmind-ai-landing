import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, Save, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { flashcardSetSchema } from "@/lib/validations";
import { z } from "zod";
import { Flashcard, FlashcardSet } from "@/types/flashcards";

type FlashcardSetFormData = z.infer<typeof flashcardSetSchema>;

interface FlashcardInput extends Flashcard {
  isNew?: boolean;
}

export default function EditSet() {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<FlashcardInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<FlashcardSetFormData>({
    resolver: zodResolver(flashcardSetSchema),
  });

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

      form.setValue("title", setData.title);
      form.setValue("description", setData.description || "");

      const { data: cardsData, error: cardsError } = await supabase
        .from("flashcards")
        .select("*")
        .eq("set_id", setId)
        .order("created_at");

      if (cardsError) throw cardsError;
      setFlashcards(cardsData || []);
    } catch (error: any) {
      toast.error("Failed to load flashcard set");
      console.error(error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const addFlashcard = () => {
    setFlashcards([
      ...flashcards,
      {
        id: `new-${Date.now()}`,
        set_id: setId!,
        question: "",
        answer: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isNew: true,
      },
    ]);
  };

  const removeFlashcard = (id: string) => {
    setFlashcards(flashcards.filter((card) => card.id !== id));
  };

  const updateFlashcard = (id: string, field: "question" | "answer", value: string) => {
    setFlashcards(
      flashcards.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );
  };

  const handleSave = async (data: FlashcardSetFormData) => {
    if (!user || !setId) return;

    const validFlashcards = flashcards.filter(
      (card) => card.question.trim() && card.answer.trim()
    );

    if (validFlashcards.length === 0) {
      toast.error("Please add at least one flashcard with both question and answer");
      return;
    }

    setSaving(true);
    try {
      // Update flashcard set
      const { error: setError } = await supabase
        .from("flashcard_sets")
        .update({
          title: data.title,
          description: data.description || null,
        })
        .eq("id", setId);

      if (setError) throw setError;

      // Handle flashcard updates
      const existingCards = validFlashcards.filter((card) => !card.isNew);
      const newCards = validFlashcards.filter((card) => card.isNew);
      const deletedCardIds = flashcards
        .filter((card) => !validFlashcards.includes(card) && !card.isNew)
        .map((card) => card.id);

      // Update existing cards
      for (const card of existingCards) {
        const { error } = await supabase
          .from("flashcards")
          .update({
            question: card.question.trim(),
            answer: card.answer.trim(),
          })
          .eq("id", card.id);

        if (error) throw error;
      }

      // Insert new cards
      if (newCards.length > 0) {
        const { error } = await supabase.from("flashcards").insert(
          newCards.map((card) => ({
            set_id: setId,
            question: card.question.trim(),
            answer: card.answer.trim(),
          }))
        );

        if (error) throw error;
      }

      // Delete removed cards
      if (deletedCardIds.length > 0) {
        const { error } = await supabase
          .from("flashcards")
          .delete()
          .in("id", deletedCardIds);

        if (error) throw error;
      }

      toast.success("Flashcard set updated successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Failed to update flashcard set");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav onCreateNew={() => navigate("/dashboard/create")} />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-semibold mb-8">Edit Flashcard Set</h1>

          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Set Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Biology Chapter 3"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add a description for this set..."
                    rows={3}
                    {...form.register("description")}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Flashcards</h2>
                <Button type="button" onClick={addFlashcard} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Card
                </Button>
              </div>

              {flashcards.map((card, index) => (
                <Card key={card.id} className="border border-border bg-card shadow-sm">
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Card {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFlashcard(card.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Textarea
                        placeholder="Enter the question..."
                        value={card.question}
                        onChange={(e) => updateFlashcard(card.id, "question", e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Answer</Label>
                      <Textarea
                        placeholder="Enter the answer..."
                        value={card.answer}
                        onChange={(e) => updateFlashcard(card.id, "answer", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="gap-2">
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
