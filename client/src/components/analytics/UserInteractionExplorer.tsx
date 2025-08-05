import React from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Share2, Unlock, Coins, User, Clock } from 'lucide-react';

interface UserInteractionExplorerProps {
  userId: string;
}

export default function UserInteractionExplorer({ userId }: UserInteractionExplorerProps) {
  const { data, isLoading } = useSWR(`/api/capsule/analytics/user-interactions/${userId}`);

  const getActionIcon = (action: string) => {
    switch (action?.toLowerCase()) {
      case 'view': return <Eye className="h-4 w-4 text-blue-400" />;
      case 'share': return <Share2 className="h-4 w-4 text-purple-400" />;
      case 'unlock': return <Unlock className="h-4 w-4 text-[#ff00d4]" />;
      case 'mint': return <Coins className="h-4 w-4 text-[#00ffe1]" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action?.toLowerCase()) {
      case 'view': return 'border-blue-400 text-blue-400 bg-blue-400/10';
      case 'share': return 'border-purple-400 text-purple-400 bg-purple-400/10';
      case 'unlock': return 'border-[#ff00d4] text-[#ff00d4] bg-[#ff00d4]/10';
      case 'mint': return 'border-[#00ffe1] text-[#00ffe1] bg-[#00ffe1]/10';
      default: return 'border-gray-400 text-gray-400 bg-gray-400/10';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <CardTitle className="text-[#00ffe1] flex items-center gap-2">
            <User className="h-5 w-5 animate-pulse" />
            Loading Interaction History...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <CardTitle className="text-[#00ffe1] flex items-center gap-2">
            <User className="h-5 w-5" />
            Interaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#8b949e]">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No interaction history available yet</p>
            <p className="text-xs mt-1">Activity will appear as user engages with capsules</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group interactions by date
  const groupedInteractions = data.reduce((groups: any, interaction: any) => {
    const date = new Date(interaction.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(interaction);
    return groups;
  }, {});

  return (
    <Card className="bg-[#161b22] border-[#30363d]">
      <CardHeader>
        <CardTitle className="text-[#00ffe1] flex items-center gap-2">
          <User className="h-5 w-5" />
          Interaction History
        </CardTitle>
        <p className="text-[#8b949e] text-sm mt-1">
          Recent capsule interactions and activities
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.entries(groupedInteractions)
            .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
            .map(([date, interactions]) => (
              <div key={date}>
                <div className="text-sm font-semibold text-[#00ffe1] mb-2 border-b border-[#30363d] pb-1">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                
                <div className="space-y-2">
                  {(interactions as any[]).map((interaction) => (
                    <div 
                      key={interaction.id}
                      className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-lg border border-[#30363d] hover:border-[#00ffe1]/30 transition-colors"
                    >
                      <div className="p-1.5 rounded-full bg-[#161b22]">
                        {getActionIcon(interaction.action)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="outline" 
                            className={`${getActionBadge(interaction.action)} text-xs px-2 py-0.5`}
                          >
                            {interaction.action?.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-[#8b949e] font-mono">
                            {new Date(interaction.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <div className="text-sm text-[#f0f6fc]">
                          Capsule: <span className="text-[#00ffe1] font-mono">
                            {interaction.capsuleId.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}