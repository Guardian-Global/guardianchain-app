import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';

interface CapsuleLauncherButtonProps {
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export default function CapsuleLauncherButton({
  onClick,
  variant = 'default',
  size = 'default',
  className = ''
}: CapsuleLauncherButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      className={`bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-primary/80 hover:to-brand-accent/80 ${className}`}
    >
      <Sparkles className="w-4 h-4 mr-2" />
      Create Capsule
    </Button>
  );
}