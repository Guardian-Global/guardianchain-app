import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Heart, Zap, Trophy, Gift } from "lucide-react";

// Floating Particles Component
export const FloatingParticles: React.FC<{
  count?: number;
  color?: string;
}> = ({ count = 20, color = "rgba(59, 130, 246, 0.3)" }) => {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Ripple Effect Component
export const RippleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  rippleColor?: string;
}> = ({
  children,
  onClick,
  className = "",
  rippleColor = "rgba(255, 255, 255, 0.6)",
}) => {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.clientWidth, button.clientHeight);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={createRipple}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              backgroundColor: rippleColor,
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </button>
  );
};

// Bouncy Icon Component
export const BouncyIcon: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  bounce?: boolean;
}> = ({ icon: Icon, className = "", bounce = true }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`inline-block cursor-pointer ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={
        bounce && isHovered
          ? {
              scale: [1, 1.2, 1],
              rotate: [0, -10, 10, 0],
            }
          : {}
      }
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 10,
      }}
    >
      <Icon className={className} />
    </motion.div>
  );
};

// Progress Bar with Celebration
export const CelebrationProgress: React.FC<{
  value: number;
  max: number;
  label?: string;
  showCelebration?: boolean;
}> = ({ value, max, label = "", showCelebration = true }) => {
  const percentage = (value / max) * 100;
  const [showParty, setShowParty] = useState(false);

  useEffect(() => {
    if (percentage >= 100 && showCelebration) {
      setShowParty(true);
      setTimeout(() => setShowParty(false), 3000);
    }
  }, [percentage, showCelebration]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="text-sm text-blue-400">
          {value}/{max}
        </span>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {percentage >= 100 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showParty && (
          <motion.div
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex space-x-2"
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.5 }}
          >
            {[Trophy, Star, Sparkles].map((Icon, index) => (
              <motion.div
                key={index}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 360, 0],
                }}
                transition={{
                  duration: 1,
                  delay: index * 0.2,
                  repeat: 2,
                }}
              >
                <Icon className="h-6 w-6 text-yellow-400" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Floating Action Tooltip
export const FloatingTooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}> = ({ children, content, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "-top-12 left-1/2 transform -translate-x-1/2",
    bottom: "-bottom-12 left-1/2 transform -translate-x-1/2",
    left: "top-1/2 -left-32 transform -translate-y-1/2",
    right: "top-1/2 -right-32 transform -translate-y-1/2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg border border-slate-600 whitespace-nowrap ${positionClasses[position]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {content}
            <div
              className={`absolute w-2 h-2 bg-slate-800 transform rotate-45 border-r border-b border-slate-600 ${
                position === "top"
                  ? "bottom-0 left-1/2 translate-x-[-50%] translate-y-[50%]"
                  : position === "bottom"
                    ? "top-0 left-1/2 translate-x-[-50%] translate-y-[-50%]"
                    : position === "left"
                      ? "right-0 top-1/2 translate-x-[50%] translate-y-[-50%]"
                      : "left-0 top-1/2 translate-x-[-50%] translate-y-[-50%]"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Like Animation Component
export const LikeAnimation: React.FC<{
  isLiked: boolean;
  onToggle: () => void;
  size?: number;
}> = ({ isLiked, onToggle, size = 24 }) => {
  const [hearts, setHearts] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const handleLike = () => {
    onToggle();

    if (!isLiked) {
      // Create floating hearts
      const newHearts = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 60,
        y: 0,
      }));

      setHearts((prev) => [...prev, ...newHearts]);

      setTimeout(() => {
        setHearts((prev) =>
          prev.filter((heart) => !newHearts.find((h) => h.id === heart.id)),
        );
      }, 2000);
    }
  };

  return (
    <div className="relative">
      <motion.button
        className="relative"
        onClick={handleLike}
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          animate={
            isLiked
              ? {
                  scale: [1, 1.3, 1],
                  rotate: [0, -10, 10, 0],
                }
              : {}
          }
          transition={{ duration: 0.6, type: "spring" }}
        >
          <Heart
            className={`h-${size / 4} w-${size / 4} transition-colors duration-300 ${
              isLiked ? "text-red-500 fill-red-500" : "text-slate-400"
            }`}
            style={{ width: size, height: size }}
          />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute pointer-events-none"
            style={{ left: heart.x, bottom: 0 }}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{
              opacity: 0,
              y: -50,
              scale: 1.2,
              x: heart.x + (Math.random() - 0.5) * 20,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Shake Animation for Errors
export const ShakeOnError: React.FC<{
  children: React.ReactNode;
  trigger: boolean;
  className?: string;
}> = ({ children, trigger, className = "" }) => {
  return (
    <motion.div
      className={className}
      animate={
        trigger
          ? {
              x: [-10, 10, -10, 10, 0],
              transition: { duration: 0.4 },
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
};

// Typing Animation Component
export const TypingAnimation: React.FC<{
  text: string;
  speed?: number;
  className?: string;
}> = ({ text, speed = 50, className = "" }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-blue-400"
        >
          |
        </motion.span>
      )}
    </span>
  );
};

// Success Checkmark Animation
export const SuccessCheckmark: React.FC<{
  isVisible: boolean;
  size?: number;
}> = ({ isVisible, size = 32 }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="inline-flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.div
            className="rounded-full bg-green-500 flex items-center justify-center"
            style={{ width: size, height: size }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          >
            <motion.svg
              className="text-white"
              style={{ width: size * 0.6, height: size * 0.6 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default {
  FloatingParticles,
  RippleButton,
  BouncyIcon,
  CelebrationProgress,
  FloatingTooltip,
  LikeAnimation,
  ShakeOnError,
  TypingAnimation,
  SuccessCheckmark,
};
