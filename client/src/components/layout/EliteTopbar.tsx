import React, { useState } from 'react';
import { Search, Bell, Wallet, Command, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlowButton from '@/components/ui/GlowButton';
import { useTheme } from '@/components/web3/theme-provider';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface EliteTopbarProps {
  onCommandClick: () => void;
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export default function EliteTopbar({ onCommandClick, onMenuToggle, isMobileMenuOpen }: EliteTopbarProps) {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [notifications] = useState(3); // Mock notification count

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="md:hidden text-white hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              GuardianChain
            </span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={onCommandClick}
            className="w-full flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-slate-400 hover:bg-slate-800 hover:border-white/20 transition-all"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Search commands...</span>
            <kbd className="px-2 py-1 bg-slate-700 text-xs rounded border border-slate-600">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Quick Search - Mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onCommandClick}
            className="md:hidden text-white hover:bg-white/10"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-white hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative text-white hover:bg-white/10"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Wallet/Profile */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="text-white font-medium">{user?.firstName}</span>
                <span className="text-slate-400">Explorer</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          ) : (
            <GlowButton variant="primary" size="sm">
              <Wallet className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Connect</span>
            </GlowButton>
          )}
        </div>
      </div>
    </header>
  );
}