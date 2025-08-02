import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EliteCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

interface EliteCardHeaderProps {
  children: React.ReactNode;
  className?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

interface EliteCardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface EliteCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface EliteCardActionsProps {
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  };
  className?: string;
}

export function EliteCard({ 
  children, 
  className = '', 
  hover = true, 
  glow = false,
  gradient = false 
}: EliteCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-xl border backdrop-blur-sm transition-all duration-300",
        glow && "shadow-2xl shadow-yellow-500/20",
        gradient && "bg-gradient-to-br from-white/5 to-white/10",
        !gradient && "bg-black/20",
        "border-white/10",
        className
      )}
      whileHover={hover ? { 
        scale: 1.02, 
        boxShadow: glow ? "0 25px 50px -12px rgba(251, 191, 36, 0.25)" : undefined 
      } : undefined}
      transition={{ duration: 0.2 }}
    >
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl opacity-20 blur-sm" />
      )}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
}

export function EliteCardHeader({ 
  children, 
  className = '', 
  badge, 
  badgeVariant = "secondary" 
}: EliteCardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between mb-4", className)}>
      <div className="flex-1">
        {children}
      </div>
      {badge && (
        <Badge variant={badgeVariant} className="ml-4">
          {badge}
        </Badge>
      )}
    </div>
  );
}

export function EliteCardContent({ children, className = '' }: EliteCardContentProps) {
  return (
    <div className={cn("text-gray-300", className)}>
      {children}
    </div>
  );
}

export function EliteCardFooter({ children, className = '' }: EliteCardFooterProps) {
  return (
    <div className={cn("mt-6 pt-4 border-t border-white/10", className)}>
      {children}
    </div>
  );
}

export function EliteCardActions({ 
  primaryAction, 
  secondaryAction, 
  className = '' 
}: EliteCardActionsProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3 mt-6", className)}>
      {primaryAction && (
        <Button
          onClick={primaryAction.onClick}
          variant={primaryAction.variant || "default"}
          className="flex-1"
        >
          {primaryAction.label}
        </Button>
      )}
      {secondaryAction && (
        <Button
          onClick={secondaryAction.onClick}
          variant={secondaryAction.variant || "outline"}
          className="flex-1"
        >
          {secondaryAction.label}
        </Button>
      )}
    </div>
  );
}

// Specialized Card Variants
export function CapsuleCard({ 
  title, 
  description, 
  truthScore, 
  status, 
  unlockDate,
  onView,
  onUnlock,
  className = '' 
}: {
  title: string;
  description: string;
  truthScore: number;
  status: 'locked' | 'unlockable' | 'unlocked';
  unlockDate?: string;
  onView: () => void;
  onUnlock?: () => void;
  className?: string;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'locked': return 'text-red-400';
      case 'unlockable': return 'text-yellow-400';
      case 'unlocked': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'locked': return { text: 'Locked', variant: 'destructive' as const };
      case 'unlockable': return { text: 'Ready', variant: 'default' as const };
      case 'unlocked': return { text: 'Unlocked', variant: 'secondary' as const };
      default: return { text: 'Unknown', variant: 'outline' as const };
    }
  };

  const statusBadge = getStatusBadge(status);

  return (
    <EliteCard className={className} glow={status === 'unlockable'}>
      <EliteCardHeader badge={statusBadge.text} badgeVariant={statusBadge.variant}>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-400">Truth Score: </span>
          <span className="text-yellow-400 font-semibold">{truthScore}%</span>
        </div>
      </EliteCardHeader>
      
      <EliteCardContent>
        <p className="mb-4">{description}</p>
        {unlockDate && (
          <p className={`text-sm ${getStatusColor(status)}`}>
            {status === 'locked' ? `Unlocks: ${unlockDate}` : `Unlocked: ${unlockDate}`}
          </p>
        )}
      </EliteCardContent>

      <EliteCardActions
        primaryAction={{
          label: 'View Details',
          onClick: onView,
          variant: 'outline'
        }}
        secondaryAction={status === 'unlockable' && onUnlock ? {
          label: 'Unlock Now',
          onClick: onUnlock,
          variant: 'default'
        } : undefined}
      />
    </EliteCard>
  );
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  trend,
  className = '' 
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: { value: number; label: string };
  className?: string;
}) {
  return (
    <EliteCard className={className} gradient>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtitle && (
            <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.value >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              <span>{trend.value >= 0 ? '+' : ''}{trend.value}%</span>
              <span className="text-gray-400 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        {Icon && (
          <Icon className="h-8 w-8 text-yellow-400" />
        )}
      </div>
    </EliteCard>
  );
}