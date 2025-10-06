import { motion } from "framer-motion";
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  FolderKanban, 
  Moon, 
  Share2,
  LucideIcon 
} from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative p-8 rounded-2xl glass hover:bg-card/50 transition-all duration-300 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gradient-primary blur-3xl" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:glow-primary transition-shadow duration-300">
          <Icon className="w-7 h-7 text-primary-foreground" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground group-hover:text-foreground transition-colors">
          {description}
        </p>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

const BentoGrid = () => {
  const features = [
    {
      icon: Brain,
      title: "Turn Notes into Flashcards",
      description: "Instantly convert your study notes into interactive flashcards with AI-powered analysis.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Learning",
      description: "Smart algorithms adapt to your learning style and optimize retention.",
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Monitor your learning journey with detailed analytics and insights.",
    },
    {
      icon: FolderKanban,
      title: "Organize Flashcard Sets",
      description: "Create custom collections and organize flashcards by topic or subject.",
    },
    {
      icon: Moon,
      title: "Dark Mode Ready",
      description: "Comfortable studying experience in any lighting condition with beautiful dark theme.",
    },
    {
      icon: Share2,
      title: "Share with Friends",
      description: "Collaborate and share your flashcard sets with classmates and study groups.",
    },
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to transform the way you learn and retain information
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
