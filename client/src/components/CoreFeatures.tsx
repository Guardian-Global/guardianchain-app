import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Quantum Truth",
    description: "Quantum-secured truth preservation & zero-trust testimony logs.",
    delay: 0
  },
  {
    title: "AI Authorship", 
    description: "Veritas-powered capsule authorship with grief score authentication.",
    delay: 0.1
  },
  {
    title: "Multi-Chain",
    description: "Deployed across Base, Polygon, and Arbitrum with GTT-powered yield.",
    delay: 0.2
  }
];

export default function CoreFeatures() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20 text-center">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="bg-secondary p-8 rounded-xl shadow-inset hover:shadow-glow transition"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: feature.delay }}
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-2xl font-bold text-accent">{feature.title}</h3>
          <p className="text-slate-300 mt-4">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </section>
  );
}