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
    <div className="min-h-screen text-white relative">
      {/* Remove conflicting background - let child components handle their own backgrounds */}
      {showBackground && <InteractiveBackground />}
      
      <EliteNavbar />
      
      {/* Main content area - full width layout with no top padding for full-screen components */}
      <motion.main 
        className={`relative z-10 w-full ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.main>
      
      <EliteFooter />
      <Toaster />
    </div>
  );
}

export default EliteLayout;