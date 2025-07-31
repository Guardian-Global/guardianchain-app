import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Timer,
  Gift
} from "lucide-react";

export default function TradeCompetition() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 12
  });

  const [leaderboard] = useState([
    { rank: 1, wallet: "0x742d...9A6C", volume: 15420, prize: "$2,500", verified: true },
    { rank: 2, wallet: "0x8c7C...F0a73", volume: 12180, prize: "$1,500", verified: false },
    { rank: 3, wallet: "0x959C...239db", volume: 9750, prize: "$1,000", verified: false },
    { rank: 4, wallet: "0x1234...5678", volume: 7200, prize: "$500", verified: false },
    { rank: 5, wallet: "0x9876...4321", volume: 5800, prize: "$250", verified: false },
  ]);

  const [currentVolume] = useState(67340);
  const [myRank] = useState(12);
  const [myVolume] = useState(2450);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalPrizePool = 25000;
  const progressToNext = ((100000 - currentVolume) / 100000) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Competition Header */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-lg px-6 py-2 mb-6 animate-pulse">
            🏆 LIVE TRADING COMPETITION
          </Badge>
          
          <h1 className="text-6xl font-bold mb-6">
            <span className="text-yellow-400">$25,000</span>
            <span className="text-white"> PRIZE POOL</span>
          </h1>
          
          <div className="flex justify-center items-center gap-8 mb-8">
            <div className="text-center">
              <Timer className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {timeLeft.hours}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-slate-400">Time Left</div>
            </div>
            
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">${currentVolume.toLocaleString()}</div>
              <div className="text-slate-400">Total Volume</div>
            </div>
            
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{leaderboard.length + 147}</div>
              <div className="text-slate-400">Competitors</div>
            </div>
          </div>
        </div>

        {/* Prize Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          <Card className="bg-gradient-to-b from-yellow-600/20 to-yellow-800/20 border-yellow-500">
            <CardContent className="pt-6 text-center">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-yellow-400">1st Place</div>
              <div className="text-2xl font-bold text-white">$2,500</div>
              <div className="text-sm text-slate-300">+ Exclusive NFT</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-b from-gray-400/20 to-gray-600/20 border-gray-400">
            <CardContent className="pt-6 text-center">
              <Medal className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-400">2nd Place</div>
              <div className="text-2xl font-bold text-white">$1,500</div>
              <div className="text-sm text-slate-300">+ Premium Badge</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-b from-orange-600/20 to-orange-800/20 border-orange-500">
            <CardContent className="pt-6 text-center">
              <Trophy className="w-12 h-12 text-orange-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-orange-400">3rd Place</div>
              <div className="text-2xl font-bold text-white">$1,000</div>
              <div className="text-sm text-slate-300">+ VIP Access</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-600">
            <CardContent className="pt-6 text-center">
              <Gift className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-purple-400">4th-10th</div>
              <div className="text-2xl font-bold text-white">$500</div>
              <div className="text-sm text-slate-300">Each Winner</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-600">
            <CardContent className="pt-6 text-center">
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-blue-400">11th-50th</div>
              <div className="text-2xl font-bold text-white">$250</div>
              <div className="text-sm text-slate-300">Each Winner</div>
            </CardContent>
          </Card>
        </div>

        {/* My Position */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500 mb-8">
          <CardHeader>
            <CardTitle className="text-center text-white">Your Current Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400">#{myRank}</div>
                <div className="text-slate-400">Current Rank</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">${myVolume}</div>
                <div className="text-slate-400">Your Volume</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">$250</div>
                <div className="text-slate-400">Potential Prize</div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
                onClick={() => window.location.href = '/trade'}
              >
                <Target className="w-5 h-5 mr-2" />
                Trade More to Climb Rankings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Leaderboard */}
        <Card className="bg-slate-800/50 border-slate-600 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
              Live Leaderboard
              <Badge className="ml-auto bg-green-600">LIVE</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((trader) => (
                <div 
                  key={trader.rank}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    trader.rank === 1 ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30' :
                    trader.rank === 2 ? 'bg-gradient-to-r from-gray-400/20 to-gray-600/20 border border-gray-400/30' :
                    trader.rank === 3 ? 'bg-gradient-to-r from-orange-600/20 to-orange-800/20 border border-orange-500/30' :
                    'bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${
                      trader.rank === 1 ? 'text-yellow-400' :
                      trader.rank === 2 ? 'text-gray-400' :
                      trader.rank === 3 ? 'text-orange-400' :
                      'text-white'
                    }`}>
                      #{trader.rank}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono">{trader.wallet}</span>
                        {trader.verified && (
                          <Badge className="bg-blue-600 text-white text-xs">Verified</Badge>
                        )}
                      </div>
                      <div className="text-slate-400 text-sm">
                        Volume: ${trader.volume.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{trader.prize}</div>
                    <div className="text-slate-400 text-sm">Prize</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Competition Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Competition Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300">
              <div>• Competition ends in {timeLeft.hours} hours {timeLeft.minutes} minutes</div>
              <div>• Only GTT trading volume counts</div>
              <div>• Minimum $100 volume to qualify</div>
              <div>• Wash trading results in disqualification</div>
              <div>• Prizes paid in USDC within 24 hours</div>
              <div>• Leaderboard updates every 30 seconds</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Bonus Multipliers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300">
              <div>• 2x volume for verified accounts ✓</div>
              <div>• 1.5x volume for capsule creators</div>
              <div>• 1.25x volume for social media shares</div>
              <div>• Extra 10% for referrals</div>
              <div>• Stack multipliers for maximum boost</div>
              <div>• New trader bonus: +$500 volume credit</div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}