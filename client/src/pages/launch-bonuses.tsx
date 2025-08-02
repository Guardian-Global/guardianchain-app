import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Gift,
  Zap,
  Users,
  TrendingUp,
  Trophy,
  Target,
  Crown,
  Rocket,
  Timer,
} from "lucide-react";

export default function LaunchBonuses() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  const [currentVolume, setCurrentVolume] = useState(12750);
  const [targetVolume] = useState(100000);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
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

    // Simulate volume growth
    const volumeTimer = setInterval(() => {
      setCurrentVolume((prev) => {
        const increase = Math.random() * 2000 + 500;
        return Math.min(targetVolume, prev + increase);
      });
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(volumeTimer);
    };
  }, [targetVolume]);

  useEffect(() => {
    // Calculate multiplier based on volume
    const progress = currentVolume / targetVolume;
    if (progress >= 1.0) setCurrentMultiplier(10.0);
    else if (progress >= 0.75) setCurrentMultiplier(5.0);
    else if (progress >= 0.5) setCurrentMultiplier(3.0);
    else if (progress >= 0.25) setCurrentMultiplier(2.0);
    else setCurrentMultiplier(1.0);
  }, [currentVolume, targetVolume]);

  const bonusTiers = [
    {
      volume: 25000,
      reward: "2x GTT Bonus",
      multiplier: 2.0,
      claimed: currentVolume >= 25000,
      icon: Zap,
    },
    {
      volume: 50000,
      reward: "3x GTT Bonus + NFT",
      multiplier: 3.0,
      claimed: currentVolume >= 50000,
      icon: Trophy,
    },
    {
      volume: 75000,
      reward: "5x GTT Bonus + Rare NFT",
      multiplier: 5.0,
      claimed: currentVolume >= 75000,
      icon: Crown,
    },
    {
      volume: 100000,
      reward: "10x GTT MEGA BONUS",
      multiplier: 10.0,
      claimed: currentVolume >= 100000,
      icon: Rocket,
    },
  ];

  const currentUsers = Math.floor(currentVolume / 50) + 47;
  const volumeProgress = (currentVolume / targetVolume) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Urgency Header */}
        <div className="text-center mb-12">
          <Badge className="bg-red-600 text-white text-lg px-6 py-2 mb-6 animate-pulse">
            🔥 LAUNCH DAY ONLY - EXPIRES IN {timeLeft.hours}h {timeLeft.minutes}
            m {timeLeft.seconds}s
          </Badge>

          <h1 className="text-6xl font-bold mb-6">
            <span className="text-yellow-400">$100K</span>
            <span className="text-white"> VOLUME</span>
            <span className="text-purple-400"> CHALLENGE</span>
          </h1>

          <p className="text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Help us reach $100K trading volume in 24 hours and everyone gets
            MASSIVE bonuses
          </p>

          {/* Live Progress */}
          <div className="bg-slate-800/50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Current Volume:</span>
              <span className="text-2xl font-bold text-green-400">
                ${currentVolume.toLocaleString()}
              </span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-6 mb-4">
              <div
                className="bg-gradient-to-r from-purple-600 to-green-500 h-6 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, volumeProgress)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-slate-400">
              <span>Start: $0</span>
              <span className="text-yellow-400">Target: $100K</span>
            </div>
          </div>
        </div>

        {/* Current Multiplier */}
        <div className="text-center mb-12">
          <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30 max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <Gift className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {currentMultiplier}x ACTIVE BONUS
                </div>
                <p className="text-white">
                  All trades and capsule rewards multiplied!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bonus Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {bonusTiers.map((tier, index) => (
            <Card
              key={index}
              className={`border-2 transition-all ${
                tier.claimed
                  ? "bg-green-500/20 border-green-500 scale-105"
                  : currentVolume >= tier.volume * 0.8
                    ? "bg-yellow-500/20 border-yellow-500 animate-pulse"
                    : "bg-slate-800/50 border-slate-600"
              }`}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <tier.icon
                    className={`w-8 h-8 ${tier.claimed ? "text-green-400" : "text-purple-400"}`}
                  />
                </div>
                <CardTitle className="text-lg text-white">
                  ${tier.volume.toLocaleString()}
                </CardTitle>
                {tier.claimed && (
                  <Badge className="bg-green-600 text-white">✓ UNLOCKED</Badge>
                )}
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-yellow-400 font-semibold mb-2">
                  {tier.reward}
                </div>
                <div className="text-slate-300 text-sm">
                  {tier.multiplier}x bonus on all activities
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Proof */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-600">
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {currentUsers}
              </div>
              <div className="text-slate-400">Active Traders</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                +{Math.floor(volumeProgress)}%
              </div>
              <div className="text-slate-400">Volume Growth</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600">
            <CardContent className="pt-6 text-center">
              <Timer className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {timeLeft.hours}:{timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <div className="text-slate-400">Time Remaining</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl"
            onClick={() => (window.location.href = "/create-capsule")}
          >
            <Target className="w-6 h-6 mr-2" />
            Create Capsule (Get {currentMultiplier}x Bonus)
          </Button>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
              onClick={() => (window.location.href = "/trade")}
            >
              Trade GTT Now
            </Button>

            <Button
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/10"
              onClick={() => (window.location.href = "/referrals")}
            >
              Invite Friends (+50% Bonus)
            </Button>
          </div>
        </div>

        {/* FOMO Footer */}
        <div className="mt-16 text-center">
          <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-6 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-red-400 mb-4">
              ⚠️ THIS OFFER EXPIRES IN {timeLeft.hours} HOURS
            </h3>
            <p className="text-slate-300">
              Once the 24-hour launch window closes, these massive multipliers
              disappear forever. The next chance for bonuses this big won't come
              for months.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
