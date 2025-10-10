import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { FlashcardSetCard } from "@/components/dashboard/FlashcardSetCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FlashcardSet } from "@/types/flashcards";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadFlashcardSets();
  }, [user]);

  const loadFlashcardSets = async () => {
    try {
      const { data: setsData, error: setsError } = await supabase
        .from("flashcard_sets")
        .select("*")
        .order("updated_at", { ascending: false });

      if (setsError) throw setsError;

      setSets(setsData || []);

      // Load card counts for each set
      const counts: Record<string, number> = {};
      for (const set of setsData || []) {
        const { count, error: countError } = await supabase
          .from("flashcards")
          .select("*", { count: "exact", head: true })
          .eq("set_id", set.id);

        if (!countError) {
          counts[set.id] = count || 0;
        }
      }
      setCardCounts(counts);
    } catch (error: any) {
      toast.error("Failed to load flashcard sets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate("/dashboard/create");
  };

  const handleStudy = (setId: string) => {
    navigate(`/dashboard/study/${setId}`);
  };

  const handleEdit = (setId: string) => {
    navigate(`/dashboard/edit/${setId}`);
  };

  const handleDelete = (setId: string) => {
    setSetToDelete(setId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!setToDelete) return;

    try {
      const { error } = await supabase
        .from("flashcard_sets")
        .delete()
        .eq("id", setToDelete);

      if (error) throw error;

      toast.success("Flashcard set deleted");
      loadFlashcardSets();
    } catch (error: any) {
      toast.error("Failed to delete flashcard set");
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setSetToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav onCreateNew={handleCreateNew} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav onCreateNew={handleCreateNew} />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-12">
            <h1 className="text-3xl font-semibold mb-2 text-foreground">My Flashcard Sets</h1>
            <p className="text-muted-foreground">
              Create, manage, and study your flashcards
            </p>
          </div>

          {sets.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No flashcard sets yet</h2>
                <p className="text-muted-foreground mb-8">
                  Get started by creating your first flashcard set
                </p>
                <Button onClick={handleCreateNew} size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Create Your First Set
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sets.map((set) => (
                <FlashcardSetCard
                  key={set.id}
                  set={set}
                  cardCount={cardCounts[set.id] || 0}
                  onStudy={handleStudy}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flashcard Set</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flashcard set? This action cannot be undone
              and will delete all flashcards in this set.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
