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
      whileHover={{ y: -4 }}
      className={`${gradient} rounded-2xl p-6 border-2 border-white/50 shadow-lg hover:shadow-xl transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/70 rounded-xl shadow-sm">
          <Icon className="w-6 h-6 text-foreground" />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-foreground/70 px-2 py-1 bg-white/50 rounded-full">
            {trend}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wide">{label}</p>
        <p className="text-4xl font-bold text-foreground tabular-nums tracking-tight">
          {loading ? "..." : displayValue}
          {suffix && <span className="text-2xl ml-1">{suffix}</span>}
        </p>
      </div>
    </motion.div>
  );
}
