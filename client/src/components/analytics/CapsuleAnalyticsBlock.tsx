import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Clock, Download } from 'lucide-react';
import CapsuleEngagementStats from '../profile/CapsuleEngagementStats';
import CapsuleTrendGraph from './CapsuleTrendGraph';
import EngagementHeatmap from './EngagementHeatmap';
import CapsuleAuditExport from './CapsuleAuditExport';
import BehaviorLabels from './BehaviorLabels';

interface CapsuleAnalyticsBlockProps {
  capsuleId: string;
}

export default function CapsuleAnalyticsBlock({ capsuleId }: CapsuleAnalyticsBlockProps) {
  return (
    <div className="bg-gradient-to-b from-[#161b22] via-[#0d1117] to-[#161b22] p-6 rounded-xl shadow-2xl mt-8 border border-[#30363d]">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-6 w-6 text-[#00ffe1]" />
        <h2 className="text-2xl font-bold text-[#00ffe1] font-[Orbitron]">
          Capsule Analytics Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Engagement Stats */}
        <Card className="bg-[#0d1117] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-[#00ffe1] flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Live Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CapsuleEngagementStats capsuleId={capsuleId} />
          </CardContent>
        </Card>

        {/* Behavior Labels */}
        <Card className="bg-[#0d1117] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-[#00ffe1] flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              AI Behavior Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BehaviorLabels capsuleId={capsuleId} />
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      <div className="mt-6">
        <Card className="bg-[#0d1117] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-[#00ffe1] flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Daily Interaction Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CapsuleTrendGraph capsuleId={capsuleId} />
          </CardContent>
        </Card>
      </div>

      {/* Engagement Heatmap */}
      <div className="mt-6">
        <Card className="bg-[#0d1117] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-[#00ffe1] flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time-based Engagement Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EngagementHeatmap capsuleId={capsuleId} />
          </CardContent>
        </Card>
      </div>

      {/* Export Controls */}
      <div className="mt-6">
        <Card className="bg-[#0d1117] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-[#00ffe1] flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Analytics Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CapsuleAuditExport capsuleId={capsuleId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}