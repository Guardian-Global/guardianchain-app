import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CapsuleEmbed from '@/components/CapsuleEmbed';
import VoiceRecall from '@/components/VoiceRecall';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CapsuleData {
  id: string;
  name: string;
  description: string;
  image: string;
  ipfsUrl: string;
  creator?: string;
  timestamp?: string;
  yieldAmount?: number;
  category?: string;
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const { data: capsules = [], isLoading, error } = useQuery({
    queryKey: ['/api/capsules', searchQuery, selectedCategory, sortBy],
    retry: false,
  });

  const handleVoiceSearch = (phrase: string) => {
    setSearchQuery(phrase);
  };

  const handleTextSearch = () => {
    // Search is handled by the query key change
  };

  // Demo data for development
  const demoData: CapsuleData[] = [
    {
      id: 'explore-1',
      name: 'Life Lessons Collection',
      description: 'Wisdom gathered through decades of experience, sealed for future generations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      ipfsUrl: 'https://ipfs.io/ipfs/QmExplore1',
      creator: '0x742d35Cc6634C0532925a3b8D2a1416d4b2bb1eb',
      timestamp: new Date().toISOString(),
      yieldAmount: 4.2,
      category: 'wisdom'
    },
    {
      id: 'explore-2',
      name: 'Creative Journey',
      description: 'Art, music, and creative expression documented in truth capsules',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
      ipfsUrl: 'https://ipfs.io/ipfs/QmExplore2',
      creator: '0x8ba1f109551bD432803012645Hac136c5D6a8B6E1',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      yieldAmount: 3.8,
      category: 'creative'
    },
    {
      id: 'explore-3',
      name: 'Scientific Discovery',
      description: 'Research findings and scientific breakthroughs preserved forever',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
      ipfsUrl: 'https://ipfs.io/ipfs/QmExplore3',
      creator: '0x9F0CC69F63fbA0E2Be89a894E2A0B8e3d7b5B8A9',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      yieldAmount: 5.1,
      category: 'science'
    },
    {
      id: 'explore-4',
      name: 'Family Heritage',
      description: 'Stories and traditions passed down through generations',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400',
      ipfsUrl: 'https://ipfs.io/ipfs/QmExplore4',
      creator: '0x1A2B3C4D5E6F7890123456789ABCDEF01234567',
      timestamp: new Date(Date.now() - 345600000).toISOString(),
      yieldAmount: 6.3,
      category: 'family'
    }
  ];

  const displayData = error ? demoData : capsules;

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'wisdom', label: 'Wisdom & Life Lessons' },
    { value: 'creative', label: 'Creative Expression' },
    { value: 'science', label: 'Scientific Discovery' },
    { value: 'family', label: 'Family Heritage' },
    { value: 'testimony', label: 'Truth Testimony' },
    { value: 'legacy', label: 'Legacy Preservation' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'yield', label: 'Highest Yield' },
    { value: 'popular', label: 'Most Popular' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-4xl font-bold text-white" data-testid="text-explore-title">
              Explore Capsules
            </h1>
            <p className="text-gray-300">Discover truth capsules from the Guardian community</p>
          </div>
        </div>

        {/* Voice Search */}
        <div className="mb-6">
          <VoiceRecall onSearch={handleVoiceSearch} />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search capsules..."
              className="bg-slate-800 border-cyan-500/30 text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
              data-testid="input-explore-search"
            />
            <Button
              onClick={handleTextSearch}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              data-testid="button-explore-search"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-slate-800 border-cyan-500/30 text-white" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-cyan-500/30">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="text-white hover:bg-slate-700">
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-slate-800 border-cyan-500/30 text-white" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-cyan-500/30">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-cyan-400">Discovering capsules...</p>
        </div>
      )}

      {error && (
        <div className="bg-amber-500/20 border border-amber-500 rounded-lg p-4 mb-6">
          <p className="text-amber-300">Using demo data for exploration</p>
          <p className="text-sm text-amber-400 mt-1">Connect to live blockchain data for real capsules</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayData.length > 0 ? (
          displayData.map((capsule) => (
            <CapsuleEmbed
              key={capsule.id}
              name={capsule.name}
              description={capsule.description}
              image={capsule.image}
              ipfsUrl={capsule.ipfsUrl}
              creator={capsule.creator}
              timestamp={capsule.timestamp}
              yieldAmount={capsule.yieldAmount}
            />
          ))
        ) : (
          !isLoading && (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Capsules Found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          )
        )}
      </div>

      {/* Stats */}
      {displayData.length > 0 && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 bg-slate-900/50 backdrop-blur-sm px-6 py-3 rounded-xl border border-cyan-500/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{displayData.length}</div>
              <div className="text-sm text-gray-400">Capsules Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {displayData.reduce((sum, c) => sum + (c.yieldAmount || 0), 0).toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">Total GTT</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {new Set(displayData.map(c => c.creator)).size}
              </div>
              <div className="text-sm text-gray-400">Unique Creators</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}