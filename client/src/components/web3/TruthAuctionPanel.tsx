import React, { useState } from "react";
import { useAccount, useContractWrite, useContractRead } from "wagmi";
import { parseEther, formatEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TRUTH_AUCTION_ABI, getContractAddress } from "@/lib/contracts";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";
import { Gavel, TrendingUp, Clock, Shield, Loader2 } from "lucide-react";

export default function TruthAuctionPanel() {
  const { address, chainId } = useAccount();
  const { toast } = useToast();
  
  const [capsuleHash, setCapsuleHash] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [auctionId, setAuctionId] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const auctionEngineAddress = getContractAddress(chainId || 31337, "auctionEngine");
  
  // Read auction counter
  const { data: auctionCounter } = useContractRead({
    address: auctionEngineAddress,
    abi: TRUTH_AUCTION_ABI,
    functionName: "auctionCounter",
  });

  // Read specific auction data
  const { data: auctionData } = useContractRead({
    address: auctionEngineAddress,
    abi: TRUTH_AUCTION_ABI,
    functionName: "getAuction",
    args: [BigInt(auctionId || 0)],
    enabled: !!auctionId && parseInt(auctionId) > 0,
  });

  // Create Auction
  const { write: createAuction, isLoading: isCreatePending } = useContractWrite({
    address: auctionEngineAddress,
    abi: TRUTH_AUCTION_ABI,
    functionName: "createAuction",
    args: [capsuleHash, parseEther(reservePrice || "0")],
    onSuccess: (data) => {
      toast({
        title: "Auction Created!",
        description: `Transaction hash: ${data.hash}`,
      });
      setCapsuleHash("");
      setReservePrice("");
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Place Bid
  const { write: placeBid, isLoading: isBidPending } = useContractWrite({
    address: auctionEngineAddress,
    abi: TRUTH_AUCTION_ABI,
    functionName: "placeBid",
    args: [BigInt(auctionId || 0)],
    value: parseEther(bidAmount || "0"),
    onSuccess: (data) => {
      toast({
        title: "Bid Placed!",
        description: `Bid of ${bidAmount} ETH placed successfully`,
      });
      setBidAmount("");
    },
    onError: (error) => {
      toast({
        title: "Bid Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Seal Auction
  const { write: sealAuction, isLoading: isSealPending } = useContractWrite({
    address: auctionEngineAddress,
    abi: TRUTH_AUCTION_ABI,
    functionName: "sealAuction",
    args: [BigInt(auctionId || 0)],
    onSuccess: (data) => {
      toast({
        title: "Auction Sealed!",
        description: "Auction completed and funds transferred",
      });
    },
    onError: (error) => {
      toast({
        title: "Seal Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };

  const isAuctionActive = (auction: any) => {
    if (!auction) return false;
    const now = Math.floor(Date.now() / 1000);
    return !auction.complete && !auction.sealed && !auction.cancelled && now < Number(auction.endTime);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Gavel className="w-5 h-5" style={{ color: BRAND_COLORS.GUARDIAN }} />
            {BRAND_NAME} Truth Auction Engine
          </CardTitle>
          <p className="text-slate-400">
            Create auctions for capsule yield rights and participate in truth value discovery
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Total Auctions Created:</span>
            <Badge variant="outline" className="text-white">
              {auctionCounter?.toString() || "0"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Auction */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-4 h-4" style={{ color: BRAND_COLORS.CHAIN }} />
              Create Capsule Auction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="capsuleHash" className="text-white">Capsule Hash</Label>
              <Input
                id="capsuleHash"
                value={capsuleHash}
                onChange={(e) => setCapsuleHash(e.target.value)}
                placeholder="0x1234abcd..."
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservePrice" className="text-white">Reserve Price (ETH)</Label>
              <Input
                id="reservePrice"
                type="number"
                step="0.01"
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
                placeholder="0.1"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <Button
              onClick={() => createAuction?.()}
              disabled={isCreatePending || !createAuction}
              className="w-full"
              style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}
            >
              {isCreatePending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Gavel className="w-4 h-4 mr-2" />
                  Create Auction
                </>
              )}
            </Button>

            <div className="text-xs text-slate-400 space-y-1">
              <p>• Auction duration: 7 days</p>
              <p>• Platform fee: 2.5%</p>
              <p>• Only you can seal the auction</p>
            </div>
          </CardContent>
        </Card>

        {/* Bid on Auction */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-4 h-4" style={{ color: BRAND_COLORS.CHAIN }} />
              Place Bid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auctionId" className="text-white">Auction ID</Label>
              <Input
                id="auctionId"
                type="number"
                value={auctionId}
                onChange={(e) => setAuctionId(e.target.value)}
                placeholder="1"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            {auctionData && (
              <div className="p-3 bg-slate-700/30 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Creator:</span>
                  <span className="text-white font-mono text-xs">
                    {auctionData.creator?.slice(0, 6)}...{auctionData.creator?.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current Bid:</span>
                  <span className="text-white">
                    {formatEther(auctionData.highestBid || 0n)} ETH
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Reserve:</span>
                  <span className="text-white">
                    {formatEther(auctionData.reservePrice || 0n)} ETH
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status:</span>
                  <Badge variant={isAuctionActive(auctionData) ? "default" : "destructive"}>
                    {isAuctionActive(auctionData) ? "Active" : "Ended"}
                  </Badge>
                </div>
                {auctionData.endTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Ends:</span>
                    <span className="text-white text-xs">
                      {formatTimestamp(auctionData.endTime)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="bidAmount" className="text-white">Your Bid (ETH)</Label>
              <Input
                id="bidAmount"
                type="number"
                step="0.01"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="0.15"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => placeBid?.()}
                disabled={isBidPending || !placeBid}
                variant="outline"
                className="border-slate-600"
              >
                {isBidPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Bidding...
                  </>
                ) : (
                  "Place Bid"
                )}
              </Button>

              <Button
                onClick={() => sealAuction?.()}
                disabled={isSealPending || !sealAuction}
                style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}
              >
                {isSealPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sealing...
                  </>
                ) : (
                  "Seal Auction"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}