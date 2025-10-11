import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  trend?: string;
  suffix?: string;
  loading?: boolean;
  delay?: number;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  trend,
  suffix = "",
  loading,
  delay = 0,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (loading) return;
    
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    const stepDuration = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, loading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      className={`${gradient} rounded-2xl p-6 border border-white/50 shadow-lg transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/60 rounded-xl">
          <Icon className="w-6 h-6 text-foreground" />
        </div>
        {trend && (
          <span className="text-sm font-medium text-foreground/70">{trend}</span>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground/70">{label}</p>
        <p className="text-3xl font-bold text-foreground tabular-nums">
          {loading ? "..." : displayValue}
          {suffix}
        </p>
      </div>
    </motion.div>
  );
}
