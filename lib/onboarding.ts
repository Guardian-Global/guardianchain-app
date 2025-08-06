// lib/onboarding.ts
// Comprehensive user onboarding system with automatic profile initialization

import { supabase } from '@/lib/supabase';
import { logActivity } from '@/lib/analytics';

export interface OnboardingData {
  wallet_address: string;
  email?: string;
  username?: string;
  display_name?: string;
  tier?: 'SEEKER' | 'EXPLORER' | 'CREATOR' | 'SOVEREIGN' | 'ADMIN';
  preferences?: Record<string, any>;
}

export interface OnboardingResult {
  success: boolean;
  profile?: any;
  error?: string;
  isNewUser?: boolean;
}

/**
 * Complete user onboarding flow - creates profile, vault, playlist, and initial GTT balance
 */
export async function onboardUser(data: OnboardingData): Promise<OnboardingResult> {
  try {
    console.log('🔐 Starting user onboarding for:', data.wallet_address);

    // Check if user already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', data.wallet_address)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing profile:', checkError);
      return { success: false, error: checkError.message };
    }

    if (existingProfile) {
      console.log('✅ User already exists, returning existing profile');
      return { 
        success: true, 
        profile: existingProfile, 
        isNewUser: false 
      };
    }

    // Create new user profile
    const profileData = {
      wallet_address: data.wallet_address,
      email: data.email,
      username: data.username || generateUsername(data.wallet_address),
      display_name: data.display_name || data.username || `Guardian ${data.wallet_address.slice(0, 6)}`,
      tier: data.tier || 'SEEKER',
      subscription_status: 'free',
      onboarding_completed: false,
      preferences: {
        theme: 'dark',
        notifications: true,
        privacy: 'private',
        ...data.preferences
      }
    };

    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creating profile:', profileError);
      return { success: false, error: profileError.message };
    }

    console.log('✅ Profile created:', newProfile.wallet_address);

    // Initialize user's GTT balance
    const { error: balanceError } = await supabase
      .from('gtt_balances')
      .insert([{
        wallet_address: data.wallet_address,
        balance: 100, // Welcome bonus
        total_earned: 100,
        total_spent: 0
      }]);

    if (balanceError) {
      console.warn('⚠️ Warning: Could not initialize GTT balance:', balanceError.message);
    }

    // Create welcome playlist
    const { error: playlistError } = await supabase
      .from('playlists')
      .insert([{
        owner_wallet_address: data.wallet_address,
        name: 'My First Capsules',
        description: 'Your journey with GuardianChain begins here',
        is_public: false,
        capsule_ids: []
      }]);

    if (playlistError) {
      console.warn('⚠️ Warning: Could not create welcome playlist:', playlistError.message);
    }

    // Create welcome vault entry
    const { error: vaultError } = await supabase
      .from('vault_entries')
      .insert([{
        owner_wallet_address: data.wallet_address,
        title: 'Welcome to GuardianChain',
        content: 'Your secure digital vault has been initialized. This is where your private memories and documents will be stored.',
        entry_type: 'note',
        is_encrypted: false,
        tags: ['welcome', 'onboarding']
      }]);

    if (vaultError) {
      console.warn('⚠️ Warning: Could not create welcome vault entry:', vaultError.message);
    }

    // Log onboarding activity
    await logActivity(data.wallet_address, 'user_onboarded', {
      tier: profileData.tier,
      registration_method: 'wallet',
      onboarding_timestamp: new Date().toISOString()
    });

    console.log('🎉 User onboarding completed successfully');

    return { 
      success: true, 
      profile: newProfile, 
      isNewUser: true 
    };

  } catch (error) {
    console.error('❌ Onboarding error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown onboarding error' 
    };
  }
}

/**
 * Complete onboarding process - marks user as fully onboarded
 */
export async function completeOnboarding(wallet_address: string, preferences?: Record<string, any>): Promise<boolean> {
  try {
    console.log('🔐 Completing onboarding for:', wallet_address);

    const { error } = await supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
        preferences: preferences || {},
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', wallet_address);

    if (error) {
      console.error('❌ Error completing onboarding:', error);
      return false;
    }

    // Log completion
    await logActivity(wallet_address, 'onboarding_completed', {
      completed_at: new Date().toISOString(),
      preferences_set: !!preferences
    });

    console.log('✅ Onboarding completed for:', wallet_address);
    return true;

  } catch (error) {
    console.error('❌ Error completing onboarding:', error);
    return false;
  }
}

/**
 * Check if user needs onboarding
 */
export async function needsOnboarding(wallet_address: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('wallet_address', wallet_address)
      .single();

    if (error) {
      console.log('🔐 User not found, needs onboarding');
      return true;
    }

    return !data.onboarding_completed;

  } catch (error) {
    console.error('❌ Error checking onboarding status:', error);
    return true; // Default to needing onboarding
  }
}

/**
 * Get user onboarding progress
 */
export async function getOnboardingProgress(wallet_address: string) {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', wallet_address)
      .single();

    if (!profile) {
      return {
        hasProfile: false,
        hasBalance: false,
        hasPlaylist: false,
        hasVaultEntry: false,
        isComplete: false,
        completionPercentage: 0
      };
    }

    // Check GTT balance
    const { data: balance } = await supabase
      .from('gtt_balances')
      .select('*')
      .eq('wallet_address', wallet_address)
      .single();

    // Check playlist
    const { data: playlists } = await supabase
      .from('playlists')
      .select('id')
      .eq('owner_wallet_address', wallet_address)
      .limit(1);

    // Check vault entries
    const { data: vaultEntries } = await supabase
      .from('vault_entries')
      .select('id')
      .eq('owner_wallet_address', wallet_address)
      .limit(1);

    const progress = {
      hasProfile: true,
      hasBalance: !!balance,
      hasPlaylist: !!(playlists && playlists.length > 0),
      hasVaultEntry: !!(vaultEntries && vaultEntries.length > 0),
      isComplete: profile.onboarding_completed
    };

    const completedSteps = Object.values(progress).filter(Boolean).length;
    const completionPercentage = (completedSteps / 5) * 100;

    return {
      ...progress,
      completionPercentage
    };

  } catch (error) {
    console.error('❌ Error getting onboarding progress:', error);
    return {
      hasProfile: false,
      hasBalance: false,
      hasPlaylist: false,
      hasVaultEntry: false,
      isComplete: false,
      completionPercentage: 0
    };
  }
}

/**
 * Generate a unique username from wallet address
 */
function generateUsername(wallet_address: string): string {
  const base = wallet_address.slice(2, 8).toLowerCase();
  const timestamp = Date.now().toString().slice(-4);
  return `guardian_${base}_${timestamp}`;
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(wallet_address: string, preferences: Record<string, any>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        preferences,
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', wallet_address);

    if (error) {
      console.error('❌ Error updating preferences:', error);
      return false;
    }

    await logActivity(wallet_address, 'preferences_updated', { preferences });
    return true;

  } catch (error) {
    console.error('❌ Error updating preferences:', error);
    return false;
  }
}

/**
 * Upgrade user tier
 */
export async function upgradeUserTier(
  wallet_address: string, 
  newTier: 'SEEKER' | 'EXPLORER' | 'CREATOR' | 'SOVEREIGN' | 'ADMIN'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        tier: newTier,
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', wallet_address);

    if (error) {
      console.error('❌ Error upgrading tier:', error);
      return false;
    }

    await logActivity(wallet_address, 'tier_upgraded', { 
      new_tier: newTier,
      upgraded_at: new Date().toISOString()
    });

    console.log(`✅ User ${wallet_address} upgraded to ${newTier}`);
    return true;

  } catch (error) {
    console.error('❌ Error upgrading tier:', error);
    return false;
  }
}