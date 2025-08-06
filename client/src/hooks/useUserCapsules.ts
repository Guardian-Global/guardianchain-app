// client/src/hooks/useUserCapsules.ts
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface Capsule {
  id: string;
  user_id: string;
  title?: string;
  content?: string;
  description?: string;
  media_url?: string;
  visibility: 'private' | 'public' | 'friends' | 'unlockable';
  grief_score?: number;
  created_at: string;
  updated_at: string;
  minted?: boolean;
  mint_transaction?: string;
  ipfs_hash?: string;
  veritas_id?: string;
}

export const useUserCapsules = () => {
  const { user, isAuthenticated } = useAuth();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCapsules = async () => {
    if (!isAuthenticated || !user) {
      setCapsules([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/capsules/user', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch capsules');
      }

      const capsulesData = await response.json();
      setCapsules(capsulesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching capsules:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCapsule = async (capsuleData: Partial<Capsule>) => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/capsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(capsuleData),
      });

      if (!response.ok) {
        throw new Error('Failed to create capsule');
      }

      const newCapsule = await response.json();
      setCapsules(prev => [...prev, newCapsule]);
      return newCapsule;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCapsule = async (id: string, updates: Partial<Capsule>) => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/capsules/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update capsule');
      }

      const updatedCapsule = await response.json();
      setCapsules(prev => 
        prev.map(capsule => capsule.id === id ? updatedCapsule : capsule)
      );
      return updatedCapsule;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCapsule = async (id: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/capsules/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete capsule');
      }

      setCapsules(prev => prev.filter(capsule => capsule.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapsules();
  }, [isAuthenticated, user]);

  return {
    capsules,
    loading,
    error,
    createCapsule,
    updateCapsule,
    deleteCapsule,
    refetch: fetchCapsules,
  };
};

export default useUserCapsules;