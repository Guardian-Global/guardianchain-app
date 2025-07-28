import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Gift, Zap, Crown, Star, Coins } from "lucide-react";
import { motion } from "framer-motion";

export default function GamifiedBlockchainRewardsSystem() {
  const userLevel = 7;
  const currentXP = 2850;
  const nextLevelXP = 3000;
  const totalGTT = 1247;

  const dailyTasks = [
    {
      task: "Verify 3 truth capsules",
      reward: "25 GTT",
      progress: 100,
      completed: true,
    },
    {
      task: "Share GTT token page",
      reward: "10 GTT",
      progress: 100,
      completed: true,
    },
    {
      task: "Join 1 DAO vote",
      reward: "15 GTT",
      progress: 0,
      completed: false,
    },
    {
      task: "Stake 100 GTT tokens",
      reward: "50 GTT",
      progress: 75,
      completed: false,
    },
  ];

  const weeklyRewards = [
    { rank: 1, user: "TruthSeeker92", gtt: 500, badge: "🥇" },
    { rank: 2, user: "VerifyMaster", gtt: 350, badge: "🥈" },
    { rank: 3, user: "ChainGuardian", gtt: 250, badge: "🥉" },
    { rank: 4, user: "You", gtt: 180, badge: "🏆" },
  ];

  const achievements = [
    {
      name: "Truth Pioneer",
      description: "Verified 100 capsules",
      icon: "🔍",
      rarity: "Epic",
      unlocked: true,
    },
    {
      name: "GTT Collector",
      description: "Earned 1000 GTT",
      icon: "💎",
      rarity: "Rare",
      unlocked: true,
    },
    {
      name: "DAO Participant",
      description: "Voted 50 times",
      icon: "🗳️",
      rarity: "Common",
      unlocked: false,
    },
    {
      name: "Staking Master",
      description: "Staked for 30 days",
      icon: "⏰",
      rarity: "Legendary",
      unlocked: false,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "text-gray-400 bg-gray-500/20";
      case "Rare":
        return "text-blue-400 bg-blue-500/20";
      case "Epic":
        return "text-purple-400 bg-purple-500/20";
      case "Legendary":
        return "text-yellow-400 bg-yellow-500/20";
      default:
        return "text-slate-400 bg-slate-500/20";
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Gamified Rewards System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Player Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto" />
              <div className="text-2xl font-bold text-yellow-400">
                Level {userLevel}
              </div>
              <div className="text-sm text-slate-400">Truth Guardian</div>
            </div>

            <div className="text-center space-y-2">
              <Star className="w-8 h-8 text-blue-400 mx-auto" />
              <div className="text-2xl font-bold text-blue-400">
                {currentXP.toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">XP Points</div>
            </div>

            <div className="text-center space-y-2">
              <Coins className="w-8 h-8 text-green-400 mx-auto" />
              <div className="text-2xl font-bold text-green-400">
                {totalGTT.toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">GTT Earned</div>
            </div>

            <div className="text-center space-y-2">
              <Gift className="w-8 h-8 text-purple-400 mx-auto" />
              <div className="text-2xl font-bold text-purple-400">4/12</div>
              <div className="text-sm text-slate-400">Achievements</div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Level Progress</span>
              <span className="text-sm text-slate-400">
                {currentXP}/{nextLevelXP} XP
              </span>
            </div>
            <Progress value={(currentXP / nextLevelXP) * 100} className="h-3" />
            <p className="text-sm text-slate-400">
              {nextLevelXP - currentXP} XP needed for Level {userLevel + 1}
            </p>
          </div>

          {/* Daily Tasks */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-300">Daily Tasks</h4>
            <div className="space-y-3">
              {dailyTasks.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{task.task}</span>
                    <Badge
                      className={
                        task.completed
                          ? "bg-green-500/20 text-green-400"
                          : "bg-purple-500/20 text-purple-400"
                      }
                    >
                      {task.reward}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Progress value={task.progress} className="h-2" />
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">
                        {task.progress}% Complete
                      </span>
                      {task.completed && (
                        <span className="text-green-400">✓ Claimed</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weekly Leaderboard */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-300">Weekly Leaderboard</h4>
            <div className="space-y-2">
              {weeklyRewards.map((entry, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    entry.user === "You"
                      ? "bg-purple-500/20 border border-purple-500/30"
                      : "bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{entry.badge}</span>
                    <div>
                      <div
                        className={`font-semibold ${
                          entry.user === "You"
                            ? "text-purple-400"
                            : "text-slate-300"
                        }`}
                      >
                        #{entry.rank} {entry.user}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    {entry.gtt} GTT
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-300">
              Achievement Gallery
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    achievement.unlocked
                      ? "border-yellow-500/30 bg-yellow-500/10"
                      : "border-slate-600 bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-2xl ${
                        achievement.unlocked ? "" : "grayscale opacity-50"
                      }`}
                    >
                      {achievement.icon}
                    </span>
                    <div className="flex-1">
                      <div
                        className={`font-semibold ${
                          achievement.unlocked
                            ? "text-yellow-400"
                            : "text-slate-400"
                        }`}
                      >
                        {achievement.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {achievement.description}
                      </div>
                    </div>
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="bg-green-600 hover:bg-green-700 text-white flex-1">
              <Zap className="w-4 h-4 mr-2" />
              Claim Rewards
            </Button>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-400"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View All Achievements
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
