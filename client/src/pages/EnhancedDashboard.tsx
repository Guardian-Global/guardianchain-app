import React from "react";
import { Helmet } from "react-helmet-async";
import MasterDashboard from "@/components/MasterDashboard";

export default function EnhancedDashboardPage() {
  // Mock data for the dashboard - replace with real data from your API
  const mockUserStats = {
    capsulesCreated: 47,
    gttEarned: 12850,
    truthScore: 88,
    rank: 156,
    badges: 12,
    friends: 234,
    achievements: [
      "First Capsule Created",
      "Truth Seeker Badge",
      "Community Validator",
      "GTT Millionaire"
    ]
  };

  const mockPlatformMetrics = {
    totalCapsules: 15678,
    totalUsers: 8943,
    totalGTT: 2450000,
    dailyActiveUsers: 1234,
    weeklyGrowth: 12.5,
    engagementRate: 78,
    verificationRate: 92,
    platformHealth: 98
  };

  const mockPlatformStats = {
    serverStatus: 'healthy' as const,
    uptime: 99.8,
    responseTime: 142,
    errorRate: 0.2,
    activeConnections: 567,
    databaseLoad: 45
  };

  return (
    <>
      <Helmet>
        <title>Enhanced Dashboard | GuardianChain</title>
        <meta name="description" content="Advanced analytics and performance insights for your GuardianChain activity" />
      </Helmet>
      <MasterDashboard 
        userStats={mockUserStats}
        platformMetrics={mockPlatformMetrics}
        platformStats={mockPlatformStats}
        isAdmin={false}
      />
    </>
  );
}