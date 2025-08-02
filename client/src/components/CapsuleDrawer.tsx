import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import CapsuleMintButton from "@/components/CapsuleMintButton";
import { Plus, AlertTriangle, Shield, Coins, ExternalLink, Eye } from "lucide-react";

interface CapsuleData {
  title: string;
  content: string;
  griefTier?: number;
  category: string;
}

export default function CapsuleDrawer() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CapsuleData>({
    title: "",
    content: "",
    griefTier: undefined,
    category: "memory"
  });
  const [moderationResult, setModerationResult] = useState<any>(null);
  const [capsuleId, setCapsuleId] = useState<string | null>(null);
  const [nftTokenId, setNftTokenId] = useState<string | null>(null);
  const [step, setStep] = useState<"create" | "moderate" | "mint">("create");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Content moderation mutation
  const moderateMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/moderate-content", { content });
    },
    onSuccess: (data) => {
      console.log("🔍 Moderation result:", data);
      setModerationResult(data);
      
      if (data.moderation.isAllowed) {
        setFormData(prev => ({ 
          ...prev, 
          griefTier: data.griefScore 
        }));
        setStep("mint");
        toast({
          title: "Content Approved",
          description: `Grief score: ${data.griefScore}/5. Ready for NFT minting.`,
        });
      } else {
        toast({
          title: "Content Flagged",
          description: data.moderation.reason || "Content requires review",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error("❌ Moderation failed:", error);
      toast({
        title: "Moderation Failed",
        description: error.message || "Failed to moderate content",
        variant: "destructive",
      });
    },
  });

  // Capsule creation mutation
  const createMutation = useMutation({
    mutationFn: async (capsuleData: CapsuleData) => {
      return apiRequest("POST", "/api/capsules", capsuleData);
    },
    onSuccess: (data) => {
      console.log("📦 Capsule created:", data);
      setCapsuleId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      
      toast({
        title: "Capsule Created",
        description: "Your truth capsule has been created successfully.",
      });
    },
    onError: (error: any) => {
      console.error("❌ Capsule creation failed:", error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create capsule",
        variant: "destructive",
      });
    },
  });

  const handleSubmitForModeration = async () => {
    if (!formData.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content for your capsule",
        variant: "destructive",
      });
      return;
    }

    setStep("moderate");
    moderateMutation.mutate(formData.content);
  };

  const handleMintSuccess = (tokenId: string, txHash: string) => {
    setNftTokenId(tokenId);
    
    toast({
      title: "NFT Minted Successfully!",
      description: `Guardian Capsule #${tokenId} has been minted on-chain.`,
    });

    // Create capsule record after successful minting
    const capsuleWithNft = {
      ...formData,
      griefTier: formData.griefTier || moderationResult?.griefScore || 3,
      nftTokenId: tokenId,
      transactionHash: txHash
    };
    
    createMutation.mutate(capsuleWithNft);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      griefTier: undefined,
      category: "memory"
    });
    setModerationResult(null);
    setCapsuleId(null);
    setNftTokenId(null);
    setStep("create");
    setOpen(false);
  };

  const getStepIcon = (currentStep: string) => {
    switch (currentStep) {
      case "create": return <Plus className="h-4 w-4" />;
      case "moderate": return <Shield className="h-4 w-4" />;
      case "mint": return <Coins className="h-4 w-4" />;
      default: return <Plus className="h-4 w-4" />;
    }
  };

  const getGriefTierColor = (tier: number) => {
    if (tier >= 4) return "bg-red-100 text-red-800";
    if (tier >= 3) return "bg-yellow-100 text-yellow-800";
    if (tier >= 2) return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <>
      {/* Floating Action Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 z-50"
            size="lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getStepIcon(step)}
              Create Guardian Capsule
            </DialogTitle>
            <DialogDescription>
              Preserve your memories and truth as an NFT on the blockchain
            </DialogDescription>
          </DialogHeader>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              step === "create" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
            }`}>
              <Plus className="h-3 w-3" />
              Create
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-2" />
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              step === "moderate" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
            }`}>
              <Shield className="h-3 w-3" />
              Moderate
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-2" />
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              step === "mint" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
            }`}>
              <Coins className="h-3 w-3" />
              Mint NFT
            </div>
          </div>

          <div className="space-y-6">
            {/* Step 1: Create Content */}
            {step === "create" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Capsule Title</Label>
                  <Input
                    id="title"
                    placeholder="Give your capsule a meaningful title..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="memory">Personal Memory</SelectItem>
                      <SelectItem value="legacy">Family Legacy</SelectItem>
                      <SelectItem value="testimony">Testimony</SelectItem>
                      <SelectItem value="historical">Historical Account</SelectItem>
                      <SelectItem value="tribute">Tribute</SelectItem>
                      <SelectItem value="wisdom">Life Wisdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your memory, truth, or legacy. This content will be preserved on the blockchain..."
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="mt-1 min-h-[120px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.content.length} characters
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitForModeration}
                    disabled={!formData.title.trim() || !formData.content.trim()}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Submit for Review
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Moderation Results */}
            {step === "moderate" && (
              <div className="space-y-4">
                <div className="text-center">
                  {moderateMutation.isPending ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="text-sm text-gray-600">Analyzing content...</p>
                    </div>
                  ) : moderationResult ? (
                    <div className="space-y-4">
                      {moderationResult.moderation.isAllowed ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <Shield className="h-5 w-5" />
                          <span className="font-medium">Content Approved</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-red-600">
                          <AlertTriangle className="h-5 w-5" />
                          <span className="font-medium">Content Flagged</span>
                        </div>
                      )}

                      {/* Grief Score Display */}
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-600">Emotional Weight:</span>
                        <Badge className={getGriefTierColor(moderationResult.griefScore)}>
                          Tier {moderationResult.griefScore}/5
                        </Badge>
                      </div>

                      {/* Moderation Details */}
                      {moderationResult.moderation.reason && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                          <p className="text-sm text-yellow-800">
                            <strong>Review Note:</strong> {moderationResult.moderation.reason}
                          </p>
                        </div>
                      )}

                      {/* Flags Display */}
                      {moderationResult.moderation.flags && moderationResult.moderation.flags.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {moderationResult.moderation.flags.map((flag: string) => (
                            <Badge key={flag} variant="outline" className="text-xs">
                              {flag.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep("create")}>
                    Back to Edit
                  </Button>
                  {moderationResult?.moderation.isAllowed && (
                    <Button onClick={() => setStep("mint")}>
                      Continue to Mint
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: NFT Minting */}
            {step === "mint" && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Ready to Mint NFT</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium">{formData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{formData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grief Tier:</span>
                      <Badge className={getGriefTierColor(formData.griefTier || 3)}>
                        {formData.griefTier || 3}/5
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yield Potential:</span>
                      <span className="font-medium text-green-600">
                        {(formData.griefTier || 3) * 10} GTT
                      </span>
                    </div>
                  </div>
                </div>

                <CapsuleMintButton
                  title={formData.title}
                  content={formData.content}
                  griefTier={formData.griefTier || 3}
                  onMintSuccess={handleMintSuccess}
                />

                {/* NFT Links */}
                {nftTokenId && (
                  <div className="space-y-2">
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <p className="text-sm text-green-800 font-medium">
                        NFT Minted Successfully!
                      </p>
                      <p className="text-xs text-green-600">
                        Guardian Capsule #{nftTokenId}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const metadataUrl = `${window.location.origin}/api/metadata/${nftTokenId}`;
                          window.open(metadataUrl, "_blank");
                        }}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View Metadata
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const openSeaUrl = `https://opensea.io/assets/matic/0x0000000000000000000000000000000000000000/${nftTokenId}`;
                          window.open(openSeaUrl, "_blank");
                        }}
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        OpenSea
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep("moderate")}>
                    Back
                  </Button>
                  <Button onClick={resetForm}>
                    Create Another
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}