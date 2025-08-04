import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Heart, Shield, Award } from 'lucide-react';

interface AnimatedCapsuleInteractionProps {
  capsuleId: string;
  onInteraction: (type: string, capsuleId: string) => void;
  children: React.ReactNode;
}

export function AnimatedCapsuleInteraction({ 
  capsuleId, 
  onInteraction, 
  children 
}: AnimatedCapsuleInteractionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [interactionType, setInteractionType] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleInteraction = (type: string) => {
    setInteractionType(type);
    onInteraction(type, capsuleId);
    
    // Generate interaction particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }));
    setParticles(newParticles);
    
    setTimeout(() => setParticles([]), 1000);
    setTimeout(() => setInteractionType(null), 2000);
  };

  const microAnimations = {
    hover: {
      scale: 1.02,
      boxShadow: '0 0 30px rgba(0, 255, 225, 0.3)',
      borderColor: '#00ffe1',
      transition: { duration: 0.3 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-6 h-6 text-[#ff00d4]" />;
      case 'verify': return <Shield className="w-6 h-6 text-[#00ffe1]" />;
      case 'boost': return <Zap className="w-6 h-6 text-[#7c3aed]" />;
      case 'award': return <Award className="w-6 h-6 text-[#f59e0b]" />;
      default: return <Sparkles className="w-6 h-6 text-[#00ffe1]" />;
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover="hover"
      whileTap="tap"
      variants={microAnimations}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children}
      
      {/* Hover Glow Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-gradient-to-r from-[#00ffe1]/10 via-[#ff00d4]/10 to-[#7c3aed]/10 rounded-lg pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Interaction Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 1, 
              scale: 0, 
              x: 0, 
              y: 0,
              rotate: 0 
            }}
            animate={{ 
              opacity: 0, 
              scale: 1, 
              x: particle.x, 
              y: particle.y,
              rotate: 360 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 pointer-events-none"
          >
            <div className="w-2 h-2 bg-[#00ffe1] rounded-full shadow-lg shadow-[#00ffe1]/50" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Interaction Feedback */}
      <AnimatePresence>
        {interactionType && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: -10 }}
            exit={{ opacity: 0, scale: 0.5, y: -30 }}
            className="absolute top-4 right-4 z-10 bg-[#161b22] border border-[#30363d] rounded-lg p-2"
          >
            {getInteractionIcon(interactionType)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Action Buttons on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 right-4 flex gap-2 z-10"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleInteraction('like')}
              className="p-2 bg-[#ff00d4]/20 border border-[#ff00d4]/30 rounded-full backdrop-blur-sm"
            >
              <Heart className="w-4 h-4 text-[#ff00d4]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleInteraction('verify')}
              className="p-2 bg-[#00ffe1]/20 border border-[#00ffe1]/30 rounded-full backdrop-blur-sm"
            >
              <Shield className="w-4 h-4 text-[#00ffe1]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleInteraction('boost')}
              className="p-2 bg-[#7c3aed]/20 border border-[#7c3aed]/30 rounded-full backdrop-blur-sm"
            >
              <Zap className="w-4 h-4 text-[#7c3aed]" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}