import React, { useState } from "react";
import { useLocation } from "wouter";
import CapsuleAnalyticsChart from "@/components/analytics/CapsuleAnalyticsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Zap, Award } from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

type TimeRange = "7d" | "30d" | "90d" | "1y";

export default function CapsuleAnalyticsPage() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const [selectedCapsuleId, setSelectedCapsuleId] = useState(urlParams.get("id") || "1");
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const featuredCapsules = [
    { id: "1", title: "Climate Change Evidence", performance: "High", yield: "12.5 GTT" },
    { id: "2", title: "Medical Research Findings", performance: "Growing", yield: "8.2 GTT" },
    { id: "3", title: "Economic Analysis Report", performance: "Viral", yield: "25.7 GTT" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Capsule Analytics Dashboard
              </h1>
            </div>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Deep insights into capsule performance, yield generation, and community engagement patterns
            </p>
          </div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="py-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Analytics Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Capsule ID</label>
                  <Input
                    placeholder="Enter Capsule ID"
                    value={selectedCapsuleId}
                    onChange={(e) => setSelectedCapsuleId(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Time Range</label>
                  <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                      <SelectItem value="1y">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    onClick={() => window.location.reload()}
                    style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}
                    className="w-full"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Refresh Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Analytics Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedCapsuleId ? (
            <CapsuleAnalyticsChart capsuleId={selectedCapsuleId} timeRange={timeRange} />
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Capsule to Analyze</h3>
                <p className="text-slate-400">
                  Enter a capsule ID above or choose from the featured capsules below to view detailed analytics.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Featured Capsules */}
      <section className="py-12 bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Featured High-Performance Capsules
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCapsules.map((capsule) => (
              <Card key={capsule.id} className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedCapsuleId(capsule.id)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg">{capsule.title}</CardTitle>
                    <Badge 
                      variant={capsule.performance === "High" ? "default" : capsule.performance === "Viral" ? "secondary" : "outline"}
                      className={
                        capsule.performance === "High" ? "bg-green-600" :
                        capsule.performance === "Viral" ? "bg-purple-600" : "bg-yellow-600"
                      }
                    >
                      {capsule.performance}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Capsule ID:</span>
                      <span className="text-white font-mono">#{capsule.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Yield:</span>
                      <span className="text-white font-semibold">{capsule.yield}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCapsuleId(capsule.id);
                      }}
                    >
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Features */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Analytics Features
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="w-5 h-5" style={{ color: BRAND_COLORS.GUARDIAN }} />
                  Yield Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">
                  Monitor GTT token generation with historical trends and growth patterns
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Award className="w-5 h-5 text-pink-400" />
                  Emotional Resonance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">
                  Track community emotional response and engagement quality over time
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">
                  Views, verifications, and shares with conversion rate analysis
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">
                  AI-powered insights and recommendations for capsule optimization
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}