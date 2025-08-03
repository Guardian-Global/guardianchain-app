import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Zap,
  Shield,
  DollarSign,
  Clock,
  Network,
  Coins,
  ChevronRight,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { polygon, base } from "wagmi/chains";
import { getChainConfig } from "@/lib/chains";

interface CapsuleMintBaseProps {
  onChainSelect: (chainId: number) => void;
  onMint: (chainId: number, metadata: any) => Promise<void>;
  className?: string;
}

interface CapsuleMetadata {
  title: string;
  content: string;
  griefScore: number;
  sealedBy: string;
  veritasLink?: string;
  category: string;
  privacy: "public" | "private" | "sealed";
}

export default function CapsuleMintBase({
  onChainSelect,
  onMint,
  className,
}: CapsuleMintBaseProps) {
  const [selectedChain, setSelectedChain] = useState<number>(base.id); // Default to Base for cheaper minting
  const [capsuleData, setCapsuleData] = useState<CapsuleMetadata>({
    title: "",
    content: "",
    griefScore: 1,
    sealedBy: "VCW–00000",
    category: "testimony",
    privacy: "public",
  });
  const [minting, setMinting] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<string>("~$0.01");

  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { toast } = useToast();

  const supportedChains = [polygon.id, base.id];

  // Update estimated costs based on selected chain
  useEffect(() => {
    const config = getChainConfig(selectedChain);
    if (config) {
      const baseCost = selectedChain === base.id ? "$0.01" : "$0.15";
      setEstimatedCost(baseCost);
    }
  }, [selectedChain]);

  const handleChainChange = (chainId: string) => {
    const newChainId = parseInt(chainId);
    setSelectedChain(newChainId);
    onChainSelect(newChainId);
  };

  const handleSwitchToChain = async () => {
    if (currentChainId !== selectedChain) {
      try {
        await switchChain({ chainId: selectedChain });
        toast({
          title: "Network switched",
          description: `Connected to ${getChainConfig(selectedChain)?.displayName}`,
        });
      } catch (error) {
        toast({
          title: "Failed to switch network",
          description: "Please switch manually in your wallet",
          variant: "destructive",
        });
      }
    }
  };

  const handleMint = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint a capsule",
        variant: "destructive",
      });
      return;
    }

    if (currentChainId !== selectedChain) {
      toast({
        title: "Wrong network",
        description: "Please switch to the selected network first",
        variant: "destructive",
      });
      return;
    }

    setMinting(true);
    try {
      const metadata = {
        ...capsuleData,
        network: getChainConfig(selectedChain)?.name.toLowerCase(),
        chainId: selectedChain,
        timestamp: Date.now(),
        minter: address,
      };

      await onMint(selectedChain, metadata);
      
      toast({
        title: "Capsule minted successfully!",
        description: `Your capsule has been minted on ${getChainConfig(selectedChain)?.displayName}`,
      });

      // Reset form
      setCapsuleData({
        title: "",
        content: "",
        griefScore: 1,
        sealedBy: "VCW–00000",
        category: "testimony",
        privacy: "public",
      });
    } catch (error) {
      console.error("Minting failed:", error);
      toast({
        title: "Minting failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setMinting(false);
    }
  };

  const renderChainOption = (chainId: number) => {
    const config = getChainConfig(chainId);
    if (!config) return null;

    const isSelected = selectedChain === chainId;
    const isCurrentChain = currentChainId === chainId;

    return (
      <div
        key={chainId}
        className={`p-4 border rounded-lg cursor-pointer transition-all ${
          isSelected
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
        }`}
        onClick={() => handleChainChange(chainId.toString())}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <Network className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">{config.displayName}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {config.costs.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCurrentChain && (
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            )}
            <Badge variant={config.costs.gasLevel === "low" ? "default" : "secondary"}>
              {config.costs.mintingCost} gas
            </Badge>
          </div>
        </div>

        {/* Features */}
        <div className="mt-3 flex flex-wrap gap-2">
          {config.features.capsuleMinting && (
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Capsule Minting
            </Badge>
          )}
          {config.features.yieldFarming && (
            <Badge variant="outline" className="text-xs">
              <Coins className="w-3 h-3 mr-1" />
              Yield Farming
            </Badge>
          )}
          {config.features.fastUnlocks && (
            <Badge variant="outline" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Fast Unlocks
            </Badge>
          )}
          {config.features.coinbaseIntegration && (
            <Badge variant="outline" className="text-xs">
              <DollarSign className="w-3 h-3 mr-1" />
              Coinbase Integration
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          Multi-Chain Capsule Minting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chain Selection */}
        <div>
          <Label className="text-base font-medium mb-4 block">
            Select Network
          </Label>
          <div className="space-y-3">
            {supportedChains.map(renderChainOption)}
          </div>
        </div>

        {/* Cost Estimation */}
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Estimated minting cost:</span>
              <Badge variant="secondary">{estimatedCost}</Badge>
            </div>
          </AlertDescription>
        </Alert>

        {/* Network Switch Warning */}
        {currentChainId !== selectedChain && (
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Please switch to {getChainConfig(selectedChain)?.displayName}</span>
                <Button onClick={handleSwitchToChain} size="sm" variant="outline">
                  Switch Network
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Capsule Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Capsule Title</Label>
            <input
              id="title"
              className="w-full p-2 border rounded-md"
              value={capsuleData.title}
              onChange={(e) =>
                setCapsuleData({ ...capsuleData, title: e.target.value })
              }
              placeholder="Enter capsule title..."
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              className="w-full p-2 border rounded-md h-24"
              value={capsuleData.content}
              onChange={(e) =>
                setCapsuleData({ ...capsuleData, content: e.target.value })
              }
              placeholder="Enter your testimony, memory, or truth..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={capsuleData.category}
                onValueChange={(value) =>
                  setCapsuleData({ ...capsuleData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="testimony">Testimony</SelectItem>
                  <SelectItem value="memory">Memory</SelectItem>
                  <SelectItem value="trauma">Trauma Recovery</SelectItem>
                  <SelectItem value="legacy">Legacy</SelectItem>
                  <SelectItem value="whistleblower">Whistleblower</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="privacy">Privacy Level</Label>
              <Select
                value={capsuleData.privacy}
                onValueChange={(value: "public" | "private" | "sealed") =>
                  setCapsuleData({ ...capsuleData, privacy: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="sealed">Time-Sealed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Mint Button */}
        <Button
          onClick={handleMint}
          disabled={
            !isConnected ||
            currentChainId !== selectedChain ||
            minting ||
            !capsuleData.title ||
            !capsuleData.content
          }
          className="w-full"
          size="lg"
        >
          {minting ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Minting Capsule...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Mint Capsule on {getChainConfig(selectedChain)?.displayName}
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}