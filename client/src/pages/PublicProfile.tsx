import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import MediaGallery from "@/components/profile/MediaGallery";
import { 
  User, 
  Shield, 
  Trophy, 
  Star, 
  Calendar, 
  MapPin,
  Globe,
  Twitter,
  Github,
  Linkedin,
  Mail,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

interface PublicProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  bio?: string;
  tier: string;
  gttBalance: number;
  truthScore: number;
  verifiedCapsules: number;
  createdAt: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  achievements?: string[];
  isPublic?: boolean;
}

export default function PublicProfile() {
  const [match, params] = useRoute("/profile/:username");
  const username = params?.username;
  const [profileData, setProfileData] = useState<PublicProfileData | null>(null);

  // Fetch public profile data
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['/api/profile/public', username],
    enabled: !!username,
    retry: false
  });

  useEffect(() => {
    if (response) {
      const profileResponse = response as any;
      if (profileResponse.success && profileResponse.profile) {
        setProfileData(profileResponse.profile);
      }
    }
  }, [response]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-purple-900/20 to-hsl(218,54%,9%) text-hsl(180,100%,90%)">
        <div className="max-w-4xl mx-auto p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-700 rounded-lg"></div>
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-purple-900/20 to-hsl(218,54%,9%) text-hsl(180,100%,90%) flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-gray-500 mb-4">
              The requested profile could not be found or is set to private.
            </p>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 'Guardian';
  const initials = `${profileData.firstName?.[0] || ''}${profileData.lastName?.[0] || ''}`.toUpperCase() || 'G';

  return (
    <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-purple-900/20 to-hsl(218,54%,9%) text-hsl(180,100%,90%)">
      <div className="max-w-4xl mx-auto p-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to GuardianChain
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <Card className="mb-8 bg-hsl(218,54%,9%)/80 border-cyan-400/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-cyan-400/30">
                  <AvatarImage 
                    src={profileData.profileImageUrl} 
                    alt={fullName}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-cyan-400 to-purple-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  <Badge className="bg-gradient-to-r from-cyan-400 to-purple-600 text-white">
                    {profileData.tier}
                  </Badge>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  {fullName}
                </h1>
                <p className="text-lg text-cyan-300 mb-4">
                  @{username}
                </p>
                
                {profileData.bio && (
                  <p className="text-gray-300 mb-6 max-w-2xl">
                    {profileData.bio}
                  </p>
                )}

                {/* Location and Website */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-sm text-gray-400">
                  {profileData.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  {profileData.website && (
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={profileData.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                      >
                        {profileData.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profileData.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Social Links */}
                {profileData.socialLinks && (
                  <div className="flex items-center justify-center md:justify-start space-x-4">
                    {profileData.socialLinks.twitter && (
                      <a 
                        href={profileData.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {profileData.socialLinks.github && (
                      <a 
                        href={profileData.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {profileData.socialLinks.linkedin && (
                      <a 
                        href={profileData.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    <a 
                      href={`mailto:${profileData.email}`}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-hsl(218,54%,9%)/80 border-cyan-400/20">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-cyan-400">{profileData.gttBalance}</div>
              <div className="text-sm text-gray-400">GTT Balance</div>
            </CardContent>
          </Card>
          
          <Card className="bg-hsl(218,54%,9%)/80 border-purple-400/20">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">{profileData.truthScore}</div>
              <div className="text-sm text-gray-400">Truth Score</div>
            </CardContent>
          </Card>
          
          <Card className="bg-hsl(218,54%,9%)/80 border-green-400/20">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{profileData.verifiedCapsules}</div>
              <div className="text-sm text-gray-400">Verified Capsules</div>
            </CardContent>
          </Card>
          
          <Card className="bg-hsl(218,54%,9%)/80 border-yellow-400/20">
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">{profileData.tier}</div>
              <div className="text-sm text-gray-400">Guardian Tier</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        {profileData.achievements && profileData.achievements.length > 0 && (
          <Card className="mb-8 bg-hsl(218,54%,9%)/80 border-cyan-400/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profileData.achievements.map((achievement, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="border-yellow-400/50 text-yellow-400"
                  >
                    <Trophy className="w-3 h-3 mr-1" />
                    {achievement}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8 bg-gray-600" />

        {/* Media Gallery */}
        <Card className="bg-hsl(218,54%,9%)/80 border-cyan-400/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>{fullName}'s Truth Gallery</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MediaGallery 
              userId={profileData.id}
              showUploadButton={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}