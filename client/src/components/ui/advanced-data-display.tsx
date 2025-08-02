import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: React.ComponentType<any>;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon = Activity,
  variant = "default",
  className
}) => {
  const variants = {
    default: "from-slate-800 to-slate-900 border-slate-700",
    success: "from-green-800/50 to-emerald-900/50 border-green-600/30",
    warning: "from-yellow-800/50 to-orange-900/50 border-yellow-600/30",
    danger: "from-red-800/50 to-rose-900/50 border-red-600/30"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br p-6",
        "backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300",
        variants[variant],
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full blur-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>
          {change && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              change.type === "increase" ? "text-green-400" : "text-red-400"
            )}>
              {change.type === "increase" ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              {Math.abs(change.value)}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "#06b6d4",
  label,
  className
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-2xl font-bold text-white"
          >
            {progress}%
          </motion.div>
          {label && (
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          )}
        </div>
      </div>
    </div>
  );
};

interface DataVisualizationProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title?: string;
  type?: "bar" | "line" | "area";
  className?: string;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  title,
  type = "bar",
  className
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className={cn(
      "p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50",
      "border border-slate-700 backdrop-blur-sm",
      className
    )}>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      )}
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center gap-4">
            <span className="text-sm text-gray-400 w-20 truncate">
              {item.label}
            </span>
            
            <div className="flex-1 relative">
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{
                    background: item.color || `hsl(${index * 60}, 70%, 50%)`
                  }}
                />
              </div>
            </div>
            
            <span className="text-sm font-medium text-white w-12 text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface StatGridProps {
  stats: Array<{
    label: string;
    value: string | number;
    icon?: React.ComponentType<any>;
    color?: string;
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const StatGrid: React.FC<StatGridProps> = ({
  stats,
  columns = 3,
  className
}) => {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4"
  };

  return (
    <div className={cn(
      "grid gap-4",
      gridCols[columns],
      className
    )}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700"
        >
          <div className="flex items-center gap-3">
            {stat.icon && (
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${stat.color || '#06b6d4'}20` }}
              >
                <stat.icon 
                  size={20} 
                  style={{ color: stat.color || '#06b6d4' }}
                />
              </div>
            )}
            <div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};