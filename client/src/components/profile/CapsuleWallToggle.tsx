import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Grid3X3, 
  List, 
  Calendar,
  Heart,
  TrendingUp,
  Clock,
  Eye,
  Filter
} from "lucide-react";

export type ViewMode = 'grid' | 'timeline' | 'calendar' | 'trending';

interface CapsuleWallToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  capsuleCount?: number;
  className?: string;
}

export default function CapsuleWallToggle({
  currentView,
  onViewChange,
  capsuleCount = 0,
  className = ""
}: CapsuleWallToggleProps) {
  const [showFilters, setShowFilters] = useState(false);

  const viewOptions: Array<{
    mode: ViewMode;
    icon: React.ReactNode;
    label: string;
    description: string;
  }> = [
    {
      mode: 'grid',
      icon: <Grid3X3 className="w-4 h-4" />,
      label: 'Grid',
      description: 'Instagram-style grid view'
    },
    {
      mode: 'timeline',
      icon: <List className="w-4 h-4" />,
      label: 'Timeline',
      description: 'Facebook-style timeline'
    },
    {
      mode: 'calendar',
      icon: <Calendar className="w-4 h-4" />,
      label: 'Calendar',
      description: 'Date-based organization'
    },
    {
      mode: 'trending',
      icon: <TrendingUp className="w-4 h-4" />,
      label: 'Trending',
      description: 'Most viewed and liked'
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Capsule Wall</h3>
          <Badge variant="secondary" className="text-xs">
            {capsuleCount} capsules
          </Badge>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="text-xs"
        >
          <Filter className="w-3 h-3 mr-1" />
          Filters
        </Button>
      </div>

      {/* View Toggle Buttons */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {viewOptions.map((option) => (
          <Button
            key={option.mode}
            variant={currentView === option.mode ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(option.mode)}
            className="flex-1 text-xs gap-1"
            title={option.description}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </Button>
        ))}
      </div>

      {/* Quick Stats Bar */}
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          <span>2.1k views</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          <span>184 likes</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Last updated 2h ago</span>
        </div>
      </div>

      {/* Filters Panel (Collapsible) */}
      {showFilters && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
              All Time
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
              This Year
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
              Family
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
              Public
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
              NFT Minted
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}