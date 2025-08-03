import React from "react";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletConnectButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  showBalance?: boolean;
}

export function WalletConnectButton({
  className,
  size = "md",
  variant = "default",
  showBalance = false,
}: WalletConnectButtonProps) {
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

  if (error) {
    return (
      <Button
        onClick={connect}
        variant="destructive"
        size={size}
        className={cn("gap-2", className)}
      >
        <AlertTriangle className="h-4 w-4" />
        Connection Error
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Badge
            variant={isCorrectChain ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {isCorrectChain ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <AlertTriangle className="h-3 w-3" />
            )}
            {chainName}
          </Badge>
          
          <Button
            variant={variant}
            size={size}
            className={cn("gap-2", className)}
            onClick={disconnect}
          >
            <Wallet className="h-4 w-4" />
            {formatAddress(address)}
          </Button>
        </div>

        {!isCorrectChain && (
          <Button
            onClick={switchToPolygon}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Switch to Polygon
          </Button>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={connect}
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}

export default WalletConnectButton;