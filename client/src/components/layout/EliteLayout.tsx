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
    <div className="flex flex-col min-h-screen text-white relative overflow-hidden" 
         style={{ 
           background: 'linear-gradient(135deg, hsl(240, 100%, 3%), hsl(280, 100%, 5%))',
           color: 'hsl(0, 0%, 98%)'
         }}>
      {showBackground && <InteractiveBackground />}
      
      <EliteNavbar />
      
      <motion.main 
        className={`flex-grow relative z-10 px-4 py-8 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ color: 'hsl(0, 0%, 98%)' }}
      >
        <div className="container mx-auto max-w-7xl">
          {children}
        </div>
      </motion.main>
      
      <EliteFooter />
      <Toaster />
    </div>
  );
}

export default EliteLayout;