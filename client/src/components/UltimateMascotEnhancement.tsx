import React from 'react';
import { motion } from 'framer-motion';

interface UltimateMascotProps {
  size?: number;
  state?: 'idle' | 'active' | 'thinking' | 'alert';
}

export default function UltimateMascotEnhancement({ 
  size = 64, 
  state = 'idle' 
}: UltimateMascotProps) {
  return (
    <motion.div
      className="relative"
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="drop-shadow-[0_0_30px_rgba(0,255,225,0.7)]"
      >
        {/* Outer Quantum Field */}
        <motion.circle
          cx="60"
          cy="60"
          r="55"
          fill="none"
          stroke="url(#ultimateGlow)"
          strokeWidth="3"
          opacity="0.4"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle Energy Ring */}
        <motion.circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          stroke="url(#ultimateOrbit)"
          strokeWidth="2"
          opacity="0.6"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Power Ring */}
        <motion.circle
          cx="60"
          cy="60"
          r="41"
          fill="none"
          stroke="url(#ultimateInner)"
          strokeWidth="1.5"
          opacity="0.8"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Main Guardian Shield */}
        <motion.path
          d="M60 10 L25 25 L25 60 Q25 90 60 110 Q95 90 95 60 L95 25 Z"
          fill="url(#ultimateShield)"
          stroke="url(#ultimateBorder)"
          strokeWidth="3"
          animate={{
            filter: [
              "drop-shadow(0 0 15px #00ffe1)",
              "drop-shadow(0 0 25px #ff00d4)",
              "drop-shadow(0 0 20px #7c3aed)",
              "drop-shadow(0 0 15px #00ffe1)"
            ]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        {/* Advanced Neural Matrix */}
        <motion.g
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          {/* Primary Network Grid */}
          <path d="M35 35 L60 42 L85 35" stroke="url(#ultimateNet1)" strokeWidth="2.5" fill="none" opacity="0.9" />
          <path d="M30 52 L60 58 L90 52" stroke="url(#ultimateNet2)" strokeWidth="3" fill="none" opacity="1" />
          <path d="M35 69 L60 75 L85 69" stroke="url(#ultimateNet3)" strokeWidth="2.5" fill="none" opacity="0.9" />
          <path d="M40 86 L60 90 L80 86" stroke="url(#ultimateNet4)" strokeWidth="2" fill="none" opacity="0.8" />
          
          {/* Vertical Connections */}
          <path d="M42 37 L42 54 L42 71 L42 88" stroke="#00ffe1" strokeWidth="1.8" fill="none" opacity="0.7" />
          <path d="M78 37 L78 54 L78 71 L78 88" stroke="#7c3aed" strokeWidth="1.8" fill="none" opacity="0.7" />
          
          {/* Supreme Connection Nodes */}
          {[
            { x: 42, y: 37, color: "#00ffe1", delay: 0 },
            { x: 78, y: 37, color: "#00ffe1", delay: 0.3 },
            { x: 35, y: 54, color: "#ff00d4", delay: 0.6 },
            { x: 85, y: 54, color: "#ff00d4", delay: 0.9 },
            { x: 42, y: 71, color: "#7c3aed", delay: 1.2 },
            { x: 78, y: 71, color: "#7c3aed", delay: 1.5 },
            { x: 45, y: 88, color: "#a855f7", delay: 1.8 },
            { x: 75, y: 88, color: "#a855f7", delay: 2.1 }
          ].map((node, i) => (
            <motion.circle
              key={i}
              cx={node.x}
              cy={node.y}
              r="3.5"
              fill={node.color}
              opacity="1"
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: node.delay
              }}
            />
          ))}
        </motion.g>
        
        {/* Supreme Quantum Core */}
        <motion.g>
          <motion.circle
            cx="60"
            cy="57"
            r="14"
            fill="url(#ultimateCore)"
            animate={{
              scale: state === 'thinking' ? [1, 1.4, 1] : [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          
          <motion.circle
            cx="60"
            cy="57"
            r="9"
            fill="#00ffe1"
            opacity="0.8"
            animate={{
              scale: [0.7, 1.3, 0.7],
              opacity: [0.8, 0.4, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <motion.circle
            cx="60"
            cy="57"
            r="5"
            fill="#ffffff"
            opacity="0.9"
            animate={{
              scale: [0.8, 1.1, 0.8],
              opacity: [0.9, 0.6, 0.9]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          <circle cx="60" cy="57" r="2" fill="#ffffff" opacity="1" />
        </motion.g>
        
        {/* Data Stream Particles */}
        {[...Array(16)].map((_, i) => (
          <motion.circle
            key={i}
            cx={35 + (i * 3.5)}
            cy={25 + Math.sin(i * 0.4) * 12}
            r="1.2"
            fill={
              i % 4 === 0 ? "#00ffe1" : 
              i % 4 === 1 ? "#ff00d4" : 
              i % 4 === 2 ? "#7c3aed" : "#a855f7"
            }
            animate={{
              y: [0, 40, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.15
            }}
          />
        ))}
        
        {/* Power Status Indicators */}
        <motion.g>
          <motion.rect
            x="25"
            y="95"
            width="70"
            height="8"
            rx="4"
            fill="url(#ultimatePowerBg)"
            opacity="0.6"
          />
          <motion.rect
            x="27"
            y="97"
            width="66"
            height="4"
            rx="2"
            fill="url(#ultimatePowerFill)"
            animate={{
              width: [20, 66, 20],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.g>
        
        {/* Gradient Definitions */}
        <defs>
          <radialGradient id="ultimateShield" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="30%" stopColor="#1e293b" />
            <stop offset="70%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          
          <linearGradient id="ultimateBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffe1" />
            <stop offset="25%" stopColor="#ff00d4" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="75%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#00ffe1" />
          </linearGradient>
          
          <radialGradient id="ultimateCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ffe1" opacity="1" />
            <stop offset="40%" stopColor="#059669" opacity="0.8" />
            <stop offset="80%" stopColor="#1e293b" opacity="0.6" />
            <stop offset="100%" stopColor="#0f172a" opacity="0.3" />
          </radialGradient>
          
          <linearGradient id="ultimateGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffe1" opacity="0.6" />
            <stop offset="33%" stopColor="#ff00d4" opacity="0.8" />
            <stop offset="66%" stopColor="#7c3aed" opacity="0.6" />
            <stop offset="100%" stopColor="#00ffe1" opacity="0.6" />
          </linearGradient>
          
          <linearGradient id="ultimateOrbit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" opacity="0.4" />
            <stop offset="50%" stopColor="#00ffe1" opacity="0.7" />
            <stop offset="100%" stopColor="#ff00d4" opacity="0.4" />
          </linearGradient>
          
          <linearGradient id="ultimateInner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff00d4" opacity="0.5" />
            <stop offset="50%" stopColor="#a855f7" opacity="0.8" />
            <stop offset="100%" stopColor="#00ffe1" opacity="0.5" />
          </linearGradient>
          
          <linearGradient id="ultimateNet1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffe1" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#00ffe1" />
          </linearGradient>
          
          <linearGradient id="ultimateNet2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff00d4" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#ff00d4" />
          </linearGradient>
          
          <linearGradient id="ultimateNet3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          
          <linearGradient id="ultimateNet4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          
          <linearGradient id="ultimatePowerBg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          
          <linearGradient id="ultimatePowerFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffe1" />
            <stop offset="50%" stopColor="#ff00d4" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}