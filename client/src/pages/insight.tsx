import { Brain, TrendingUp, Clock, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DaoXpGraph from "@/components/DaoXpGraph";
import DaoStatsCard from "@/components/DaoStatsCard";
import CapsuleTimeline from "@/components/CapsuleTimeline";
import SealStudio from "@/components/SealStudio";

export default function InsightPage() {
  const stats = [
    {
      label: "Total XP Earned",
      value: "2,140",
      icon: TrendingUp,
      color: "text-blue-400",
    },
    {
      label: "Capsules Tracked",
      value: "847",
      icon: Clock,
      color: "text-green-400",
    },
    {
      label: "Seals Generated",
      value: "312",
      icon: Palette,
      color: "text-purple-400",
    },
    {
      label: "Success Rate",
      value: "94.7%",
      icon: Brain,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Brain className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <span className="text-white text-xl font-bold">
                  Insights & Reputation Center
                </span>
                <p className="text-slate-400 text-sm font-normal">
                  Advanced analytics, reputation tracking, and certification
                  tools
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* DAO Stats Overview */}
        <DaoStatsCard />

        {/* Main Content Sections */}
        <div className="space-y-8">
          {/* DAO XP Reputation Graph */}
          <section>
            <DaoXpGraph />
          </section>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-900 px-4 text-slate-400">
                Capsule Evolution
              </span>
            </div>
          </div>

          {/* Capsule Timeline */}
          <section>
            <CapsuleTimeline />
          </section>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-900 px-4 text-slate-400">
                Seal Studio
              </span>
            </div>
          </div>

          {/* Seal Studio */}
          <section>
            <SealStudio />
          </section>
        </div>

        {/* Features Overview */}
        <Card className="mt-8 bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Platform Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  DAO Analytics
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    Real-time XP tracking and rankings
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    Governance participation metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    Success rate and achievement badges
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    GTT weight visualization
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-400" />
                  Evolution Tracking
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Complete capsule lifecycle timeline
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Status tracking and verification stages
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Transaction and seal history
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    NFT certification milestones
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-400" />
                  Seal Studio
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    Custom seal design and generation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    Professional certification templates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    Downloadable share cards
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    Social media integration
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
