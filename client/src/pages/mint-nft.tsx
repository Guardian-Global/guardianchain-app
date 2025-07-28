import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Image,
  Upload,
  ExternalLink,
  Sparkles,
  Shield,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MintNFTButton from "@/components/web3/MintNFTButton";
import { useAccount } from "wagmi";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

const sampleNFTs = [
  {
    tokenId: 1,
    name: "Guardian Seal #001",
    image: "/api/placeholder/300/300",
    griefScore: 15,
    soulbound: true,
    vaultLabel: "VERIFIED",
    capsuleId: 42,
  },
  {
    tokenId: 2,
    name: "Truth Capsule #007",
    image: "/api/placeholder/300/300",
    griefScore: 89,
    soulbound: false,
    vaultLabel: "PREMIUM",
    capsuleId: 103,
  },
  {
    tokenId: 3,
    name: "Veritas Archive #015",
    image: "/api/placeholder/300/300",
    griefScore: 5,
    soulbound: true,
    vaultLabel: "LEGENDARY",
    capsuleId: 256,
  },
];

export default function MintNFT() {
  const [selectedTab, setSelectedTab] = useState("mint");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [metadataUri, setMetadataUri] = useState("");

  const { address } = useAccount();

  const { data: userCapsules } = useQuery({
    queryKey: ["/api/capsules/user", address],
    enabled: !!address,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // In a real app, upload to IPFS and set the URI
      setMetadataUri(`ipfs://QmSimulated${Date.now()}`);
    }
  };

  const getGriefScoreColor = (score: number) => {
    if (score <= 20) return "text-green-400";
    if (score <= 50) return "text-yellow-400";
    if (score <= 80) return "text-orange-400";
    return "text-red-400";
  };

  const getGriefScoreLabel = (score: number) => {
    if (score <= 20) return "PURE";
    if (score <= 50) return "CLEAN";
    if (score <= 80) return "DISPUTED";
    return "CORRUPTED";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <Image className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Veritas NFT Studio
              </h1>
            </div>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Mint permanent NFT certificates for verified truth capsules
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="space-y-8"
          >
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="mint" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Mint NFT
              </TabsTrigger>
              <TabsTrigger
                value="collection"
                className="flex items-center gap-2"
              >
                <Image className="h-4 w-4" />
                My Collection
              </TabsTrigger>
              <TabsTrigger
                value="marketplace"
                className="flex items-center gap-2"
              >
                <Star className="h-4 w-4" />
                Marketplace
              </TabsTrigger>
            </TabsList>

            {/* Mint NFT Tab */}
            <TabsContent value="mint" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* NFT Minting Interface */}
                <div>
                  <MintNFTButton
                    variant="card"
                    recipient={address}
                    onMintSuccess={(txHash, tokenId) => {
                      console.log("NFT minted:", { txHash, tokenId });
                    }}
                  />
                </div>

                {/* Preview & Upload */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-blue-400" />
                      Metadata & Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                      {uploadedFile ? (
                        <div className="space-y-4">
                          <div className="bg-slate-700 p-4 rounded-lg">
                            <p className="text-green-400 font-semibold">
                              File Ready
                            </p>
                            <p className="text-sm text-slate-300">
                              {uploadedFile.name}
                            </p>
                          </div>
                          <p className="text-xs text-slate-400">
                            Metadata URI: {metadataUri}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                          <div>
                            <p className="text-slate-300 mb-2">
                              Upload NFT Metadata
                            </p>
                            <input
                              type="file"
                              accept=".json,.png,.jpg,.jpeg"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="file-upload"
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
                            >
                              Choose File
                            </label>
                          </div>
                          <p className="text-xs text-slate-400">
                            Supports JSON metadata, images (PNG, JPG)
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">NFT Rarity Guide</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-400">PURE (0-20):</span>
                          <span>Ultra Rare</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-yellow-400">
                            CLEAN (21-50):
                          </span>
                          <span>Rare</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-orange-400">
                            DISPUTED (51-80):
                          </span>
                          <span>Common</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-400">
                            CORRUPTED (81-100):
                          </span>
                          <span>Junk</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* My Collection Tab */}
            <TabsContent value="collection" className="space-y-6">
              <div className="text-center py-8">
                <Image className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Your NFT Collection
                </h3>
                <p className="text-slate-400 mb-4">
                  {address
                    ? "Connect to view your minted Veritas NFTs"
                    : "Connect wallet to view your collection"}
                </p>
                {!address && (
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-400"
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* Marketplace Tab */}
            <TabsContent value="marketplace" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleNFTs.map((nft) => (
                  <Card
                    key={nft.tokenId}
                    className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-slate-700 rounded-lg mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
                        <div className="absolute bottom-2 right-2">
                          {nft.soulbound && (
                            <Badge
                              variant="secondary"
                              className="bg-purple-600 text-white"
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              Soulbound
                            </Badge>
                          )}
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant="outline"
                            className={`border-current ${getGriefScoreColor(
                              nft.griefScore
                            )}`}
                          >
                            {getGriefScoreLabel(nft.griefScore)}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-white">{nft.name}</h4>
                        <div className="flex justify-between text-sm text-slate-400">
                          <span>Token #{nft.tokenId}</span>
                          <span>Capsule #{nft.capsuleId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Grief Score:</span>
                          <span className={getGriefScoreColor(nft.griefScore)}>
                            {nft.griefScore}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Vault:</span>
                          <span className="text-purple-400">
                            {nft.vaultLabel}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-slate-600"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {!nft.soulbound && (
                          <Button
                            size="sm"
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                          >
                            Trade
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
