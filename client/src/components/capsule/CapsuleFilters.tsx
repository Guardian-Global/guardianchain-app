import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Filter, 
  Search, 
  Calendar, 
  Star, 
  Shield, 
  Users,
  TrendingUp,
  RefreshCw,
  X
} from "lucide-react";

interface FilterState {
  searchTerm: string;
  categories: string[];
  verificationLevel: string[];
  truthScore: number[];
  dateRange: string;
  rewardTier: string[];
  sortBy: string;
}

interface CapsuleFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  totalResults?: number;
}

export default function CapsuleFilters({ onFiltersChange, totalResults = 0 }: CapsuleFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    categories: [],
    verificationLevel: [],
    truthScore: [0],
    dateRange: 'all',
    rewardTier: [],
    sortBy: 'recent'
  });

  const categories = [
    { id: 'news-report', label: 'News Report', count: 1247 },
    { id: 'personal-testimony', label: 'Personal Testimony', count: 892 },
    { id: 'document-evidence', label: 'Document Evidence', count: 634 },
    { id: 'legacy-memory', label: 'Legacy Memory', count: 523 },
    { id: 'trauma-recovery', label: 'Trauma Recovery', count: 289 },
    { id: 'whistleblower', label: 'Whistleblower', count: 156 },
    { id: 'scientific-data', label: 'Scientific Data', count: 445 },
    { id: 'financial-record', label: 'Financial Record', count: 234 }
  ];

  const verificationLevels = [
    { id: 'community', label: 'Community Verified', icon: Users, color: 'text-blue-400' },
    { id: 'professional', label: 'Professional Grade', icon: Shield, color: 'text-green-400' },
    { id: 'veritas-sealed', label: 'Veritas Sealed', icon: Star, color: 'text-yellow-400' }
  ];

  const rewardTiers = [
    { id: 'standard', label: 'Standard (1x GTT)', multiplier: '1x' },
    { id: 'enhanced', label: 'Enhanced (1.5x GTT)', multiplier: '1.5x' },
    { id: 'premium', label: 'Premium (3x GTT)', multiplier: '3x' }
  ];

  const sortOptions = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'truth-score', label: 'Highest Truth Score' },
    { id: 'gtt-rewards', label: 'Highest GTT Rewards' },
    { id: 'verification-count', label: 'Most Verified' },
    { id: 'trending', label: 'Trending Now' }
  ];

  const updateFilters = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = (key: 'categories' | 'verificationLevel' | 'rewardTier', value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters(key, newArray);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      searchTerm: '',
      categories: [],
      verificationLevel: [],
      truthScore: [0],
      dateRange: 'all',
      rewardTier: [],
      sortBy: 'recent'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFilterCount = 
    filters.categories.length + 
    filters.verificationLevel.length + 
    filters.rewardTier.length + 
    (filters.searchTerm ? 1 : 0) + 
    (filters.truthScore[0] > 0 ? 1 : 0) + 
    (filters.dateRange !== 'all' ? 1 : 0);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-blue-400" />
            <div>
              <CardTitle>Capsule Filters</CardTitle>
              <CardDescription>
                {totalResults.toLocaleString()} capsules found
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                {activeFilterCount} active
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search capsules by content, title, or creator..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters('searchTerm', e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600/50 text-white"
          />
        </div>

        {/* Quick Filters Row */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.sortBy === 'trending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilters('sortBy', 'trending')}
            className="text-xs"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Button>
          
          <Button
            variant={filters.verificationLevel.includes('veritas-sealed') ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleArrayFilter('verificationLevel', 'veritas-sealed')}
            className="text-xs"
          >
            <Star className="h-3 w-3 mr-1" />
            Veritas Sealed
          </Button>
          
          <Button
            variant={filters.dateRange === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilters('dateRange', filters.dateRange === 'today' ? 'all' : 'today')}
            className="text-xs"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Today
          </Button>
        </div>

        {isExpanded && (
          <>
            {/* Categories */}
            <div>
              <Label className="text-sm font-medium text-white mb-3 block">Categories</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={() => toggleArrayFilter('categories', category.id)}
                    />
                    <Label htmlFor={category.id} className="text-sm text-gray-300 cursor-pointer">
                      {category.label}
                      <span className="text-xs text-gray-500 ml-1">({category.count})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Levels */}
            <div>
              <Label className="text-sm font-medium text-white mb-3 block">Verification Level</Label>
              <div className="space-y-2">
                {verificationLevels.map((level) => {
                  const Icon = level.icon;
                  return (
                    <div key={level.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={level.id}
                        checked={filters.verificationLevel.includes(level.id)}
                        onCheckedChange={() => toggleArrayFilter('verificationLevel', level.id)}
                      />
                      <Label htmlFor={level.id} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <Icon className={`h-4 w-4 ${level.color}`} />
                        {level.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Truth Score Range */}
            <div>
              <Label className="text-sm font-medium text-white mb-3 block">
                Minimum Truth Score: {filters.truthScore[0]}%
              </Label>
              <Slider
                value={filters.truthScore}
                onValueChange={(value) => updateFilters('truthScore', value)}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Reward Tiers */}
            <div>
              <Label className="text-sm font-medium text-white mb-3 block">GTT Reward Tier</Label>
              <div className="space-y-2">
                {rewardTiers.map((tier) => (
                  <div key={tier.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={tier.id}
                      checked={filters.rewardTier.includes(tier.id)}
                      onCheckedChange={() => toggleArrayFilter('rewardTier', tier.id)}
                    />
                    <Label htmlFor={tier.id} className="text-sm text-gray-300 cursor-pointer">
                      {tier.label}
                      <Badge className="ml-2 text-xs bg-green-600/20 text-green-400 border-green-500/30">
                        {tier.multiplier}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <Label className="text-sm font-medium text-white mb-3 block">Sort By</Label>
              <div className="grid grid-cols-2 gap-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={filters.sortBy === option.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilters('sortBy', option.id)}
                    className="text-xs justify-start"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-700/50">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            disabled={activeFilterCount === 0}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFiltersChange(filters)}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}