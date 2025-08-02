import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuantumLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "pulse" | "orbit" | "neural" | "quantum";
  className?: string;
}

const QuantumLoader: React.FC<QuantumLoaderProps> = ({
  size = "md",
  variant = "quantum",
  className
}) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const PulseLoader = () => (
    <div className={cn("relative", sizes[size])}>
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 0.3, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
        animate={{
          scale: [1, 0.8, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
    </div>
  );

  const OrbitLoader = () => (
    <div className={cn("relative", sizes[size])}>
      <motion.div
        className="absolute inset-0 border-2 border-transparent border-t-cyan-400 border-r-purple-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute inset-1 border-2 border-transparent border-b-purple-500 border-l-pink-500 rounded-full"
        animate={{ rotate: -360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <div className="absolute inset-4 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full opacity-80" />
    </div>
  );

  const NeuralLoader = () => (
    <div className={cn("relative flex items-center justify-center", sizes[size])}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mx-0.5"
          animate={{
            y: [-4, 4, -4],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const QuantumLoader = () => (
    <div className={cn("relative", sizes[size])}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, #06b6d4, #8b5cf6, #f59e0b, #06b6d4)"
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute inset-1 bg-black rounded-full"
        animate={{
          scale: [1, 0.9, 1]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute inset-3 bg-gradient-to-br from-cyan-400 via-purple-500 to-yellow-400 rounded-full"
        animate={{
          scale: [0.8, 1, 0.8],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );

  const loaderComponents = {
    pulse: PulseLoader,
    orbit: OrbitLoader,
    neural: NeuralLoader,
    quantum: QuantumLoader
  };

  const LoaderComponent = loaderComponents[variant];

  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      <LoaderComponent />
    </div>
  );
};

export default QuantumLoader;