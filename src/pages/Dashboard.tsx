import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FlashcardSet } from "@/types/flashcards";
import { FlashcardSetCard } from "@/components/dashboard/FlashcardSetCard";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
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
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { DashboardAnalytics } from "@/components/dashboard/DashboardAnalytics";
import { QuickActionsPanel } from "@/components/dashboard/QuickActionsPanel";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { StudyGoals } from "@/components/dashboard/StudyGoals";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

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

      setFlashcardSets(setsData || []);

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
      toast({
        title: "Error",
        description: "Failed to load flashcard sets",
        variant: "destructive",
      });
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

      toast({
        title: "Success",
        description: "Flashcard set deleted successfully",
      });
      loadFlashcardSets();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete flashcard set",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setSetToDelete(null);
    }
  };

  const filteredSets = flashcardSets.filter((set) =>
    set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen dashboard-bg">
      <DashboardNav onCreateNew={handleCreateNew} />
      
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold mb-3 tracking-tight text-balance">
              Welcome back, {user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Ready to continue your learning journey?
            </p>
          </motion.div>

          {/* Analytics */}
          <DashboardAnalytics />

          {/* Study Goals */}
          <StudyGoals />

          {/* Quick Actions */}
          <QuickActionsPanel onCreateNew={handleCreateNew} />

          {/* Main Content */}
          <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Your Flashcard Sets</h2>
              <Button
                onClick={handleCreateNew}
                size="lg"
                className="gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Create New Set
              </Button>
            </div>

            {/* Search & Filter */}
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Flashcard Sets Grid */}
            {filteredSets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 px-4"
              >
                <div className="max-w-md mx-auto bg-card rounded-2xl p-8 shadow-lg border border-border">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">
                    {searchQuery ? "No sets found" : "No flashcard sets yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {searchQuery
                      ? "Try adjusting your search or filters"
                      : "Create your first flashcard set to start learning!"}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={handleCreateNew}
                      size="lg"
                      className="gap-2 shadow-md"
                    >
                      <Plus className="w-5 h-5" />
                      Create Your First Set
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSets.map((set) => (
                  <FlashcardSetCard
                    key={set.id}
                    set={set}
                    cardCount={cardCounts[set.id] || 0}
                    onStudy={() => handleStudy(set.id)}
                    onEdit={() => handleEdit(set.id)}
                    onDelete={() => handleDelete(set.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              flashcard set and all its cards.
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
