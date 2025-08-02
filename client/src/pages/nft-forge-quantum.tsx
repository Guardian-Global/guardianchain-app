import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Sparkles,
  Zap,
  Crown,
  Shield,
  Star,
  Flame,
  Diamond,
  Eye,
  Upload,
  Download,
  Share,
  Lock,
  Unlock,
  TrendingUp,
  Users,
  Globe,
  Palette,
  Image,
  Video,
  Music,
  FileText,
  Code,
  Gift
} from "lucide-react";

interface NFTMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
  rarity_score: number;
  truth_verification: boolean;
  emotion_resonance: number;
  lineage_depth: number;
  grief_score: number;
}

interface MintingTier {
  id: string;
  name: string;
  cost: number;
  features: string[];
  max_supply: number;
  current_supply: number;
  color: string;
  icon: React.ComponentType<any>;
}

const mintingTiers: MintingTier[] = [
  {
    id: 'standard',
    name: 'Standard',
    cost: 10,
    features: ['Basic NFT Minting', 'Standard Metadata', 'Community Verification'],
    max_supply: 10000,
    current_supply: 3245,
    color: 'cyan',
    icon: Star
  },
  {
    id: 'premium',
    name: 'Premium',
    cost: 25,
    features: ['Enhanced Visuals', 'Truth Verification', 'Emotion Analysis', 'Rarity Boost'],
    max_supply: 5000,
    current_supply: 1876,
    color: 'purple',
    icon: Crown
  },
  {
    id: 'quantum',
    name: 'Quantum',
    cost: 50,
    features: ['Quantum Effects', 'AI Enhancement', 'Lineage Tracking', 'Grief Scoring', 'Future Unlocks'],
    max_supply: 1000,
    current_supply: 234,
    color: 'yellow',
    icon: Diamond
  },
  {
    id: 'legendary',
    name: 'Legendary',
    cost: 100,
    features: ['Legendary Status', 'Truth Seal', 'Time Lock', 'Yield Generation', 'Exclusive Access'],
    max_supply: 100,
    current_supply: 23,
    color: 'red',
    icon: Flame
  }
];

const rarityLevels = [
  { name: 'Common', probability: 0.4, color: 'gray' },
  { name: 'Uncommon', probability: 0.3, color: 'green' },
  { name: 'Rare', probability: 0.2, color: 'blue' },
  { name: 'Epic', probability: 0.08, color: 'purple' },
  { name: 'Legendary', probability: 0.02, color: 'yellow' }
];

export default function QuantumNFTForge() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedTier, setSelectedTier] = useState<MintingTier>(mintingTiers[0]);
  const [mintingData, setMintingData] = useState({
    name: "",
    description: "",
    category: "",
    image_url: "",
    attributes: [] as Array<{ trait_type: string; value: string }>
  });
  const [previewNFT, setPreviewNFT] = useState<NFTMetadata | null>(null);
  const [mintingStep, setMintingStep] = useState(1);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // Fetch user's NFT collection
  const { data: userNFTs } = useQuery({
    queryKey: ["/api/user/nfts"],
    enabled: isAuthenticated
  });

  // Generate NFT preview
  const generatePreview = async () => {
    if (!mintingData.name || !mintingData.description) {
      toast({
        title: "Missing Information",
        description: "Please provide name and description to generate preview.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPreview(true);
    try {
      // Simulate AI-powered NFT generation
      const rarityRoll = Math.random();
      let selectedRarity = rarityLevels[0];
      let cumulativeProbability = 0;
      
      for (const rarity of rarityLevels) {
        cumulativeProbability += rarity.probability;
        if (rarityRoll <= cumulativeProbability) {
          selectedRarity = rarity;
          break;
        }
      }

      const preview: NFTMetadata = {
        id: `preview-${Date.now()}`,
        name: mintingData.name,
        description: mintingData.description,
        image: mintingData.image_url || "/api/placeholder/400/400",
        attributes: [
          { trait_type: "Rarity", value: selectedRarity.name },
          { trait_type: "Tier", value: selectedTier.name },
          { trait_type: "Category", value: mintingData.category || "General" },
          { trait_type: "Emotion Resonance", value: Math.floor(Math.random() * 100), display_type: "boost_percentage" },
          { trait_type: "Truth Score", value: Math.floor(Math.random() * 100), display_type: "boost_number" },
          { trait_type: "Lineage Depth", value: Math.floor(Math.random() * 10) },
          ...mintingData.attributes
        ],
        rarity_score: Math.floor(Math.random() * 1000) + selectedTier.cost * 10,
        truth_verification: selectedTier.id !== 'standard',
        emotion_resonance: Math.floor(Math.random() * 100),
        lineage_depth: Math.floor(Math.random() * 10),
        grief_score: Math.floor(Math.random() * 50)
      };

      setPreviewNFT(preview);
      setMintingStep(2);
    } catch (error) {
      toast({
        title: "Preview Generation Failed",
        description: "Unable to generate NFT preview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  // Mint NFT
  const mintMutation = useMutation({
    mutationFn: async (nftData: any) => {
      return apiRequest("/api/nft/mint", {
        method: "POST",
        body: {
          ...nftData,
          tier: selectedTier.id,
          cost: selectedTier.cost
        }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "NFT Minted Successfully!",
        description: `Your ${selectedTier.name} NFT has been minted to the blockchain.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/nfts"] });
      // Reset form
      setMintingData({
        name: "",
        description: "",
        category: "",
        image_url: "",
        attributes: []
      });
      setPreviewNFT(null);
      setMintingStep(1);
    },
    onError: (error) => {
      toast({
        title: "Minting Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const addAttribute = () => {
    setMintingData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: "", value: "" }]
    }));
  };

  const updateAttribute = (index: number, field: string, value: string) => {
    setMintingData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }));
  };

  const removeAttribute = (index: number) => {
    setMintingData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const getTierColor = (color: string) => {
    const colors = {
      cyan: 'border-cyan-500/50 bg-cyan-500/10',
      purple: 'border-purple-500/50 bg-purple-500/10',
      yellow: 'border-yellow-500/50 bg-yellow-500/10',
      red: 'border-red-500/50 bg-red-500/10'
    };
    return colors[color as keyof typeof colors] || colors.cyan;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-black text-gradient-quantum mb-4 animate-prismatic-shift">
            Quantum NFT Forge
          </h1>
          <p className="text-xl text-cyan-300 font-web3 max-w-3xl mx-auto">
            Mint truth-verified NFTs with quantum-enhanced metadata, AI-powered rarity scoring, 
            and blockchain-verified authenticity on Polygon Network.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              mintingStep >= 1 ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-gray-600 text-gray-400'
            }`}>
              1
            </div>
            <div className={`h-1 w-20 ${mintingStep >= 2 ? 'bg-cyan-500' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              mintingStep >= 2 ? 'border-purple-500 bg-purple-500/20 text-purple-400' : 'border-gray-600 text-gray-400'
            }`}>
              2
            </div>
            <div className={`h-1 w-20 ${mintingStep >= 3 ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              mintingStep >= 3 ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400' : 'border-gray-600 text-gray-400'
            }`}>
              3
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Minting Tiers */}
        <div className="space-y-6">
          <Card className="holographic-glass border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                Minting Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mintingTiers.map((tier) => {
                const IconComponent = tier.icon;
                const isSelected = selectedTier.id === tier.id;
                const progress = (tier.current_supply / tier.max_supply) * 100;
                
                return (
                  <Card
                    key={tier.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? getTierColor(tier.color) + ' animate-morphic-pulse'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedTier(tier)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-5 h-5 text-${tier.color}-400`} />
                          <span className="font-bold text-white">{tier.name}</span>
                        </div>
                        <Badge className={`bg-${tier.color}-500/20 text-${tier.color}-400`}>
                          {tier.cost} GTT
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        {tier.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full bg-${tier.color}-400`}></div>
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Supply</span>
                          <span className="text-gray-300">
                            {tier.current_supply}/{tier.max_supply}
                          </span>
                        </div>
                        <Progress value={progress} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>

          {/* Rarity Probabilities */}
          <Card className="holographic-glass border-white/20">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-purple-400" />
                Rarity Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rarityLevels.map((rarity) => (
                <div key={rarity.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${rarity.color}-400`}></div>
                    <span className="text-sm text-gray-300">{rarity.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {(rarity.probability * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Minting Form */}
        <div className="space-y-6">
          {mintingStep === 1 && (
            <Card className="holographic-glass border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-cyan-400" />
                  Step 1: Design Your NFT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">NFT Name</label>
                  <Input
                    value={mintingData.name}
                    onChange={(e) => setMintingData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter NFT name"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Description</label>
                  <Textarea
                    value={mintingData.description}
                    onChange={(e) => setMintingData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your NFT..."
                    className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Category</label>
                  <Select
                    value={mintingData.category}
                    onValueChange={(value) => setMintingData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="art">Digital Art</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="truth">Truth Capsule</SelectItem>
                      <SelectItem value="legacy">Legacy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Image URL</label>
                  <Input
                    value={mintingData.image_url}
                    onChange={(e) => setMintingData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://..."
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Custom Attributes</label>
                    <Button
                      type="button"
                      onClick={addAttribute}
                      size="sm"
                      variant="outline"
                      className="text-cyan-400 border-cyan-500/30"
                    >
                      Add Attribute
                    </Button>
                  </div>
                  
                  {mintingData.attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={attr.trait_type}
                        onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                        placeholder="Trait type"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Input
                        value={attr.value}
                        onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Button
                        type="button"
                        onClick={() => removeAttribute(index)}
                        size="sm"
                        variant="outline"
                        className="px-3 text-red-400 border-red-500/30"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={generatePreview}
                  disabled={isGeneratingPreview || !mintingData.name || !mintingData.description}
                  className="w-full quantum-field text-black font-bold"
                >
                  {isGeneratingPreview ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      Generating Preview...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Generate Preview
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {mintingStep === 2 && previewNFT && (
            <Card className="holographic-glass border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-purple-400" />
                  Step 2: Preview & Confirm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="quantum-field rounded-lg p-1 mb-4 inline-block animate-morphic-pulse">
                    <img
                      src={previewNFT.image}
                      alt={previewNFT.name}
                      className="w-48 h-48 object-cover rounded-lg mx-auto"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMTExODI3Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSIjNkI3Mjg0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5ORlQgUHJldmlldz48L3RleHQ+Cjwvc3ZnPg==";
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{previewNFT.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{previewNFT.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rarity Score:</span>
                    <span className="text-yellow-400 font-bold">{previewNFT.rarity_score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Truth Verified:</span>
                    {previewNFT.truth_verification ? (
                      <Shield className="w-4 h-4 text-green-400" />
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Emotion Score:</span>
                    <span className="text-purple-400">{previewNFT.emotion_resonance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Grief Score:</span>
                    <span className="text-red-400">{previewNFT.grief_score}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white">Attributes:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {previewNFT.attributes.map((attr, index) => (
                      <div key={index} className="bg-gray-800/50 rounded p-2">
                        <div className="text-xs text-gray-400">{attr.trait_type}</div>
                        <div className="text-sm text-white font-medium">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setMintingStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back to Edit
                  </Button>
                  <Button
                    onClick={() => setMintingStep(3)}
                    className="flex-1 quantum-field text-black font-bold"
                  >
                    Proceed to Mint
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {mintingStep === 3 && (
            <Card className="holographic-glass border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Step 3: Mint to Blockchain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Minting Tier:</span>
                    <Badge className={`bg-${selectedTier.color}-500/20 text-${selectedTier.color}-400`}>
                      {selectedTier.name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Cost:</span>
                    <span className="text-yellow-400 font-bold">{selectedTier.cost} GTT</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Network:</span>
                    <span className="text-purple-400">Polygon</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Gas Fee:</span>
                    <span className="text-green-400">~$0.01</span>
                  </div>
                </div>

                <div className="text-sm text-gray-400 space-y-1">
                  <p>• Your NFT will be minted to your connected wallet</p>
                  <p>• Transaction will be recorded on Polygon blockchain</p>
                  <p>• Metadata will be stored on IPFS for permanence</p>
                  <p>• Truth verification will be processed automatically</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setMintingStep(2)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back to Preview
                  </Button>
                  <Button
                    onClick={() => mintMutation.mutate(previewNFT)}
                    disabled={mintMutation.isPending}
                    className="flex-1 quantum-field text-black font-bold animate-morphic-pulse"
                  >
                    {mintMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                        Minting...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Mint NFT ({selectedTier.cost} GTT)
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - User's NFTs */}
        <div className="space-y-6">
          <Card className="holographic-glass border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center">
                <Gift className="w-5 h-5 mr-2 text-green-400" />
                Your NFT Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Connect your wallet to view your NFT collection</p>
                  <Button className="quantum-field text-black font-bold">
                    Connect Wallet
                  </Button>
                </div>
              ) : userNFTs?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No NFTs in your collection yet</p>
                  <p className="text-sm text-gray-500 mt-2">Mint your first NFT to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {userNFTs?.slice(0, 4).map((nft: any, index: number) => (
                    <Card key={index} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={nft.image || "/api/placeholder/60/60"}
                            alt={nft.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate">
                              {nft.name}
                            </h4>
                            <p className="text-xs text-gray-400 truncate">
                              {nft.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {userNFTs?.length > 4 && (
                    <Button variant="outline" className="w-full">
                      View All ({userNFTs.length})
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Market Stats */}
          <Card className="holographic-glass border-white/20">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                Market Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Total Minted:</span>
                <span className="text-blue-400 font-bold">
                  {mintingTiers.reduce((sum, tier) => sum + tier.current_supply, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Floor Price:</span>
                <span className="text-green-400 font-bold">2.5 MATIC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">24h Volume:</span>
                <span className="text-purple-400 font-bold">1,234 MATIC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Holders:</span>
                <span className="text-cyan-400 font-bold">2,891</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}