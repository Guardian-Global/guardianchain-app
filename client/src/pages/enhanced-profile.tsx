import { useState } from "react";
import { useParams } from "wouter";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Mail,
  ExternalLink,
  Award,
  Trophy,
  TrendingUp,
  Edit,
  Coins,
  Shield,
} from "lucide-react";

const mockProfile = {
  username: "TruthSeeker_007",
  griefScore: 7314,
  gttBalance: 1280,
  capsulesOwned: 12,
  sealsCreated: 9,
  daoVotesCast: 4,
  avatar: "/api/placeholder/150/150",
  bio: "Dedicated guardian protecting truth in the digital age. Expert in verification and blockchain governance.",
  location: "Decentralized Network",
  email: "guardian@guardianchain.org",
  joinedAt: "2024-01-15",
  badges: [
    "Genesis Verified",
    "Top Voter",
    "Seal Creator",
    "Truth Pioneer",
    "DAO Guardian",
  ],
};

const mockNFTs = [
  {
    id: 1,
    image: "/api/placeholder/300/300",
    title: "Veritas Capsule #001",
    griefScore: 95,
    description: "First verified truth capsule",
  },
  {
    id: 2,
    image: "/api/placeholder/300/300",
    title: "Guardian Seal #042",
    griefScore: 88,
    description: "DocuSign verified document",
  },
  {
    id: 3,
    image: "/api/placeholder/300/300",
    title: "Truth Archive #156",
    griefScore: 92,
    description: "Community verified content",
  },
];

export default function EnhancedProfile() {
  const params = useParams();
  const { address } = useAccount();
  const [profile, setProfile] = useState(mockProfile);
  const [editing, setEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState(profile.username);
  const [bioInput, setBioInput] = useState(profile.bio);

  const saveProfile = () => {
    setProfile({
      ...profile,
      username: usernameInput,
      bio: bioInput,
    });
    setEditing(false);
  };

  const statCards = [
    {
      title: "GTT Balance",
      value: `${profile.gttBalance.toLocaleString()}`,
      subtitle: "GTT Tokens",
      icon: Coins,
      color: "from-yellow-600 to-yellow-500",
      textColor: "text-yellow-400",
    },
    {
      title: "Grief Score",
      value: profile.griefScore.toLocaleString(),
      subtitle: "Truth Rating",
      icon: Shield,
      color: "from-green-600 to-green-500",
      textColor: "text-green-400",
    },
    {
      title: "Capsules Owned",
      value: profile.capsulesOwned.toString(),
      subtitle: "NFT Collection",
      icon: Trophy,
      color: "from-blue-600 to-blue-500",
      textColor: "text-blue-400",
    },
    {
      title: "Seals Created",
      value: profile.sealsCreated.toString(),
      subtitle: "Verified Documents",
      icon: Award,
      color: "from-purple-600 to-purple-500",
      textColor: "text-purple-400",
    },
    {
      title: "DAO Votes",
      value: profile.daoVotesCast.toString(),
      subtitle: "Governance Participation",
      icon: TrendingUp,
      color: "from-red-600 to-red-500",
      textColor: "text-red-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header with GuardianChain Branding */}
        <Card className="mb-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-purple-500/30 shadow-lg shadow-purple-500/10">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-purple-500/30">
                  <AvatarImage src={profile.avatar} alt={profile.username} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                    {profile.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">
                    {profile.username}
                  </h1>
                  <Badge className="bg-purple-600 text-white">Guardian</Badge>
                </div>

                <p className="text-slate-300 mb-4 max-w-2xl">{profile.bio}</p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Guardian since{" "}
                    {new Date(profile.joinedAt).toLocaleDateString()}
                  </div>
                  {address && (
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Dialog open={editing} onOpenChange={setEditing}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Edit Guardian Profile
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username" className="text-slate-300">
                          Username
                        </Label>
                        <Input
                          id="username"
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio" className="text-slate-300">
                          Bio
                        </Label>
                        <Input
                          id="bio"
                          value={bioInput}
                          onChange={(e) => setBioInput(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <Button
                        onClick={saveProfile}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid with Enhanced Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.subtitle}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Badges Section */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Guardian Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {profile.badges.map((badge, idx) => (
                  <Badge
                    key={idx}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm font-medium"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Create Capsule
              </Button>
              <Button
                variant="outline"
                className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
              >
                Verify Content
              </Button>
              <Button
                variant="outline"
                className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
              >
                Mint NFT
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* NFT Capsule Gallery */}
        <Card className="mt-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 w-5 text-gold-400" />
              Veritas Capsule NFT Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className="bg-slate-700/30 border-slate-600 hover:border-purple-500/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="aspect-square rounded-lg overflow-hidden mb-4">
                      <img
                        src={nft.image}
                        alt={nft.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-white mb-2">
                      {nft.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-3">
                      {nft.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-600 text-white">
                        Score: {nft.griefScore}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
