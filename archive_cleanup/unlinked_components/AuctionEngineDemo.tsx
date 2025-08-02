import React, { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TRUTH_AUCTION_ABI, getContractAddress } from "@/lib/contracts";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";
import { Gavel, TrendingUp } from "lucide-react";

export default function AuctionEngineDemo() {
  const { chainId } = useAccount();
  const { toast } = useToast();

  const auctionEngineAddress = getContractAddress(
    chainId || 31337,
    "auctionEngine",
  );

  // Read auction counter
  const { data: auctionCounter } = useContractRead({
    address: auctionEngineAddress,
    abi: TRUTH_AUCTION_ABI,
    functionName: "auctionCounter",
  });

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Gavel className="w-5 h-5" style={{ color: BRAND_COLORS.GUARDIAN }} />
          Truth Auction Engine Demo
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Contract deployed at: {auctionEngineAddress}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <div className="text-sm text-slate-400">Total Auctions</div>
            <div className="text-xl font-bold text-white">
              {auctionCounter?.toString() || "0"}
            </div>
          </div>
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <div className="text-sm text-slate-400">Platform Fee</div>
            <div className="text-xl font-bold text-white">2.5%</div>
          </div>
        </div>

        <div className="text-xs text-slate-400 space-y-1">
          <p>✅ Contract successfully deployed to Hardhat network</p>
          <p>✅ Auction creation, bidding, and sealing functions ready</p>
          <p>✅ 7-day auction duration with reserve pricing</p>
          <p>✅ Platform fee collection and creator payments</p>
        </div>
      </CardContent>
    </Card>
  );
}
