import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  User,
  TrendingUp,
  Shield,
  Wallet,
  Trophy,
  Target,
  Activity,
  Clock,
  Star,
  Crown,
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  tier: string;
  gttBalance: string;
  reputation: string;
  totalCapsules: string;
  verificationRate: number;
  joinDate: string;
  achievements: string[];
}

interface WorkingProfileDashboardProps {
  user?: UserData;
}

export default function WorkingProfileDashboard({
  user,
}: WorkingProfileDashboardProps) {
  // Default user data if not provided
  const userData = user || {
    id: "demo-user-001",
    email: "guardian@example.com",
    tier: "CREATOR",
    gttBalance: "2,847",
    reputation: "892",
    totalCapsules: "47",
    verificationRate: 87,
    joinDate: "January 2025",
    achievements: ["Early Adopter", "Truth Seeker", "Community Builder"],
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "explorer":
        return "text-blue-400 border-blue-400";
      case "seeker":
        return "text-purple-400 border-purple-400";
      case "creator":
        return "text-green-400 border-green-400";
      case "sovereign":
        return "text-yellow-400 border-yellow-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Dashboard</h1>
          <p className="text-slate-400">
            Manage your GUARDIANCHAIN profile and track your progress
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Wallet className="h-5 w-5" />
                GTT Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.gttBalance}</div>
              <div className="text-sm text-green-400">+12.5% this month</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Shield className="h-5 w-5" />
                Reputation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.reputation}</div>
              <div className="text-sm text-blue-400">Top 5% of users</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Target className="h-5 w-5" />
                Total Capsules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.totalCapsules}</div>
              <div className="text-sm text-purple-400">
                {userData.verificationRate}% verified
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Crown className="h-5 w-5" />
                User Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                className={`${getTierColor(
                  userData.tier
                )} bg-transparent text-lg`}
              >
                {userData.tier}
              </Badge>
              <div className="text-sm text-orange-400 mt-1">
                Since {userData.joinDate}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="capsules">My Capsules</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          Created truth capsule #47
                        </div>
                        <div className="text-xs text-slate-400">
                          2 hours ago
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          Verified 3 capsules
                        </div>
                        <div className="text-xs text-slate-400">1 day ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          Earned 150 GTT rewards
                        </div>
                        <div className="text-xs text-slate-400">2 days ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Performance Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Verification Accuracy
                        </span>
                        <span className="text-sm font-bold">
                          {userData.verificationRate}%
                        </span>
                      </div>
                      <Progress
                        value={userData.verificationRate}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Community Trust
                        </span>
                        <span className="text-sm font-bold">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Monthly Growth
                        </span>
                        <span className="text-sm font-bold">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="capsules" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>My Truth Capsules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="border border-slate-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">
                          Truth Capsule #{47 - item + 1}
                        </h4>
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-400"
                        >
                          Verified
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">
                        Important information verified by the community...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Created: Jan {20 + item}, 2025</span>
                        <span>GTT Earned: {125 * item}</span>
                        <span>Views: {1200 * item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Achievements & Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userData.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="border border-slate-700 rounded-lg p-4 text-center"
                    >
                      <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">{achievement}</h4>
                      <p className="text-xs text-slate-400">
                        Earned for outstanding contribution to the platform
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Account Information</h4>
                    <div className="space-y-2 text-sm text-slate-400">
                      <div>Email: {userData.email}</div>
                      <div>User ID: {userData.id}</div>
                      <div>Member since: {userData.joinDate}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Tier Upgrade</h4>
                    <Button className="bg-gradient-to-r from-purple-600 to-green-600">
                      Upgrade to Sovereign Tier
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Preferences</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        Notification Settings
                      </Button>
                      <Button variant="outline" size="sm">
                        Privacy Settings
                      </Button>
                      <Button variant="outline" size="sm">
                        Export Data
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
