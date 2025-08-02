import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EliteHeroProps {
  title: string;
  subtitle: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  badge?: string;
  showVideoDemo?: boolean;
  className?: string;
}

export function EliteHero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  badge,
  showVideoDemo = false,
  className = ''
}: EliteHeroProps) {
  return (
    <section className={`relative py-20 px-4 text-center ${className}`}>
      <div className="container mx-auto max-w-4xl">
        {/* Badge */}
        {badge && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge 
              variant="secondary" 
              className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 px-4 py-2"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {badge}
            </Badge>
          </motion.div>
        )}

        {/* Main Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-medium"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {subtitle}
        </motion.h2>

        {/* Description */}
        {description && (
          <motion.p
            className="text-lg text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {description}
          </motion.p>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {primaryAction && (
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:from-yellow-500 hover:to-amber-600 px-8 py-4 text-lg group"
              onClick={primaryAction.onClick}
            >
              <Shield className="w-5 h-5 mr-2" />
              {primaryAction.label}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}

          {secondaryAction && (
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg group"
              onClick={secondaryAction.onClick}
            >
              {showVideoDemo && <Play className="w-5 h-5 mr-2" />}
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>

        {/* Video Demo Placeholder */}
        {showVideoDemo && (
          <motion.div
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-yellow-400/20 to-amber-500/20 p-1">
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 text-center">
                <Play className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                <p className="text-white text-lg">Demo Video Coming Soon</p>
                <p className="text-gray-400 mt-2">See GuardianChain in action</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Trust Indicators */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 mt-16 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Blockchain Secured</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm">Live Network</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}