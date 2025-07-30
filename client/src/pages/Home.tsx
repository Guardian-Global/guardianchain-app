import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Coins, TrendingUp, Users } from "lucide-react";
import LogoDisplay from "@/components/assets/LogoDisplay";
import VideoPlayer from "@/components/assets/VideoPlayer";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-purple-500"
              />
            ) : (
              <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center">
                <Users className="text-white h-10 w-10" />
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {user?.firstName || user?.email || "Guardian"}!
          </h1>

          <p className="text-xl text-slate-300 mb-8">
            Your GUARDIANCHAIN command center is ready. Secure truth, earn
            rewards, and build the future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button asChild className="mr-4">
              <a href="/create">Create Capsule</a>
            </Button>

            <Button variant="outline" asChild>
              <a href="/api/logout">Sign Out</a>
            </Button>
          </div>

          {/* Featured Video Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              GUARDIANCHAIN Protocol Overview
            </h2>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-900 to-slate-900">
              <VideoPlayer
                autoplay={false}
                controls={true}
                className="w-full h-full rounded-lg"
                poster="/assets/GUARDIANCHAIN_logo.png"
              />
              <div className="absolute top-4 left-4">
                <LogoDisplay size="lg" variant="full" />
              }
            />
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                GTT Balance
              </CardTitle>
              <Coins className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {user?.gttBalance || "0"}
              </div>
              <p className="text-xs text-slate-400">+2.5% from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Truth Capsules
              </CardTitle>
              <Shield className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {user?.totalCapsules || "0"}
              </div>
              <p className="text-xs text-slate-400">
                {user?.verifiedCapsules || "0"} verified
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Reputation
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {user?.reputation || "0"}
              </div>
              <p className="text-xs text-slate-400">
                {user?.xpPoints || "0"} XP earned
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Community Rank
              </CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {user?.isVerified ? "Verified" : "Guardian"}
              </div>
              <p className="text-xs text-slate-400">
                {user?.badges?.length || 0} badges earned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Create Truth Capsule</CardTitle>
              <CardDescription className="text-slate-400">
                Secure your ideas with immutable blockchain proof
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <a href="/create">Start Creating</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Explore Capsules</CardTitle>
              <CardDescription className="text-slate-400">
                Discover and verify community truth submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <a href="/explore">Explore Now</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Billing Dashboard</CardTitle>
              <CardDescription className="text-slate-400">
                Monitor treasury, invoices, and financial intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <a href="/billing-dashboard">View Billing</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
