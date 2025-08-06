import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Shield, 
  Trophy, 
  Calendar, 
  Eye, 
  Archive,
  Heart,
  Coins,
  BarChart3,
  Settings,
  Edit3,
  Camera
} from "lucide-react";

interface ProfileData {
  id: string;
  wallet: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  truthScore: number;
  reputation: number;
  joinedAt: string;
  isVerified: boolean;
  badges: number;
  capsuleCount: number;
  friendCount: number;
  gttEarned: number;
  totalViews: number;
  recentActivity: number;
}

interface CapsuleStats {
  totalCapsules: number;
  verifiedCapsules: number;
  timeSealedCapsules: number;
  weeklyActivity: number;
  avgTruthScore: number;
  totalGTT: number;
  totalViews: number;
  engagementRate: number;
}

interface MasterProfileProps {
  profile: ProfileData;
  capsuleStats: CapsuleStats;
  isOwnProfile: boolean;
}

export default function MasterProfile({ profile, capsuleStats, isOwnProfile }: MasterProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6" data-testid="master-profile">
      {/* Header Section */}
      <Card className="bg-brand-surface border-brand-primary/20 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-brand-primary/20 border-2 border-brand-primary/40 flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.displayName}
                    className="w-full h-full object-cover"
                    data-testid="profile-avatar"
                  />
                ) : (
                  <User className="w-12 h-12 md:w-16 md:h-16 text-brand-primary" />
                )}
              </div>
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-brand-surface border-brand-primary/40"
                  data-testid="edit-avatar-button"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-grow space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white" data-testid="profile-display-name">
                    {profile.displayName}
                  </h1>
                  {profile.isVerified && (
                    <Shield className="w-6 h-6 text-brand-accent" data-testid="verified-badge" />
                  )}
                </div>
                <p className="text-brand-text-muted" data-testid="profile-username">
                  @{profile.username}
                </p>
                <p className="text-brand-text-secondary text-sm font-mono" data-testid="profile-wallet">
                  {profile.wallet}
                </p>
              </div>

              {isOwnProfile && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-brand-primary/40 hover:bg-brand-primary/10"
                  data-testid="edit-profile-button"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Bio */}
            <p className="text-brand-text-secondary" data-testid="profile-bio">
              {profile.bio}
            </p>

            {/* Key Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-brand-accent" />
                <span className="text-brand-text-muted">Joined {profile.joinedAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-brand-text-muted">{profile.friendCount} friends</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-brand-text-muted">{profile.totalViews.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-brand-surface border-brand-primary/20 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white" data-testid="truth-score">
            {profile.truthScore}
          </div>
          <div className="text-sm text-brand-text-muted">Truth Score</div>
        </Card>

        <Card className="bg-brand-surface border-brand-primary/20 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <BarChart3 className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white" data-testid="reputation">
            {profile.reputation.toLocaleString()}
          </div>
          <div className="text-sm text-brand-text-muted">Reputation</div>
        </Card>

        <Card className="bg-brand-surface border-brand-primary/20 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Archive className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white" data-testid="capsule-count">
            {profile.capsuleCount}
          </div>
          <div className="text-sm text-brand-text-muted">Capsules</div>
        </Card>

        <Card className="bg-brand-surface border-brand-primary/20 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Coins className="w-6 h-6 text-brand-accent" />
          </div>
          <div className="text-2xl font-bold text-white" data-testid="gtt-earned">
            {profile.gttEarned.toLocaleString()}
          </div>
          <div className="text-sm text-brand-text-muted">GTT Earned</div>
        </Card>
      </div>

      {/* Capsule Stats Section */}
      <Card className="bg-brand-surface border-brand-primary/20 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Capsule Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white" data-testid="total-capsules">
              {capsuleStats.totalCapsules}
            </div>
            <div className="text-sm text-brand-text-muted">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400" data-testid="verified-capsules">
              {capsuleStats.verifiedCapsules}
            </div>
            <div className="text-sm text-brand-text-muted">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400" data-testid="time-sealed-capsules">
              {capsuleStats.timeSealedCapsules}
            </div>
            <div className="text-sm text-brand-text-muted">Time Sealed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-brand-accent" data-testid="avg-truth-score">
              {capsuleStats.avgTruthScore}%
            </div>
            <div className="text-sm text-brand-text-muted">Avg Truth Score</div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="mt-6 pt-6 border-t border-brand-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white" data-testid="weekly-activity">
                {capsuleStats.weeklyActivity}
              </div>
              <div className="text-sm text-brand-text-muted">Weekly Activity</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white" data-testid="total-views">
                {capsuleStats.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-brand-text-muted">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white" data-testid="engagement-rate">
                {capsuleStats.engagementRate}%
              </div>
              <div className="text-sm text-brand-text-muted">Engagement Rate</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Badges Section */}
      <Card className="bg-brand-surface border-brand-primary/20 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Achievement Badges</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-yellow-400/40 text-yellow-400">
            Truth Seeker
          </Badge>
          <Badge variant="outline" className="border-blue-400/40 text-blue-400">
            Verified Creator
          </Badge>
          <Badge variant="outline" className="border-green-400/40 text-green-400">
            Elite Validator
          </Badge>
          <Badge variant="outline" className="border-purple-400/40 text-purple-400">
            DAO Member
          </Badge>
          <Badge variant="outline" className="border-brand-accent/40 text-brand-accent">
            Early Adopter
          </Badge>
          {profile.badges > 5 && (
            <Badge variant="outline" className="border-brand-primary/40 text-brand-primary">
              +{profile.badges - 5} more
            </Badge>
          )}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-brand-surface border-brand-primary/20 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-brand-text-secondary">Created new time-sealed capsule</span>
            <span className="text-brand-text-muted ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-brand-text-secondary">Verified truth claim #1247</span>
            <span className="text-brand-text-muted ml-auto">5 hours ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-brand-text-secondary">Earned 250 GTT from yield</span>
            <span className="text-brand-text-muted ml-auto">1 day ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
}