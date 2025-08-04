import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  MessageCircle, 
  X, 
  Shield, 
  Sparkles, 
  Info, 
  HelpCircle,
  Zap,
  Heart,
  Star,
  Coffee,
  Lightbulb
} from 'lucide-react';

interface MascotMessage {
  id: string;
  text: string;
  type: 'greeting' | 'tip' | 'celebration' | 'help' | 'info';
  icon: any;
  color: string;
}

const mascotMessages: MascotMessage[] = [
  {
    id: 'welcome',
    text: "Welcome to GuardianChain! I'm your digital truth guardian. Let's preserve some authentic stories together!",
    type: 'greeting',
    icon: Shield,
    color: 'from-[#00ffe1] to-[#059669]'
  },
  {
    id: 'first-capsule',
    text: "Ready to create your first truth capsule? Click the 'Mint' button to get started with blockchain-verified storytelling!",
    type: 'tip',
    icon: Lightbulb,
    color: 'from-[#f59e0b] to-[#d97706]'
  },
  {
    id: 'verification',
    text: "Pro tip: The more detailed and authentic your capsule content, the higher your truth score will be!",
    type: 'tip',
    icon: Star,
    color: 'from-[#7c3aed] to-[#5b21b6]'
  },
  {
    id: 'community',
    text: "Join the community! Visit the DAO section to participate in governance and earn GTT rewards.",
    type: 'info',
    icon: Sparkles,
    color: 'from-[#ff00d4] to-[#c21cac]'
  },
  {
    id: 'achievement',
    text: "Congratulations! You've unlocked a new achievement. Check your profile to see your progress!",
    type: 'celebration',
    icon: Heart,
    color: 'from-[#ef4444] to-[#dc2626]'
  }
];

const mascotStates = [
  { name: 'idle', emoji: '🛡️', animation: 'bounce' },
  { name: 'talking', emoji: '💬', animation: 'pulse' },
  { name: 'celebrating', emoji: '🎉', animation: 'spin' },
  { name: 'thinking', emoji: '🤔', animation: 'wiggle' },
  { name: 'happy', emoji: '😊', animation: 'heartbeat' }
];

export default function GuardianMascot() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<MascotMessage | null>(null);
  const [mascotState, setMascotState] = useState(mascotStates[0]);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  
  console.log('🛡️ GuardianMascot rendering...', { isAuthenticated, user: user?.firstName });

  // Show welcome message for new users
  useEffect(() => {
    if (isAuthenticated && !hasShownWelcome) {
      setTimeout(() => {
        setCurrentMessage(mascotMessages[0]);
        setMascotState(mascotStates[1]); // talking state
        setHasShownWelcome(true);
      }, 2000);
    }
  }, [isAuthenticated, hasShownWelcome]);

  // Random tips and messages
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      if (!isOpen && Math.random() < 0.3) { // 30% chance every interval
        const randomMessage = mascotMessages[Math.floor(Math.random() * mascotMessages.length)];
        setCurrentMessage(randomMessage);
        setMascotState(mascotStates[1]); // talking state
      }
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, isOpen]);

  // Return to idle state after message
  useEffect(() => {
    if (currentMessage) {
      const timer = setTimeout(() => {
        if (!isOpen) {
          setMascotState(mascotStates[0]); // idle state
        }
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [currentMessage, isOpen]);

  const handleMascotClick = () => {
    setIsOpen(true);
    setMascotState(mascotStates[4]); // happy state
    
    if (!currentMessage) {
      const randomTip = mascotMessages.filter(m => m.type === 'tip')[Math.floor(Math.random() * 2)];
      setCurrentMessage(randomTip);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentMessage(null);
    setMascotState(mascotStates[0]); // idle state
  };

  const IconComponent = currentMessage?.icon || Shield;

  return (
    <>
      {/* Floating Mascot Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      >
        <motion.div
          animate={{
            scale: mascotState.animation === 'heartbeat' ? [1, 1.1, 1] : 1,
            rotate: mascotState.animation === 'spin' ? 360 : 0,
            y: mascotState.animation === 'bounce' ? [0, -10, 0] : 0,
          }}
          transition={{
            duration: mascotState.animation === 'spin' ? 0.6 : 2,
            repeat: mascotState.animation === 'bounce' ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <Button
            onClick={handleMascotClick}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00ffe1] to-[#7c3aed] hover:from-[#00e5cb] hover:to-[#6d28d9] shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            data-testid="mascot-button"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
            <span className="text-2xl relative z-10">{mascotState.emoji}</span>
            
            {/* Activity indicator */}
            {currentMessage && !isOpen && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff00d4] rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <motion.div
                  className="w-full h-full bg-[#ff00d4] rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            )}
          </Button>
        </motion.div>
      </motion.div>

      {/* Message Popup */}
      <AnimatePresence>
        {currentMessage && !isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 max-w-xs"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="bg-[#161b22] border-[#30363d] shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentMessage.color} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#f0f6fc] leading-relaxed">
                      {currentMessage.text}
                    </p>
                    <Badge 
                      variant="outline" 
                      className="mt-2 border-[#30363d] text-[#8b949e] text-xs"
                    >
                      {currentMessage.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMessage(null)}
                    className="p-1 h-6 w-6 text-[#8b949e] hover:text-[#f0f6fc]"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Speech bubble tail */}
            <div className="absolute bottom-0 right-8 transform translate-y-full">
              <div className="w-3 h-3 bg-[#161b22] border-r border-b border-[#30363d] transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-[#161b22] border-[#30363d] shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-[#30363d]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00ffe1] to-[#7c3aed] flex items-center justify-center">
                      <span className="text-xl">🛡️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#f0f6fc]">Guardian Assistant</h3>
                      <p className="text-sm text-[#8b949e]">Your truth verification guide</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-[#8b949e] hover:text-[#f0f6fc]"
                    data-testid="close-mascot"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  {isAuthenticated ? (
                    <>
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-semibold text-[#f0f6fc] mb-2">
                          Hello, {user?.firstName || 'Guardian'}!
                        </h4>
                        <p className="text-[#8b949e]">
                          I'm here to help you navigate GuardianChain and maximize your truth verification journey.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {mascotMessages.filter(m => m.type === 'tip' || m.type === 'info').map((message) => {
                          const MessageIcon = message.icon;
                          return (
                            <motion.div
                              key={message.id}
                              className="p-3 bg-[#21262d] rounded-lg border border-[#30363d] cursor-pointer hover:border-[#00ffe1]/30 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setCurrentMessage(message)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${message.color} flex items-center justify-center flex-shrink-0`}>
                                  <MessageIcon className="w-3 h-3 text-white" />
                                </div>
                                <p className="text-sm text-[#f0f6fc] flex-1">
                                  {message.text}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      
                      <div className="flex gap-2 pt-4 border-t border-[#30363d]">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] hover:border-[#00ffe1]"
                        >
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Help Center
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] hover:border-[#00ffe1]"
                        >
                          <Coffee className="w-4 h-4 mr-2" />
                          Quick Tour
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#00ffe1] to-[#7c3aed] rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-[#f0f6fc] mb-2">
                        Welcome to GuardianChain!
                      </h4>
                      <p className="text-[#8b949e] mb-4">
                        I'm your digital guardian, ready to help you preserve truth and build legacy on the blockchain.
                      </p>
                      <Button
                        className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
                        onClick={() => window.location.href = '/onboarding'}
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}