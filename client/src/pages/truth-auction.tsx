import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Flame, 
  Gavel, 
  Eye, 
  Trophy,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Star,
  Shield
} from 'lucide-react';

export default function TruthAuctionPage() {
  const liveAuctions = [
    {
      id: "CORP-001",
      title: "Fortune 500 Financial Misconduct",
      description: "Verified evidence of accounting fraud with supporting documentation",
      currentBid: "12.5",
      bidders: 47,
      timeLeft: "2h 34m",
      heatIndex: 95,
      category: "Corporate",
      verified: true
    },
    {
      id: "GOV-003", 
      title: "Government Contract Irregularities",
      description: "Insider documentation of procurement process violations",
      currentBid: "8.7",
      bidders: 23,
      timeLeft: "5h 12m", 
      heatIndex: 78,
      category: "Government",
      verified: true
    },
    {
      id: "SCI-007",
      title: "Suppressed Climate Research Data",
      description: "Peer-reviewed study data withheld from public publication",
      currentBid: "15.2",
      bidders: 67,
      timeLeft: "1h 45m",
      heatIndex: 89,
      category: "Scientific",
      verified: true
    }
  ];

  const auctionFeatures = [
    {
      icon: Gavel,
      title: "Open Auctions for Truth Capsules",
      description: "Transparent bidding on verified, sealed disclosures",
      color: "yellow"
    },
    {
      icon: Eye,
      title: "Public Oversight and Transparency", 
      description: "Community verification and open bidding process",
      color: "blue"
    },
    {
      icon: Flame,
      title: "Tokenized Heat Index (GTT-backed)",
      description: "Real-time impact scoring based on community engagement",
      color: "red"
    },
    {
      icon: Shield,
      title: "Verified Truth Protection",
      description: "Anti-suppression guarantees and whistleblower safety",
      color: "green"
    }
  ];

  const topBidders = [
    { rank: 1, address: "0x742d...9A6C", bids: 23, won: 12, reputation: 98 },
    { rank: 2, address: "0x8c7C...F0a73", bids: 19, won: 8, reputation: 94 },
    { rank: 3, address: "0x959C...239db", bids: 16, won: 7, reputation: 87 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔥 TRUTH CAPSULE AUCTION
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Auction one-of-one capsules containing verified, sealed disclosures. Truth has value — let the public bid for access.
          </p>
          <Badge className="bg-red-600/20 text-red-400 text-lg px-4 py-2">
            LIVE BIDDING ACTIVE
          </Badge>
        </div>

        {/* Live Auctions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            🔴 Live Truth Auctions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {liveAuctions.map((auction, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-600 hover:border-red-500/50 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-red-600/20 text-red-400">{auction.id}</Badge>
                    <div className="flex items-center space-x-1">
                      {auction.verified && <Shield className="h-4 w-4 text-green-400" />}
                      <Badge className="bg-yellow-600/20 text-yellow-400">
                        {auction.heatIndex}🔥
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">{auction.title}</CardTitle>
                  <p className="text-slate-300 text-sm">{auction.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Current Bid:</span>
                      <span className="text-green-400 font-bold text-lg">{auction.currentBid} GTT</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Bidders:</span>
                      <span className="text-blue-400 font-semibold">{auction.bidders}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Time Left:</span>
                      <span className="text-yellow-400 font-semibold">{auction.timeLeft}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Category:</span>
                      <Badge className={`
                        ${auction.category === 'Corporate' ? 'bg-blue-600/20 text-blue-400' : ''}
                        ${auction.category === 'Government' ? 'bg-purple-600/20 text-purple-400' : ''}
                        ${auction.category === 'Scientific' ? 'bg-green-600/20 text-green-400' : ''}
                      `}>
                        {auction.category}
                      </Badge>
                    </div>
                    
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <Gavel className="h-4 w-4 mr-2" />
                      Place Bid
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Auction Features */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              Auction Mechanics & Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {auctionFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      feature.color === 'yellow' ? 'bg-yellow-600/20' :
                      feature.color === 'blue' ? 'bg-blue-600/20' :
                      feature.color === 'red' ? 'bg-red-600/20' :
                      'bg-green-600/20'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        feature.color === 'yellow' ? 'text-yellow-400' :
                        feature.color === 'blue' ? 'text-blue-400' :
                        feature.color === 'red' ? 'text-red-400' :
                        'text-green-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                      <p className="text-slate-300">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Auction Stats & Top Bidders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-green-400" />
                <span>Auction Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Volume:</span>
                  <span className="text-green-400 font-bold">847.3 GTT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Active Auctions:</span>
                  <span className="text-blue-400 font-bold">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Avg Heat Index:</span>
                  <span className="text-yellow-400 font-bold">84🔥</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Success Rate:</span>
                  <span className="text-purple-400 font-bold">94.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-3">
                <Trophy className="h-6 w-6 text-yellow-400" />
                <span>Top Bidders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBidders.map((bidder, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        bidder.rank === 1 ? 'bg-yellow-600/20 text-yellow-400' :
                        bidder.rank === 2 ? 'bg-gray-600/20 text-gray-400' :
                        'bg-orange-600/20 text-orange-400'
                      }`}>
                        {bidder.rank}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{bidder.address}</p>
                        <p className="text-slate-400 text-sm">{bidder.bids} bids, {bidder.won} won</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600/20 text-green-400">
                      {bidder.reputation}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-500/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Submit Your Truth for Auction
            </h2>
            <p className="text-slate-300 mb-6">
              Stake against suppression, unlock redemptive donations, or let the public bid for access to verified truth
            </p>
            
            <div className="flex justify-center space-x-4 mb-6">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                onClick={() => window.location.href = '/create-capsule'}
              >
                <Flame className="h-5 w-5 mr-2" />
                Submit a Capsule for Auction
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-blue-500 text-blue-400 hover:bg-blue-600/20"
                onClick={() => window.location.href = '/explore'}
              >
                <Eye className="h-5 w-5 mr-2" />
                Browse Live Auctions
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-bold">3% Platform Fee</p>
                <p className="text-slate-400 text-sm">Revenue shared with GTT stakers</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <p className="text-blue-400 font-bold">Community Verified</p>
                <p className="text-slate-400 text-sm">Truth validation by experts</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <Clock className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <p className="text-purple-400 font-bold">72 Hour Auctions</p>
                <p className="text-slate-400 text-sm">Maximum exposure time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}