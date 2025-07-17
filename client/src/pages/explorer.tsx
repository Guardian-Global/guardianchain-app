import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Activity, 
  Clock, 
  DollarSign, 
  Users, 
  Eye,
  ShoppingCart,
  FileText,
  Shield,
  Zap,
  Coins
} from 'lucide-react';

const recentSales = [
  { 
    id: 1, 
    title: 'Veritas Capsule #001', 
    price: '320 GTT', 
    priceUSD: '$480',
    timestamp: 'Just now', 
    buyer: '0xFa...89c',
    seller: '0xAb...123',
    avatar: '/api/placeholder/50/50',
    category: 'Technology',
    griefScore: 95
  },
  { 
    id: 2, 
    title: 'Guardian Seal #009', 
    price: '540 GTT', 
    priceUSD: '$810',
    timestamp: '12 min ago', 
    buyer: '0xAA...51f',
    seller: '0xCd...456',
    avatar: '/api/placeholder/50/50',
    category: 'Legal',
    griefScore: 88
  },
  { 
    id: 3, 
    title: 'Truth Archive #156', 
    price: '280 GTT', 
    priceUSD: '$420',
    timestamp: '23 min ago', 
    buyer: '0xBc...77d',
    seller: '0xEf...789',
    avatar: '/api/placeholder/50/50',
    category: 'Politics',
    griefScore: 92
  },
  { 
    id: 4, 
    title: 'Climate Data Capsule', 
    price: '410 GTT', 
    priceUSD: '$615',
    timestamp: '1 hour ago', 
    buyer: '0xDe...99a',
    seller: '0xGh...012',
    avatar: '/api/placeholder/50/50',
    category: 'Environment',
    griefScore: 89
  },
  { 
    id: 5, 
    title: 'Medical Research Truth', 
    price: '670 GTT', 
    priceUSD: '$1,005',
    timestamp: '2 hours ago', 
    buyer: '0xFg...33b',
    seller: '0xIj...345',
    avatar: '/api/placeholder/50/50',
    category: 'Health',
    griefScore: 97
  }
];

const recentMints = [
  {
    id: 1,
    title: 'Financial Transparency Report',
    creator: '0xAb...123',
    timestamp: '5 min ago',
    griefScore: 94,
    category: 'Economics'
  },
  {
    id: 2,
    title: 'Blockchain Audit Results',
    creator: '0xCd...456',
    timestamp: '18 min ago',
    griefScore: 91,
    category: 'Technology'
  },
  {
    id: 3,
    title: 'Whistleblower Document',
    creator: '0xEf...789',
    timestamp: '45 min ago',
    griefScore: 96,
    category: 'Legal'
  }
];

const recentSealings = [
  {
    id: 1,
    title: 'Government Contract Analysis',
    sealer: '0xGh...012',
    timestamp: '3 min ago',
    docuSignId: 'DS-7891234',
    category: 'Politics'
  },
  {
    id: 2,
    title: 'Corporate Earnings Truth',
    sealer: '0xIj...345',
    timestamp: '27 min ago',
    docuSignId: 'DS-7891235',
    category: 'Economics'
  }
];

export default function Explorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTab, setSelectedTab] = useState('sales');

  const categories = ['all', 'Technology', 'Legal', 'Politics', 'Environment', 'Health', 'Economics'];

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ShoppingCart className="w-4 h-4" />;
      case 'mint':
        return <Zap className="w-4 h-4" />;
      case 'seal':
        return <Shield className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <span className="text-white text-xl font-bold">Capsule Marketplace Explorer</span>
                <p className="text-slate-400 text-sm font-normal">Track recent NFT mints, sealings, and secondary capsule sales across the protocol</p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {recentSales.length}
              </div>
              <div className="text-slate-400 text-sm">Sales Today</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {recentMints.length}
              </div>
              <div className="text-slate-400 text-sm">Mints Today</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {recentSealings.length}
              </div>
              <div className="text-slate-400 text-sm">Seals Today</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {Math.round(recentSales.reduce((sum, sale) => sum + parseInt(sale.price), 0) / recentSales.length)} GTT
              </div>
              <div className="text-slate-400 text-sm">Avg Price</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search capsules, users, or transactions..."
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
        </div>

        {/* Activity Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="sales" className="data-[state=active]:bg-purple-600">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Recent Sales
            </TabsTrigger>
            <TabsTrigger value="mints" className="data-[state=active]:bg-purple-600">
              <Zap className="w-4 h-4 mr-2" />
              New Mints
            </TabsTrigger>
            <TabsTrigger value="seals" className="data-[state=active]:bg-purple-600">
              <Shield className="w-4 h-4 mr-2" />
              Sealed Docs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            {recentSales.map((sale) => (
              <Card key={sale.id} className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={sale.avatar} alt="NFT" />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {sale.title[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold text-lg">{sale.title}</h3>
                        <Badge className={`${getCategoryColor(sale.category)} text-white`}>
                          {sale.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-slate-400">
                        <div>Buyer: <code className="text-slate-300">{sale.buyer}</code></div>
                        <div>Seller: <code className="text-slate-300">{sale.seller}</code></div>
                        <div>Score: <span className="text-green-400">{sale.griefScore}</span></div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-xl font-bold text-white">{sale.price}</span>
                      </div>
                      <div className="text-slate-400 text-sm">{sale.priceUSD}</div>
                      <div className="text-slate-500 text-xs mt-1">{sale.timestamp}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="mints" className="space-y-4">
            {recentMints.map((mint) => (
              <Card key={mint.id} className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Zap className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{mint.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div>Creator: <code className="text-slate-300">{mint.creator}</code></div>
                          <Badge className={`${getCategoryColor(mint.category)} text-white`}>
                            {mint.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">Score: {mint.griefScore}</div>
                      <div className="text-slate-500 text-sm">{mint.timestamp}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="seals" className="space-y-4">
            {recentSealings.map((seal) => (
              <Card key={seal.id} className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <Shield className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{seal.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div>Sealer: <code className="text-slate-300">{seal.sealer}</code></div>
                          <div>DocuSign ID: <code className="text-blue-400">{seal.docuSignId}</code></div>
                          <Badge className={`${getCategoryColor(seal.category)} text-white`}>
                            {seal.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">✓ Sealed</div>
                      <div className="text-slate-500 text-sm">{seal.timestamp}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}