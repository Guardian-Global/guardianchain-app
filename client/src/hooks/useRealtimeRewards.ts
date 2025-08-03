import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface RealtimeUpdate {
  type: 'cluster_vote' | 'yield_update' | 'theme_change';
  payload: any;
}

export function useRealtimeRewards() {
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  const { data: yieldData, refetch: refetchYield } = useQuery({
    queryKey: ["/api/gtt/theme-yield"],
    refetchInterval: 30000,
  });

  const { data: voteData, refetch: refetchVotes } = useQuery({
    queryKey: ["/api/dao/vote-summary"],
    refetchInterval: 30000,
  });

  useEffect(() => {
    // Simulate real-time connection for demo
    const setupRealtimeConnection = () => {
      setIsConnected(true);
      
      // Simulate periodic updates to demonstrate live data
      const interval = setInterval(() => {
        // Invalidate cache to trigger fresh data fetch
        queryClient.invalidateQueries({ queryKey: ["/api/gtt/theme-yield"] });
        queryClient.invalidateQueries({ queryKey: ["/api/dao/vote-summary"] });
        
        console.log('🔄 Real-time update triggered - refreshing yield and vote data');
      }, 45000); // Update every 45 seconds for demo

      return () => {
        clearInterval(interval);
        setIsConnected(false);
      };
    };

    const cleanup = setupRealtimeConnection();
    return cleanup;
  }, [queryClient]);

  // Manual refresh function for immediate updates
  const triggerRefresh = () => {
    refetchYield();
    refetchVotes();
    queryClient.invalidateQueries({ queryKey: ["/api/analytics/platform-metrics"] });
  };

  return {
    isConnected,
    yieldData,
    voteData,
    triggerRefresh
  };
}