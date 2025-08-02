import React, { useState, useEffect } from 'react';
import EliteTopbar from './EliteTopbar';
import EliteSidebar from './EliteSidebar';
import CommandPalette from '@/components/ui/CommandPalette';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/animations.css';

interface EliteLayoutProps {
  children: React.ReactNode;
}

export default function EliteLayout({ children }: EliteLayoutProps) {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Layout Structure */}
      <div className="relative z-10">
        <EliteTopbar
          onCommandClick={() => setShowCommandPalette(true)}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <div className="flex">
          <EliteSidebar
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />

          {/* Main Content */}
          <main className="flex-1 md:ml-64 min-h-[calc(100vh-4rem)]">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Global Components */}
      <CommandPalette
        show={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
      <Toaster />


    </div>
  );
}