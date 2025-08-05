import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function useSecureIncrement(capsuleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: 'views' | 'shares' | 'unlocks') => {
      return apiRequest(`/api/capsule/secure-increment/${capsuleId}`, {
        method: 'POST',
        body: JSON.stringify({ type }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      // Invalidate stats cache to trigger refresh
      queryClient.invalidateQueries({ queryKey: [`/api/capsule/stats/${capsuleId}`] });
    },
  });
}

// Hook for easy increment actions
export function useCapsuleActions(capsuleId: string) {
  const incrementMutation = useSecureIncrement(capsuleId);

  const incrementView = () => incrementMutation.mutate('views');
  const incrementShare = () => incrementMutation.mutate('shares');
  const incrementUnlock = () => incrementMutation.mutate('unlocks');

  return {
    incrementView,
    incrementShare,
    incrementUnlock,
    isLoading: incrementMutation.isPending,
    error: incrementMutation.error,
  };
}