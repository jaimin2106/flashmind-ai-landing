import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

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
  loading = false,
  delay = 0,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (loading) return;

    let startValue = 0;
    const duration = 1000;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(startValue));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, loading]);

  const delta = trend ? parseFloat(trend.replace('%', '')) : 0;
  const isPositive = delta > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.03, 
        y: -8,
        transition: { type: "spring", stiffness: 300 }
      }}
      className="h-full"
    >
      <Card className="relative overflow-hidden h-full p-6 glass-card shadow-tier-2 border-0 group">
        {/* Gradient background */}
        <div
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
          style={{ background: gradient }}
        />
        
        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-1 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"
          style={{ background: gradient }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="p-3 rounded-xl shadow-sm"
              style={{ background: `${gradient}15` }}
            >
              <Icon className="w-6 h-6" style={{ color: gradient.split(',')[0].split('(')[1] }} />
            </motion.div>
          </div>

          <div className="mt-auto">
            <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {label}
            </p>
            {loading ? (
              <div className="h-10 bg-muted animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-3">
                <motion.p
                  key={displayValue}
                  initial={{ scale: 1.1, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-4xl font-bold tabular-nums"
                >
                  {displayValue}
                  {suffix}
                </motion.p>
                {trend && (
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`flex items-center gap-1 ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-bold">{trend}</span>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
