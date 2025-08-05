import React from 'react';
import { useParams, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Share2, ExternalLink } from 'lucide-react';
import CapsuleAnalyticsBlock from '@/components/analytics/CapsuleAnalyticsBlock';

export default function CapsuleAnalyticsPage() {
  const params = useParams();
  const capsuleId = params.id;

  if (!capsuleId) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-[#ff00d4] mb-4">Invalid Capsule ID</h1>
          <Link href="/explorer">
            <Button className="bg-[#00ffe1] text-black hover:bg-[#00ffe1]/90">
              Browse Capsules
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const shareAnalytics = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Capsule Analytics - ${capsuleId}`,
        text: 'Check out these real-time capsule analytics from GuardianChain',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        // Could add toast notification here
        console.log('Analytics URL copied to clipboard');
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/capsule/${capsuleId}`}>
              <Button variant="outline" size="sm" className="border-[#30363d] text-[#8b949e]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Capsule
              </Button>
            </Link>
            
            <div>
              <h1 className="text-3xl font-bold text-[#00ffe1] font-[Orbitron] flex items-center gap-3">
                <BarChart3 className="h-8 w-8" />
                Capsule Analytics
              </h1>
              <p className="text-[#8b949e] mt-1">
                Real-time engagement metrics and behavioral insights
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={shareAnalytics}
              variant="outline"
              className="border-[#00ffe1] text-[#00ffe1] hover:bg-[#00ffe1]/10"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Analytics
            </Button>
            
            <Link href="/analytics-demo">
              <Button className="bg-[#7c3aed] hover:bg-[#7c3aed]/90">
                <ExternalLink className="h-4 w-4 mr-2" />
                Demo Mode
              </Button>
            </Link>
          </div>
        </div>

        {/* Capsule Info Card */}
        <Card className="bg-[#161b22] border-[#30363d] mb-6">
          <CardHeader>
            <CardTitle className="text-[#00ffe1] text-lg">
              Capsule ID: <span className="font-mono text-[#f0f6fc]">{capsuleId}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-[#8b949e]">
              <div className="w-2 h-2 rounded-full bg-[#00ffe1] animate-pulse"></div>
              <span>Live analytics updating every 5 seconds</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Analytics Dashboard */}
        <CapsuleAnalyticsBlock capsuleId={capsuleId} />

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-[#8b949e] border-t border-[#30363d] pt-4">
          <p>
            Analytics powered by GuardianChain real-time tracking system
          </p>
          <p className="mt-1">
            Data includes views, shares, unlocks, and behavioral patterns
          </p>
        </div>
      </div>
    </div>
  );
}