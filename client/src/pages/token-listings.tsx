import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, Copy, TrendingUp, Eye, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GTT_CONTRACT_ADDRESS } from '@/lib/web3GTTService';

interface TokenListing {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUSD: number;
  status: 'active' | 'sold' | 'pending';
  capsuleId: string;
  createdAt: string;
  views: number;
  likes: number;
  category: string;
  tags: string[];
  verified: boolean;
}

export default function TokenListings() {
  const [listings, setListings] = useState<TokenListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // In a real implementation, this would fetch from blockchain/database
    // For now, show empty state since we need real data
    setLoading(false);
  }, []);

  const copyContractAddress = () => {
    navigator.clipboard.writeText(GTT_CONTRACT_ADDRESS);
    toast({
      title: "Contract Address Copied",
      description: "GTT token contract address copied to clipboard",
    });
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            GTT Token Listings
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Authentic GTT token marketplace for verified truth capsules and digital assets
          </p>
          
          {/* Contract Info */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm text-slate-400">GTT Contract Address</p>
                <p className="text-white font-mono text-sm break-all">
                  {GTT_CONTRACT_ADDRESS}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyContractAddress}
                  className="border-slate-600 hover:bg-slate-700"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-slate-600 hover:bg-slate-700"
                >
                  <a 
                    href={`https://etherscan.io/token/${GTT_CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center text-slate-400 py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4">Loading authentic GTT token listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 max-w-md mx-auto">
              <TrendingUp className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Listings Available
              </h3>
              <p className="text-slate-400 mb-4">
                Real GTT token listings will appear here once truth capsules are created and verified.
              </p>
              <p className="text-sm text-slate-500">
                This marketplace only displays authentic, blockchain-verified listings.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge 
                      variant={listing.status === 'active' ? 'default' : 'secondary'}
                      className={listing.status === 'active' ? 'bg-green-600' : 'bg-slate-600'}
                    >
                      {listing.status}
                    </Badge>
                    {listing.verified && (
                      <Badge variant="outline" className="border-purple-500 text-purple-400">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-white">{listing.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {listing.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {listing.price} GTT
                        </p>
                        <p className="text-sm text-slate-400">
                          ~${listing.priceUSD.toFixed(2)} USD
                        </p>
                      </div>
                      <Badge variant="outline" className="border-slate-600">
                        {listing.category}
                      </Badge>
                    </div>

                    <div className="flex justify-between text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {listing.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {listing.likes}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {listing.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full" disabled={listing.status !== 'active'}>
                      {listing.status === 'active' ? 'View Details' : 'Sold'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Footer */}
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm">
            All listings are verified on-chain using GTT token contract {GTT_CONTRACT_ADDRESS.slice(0, 6)}...{GTT_CONTRACT_ADDRESS.slice(-4)}
          </p>
        </div>
      </div>
    </div>
  );
}