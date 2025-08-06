// hooks/useUserProfile.ts
// Comprehensive user profile management with real-time sync

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { logActivity } from '@/lib/analytics';

export interface UserProfile {
  id: string;
  wallet_address: string;
  email?: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  social_links?: Record<string, string>;
  tier: 'SEEKER' | 'EXPLORER' | 'CREATOR' | 'SOVEREIGN' | 'ADMIN';
  subscription_status: 'free' | 'active' | 'canceled' | 'expired';
  onboarding_completed: boolean;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  social_links?: Record<string, string>;
  preferences?: Record<string, any>;
}

/**
 * Hook for managing user profile with real-time updates
 */
export function useUserProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);

  // Query for user's profile
  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-profile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', user.email)
        .single();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        throw error;
      }

      return data as UserProfile;
    },
    enabled: !!user?.email
  });

  // Set up real-time subscription for profile updates
  useEffect(() => {
    if (!user?.email) return;

    console.log('🔄 Setting up real-time profile subscription for:', user.email);

    const channel = supabase
      .channel('user-profile')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `wallet_address=eq.${user.email}`
        },
        (payload) => {
          console.log('🔄 Profile updated:', payload.new);
          queryClient.setQueryData(
            ['user-profile', user.email],
            payload.new as UserProfile
          );
        }
      )
      .subscribe();

    setRealtimeChannel(channel);

    return () => {
      console.log('🔌 Cleaning up profile subscription');
      channel.unsubscribe();
    };
  }, [user?.email, queryClient]);

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (updates: UpdateProfileData): Promise<UserProfile> => {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }

      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('wallet_address', user.email)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating profile:', error);
        throw error;
      }

      // Log activity
      await logActivity(user.email, 'profile_updated', {
        updated_fields: Object.keys(updates)
      });

      return updatedProfile as UserProfile;
    },
    onSuccess: (updatedProfile) => {
      console.log('✅ Profile updated successfully');
      // Real-time subscription will handle the cache update
    },
    onError: (error) => {
      console.error('❌ Failed to update profile:', error);
    }
  });

  // Update preferences mutation
  const updatePreferences = useMutation({
    mutationFn: async (preferences: Record<string, any>): Promise<UserProfile> => {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }

      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
          preferences,
          updated_at: new Date().toISOString()
        })
        .eq('wallet_address', user.email)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating preferences:', error);
        throw error;
      }

      // Log activity
      await logActivity(user.email, 'preferences_updated', { preferences });

      return updatedProfile as UserProfile;
    },
    onSuccess: () => {
      console.log('✅ Preferences updated successfully');
    }
  });

  // Upload avatar mutation
  const uploadAvatar = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.email}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('user-assets')
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ Error uploading avatar:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-assets')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('wallet_address', user.email)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating profile with avatar URL:', updateError);
        throw updateError;
      }

      // Log activity
      await logActivity(user.email, 'avatar_updated', { avatar_url: publicUrl });

      return publicUrl;
    },
    onSuccess: (avatarUrl) => {
      console.log('✅ Avatar uploaded successfully:', avatarUrl);
    }
  });

  // Get user's capsule statistics
  const getCapsuleStats = async () => {
    if (!user?.email) return null;

    const { data, error } = await supabase
      .from('capsules')
      .select('id, visibility, is_sealed, verification_status, created_at')
      .eq('owner_wallet_address', user.email);

    if (error) {
      console.error('❌ Error fetching capsule stats:', error);
      return null;
    }

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: data.length,
      sealed: data.filter(c => c.is_sealed).length,
      verified: data.filter(c => c.verification_status === 'verified').length,
      thisMonth: data.filter(c => new Date(c.created_at) >= thisMonth).length,
      byVisibility: {
        private: data.filter(c => c.visibility === 'private').length,
        public: data.filter(c => c.visibility === 'public').length,
        friends: data.filter(c => c.visibility === 'friends').length,
        unlockable: data.filter(c => c.visibility === 'unlockable').length
      }
    };
  };

  // Get user's GTT balance
  const getGTTBalance = async () => {
    if (!user?.email) return null;

    const { data, error } = await supabase
      .from('gtt_balances')
      .select('*')
      .eq('wallet_address', user.email)
      .single();

    if (error) {
      console.error('❌ Error fetching GTT balance:', error);
      return null;
    }

    return {
      balance: parseFloat(data.balance),
      totalEarned: parseFloat(data.total_earned),
      totalSpent: parseFloat(data.total_spent),
      lastCalculatedAt: data.last_calculated_at
    };
  };

  // Get user's activity summary
  const getActivitySummary = async (days: number = 30) => {
    if (!user?.email) return null;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('user_activities')
      .select('activity_type, created_at')
      .eq('user_wallet_address', user.email)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching activity summary:', error);
      return null;
    }

    // Group activities by type
    const activityCounts = data.reduce((acc, activity) => {
      acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group activities by day
    const dailyActivity = data.reduce((acc, activity) => {
      const date = new Date(activity.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalActivities: data.length,
      activityCounts,
      dailyActivity,
      lastActivity: data[0]?.created_at || null
    };
  };

  return {
    // Data
    profile,
    isLoading,
    error,

    // Actions
    updateProfile: updateProfile.mutate,
    updatePreferences: updatePreferences.mutate,
    uploadAvatar: uploadAvatar.mutate,
    refetch,

    // Status
    isUpdating: updateProfile.isPending,
    isUpdatingPreferences: updatePreferences.isPending,
    isUploadingAvatar: uploadAvatar.isPending,

    // Analytics
    getCapsuleStats,
    getGTTBalance,
    getActivitySummary,

    // Real-time connection status
    isConnected: !!realtimeChannel
  };
}

/**
 * Hook for accessing public profiles
 */
export function usePublicProfile(wallet_address: string) {
  return useQuery({
    queryKey: ['public-profile', wallet_address],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('wallet_address, username, display_name, avatar_url, bio, location, social_links, tier, created_at')
        .eq('wallet_address', wallet_address)
        .single();

      if (error) {
        console.error('❌ Error fetching public profile:', error);
        throw error;
      }

      return data;
    },
    enabled: !!wallet_address
  });
}

/**
 * Hook for searching profiles
 */
export function useProfileSearch(query: string, limit: number = 10) {
  return useQuery({
    queryKey: ['profile-search', query, limit],
    queryFn: async () => {
      if (!query.trim()) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('wallet_address, username, display_name, avatar_url, bio, tier')
        .or(`username.ilike.%${query}%, display_name.ilike.%${query}%`)
        .limit(limit);

      if (error) {
        console.error('❌ Error searching profiles:', error);
        throw error;
      }

      return data;
    },
    enabled: !!query.trim()
  });
}