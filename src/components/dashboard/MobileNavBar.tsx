import { motion } from "framer-motion";
import { Home, BookOpen, Plus, BarChart3, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileNavBarProps {
  onCreateNew: () => void;
}

export function MobileNavBar({ onCreateNew }: MobileNavBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard', onClick: () => navigate('/dashboard') },
    { icon: BookOpen, label: 'Study', path: '/dashboard/study', onClick: () => {} },
    { icon: Plus, label: 'Create', path: null, onClick: onCreateNew },
    { icon: BarChart3, label: 'Stats', path: '/dashboard/analytics', onClick: () => {} },
    { icon: User, label: 'Profile', path: '/dashboard/profile', onClick: () => {} },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="md:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-border z-50 safe-area-bottom"
    >
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map((item, index) => {
          const isActive = item.path && location.pathname === item.path;
          const isCreate = item.label === 'Create';
          
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={item.onClick}
              className={cn(
                "flex flex-col items-center gap-1 transition-all relative",
                isCreate 
                  ? "p-3 bg-gradient-to-br from-primary to-purple-500 rounded-2xl shadow-lg text-white -mt-6"
                  : "text-muted-foreground hover:text-primary px-3 py-2",
                isActive && !isCreate && "text-primary"
              )}
            >
              {isActive && !isCreate && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <item.icon className={cn(
                "transition-all",
                isCreate ? "w-6 h-6" : "w-5 h-5",
                isActive && !isCreate && "scale-110"
              )} />
              
              <span className={cn(
                "text-xs font-medium",
                isCreate && "sr-only"
              )}>
                {item.label}
              </span>
              
              {isCreate && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl opacity-0 blur-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
