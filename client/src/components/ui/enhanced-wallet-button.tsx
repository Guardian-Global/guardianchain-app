import React from "react";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Wallet, 
  User, 
  LogOut, 
  Settings, 
  Shield, 
  Coins,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnhancedWalletButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function EnhancedWalletButton({
  className,
  size = "md",
  variant = "default",
}: EnhancedWalletButtonProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    isCorrectChain,
    switchToPolygon,
    chainName,
    error,
  } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Loading state
  if (isConnecting) {
    return (
      <Button
        disabled
        variant={variant}
        size={size}
        className={cn("gap-2", className)}
      >
        <RefreshCw className="h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  // Error state
  if (error) {
    return (
      <Button
        onClick={connect}
        variant="destructive"
        size={size}
        className={cn("gap-2", className)}
      >
        <AlertTriangle className="h-4 w-4" />
        Retry Connection
      </Button>
    );
  }

  // Authenticated user with wallet connected
  if (isAuthenticated && isConnected && address && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn("gap-2 flex items-center", className)}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.profileImageUrl} />
              <AvatarFallback>
                {user.firstName?.[0] || user.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">
                {user.firstName || formatAddress(address)}
              </span>
              <div className="flex items-center gap-1">
                <Badge variant={isCorrectChain ? "default" : "destructive"} className="text-xs">
                  {chainName}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {user.tier}
                </Badge>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* User Stats */}
          <div className="px-2 py-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Truth Score
              </span>
              <span className="font-medium">{user.truthScore || 0}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Coins className="h-3 w-3" />
                GTT Balance
              </span>
              <span className="font-medium">{user.gttBalance || 0}</span>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Wallet Info */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between text-xs">
              <span>Wallet:</span>
              <span className="font-mono">{formatAddress(address)}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span>Network:</span>
              <Badge variant={isCorrectChain ? "default" : "destructive"} className="text-xs">
                {isCorrectChain ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertTriangle className="h-3 w-3 mr-1" />
                )}
                {chainName}
              </Badge>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          
          {!isCorrectChain && (
            <DropdownMenuItem onClick={switchToPolygon}>
              <Wallet className="mr-2 h-4 w-4" />
              Switch to Polygon
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={disconnect}>
            <Wallet className="mr-2 h-4 w-4" />
            Disconnect Wallet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Just wallet connected (no auth)
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant={variant}
          size={size}
          className={cn("gap-2", className)}
          onClick={disconnect}
        >
          <Wallet className="h-4 w-4" />
          {formatAddress(address)}
        </Button>
        
        {!isCorrectChain && (
          <Button
            onClick={switchToPolygon}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Switch Network
          </Button>
        )}
      </div>
    );
  }

  // Just authenticated (no wallet)
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={variant} size={size} className={cn("gap-2", className)}>
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.profileImageUrl} />
                <AvatarFallback>
                  {user.firstName?.[0] || user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              {user.firstName || "User"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={connect} variant="outline" size={size}>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      </div>
    );
  }

  // Neither authenticated nor connected
  return (
    <div className="flex items-center gap-2">
      <Button onClick={connect} variant={variant} size={size} className={cn("gap-2", className)}>
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    </div>
  );
}

export default EnhancedWalletButton;