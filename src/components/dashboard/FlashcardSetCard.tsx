import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Edit, Trash2 } from "lucide-react";
import { FlashcardSet } from "@/types/flashcards";
import { formatDistanceToNow } from "date-fns";

interface FlashcardSetCardProps {
  set: FlashcardSet;
  cardCount: number;
  onStudy: (setId: string) => void;
  onEdit: (setId: string) => void;
  onDelete: (setId: string) => void;
}

export function FlashcardSetCard({ set, cardCount, onStudy, onEdit, onDelete }: FlashcardSetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="h-full flex flex-col border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold line-clamp-1">{set.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">
            {set.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between pt-0">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{cardCount} {cardCount === 1 ? "card" : "cards"}</span>
            </div>
            <div className="text-xs">
              Updated {formatDistanceToNow(new Date(set.updated_at), { addSuffix: true })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => onStudy(set.id)} className="flex-1 gap-2" size="default">
              <BookOpen className="w-4 h-4" />
              Study
            </Button>
            <Button onClick={() => onEdit(set.id)} variant="outline" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
            <Button onClick={() => onDelete(set.id)} variant="outline" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
