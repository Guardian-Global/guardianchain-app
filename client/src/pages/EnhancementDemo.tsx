import React from 'react';
import EnhancementShowcase from '@/components/demo/EnhancementShowcase';

export default function EnhancementDemo() {
  // Return showcase without additional padding since EliteLayout already handles it
  return (
    <div className="w-full">
      <EnhancementShowcase />
    </div>
  );
}