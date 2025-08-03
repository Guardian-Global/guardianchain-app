import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileTabs from "@/components/profile/ProfileTabs";
import CapsuleReels from "@/components/profile/CapsuleReels";
import ProfileMediaUploader from "@/components/profile/ProfileMediaUploader";
import FriendInviteCard from "@/components/profile/FriendInviteCard";
import MemoryRecallAI from "@/components/profile/MemoryRecallAI";
import ActivityTimeline from "@/components/profile/ActivityTimeline";
import VerifiedCapsulesGrid from "@/components/profile/VerifiedCapsulesGrid";
import SocialLinksCard from "@/components/profile/SocialLinksCard";
import ProfileThemeToggle from "@/components/profile/ProfileThemeToggle";
import { getUserProfile, getUserCapsules, getUserBadges, getFriends } from "@/lib/profile-api";
import { useAuth } from "@/hooks/useAuth";

export default function EnhancedProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("capsules");
  
  // For demo purposes, using a mock wallet address
  const walletAddress = user?.id || "0x1234567890abcdef1234567890abcdef12345678";

  // Fetch profile data
  const { data: profile } = useQuery({
    queryKey: [`/api/profile/${walletAddress}`],
    queryFn: () => getUserProfile(walletAddress),
  });

  const { data: capsules = [] } = useQuery({
    queryKey: [`/api/profile/${walletAddress}/capsules`],
    queryFn: () => getUserCapsules(walletAddress),
  });

  const { data: badges = [] } = useQuery({
    queryKey: [`/api/profile/${walletAddress}/badges`],
    queryFn: () => getUserBadges(walletAddress),
  });

  const { data: friends = [] } = useQuery({
    queryKey: [`/api/profile/${walletAddress}/friends`],
    queryFn: () => getFriends(walletAddress),
  });

  if (!profile) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-brand-light">Loading enhanced profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const verifiedCapsules = capsules.filter((c: any) => c.verified);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <PageHeader 
          title="Enhanced Profile"
          description="Complete guardian profile with AI-powered features"
        />

        {/* Profile Header with Theme Toggle */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <ProfileHeader profile={profile} isOwnProfile={true} />
            </div>
            <div className="ml-4 flex flex-col gap-4">
              <ProfileThemeToggle />
              <SocialLinksCard profile={profile} />
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <ProfileStats capsules={capsules} badges={badges} friends={friends} />

        {/* Profile Tabs */}
        <ProfileTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOwnProfile={true}
        />

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "capsules" && (
            <div className="space-y-8">
              <CapsuleReels capsules={capsules} />
              {verifiedCapsules.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-brand-light">Verified Capsules</h3>
                  <VerifiedCapsulesGrid capsules={verifiedCapsules} />
                </div>
              )}
            </div>
          )}

          {activeTab === "media" && (
            <div className="grid lg:grid-cols-2 gap-8">
              <ProfileMediaUploader userId={profile.id} />
              <MemoryRecallAI userId={profile.id} />
            </div>
          )}

          {activeTab === "friends" && (
            <FriendInviteCard friends={friends} userId={profile.id} />
          )}

          {activeTab === "badges" && (
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {badges.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-brand-light/60">No badges earned yet</p>
                  <p className="text-xs text-brand-light/40 mt-2">
                    Complete activities to earn achievement badges
                  </p>
                </div>
              ) : (
                badges.map((badge: any) => (
                  <div
                    key={badge.id}
                    className="bg-brand-secondary border border-brand-surface rounded-xl p-4 text-center hover:border-brand-accent/50 transition-colors"
                    data-testid={`badge-${badge.id}`}
                  >
                    <img
                      src={badge.icon}
                      alt={badge.name}
                      className="mx-auto w-16 h-16 rounded-full shadow-md mb-3"
                    />
                    <p className="text-sm font-semibold text-brand-light mb-1">
                      {badge.name}
                    </p>
                    <p className="text-xs text-brand-light/60 mb-2">
                      {badge.description}
                    </p>
                    <div className="text-xs text-brand-accent font-medium capitalize">
                      {badge.rarity}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <ActivityTimeline userId={profile.id} />
          )}

          {activeTab === "settings" && (
            <div className="text-center py-8">
              <p className="text-brand-light/60">Profile settings coming soon</p>
              <p className="text-xs text-brand-light/40 mt-2">
                Advanced profile customization and privacy controls
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}