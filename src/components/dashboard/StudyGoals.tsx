import { motion } from "framer-motion";
import { Target, Flame, TrendingUp } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

export function StudyGoals() {
  const dailyGoal = 20;
  const currentProgress = 12;
  const progressPercentage = (currentProgress / dailyGoal) * 100;
  const streak = 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-2xl p-6 border border-border shadow-lg mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">Daily Goal</h3>
            <p className="text-sm text-muted-foreground">Keep up the momentum!</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-orange-500 tabular-nums">{streak} day streak</span>
        </div>
      </div>

      <div className="space-y-4">
        <ProgressBar 
          progress={progressPercentage} 
          label={`${currentProgress} of ${dailyGoal} cards studied today`}
          height="h-4"
        />
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 bg-muted/30 rounded-xl">
            <p className="text-2xl font-bold tabular-nums text-foreground">{currentProgress}</p>
            <p className="text-xs text-muted-foreground mt-1">Today</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-xl">
            <p className="text-2xl font-bold tabular-nums text-foreground">{dailyGoal - currentProgress}</p>
            <p className="text-xs text-muted-foreground mt-1">Remaining</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-xl">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-2xl font-bold tabular-nums text-foreground">{streak}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Days</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
