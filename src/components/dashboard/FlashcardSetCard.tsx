import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Edit, Trash2, Play } from "lucide-react";
import { FlashcardSet } from "@/types/flashcards";
import { ProgressBar } from "./ProgressBar";

interface FlashcardSetCardProps {
  set: FlashcardSet;
  cardCount: number;
  progress: number;
  onEdit: () => void;
  onDelete: () => void;
  onStudy: () => void;
}

export function FlashcardSetCard({
  set,
  cardCount,
  progress,
  onEdit,
  onDelete,
  onStudy,
}: FlashcardSetCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const progressPercentage = Math.round(progress);
  
  // Determine border color based on progress
  const getBorderColor = () => {
    if (progressPercentage >= 80) return 'border-t-green-500';
    if (progressPercentage >= 50) return 'border-t-yellow-500';
    return 'border-t-orange-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -12, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 300 }
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full relative group"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity"
        animate={isHovered ? { opacity: 0.2 } : { opacity: 0 }}
      />
      
      <Card className={`relative h-full min-h-[420px] flex flex-col p-6 glass-card shadow-tier-2 border-t-4 ${getBorderColor()} border-0 overflow-hidden`}>
        {/* Top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
        
        {/* Icon and Title */}
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 shadow-sm"
          >
            <BookOpen className="w-5 h-5 text-purple-600" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1 line-clamp-2 leading-tight">
              {set.title}
            </h3>
            {set.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed h-[60px]">
                {set.description}
              </p>
            )}
          </div>
        </div>

        {/* Spacer to push content to bottom */}
        <div className="flex-1" />

        {/* Progress Section */}
        <div className="mt-auto space-y-4">
          <ProgressBar 
            progress={progressPercentage}
            label="Progress"
            showPercentage={true}
          />

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium">{cardCount} cards</span>
            <span className="text-xs">
              Updated {new Date(set.updated_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onStudy}
              className="flex-1 shadow-md hover:shadow-lg transition-all"
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              Study
            </Button>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 hover:border-primary transition-all"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={onDelete}
              variant="outline"
              size="sm"
              className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
