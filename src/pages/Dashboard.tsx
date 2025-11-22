import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FlashcardSet } from "@/types/flashcards";
import { toast } from "sonner";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardAnalytics } from "@/components/dashboard/DashboardAnalytics";
import { FlashcardSetCard } from "@/components/dashboard/FlashcardSetCard";
import { QuickActionsPanel } from "@/components/dashboard/QuickActionsPanel";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { StudyGoals } from "@/components/dashboard/StudyGoals";
import { AIInsightsBar } from "@/components/dashboard/AIInsightsBar";
import { WeeklyProgressChart } from "@/components/dashboard/WeeklyProgressChart";
import { MobileNavBar } from "@/components/dashboard/MobileNavBar";
import { KeyboardShortcutsModal } from "@/components/dashboard/KeyboardShortcutsModal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "alphabetical" | "progress">("recent");
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [flashcardCounts, setFlashcardCounts] = useState<Record<string, number>>({});
  const [progressData, setProgressData] = useState<Record<string, number>>({});
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    search: () => searchInputRef.current?.focus(),
    create: () => navigate("/dashboard/create"),
    study: () => {
      if (filteredSets.length > 0) {
        navigate(`/dashboard/study/${filteredSets[0].id}`);
      }
    },
    focusSearch: () => searchInputRef.current?.focus(),
    help: () => setShowShortcutsModal(true),
    escape: () => setShowShortcutsModal(false),
  });

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

      // Load card counts and progress for each set
      const counts: Record<string, number> = {};
      const progress: Record<string, number> = {};
      
      for (const set of setsData || []) {
        const { count } = await supabase
          .from("flashcards")
          .select("*", { count: "exact", head: true })
          .eq("set_id", set.id);

        counts[set.id] = count || 0;
        progress[set.id] = Math.random() * 100; // Mock progress for now
      }
      
      setFlashcardCounts(counts);
      setProgressData(progress);
    } catch (error: any) {
      toast.error("Failed to load flashcard sets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (setId: string) => {
    try {
      const { error } = await supabase
        .from("flashcard_sets")
        .delete()
        .eq("id", setId);

      if (error) throw error;

      toast.success("Flashcard set deleted successfully");
      loadFlashcardSets();
    } catch (error: any) {
      toast.error("Failed to delete flashcard set");
      console.error(error);
    }
  };

  const filteredSets = flashcardSets.filter((set) =>
    set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen dashboard-bg pb-24 md:pb-8">
      <DashboardNav onCreateNew={() => navigate("/dashboard/create")} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardAnalytics />
        </motion.div>

        {/* Study Goals and Weekly Chart - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudyGoals />
          <WeeklyProgressChart />
        </div>

        {/* AI Insights */}
        <AIInsightsBar flashcardSets={flashcardSets} />

        {/* Quick Actions */}
        <QuickActionsPanel onCreateNew={() => navigate("/dashboard/create")} />

        {/* Search and Filter */}
        <SearchFilterBar
          ref={searchInputRef}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Flashcard Sets Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredSets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 glass-card rounded-2xl p-12"
          >
            <p className="text-lg text-muted-foreground mb-4">
              {searchQuery
                ? "No flashcard sets found matching your search."
                : "No flashcard sets yet. Create your first one to get started!"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => navigate("/dashboard/create")}
                variant="premium"
                size="lg"
                className="mt-4"
              >
                Create Your First Set
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSets.map((set, index) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <FlashcardSetCard
                  set={set}
                  cardCount={flashcardCounts[set.id] || 0}
                  progress={progressData[set.id] || 0}
                  onEdit={() => navigate(`/dashboard/edit/${set.id}`)}
                  onDelete={() => handleDelete(set.id)}
                  onStudy={() => navigate(`/dashboard/study/${set.id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <MobileNavBar onCreateNew={() => navigate("/dashboard/create")} />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        open={showShortcutsModal}
        onOpenChange={setShowShortcutsModal}
      />
    </div>
  );
}
