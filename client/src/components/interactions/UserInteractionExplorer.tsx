import React from 'react';
import useSWR from 'swr';
import { Activity, Eye, Share2, Unlock, Zap, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserInteractionExplorerProps {
  userId: string;
}

const actionIcons = {
  view: Eye,
  share: Share2,
  unlock: Unlock,
  mint: Zap,
  react: Heart,
};

const actionColors = {
  view: 'text-[#00ffe1]',
  share: 'text-[#ff00d4]',
  unlock: 'text-[#7c3aed]',
  mint: 'text-[#fbbf24]',
  react: 'text-[#ef4444]',
};

export default function UserInteractionExplorer({ userId }: UserInteractionExplorerProps) {
  const { data, isLoading } = useSWR(`/api/users/${userId}/interactions`);

  if (isLoading) {
    return (
      <Card className="bg-[#0d1117] border-[#30363d]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <Activity className="h-8 w-8 animate-pulse text-[#00ffe1]" />
            <span className="ml-2 text-[#8b949e]">Loading interactions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <Card className="bg-[#0d1117] border-[#30363d]">
        <CardHeader>
          <CardTitle className="text-[#00ffe1] flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Interaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-[#8b949e] py-8">
            No interactions found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0d1117] border-[#30363d]">
      <CardHeader>
        <CardTitle className="text-[#00ffe1] flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Interaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {data.data.map((entry: any) => {
            const Icon = actionIcons[entry.action as keyof typeof actionIcons] || Activity;
            const colorClass = actionColors[entry.action as keyof typeof actionColors] || 'text-[#8b949e]';
            
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 bg-[#161b22] rounded-lg border border-[#30363d]"
                data-testid={`interaction-${entry.id}`}
              >
                <Icon className={`h-4 w-4 ${colorClass}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold capitalize ${colorClass}`}>
                      {entry.action}
                    </span>
                    <span className="text-[#8b949e]">on capsule</span>
                    <code className="text-[#fbbf24] bg-[#21262d] px-2 py-1 rounded text-xs">
                      {entry.capsule_id.slice(0, 8)}...
                    </code>
                  </div>
                  <div className="text-xs text-[#8b949e] mt-1">
                    {new Date(entry.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}