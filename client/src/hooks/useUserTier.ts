// client/src/hooks/useUserTier.ts
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export type UserTier = 'SEEKER' | 'EXPLORER' | 'PIONEER' | 'GUARDIAN' | 'TITAN';

export const useUserTier = () => {
  const { user, isAuthenticated } = useAuth();
  const [tier, setTier] = useState<UserTier>('SEEKER');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setTier('SEEKER');
      return;
    }

    setLoading(true);
    
    fetch('/api/get-user-tier', {
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      setTier(data.tier || 'SEEKER');
    })
    .catch(error => {
      console.error('Error fetching user tier:', error);
      setTier('SEEKER');
    })
    .finally(() => {
      setLoading(false);
    });
  }, [isAuthenticated, user]);

  return {
    tier,
    loading,
    isSeeker: tier === 'SEEKER',
    isExplorer: tier === 'EXPLORER',
    isPioneer: tier === 'PIONEER',
    isGuardian: tier === 'GUARDIAN',
    isTitan: tier === 'TITAN',
    hasAdminAccess: tier === 'GUARDIAN' || tier === 'TITAN',
  };
};

export default useUserTier;