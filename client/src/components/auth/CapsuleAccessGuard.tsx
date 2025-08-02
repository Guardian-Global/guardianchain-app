import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Crown, Users } from "lucide-react";
import { Link } from "wouter";

interface CapsuleAccessGuardProps {
  children: ReactNode;
  requiredTier: "guest" | "member" | "moderator" | "admin" | "dao-owner";
  fallback?: ReactNode;
}

const tierHierarchy = {
  guest: 0,
  member: 1,
  moderator: 2,
  admin: 3,
  "dao-owner": 4,
};

const tierInfo = {
  guest: {
    name: "Guest",
    icon: Users,
    color: "text-gray-400",
    description: "Browse public content and explore features",
  },
  member: {
    name: "Connected Member",
    icon: Shield,
    color: "text-blue-400",
    description: "Create capsules, earn GTT, and participate in verification",
  },
  moderator: {
    name: "DAO Moderator",
    icon: Crown,
    color: "text-purple-400",
    description:
      "Assign grief tiers, approve Veritas claims, and moderate content",
  },
  admin: {
    name: "Platform Admin",
    icon: Lock,
    color: "text-red-400",
    description:
      "Full capsule management, payment gateway, and system controls",
  },
  "dao-owner": {
    name: "DAO Owner",
    icon: Crown,
    color: "text-yellow-400",
    description: "Complete platform governance and treasury management",
  },
};

function TierUpgradePrompt({
  currentTier,
  requiredTier,
}: {
  currentTier: string;
  requiredTier: string;
}) {
  const RequiredIcon = tierInfo[requiredTier as keyof typeof tierInfo].icon;
  const CurrentIcon = tierInfo[currentTier as keyof typeof tierInfo].icon;

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Access Restricted
          </h3>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <CurrentIcon
                className={`h-4 w-4 ${tierInfo[currentTier as keyof typeof tierInfo].color}`}
              />
              <span className="text-sm">
                Your Tier: {tierInfo[currentTier as keyof typeof tierInfo].name}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <RequiredIcon
                className={`h-4 w-4 ${tierInfo[requiredTier as keyof typeof tierInfo].color}`}
              />
              <span className="text-sm">
                Required: {tierInfo[requiredTier as keyof typeof tierInfo].name}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {tierInfo[requiredTier as keyof typeof tierInfo].description}
        </p>

        <div className="space-y-2">
          {requiredTier === "member" && currentTier === "guest" && (
            <Button asChild className="w-full">
              <Link href="/api/login">
                <Shield className="h-4 w-4 mr-2" />
                Connect Wallet to Continue
              </Link>
            </Button>
          )}

          {tierHierarchy[requiredTier as keyof typeof tierHierarchy] >
            tierHierarchy["member"] && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/tier-access">
                <Crown className="h-4 w-4 mr-2" />
                Learn About Tier Upgrades
              </Link>
            </Button>
          )}

          <Button asChild variant="ghost" className="w-full">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CapsuleAccessGuard({
  children,
  requiredTier,
  fallback,
}: CapsuleAccessGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Determine user's current tier
  const currentTier = user
    ? (user as any).tier?.toLowerCase() || "member"
    : "guest";

  // Check if user has required access level
  const userTierLevel =
    tierHierarchy[currentTier as keyof typeof tierHierarchy] ?? 0;
  const requiredTierLevel = tierHierarchy[requiredTier];

  const hasAccess = userTierLevel >= requiredTierLevel;

  if (!hasAccess) {
    return (
      fallback || (
        <TierUpgradePrompt
          currentTier={currentTier}
          requiredTier={requiredTier}
        />
      )
    );
  }

  return <>{children}</>;
}
