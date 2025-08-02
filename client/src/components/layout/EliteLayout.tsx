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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {showBackground && <InteractiveBackground />}
      
      <EliteNavbar />
      
      <motion.main 
        className={`flex-grow relative z-10 ${className}`}
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