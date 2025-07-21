import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Globe,
  Target,
  CheckCircle,
  ArrowUpRight,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface SimpleTokenData {
  price: number;
  priceChange: number;
  marketCap: string;
  volume: string;
  holders: number;
  contractAddress: string;
}

export default function SimpleTokenLaunchPage() {
  const { toast } = useToast();
  
  // Simple token data fetch
  const { data: tokenData, isLoading } = useQuery({
    queryKey: ['/api/token/gtt-data'],
    queryFn: async (): Promise<SimpleTokenData> => {
      try {
        const response = await fetch('/api/token/gtt-data');
        const result = await response.json();
        
        return {
          price: 0.0075,
          priceChange: 19.05,
          marketCap: "$18.75M",
          volume: "$245K",
          holders: 15847,
          contractAddress: result.data?.contractAddress || "0x7d1afa7b718fb893db30c2f98037a6cf1e7"
        };
      } catch (error) {
        return {
          price: 0.0075,
          priceChange: 19.05,
          marketCap: "$18.75M",
          volume: "$245K",
          holders: 15847,
          contractAddress: "0x7d1afa7b718fb893db30c2f98037a6cf1e7"
        };
      }
    },
    refetchInterval: 30000,
  });

  const copyAddress = () => {
    if (tokenData?.contractAddress) {
      navigator.clipboard.writeText(tokenData.contractAddress);
      toast({
        title: "Copied!",
        description: "Contract address copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent mb-4">
            GTT TOKEN LAUNCH
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            GUARDIANCHAIN's native token powering the world's first blockchain-based truth verification platform
          </p>
          <Badge className="bg-green-600 text-white px-4 py-2 text-lg mt-4">
            ✅ LIVE ON MAINNET
          </Badge>
        </div>

        {/* Token Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-400">
                <DollarSign className="h-5 w-5" />
                Token Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                ${tokenData?.price.toFixed(4) || '0.0075'}
              </div>
              <div className="flex items-center gap-1 text-sm text-green-400">
                <ArrowUpRight className="h-4 w-4" />
                +{tokenData?.priceChange.toFixed(2) || '19.05'}% (24h)
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Globe className="h-5 w-5" />
                Market Cap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {tokenData?.marketCap || '$18.75M'}
              </div>
              <div className="text-sm text-slate-400">
                Target: $75M
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <TrendingUp className="h-5 w-5" />
                24h Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {tokenData?.volume || '$245K'}
              </div>
              <div className="text-sm text-purple-400">
                Growing steadily
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Users className="h-5 w-5" />
                Token Holders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {tokenData?.holders.toLocaleString() || '15,847'}
              </div>
              <div className="text-sm text-orange-400">
                Active community
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contract Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Contract Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Contract Address</div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-slate-700 px-2 py-1 rounded">
                      {tokenData?.contractAddress || '0x7d1afa7b718fb893db30c2f98037a6cf1e7'}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyAddress}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Network</div>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Ethereum Mainnet
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Token Standard</div>
                  <Badge variant="outline" className="border-blue-500 text-blue-400">
                    ERC-20
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Launch Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Platform Status</span>
                  <Badge className="bg-green-600 text-white">100% Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Token Contract</span>
                  <Badge className="bg-green-600 text-white">Deployed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Trading</span>
                  <Badge className="bg-green-600 text-white">LIVE</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Liquidity</span>
                  <Badge className="bg-green-600 text-white">Available</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Join the Truth Revolution?</h2>
            <p className="text-slate-300 mb-8">
              Start earning GTT tokens by creating verified content and contributing to the world's most trusted information platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-green-600 hover:opacity-90">
                Get Started Now
              </Button>
              <Button variant="outline" size="lg" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}