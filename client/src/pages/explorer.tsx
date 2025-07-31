import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  TrendingUp, 
  Clock, 
  Eye,
  Star,
  MapPin
} from 'lucide-react';
import CapsuleSearch from '@/components/CapsuleSearch';
import FilterPanel from '@/components/FilterPanel';
import CapsuleCard from '@/components/capsule/capsule-card';
import NodeUplink from '@/components/NodeUplink';
import LedgerExport from '@/components/LedgerExport';

interface CapsuleExplorerData {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  griefScore: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  createdAt: string;
  viewCount: number;
  location?: string;
}

export default function CapsuleExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    sortBy: "recent",
    tier: "all",
    category: "all",
    verificationStatus: "all"
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: capsules, isLoading } = useQuery({
    queryKey: ['/api/capsules/explore', { search: searchQuery, ...filters }],
    refetchInterval: 30000,
  });

  const explorerData: CapsuleExplorerData[] = capsules || [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearFilters = () => {
    setFilters({
      sortBy: "recent",
      tier: "all",
      category: "all",
      verificationStatus: "all"
    });
    setSearchQuery("");
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== "all" && value !== "recent"
  ).length;

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-600 text-white text-xs">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600 text-white text-xs">Pending</Badge>;
      default:
        return <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">Unverified</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center">
          <Search className="w-10 h-10 mr-3 text-blue-500" />
          Capsule Explorer
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Discover, search, and explore the global truth preservation network. 
          Browse verified memories, investigations, and evidence from around the world.
        </p>
      </div>

      {/* Explorer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <MapPin className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{explorerData.length.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Capsules</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {explorerData.filter(c => c.verificationStatus === 'verified').length}
            </div>
            <div className="text-sm text-slate-400">Verified</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {explorerData.filter(c => c.verificationStatus === 'pending').length}
            </div>
            <div className="text-sm text-slate-400">Pending Review</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Eye className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {explorerData.reduce((total, c) => total + (c.viewCount || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total Views</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Explorer Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <CapsuleSearch onSearch={handleSearch} />
          <FilterPanel 
            filters={filters} 
            setFilters={setFilters}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={handleClearFilters}
          />

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-sm">
                {explorerData.length} capsules found
              </span>
              {searchQuery && (
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  "{searchQuery}"
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="border-slate-600"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="border-slate-600"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Capsule Grid/List */}
          {explorerData.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No capsules found</h3>
                <p className="text-slate-400 mb-4">
                  Try adjusting your search terms or filters to find more results
                </p>
                <Button onClick={handleClearFilters} variant="outline" className="border-slate-600">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {explorerData.map((capsule) => (
                <Card key={capsule.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getVerificationBadge(capsule.verificationStatus)}
                        <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                          {capsule.category}
                        </Badge>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-3 h-3 mr-1" />
                        <span className="text-xs">{capsule.griefScore}/10</span>
                      </div>
                    </div>
                    
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">
                      {capsule.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm mb-3 line-clamp-3">
                      {capsule.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>By {capsule.author}</span>
                      <div className="flex items-center space-x-2">
                        <span>{capsule.viewCount || 0} views</span>
                        <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {explorerData.map((capsule) => (
                <Card key={capsule.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getVerificationBadge(capsule.verificationStatus)}
                          <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                            {capsule.category}
                          </Badge>
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-3 h-3 mr-1" />
                            <span className="text-xs">{capsule.griefScore}/10</span>
                          </div>
                        </div>
                        
                        <h3 className="text-white font-semibold mb-1">{capsule.title}</h3>
                        <p className="text-slate-400 text-sm mb-2">{capsule.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>By {capsule.author}</span>
                          <span>{capsule.viewCount || 0} views</span>
                          <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 ml-4">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <NodeUplink />
          <LedgerExport />
        </div>
      </div>
    </div>
  );
}