import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function MascotDebug() {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[9999] bg-red-500 text-white p-4 rounded-lg"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1 }}
    >
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6" />
        <span>MASCOT DEBUG - VISIBLE</span>
      </div>
    </motion.div>
  );
}