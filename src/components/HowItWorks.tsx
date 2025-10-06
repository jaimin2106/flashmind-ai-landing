import { motion } from "framer-motion";
import { FileText, Sparkles, BookOpen } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Paste Your Notes",
    description: "Simply copy and paste your study notes, lecture transcripts, or any learning material.",
    color: "primary",
  },
  {
    icon: Sparkles,
    title: "AI Generates Flashcards",
    description: "Our AI analyzes your content and creates optimized flashcards with questions and answers.",
    color: "secondary",
  },
  {
    icon: BookOpen,
    title: "Study & Track Progress",
    description: "Review your flashcards, track your learning progress, and master your subjects faster.",
    color: "accent",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col md:flex-row items-center gap-8 mb-16 last:mb-0"
              >
                {/* Step number and icon */}
                <div className="relative flex-shrink-0">
                  {/* Connecting line (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-primary to-transparent" />
                  )}

                  {/* Icon container */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-24 h-24 rounded-2xl gradient-${step.color} flex items-center justify-center shadow-2xl relative`}
                  >
                    <Icon className="w-12 h-12 text-primary-foreground" />
                    
                    {/* Step number badge */}
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-background border-2 border-primary rounded-full flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
