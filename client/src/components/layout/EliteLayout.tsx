import React from 'react';
import { motion } from 'framer-motion';
import { EliteNavbar } from './EliteNavbar';
import { EliteFooter } from './EliteFooter';
import InteractiveBackground from '../ui/interactive-background';
import { Toaster } from '@/components/ui/toaster';

interface EliteLayoutProps {
  children: React.ReactNode;
  className?: string;
  showBackground?: boolean;
}

export function EliteLayout({ children, className = '', showBackground = true }: EliteLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-midnight-200 to-black text-white font-cyber relative">
      {/* Cyberpunk animated background */}
      {showBackground && (
        <div className="fixed inset-0 bg-gradient-cyber bg-[length:400%_400%] animate-gradient-shift opacity-10" />
      )}
      {showBackground && <InteractiveBackground />}
      
      <EliteNavbar />
      
      {/* Main content area with proper cyberpunk styling */}
      <motion.main 
        className={`relative z-10 w-full pt-20 px-4 lg:px-6 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
      
      <EliteFooter />
      <Toaster />
    </div>
  );
}

export default EliteLayout;