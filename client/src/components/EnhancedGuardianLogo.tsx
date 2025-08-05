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
        
        {/* Advanced Neural Network Pattern */}
        <motion.g
          animate={animated ? { opacity: [0.4, 0.9, 0.4] } : {}}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {/* Primary Network Lines */}
          <path d="M28 30 L50 36 L72 30" stroke="url(#logoNetworkGradient1)" strokeWidth="2.2" fill="none" opacity="0.8" />
          <path d="M25 46 L50 50 L75 46" stroke="url(#logoNetworkGradient2)" strokeWidth="2.5" fill="none" opacity="0.9" />
          <path d="M28 62 L50 66 L72 62" stroke="url(#logoNetworkGradient3)" strokeWidth="2.2" fill="none" opacity="0.8" />
          
          {/* Secondary Connection Web */}
          <path d="M35 32 L35 48 L35 64" stroke="#00ffe1" strokeWidth="1.2" fill="none" opacity="0.6" />
          <path d="M65 32 L65 48 L65 64" stroke="#7c3aed" strokeWidth="1.2" fill="none" opacity="0.6" />
          
          {/* Enhanced Connection Nodes */}
          <motion.circle cx="35" cy="32" r="2.5" fill="#00ffe1" opacity="0.9"
            animate={animated ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 0 }}
          />
          <motion.circle cx="65" cy="32" r="2.5" fill="#00ffe1" opacity="0.9"
            animate={animated ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <motion.circle cx="32" cy="48" r="3" fill="#ff00d4" opacity="1"
            animate={animated ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
          />
          <motion.circle cx="68" cy="48" r="3" fill="#ff00d4" opacity="1"
            animate={animated ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
          />
          <motion.circle cx="35" cy="64" r="2.5" fill="#7c3aed" opacity="0.9"
            animate={animated ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          />
          <motion.circle cx="65" cy="64" r="2.5" fill="#7c3aed" opacity="0.9"
            animate={animated ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 2.5 }}
          />
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
          
          <linearGradient id="logoNetworkGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffe1" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#00ffe1" />
          </linearGradient>
          
          <linearGradient id="logoNetworkGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff00d4" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#ff00d4" />
          </linearGradient>
          
          <linearGradient id="logoNetworkGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
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
    <motion.div className="relative">
      <motion.div
        className={`font-[Orbitron] font-bold tracking-wider ${textSize} bg-gradient-to-r from-[#00ffe1] via-[#ff00d4] to-[#7c3aed] bg-clip-text text-transparent relative z-10`}
        animate={animated ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        } : {}}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ backgroundSize: '300% 300%' }}
      >
        GuardianChain
      </motion.div>
      
      {/* Quantum Glow Effect */}
      {animated && (
        <>
          <motion.div
            className={`absolute inset-0 font-[Orbitron] font-bold tracking-wider ${textSize} text-[#00ffe1] blur-sm opacity-50`}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            GuardianChain
          </motion.div>
          
          <motion.div
            className={`absolute inset-0 font-[Orbitron] font-bold tracking-wider ${textSize} text-[#ff00d4] blur-md opacity-30`}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.04, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            GuardianChain
          </motion.div>
        </>
      )}
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