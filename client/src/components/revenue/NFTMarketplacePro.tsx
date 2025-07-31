import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Image, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Crown, 
  Star,
  Zap,
  Target,
  Building2,
  Globe,
  Activity,
  ArrowUpRight,
  CheckCircle,
  Eye,
  Heart,
  Share,
  PieChart,
  BarChart3,
  Palette,
  Music,
  Video,
  Gamepad2
} from 'lucide-react';

interface NFTCollection {
  id: string;
  name: string;
  creator: string;
  category: 'art' | 'gaming' | 'music' | 'photography' | 'utility';
  floorPrice: number;
  volume24h: number;
  totalVolume: number;
  items: number;
  owners: number;
  royalty: number;
  status: 'trending' | 'new' | 'established';
  verified: boolean;
}

interface NFTSale {
  id: string;
  collection: string;
  tokenId: string;
  price: number;
  buyer: string;
  seller: string;
  timestamp: string;
  royalty: number;
  platformFee: number;
}

interface MarketplaceMetrics {
  totalVolume: number;
  monthlyVolume: number;
  totalCollections: number;
  totalNFTs: number;
  uniqueTraders: number;
  averagePrice: number;
  platformRevenue: number;
  royaltyRevenue: number;
}

export function NFTMarketplacePro() {
  const [activeTab, setActiveTab] = useState<'trending' | 'collections' | 'sales' | 'analytics'>('trending');

  const [collections] = useState<NFTCollection[]>([
    {
      id: '1',
      name: 'Guardian Truth Artifacts',
      creator: 'Guardian Protocol',
      category: 'utility',
      floorPrice: 2.5,
      volume24h: 847000,
      totalVolume: 45000000,
      items: 10000,
      owners: 8934,
      royalty: 7.5,
      status: 'trending',
      verified: true
    },
    {
      id: '2',
      name: 'Crypto Legends Genesis',
      creator: 'LegendaryArt',
      category: 'art',
      floorPrice: 5.8,
      volume24h: 1240000,
      totalVolume: 128000000,
      items: 5555,
      owners: 4892,
      royalty: 10.0,
      status: 'established',
      verified: true
    },
    {
      id: '3',
      name: 'MetaVerse Warriors',
      creator: 'GameStudio',
      category: 'gaming',
      floorPrice: 1.2,
      volume24h: 567000,
      totalVolume: 23000000,
      items: 15000,
      owners: 12847,
      royalty: 5.0,
      status: 'trending',
      verified: true
    },
    {
      id: '4',
      name: 'AI Generated Dreams',
      creator: 'AIArtist',
      category: 'art',
      floorPrice: 0.8,
      volume24h: 234000,
      totalVolume: 8900000,
      items: 25000,
      owners: 18456,
      royalty: 6.0,
      status: 'new',
      verified: false
    }
  ]);

  const [recentSales] = useState<NFTSale[]>([
    {
      id: '1',
      collection: 'Guardian Truth Artifacts',
      tokenId: '#4729',
      price: 15.5,
      buyer: '0x742d...3f8a',
      seller: '0x8b4c...9d7e',
      timestamp: '2 minutes ago',
      royalty: 1.16, // 7.5%
      platformFee: 0.39 // 2.5%
    },
    {
      id: '2',
      collection: 'Crypto Legends Genesis',
      tokenId: '#1337',
      price: 28.7,
      buyer: '0x5a3d...7c2b',
      seller: '0x9f1e...4a8d',
      timestamp: '5 minutes ago',
      royalty: 2.87, // 10%
      platformFee: 0.72 // 2.5%
    },
    {
      id: '3',
      collection: 'MetaVerse Warriors',
      tokenId: '#9823',
      price: 3.4,
      buyer: '0x1c8f...6b5e',
      seller: '0x4d7a...2f9c',
      timestamp: '8 minutes ago',
      royalty: 0.17, // 5%
      platformFee: 0.085 // 2.5%
    }
  ]);

  const [metrics] = useState<MarketplaceMetrics>({
    totalVolume: 1850000000, // $1.85B
    monthlyVolume: 347000000, // $347M
    totalCollections: 8947,
    totalNFTs: 2400000,
    uniqueTraders: 489000,
    averagePrice: 4.7, // ETH
    platformRevenue: 46250000, // 2.5% of total volume
    royaltyRevenue: 129500000 // Average 7% royalties
  });

  const [categoryStats] = useState([
    {
      category: 'Art',
      volume: 890000000,
      collections: 3847,
      avgPrice: 8.2,
      growth: '+23%'
    },
    {
      category: 'Gaming',
      volume: 567000000,
      collections: 2134,
      avgPrice: 2.1,
      growth: '+67%'
    },
    {
      category: 'Utility',
      volume: 234000000,
      collections: 1847,
      avgPrice: 5.8,
      growth: '+156%'
    },
    {
      category: 'Music',
      volume: 89000000,
      collections: 892,
      avgPrice: 3.4,
      growth: '+89%'
    },
    {
      category: 'Photography',
      volume: 70000000,
      collections: 227,
      avgPrice: 1.9,
      growth: '+34%'
    }
  ]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatETH = (value: number) => {
    return `${value.toFixed(2)} ETH`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'art': return <Palette className="h-4 w-4" />;
      case 'gaming': return <Gamepad2 className="h-4 w-4" />;
      case 'music': return <Music className="h-4 w-4" />;
      case 'photography': return <Image className="h-4 w-4" />;
      case 'utility': return <Zap className="h-4 w-4" />;
      default: return <Image className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trending': return 'bg-green-600/20 text-green-400';
      case 'new': return 'bg-blue-600/20 text-blue-400';
      case 'established': return 'bg-purple-600/20 text-purple-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">NFT Marketplace Pro</h2>
          <p className="text-slate-400">
            {formatCurrency(metrics.totalVolume)} all-time volume across {formatNumber(metrics.totalCollections)} collections
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
            {formatCurrency(metrics.platformRevenue)} Platform Revenue
          </Badge>
          <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
            {formatNumber(metrics.uniqueTraders)} Traders
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Monthly Volume</p>
                <p className="text-xl font-bold text-white">{formatCurrency(metrics.monthlyVolume)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Image className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total NFTs</p>
                <p className="text-xl font-bold text-white">{formatNumber(metrics.totalNFTs)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Avg Price</p>
                <p className="text-xl font-bold text-white">{formatETH(metrics.averagePrice)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Users className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Unique Traders</p>
                <p className="text-xl font-bold text-white">{formatNumber(metrics.uniqueTraders)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
        <Button
          size="sm"
          variant={activeTab === 'trending' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('trending')}
          className="flex-1"
        >
          Trending
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'collections' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('collections')}
          className="flex-1"
        >
          Collections
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'sales' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('sales')}
          className="flex-1"
        >
          Live Sales
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('analytics')}
          className="flex-1"
        >
          Revenue Analytics
        </Button>
      </div>

      {/* Content Sections */}
      {activeTab === 'trending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Trending Collections</h3>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Image className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </div>

          <div className="grid gap-4">
            {collections.filter(c => c.status === 'trending').map((collection) => (
              <Card key={collection.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-600/20 rounded-lg">
                        {getCategoryIcon(collection.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-white">{collection.name}</h4>
                          {collection.verified && (
                            <CheckCircle className="h-5 w-5 text-blue-400" />
                          )}
                          <Badge className={getStatusColor(collection.status)}>
                            {collection.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">
                          by {collection.creator} • {collection.category}
                        </p>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-slate-500">Floor Price</p>
                            <p className="text-sm font-bold text-white">{formatETH(collection.floorPrice)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">24h Volume</p>
                            <p className="text-sm font-bold text-green-400">{formatCurrency(collection.volume24h)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Items</p>
                            <p className="text-sm font-bold text-white">{formatNumber(collection.items)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Owners</p>
                            <p className="text-sm font-bold text-white">{formatNumber(collection.owners)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400 mb-2">Total Volume</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(collection.totalVolume)}</p>
                      <p className="text-xs text-slate-400">{collection.royalty}% royalty</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'collections' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">All Collections</h3>
          
          <div className="grid gap-4">
            {collections.map((collection) => (
              <Card key={collection.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-700 rounded-lg">
                        {getCategoryIcon(collection.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-white">{collection.name}</h4>
                          {collection.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-400" />
                          )}
                          <Badge className={getStatusColor(collection.status)}>
                            {collection.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">by {collection.creator}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{formatETH(collection.floorPrice)}</p>
                      <p className="text-sm text-slate-400">Floor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Live Sales Activity</h3>
          
          <div className="grid gap-3">
            {recentSales.map((sale) => (
              <Card key={sale.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-600/20 rounded-lg">
                        <DollarSign className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{sale.collection} {sale.tokenId}</p>
                        <p className="text-xs text-slate-400">
                          {sale.seller} → {sale.buyer}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{formatETH(sale.price)}</p>
                      <p className="text-xs text-slate-400">{sale.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Platform Fee: {formatETH(sale.platformFee)}</span>
                    <span>Royalty: {formatETH(sale.royalty)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Platform Fees (2.5%)</span>
                    <span className="text-green-400 font-bold">{formatCurrency(metrics.platformRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Creator Royalties</span>
                    <span className="text-purple-400 font-bold">{formatCurrency(metrics.royaltyRevenue)}</span>
                  </div>
                  <div className="border-t border-slate-600 pt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-medium">Total Ecosystem Revenue</span>
                      <span className="text-green-400 font-bold text-xl">
                        {formatCurrency(metrics.platformRevenue + metrics.royaltyRevenue)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-400" />
                  Category Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryStats.map((category, index) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{category.category}</span>
                        <span className="text-white font-medium">{formatCurrency(category.volume)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">{category.collections} collections</span>
                        <span className={`font-medium ${
                          category.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {category.growth}
                        </span>
                      </div>
                      <Progress 
                        value={(category.volume / Math.max(...categoryStats.map(c => c.volume))) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-purple-900/50 to-green-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">NFT Marketplace Excellence</h4>
                  <p className="text-purple-300 mb-4">
                    Leading marketplace with {formatCurrency(metrics.totalVolume)} total volume and {formatNumber(metrics.uniqueTraders)} active traders
                  </p>
                  <div className="flex items-center gap-4">
                    <ArrowUpRight className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-green-300">
                      {formatCurrency(metrics.monthlyVolume)} monthly volume
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-green-400">
                    {formatCurrency(metrics.monthlyVolume * 0.025)}
                  </p>
                  <p className="text-sm text-green-300">Platform fees only</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}