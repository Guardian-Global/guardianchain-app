import React from 'react';
import useSWR from 'swr';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Activity, AlertTriangle, Zap } from 'lucide-react';

interface BehaviorLabelsProps {
  capsuleId: string;
}

export default function BehaviorLabels({ capsuleId }: BehaviorLabelsProps) {
  const { data: behaviorData, isLoading } = useSWR(`/api/capsule/analytics/behavior/${capsuleId}`);

  const getBehaviorIcon = (label: string) => {
    switch (label?.toLowerCase()) {
      case 'viral': return <Zap className="h-4 w-4" />;
      case 'spike': return <AlertTriangle className="h-4 w-4" />;
      case 'gradual': return <TrendingUp className="h-4 w-4" />;
      case 'dormant': return <Activity className="h-4 w-4 opacity-50" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getBehaviorColor = (label: string) => {
    switch (label?.toLowerCase()) {
      case 'viral': return 'border-[#ff00d4] text-[#ff00d4] bg-[#ff00d4]/10';
      case 'spike': return 'border-orange-400 text-orange-400 bg-orange-400/10';
      case 'gradual': return 'border-[#00ffe1] text-[#00ffe1] bg-[#00ffe1]/10';
      case 'dormant': return 'border-gray-400 text-gray-400 bg-gray-400/10';
      default: return 'border-purple-400 text-purple-400 bg-purple-400/10';
    }
  };

  const getBehaviorDescription = (label: string) => {
    switch (label?.toLowerCase()) {
      case 'viral': return 'Experiencing rapid, exponential growth in engagement';
      case 'spike': return 'Shows sudden bursts of activity with abnormal peaks';
      case 'gradual': return 'Steady, consistent growth pattern over time';
      case 'dormant': return 'Low activity with minimal engagement';
      default: return 'AI analysis pending or unique behavior pattern';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 text-[#8b949e]">
        <Brain className="h-5 w-5 animate-pulse mr-2" />
        Analyzing behavior patterns...
      </div>
    );
  }

  if (!behaviorData) {
    return (
      <div className="text-center p-6 text-[#8b949e]">
        <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No AI behavior analysis available yet</p>
        <p className="text-xs mt-1">Analysis will appear after sufficient interaction data</p>
      </div>
    );
  }

  const confidence = parseFloat(behaviorData.confidence || '0');
  const confidencePercentage = Math.round(confidence * 100);

  return (
    <div className="space-y-4">
      {/* Main behavior label */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#161b22] border border-[#30363d]">
          {getBehaviorIcon(behaviorData.label)}
        </div>
        <div className="flex-1">
          <Badge 
            variant="outline" 
            className={`${getBehaviorColor(behaviorData.label)} px-3 py-1 text-sm font-semibold`}
          >
            {behaviorData.label?.toUpperCase() || 'UNKNOWN'}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d]">
        <p className="text-sm text-[#f0f6fc] mb-2">
          {getBehaviorDescription(behaviorData.label)}
        </p>
        
        {/* Confidence indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8b949e]">AI Confidence:</span>
          <div className="flex-1 bg-[#0d1117] rounded-full h-2">
            <div 
              className="bg-[#00ffe1] h-2 rounded-full transition-all duration-500"
              style={{ width: `${confidencePercentage}%` }}
            />
          </div>
          <span className="text-[#00ffe1] font-mono">{confidencePercentage}%</span>
        </div>
      </div>

      {/* Metadata if available */}
      {behaviorData.metadata && (
        <div className="text-xs text-[#8b949e] bg-[#0d1117] p-2 rounded border border-[#30363d]">
          <span className="font-mono">Last Updated: </span>
          {behaviorData.updatedAt ? new Date(behaviorData.updatedAt).toLocaleDateString() : 'N/A'}
        </div>
      )}
    </div>
  );
}