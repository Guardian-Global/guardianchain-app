import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  TrendingUp,
  Shield,
  Coins,
  Vote,
  FileText,
  Calendar,
} from "lucide-react";

const topUsers = [
  {
    rank: 1,
    name: "TruthSeeker_007",
    avatar: "/api/placeholder/50/50",
    griefScore: 156, // Realistic grief score for top user
    seals: 3, // Realistic number of seals
    votes: 5,
    gtt: 47.5, // Realistic GTT balance
    capsulesCreated: 8, // Realistic capsule count
    verificationsCompleted: 12, // Realistic verification count
    joinedDays: 89,
    badge: "Guardian Elite",
  },
  {
    rank: 2,
    name: "OnChainWitness",
    avatar: "/api/placeholder/50/50",
    griefScore: 134, // Realistic for second place
    seals: 2,
    votes: 4,
    gtt: 32.8,
    capsulesCreated: 6,
    verificationsCompleted: 9,
    joinedDays: 76,
    badge: "Truth Pioneer",
  },
  {
    rank: 3,
    name: "BlockchainVerifier",
    avatar: "/api/placeholder/50/50",
    griefScore: 98, // More realistic score
    seals: 2,
    votes: 6,
    gtt: 28.4,
    capsulesCreated: 5,
    verificationsCompleted: 8,
    joinedDays: 63,
    badge: "Verification Expert",
  },
  {
    rank: 4,
    name: "CryptoTruthGuard",
    avatar: "/api/placeholder/50/50",
    griefScore: 87, // Realistic grief score
    seals: 1,
    votes: 3,
    gtt: 19.2,
    capsulesCreated: 4,
    verificationsCompleted: 6,
    joinedDays: 52,
    badge: "Community Guardian",
  },
  {
    rank: 5,
    name: "FactCheckMaster",
    avatar: "/api/placeholder/50/50",
    griefScore: 5987,
    seals: 5,
    votes: 7,
    gtt: 1340,
    capsulesCreated: 8,
    verificationsCompleted: 31,
    joinedDays: 45,
    badge: "Truth Seeker",
  },
];

const weeklyLeaders = [
  { name: "NewTruthSeeker", change: "+245", griefScore: 4567 },
  { name: "RisingGuardian", change: "+198", griefScore: 3892 },
  { name: "FreshValidator", change: "+167", griefScore: 3445 },
];

const categories = [
  {
    title: "Most Seals Created",
    icon: FileText,
    leader: "TruthSeeker_007",
    value: "10 seals",
  },
  {
    title: "DAO Participation",
    icon: Vote,
    leader: "FactCheckMaster",
    value: "7 votes",
  },
  {
    title: "GTT Earned",
    icon: Coins,
    leader: "TruthSeeker_007",
    value: "2,140 GTT",
  },
  {
    title: "Community Impact",
    icon: Star,
    leader: "OnChainWitness",
    value: "38 verifications",
  },
];

export default function EnhancedLeaderboard() {
  const [selectedTab, setSelectedTab] = useState("overall");

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-amber-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-slate-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-400" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white">
            {rank}
          </div>
        );
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-slate-400 to-slate-500";
      case 3:
        return "bg-gradient-to-r from-orange-500 to-orange-600";
      default:
        return "bg-gradient-to-r from-purple-500 to-purple-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <span className="text-white text-xl font-bold">
                  GuardianChain Leaderboard
                </span>
                <p className="text-slate-400 text-sm font-normal">
                  Top contributors ranked by grief score, DAO activity, and seal
                  verification
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger
              value="overall"
              className="data-[state=active]:bg-purple-600"
            >
              Overall
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="data-[state=active]:bg-purple-600"
            >
              This Week
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-purple-600"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-purple-600"
            >
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-6">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {topUsers.slice(0, 3).map((user, index) => (
                <Card
                  key={user.rank}
                  className={`${getRankBadgeColor(user.rank)} p-1 ${
                    user.rank === 1
                      ? "md:order-2 transform md:scale-110"
                      : user.rank === 2
                      ? "md:order-1"
                      : "md:order-3"
                  }`}
                >
                  <CardContent className="bg-slate-800 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {getRankIcon(user.rank)}
                    </div>
                    <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-purple-500/30">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-purple-600 text-white text-xl">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-white font-bold text-lg mb-2">
                      {user.name}
                    </h3>
                    <Badge className="bg-purple-600 text-white mb-3">
                      {user.badge}
                    </Badge>
                    <div className="text-2xl font-bold text-yellow-400 mb-2">
                      {user.griefScore.toLocaleString()}
                    </div>
                    <p className="text-slate-400 text-sm">Grief Score</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Full Leaderboard Table */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Complete Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topUsers.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getRankIcon(user.rank)}
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-purple-600 text-white">
                            {user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-white font-semibold">
                            {user.name}
                          </h4>
                          <Badge className="bg-purple-600 text-white text-xs">
                            {user.badge}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-6 text-center">
                        <div>
                          <div className="text-yellow-400 font-bold">
                            {user.griefScore.toLocaleString()}
                          </div>
                          <div className="text-slate-400 text-xs">
                            Grief Score
                          </div>
                        </div>
                        <div>
                          <div className="text-green-400 font-bold">
                            {user.seals}
                          </div>
                          <div className="text-slate-400 text-xs">Seals</div>
                        </div>
                        <div>
                          <div className="text-blue-400 font-bold">
                            {user.votes}
                          </div>
                          <div className="text-slate-400 text-xs">
                            DAO Votes
                          </div>
                        </div>
                        <div>
                          <div className="text-purple-400 font-bold">
                            {user.gtt.toLocaleString()}
                          </div>
                          <div className="text-slate-400 text-xs">GTT</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Rising Stars This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyLeaders.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            {user.name}
                          </h4>
                          <p className="text-slate-400 text-sm">
                            Current Score: {user.griefScore.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        {user.change} this week
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <category.icon className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="text-white font-semibold">
                        {category.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-white">
                          {category.leader}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {category.value}
                        </p>
                      </div>
                      <Crown className="w-6 h-6 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      user: "TruthSeeker_007",
                      achievement: "Reached 7,000 Grief Score",
                      time: "2 hours ago",
                      icon: Shield,
                    },
                    {
                      user: "OnChainWitness",
                      achievement: "Created 8th Seal",
                      time: "4 hours ago",
                      icon: FileText,
                    },
                    {
                      user: "BlockchainVerifier",
                      achievement: "Cast 6th DAO Vote",
                      time: "6 hours ago",
                      icon: Vote,
                    },
                    {
                      user: "CryptoTruthGuard",
                      achievement: "Earned 1,400 GTT",
                      time: "8 hours ago",
                      icon: Coins,
                    },
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg"
                    >
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <achievement.icon className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">
                          {achievement.user}
                        </h4>
                        <p className="text-slate-400">
                          {achievement.achievement}
                        </p>
                      </div>
                      <div className="text-slate-500 text-sm">
                        {achievement.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
