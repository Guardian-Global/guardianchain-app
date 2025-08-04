import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import EnhancedMegaNavigation from '@/components/EnhancedMegaNavigation';
import { 
  Menu, 
  X, 
  Shield, 
  Vault, 
  BarChart3, 
  Users, 
  Settings,
  Sparkles,
  Crown,
  ChevronDown,
  Handshake,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/explorer', label: 'Capsule Explorer', icon: Search },
  { href: '/truth-genome', label: 'Truth Genome', icon: Sparkles },
  { href: '/social', label: 'Social Hub', icon: Users },
  { href: '/governance', label: 'DAO', icon: Crown },
  { href: '/partners', label: 'Partners', icon: Handshake },
];

export function EliteNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="h-8 w-8 text-yellow-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                GuardianChain
              </span>
            </motion.div>
          </Link>

          {/* Enhanced Mega Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <EnhancedMegaNavigation />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-yellow-400/20 text-yellow-400' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                    {item.href === '/governance' && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        New
                      </Badge>
                    )}
                  </motion.div>
                </Link>
              );
            })}

            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Tools <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-md border-white/10">
                <DropdownMenuItem asChild>
                  <Link href="/veritas-node">Veritas Node</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/timeline">Timeline</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/analytics">Analytics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/lineage">Lineage Graph</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Connect Button */}
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all duration-200">
              Connect Wallet
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="md:hidden mt-4 pb-4 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-yellow-400/20 text-yellow-400' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.href === '/governance' && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          New
                        </Badge>
                      )}
                      {item.href === '/partners' && (
                        <Badge variant="outline" className="ml-auto text-xs border-purple-400 text-purple-400">
                          Revenue
                        </Badge>
                      )}
                    </div>
                  </Link>
                );
              })}
              
              <Button className="mt-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all duration-200">
                Connect Wallet
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}