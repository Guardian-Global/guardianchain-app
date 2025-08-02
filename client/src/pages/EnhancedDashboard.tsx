import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Award, 
  Coins, 
  Globe, 
  Activity,
  Zap,
  Lock,
  Star,
  Target,
  Crown
} from "lucide-react";
import EnhancedLayout from "@/components/layout/EnhancedLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { MetricCard, ProgressRing, DataVisualization, StatGrid } from "@/components/ui/advanced-data-display";
import { AchievementBadge, ProgressBar, TierDisplay } from "@/components/ui/gamification-elements";
import { AdvancedCard, AdvancedCardContent, AdvancedCardHeader, AdvancedCardTitle } from "@/components/ui/advanced-card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Link } from "wouter";

const EnhancedDashboard: React.FC = () => {
  const { user } = useAuth();

  // Fetch user stats
  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
    refetchInterval: 30000
  });

  // Fetch recent capsules
  const { data: recentCapsules } = useQuery({
    queryKey: ["/api/capsules/recent"],
    refetchInterval: 60000
  });

  // Fetch GTT data
  const { data: tokenData } = useQuery({
    queryKey: ["/api/token/live-data"],
    refetchInterval: 30000
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Mock data for demonstration
  const achievements = [
    {
      title: "Truth Seeker",
      description: "Created your first capsule",
      rarity: "common" as const,
      unlocked: true,
      icon: Shield
    },
    {
      title: "Sovereign Guardian",
      description: "Earned 1000 GTT tokens",
      rarity: "rare" as const,
      unlocked: false,
      progress: 75,
      icon: Crown
    },
    {
      title: "Master Validator",
      description: "Verified 100 truth capsules",
      rarity: "epic" as const,
      unlocked: false,
      progress: 30,
      icon: Award
    }
  ];

  const capsuleData = [
    { label: "Truth", value: 45, color: "#06b6d4" },
    { label: "Memory", value: 32, color: "#8b5cf6" },
    { label: "Testimony", value: 23, color: "#f59e0b" },
    { label: "Evidence", value: 18, color: "#ef4444" }
  ];

  const quickStats = [
    { label: "Capsules", value: userStats?.capsulesCreated || 0, icon: Shield, color: "#06b6d4" },
    { label: "GTT Earned", value: userStats?.gttEarned || 0, icon: Coins, color: "#f59e0b" },
    { label: "Truth Score", value: userStats?.truthScore || 0, icon: Star, color: "#8b5cf6" },
    { label: "Verifications", value: userStats?.verificationsCount || 0, icon: Award, color: "#10b981" }
  ];

  const tierInfo = {
    currentTier: {
      name: user?.tier || "EXPLORER",
      level: 1,
      color: "#06b6d4",
      icon: Shield
    },
    nextTier: {
      name: "SEEKER",
      level: 2,
      color: "#8b5cf6",
      icon: Target
    }
  };

  return (
    <AuthGuard>
      <EnhancedLayout variant="dashboard" showNavigation={true}>
        <div className="lg:ml-72 min-h-screen p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.firstName || "Guardian"}
                  </h1>
                  <p className="text-gray-400">
                    Your sovereign memory vault awaits
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Link href="/create">
                    <EnhancedButton variant="quantum" size="lg">
                      <Shield className="w-5 h-5 mr-2" />
                      Create Capsule
                    </EnhancedButton>
                  </Link>
                  
                  <Link href="/vault">
                    <EnhancedButton variant="glass" size="lg">
                      <Lock className="w-5 h-5 mr-2" />
                      Open Vault
                    </EnhancedButton>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div variants={itemVariants}>
              <StatGrid 
                stats={quickStats}
                columns={4}
                className="mb-8"
              />
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Performance Metrics */}
                <motion.div variants={itemVariants}>
                  <AdvancedCard variant="glass">
                    <AdvancedCardHeader>
                      <AdvancedCardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        Performance Overview
                      </AdvancedCardTitle>
                    </AdvancedCardHeader>
                    <AdvancedCardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard
                          title="Truth Score"
                          value={userStats?.truthScore || 87}
                          change={{ value: 12, type: "increase" }}
                          icon={Star}
                          variant="success"
                        />
                        <MetricCard
                          title="GTT Balance"
                          value={`${userStats?.gttEarned || 12547} GTT`}
                          change={{ value: 8, type: "increase" }}
                          icon={Coins}
                          variant="warning"
                        />
                        <MetricCard
                          title="Network Rank"
                          value={`#${userStats?.networkRank || 42}`}
                          change={{ value: 3, type: "increase" }}
                          icon={TrendingUp}
                          variant="default"
                        />
                      </div>
                    </AdvancedCardContent>
                  </AdvancedCard>
                </motion.div>

                {/* Capsule Analytics */}
                <motion.div variants={itemVariants}>
                  <AdvancedCard variant="glass">
                    <AdvancedCardHeader>
                      <AdvancedCardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-400" />
                        Capsule Distribution
                      </AdvancedCardTitle>
                    </AdvancedCardHeader>
                    <AdvancedCardContent>
                      <DataVisualization
                        data={capsuleData}
                        title="Capsule Types"
                        type="bar"
                      />
                    </AdvancedCardContent>
                  </AdvancedCard>
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={itemVariants}>
                  <AdvancedCard variant="glass">
                    <AdvancedCardHeader>
                      <AdvancedCardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-400" />
                        Recent Activity
                      </AdvancedCardTitle>
                    </AdvancedCardHeader>
                    <AdvancedCardContent>
                      <div className="space-y-4">
                        {recentCapsules?.slice(0, 5).map((capsule: any, index: number) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-white">
                                {capsule?.title || `Truth Capsule #${index + 1}`}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {capsule?.type || "Memory"} • Sealed 2 hours ago
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-400">+50 GTT</p>
                              <p className="text-xs text-gray-500">Verified</p>
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-8 text-gray-400">
                            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No capsules yet. Create your first truth capsule!</p>
                          </div>
                        )}
                      </div>
                    </AdvancedCardContent>
                  </AdvancedCard>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Tier Progress */}
                <motion.div variants={itemVariants}>
                  <TierDisplay
                    currentTier={tierInfo.currentTier}
                    nextTier={tierInfo.nextTier}
                    progress={userStats?.tierProgress || 750}
                    maxProgress={1000}
                  />
                </motion.div>

                {/* GTT Yield */}
                <motion.div variants={itemVariants}>
                  <AdvancedCard variant="glass">
                    <AdvancedCardHeader>
                      <AdvancedCardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        GTT Yield
                      </AdvancedCardTitle>
                    </AdvancedCardHeader>
                    <AdvancedCardContent className="text-center">
                      <ProgressRing
                        progress={userStats?.yieldProgress || 68}
                        size={120}
                        color="#f59e0b"
                        label="Annual Yield"
                      />
                      <div className="mt-4 space-y-2">
                        <p className="text-2xl font-bold text-white">
                          {tokenData?.yield || "12.3"}% APY
                        </p>
                        <p className="text-sm text-gray-400">
                          Based on your truth score and capsule quality
                        </p>
                      </div>
                    </AdvancedCardContent>
                  </AdvancedCard>
                </motion.div>

                {/* Achievements */}
                <motion.div variants={itemVariants}>
                  <AdvancedCard variant="glass">
                    <AdvancedCardHeader>
                      <AdvancedCardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-orange-400" />
                        Achievements
                      </AdvancedCardTitle>
                    </AdvancedCardHeader>
                    <AdvancedCardContent>
                      <div className="space-y-4">
                        {achievements.map((achievement, index) => (
                          <AchievementBadge
                            key={index}
                            {...achievement}
                            className="w-full"
                          />
                        ))}
                      </div>
                    </AdvancedCardContent>
                  </AdvancedCard>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants}>
                  <AdvancedCard variant="glass">
                    <AdvancedCardHeader>
                      <AdvancedCardTitle>Quick Actions</AdvancedCardTitle>
                    </AdvancedCardHeader>
                    <AdvancedCardContent>
                      <div className="space-y-3">
                        <Link href="/verify">
                          <EnhancedButton variant="glass" size="sm" className="w-full justify-start">
                            <Users className="w-4 h-4 mr-2" />
                            Verify Capsules
                          </EnhancedButton>
                        </Link>
                        <Link href="/governance">
                          <EnhancedButton variant="glass" size="sm" className="w-full justify-start">
                            <Globe className="w-4 h-4 mr-2" />
                            DAO Governance
                          </EnhancedButton>
                        </Link>
                        <Link href="/analytics">
                          <EnhancedButton variant="glass" size="sm" className="w-full justify-start">
                            <Activity className="w-4 h-4 mr-2" />
                            View Analytics
                          </EnhancedButton>
                        </Link>
                      </div>
                    </AdvancedCardContent>
                  </AdvancedCard>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </EnhancedLayout>
    </AuthGuard>
  );
};

export default EnhancedDashboard;