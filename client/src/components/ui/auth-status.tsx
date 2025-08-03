import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Wallet, Shield, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthStatusProps {
  className?: string;
  compact?: boolean;
}

export function AuthStatus({ className, compact = false }: AuthStatusProps) {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { address, isConnected, chainName, isCorrectChain } = useWallet();

  if (authLoading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-8 bg-gray-300 rounded-md"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Card className={cn("border-destructive/20", className)}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCircle className="h-4 w-4" />
            <span>Not authenticated</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge variant="default" className="flex items-center gap-1">
          <UserCircle className="h-3 w-3" />
          {user.tier}
        </Badge>
        {isConnected && (
          <Badge
            variant={isCorrectChain ? "secondary" : "destructive"}
            className="flex items-center gap-1"
          >
            <Wallet className="h-3 w-3" />
            {chainName}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          Guardian Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant="default" className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            {user.tier}
          </Badge>
        </div>

        {/* Truth Score */}
        {user.truthScore !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Truth Score</span>
            </div>
            <Badge variant="secondary">{user.truthScore}</Badge>
          </div>
        )}

        {/* GTT Balance */}
        {user.gttBalance !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">GTT Balance</span>
            </div>
            <Badge variant="secondary">{user.gttBalance.toLocaleString()}</Badge>
          </div>
        )}

        {/* Wallet Status */}
        {isConnected && address && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="text-sm">Wallet</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
                <Badge
                  variant={isCorrectChain ? "default" : "destructive"}
                  className="text-xs"
                >
                  {chainName}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Verification Status */}
        {user.isVerified !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm">Verified</span>
            <Badge variant={user.isVerified ? "default" : "secondary"}>
              {user.isVerified ? "✓ Verified" : "Pending"}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AuthStatus;