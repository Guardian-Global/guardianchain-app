import React from 'react';
import EnhancementShowcase from '@/components/demo/EnhancementShowcase';

export default function EnhancementDemo() {
  // Full-screen isolated component that bypasses all global styles and components
  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-auto z-[9999]"
      style={{
        background: 'linear-gradient(135deg, hsl(180, 100%, 50%) 0%, hsl(285, 100%, 65%) 35%, hsl(330, 100%, 50%) 70%, hsl(180, 100%, 50%) 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradient-shift 8s ease infinite'
      }}
    >
      <EnhancementShowcase />
    </div>
  );
}