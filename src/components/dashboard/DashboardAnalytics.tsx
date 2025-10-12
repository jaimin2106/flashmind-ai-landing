import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Flame, Library, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { StatCard } from "./StatCard";

export function DashboardAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSets: 0,
    totalCards: 0,
    cardsStudied: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      // Get total sets
      const { count: setsCount } = await supabase
        .from("flashcard_sets")
        .select("*", { count: "exact", head: true });

      // Get total cards
      const { data: sets } = await supabase
        .from("flashcard_sets")
        .select("id");

      let totalCards = 0;
      if (sets) {
        for (const set of sets) {
          const { count } = await supabase
            .from("flashcards")
            .select("*", { count: "exact", head: true })
            .eq("set_id", set.id);
          totalCards += count || 0;
        }
      }

      // Get cards studied (from study_progress)
      const { count: studiedCount } = await supabase
        .from("study_progress")
        .select("*", { count: "exact", head: true });

      // Get current streak
      const { data: streakData } = await supabase
        .from("study_streaks")
        .select("current_streak")
        .eq("user_id", user.id)
        .maybeSingle();

      setStats({
        totalSets: setsCount || 0,
        totalCards,
        cardsStudied: studiedCount || 0,
        currentStreak: streakData?.current_streak || 0,
      });
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      label: "Flashcard Sets",
      value: stats.totalSets,
      icon: Library,
      gradient: "pastel-gradient-lavender",
      trend: "+12%",
    },
    {
      label: "Total Cards",
      value: stats.totalCards,
      icon: BookOpen,
      gradient: "pastel-gradient-mint",
      trend: "+8%",
    },
    {
      label: "Cards Studied",
      value: stats.cardsStudied,
      icon: TrendingUp,
      gradient: "pastel-gradient-peach",
      trend: "+23%",
    },
    {
      label: "Study Streak",
      value: stats.currentStreak,
      icon: Flame,
      gradient: "pastel-gradient-coral",
      suffix: " days",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <h2 className="text-3xl font-bold mb-6 tracking-tight">Your Progress</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsData.map((stat, index) => (
          <StatCard key={stat.label} {...stat} loading={loading} delay={index * 0.1} />
        ))}
      </div>
    </motion.div>
  );
}
