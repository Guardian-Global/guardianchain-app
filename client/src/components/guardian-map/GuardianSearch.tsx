import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Filter,
  Download,
  X,
  MapPin,
  Users,
  Shield,
  Activity,
  Target
} from 'lucide-react';

interface GuardianNode {
  id: string;
  wallet: string;
  latitude: number;
  longitude: number;
  truth_score: number;
  capsule_count: number;
  region: string;
  country: string;
  city: string;
  reputation_tier: 'Bronze' | 'Silver' | 'Gold' | 'Veritas';
  activity_level: 'low' | 'medium' | 'high';
  last_active: string;
  specialties: string[];
  connections: string[];
  influence_radius: number;
}

interface SearchFilters {
  searchQuery: string;
  region: string;
  tier: string;
  activityLevel: string;
  truthScoreRange: [number, number];
  capsuleCountRange: [number, number];
  specialties: string[];
  hasActiveConnections: boolean;
  recentlyActive: boolean;
}

interface GuardianSearchProps {
  guardians: GuardianNode[];
  onFiltersChange: (filters: SearchFilters) => void;
  onExport: (format: 'csv' | 'json' | 'excel') => void;
}

export default function GuardianSearch({ guardians, onFiltersChange, onExport }: GuardianSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: '',
    region: 'all',
    tier: 'all',
    activityLevel: 'all',
    truthScoreRange: [0, 200],
    capsuleCountRange: [0, 50],
    specialties: [],
    hasActiveConnections: false,
    recentlyActive: false
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Get all unique specialties from guardians
  const allSpecialties = Array.from(
    new Set(guardians.flatMap(guardian => guardian.specialties))
  ).sort();

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      searchQuery: '',
      region: 'all',
      tier: 'all',
      activityLevel: 'all',
      truthScoreRange: [0, 200],
      capsuleCountRange: [0, 50],
      specialties: [],
      hasActiveConnections: false,
      recentlyActive: false
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const toggleSpecialty = (specialty: string) => {
    const newSpecialties = filters.specialties.includes(specialty)
      ? filters.specialties.filter(s => s !== specialty)
      : [...filters.specialties, specialty];
    
    handleFilterChange({ specialties: newSpecialties });
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.region !== 'all') count++;
    if (filters.tier !== 'all') count++;
    if (filters.activityLevel !== 'all') count++;
    if (filters.truthScoreRange[0] > 0 || filters.truthScoreRange[1] < 200) count++;
    if (filters.capsuleCountRange[0] > 0 || filters.capsuleCountRange[1] < 50) count++;
    if (filters.specialties.length > 0) count++;
    if (filters.hasActiveConnections) count++;
    if (filters.recentlyActive) count++;
    return count;
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
      <CardHeader>
        <CardTitle className="text-indigo-300 flex items-center justify-between">
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Guardian Search & Filters
            {getFilterCount() > 0 && (
              <Badge variant="outline" className="ml-2 border-indigo-400 text-indigo-300">
                {getFilterCount()} active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="border-indigo-500/30"
            >
              <Filter className="w-4 h-4 mr-1" />
              Advanced
            </Button>
            {getFilterCount() > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="border-red-500/30 text-red-300"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Basic Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by wallet, location, specialties..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
            className="pl-10 bg-slate-800/50 border-indigo-500/30 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm text-gray-300 mb-1 block">Region</Label>
            <Select value={filters.region} onValueChange={(value) => handleFilterChange({ region: value })}>
              <SelectTrigger className="bg-slate-800 border-indigo-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-indigo-500/30">
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="north_america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
                <SelectItem value="south_america">South America</SelectItem>
                <SelectItem value="oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-300 mb-1 block">Reputation Tier</Label>
            <Select value={filters.tier} onValueChange={(value) => handleFilterChange({ tier: value })}>
              <SelectTrigger className="bg-slate-800 border-indigo-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-indigo-500/30">
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="Veritas">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-yellow-400" />
                    Veritas
                  </div>
                </SelectItem>
                <SelectItem value="Gold">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-yellow-500" />
                    Gold
                  </div>
                </SelectItem>
                <SelectItem value="Silver">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-gray-400" />
                    Silver
                  </div>
                </SelectItem>
                <SelectItem value="Bronze">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-orange-600" />
                    Bronze
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-300 mb-1 block">Activity Level</Label>
            <Select value={filters.activityLevel} onValueChange={(value) => handleFilterChange({ activityLevel: value })}>
              <SelectTrigger className="bg-slate-800 border-indigo-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-indigo-500/30">
                <SelectItem value="all">All Activity</SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-green-400" />
                    High Activity
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-yellow-400" />
                    Medium Activity
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-gray-400" />
                    Low Activity
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="space-y-4 border-t border-gray-700 pt-4">
            
            {/* Truth Score Range */}
            <div>
              <Label className="text-sm text-gray-300 mb-2 block">
                Truth Score: {filters.truthScoreRange[0]} - {filters.truthScoreRange[1]}
              </Label>
              <Slider
                value={filters.truthScoreRange}
                onValueChange={(value) => handleFilterChange({ truthScoreRange: value as [number, number] })}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            {/* Capsule Count Range */}
            <div>
              <Label className="text-sm text-gray-300 mb-2 block">
                Capsule Count: {filters.capsuleCountRange[0]} - {filters.capsuleCountRange[1]}
              </Label>
              <Slider
                value={filters.capsuleCountRange}
                onValueChange={(value) => handleFilterChange({ capsuleCountRange: value as [number, number] })}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Specialties */}
            <div>
              <Label className="text-sm text-gray-300 mb-2 block">Specialties</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {allSpecialties.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={filters.specialties.includes(specialty)}
                      onCheckedChange={() => toggleSpecialty(specialty)}
                      className="border-indigo-500/30"
                    />
                    <Label htmlFor={specialty} className="text-xs text-gray-300 cursor-pointer">
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
              {filters.specialties.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {filters.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="outline"
                      className="border-indigo-400 text-indigo-300 text-xs cursor-pointer"
                      onClick={() => toggleSpecialty(specialty)}
                    >
                      {specialty}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Boolean Filters */}
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activeConnections"
                  checked={filters.hasActiveConnections}
                  onCheckedChange={(checked) => handleFilterChange({ hasActiveConnections: checked as boolean })}
                  className="border-indigo-500/30"
                />
                <Label htmlFor="activeConnections" className="text-sm text-gray-300 cursor-pointer">
                  <Users className="w-4 h-4 inline mr-1" />
                  Has Active Connections
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recentlyActive"
                  checked={filters.recentlyActive}
                  onCheckedChange={(checked) => handleFilterChange({ recentlyActive: checked as boolean })}
                  className="border-indigo-500/30"
                />
                <Label htmlFor="recentlyActive" className="text-sm text-gray-300 cursor-pointer">
                  <Target className="w-4 h-4 inline mr-1" />
                  Recently Active (24h)
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="border-t border-gray-700 pt-4">
          <Label className="text-sm text-gray-300 mb-2 block">Export Filtered Results</Label>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('csv')}
              className="border-indigo-500/30"
            >
              <Download className="w-4 h-4 mr-1" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('json')}
              className="border-indigo-500/30"
            >
              <Download className="w-4 h-4 mr-1" />
              JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('excel')}
              className="border-indigo-500/30"
            >
              <Download className="w-4 h-4 mr-1" />
              Excel
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="border-t border-gray-700 pt-4">
          <div className="text-sm text-gray-400">
            <MapPin className="w-4 h-4 inline mr-1" />
            Showing filtered guardians based on current criteria
          </div>
        </div>
      </CardContent>
    </Card>
  );
}