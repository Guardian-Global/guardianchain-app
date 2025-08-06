// hooks/useUserCapsules.ts
// Real-time user-scoped capsule management with Supabase subscriptions

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { logActivity } from '@/lib/analytics';

export interface Capsule {
  id: string;
  owner_wallet_address: string;
  title: string;
  description?: string;
  content?: string;
  grief_score: number;
  gtt_reward: number;
  visibility: 'private' | 'friends' | 'public' | 'unlockable';
  unlock_conditions?: Record<string, any>;
  time_locked_until?: string;
  is_sealed: boolean;
  is_minted: boolean;
  nft_token_id?: string;
  ipfs_hash?: string;
  media_urls?: string[];
  tags?: string[];
  emotional_tags?: Record<string, any>;
  lineage_parent_id?: string;
  remix_count: number;
  view_count: number;
  unlock_count: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CapsuleFilter {
  visibility?: 'private' | 'friends' | 'public' | 'unlockable';
  tags?: string[];
  grief_score_min?: number;
  grief_score_max?: number;
  created_after?: string;
  created_before?: string;
  search?: string;
}

export interface CreateCapsuleData {
  title: string;
  description?: string;
  content?: string;
  grief_score?: number;
  visibility?: 'private' | 'friends' | 'public' | 'unlockable';
  unlock_conditions?: Record<string, any>;
  time_locked_until?: string;
  media_urls?: string[];
  tags?: string[];
  emotional_tags?: Record<string, any>;
  lineage_parent_id?: string;
  metadata?: Record<string, any>;
}

/**
 * Hook for managing user's capsules with real-time updates
 */
export function useUserCapsules(filter?: CapsuleFilter) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);

  // Query for user's capsules
  const {
    data: capsules = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-capsules', user?.email, filter],
    queryFn: async () => {
      if (!user?.email) return [];

      let query = supabase
        .from('capsules')
        .select('*')
        .eq('owner_wallet_address', user.email)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filter?.visibility) {
        query = query.eq('visibility', filter.visibility);
      }

      if (filter?.tags && filter.tags.length > 0) {
        query = query.contains('tags', filter.tags);
      }

      if (filter?.grief_score_min !== undefined) {
        query = query.gte('grief_score', filter.grief_score_min);
      }

      if (filter?.grief_score_max !== undefined) {
        query = query.lte('grief_score', filter.grief_score_max);
      }

      if (filter?.created_after) {
        query = query.gte('created_at', filter.created_after);
      }

      if (filter?.created_before) {
        query = query.lte('created_at', filter.created_before);
      }

      if (filter?.search) {
        query = query.or(`title.ilike.%${filter.search}%, description.ilike.%${filter.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching user capsules:', error);
        throw error;
      }

      return data as Capsule[];
    },
    enabled: !!user?.email
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.email) return;

    console.log('🔄 Setting up real-time capsule subscription for:', user.email);

    const channel = supabase
      .channel('user-capsules')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'capsules',
          filter: `owner_wallet_address=eq.${user.email}`
        },
        (payload) => {
          console.log('🆕 New capsule created:', payload.new);
          queryClient.setQueryData(
            ['user-capsules', user.email, filter],
            (old: Capsule[] = []) => [payload.new as Capsule, ...old]
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'capsules',
          filter: `owner_wallet_address=eq.${user.email}`
        },
        (payload) => {
          console.log('🔄 Capsule updated:', payload.new);
          queryClient.setQueryData(
            ['user-capsules', user.email, filter],
            (old: Capsule[] = []) =>
              old.map(capsule =>
                capsule.id === payload.new.id ? payload.new as Capsule : capsule
              )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'capsules',
          filter: `owner_wallet_address=eq.${user.email}`
        },
        (payload) => {
          console.log('🗑️ Capsule deleted:', payload.old);
          queryClient.setQueryData(
            ['user-capsules', user.email, filter],
            (old: Capsule[] = []) =>
              old.filter(capsule => capsule.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    setRealtimeChannel(channel);

    return () => {
      console.log('🔌 Cleaning up capsule subscription');
      channel.unsubscribe();
    };
  }, [user?.email, filter, queryClient]);

  // Create capsule mutation
  const createCapsule = useMutation({
    mutationFn: async (data: CreateCapsuleData): Promise<Capsule> => {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }

      const capsuleData = {
        ...data,
        owner_wallet_address: user.email,
        grief_score: data.grief_score || 0,
        visibility: data.visibility || 'private',
        is_sealed: false,
        is_minted: false,
        remix_count: 0,
        view_count: 0,
        unlock_count: 0,
        verification_status: 'pending' as const
      };

      const { data: newCapsule, error } = await supabase
        .from('capsules')
        .insert([capsuleData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating capsule:', error);
        throw error;
      }

      // Log activity
      await logActivity(user.email, 'capsule_created', {
        capsule_id: newCapsule.id,
        title: data.title,
        visibility: data.visibility,
        grief_score: data.grief_score
      });

      return newCapsule as Capsule;
    },
    onSuccess: (newCapsule) => {
      // Real-time subscription will handle the update
      console.log('✅ Capsule created successfully:', newCapsule.id);
    },
    onError: (error) => {
      console.error('❌ Failed to create capsule:', error);
    }
  });

  // Update capsule mutation
  const updateCapsule = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreateCapsuleData> }): Promise<Capsule> => {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }

      const { data: updatedCapsule, error } = await supabase
        .from('capsules')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('owner_wallet_address', user.email) // Ensure user owns the capsule
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating capsule:', error);
        throw error;
      }

      // Log activity
      await logActivity(user.email, 'capsule_updated', {
        capsule_id: id,
        updates: Object.keys(updates)
      });

      return updatedCapsule as Capsule;
    },
    onSuccess: (updatedCapsule) => {
      console.log('✅ Capsule updated successfully:', updatedCapsule.id);
    }
  });

  // Delete capsule mutation
  const deleteCapsule = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('capsules')
        .delete()
        .eq('id', id)
        .eq('owner_wallet_address', user.email); // Ensure user owns the capsule

      if (error) {
        console.error('❌ Error deleting capsule:', error);
        throw error;
      }

      // Log activity
      await logActivity(user.email, 'capsule_deleted', {
        capsule_id: id
      });
    },
    onSuccess: (_, id) => {
      console.log('✅ Capsule deleted successfully:', id);
    }
  });

  // Seal capsule (make it permanent)
  const sealCapsule = useMutation({
    mutationFn: async (id: string): Promise<Capsule> => {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }

      const { data: sealedCapsule, error } = await supabase
        .from('capsules')
        .update({
          is_sealed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('owner_wallet_address', user.email)
        .select()
        .single();

      if (error) {
        console.error('❌ Error sealing capsule:', error);
        throw error;
      }

      // Log activity
      await logActivity(user.email, 'capsule_sealed', {
        capsule_id: id
      });

      return sealedCapsule as Capsule;
    },
    onSuccess: (sealedCapsule) => {
      console.log('✅ Capsule sealed successfully:', sealedCapsule.id);
    }
  });

  // Get capsule statistics
  const getCapsuleStats = useCallback(async () => {
    if (!user?.email) return null;

    const { data, error } = await supabase
      .from('capsules')
      .select('visibility, is_sealed, verification_status')
      .eq('owner_wallet_address', user.email);

    if (error) {
      console.error('❌ Error fetching capsule stats:', error);
      return null;
    }

    const stats = {
      total: data.length,
      private: data.filter(c => c.visibility === 'private').length,
      public: data.filter(c => c.visibility === 'public').length,
      sealed: data.filter(c => c.is_sealed).length,
      verified: data.filter(c => c.verification_status === 'verified').length,
      pending: data.filter(c => c.verification_status === 'pending').length
    };

    return stats;
  }, [user?.email]);

  return {
    // Data
    capsules,
    isLoading,
    error,

    // Actions
    createCapsule: createCapsule.mutate,
    updateCapsule: updateCapsule.mutate,
    deleteCapsule: deleteCapsule.mutate,
    sealCapsule: sealCapsule.mutate,
    refetch,
    getCapsuleStats,

    // Status
    isCreating: createCapsule.isPending,
    isUpdating: updateCapsule.isPending,
    isDeleting: deleteCapsule.isPending,
    isSealing: sealCapsule.isPending,

    // Real-time connection status
    isConnected: !!realtimeChannel
  };
}

/**
 * Hook for accessing public capsules (read-only)
 */
export function usePublicCapsules(filter?: Omit<CapsuleFilter, 'visibility'>) {
  return useQuery({
    queryKey: ['public-capsules', filter],
    queryFn: async () => {
      let query = supabase
        .from('capsules')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      // Apply filters (same logic as useUserCapsules)
      if (filter?.tags && filter.tags.length > 0) {
        query = query.contains('tags', filter.tags);
      }

      if (filter?.grief_score_min !== undefined) {
        query = query.gte('grief_score', filter.grief_score_min);
      }

      if (filter?.grief_score_max !== undefined) {
        query = query.lte('grief_score', filter.grief_score_max);
      }

      if (filter?.search) {
        query = query.or(`title.ilike.%${filter.search}%, description.ilike.%${filter.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching public capsules:', error);
        throw error;
      }

      return data as Capsule[];
    }
  });
}

/**
 * Hook for accessing a single capsule by ID
 */
export function useCapsule(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['capsule', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('capsules')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching capsule:', error);
        throw error;
      }

      return data as Capsule;
    },
    enabled: !!id
  });
}