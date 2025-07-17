import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Star, User, Coins, TrendingUp, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const achievements = [
  {
    type: "truth_streak",
    title: "Truth Streak Champion",
    description: "@blockchain_expert achieved 50 consecutive verified capsules",
    timeAgo: "2 hours ago",
    color: "emerald",
  },
  {
    type: "community_impact",
    title: "Community Impact",
    description: "@socialresearcher's capsule reached 10,000 verifications",
    timeAgo: "5 hours ago",
    color: "purple",
  },
  {
    type: "first_nft",
    title: "First NFT Mint",
    description: "@newbie_truthteller successfully minted their first Truth NFT",
    timeAgo: "1 day ago",
    color: "cyan",
  },
];

export default function Leaderboard() {
  const { data: topUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/leaderboard", "50"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-amber-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-slate-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-400" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white">{rank}</div>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900";
      case 2:
        return "bg-gradient-to-r from-slate-400 to-slate-600 text-white";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default:
        return "bg-slate-600 text-white";
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Truth Leaders</h1>
          <p className="text-slate-400 text-lg">
            Top contributors ranked by Grief-Score and community impact
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">
                {statsLoading ? "..." : stats?.totalCapsules?.toLocaleString() || "0"}
              </div>
              <div className="text-slate-400 text-sm">Total Capsules</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-400">
                {statsLoading ? "..." : stats?.verifiedTruths?.toLocaleString() || "0"}
              </div>
              <div className="text-slate-400 text-sm">Verified Truths</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Coins className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-400">
                {statsLoading ? "..." : `$${stats?.totalRewards || "0"}`}
              </div>
              <div className="text-slate-400 text-sm">Rewards Paid</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <User className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary">
                {statsLoading ? "..." : stats?.activeUsers?.toLocaleString() || "0"}
              </div>
              <div className="text-slate-400 text-sm">Active Users</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Performers */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-3 h-6 w-6 text-amber-400" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-xl">
                        <div className="w-8 h-8 bg-slate-600 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-slate-600 rounded w-32 mb-2 animate-pulse"></div>
                          <div className="h-3 bg-slate-600 rounded w-24 animate-pulse"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 bg-slate-600 rounded w-12 mb-1 animate-pulse"></div>
                          <div className="h-3 bg-slate-600 rounded w-16 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : topUsers?.length ? (
                  <div className="space-y-4">
                    {topUsers.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors">
                        <div className="flex items-center space-x-4">
                          <Badge className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${getRankBadge(index + 1)}`}>
                            {index + 1}
                          </Badge>
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">@{user.username}</div>
                            <div className="text-sm text-slate-400">{user.verifiedCapsules} verified capsules</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-amber-400">{user.griefScore}</div>
                          <div className="text-sm text-slate-400">Grief Score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <div className="text-slate-400">No users found.</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Achievements */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Medal className="mr-3 h-6 w-6 text-emerald-400" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-xl ${
                      achievement.color === "emerald"
                        ? "bg-emerald-900/30 border-emerald-700"
                        : achievement.color === "purple"
                        ? "bg-purple-900/30 border-purple-700"
                        : "bg-cyan-900/30 border-cyan-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-medium ${
                          achievement.color === "emerald"
                            ? "text-emerald-400"
                            : achievement.color === "purple"
                            ? "text-purple-400"
                            : "text-cyan-400"
                        }`}
                      >
                        {achievement.title}
                      </span>
                      <span className="text-xs text-slate-400">{achievement.timeAgo}</span>
                    </div>
                    <p className="text-sm text-slate-300">{achievement.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Technology</span>
                  <Badge variant="secondary">2,847</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Science</span>
                  <Badge variant="secondary">1,923</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Politics</span>
                  <Badge variant="secondary">1,456</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Economics</span>
                  <Badge variant="secondary">1,234</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Health</span>
                  <Badge variant="secondary">987</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Weekly Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">New Capsules</span>
                  <span className="font-semibold text-emerald-400">+247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Verifications</span>
                  <span className="font-semibold text-primary">+1,892</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">GTT Distributed</span>
                  <span className="font-semibold text-amber-400">12,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">New Users</span>
                  <span className="font-semibold text-secondary">+89</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
