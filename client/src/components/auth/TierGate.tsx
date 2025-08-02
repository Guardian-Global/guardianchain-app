import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, Star, Zap, Lock } from "lucide-react";
import { Link } from "wouter";

interface TierGateProps {
  requiredTier: string;
  children: React.ReactNode;
  fallbackMessage?: string;
}

const TIER_HIERARCHY = {
  EXPLORER: 1,
  SEEKER: 2,
  CREATOR: 3,
  SOVEREIGN: 4,
};

const TIER_ICONS = {
  EXPLORER: Shield,
  SEEKER: Star,
  CREATOR: Zap,
  SOVEREIGN: Crown,
};

const TIER_COLORS = {
  EXPLORER: "text-blue-400",
  SEEKER: "text-purple-400",
  CREATOR: "text-green-400",
  SOVEREIGN: "text-yellow-400",
};

export function TierGate({
  requiredTier,
  children,
  fallbackMessage,
}: TierGateProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 max-w-md mx-auto">
        <CardHeader className="text-center">
          <Lock className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Please sign in to access this feature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => (window.location.href = "/api/login")}
          >
            Sign in with Replit
          </Button>
        </CardContent>
      </Card>
    );
  }

  const userTier = user.tier || "EXPLORER";
  const userTierLevel =
    TIER_HIERARCHY[userTier as keyof typeof TIER_HIERARCHY] || 1;
  const requiredTierLevel =
    TIER_HIERARCHY[requiredTier as keyof typeof TIER_HIERARCHY] || 1;

  if (userTierLevel >= requiredTierLevel) {
    return <>{children}</>;
  }

  const RequiredIcon = TIER_ICONS[requiredTier as keyof typeof TIER_ICONS];
  const requiredColor = TIER_COLORS[requiredTier as keyof typeof TIER_COLORS];

  return (
    <Card className="bg-slate-800/50 border-slate-700 max-w-md mx-auto">
      <CardHeader className="text-center">
        <RequiredIcon className={`h-12 w-12 mx-auto mb-4 ${requiredColor}`} />
        <CardTitle>Tier Upgrade Required</CardTitle>
        <CardDescription>
          {fallbackMessage ||
            `This feature requires ${requiredTier} tier or higher`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Your Tier:</span>
          <Badge variant="outline" className="text-slate-400">
            {userTier}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Required Tier:</span>
          <Badge className={requiredColor}>{requiredTier}</Badge>
        </div>
        <Button className="w-full" asChild>
          <Link href="/upgrade">Upgrade to {requiredTier}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
