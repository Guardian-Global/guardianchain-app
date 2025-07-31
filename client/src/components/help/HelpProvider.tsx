import React, { createContext, useContext, useState, useCallback } from 'react';
import { HelpContent } from './ContextualHelp';

interface HelpContextType {
  isHelpMode: boolean;
  toggleHelpMode: () => void;
  showHelp: (helpId: string) => void;
  hideHelp: () => void;
  currentHelp: string | null;
  helpHistory: string[];
  addToHistory: (helpId: string) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};

interface HelpProviderProps {
  children: React.ReactNode;
}

export const HelpProvider: React.FC<HelpProviderProps> = ({ children }) => {
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [currentHelp, setCurrentHelp] = useState<string | null>(null);
  const [helpHistory, setHelpHistory] = useState<string[]>([]);

  const toggleHelpMode = useCallback(() => {
    setIsHelpMode(prev => !prev);
    if (isHelpMode) {
      setCurrentHelp(null);
    }
  }, [isHelpMode]);

  const showHelp = useCallback((helpId: string) => {
    setCurrentHelp(helpId);
    addToHistory(helpId);
  }, []);

  const hideHelp = useCallback(() => {
    setCurrentHelp(null);
  }, []);

  const addToHistory = useCallback((helpId: string) => {
    setHelpHistory(prev => {
      const filtered = prev.filter(id => id !== helpId);
      return [helpId, ...filtered].slice(0, 10); // Keep last 10 items
    });
  }, []);

  const value: HelpContextType = {
    isHelpMode,
    toggleHelpMode,
    showHelp,
    hideHelp,
    currentHelp,
    helpHistory,
    addToHistory
  };

  return (
    <HelpContext.Provider value={value}>
      {children}
    </HelpContext.Provider>
  );
};