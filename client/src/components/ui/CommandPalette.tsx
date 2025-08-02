import React, { useState, useEffect } from 'react';
import { Search, Command, ArrowRight, Hash, User, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  show: boolean;
  onClose: () => void;
}

const commands = [
  { id: 'create-capsule', icon: FileText, label: 'Create Capsule', shortcut: 'C', path: '/create' },
  { id: 'explore', icon: Hash, label: 'Explore Feed', shortcut: 'E', path: '/explore' },
  { id: 'profile', icon: User, label: 'My Profile', shortcut: 'P', path: '/profile' },
  { id: 'auction', icon: ArrowRight, label: 'Truth Auctions', shortcut: 'A', path: '/auction-house' },
  { id: 'settings', icon: Settings, label: 'Settings', shortcut: 'S', path: '/settings' },
];

export default function CommandPalette({ show, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const navigate = (path: string) => {
    window.location.href = path;
  };

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (!show) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [show]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!show) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev === 0 ? filteredCommands.length - 1 : prev - 1);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            navigate(filteredCommands[selectedIndex].path);
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, selectedIndex, filteredCommands, navigate, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="w-full max-w-lg mx-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <Command className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg"
            autoFocus
          />
          <kbd className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No commands found</p>
            </div>
          ) : (
            filteredCommands.map((cmd, index) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    navigate(cmd.path);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 text-left transition-colors",
                    index === selectedIndex 
                      ? "bg-blue-600/20 border-r-2 border-blue-500" 
                      : "hover:bg-white/5"
                  )}
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span className="flex-1 text-white">{cmd.label}</span>
                  <kbd className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">
                    ⌘{cmd.shortcut}
                  </kbd>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}