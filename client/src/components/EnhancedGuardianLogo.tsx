import React from 'react';
import { motion } from 'framer-motion';

interface GuardianLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { width: 32, height: 32, textSize: 'text-lg' },
  md: { width: 48, height: 48, textSize: 'text-xl' },
  lg: { width: 64, height: 64, textSize: 'text-2xl' },
  xl: { width: 96, height: 96, textSize: 'text-4xl' }
};

export default function EnhancedGuardianLogo({ 
  size = 'md', 
  variant = 'full', 
  animated = true,
  className = ''
}: GuardianLogoProps) {
  const { width, height, textSize } = sizeMap[size];

  const LogoIcon = () => (
    <motion.div
      className="relative"
      animate={animated ? {
        scale: [1, 1.05, 1],
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        className={`drop-shadow-[0_0_15px_rgba(0,255,225,0.4)] ${className}`}
      >
        {/* Outer Quantum Ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="url(#logoGlowGradient)"
          strokeWidth="1.5"
          opacity="0.6"
          animate={animated ? { rotate: 360 } : {}}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Orbit Ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="url(#logoOrbitGradient)"
          strokeWidth="0.8"
          opacity="0.4"
          animate={animated ? { rotate: -360 } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Main Guardian Shield */}
        <motion.path
          d="M50 8 L22 22 L22 52 Q22 78 50 92 Q78 78 78 52 L78 22 Z"
          fill="url(#logoMainGradient)"
          stroke="url(#logoBorderGradient)"
          strokeWidth="2.5"
          animate={animated ? {
            filter: [
              "drop-shadow(0 0 8px #00ffe1)",
              "drop-shadow(0 0 12px #ff00d4)",
              "drop-shadow(0 0 8px #00ffe1)"
            ]
          } : {}}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Neural Network Pattern */}
        <motion.g
          animate={animated ? { opacity: [0.3, 0.8, 0.3] } : {}}
          transition={{ duration: 5, repeat: Infinity }}
        >
          {/* Horizontal Lines */}
          <path d="M28 32 L50 38 L72 32" stroke="#00ffe1" strokeWidth="1.8" fill="none" opacity="0.7" />
          <path d="M25 48 L50 52 L75 48" stroke="#ff00d4" strokeWidth="2" fill="none" opacity="0.8" />
          <path d="M28 64 L50 68 L72 64" stroke="#7c3aed" strokeWidth="1.8" fill="none" opacity="0.7" />
          
          {/* Connection Nodes */}
          <circle cx="35" cy="34" r="2" fill="#00ffe1" opacity="0.8" />
          <circle cx="65" cy="34" r="2" fill="#00ffe1" opacity="0.8" />
          <circle cx="32" cy="50" r="2.5" fill="#ff00d4" opacity="0.9" />
          <circle cx="68" cy="50" r="2.5" fill="#ff00d4" opacity="0.9" />
          <circle cx="35" cy="66" r="2" fill="#7c3aed" opacity="0.8" />
          <circle cx="65" cy="66" r="2" fill="#7c3aed" opacity="0.8" />
        </motion.g>
        
        {/* Central Quantum Core */}
        <motion.g>
          <motion.circle
            cx="50"
            cy="48"
            r="10"
            fill="url(#logoCoreGradient)"
            animate={animated ? {
              scale: [1, 1.15, 1],
              opacity: [0.8, 1, 0.8]
            } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Core Energy Pulse */}
          <motion.circle
            cx="50"
            cy="48"
            r="6"
            fill="#00ffe1"
            opacity="0.6"
            animate={animated ? {
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 0.2, 0.6]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.g>
        
        {/* Data Stream Particles */}
        {animated && [...Array(12)].map((_, i) => (
          <motion.circle
            key={i}
            cx={30 + (i * 4)}
            cy={20 + Math.sin(i * 0.5) * 8}
            r="0.8"
            fill={i % 3 === 0 ? "#00ffe1" : i % 3 === 1 ? "#ff00d4" : "#7c3aed"}
            animate={{
              y: [0, 30, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
        
        {/* Guardian Text Inside Shield */}
        {size !== 'sm' && (
          <text
            x="50"
            y="80"
            textAnchor="middle"
            fontSize="6"
            fill="url(#logoTextGradient)"
            fontFamily="Orbitron, monospace"
            fontWeight="700"
            opacity="0.8"
          >
            GUARD
          </text>
        )}
        
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="logoMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d1117" />
            <stop offset="30%" stopColor="#161b22" />
            <stop offset="70%" stopColor="#21262d" />
            <stop offset="100%" stopColor="#0d1117" />
          </linearGradient>
          
          <linearGradient id="logoBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffe1" />
            <stop offset="33%" stopColor="#ff00d4" />
            <stop offset="66%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#00ffe1" />
          </linearGradient>
          
          <radialGradient id="logoCoreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ffe1" opacity="0.9" />
            <stop offset="50%" stopColor="#059669" opacity="0.7" />
            <stop offset="100%" stopColor="#0d1117" opacity="0.3" />
          </radialGradient>
          
          <linearGradient id="logoGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffe1" opacity="0.4" />
            <stop offset="50%" stopColor="#ff00d4" opacity="0.6" />
            <stop offset="100%" stopColor="#7c3aed" opacity="0.4" />
          </linearGradient>
          
          <linearGradient id="logoOrbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" opacity="0.3" />
            <stop offset="50%" stopColor="#00ffe1" opacity="0.5" />
            <stop offset="100%" stopColor="#ff00d4" opacity="0.3" />
          </linearGradient>
          
          <linearGradient id="logoTextGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffe1" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Power Status Indicator */}
      {animated && (
        <motion.div 
          className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-1 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      )}
    </motion.div>
  );

  const LogoText = () => (
    <motion.div
      className={`font-[Orbitron] font-bold tracking-wider ${textSize} bg-gradient-to-r from-[#00ffe1] via-[#ff00d4] to-[#7c3aed] bg-clip-text text-transparent`}
      animate={animated ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      } : {}}
      transition={{ duration: 5, repeat: Infinity }}
      style={{ backgroundSize: '200% 200%' }}
    >
      GuardianChain
    </motion.div>
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {(variant === 'full' || variant === 'icon') && <LogoIcon />}
      {(variant === 'full' || variant === 'text') && <LogoText />}
    </div>
  );
}

// Export individual components for flexible usage
export { EnhancedGuardianLogo };