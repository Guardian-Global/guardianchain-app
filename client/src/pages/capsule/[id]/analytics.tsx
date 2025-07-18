import React from "react";
import { useParams } from "wouter";
import CapsuleAnalyticsChart from "@/components/analytics/CapsuleAnalyticsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Download, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { BRAND_COLORS } from "@/lib/constants";

export default function CapsuleDynamicAnalyticsPage() {
  const params = useParams();
  const capsuleId = params.id || "1";

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // Could add toast notification here
  };

  const handleDownload = () => {
    // Export analytics data as CSV/PDF
    console.log("Downloading analytics for capsule", capsuleId);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header with Navigation */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/capsule-analytics">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Analytics Hub
              </Button>
            </Link>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge 
                variant="outline" 
                className="border-purple-400 text-purple-300 text-lg px-4 py-2"
              >
                Capsule #{capsuleId}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Performance Analytics
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Comprehensive yield tracking, engagement metrics, and emotional resonance analysis
            </p>
          </div>
        </div>
      </section>

      {/* Capsule Info Card */}
      <section className="py-8 bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Capsule Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-slate-400 text-sm">Capsule ID</span>
                  <p className="text-white font-mono text-lg">#{capsuleId}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-sm">Status</span>
                  <p className="text-green-400 font-medium">Active</p>
                </div>
                <div>
                  <span className="text-slate-400 text-sm">Type</span>
                  <p className="text-white">Truth Verification</p>
                </div>
                <div>
                  <span className="text-slate-400 text-sm">Created</span>
                  <p className="text-white">July 18, 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Analytics Charts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CapsuleAnalyticsChart capsuleId={capsuleId} timeRange="30d" />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">View Capsule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  View the original capsule content and verification details
                </p>
                <Link href={`/capsule/${capsuleId}`}>
                  <Button className="w-full" style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Capsule
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Yield Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  Monitor real-time yield generation and claim rewards
                </p>
                <Link href={`/yield-tracker?id=${capsuleId}`}>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                    Track Yield
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Embed Widget</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  Get embeddable widget code for external sites
                </p>
                <Link href={`/embed/capsule?id=${capsuleId}`}>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                    Get Embed Code
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}