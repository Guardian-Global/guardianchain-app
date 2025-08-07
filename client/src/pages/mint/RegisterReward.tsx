"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Gift, Sparkles, Trophy, CheckCircle } from "lucide-react";
import { apiRequest } from "../../lib/queryClient";

export default function RegisterReward() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [minted, setMinted] = useState(false);
  const [minting, setMinting] = useState(false);
  const [nftDetails, setNftDetails] = useState<any>(null);

  useEffect(() => {
    const mintRegistrationReward = async () => {
      if (!isAuthenticated || !user || minted || minting) return;

      // Check if user already has registration reward
      try {
        const existingReward: any = await apiRequest(`/api/capsule/user-reward-check/${user.id}`);
        if (existingReward?.hasRegistrationReward) {
          setMinted(true);
          setNftDetails(existingReward.rewardDetails);
          return;
        }
      } catch (error) {
        console.log("No existing reward found, proceeding with mint");
      }

      setMinting(true);

      try {
        const mintData = {
          title: "🎉 Welcome to GuardianChain!",
          description: "Your exclusive registration reward NFT capsule. This commemorates your journey into the future of decentralized truth verification and blockchain-based memory storage.",
          content: `Welcome to GuardianChain, ${user.displayName || user.email}! 

This special NFT capsule marks the beginning of your journey in our decentralized truth ecosystem. As a Guardian, you now have the power to:

• Mint Veritas Capsules to preserve important memories and testimonies
• Earn $GTT tokens through our GriefScore™ yield system  
• Participate in DAO governance and community verification
• Access time-locked proof systems and attestation services

Your registration date: ${new Date().toLocaleDateString()}
Guardian ID: ${user.id}

May your truth endure forever on the blockchain.`,
          mediaUrl: "/assets/nft/register-reward.png",
          tags: ["welcome", "reward", "registration", "guardian"],
          capsuleType: "reward",
          verificationLevel: "dao_certified",
          isPublic: true,
          rewardType: "registration",
          metadata: {
            registrationDate: new Date().toISOString(),
            guardianId: user.id,
            specialType: "welcome_reward",
            rarity: "common",
            benefits: ["platform_access", "gtt_starter_bonus", "dao_voting"]
          }
        };

        const response: any = await apiRequest("/api/capsule/mint-reward", {
          method: "POST", 
          body: mintData
        });

        if (response?.success) {
          setNftDetails(response.nftDetails);
          setMinted(true);
          toast({
            title: "Welcome Reward Minted!",
            description: "Your registration NFT capsule has been successfully created.",
            duration: 5000,
          });

          // Optional: Award initial GTT tokens
          try {
            await apiRequest("/api/gtt/award-registration-bonus", {
              method: "POST",
              body: { userId: user.id, amount: 100 }
            });
            
            toast({
              title: "Bonus GTT Awarded!",
              description: "You've received 100 GTT tokens as a welcome bonus.",
              duration: 3000,
            });
          } catch (gttError) {
            console.log("GTT bonus award failed:", gttError);
          }
        }
      } catch (error: any) {
        console.error("Registration reward minting failed:", error);
        toast({
          title: "Minting Failed",
          description: error.message || "Failed to mint registration reward NFT",
          variant: "destructive",
        });
      } finally {
        setMinting(false);
      }
    };

    if (isAuthenticated && user && !minted && !minting) {
      // Small delay to ensure user data is fully loaded
      setTimeout(mintRegistrationReward, 1000);
    }
  }, [isAuthenticated, user, minted, minting, toast]);

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Gift className="w-6 h-6 text-cyan-400" />
              Registration Reward
            </CardTitle>
            <CardDescription>
              Please log in to claim your welcome NFT capsule
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Gift className="w-8 h-8 text-cyan-400" />
            🎁 Registration Reward
          </CardTitle>
          <CardDescription className="text-lg">
            Welcome to GuardianChain! You've been gifted a special NFT capsule for joining our platform.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {minting && (
            <div className="text-center space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-cyan-300 font-medium">Minting your welcome NFT capsule...</p>
              <p className="text-slate-400 text-sm">This may take a few moments</p>
            </div>
          )}

          {minted && nftDetails && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <p className="text-green-400 font-bold text-xl">NFT Capsule Minted Successfully!</p>
              
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-cyan-300">{nftDetails.title || "Welcome Capsule"}</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="bg-cyan-900/30 text-cyan-300">
                    <Trophy className="w-3 h-3 mr-1" />
                    Registration Reward
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">
                    <Sparkles className="w-3 h-3 mr-1" />
                    DAO Certified
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm">
                  Token ID: {nftDetails.tokenId || "Pending"}
                </p>
                {nftDetails.transactionHash && (
                  <p className="text-slate-400 text-xs break-all">
                    TX: {nftDetails.transactionHash}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-800/30 rounded-lg p-3 text-center">
                  <h4 className="font-medium text-cyan-300">Platform Access</h4>
                  <p className="text-xs text-slate-400">Full GuardianChain features</p>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3 text-center">
                  <h4 className="font-medium text-green-300">GTT Bonus</h4>
                  <p className="text-xs text-slate-400">100 starter tokens</p>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3 text-center">
                  <h4 className="font-medium text-purple-300">DAO Voting</h4>
                  <p className="text-xs text-slate-400">Governance participation</p>
                </div>
              </div>
            </div>
          )}

          {!minting && !minted && (
            <div className="text-center space-y-4">
              <p className="text-blue-300 font-medium">Preparing your welcome gift...</p>
              <div className="animate-pulse bg-slate-700 h-32 rounded-lg"></div>
            </div>
          )}

          <div className="text-center pt-4 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              This NFT capsule commemorates your entry into the GuardianChain ecosystem
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Guardian since: {new Date().toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}