import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="text-center mt-24 max-w-4xl mx-auto">
      <motion.h2 
        className="text-5xl font-extrabold text-primary drop-shadow-glow tracking-tight shadow-glow"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        GuardianChain
      </motion.h2>
      <motion.p 
        className="mt-6 text-2xl text-slate-300 leading-relaxed"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        The sovereign memory chain. Immutable. AI-powered. Yours forever.
      </motion.p>
    </section>
  );
}