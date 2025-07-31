import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { FloatingTooltip, LikeAnimation, BouncyIcon } from './MicroInteractions';

// Tilt Card Component
export const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}> = ({ children, className = '', intensity = 15 }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [intensity, -intensity]);
  const rotateY = useTransform(x, [-100, 100], [-intensity, intensity]);

  return (
    <motion.div
      className={`perspective-1000 ${className}`}
      style={{ x, y, rotateX, rotateY, z: 100 }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.div>
  );
};

// Interactive Capsule Card
export const InteractiveCapsuleCard: React.FC<{
  title: string;
  content: string;
  status: string;
  likes: number;
  author: string;
  category: string;
  onLike?: () => void;
  onShare?: () => void;
  onView?: () => void;
}> = ({ 
  title, 
  content, 
  status, 
  likes, 
  author, 
  category,
  onLike,
  onShare,
  onView 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'disputed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <TiltCard className="w-full max-w-md">
      <motion.div
        className="relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm overflow-hidden">
          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Floating Sparkles */}
          <motion.div
            className="absolute top-2 right-2"
            animate={isHovered ? {
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-yellow-400 opacity-60" />
          </motion.div>

          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <CardTitle className="text-white text-lg leading-tight">
                {title}
              </CardTitle>
              <Badge className={getStatusColor(status)}>
                {status}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span>by {author}</span>
              <span>•</span>
              <span>{category}</span>
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <p className="text-slate-300 text-sm mb-6 line-clamp-3">
              {content}
            </p>

            {/* Interactive Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FloatingTooltip content={`${likeCount} likes`}>
                  <div className="flex items-center space-x-1">
                    <LikeAnimation
                      isLiked={isLiked}
                      onToggle={handleLike}
                      size={20}
                    />
                    <span className="text-slate-400 text-sm">{likeCount}</span>
                  </div>
                </FloatingTooltip>

                <FloatingTooltip content="Share capsule">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onShare}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
                </FloatingTooltip>

                <FloatingTooltip content="Read full content">
                  <BouncyIcon
                    icon={BookOpen}
                    className="h-5 w-5 text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
                  />
                </FloatingTooltip>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onView}
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TiltCard>
  );
};

// Expandable Info Card
export const ExpandableCard: React.FC<{
  title: string;
  preview: string;
  fullContent: string;
  icon?: React.ComponentType<{ className?: string }>;
}> = ({ title, preview, fullContent, icon: Icon }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden"
    >
      <motion.div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ backgroundColor: 'rgba(71, 85, 105, 0.3)' }}
      >
        <div className="flex items-center space-x-3">
          {Icon && (
            <BouncyIcon 
              icon={Icon} 
              className="h-5 w-5 text-blue-400" 
              bounce={false}
            />
          )}
          <div className="flex-1">
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-slate-400 text-sm">{preview}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0 border-t border-slate-700">
          <p className="text-slate-300 text-sm leading-relaxed">
            {fullContent}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Drag and Drop Card
export const DraggableCard: React.FC<{
  children: React.ReactNode;
  onDragEnd?: (info: any) => void;
  dragConstraints?: any;
}> = ({ children, onDragEnd, dragConstraints }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event, info) => {
        setIsDragging(false);
        onDragEnd?.(info);
      }}
      whileDrag={{ 
        scale: 1.05, 
        rotate: 5,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}
      className={`cursor-move ${isDragging ? 'z-50' : 'z-10'}`}
    >
      {children}
    </motion.div>
  );
};

// Flip Card Component
export const FlipCard: React.FC<{
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
}> = ({ frontContent, backContent, className = '' }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={`perspective-1000 h-64 ${className}`}>
      <motion.div
        className="relative h-full w-full cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 h-full w-full backface-hidden">
          <Card className="h-full w-full bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 h-full flex items-center justify-center">
              {frontContent}
            </CardContent>
          </Card>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 h-full w-full backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
          <Card className="h-full w-full bg-slate-700/50 border-slate-600">
            <CardContent className="p-6 h-full flex items-center justify-center">
              {backContent}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

// Components exported individually above