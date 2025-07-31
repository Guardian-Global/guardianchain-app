import React, { useState } from 'react';
import { HelpCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHelp } from './HelpProvider';
import { HelpCenter } from './HelpCenter';

export const HelpToggle: React.FC = () => {
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const { isHelpMode, toggleHelpMode } = useHelp();

  return (
    <>
      <div className="flex items-center space-x-2">
        {/* Help Mode Toggle */}
        <Button
          variant={isHelpMode ? "default" : "ghost"}
          size="sm"
          onClick={toggleHelpMode}
          className={`relative ${
            isHelpMode
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Help Mode
          {isHelpMode && (
            <Badge
              variant="secondary"
              className="ml-2 bg-white/20 text-white text-xs"
            >
              ON
            </Badge>
          )}
        </Button>

        {/* Help Center */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsHelpCenterOpen(true)}
          className="text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Help Center
        </Button>
      </div>

      {/* Help Center Modal */}
      <HelpCenter
        isOpen={isHelpCenterOpen}
        onClose={() => setIsHelpCenterOpen(false)}
      />

      {/* Help Mode Indicator */}
      {isHelpMode && (
        <div className="fixed top-20 left-4 z-40 bg-purple-600 text-white px-3 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Help Mode Active</span>
          </div>
          <p className="text-xs opacity-90 mt-1">
            Click on question mark icons for contextual help
          </p>
        </div>
      )}
    </>
  );
};