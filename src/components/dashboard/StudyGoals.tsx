import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Flame, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ConfettiExplosion from "react-confetti-explosion";

export function StudyGoals() {
  const { user } = useAuth();
  const [dailyGoal] = useState(20);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [yesterdayProgress, setYesterdayProgress] = useState(10);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadProgress = async () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Load today's progress
      const { data: todayData } = await supabase
        .from('study_progress')
        .select('review_count')
        .eq('user_id', user.id)
        .gte('last_reviewed', today);

      const todayCount = todayData?.reduce((sum, item) => sum + item.review_count, 0) || 0;
      setCurrentProgress(todayCount);

      // Load yesterday's progress
      const { data: yesterdayData } = await supabase
        .from('study_progress')
        .select('review_count')
        .eq('user_id', user.id)
        .gte('last_reviewed', yesterday)
        .lt('last_reviewed', today);

      const yesterdayCount = yesterdayData?.reduce((sum, item) => sum + item.review_count, 0) || 0;
      setYesterdayProgress(yesterdayCount || 10);

      // Load streak
      const { data: streakData } = await supabase
        .from('study_streaks')
        .select('current_streak')
        .eq('user_id', user.id)
        .single();

      setStreak(streakData?.current_streak || 0);
    };

    loadProgress();
  }, [user]);

  const progressPercentage = Math.min((currentProgress / dailyGoal) * 100, 100);
  const improvement = yesterdayProgress > 0 
    ? ((currentProgress - yesterdayProgress) / yesterdayProgress * 100).toFixed(0)
    : 0;

  // Trigger confetti at 100%
  useEffect(() => {
    if (progressPercentage >= 100 && !hasShownConfetti) {
      setShowConfetti(true);
      setHasShownConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [progressPercentage, hasShownConfetti]);

  const isNearCompletion = progressPercentage >= 90 && progressPercentage < 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 glass-card shadow-tier-2 border-0 relative overflow-hidden">
        {showConfetti && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <ConfettiExplosion
              force={0.8}
              duration={3000}
              particleCount={200}
              width={1600}
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Daily Goal
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Study {dailyGoal} cards today
              </p>
            </div>
            <motion.div
              animate={streak >= 7 ? { 
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative flex items-center gap-2 bg-gradient-to-br from-orange-500/10 to-red-500/10 px-4 py-2 rounded-full"
            >
              {streak >= 7 && (
                <motion.div
                  className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-40"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
              <Flame className={`w-5 h-5 text-orange-500 relative z-10 ${
                streak >= 7 ? 'animate-glow-pulse' : ''
              }`} />
              <div className="relative z-10">
                <p className="text-2xl font-bold tabular-nums">{streak}</p>
                <p className="text-xs text-muted-foreground">day streak</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="space-y-3"
            animate={isNearCompletion ? { scale: [1, 1.01, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="flex items-end justify-between">
              <div>
                <motion.p
                  key={currentProgress}
                  initial={{ scale: 1.2, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-3xl font-bold tabular-nums"
                >
                  {currentProgress}
                </motion.p>
                <p className="text-sm text-muted-foreground">
                  of {dailyGoal} cards
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-right"
              >
                <p className="text-2xl font-bold text-primary tabular-nums">
                  {progressPercentage.toFixed(0)}%
                </p>
                {improvement !== 0 && currentProgress > 0 && (
                  <p className={`text-xs font-medium flex items-center gap-1 justify-end ${
                    Number(improvement) > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-3 h-3" />
                    {improvement}% vs yesterday
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="origin-left"
            >
              <Progress 
                value={progressPercentage} 
                className="h-3 bg-secondary shadow-inner"
              />
            </motion.div>

            {progressPercentage >= 100 && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm font-semibold text-green-600 text-center"
              >
                🎉 Goal completed! Amazing work!
              </motion.p>
            )}

            {isNearCompletion && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium text-amber-600 text-center"
              >
                ⚡ You're almost there! Just a few more cards!
              </motion.p>
            )}
          </motion.div>

          {streak >= 3 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-4 border-t border-border/50"
            >
              <p className="text-xs text-muted-foreground text-center">
                {streak >= 7 
                  ? `🔥 Amazing! ${30 - streak} more days to unlock the 30-day badge!`
                  : `Keep going! ${7 - streak} more days to unlock the 7-day badge!`
                }
              </p>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
