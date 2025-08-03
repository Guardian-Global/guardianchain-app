import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Star, Calendar, UserPlus, Settings } from "lucide-react";

interface ProfileHeaderProps {
  profile: {
    id: string;
    wallet: string;
    username: string;
    displayName: string;
    bio: string;
    avatar: string;
    coverImage?: string;
    truthScore: number;
    reputation: number;
    joinedAt: string;
    isVerified: boolean;
    badges: number;
    capsuleCount: number;
    friendCount: number;
  };
  isOwnProfile?: boolean;
}

export default function ProfileHeader({ profile, isOwnProfile = false }: ProfileHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getTruthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400 border-green-500";
    if (score >= 75) return "text-blue-400 border-blue-500";
    if (score >= 60) return "text-yellow-400 border-yellow-500";
    return "text-red-400 border-red-500";
  };

  return (
    <Card className="bg-brand-secondary border-brand-surface overflow-hidden">
      {/* Cover Image */}
      {profile.coverImage && (
        <div 
          className="h-32 bg-gradient-to-r from-brand-primary to-brand-accent"
          style={{
            backgroundImage: `url(${profile.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.displayName}
                className="w-24 h-24 rounded-full border-4 border-brand-surface shadow-lg"
                data-testid="img-avatar"
              />
              {profile.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left mt-4">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-2xl font-bold text-brand-light" data-testid="text-display-name">
                  {profile.displayName}
                </h1>
                {profile.isVerified && (
                  <Badge variant="outline" className="text-green-400 border-green-500">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <p className="text-brand-light/60 mt-1" data-testid="text-username">
                @{profile.username}
              </p>
              
              <p className="text-sm text-brand-light/40 mt-1" data-testid="text-wallet">
                {profile.wallet.substring(0, 6)}...{profile.wallet.substring(-4)}
              </p>
            </div>
          </div>

          {/* Profile Stats and Info */}
          <div className="flex-1 space-y-4">
            {/* Bio */}
            <p className="text-brand-light/80" data-testid="text-bio">
              {profile.bio}
            </p>

            {/* Key Metrics */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getTruthScoreColor(profile.truthScore)}>
                  <Star className="w-3 h-3 mr-1" />
                  Truth Score: {profile.truthScore}%
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-brand-light/60">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(profile.joinedAt)}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-brand-light" data-testid="text-capsule-count">
                  {profile.capsuleCount}
                </div>
                <div className="text-xs text-brand-light/60">Capsules</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-brand-light" data-testid="text-friend-count">
                  {profile.friendCount}
                </div>
                <div className="text-xs text-brand-light/60">Friends</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-brand-light" data-testid="text-badge-count">
                  {profile.badges}
                </div>
                <div className="text-xs text-brand-light/60">Badges</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              {isOwnProfile ? (
                <Button
                  variant="outline"
                  className="border-brand-light/20 text-brand-light hover:bg-brand-light/10"
                  data-testid="button-edit-profile"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <Button
                  className="bg-brand-primary hover:bg-brand-primary/80"
                  data-testid="button-add-friend"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}