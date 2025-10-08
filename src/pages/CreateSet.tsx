import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Plus, X, Save, Sparkles, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { flashcardSetSchema, flashcardSchema } from "@/lib/validations";
import { z } from "zod";
import { PDFUpload } from "@/components/dashboard/PDFUpload";
import { GenerationSettings } from "@/components/dashboard/GenerationSettings";
import { useAIGeneration } from "@/hooks/useAIGeneration";

type FlashcardSetFormData = z.infer<typeof flashcardSetSchema>;
type FlashcardFormData = z.infer<typeof flashcardSchema>;

interface FlashcardInput {
  id: string;
  question: string;
  answer: string;
}

export default function CreateSet() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<FlashcardInput[]>([
    { id: "1", question: "", answer: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [pdfText, setPdfText] = useState<string>("");
  const [pdfFilename, setPdfFilename] = useState<string>("");
  const [aiCount, setAiCount] = useState(10);
  const [aiDifficulty, setAiDifficulty] = useState<"basic" | "intermediate" | "advanced">("intermediate");
  const { generating, progress, generateFlashcards } = useAIGeneration();

  const form = useForm<FlashcardSetFormData>({
    resolver: zodResolver(flashcardSetSchema),
  });

  const addFlashcard = () => {
    setFlashcards([...flashcards, { id: Date.now().toString(), question: "", answer: "" }]);
  };

  const removeFlashcard = (id: string) => {
    if (flashcards.length > 1) {
      setFlashcards(flashcards.filter((card) => card.id !== id));
    }
  };

  const updateFlashcard = (id: string, field: "question" | "answer", value: string) => {
    setFlashcards(
      flashcards.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );
  };

  const handlePDFExtracted = (text: string, filename: string) => {
    setPdfText(text);
    setPdfFilename(filename);
  };

  const handleGenerateFromPDF = async () => {
    if (!pdfText) {
      toast.error("Please upload a PDF first");
      return;
    }

    const generated = await generateFlashcards({
      text: pdfText,
      count: aiCount,
      difficulty: aiDifficulty,
    });

    if (generated && generated.length > 0) {
      setFlashcards(
        generated.map((card, index) => ({
          id: (Date.now() + index).toString(),
          question: card.question,
          answer: card.answer,
        }))
      );
      
      // Pre-fill title with PDF filename
      if (pdfFilename && !form.getValues("title")) {
        form.setValue("title", pdfFilename.replace(".pdf", ""));
      }
    }
  };

  const handleSave = async (data: FlashcardSetFormData) => {
    if (!user) return;

    // Validate flashcards
    const validFlashcards = flashcards.filter(
      (card) => card.question.trim() && card.answer.trim()
    );

    if (validFlashcards.length === 0) {
      toast.error("Please add at least one flashcard with both question and answer");
      return;
    }

    setSaving(true);
    try {
      // Create flashcard set
      const { data: setData, error: setError } = await supabase
        .from("flashcard_sets")
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
        })
        .select()
        .single();

      if (setError) throw setError;

      // Create flashcards
      const { error: cardsError } = await supabase.from("flashcards").insert(
        validFlashcards.map((card) => ({
          set_id: setData.id,
          question: card.question.trim(),
          answer: card.answer.trim(),
        }))
      );

      if (cardsError) throw cardsError;

      toast.success("Flashcard set created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Failed to create flashcard set");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <DashboardNav onCreateNew={() => navigate("/dashboard/create")} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8">Create Flashcard Set</h1>

          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Set Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Tabs value={mode} onValueChange={(val: any) => setMode(val)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="manual" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Manual
                </TabsTrigger>
                <TabsTrigger value="ai" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Generate
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Flashcards</h2>
                  <Button type="button" onClick={addFlashcard} variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Card
                  </Button>
                </div>

                {flashcards.map((card, index) => (
                  <Card key={card.id} className="glass">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Card {index + 1}
                        </span>
                        {flashcards.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFlashcard(card.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
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
              </TabsContent>

              <TabsContent value="ai" className="space-y-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI-Powered Generation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <PDFUpload onTextExtracted={handlePDFExtracted} />
                    
                    {pdfText && (
                      <>
                        <GenerationSettings
                          count={aiCount}
                          difficulty={aiDifficulty}
                          onCountChange={setAiCount}
                          onDifficultyChange={setAiDifficulty}
                        />

                        <div className="space-y-2">
                          <Label>Preview</Label>
                          <div className="p-4 bg-muted rounded-lg max-h-32 overflow-y-auto">
                            <p className="text-sm text-muted-foreground">
                              {pdfText.slice(0, 500)}...
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(pdfText.length / 5)} words extracted
                          </p>
                        </div>

                        <Button
                          type="button"
                          onClick={handleGenerateFromPDF}
                          disabled={generating}
                          className="w-full gap-2"
                          size="lg"
                        >
                          {generating ? (
                            <>
                              <Sparkles className="w-4 h-4 animate-pulse" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Generate Flashcards
                            </>
                          )}
                        </Button>

                        {generating && (
                          <div className="space-y-2">
                            <Progress value={progress} className="w-full" />
                            <p className="text-sm text-center text-muted-foreground">
                              AI is analyzing your content...
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {flashcards.length > 0 && flashcards[0].question && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Generated Flashcards (Review & Edit)</h3>
                    {flashcards.map((card, index) => (
                      <Card key={card.id} className="glass">
                        <CardContent className="pt-6 space-y-4">
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
                )}
              </TabsContent>
            </Tabs>

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
                {saving ? "Saving..." : "Save Flashcard Set"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
