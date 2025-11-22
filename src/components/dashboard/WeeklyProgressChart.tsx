import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DayData {
  day: string;
  cards: number;
}

export function WeeklyProgressChart() {
  const { user } = useAuth();
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadWeeklyData = async () => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weekData: DayData[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = nextDay.toISOString().split('T')[0];

        const { data: progress } = await supabase
          .from('study_progress')
          .select('review_count')
          .eq('user_id', user.id)
          .gte('last_reviewed', dateStr)
          .lt('last_reviewed', nextDayStr);

        const cardsStudied = progress?.reduce((sum, p) => sum + p.review_count, 0) || 0;
        
        weekData.push({
          day: days[date.getDay()],
          cards: cardsStudied
        });
      }

      setData(weekData);
      setLoading(false);
    };

    loadWeeklyData();
  }, [user]);

  const totalWeeklyCards = data.reduce((sum, day) => sum + day.cards, 0);
  const avgDailyCards = (totalWeeklyCards / 7).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="p-6 glass-card shadow-tier-2 border-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Weekly Progress
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Last 7 days activity
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tabular-nums">{totalWeeklyCards}</p>
              <p className="text-xs text-muted-foreground">
                {avgDailyCards} avg/day
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-[120px] flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={data}>
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '8px 12px'
                  }}
                  labelStyle={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}
                  itemStyle={{
                    color: 'hsl(var(--primary))',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                  formatter={(value) => [`${value} cards studied`, '']}
                />
                <Line
                  type="monotone"
                  dataKey="cards"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ 
                    fill: 'hsl(var(--primary))', 
                    r: 4,
                    strokeWidth: 2,
                    stroke: 'hsl(var(--background))'
                  }}
                  activeDot={{ 
                    r: 6,
                    strokeWidth: 2,
                    stroke: 'hsl(var(--background))'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
