import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Palette, Star, Crown, Zap, Shield } from "lucide-react";

interface NFTBadge {
  id: string;
  name: string;
  tier: string;
  icon: string;
  color: string;
  earned: boolean;
  description: string;
}

export function NFTAvatarSystem() {
  const [badges] = useState<NFTBadge[]>([
    {
      id: "seeker",
      name: "Truth Seeker",
      tier: "SEEKER",
      icon: "🟣",
      color: "purple",
      earned: true,
      description: "Verified your first truth capsule",
    },
    {
      id: "validator",
      name: "Truth Validator",
      tier: "VALIDATOR",
      icon: "🔵",
      color: "blue",
      earned: false,
      description: "Completed 10 capsule verifications",
    },
    {
      id: "creator",
      name: "Truth Creator",
      tier: "CREATOR",
      icon: "🟡",
      color: "yellow",
      earned: false,
      description: "Created 25 verified capsules",
    },
    {
      id: "truthsmith",
      name: "Truth Smith",
      tier: "SOVEREIGN",
      icon: "🔴",
      color: "red",
      earned: false,
      description: "Achieved Sovereign tier status",
    },
  ]);

  const [nftAvatars] = useState([
    {
      id: 1,
      src: "/assets/icons/nft-avatar/guardian-1.png",
      name: "Cosmic Guardian",
    },
    {
      id: 2,
      src: "/assets/icons/nft-avatar/guardian-2.png",
      name: "Quantum Verifier",
    },
    {
      id: 3,
      src: "/assets/icons/nft-avatar/guardian-3.png",
      name: "Truth Sage",
    },
    {
      id: 4,
      src: "/assets/icons/nft-avatar/guardian-4.png",
      name: "Digital Oracle",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* NFT Avatar Gallery */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-blue-900/20 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Palette className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-white">
                NFT Avatar Collection
              </CardTitle>
              <CardDescription>
                Customize your guardian identity
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {nftAvatars.map((avatar) => (
              <div
                key={avatar.id}
                className="group relative p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                <Avatar className="w-16 h-16 mx-auto mb-3 ring-2 ring-blue-400/50 group-hover:ring-blue-400 transition-all duration-200">
                  <AvatarImage src={avatar.src} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600">
                    {avatar.name[0]}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-center text-white">
                  {avatar.name}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badge System */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-yellow-900/20 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-600/20 rounded-lg">
              <Star className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <CardTitle className="text-white">Achievement Badges</CardTitle>
              <CardDescription>Your truth verification journey</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  badge.earned
                    ? "bg-white/10 border-white/20 shadow-lg"
                    : "bg-white/5 border-white/10 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{badge.name}</h4>
                      {badge.earned && (
                        <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                          Earned
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{badge.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
