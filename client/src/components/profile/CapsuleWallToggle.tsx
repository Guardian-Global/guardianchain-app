import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Grid3X3, 
  Calendar, 
  Timeline, 
  TrendingUp,
  Filter,
  Search,
  SortAsc,
  Eye,
  Lock,
  Users,
  Clock
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type ViewMode = 'grid' | 'timeline' | 'calendar' | 'trending';
export type SortBy = 'newest' | 'oldest' | 'most-viewed' | 'trending' | 'name';
export type FilterBy = 'all' | 'public' | 'private' | 'family' | 'sealed';

interface CapsuleWallToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  filterBy: FilterBy;
  onFilterChange: (filter: FilterBy) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCapsules: number;
  className?: string;
}

export default function CapsuleWallToggle({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  searchQuery,
  onSearchChange,
  totalCapsules,
  className = ""
}: CapsuleWallToggleProps) {
  const viewModes = [
    {
      value: 'grid' as const,
      label: 'Grid',
      icon: Grid3X3,
      description: 'Card-based layout'
    },
    {
      value: 'timeline' as const,
      label: 'Timeline',
      icon: Timeline,
      description: 'Chronological flow'
    },
    {
      value: 'calendar' as const,
      label: 'Calendar',
      icon: Calendar,
      description: 'Date-based view'
    },
    {
      value: 'trending' as const,
      label: 'Trending',
      icon: TrendingUp,
      description: 'Popularity-based'
    }
  ];

  const sortOptions = [
    { value: 'newest' as const, label: 'Newest First' },
    { value: 'oldest' as const, label: 'Oldest First' },
    { value: 'most-viewed' as const, label: 'Most Viewed' },
    { value: 'trending' as const, label: 'Trending' },
    { value: 'name' as const, label: 'Name A-Z' }
  ];

  const filterOptions = [
    { 
      value: 'all' as const, 
      label: 'All Capsules', 
      icon: Eye,
      description: 'Show everything'
    },
    { 
      value: 'public' as const, 
      label: 'Public', 
      icon: Eye,
      description: 'Visible to everyone'
    },
    { 
      value: 'family' as const, 
      label: 'Family & Friends', 
      icon: Users,
      description: 'Close connections only'
    },
    { 
      value: 'private' as const, 
      label: 'Private', 
      icon: Lock,
      description: 'Only you can view'
    },
    { 
      value: 'sealed' as const, 
      label: 'Time-Sealed', 
      icon: Clock,
      description: 'Locked until date'
    }
  ];

  const selectedFilter = filterOptions.find(option => option.value === filterBy);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Memory Wall Controls
          </div>
          <Badge variant="secondary">
            {totalCapsules} {totalCapsules === 1 ? 'Capsule' : 'Capsules'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Search Memories</span>
          </div>
          <Input
            placeholder="Search by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* View Mode */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            <span className="text-sm font-medium">View Mode</span>
          </div>
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && onViewModeChange(value as ViewMode)}
            className="justify-start"
          >
            {viewModes.map((mode) => (
              <ToggleGroupItem
                key={mode.value}
                value={mode.value}
                aria-label={mode.label}
                className="flex items-center gap-2"
              >
                <mode.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{mode.label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div className="text-xs text-muted-foreground">
            {viewModes.find(mode => mode.value === viewMode)?.description}
          </div>
        </div>

        {/* Sort and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sort By */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4" />
              <span className="text-sm font-medium">Sort By</span>
            </div>
            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortBy)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose sorting" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter By Privacy */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter By Privacy</span>
            </div>
            <Select value={filterBy} onValueChange={(value) => onFilterChange(value as FilterBy)}>
              <SelectTrigger>
                <SelectValue>
                  {selectedFilter && (
                    <div className="flex items-center gap-2">
                      <selectedFilter.icon className="w-4 h-4" />
                      <span>{selectedFilter.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchQuery || filterBy !== 'all' || sortBy !== 'newest') && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {filterBy !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Privacy: {selectedFilter?.label}
                </Badge>
              )}
              {sortBy !== 'newest' && (
                <Badge variant="secondary" className="text-xs">
                  Sort: {sortOptions.find(s => s.value === sortBy)?.label}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onSearchChange('');
                  onFilterChange('all');
                  onSortChange('newest');
                }}
                className="h-6 px-2 text-xs"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* View Mode Specific Info */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium mb-1">View Details</div>
          <div className="text-xs text-muted-foreground">
            {viewMode === 'grid' && "Card-based layout with rich previews and quick actions"}
            {viewMode === 'timeline' && "Chronological timeline showing your memory journey"}
            {viewMode === 'calendar' && "Calendar view organized by creation or event dates"}
            {viewMode === 'trending' && "Sorted by popularity, views, and community engagement"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}