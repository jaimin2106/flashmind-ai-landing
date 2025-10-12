import { motion } from "framer-motion";
import { Brain, TrendingUp, Upload, Zap, BookOpen, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description: string;
  gradient: string;
  action: () => void;
}

interface QuickActionsPanelProps {
  onCreateNew: () => void;
}

export function QuickActionsPanel({ onCreateNew }: QuickActionsPanelProps) {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      icon: Brain,
      label: "Quick Study",
      description: "Start a random set",
      gradient: "pastel-gradient-lavender",
      action: () => console.log("Quick study"),
    },
    {
      icon: TrendingUp,
      label: "View Analytics",
      description: "See your progress",
      gradient: "pastel-gradient-mint",
      action: () => console.log("Analytics"),
    },
    {
      icon: Upload,
      label: "Upload PDF",
      description: "Generate flashcards",
      gradient: "pastel-gradient-peach",
      action: onCreateNew,
    },
    {
      icon: Zap,
      label: "Smart Review",
      description: "AI-powered study",
      gradient: "pastel-gradient-sky",
      action: () => console.log("Smart review"),
    },
    {
      icon: BookOpen,
      label: "Study Modes",
      description: "Quiz, match & more",
      gradient: "pastel-gradient-coral",
      action: () => console.log("Study modes"),
    },
    {
      icon: Target,
      label: "Set Goals",
      description: "Track your targets",
      gradient: "pastel-gradient-yellow",
      action: () => console.log("Goals"),
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 tracking-tight">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            onClick={action.action}
            className={`${action.gradient} rounded-xl p-4 border border-white/50 shadow-md hover:shadow-lg transition-all text-left group`}
          >
            <div className="p-2 bg-white/60 rounded-lg inline-block mb-3 group-hover:scale-110 transition-transform">
              <action.icon className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="font-bold text-sm text-foreground mb-1">{action.label}</h3>
            <p className="text-xs text-foreground/70">{action.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
