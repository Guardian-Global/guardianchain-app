import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Zap,
  TrendingUp,
  Timer,
  Target,
  Flame,
  Rocket,
  DollarSign,
  Trophy,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function FlashTrading() {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour flash period
  const [flashVolume, setFlashVolume] = useState(15750);
  const [flashTraders, setFlashTraders] = useState(847);
  const [userAmount, setUserAmount] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
      setFlashVolume((prev) => prev + Math.random() * 500);
      setFlashTraders((prev) => prev + Math.floor(Math.random() * 3));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const multiplier =
    timeLeft > 1800 ? 15 : timeLeft > 900 ? 25 : timeLeft > 300 ? 50 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-orange-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Urgent Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Flame className="w-16 h-16 text-red-400 mr-4 animate-pulse" />
            <div>
              <h1 className="text-5xl font-bold text-red-400 mb-2">
                ⚡ FLASH TRADING FRENZY ⚡
              </h1>
              <p className="text-2xl text-orange-300">
                LIMITED 1-HOUR WINDOW - GTT MULTIPLIERS UP TO 100X!
              </p>
            </div>
            <Flame className="w-16 h-16 text-red-400 ml-4 animate-pulse" />
          </div>

          <div className="bg-red-600/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="text-4xl font-bold text-red-300 mb-2">
              {formatTime(timeLeft)} REMAINING
            </div>
            <div className="text-red-200">
              This flash trading window expires FOREVER in{" "}
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Flash Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-red-600/30 to-orange-600/30 border-red-500">
            <CardContent className="pt-6 text-center">
              <Timer className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{multiplier}X</div>
              <div className="text-red-300">Current Multiplier</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-600/30 to-yellow-600/30 border-orange-500">
            <CardContent className="pt-6 text-center">
              <DollarSign className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">
                ${flashVolume.toFixed(0)}
              </div>
              <div className="text-orange-300">Flash Volume</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-600/30 to-red-600/30 border-yellow-500">
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">
                {flashTraders}
              </div>
              <div className="text-yellow-300">Flash Traders</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600/30 to-red-600/30 border-purple-500">
            <CardContent className="pt-6 text-center">
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">$10K</div>
              <div className="text-purple-300">Top Prize</div>
            </CardContent>
          </Card>
        </div>

        {/* Flash Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-red-900/50 to-black border-red-500">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-6 h-6 mr-2 text-red-400" />
                Flash Trade GTT Now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-600/20 p-4 rounded-lg">
                <div className="text-red-300 text-sm mb-2">
                  ⚠️ URGENT: {multiplier}X multiplier active for{" "}
                  {formatTime(timeLeft)}
                </div>
                <div className="text-white">
                  Every $1 traded = {multiplier} GTT tokens + {multiplier}%
                  revenue share
                </div>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Flash Trade Amount (USD)
                </label>
                <Input
                  type="number"
                  placeholder="Min $50 for flash multiplier"
                  value={userAmount}
                  onChange={(e) => setUserAmount(e.target.value)}
                  className="bg-slate-800 border-red-500 text-white text-lg"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">GTT Tokens:</span>
                  <span className="text-green-400 font-bold">
                    {userAmount
                      ? (parseFloat(userAmount) * multiplier).toLocaleString()
                      : "0"}{" "}
                    GTT
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Revenue Share:</span>
                  <span className="text-green-400 font-bold">
                    {userAmount ? `${multiplier}% of platform fees` : "0%"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Flash Bonus:</span>
                  <span className="text-yellow-400 font-bold">
                    $
                    {userAmount
                      ? (
                          (parseFloat(userAmount) * 0.1 * multiplier) /
                          10
                        ).toFixed(2)
                      : "0"}{" "}
                    instant
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-xl font-bold py-6"
                disabled={!userAmount || parseFloat(userAmount) < 50}
              >
                <Flame className="w-6 h-6 mr-2" />
                FLASH TRADE NOW - {multiplier}X ACTIVE
              </Button>

              {(!userAmount || parseFloat(userAmount) < 50) && (
                <div className="text-red-400 text-sm text-center">
                  Minimum $50 required for flash multiplier
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flash Leaderboard */}
          <Card className="bg-gradient-to-br from-orange-900/50 to-black border-orange-500">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-orange-400" />
                Flash Trading Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    rank: 1,
                    address: "0x742d...9A6C",
                    volume: 8750,
                    reward: "$10,000",
                  },
                  {
                    rank: 2,
                    address: "0x959C...39db",
                    volume: 6200,
                    reward: "$5,000",
                  },
                  {
                    rank: 3,
                    address: "0x8c7C...0a73",
                    volume: 4800,
                    reward: "$2,500",
                  },
                  {
                    rank: 4,
                    address: "0x1234...5678",
                    volume: 3500,
                    reward: "$1,000",
                  },
                  {
                    rank: 5,
                    address: "0x9876...4321",
                    volume: 2900,
                    reward: "$500",
                  },
                ].map((trader) => (
                  <div
                    key={trader.rank}
                    className="flex items-center justify-between p-3 bg-orange-600/10 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          trader.rank === 1
                            ? "bg-yellow-500 text-black"
                            : trader.rank === 2
                              ? "bg-gray-400 text-black"
                              : trader.rank === 3
                                ? "bg-orange-600 text-white"
                                : "bg-slate-600 text-white"
                        }`}
                      >
                        {trader.rank}
                      </div>
                      <div>
                        <div className="text-white font-mono text-sm">
                          {trader.address}
                        </div>
                        <div className="text-orange-300 text-xs">
                          ${trader.volume.toLocaleString()} volume
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">
                        {trader.reward}
                      </div>
                      <div className="text-slate-400 text-xs">Flash Reward</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-red-600/20 rounded-lg">
                <div className="text-red-300 text-sm">
                  ⏰ Flash rewards paid instantly when timer expires
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgency Messaging */}
        <Card className="bg-gradient-to-r from-red-600/10 to-black border-red-500">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-red-300 mb-4">
              ⚠️ THIS IS YOUR ONLY CHANCE ⚠️
            </h3>
            <p className="text-xl text-white mb-6">
              Flash trading windows occur RANDOMLY and last only 1 hour. The
              next one could be weeks away. Don't miss {multiplier}X
              multipliers!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-600/20 p-4 rounded-lg">
                <Clock className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-white font-bold">EXPIRES IN</div>
                <div className="text-2xl text-red-300">
                  {formatTime(timeLeft)}
                </div>
              </div>
              <div className="bg-orange-600/20 p-4 rounded-lg">
                <Target className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-white font-bold">CURRENT MULTIPLIER</div>
                <div className="text-2xl text-orange-300">
                  {multiplier}X ACTIVE
                </div>
              </div>
              <div className="bg-yellow-600/20 p-4 rounded-lg">
                <Rocket className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-white font-bold">MAX REWARD</div>
                <div className="text-2xl text-yellow-300">$10,000</div>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-xl font-bold px-12 py-6"
            >
              <Flame className="w-6 h-6 mr-2" />
              TRADE NOW OR LOSE FOREVER
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
