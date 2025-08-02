import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  Star,
  Gem,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Lock,
  Gift,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface GuardianPass {
  tokenId: number;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  tierName: string;
  boostedAPY: number;
  stakingMultiplier: number;
  earlyDAOAccess: boolean;
  mintTime: string;
}

interface PassCollection {
  ownedPasses: GuardianPass[];
  totalValue: string;
  highestRarity: string;
  benefits: {
    totalAPYBoost: number;
    stakingMultiplier: number;
    daoVotingPower: number;
    exclusiveFeatures: string[];
  };
}

const rarityConfig = {
  Common: { color: "bg-gray-500", icon: Shield, boost: 100, supply: 500 },
  Uncommon: { color: "bg-green-500", icon: Star, boost: 250, supply: 300 },
  Rare: { color: "bg-blue-500", icon: Gem, boost: 500, supply: 150 },
  Epic: { color: "bg-purple-500", icon: Crown, boost: 1000, supply: 40 },
  Legendary: { color: "bg-yellow-500", icon: Zap, boost: 2000, supply: 10 },
};

export default function GuardianPassPage() {
  const { toast } = useToast();
  const [selectedPass, setSelectedPass] = useState<GuardianPass | null>(null);

  // Fetch user's Guardian Pass collection
  const { data: passCollection, isLoading } = useQuery<PassCollection>({
    queryKey: ["/api/guardian-pass/collection"],
    queryFn: async () => {
      // Mock data for demo - replace with actual API call
      return {
        ownedPasses: [
          {
            tokenId: 42,
            rarity: "Rare" as const,
            tierName: "Rare Guardian",
            boostedAPY: 500,
            stakingMultiplier: 12000,
            earlyDAOAccess: true,
            mintTime: "2025-01-15T10:30:00Z",
          },
          {
            tokenId: 157,
            rarity: "Uncommon" as const,
            tierName: "Uncommon Guardian",
            boostedAPY: 250,
            stakingMultiplier: 11000,
            earlyDAOAccess: false,
            mintTime: "2025-01-20T14:45:00Z",
          },
        ],
        totalValue: "2,847.50",
        highestRarity: "Rare",
        benefits: {
          totalAPYBoost: 750,
          stakingMultiplier: 1.2,
          daoVotingPower: 150,
          exclusiveFeatures: [
            "Early DAO proposal access",
            "Premium vault strategies",
            "Priority customer support",
            "Exclusive community channels",
          ],
        },
      };
    },
  });

  // Fetch marketplace data
  const { data: marketplaceData } = useQuery({
    queryKey: ["/api/guardian-pass/marketplace"],
    queryFn: async () => {
      return {
        totalSupply: 847,
        floorPrice: "0.25",
        volume24h: "12.5",
        rarityDistribution: {
          Common: { minted: 423, available: 77 },
          Uncommon: { minted: 267, available: 33 },
          Rare: { minted: 128, available: 22 },
          Epic: { minted: 24, available: 16 },
          Legendary: { minted: 5, available: 5 },
        },
      };
    },
  });

  const handleMintPass = async () => {
    try {
      // In production, this would interact with the GuardianPass contract
      toast({
        title: "Minting Guardian Pass",
        description: "Transaction submitted to blockchain",
      });

      // Simulate minting process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast({
        title: "Guardian Pass Minted!",
        description: "Your new Guardian Pass has been minted successfully",
      });
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Failed to mint Guardian Pass",
        variant: "destructive",
      });
    }
  };

  const getRarityIcon = (rarity: string) => {
    const config = rarityConfig[rarity as keyof typeof rarityConfig];
    const IconComponent = config?.icon || Shield;
    return <IconComponent className="h-6 w-6" />;
  };

  const getRarityColor = (rarity: string) => {
    return (
      rarityConfig[rarity as keyof typeof rarityConfig]?.color || "bg-gray-500"
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent">
          Guardian Pass NFTs
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Exclusive NFT passes that unlock premium features, boosted yields, and
          governance privileges
        </p>
      </div>

      {/* Collection Overview */}
      {!isLoading &&
        passCollection &&
        passCollection.ownedPasses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Passes Owned
                    </p>
                    <p className="text-2xl font-bold">
                      {passCollection.ownedPasses.length}
                    </p>
                  </div>
                  <Gift className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Value
                    </p>
                    <p className="text-2xl font-bold">
                      {passCollection.totalValue} GTT
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      APY Boost
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      +
                      {(passCollection.benefits.totalAPYBoost / 100).toFixed(1)}
                      %
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Highest Rarity
                    </p>
                    <p className="text-2xl font-bold">
                      {passCollection.highestRarity}
                    </p>
                  </div>
                  <Crown className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      <Tabs defaultValue="collection" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="collection">My Collection</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="rarity">Rarity Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : passCollection && passCollection.ownedPasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {passCollection.ownedPasses.map((pass) => (
                <Card
                  key={pass.tokenId}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedPass(pass)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`${getRarityColor(pass.rarity)} text-white`}
                      >
                        {pass.rarity}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        #{pass.tokenId}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 ${getRarityColor(
                          pass.rarity,
                        )} rounded-full flex items-center justify-center mx-auto mb-3`}
                      >
                        <div className="text-white">
                          {getRarityIcon(pass.rarity)}
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg">{pass.tierName}</h3>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          APY Boost:
                        </span>
                        <span className="font-semibold text-green-600">
                          +{(pass.boostedAPY / 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Staking Multiplier:
                        </span>
                        <span className="font-semibold">
                          {(pass.stakingMultiplier / 10000).toFixed(2)}x
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          DAO Access:
                        </span>
                        <span
                          className={`font-semibold ${
                            pass.earlyDAOAccess
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {pass.earlyDAOAccess ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Guardian Passes
                </h3>
                <p className="text-muted-foreground mb-6">
                  You don't own any Guardian Passes yet. Mint your first pass to
                  unlock exclusive benefits!
                </p>
                <Button onClick={handleMintPass} size="lg">
                  Mint Guardian Pass
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Supply:</span>
                  <span className="font-semibold">
                    {marketplaceData?.totalSupply}/1000
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Floor Price:</span>
                  <span className="font-semibold">
                    {marketplaceData?.floorPrice} ETH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Volume:</span>
                  <span className="font-semibold">
                    {marketplaceData?.volume24h} ETH
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mint Guardian Pass</CardTitle>
                <CardDescription>
                  Mint a new Guardian Pass for early verifiers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Early verifiers get guaranteed Rare or better rarity
                  </p>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm font-medium">
                      🎉 Early Verifier Bonus
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Higher chance for Epic/Legendary passes
                    </p>
                  </div>
                </div>
                <Button onClick={handleMintPass} className="w-full" size="lg">
                  Mint Pass (Free for Early Verifiers)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supply Remaining</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {marketplaceData &&
                  Object.entries(marketplaceData.rarityDistribution).map(
                    ([rarity, data]) => (
                      <div key={rarity} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 ${getRarityColor(
                                rarity,
                              )} rounded`}
                            ></div>
                            {rarity}
                          </span>
                          <span>{data.available} left</span>
                        </div>
                        <Progress
                          value={
                            (data.minted / (data.minted + data.available)) * 100
                          }
                          className="h-2"
                        />
                      </div>
                    ),
                  )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          {passCollection && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Your Active Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        +
                        {(passCollection.benefits.totalAPYBoost / 100).toFixed(
                          1,
                        )}
                        %
                      </p>
                      <p className="text-sm text-muted-foreground">APY Boost</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {passCollection.benefits.stakingMultiplier}x
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Staking Multiplier
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Exclusive Features</h4>
                    <ul className="space-y-1">
                      {passCollection.benefits.exclusiveFeatures.map(
                        (feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {feature}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    DAO Governance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">
                      {passCollection.benefits.daoVotingPower}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Bonus Voting Power
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Governance Benefits</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Early access to new proposals
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Weighted voting based on pass rarity
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Exclusive governance channels
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rarity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Object.entries(rarityConfig).map(([rarity, config]) => (
              <Card key={rarity} className="text-center">
                <CardHeader className="pb-2">
                  <div
                    className={`w-16 h-16 ${config.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                  >
                    <config.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{rarity}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Supply:</span>{" "}
                      <span className="font-semibold">{config.supply}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">APY Boost:</span>{" "}
                      <span className="font-semibold text-green-600">
                        +{(config.boost / 100).toFixed(1)}%
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">DAO Access:</span>
                      <span
                        className={`font-semibold ml-1 ${
                          rarity === "Common" || rarity === "Uncommon"
                            ? "text-muted-foreground"
                            : "text-green-600"
                        }`}
                      >
                        {rarity === "Common" || rarity === "Uncommon"
                          ? "No"
                          : "Yes"}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rarity Distribution</CardTitle>
              <CardDescription>
                Total supply of 1,000 Guardian Passes distributed across five
                rarity tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(rarityConfig).map(([rarity, config]) => (
                  <div key={rarity} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 ${config.color} rounded`}
                        ></div>
                        <span className="font-medium">{rarity}</span>
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {config.supply} (
                        {((config.supply / 1000) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={(config.supply / 1000) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
