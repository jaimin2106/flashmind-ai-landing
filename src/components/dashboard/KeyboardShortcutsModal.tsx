import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  { key: '⌘K / Ctrl+K', action: 'Global Search', description: 'Search across all flashcard sets' },
  { key: 'N', action: 'Create New Set', description: 'Quick create a new flashcard set' },
  { key: 'S', action: 'Quick Study', description: 'Start studying the first available set' },
  { key: '/', action: 'Focus Search', description: 'Jump to the search bar' },
  { key: 'G', action: 'View Goals', description: 'Focus on your daily goals' },
  { key: '?', action: 'Show Shortcuts', description: 'Open this help dialog' },
  { key: 'Esc', action: 'Close Modal', description: 'Close any open dialog or modal' },
];

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Keyboard className="w-6 h-6 text-primary" />
            </div>
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 mt-4">
          {shortcuts.map(({ key, action, description }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors group"
            >
              <div className="flex-1">
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {description}
                </p>
              </div>
              <kbd className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-mono shadow-sm min-w-[100px] text-center">
                {key}
              </kbd>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Pro tip:</strong> Combine these shortcuts for a lightning-fast workflow!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
