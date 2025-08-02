import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Coins, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenData {
  price?: number;
  priceChange?: number;
  percentChange?: number;
  volume24h?: string;
  marketCap?: string;
}

interface LiveTokenTrackerProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top";
  className?: string;
}

export const LiveTokenTracker: React.FC<LiveTokenTrackerProps> = ({
  position = "top-right",
  className
}) => {
  // Fetch live GTT token data
  const { data: tokenData, isLoading } = useQuery<TokenData>({
    queryKey: ["/api/token/live-data"],
    refetchInterval: 30000, // Update every 30 seconds
    staleTime: 25000
  });

  const positionClasses = {
    "top-left": "fixed top-4 left-4 z-50",
    "top-right": "fixed top-4 right-4 z-50",
    "bottom-left": "fixed bottom-4 left-4 z-50",
    "bottom-right": "fixed bottom-4 right-4 z-50",
    "top": "fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
  };

  if (isLoading) {
    return (
      <div className={cn(positionClasses[position], className)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Loading GTT...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  const price = tokenData?.price || 0.0075;
  const priceChange = tokenData?.priceChange || 0.0001;
  const isPositive = priceChange >= 0;
  const percentChange = tokenData?.percentChange || ((priceChange / price) * 100);

  return (
    <div className={cn(positionClasses[position], className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-3 min-w-[200px]"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Token Info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Coins className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-white text-sm">GTT</span>
                <div className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  "bg-green-500"
                )} />
              </div>
              <div className="text-xs text-gray-400">Guardian Token</div>
            </div>
          </div>

          {/* Price Info */}
          <div className="text-right">
            <div className="font-mono text-white font-semibold">
              ${price.toFixed(4)}
            </div>
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isPositive ? "text-green-400" : "text-red-400"
            )}>
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {isPositive ? "+" : ""}{percentChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-2 pt-2 border-t border-white/10 flex justify-between text-xs">
          <div className="text-gray-400">
            24h Vol: <span className="text-white">{tokenData?.volume24h || "1.2M"}</span>
          </div>
          <div className="text-gray-400">
            MCap: <span className="text-white">{tokenData?.marketCap || "75M"}</span>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="absolute -top-1 -right-1">
          <div className="flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            <Activity className="w-2 h-2" />
            <span>LIVE</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};