import { useState } from "react";
import { BrandedText } from "@/components/BrandEnforcement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/lib/i18n";
import { 
  Globe, 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart3, 
  Rocket,
  Shield,
  CheckCircle,
  Clock,
  Target,
  ArrowUp,
  Star
} from "lucide-react";

// Major cryptocurrency exchanges for GTT token listing
const MAJOR_EXCHANGES = [
  { name: "Binance", volume: "$76B", status: "upcoming", region: "Global", tier: "Tier 1" },
  { name: "Coinbase", volume: "$28B", status: "upcoming", region: "US/EU", tier: "Tier 1" },
  { name: "Kraken", volume: "$12B", status: "upcoming", region: "Global", tier: "Tier 1" },
  { name: "Huobi", volume: "$8B", status: "upcoming", region: "Asia", tier: "Tier 1" },
  { name: "OKX", volume: "$15B", status: "upcoming", region: "Global", tier: "Tier 1" },
  { name: "Bybit", volume: "$9B", status: "upcoming", region: "Global", tier: "Tier 1" },
  { name: "Gate.io", volume: "$3B", status: "upcoming", region: "Global", tier: "Tier 2" },
  { name: "Bitget", volume: "$2.5B", status: "upcoming", region: "Global", tier: "Tier 2" },
  { name: "MEXC", volume: "$1.8B", status: "upcoming", region: "Global", tier: "Tier 2" },
  { name: "KuCoin", volume: "$4B", status: "upcoming", region: "Global", tier: "Tier 2" },
];

const LAUNCH_PHASES = [
  {
    phase: 1,
    title: "Smart Contract Deployment",
    description: "Deploy GTT token contracts on all major blockchains",
    status: "completed",
    networks: ["Ethereum", "Polygon", "BSC", "Arbitrum", "Base"],
    timeline: "January 2025"
  },
  {
    phase: 2,
    title: "Initial Exchange Listings",
    description: "List GTT on Tier 1 exchanges worldwide",
    status: "in-progress",
    networks: ["Binance", "Coinbase", "Kraken", "OKX"],
    timeline: "February 2025"
  },
  {
    phase: 3,
    title: "Global Expansion",
    description: "Expand to regional exchanges and DeFi protocols",
    status: "upcoming",
    networks: ["Regional Exchanges", "DEX Integration", "Cross-chain Bridges"],
    timeline: "March 2025"
  },
  {
    phase: 4,
    title: "Institutional Access",
    description: "Enable institutional trading and custody solutions",
    status: "upcoming",
    networks: ["Prime Brokers", "Custody Services", "Trading Desks"],
    timeline: "April 2025"
  }
];

const MARKET_PROJECTIONS = {
  initialMarketCap: "$50M",
  targetMarketCap: "$10B",
  expectedVolume: "$500M",
  totalSupply: "1,000,000,000 GTT",
  circulatingSupply: "250,000,000 GTT",
  stakingAPY: "25%",
  deflationary: "2% burn rate"
};

const REGIONAL_MARKETS = [
  { region: "North America", exchanges: 8, volume: "$45B", status: "Primary Focus" },
  { region: "Europe", exchanges: 12, volume: "$32B", status: "Primary Focus" },
  { region: "Asia Pacific", exchanges: 25, volume: "$68B", status: "Primary Focus" },
  { region: "Latin America", exchanges: 6, volume: "$8B", status: "Expansion" },
  { region: "Middle East", exchanges: 4, volume: "$12B", status: "Expansion" },
  { region: "Africa", exchanges: 3, volume: "$2B", status: "Future" },
];

export default function TokenLaunch() {
  const { t } = useTranslation();
  const [selectedPhase, setSelectedPhase] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mr-4">
              <Rocket className="text-white h-8 w-8" />
            </div>
            <BrandedText size="3xl" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            {t('launch.title')}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {t('launch.description')} - The ultimate utility token for decentralized truth verification, 
            targeting $10B market cap through global adoption.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="bg-green-900/50 text-green-300 border-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Smart Contracts Deployed
            </Badge>
            <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300 border-yellow-600">
              <Clock className="w-4 h-4 mr-1" />
              Exchange Applications Submitted
            </Badge>
            <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-purple-600">
              <Target className="w-4 h-4 mr-1" />
              $10B Target Market Cap
            </Badge>
          </div>
        </div>

        {/* Market Projections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Initial Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{MARKET_PROJECTIONS.initialMarketCap}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Target Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{MARKET_PROJECTIONS.targetMarketCap}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Expected Daily Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{MARKET_PROJECTIONS.expectedVolume}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Staking APY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">{MARKET_PROJECTIONS.stakingAPY}</div>
            </CardContent>
          </Card>
        </div>

        {/* Launch Phases */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Global Launch Roadmap</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {LAUNCH_PHASES.map((phase) => (
              <Card 
                key={phase.phase}
                className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:bg-slate-700/50 ${
                  selectedPhase === phase.phase ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedPhase(phase.phase)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={phase.status === 'completed' ? 'default' : phase.status === 'in-progress' ? 'secondary' : 'outline'}
                      className={`${
                        phase.status === 'completed' ? 'bg-green-900 text-green-300' :
                        phase.status === 'in-progress' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-slate-900 text-slate-300'
                      }`}
                    >
                      Phase {phase.phase}
                    </Badge>
                    {phase.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {phase.status === 'in-progress' && <Clock className="w-5 h-5 text-yellow-400" />}
                    {phase.status === 'upcoming' && <Target className="w-5 h-5 text-slate-400" />}
                  </div>
                  <CardTitle className="text-lg">{phase.title}</CardTitle>
                  <CardDescription>{phase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-400">Timeline: {phase.timeline}</div>
                    <div className="flex flex-wrap gap-1">
                      {phase.networks.slice(0, 2).map((network) => (
                        <Badge key={network} variant="outline" className="text-xs">
                          {network}
                        </Badge>
                      ))}
                      {phase.networks.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{phase.networks.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Major Exchanges */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('launch.exchanges')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MAJOR_EXCHANGES.map((exchange) => (
              <Card key={exchange.name} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{exchange.name}</CardTitle>
                    <Badge 
                      variant={exchange.tier === 'Tier 1' ? 'default' : 'secondary'}
                      className={exchange.tier === 'Tier 1' ? 'bg-purple-900 text-purple-300' : 'bg-slate-900 text-slate-300'}
                    >
                      {exchange.tier}
                    </Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4" />
                      <span>24h Volume: {exchange.volume}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">{exchange.region}</div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        exchange.status === 'upcoming' ? 'border-yellow-600 text-yellow-400' :
                        exchange.status === 'submitted' ? 'border-blue-600 text-blue-400' :
                        'border-green-600 text-green-400'
                      }`}
                    >
                      {exchange.status === 'upcoming' ? 'Upcoming' : 
                       exchange.status === 'submitted' ? 'Submitted' : 'Live'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Regional Markets */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('launch.worldwide')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGIONAL_MARKETS.map((market) => (
              <Card key={market.region} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-purple-400" />
                    {market.region}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Exchanges</span>
                    <span className="font-semibold">{market.exchanges}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Market Volume</span>
                    <span className="font-semibold">{market.volume}</span>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`w-full justify-center ${
                      market.status === 'Primary Focus' ? 'border-green-600 text-green-400' :
                      market.status === 'Expansion' ? 'border-yellow-600 text-yellow-400' :
                      'border-slate-600 text-slate-400'
                    }`}
                  >
                    {market.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Token Economics */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">GTT Token Economics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-6 h-6 mr-2 text-green-400" />
                  Supply & Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Supply</span>
                  <span className="font-semibold">{MARKET_PROJECTIONS.totalSupply}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Circulating Supply</span>
                  <span className="font-semibold">{MARKET_PROJECTIONS.circulatingSupply}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Burn Rate</span>
                  <span className="font-semibold text-red-400">{MARKET_PROJECTIONS.deflationary}</span>
                </div>
                <Progress value={25} className="w-full" />
                <div className="text-sm text-slate-400">25% of total supply in circulation</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
                  Utility & Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Staking APY</span>
                  <span className="font-semibold text-green-400">{MARKET_PROJECTIONS.stakingAPY}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Truth Verification</span>
                  <span className="font-semibold">25-500 GTT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Governance Voting</span>
                  <span className="font-semibold">Min 1,000 GTT</span>
                </div>
                <div className="text-sm text-slate-400">
                  Revenue-backed tokenomics with deflationary mechanisms ensure long-term value appreciation.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-900/50 to-green-900/50 border-purple-600">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center justify-center">
                <Star className="w-6 h-6 mr-2 text-yellow-400" />
                Join the Global GTT Launch
              </CardTitle>
              <CardDescription className="text-lg">
                Be part of the world's first decentralized truth verification economy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Rocket className="w-5 h-5 mr-2" />
                  Early Access Registration
                </Button>
                <Button size="lg" variant="outline" className="border-green-600 text-green-400 hover:bg-green-600/10">
                  <Shield className="w-5 h-5 mr-2" />
                  Whitepaper Download
                </Button>
              </div>
              <div className="mt-6 text-sm text-slate-300">
                Expected launch: Q1 2025 • Target exchanges: 50+ worldwide • Projected market cap: $10B+
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}