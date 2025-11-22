import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlashcardSet } from "@/types/flashcards";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AIInsightsBarProps {
  flashcardSets: FlashcardSet[];
}

export function AIInsightsBar({ flashcardSets }: AIInsightsBarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [insight, setInsight] = useState<{
    type: 'almost_complete' | 'needs_review' | 'new_set' | null;
    set: FlashcardSet | null;
    message: string;
  }>({ type: null, set: null, message: '' });

  useEffect(() => {
    if (!user || flashcardSets.length === 0) return;

    const analyzeAndSuggest = async () => {
      // Check for almost complete sets (70-99%)
      for (const set of flashcardSets) {
        const { data: flashcards } = await supabase
          .from('flashcards')
          .select('id')
          .eq('set_id', set.id);

        const { data: progress } = await supabase
          .from('study_progress')
          .select('confidence_level')
          .eq('user_id', user.id)
          .in('flashcard_id', flashcards?.map(f => f.id) || []);

        const totalCards = flashcards?.length || 0;
        const masteredCards = progress?.filter(p => p.confidence_level >= 3).length || 0;
        const progressPercentage = totalCards > 0 ? (masteredCards / totalCards) * 100 : 0;

        if (progressPercentage >= 70 && progressPercentage < 100) {
          setInsight({
            type: 'almost_complete',
            set,
            message: `You're ${progressPercentage.toFixed(0)}% done with "${set.title}" — finish it today!`
          });
          return;
        }
      }

      // Check for sets that need review (not studied in 3+ days)
      for (const set of flashcardSets) {
        const daysSinceUpdate = Math.floor(
          (Date.now() - new Date(set.updated_at).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceUpdate >= 3) {
          setInsight({
            type: 'needs_review',
            set,
            message: `It's been ${daysSinceUpdate} days since you studied "${set.title}" — time for a quick review?`
          });
          return;
        }
      }

      // Check for new unstudied sets
      for (const set of flashcardSets) {
        const { data: progress } = await supabase
          .from('study_progress')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (!progress || progress.length === 0) {
          setInsight({
            type: 'new_set',
            set,
            message: `Ready to start learning? "${set.title}" is waiting for you!`
          });
          return;
        }
      }
    };

    analyzeAndSuggest();
  }, [flashcardSets, user]);

  const handleStudyNow = () => {
    if (insight.set) {
      navigate(`/dashboard/study/${insight.set.id}`);
    }
  };

  if (!insight.type || !insight.set) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-blue-500 shadow-tier-2 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <div className="flex items-center gap-4 relative z-10">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl shadow-lg"
            >
              <Sparkles className="w-6 h-6 text-blue-600" />
            </motion.div>
            
            <div className="flex-1">
              <p className="font-semibold text-foreground flex items-center gap-2 mb-1">
                <span className="text-sm uppercase tracking-wide text-blue-600">AI Suggestion</span>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.message}
              </p>
            </div>
            
            <Button 
              size="sm" 
              onClick={handleStudyNow}
              className="shadow-md hover:shadow-lg transition-all group"
            >
              Study Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
