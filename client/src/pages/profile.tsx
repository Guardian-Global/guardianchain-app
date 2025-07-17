import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User, Star, Coins, Trophy, Calendar, Shield, Edit, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CapsuleCard from "@/components/capsule/capsule-card";

export default function Profile() {
  const { id } = useParams();
  const userId = id ? parseInt(id) : 1; // Default to user 1 for demo

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/users", userId],
  });

  const { data: userCapsules, isLoading: capsulesLoading } = useQuery({
    queryKey: ["/api/capsules", { creatorId: userId }],
  });

  const { data: userTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/users", userId, "transactions"],
  });

  const { data: userAchievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/users", userId, "achievements"],
  });

  if (userLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-48 bg-slate-800 rounded-2xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-slate-800 rounded-2xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-slate-800 rounded-2xl"></div>
                <div className="h-48 bg-slate-800 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-12 text-center">
              <User className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">User not found</h2>
              <p className="text-slate-400">The user profile you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">@{user.username}</h1>
                  {user.isVerified && (
                    <Badge className="bg-emerald-600 text-white">
                      <Shield className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-slate-400 mb-4">{user.email}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-400">{user.griefScore}</div>
                    <div className="text-xs text-slate-400">Grief Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.totalCapsules}</div>
                    <div className="text-xs text-slate-400">Total Capsules</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">{user.verifiedCapsules}</div>
                    <div className="text-xs text-slate-400">Verified</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{user.gttBalance}</div>
                    <div className="text-xs text-slate-400">GTT Balance</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-slate-600">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" className="border-slate-600">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="capsules" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
                <TabsTrigger value="capsules" className="data-[state=active]:bg-primary">
                  Capsules
                </TabsTrigger>
                <TabsTrigger value="transactions" className="data-[state=active]:bg-primary">
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="achievements" className="data-[state=active]:bg-primary">
                  Achievements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="capsules" className="space-y-6">
                {capsulesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                        <div className="animate-pulse">
                          <div className="h-32 bg-slate-700 rounded-lg mb-4"></div>
                          <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userCapsules?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userCapsules.map((capsule) => (
                      <CapsuleCard key={capsule.id} capsule={capsule} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-slate-400 text-lg">No capsules created yet.</div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                {transactionsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                        <div className="animate-pulse">
                          <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-slate-700 rounded w-48"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userTransactions?.length ? (
                  <div className="space-y-4">
                    {userTransactions.map((transaction) => (
                      <Card key={transaction.id} className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium capitalize">{transaction.type}</div>
                              <div className="text-sm text-slate-400">{transaction.description}</div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${
                                transaction.type === "reward" ? "text-emerald-400" : 
                                transaction.type === "penalty" ? "text-red-400" : "text-slate-300"
                              }`}>
                                {transaction.type === "penalty" ? "-" : "+"}${transaction.amount}
                              </div>
                              <div className="text-sm text-slate-400">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Coins className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <div className="text-slate-400 text-lg">No transactions yet.</div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                {achievementsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                        <div className="animate-pulse">
                          <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-slate-700 rounded w-48"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userAchievements?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userAchievements.map((achievement) => (
                      <Card key={achievement.id} className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Trophy className="h-5 w-5 text-amber-400" />
                            <div className="font-medium">{achievement.title}</div>
                          </div>
                          <p className="text-sm text-slate-400">{achievement.description}</p>
                          <div className="text-xs text-slate-500 mt-2">
                            {new Date(achievement.earnedAt).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <div className="text-slate-400 text-lg">No achievements earned yet.</div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Member Since</span>
                  <span className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Verification Rate</span>
                  <span className="text-sm font-medium text-emerald-400">
                    {user.totalCapsules > 0 ? Math.round((user.verifiedCapsules / user.totalCapsules) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Wallet Connected</span>
                  <Badge variant={user.walletAddress ? "default" : "secondary"}>
                    {user.walletAddress ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <div className="text-sm text-slate-400">No recent activity</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
