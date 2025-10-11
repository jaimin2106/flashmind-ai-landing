import { motion } from "framer-motion";
import { Edit, Play, Trash2, Star, MoreVertical, BookOpen } from "lucide-react";
import { FlashcardSet } from "@/types/flashcards";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ProgressRing } from "./ProgressRing";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FlashcardSetCardProps {
  set: FlashcardSet & { difficulty?: string; color_theme?: string };
  cardCount: number;
  onStudy: (setId: string) => void;
  onEdit: (setId: string) => void;
  onDelete: (setId: string) => void;
}

export function FlashcardSetCard({ set, cardCount, onStudy, onEdit, onDelete }: FlashcardSetCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const gradients = [
    "pastel-gradient-lavender",
    "pastel-gradient-mint",
    "pastel-gradient-peach",
    "pastel-gradient-coral",
    "pastel-gradient-sky",
    "pastel-gradient-yellow",
  ];
  
  const gradientClass = gradients[set.title.length % gradients.length];
  const progress = cardCount > 0 ? Math.min(Math.floor((cardCount / 20) * 100), 100) : 0;
  
  const difficultyColors = {
    easy: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    hard: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -8, 
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)" 
      }}
      className={`group relative ${gradientClass} rounded-2xl p-6 border border-white/50 shadow-lg transition-all overflow-hidden`}
    >
      {/* Top accent border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/60" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
        backgroundSize: "20px 20px",
      }} />

      <div className="relative flex flex-col h-full">
        {/* Header with actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {set.difficulty && (
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${difficultyColors[set.difficulty as keyof typeof difficultyColors] || difficultyColors.medium} mb-2`}>
                {set.difficulty}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-1.5 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
            >
              <Star className={`w-4 h-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-foreground/70"}`} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                  <MoreVertical className="w-4 h-4 text-foreground/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(set.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(set.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 mb-4">
          <h3 className="text-xl font-bold mb-2 text-foreground line-clamp-2">
            {set.title}
          </h3>
          {set.description && (
            <p className="text-sm text-foreground/70 line-clamp-3 leading-relaxed">
              {set.description}
            </p>
          )}
        </div>

        {/* Progress and Stats */}
        <div className="flex items-center justify-between mb-4 pb-4 border-t border-white/40 pt-4">
          <div className="flex items-center gap-3">
            <ProgressRing progress={progress} size={50} strokeWidth={5} />
            <div>
              <div className="flex items-center gap-1.5 text-foreground font-semibold">
                <BookOpen className="w-4 h-4" />
                <span className="text-lg">{cardCount}</span>
                <span className="text-sm font-normal text-foreground/70">cards</span>
              </div>
              <p className="text-xs text-foreground/60">
                {formatDistanceToNow(new Date(set.updated_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onStudy(set.id)}
          className="w-full bg-white/80 hover:bg-white text-foreground font-semibold shadow-md"
          size="lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Studying
        </Button>
      </div>
    </motion.div>
  );
}
