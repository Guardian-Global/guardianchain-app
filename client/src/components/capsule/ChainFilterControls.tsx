import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  Layers, 
  Globe, 
  DollarSign,
  Zap,
  Network,
  TrendingUp,
  Clock,
  Trophy,
  Star,
  ChevronDown
} from "lucide-react";

interface ChainInfo {
  id: number;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  gasPrice: string;
  features: string[];
  description: string;
}

const SUPPORTED_CHAINS: ChainInfo[] = [
  {
    id: 137,
    name: "Polygon",
    shortName: "MATIC",
    icon: "🔷",
    color: "bg-purple-500",
    gasPrice: "~$0.001",
    features: ["Low Fees", "Fast Finality", "EVM Compatible"],
    description: "Ethereum's leading scaling solution"
  },
  {
    id: 8453,
    name: "Base",
    shortName: "BASE",
    icon: "🔵",
    color: "bg-blue-500",
    gasPrice: "~$0.01",
    features: ["Ultra Low Fees", "Coinbase Built", "L2 Scaling"],
    description: "Coinbase's L2 for mainstream adoption"
  },
  {
    id: 1,
    name: "Ethereum",
    shortName: "ETH",
    icon: "⚡",
    color: "bg-gray-600",
    gasPrice: "~$5-50",
    features: ["Most Secure", "High Liquidity", "Original Chain"],
    description: "The original smart contract platform"
  }
];

interface ChainFilterControlsProps {
  selectedChains: number[];
  onChainsChange: (chains: number[]) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  showAdvanced?: boolean;
}

export default function ChainFilterControls({
  selectedChains,
  onChainsChange,
  sortBy = "recent",
  onSortChange,
  showAdvanced = false
}: ChainFilterControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOnlyMinted, setShowOnlyMinted] = useState(false);

  const toggleChain = (chainId: number) => {
    if (selectedChains.includes(chainId)) {
      onChainsChange(selectedChains.filter(id => id !== chainId));
    } else {
      onChainsChange([...selectedChains, chainId]);
    }
  };

  const selectAllChains = () => {
    onChainsChange(SUPPORTED_CHAINS.map(chain => chain.id));
  };

  const clearAllChains = () => {
    onChainsChange([]);
  };

  const getSelectedChainsText = () => {
    if (selectedChains.length === 0) return "All Chains";
    if (selectedChains.length === SUPPORTED_CHAINS.length) return "All Chains";
    
    const selectedNames = SUPPORTED_CHAINS
      .filter(chain => selectedChains.includes(chain.id))
      .map(chain => chain.shortName);
    
    if (selectedNames.length === 1) return selectedNames[0];
    if (selectedNames.length === 2) return selectedNames.join(" + ");
    return `${selectedNames.length} Chains`;
  };

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers className="w-5 h-5 text-blue-500" />
            Multi-Chain Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Chain Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Active Networks</Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAllChains}
                className="h-7 px-2 text-xs"
              >
                All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllChains}
                className="h-7 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {SUPPORTED_CHAINS.map((chain) => {
              const isSelected = selectedChains.includes(chain.id);
              return (
                <div
                  key={chain.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${isSelected 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }
                  `}
                  onClick={() => toggleChain(chain.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${chain.color} flex items-center justify-center text-white text-sm font-bold`}>
                      {chain.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{chain.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {chain.gasPrice}
                        </Badge>
                      </div>
                      {isExpanded && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {chain.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isExpanded && (
                      <div className="flex gap-1">
                        {chain.features.slice(0, 2).map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Switch
                      checked={isSelected}
                      onCheckedChange={() => toggleChain(chain.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters */}
        {(isExpanded || showAdvanced) && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <Label className="text-sm font-medium">Sort & Filter Options</Label>
              
              {/* Sort Options */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600 dark:text-gray-400">Sort By</Label>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Most Recent
                      </div>
                    </SelectItem>
                    <SelectItem value="truthScore">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Truth Score
                      </div>
                    </SelectItem>
                    <SelectItem value="gasEfficiency">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Gas Efficiency
                      </div>
                    </SelectItem>
                    <SelectItem value="mostValued">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Most Valued
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Filters */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm">Only Minted NFTs</Label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Show only capsules with on-chain NFTs
                  </p>
                </div>
                <Switch
                  checked={showOnlyMinted}
                  onCheckedChange={setShowOnlyMinted}
                />
              </div>
            </div>
          </>
        )}

        {/* Summary */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Filtering: {getSelectedChainsText()}
            </span>
            <div className="flex items-center gap-1">
              <Network className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{selectedChains.length} network{selectedChains.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}