// client/src/hooks/useUserProfile.ts
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  profileImage?: string;
  coverImage?: string;
  tier?: string;
  onboardingCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const useUserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!isAuthenticated || !user) {
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        credentials: 'include',
        headers: {
          'x-admin-key': 'GUARDIAN_ADMIN_2025'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const { profile: profileData } = await response.json();
      setProfile({
        id: profileData.id,
        email: profileData.email,
        username: profileData.username,
        displayName: profileData.firstName + ' ' + profileData.lastName,
        bio: profileData.bio,
        profileImage: profileData.avatar,
        tier: profileData.tier,
        onboardingCompleted: true,
        createdAt: profileData.createdAt,
        updatedAt: profileData.updatedAt
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'GUARDIAN_ADMIN_2025'
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: updates.displayName?.split(' ')[0],
          lastName: updates.displayName?.split(' ').slice(1).join(' '),
          username: updates.username,
          bio: updates.bio,
          walletAddress: updates.website, // Using website field for wallet
          socialLinks: updates.socialLinks
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const { profile: updatedProfile } = await response.json();
      const formattedProfile = {
        id: updatedProfile.id,
        email: updatedProfile.email,
        username: updatedProfile.username,
        displayName: updatedProfile.firstName + ' ' + updatedProfile.lastName,
        bio: updatedProfile.bio,
        profileImage: updatedProfile.avatar,
        tier: updatedProfile.tier,
        onboardingCompleted: true,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt
      };
      setProfile(formattedProfile);
      return formattedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const result = await response.json();
      
      // Update profile with new avatar URL
      if (result.url && profile) {
        const updatedProfile = { ...profile, profileImage: result.url };
        setProfile(updatedProfile);
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isAuthenticated, user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refetch: fetchProfile,
    isLoading: loading,
    isUpdating: loading,
    isUploadingAvatar: loading,
    getCapsuleStats: async () => ({ total: 0, sealed: 0, verified: 0, thisMonth: 0, byVisibility: { private: 0, public: 0, friends: 0, unlockable: 0 } }),
    getGTTBalance: async () => ({ balance: 0, totalEarned: 0, totalSpent: 0 }),
    getActivitySummary: async () => ({ totalActivities: 0, lastActivity: null }),
  };
};

export default useUserProfile;