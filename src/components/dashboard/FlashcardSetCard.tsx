import { motion } from "framer-motion";
import { BookOpen, Calendar, Edit, Trash2, Heart, MoreVertical, Clock } from "lucide-react";
import { FlashcardSet } from "@/types/flashcards";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface FlashcardSetCardProps {
  set: FlashcardSet & { difficulty?: string; color_theme?: string };
  cardCount: number;
  onStudy: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
  
  const gradient = set.color_theme 
    ? `pastel-gradient-${set.color_theme}` 
    : gradients[set.title.length % gradients.length];

  const studiedCount = Math.floor(cardCount * 0.6); // Mock studied count
  const progress = cardCount > 0 ? (studiedCount / cardCount) * 100 : 0;
  const difficulty = set.difficulty || "medium";

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className={`${gradient} rounded-2xl p-6 border-2 border-white/50 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group min-h-[420px] flex flex-col`}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent_50%)]" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/60 rounded-lg">
              <BookOpen className="w-5 h-5 text-foreground" />
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              {difficulty}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className="h-8 w-8 hover:bg-white/60 transition-colors"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-foreground/60"
                }`}
              />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/60">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex-1 mb-4">
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 leading-tight tracking-tight min-h-[3.5rem]">
            {set.title}
          </h3>
          {set.description && (
            <p className="text-sm text-foreground/70 line-clamp-3 leading-relaxed min-h-[4rem]">
              {set.description}
            </p>
          )}
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <ProgressBar progress={progress} showPercentage={true} />
          <div className="flex items-center justify-between mt-3 text-xs text-foreground/60">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{studiedCount} of {cardCount} studied</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>5 min remaining</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3">
            <p className="text-2xl font-bold text-foreground tabular-nums">{cardCount}</p>
            <p className="text-xs text-foreground/60 font-medium">Cards</p>
          </div>
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-foreground/60" />
              <p className="text-xs text-foreground/60 font-medium">Last studied</p>
            </div>
            <p className="text-sm font-semibold text-foreground mt-1">
              {new Date(set.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onStudy}
          className="w-full bg-white/80 hover:bg-white text-foreground font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Start Studying
        </Button>
      </div>
    </motion.div>
  );
}
