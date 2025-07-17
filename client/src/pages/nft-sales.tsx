import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Search, Filter, TrendingUp, Eye, Star, Coins } from 'lucide-react';

const mockSales = [
  { 
    id: 1,
    user: '0xA1b2C3d4...5E6f',
    avatar: '/api/placeholder/50/50',
    capsule: 'Truth Capsule #112',
    image: '/api/placeholder/200/200',
    price: '280 GTT',
    priceUSD: '$420',
    griefScore: 94,
    category: 'Technology',
    views: 1247,
    verified: true,
    timestamp: '2 hours ago'
  },
  { 
    id: 2,
    user: '0xB77a8C9d...2F3g',
    avatar: '/api/placeholder/50/50',
    capsule: 'Grief Score Audit NFT',
    image: '/api/placeholder/200/200',
    price: '340 GTT',
    priceUSD: '$510',
    griefScore: 89,
    category: 'Legal',
    views: 892,
    verified: true,
    timestamp: '4 hours ago'
  },
  { 
    id: 3,
    user: '0x92fE5B6a...7H8i',
    avatar: '/api/placeholder/50/50',
    capsule: 'Whistleblower File 9X',
    image: '/api/placeholder/200/200',
    price: '500 GTT',
    priceUSD: '$750',
    griefScore: 97,
    category: 'Politics',
    views: 2156,
    verified: true,
    timestamp: '6 hours ago'
  },
  { 
    id: 4,
    user: '0xC3d4E5f6...9A0b',
    avatar: '/api/placeholder/50/50',
    capsule: 'Climate Data Verification',
    image: '/api/placeholder/200/200',
    price: '220 GTT',
    priceUSD: '$330',
    griefScore: 91,
    category: 'Environment',
    views: 756,
    verified: true,
    timestamp: '8 hours ago'
  },
  { 
    id: 5,
    user: '0xD4e5F6g7...1B2c',
    avatar: '/api/placeholder/50/50',
    capsule: 'Medical Research Truth',
    image: '/api/placeholder/200/200',
    price: '380 GTT',
    priceUSD: '$570',
    griefScore: 96,
    category: 'Health',
    views: 1543,
    verified: true,
    timestamp: '12 hours ago'
  },
  { 
    id: 6,
    user: '0xE5f6G7h8...3C4d',
    avatar: '/api/placeholder/50/50',
    capsule: 'Financial Transparency Report',
    image: '/api/placeholder/200/200',
    price: '450 GTT',
    priceUSD: '$675',
    griefScore: 93,
    category: 'Economics',
    views: 1089,
    verified: true,
    timestamp: '1 day ago'
  }
];

export default function NFTSales() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categories = ['all', 'Technology', 'Legal', 'Politics', 'Environment', 'Health', 'Economics'];

  const filteredSales = mockSales
    .filter(sale => 
      selectedCategory === 'all' || sale.category === selectedCategory
    )
    .filter(sale =>
      sale.capsule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.user.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          return parseInt(b.price) - parseInt(a.price);
        case 'price-low':
          return parseInt(a.price) - parseInt(b.price);
        case 'score':
          return b.griefScore - a.griefScore;
        case 'views':
          return b.views - a.views;
        default:
          return b.id - a.id; // recent first
      }
    });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: 'bg-blue-600',
      Legal: 'bg-gray-600',
      Politics: 'bg-red-600',
      Environment: 'bg-green-600',
      Health: 'bg-purple-600',
      Economics: 'bg-yellow-600'
    };
    return colors[category] || 'bg-slate-600';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <span className="text-white text-xl font-bold">NFT Capsule Marketplace</span>
                <p className="text-slate-400 text-sm font-normal">Verified truth capsules available for purchase</p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search capsules or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="score">Highest Grief Score</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sales Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSales.map((sale) => (
            <Card key={sale.id} className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-colors">
              <CardContent className="p-6">
                {/* NFT Image */}
                <div className="aspect-square rounded-lg overflow-hidden mb-4 relative">
                  <img 
                    src={sale.image} 
                    alt={sale.capsule}
                    className="w-full h-full object-cover"
                  />
                  {sale.verified && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-white text-lg">{sale.capsule}</h3>
                    <Badge className={`${getCategoryColor(sale.category)} text-white text-xs`}>
                      {sale.category}
                    </Badge>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center gap-2">
                    <img 
                      src={sale.avatar} 
                      alt="Seller"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-slate-400 text-sm font-mono">{sale.user}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {sale.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {sale.griefScore}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-xl font-bold text-white">{sale.price}</span>
                      </div>
                      <span className="text-sm text-slate-400">{sale.priceUSD}</span>
                    </div>
                    <span className="text-xs text-slate-500">{sale.timestamp}</span>
                  </div>

                  {/* Purchase Button */}
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Purchase NFT
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {filteredSales.length}
              </div>
              <div className="text-slate-400 text-sm">Available NFTs</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {Math.round(filteredSales.reduce((sum, sale) => sum + sale.griefScore, 0) / filteredSales.length)}
              </div>
              <div className="text-slate-400 text-sm">Avg Grief Score</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {Math.round(filteredSales.reduce((sum, sale) => sum + parseInt(sale.price), 0) / filteredSales.length)} GTT
              </div>
              <div className="text-slate-400 text-sm">Avg Price</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                {filteredSales.reduce((sum, sale) => sum + sale.views, 0).toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm">Total Views</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}