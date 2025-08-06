// lib/analytics.ts
// User activity logging system

import { supabase } from './supabase';

export interface ActivityData {
  [key: string]: any;
}

/**
 * Log user activity to the database
 */
export async function logActivity(
  userWalletAddress: string,
  activityType: string,
  activityData: ActivityData = {},
  ipAddress?: string,
  userAgent?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_activities')
      .insert([{
        user_wallet_address: userWalletAddress,
        activity_type: activityType,
        activity_data: activityData,
        ip_address: ipAddress,
        user_agent: userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined)
      }]);

    if (error) {
      console.error('❌ Error logging activity:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Analytics error:', error);
    return false;
  }
}

/**
 * Get user activity summary
 */
export async function getUserActivitySummary(
  userWalletAddress: string,
  days: number = 30
) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('user_activities')
      .select('activity_type, created_at')
      .eq('user_wallet_address', userWalletAddress)
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

    return {
      totalActivities: data.length,
      activityCounts,
      recentActivities: data.slice(0, 10),
      lastActivity: data[0]?.created_at || null
    };
  } catch (error) {
    console.error('❌ Error getting activity summary:', error);
    return null;
  }
}