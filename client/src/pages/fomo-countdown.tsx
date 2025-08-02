import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Flame,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  Zap,
  Target,
  Trophy,
  Timer,
  Rocket,
  Crown,
} from "lucide-react";

export default function FOMOCountdown() {
  const [timeLeft, setTimeLeft] = useState(86400); // 24 hours
  const [priceIncrease, setPriceIncrease] = useState(0);
  const [buyersCount, setBuyersCount] = useState(1247);
  const [volumeTarget, setVolumeTarget] = useState(87500);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(0, prev - 1);
        // Simulate increasing urgency
        if (newTime < 3600) {
          // Last hour
          setPriceIncrease(25);
        } else if (newTime < 10800) {
          // Last 3 hours
          setPriceIncrease(15);
        } else if (newTime < 21600) {
          // Last 6 hours
          setPriceIncrease(10);
        } else {
          setPriceIncrease(5);
        }
        return newTime;
      });

      setBuyersCount((prev) => prev + Math.floor(Math.random() * 5));
      setVolumeTarget((prev) => prev + Math.random() * 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const urgencyLevel =
    timeLeft < 3600
      ? "CRITICAL"
      : timeLeft < 10800
        ? "HIGH"
        : timeLeft < 21600
          ? "MEDIUM"
          : "LOW";
  const urgencyColor =
    urgencyLevel === "CRITICAL"
      ? "red"
      : urgencyLevel === "HIGH"
        ? "orange"
        : urgencyLevel === "MEDIUM"
          ? "yellow"
          : "green";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-${urgencyColor}-900 via-black to-red-900 text-white`}
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Critical Timer */}
        <div className="text-center mb-8">
          <div className="bg-red-600/20 border border-red-500 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-red-400 mr-3 animate-pulse" />
              <div>
                <h1 className="text-5xl font-bold text-red-400 mb-2">
                  ⚠️ FINAL COUNTDOWN ⚠️
                </h1>
                <p className="text-2xl text-red-300">
                  GTT PRICE LOCKS IN {formatTime(timeLeft)}
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-400 ml-3 animate-pulse" />
            </div>

            <div className="text-6xl font-bold text-red-300 mb-4">
              {formatTime(timeLeft)}
            </div>

            <div className="text-red-200 text-xl">
              After this timer expires, GTT price increases {priceIncrease}%
              PERMANENTLY
            </div>
          </div>
        </div>

        {/* Urgency Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card
            className={`bg-gradient-to-r from-${urgencyColor}-600/30 to-red-600/30 border-${urgencyColor}-500`}
          >
            <CardContent className="pt-6 text-center">
              <Clock
                className={`w-8 h-8 text-${urgencyColor}-400 mx-auto mb-2`}
              />
              <div className="text-3xl font-bold text-white">
                {urgencyLevel}
              </div>
              <div className={`text-${urgencyColor}-300`}>Urgency Level</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-600/30 to-orange-600/30 border-red-500">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">
                +{priceIncrease}%
              </div>
              <div className="text-red-300">Price Increase</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-600/30 to-yellow-600/30 border-orange-500">
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">
                {buyersCount.toLocaleString()}
              </div>
              <div className="text-orange-300">Panic Buyers</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-600/30 to-green-600/30 border-yellow-500">
            <CardContent className="pt-6 text-center">
              <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">
                ${volumeTarget.toFixed(0)}K
              </div>
              <div className="text-yellow-300">FOMO Volume</div>
            </CardContent>
          </Card>
        </div>

        {/* FOMO Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-red-900/50 to-black border-red-500">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Flame className="w-6 h-6 mr-2 text-red-400" />
                FOMO Price Lock Warning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-600/20 p-4 rounded-lg">
                <div className="text-red-300 font-bold mb-2">
                  ⚠️ CRITICAL: Only {formatTime(timeLeft)} left at current price
                </div>
                <div className="text-white">
                  After timer expires, GTT price increases {priceIncrease}% and
                  locks for 6 months minimum
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Current Price:</span>
                  <span className="text-green-400 font-bold">$0.0075</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">
                    Price in {formatTime(timeLeft)}:
                  </span>
                  <span className="text-red-400 font-bold">
                    ${(0.0075 * (1 + priceIncrease / 100)).toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">You save per 1000 GTT:</span>
                  <span className="text-yellow-400 font-bold">
                    ${(0.0075 * (priceIncrease / 100) * 1000).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-xl font-bold py-6"
              >
                <Zap className="w-6 h-6 mr-2" />
                BUY NOW - SAVE $
                {(0.0075 * (priceIncrease / 100) * 1000).toFixed(2)}
              </Button>
            </CardContent>
          </Card>

          {/* Live FOMO Feed */}
          <Card className="bg-gradient-to-br from-orange-900/50 to-black border-orange-500">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-6 h-6 mr-2 text-orange-400" />
                Live FOMO Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    user: "0x742d...9A6C",
                    amount: "50,000 GTT",
                    saved: "$187.50",
                    time: "2 sec ago",
                  },
                  {
                    user: "0x959C...39db",
                    amount: "25,000 GTT",
                    saved: "$93.75",
                    time: "8 sec ago",
                  },
                  {
                    user: "0x8c7C...0a73",
                    amount: "100,000 GTT",
                    saved: "$375.00",
                    time: "15 sec ago",
                  },
                  {
                    user: "0x1234...5678",
                    amount: "75,000 GTT",
                    saved: "$281.25",
                    time: "23 sec ago",
                  },
                  {
                    user: "0x9876...4321",
                    amount: "30,000 GTT",
                    saved: "$112.50",
                    time: "31 sec ago",
                  },
                ].map((purchase, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-orange-600/10 rounded-lg"
                  >
                    <div>
                      <div className="text-white font-mono text-sm">
                        {purchase.user}
                      </div>
                      <div className="text-orange-300 text-xs">
                        Bought {purchase.amount}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">
                        Saved {purchase.saved}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {purchase.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-red-600/20 rounded-lg">
                <div className="text-red-300 text-sm flex items-center">
                  <Timer className="w-4 h-4 mr-1" />
                  {buyersCount} people bought GTT in last hour to avoid price
                  increase
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Warning */}
        <Card className="bg-gradient-to-r from-red-600/10 to-black border-red-500">
          <CardContent className="pt-6 text-center">
            <Crown className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-4xl font-bold text-red-300 mb-4">
              🚨 LAST CHANCE WARNING 🚨
            </h3>
            <p className="text-2xl text-white mb-6">
              This is mathematically your FINAL OPPORTUNITY to buy GTT at
              $0.0075
            </p>
            <div className="bg-red-600/20 p-6 rounded-lg mb-6">
              <div className="text-3xl font-bold text-red-300 mb-2">
                TIMER EXPIRES IN {formatTime(timeLeft)}
              </div>
              <div className="text-white text-lg">
                After expiry: +{priceIncrease}% price increase locks for minimum
                6 months
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-600/20 p-4 rounded-lg">
                <Rocket className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-white font-bold">FINAL PRICE</div>
                <div className="text-2xl text-red-300">$0.0075</div>
              </div>
              <div className="bg-orange-600/20 p-4 rounded-lg">
                <Target className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-white font-bold">NEXT PRICE</div>
                <div className="text-2xl text-orange-300">
                  ${(0.0075 * (1 + priceIncrease / 100)).toFixed(4)}
                </div>
              </div>
              <div className="bg-yellow-600/20 p-4 rounded-lg">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-white font-bold">YOUR SAVINGS</div>
                <div className="text-2xl text-yellow-300">
                  {priceIncrease}% OFF
                </div>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-2xl font-bold px-16 py-8"
            >
              <Flame className="w-8 h-8 mr-3" />
              BUY BEFORE {formatTime(timeLeft)} OR PAY {priceIncrease}% MORE
              FOREVER
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
