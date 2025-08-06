import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Share2, 
  Bookmark, 
  MessageCircle, 
  ThumbsUp,
  Star,
  Zap,
  Trophy
} from 'lucide-react';

interface MicroInteractionProps {
  onInteraction?: (type: string, value: any) => void;
}

const FloatingParticle: React.FC<{ x: number; y: number; color: string; icon: React.ReactNode }> = ({ 
  x, y, color, icon 
}) => {
  return (
    <div
      className="absolute pointer-events-none z-50 animate-ping"
      style={{
        left: x,
        top: y,
        color: color,
        animation: 'float-up 1s ease-out forwards'
      }}
    >
      {icon}
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export function MicroInteractions({ onInteraction }: MicroInteractionProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    icon: React.ReactNode;
  }>>([]);
  
  const [interactions, setInteractions] = useState({
    likes: 245,
    shares: 67,
    bookmarks: 89,
    comments: 34
  });

  const [pulseStates, setPulseStates] = useState<Record<string, boolean>>({});

  const createParticle = (event: React.MouseEvent, color: string, icon: React.ReactNode) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      color,
      icon
    };
    
    setParticles(prev => [...prev, newParticle]);
    
    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  };

  const handleInteraction = (type: string, event: React.MouseEvent) => {
    // Create visual feedback
    const colors = {
      like: '#ff00d4',
      share: '#00ffe1',
      bookmark: '#f59e0b',
      comment: '#7c3aed'
    };
    
    const icons = {
      like: <Heart className="h-4 w-4" fill="currentColor" />,
      share: <Share2 className="h-4 w-4" />,
      bookmark: <Bookmark className="h-4 w-4" fill="currentColor" />,
      comment: <MessageCircle className="h-4 w-4" />
    };

    createParticle(event, colors[type as keyof typeof colors], icons[type as keyof typeof icons]);
    
    // Update count with animation
    setInteractions(prev => ({
      ...prev,
      [type + 's']: prev[type + 's' as keyof typeof prev] + 1
    }));

    // Trigger pulse effect
    setPulseStates(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setPulseStates(prev => ({ ...prev, [type]: false }));
    }, 300);

    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    onInteraction?.(type, interactions[type + 's' as keyof typeof interactions] + 1);
  };

  const InteractionButton: React.FC<{
    type: string;
    icon: React.ReactNode;
    count: number;
    color: string;
    onClick: (event: React.MouseEvent) => void;
  }> = ({ type, icon, count, color, onClick }) => (
    <Button
      variant="ghost"
      size="sm"
      className={`relative group transition-all duration-200 hover:scale-110 ${
        pulseStates[type] ? 'animate-pulse' : ''
      }`}
      onClick={onClick}
      data-testid={`interaction-${type}`}
      style={{
        '--interaction-color': color
      } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <div 
          className="transition-colors duration-200 group-hover:scale-125"
          style={{ color: color }}
        >
          {icon}
        </div>
        <span className="text-[#8b949e] group-hover:text-[#f0f6fc] text-sm font-medium">
          {count}
        </span>
      </div>
      
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-20 transition-opacity duration-200"
        style={{ 
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: 'blur(8px)'
        }}
      />
    </Button>
  );

  return (
    <Card className="bg-[#161b22] border-[#30363d] relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#f0f6fc] font-semibold mb-4">Engagement</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-[#f59e0b]" />
            <span className="text-sm text-[#8b949e]">Trending</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <InteractionButton
            type="like"
            icon={<Heart className="h-4 w-4" />}
            count={interactions.likes}
            color="#ff00d4"
            onClick={(e) => handleInteraction('like', e)}
          />
          
          <InteractionButton
            type="share"
            icon={<Share2 className="h-4 w-4" />}
            count={interactions.shares}
            color="#00ffe1"
            onClick={(e) => handleInteraction('share', e)}
          />
          
          <InteractionButton
            type="bookmark"
            icon={<Bookmark className="h-4 w-4" />}
            count={interactions.bookmarks}
            color="#f59e0b"
            onClick={(e) => handleInteraction('bookmark', e)}
          />
          
          <InteractionButton
            type="comment"
            icon={<MessageCircle className="h-4 w-4" />}
            count={interactions.comments}
            color="#7c3aed"
            onClick={(e) => handleInteraction('comment', e)}
          />
        </div>

        {/* Floating particles */}
        {particles.map((particle) => (
          <FloatingParticle
            key={particle.id}
            x={particle.x}
            y={particle.y}
            color={particle.color}
            icon={particle.icon}
          />
        ))}

        {/* Background glow animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ffe1]/20 via-transparent to-[#ff00d4]/20 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}