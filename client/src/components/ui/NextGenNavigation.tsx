import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Home, Shield, Play, Unlock, FileText, CheckCircle, Users, BarChart3,
  Vault, User, Menu, X, ChevronRight, Zap, Star
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
  description?: string;
  premium?: boolean;
}

const navigationItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home, description: 'Dashboard & Overview' },
  { href: '/create', label: 'Create', icon: Shield, description: 'Mint Truth Capsules', badge: 'New' },
  { href: '/replay', label: 'Replay', icon: Play, description: 'View Capsules', premium: true },
  { href: '/unlock', label: 'Unlock', icon: Unlock, description: 'Access Sealed Content' },
  { href: '/submit', label: 'Submit', icon: FileText, description: 'Truth Submissions' },
  { href: '/verify', label: 'Verify', icon: CheckCircle, description: 'Community Verification' },
  { href: '/dao', label: 'DAO', icon: Users, description: 'Governance & Voting', badge: 'Beta' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, description: 'Performance Metrics' },
  { href: '/vault', label: 'Vault', icon: Vault, description: 'Secure Storage', premium: true },
  { href: '/profile', label: 'Profile', icon: User, description: 'User Settings' }
];

export function NextGenNavigation() {
  const [location] = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation - Floating Sidebar */}
      <motion.nav
        className="hidden lg:flex fixed left-6 top-1/2 transform -translate-y-1/2 z-50"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="holographic-glass backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-2 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      className={cn(
                        'group relative flex items-center px-3 py-3 rounded-xl transition-all duration-300 cursor-pointer',
                        active 
                          ? 'quantum-field text-black shadow-lg shadow-yellow-500/25' 
                          : 'text-cyan-300 hover:text-cyan-100 hover:bg-white/5'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className={cn(
                        'w-5 h-5 transition-all duration-300',
                        active ? 'text-black' : 'text-cyan-400 group-hover:text-cyan-300'
                      )} />
                      
                      {/* Badge */}
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-cyber">
                          {item.badge}
                        </span>
                      )}
                      
                      {/* Premium Indicator */}
                      {item.premium && (
                        <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />
                      )}
                      
                      {/* Hover Tooltip */}
                      <AnimatePresence>
                        <motion.div
                          className="absolute left-full ml-4 px-3 py-2 bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-lg text-sm font-cyber whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-cyan-300 font-medium">{item.label}</div>
                          <div className="text-gray-400 text-xs">{item.description}</div>
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation - Bottom Bar */}
      <motion.nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="holographic-glass backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-2">
          <div className="flex justify-around items-center">
            {navigationItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      'relative flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-300',
                      active 
                        ? 'quantum-field text-black' 
                        : 'text-cyan-300 hover:text-cyan-100'
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-cyber">{item.label}</span>
                    
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
            
            {/* More Menu Button */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative flex flex-col items-center px-3 py-2 rounded-xl text-cyan-300 hover:text-cyan-100 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="w-5 h-5 mb-1" />
              <span className="text-xs font-cyber">More</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Expanded Menu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40 holographic-glass backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          >
            <div className="flex flex-col items-center justify-center h-full p-8">
              {navigationItems.slice(5).map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.href}>
                      <motion.div
                        className={cn(
                          'flex items-center gap-4 px-8 py-4 rounded-xl mb-4 transition-all duration-300',
                          active 
                            ? 'quantum-field text-black' 
                            : 'text-cyan-300 hover:text-cyan-100 hover:bg-white/5'
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsExpanded(false)}
                      >
                        <Icon className="w-6 h-6" />
                        <div>
                          <div className="font-quantum text-lg">{item.label}</div>
                          <div className="text-sm opacity-70">{item.description}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 ml-auto" />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NextGenNavigation;