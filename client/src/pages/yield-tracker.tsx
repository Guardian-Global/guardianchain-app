import React from "react";
import CapsuleYieldTracker from "@/components/web3/CapsuleYieldTracker";
import { TrendingUp, BarChart3, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

export default function YieldTrackerPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Capsule Yield Tracker
              </h1>
            </div>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Track truth capsule performance, yield generation, and emotional
              resonance in real-time
            </p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-12 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp
                    className="w-5 h-5"
                    style={{ color: BRAND_COLORS.GUARDIAN }}
                  />
                  Real-Time Yield
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Monitor GTT token yield generation as your capsules gain
                  traction and verification
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3
                    className="w-5 h-5"
                    style={{ color: BRAND_COLORS.GUARDIAN }}
                  />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Deep insights into emotional resonance scores and community
                  engagement metrics
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Award
                    className="w-5 h-5"
                    style={{ color: BRAND_COLORS.GUARDIAN }}
                  />
                  Share & Embed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Share your capsule performance across platforms with
                  embeddable widgets
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Tracker Interface */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CapsuleYieldTracker />
        </div>
      </section>

      {/* Sample Capsules Section */}
      <section className="py-12 bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Sample Capsule Performance
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                High Performance
              </h3>
              <CapsuleYieldTracker capsuleId="1" />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Growing Capsule
              </h3>
              <CapsuleYieldTracker capsuleId="2" />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Viral Truth</h3>
              <CapsuleYieldTracker capsuleId="3" />
            </div>
          </div>
        </div>
      </section>

      {/* Usage Instructions */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                How to Use the Yield Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Track Your Capsules
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Enter any capsule ID to view its performance</li>
                    <li>• Monitor real-time yield generation</li>
                    <li>• Track emotional resonance scores</li>
                    <li>• View historical performance data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Share & Embed
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Generate shareable links for social media</li>
                    <li>• Copy embed codes for external sites</li>
                    <li>• Track performance across platforms</li>
                    <li>• Build transparent reputation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
