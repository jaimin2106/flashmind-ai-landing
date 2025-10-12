import { motion } from "framer-motion";
import { TrendingUp, Target } from "lucide-react";

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  height?: string;
}

export function ProgressBar({ 
  progress, 
  label = "Progress", 
  showPercentage = true,
  height = "h-3"
}: ProgressBarProps) {
  const getProgressColor = () => {
    if (progress >= 67) return "bg-green-500";
    if (progress >= 34) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getProgressIcon = () => {
    if (progress >= 67) return <TrendingUp className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          {getProgressIcon()}
          <span className="font-medium">{label}</span>
        </div>
        {showPercentage && (
          <span className="font-bold tabular-nums text-foreground">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className={`w-full ${height} bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm`}>
        <motion.div
          className={`${height} ${getProgressColor()} rounded-full transition-colors duration-300`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
