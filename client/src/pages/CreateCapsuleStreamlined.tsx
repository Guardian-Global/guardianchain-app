import React from "react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Sparkles,
  Camera,
  Clock,
  Share2,
  ExternalLink,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function CapsuleCreatorStreamlined() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Form state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [lockDuration, setLockDuration] = useState(365);
  const [recipient, setRecipient] = useState("");
  const [platform, setPlatform] = useState("twitter");

  // AI & Minting state
  const [aiImageUrl, setAiImageUrl] = useState("");
  const [minted, setMinted] = useState(false);
  const [txn, setTxn] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  // AI Image Generation
  const generateImage = async () => {
    if (!summary.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter a summary before generating an image.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const response = await apiRequest("POST", "/api/ai/generate-image", {
        prompt: `Create an artistic representation of: ${summary}. Style: ethereal, mystical, digital art, high quality, guardian theme`,
        size: "1024x1024",
        quality: "hd",
      });

      const data = await response.json();
      setAiImageUrl(data.imageUrl);

      toast({
        title: "Image Generated!",
        description: "AI has created a visual representation of your capsule.",
      });
    } catch (error) {
      console.error("AI image generation failed:", error);
      toast({
        title: "Image Generation Failed",
        description:
          "Could not generate AI image. You can still mint without it.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // NFT Minting
  const mintCapsule = async () => {
    if (!title.trim() || !summary.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and summary.",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);
    try {
      const response = await apiRequest("POST", "/api/capsules/mint-nft", {
        title,
        content: summary,
        timelock: lockDuration,
        recipient: recipient || (user as any)?.email || "",
        imageUrl: aiImageUrl,
        capsuleType: "memory",
        metadata: {
          hasAiImage: !!aiImageUrl,
          lockDurationDays: lockDuration,
          createdWith: "streamlined-creator",
        },
      });

      const data = await response.json();
      setTxn(data.transactionHash);
      setMinted(true);

      // Invalidate cache to refresh capsule lists
      queryClient.invalidateQueries({ queryKey: ["/api/capsules/recent"] });

      toast({
        title: "Capsule Minted Successfully!",
        description: `NFT #${data.tokenId} has been created and secured on-chain.`,
      });
    } catch (error) {
      console.error("Minting failed:", error);
      toast({
        title: "Minting Failed",
        description: "Could not mint your capsule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  // Social Sharing
  const shareCapsule = () => {
    let shareUrl = "";
    const capsuleUrl = encodeURIComponent(
      `https://guardianchain.app/capsule/${txn}`,
    );
    const shareText = encodeURIComponent(
      `I just created a Truth Capsule on GuardianChain! 🔮 "${title}"`,
    );

    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${capsuleUrl}&hashtags=GuardianChain,TruthCapsule,Web3`;
    } else if (platform === "ens") {
      shareUrl = `https://ens.app/share?capsule=${capsuleUrl}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${capsuleUrl}`;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl border-blue-500/20">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create Truth Capsule
            </CardTitle>
            <p className="text-gray-300 text-lg">
              Preserve your memories with AI-powered visual storytelling
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-lg font-medium text-blue-300"
              >
                Capsule Title
              </Label>
              <Input
                id="title"
                placeholder="Give your truth a powerful title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-400 text-lg"
              />
            </div>

            {/* Summary Input */}
            <div className="space-y-2">
              <Label
                htmlFor="summary"
                className="text-lg font-medium text-blue-300"
              >
                Truth Content
              </Label>
              <Textarea
                id="summary"
                rows={6}
                placeholder="Share your story, memory, or truth to preserve forever..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-400 min-h-[150px]"
              />
            </div>

            {/* Recipient Input */}
            <div className="space-y-2">
              <Label
                htmlFor="recipient"
                className="text-lg font-medium text-blue-300"
              >
                Recipient (Optional)
              </Label>
              <Input
                id="recipient"
                placeholder="ENS name or wallet address..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Lock Duration */}
            <div className="space-y-2">
              <Label
                htmlFor="duration"
                className="text-lg font-medium text-blue-300"
              >
                <Clock className="inline w-5 h-5 mr-2" />
                Time Lock Duration (Days)
              </Label>
              <Input
                id="duration"
                type="number"
                min={1}
                max={36500}
                value={lockDuration}
                onChange={(e) => setLockDuration(parseInt(e.target.value) || 1)}
                className="bg-slate-800/50 border-blue-500/30 text-white"
              />
              <p className="text-sm text-gray-400">
                Your capsule will be locked for {lockDuration} days (
                {Math.round((lockDuration / 365) * 10) / 10} years)
              </p>
            </div>

            {/* AI Image Generation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium text-blue-300">
                  <Sparkles className="inline w-5 h-5 mr-2" />
                  AI Visual Representation
                </Label>
                <Button
                  onClick={generateImage}
                  disabled={isGeneratingImage || !summary.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Generate AI Image
                    </>
                  )}
                </Button>
              </div>

              {aiImageUrl && (
                <div className="relative">
                  <img
                    src={aiImageUrl}
                    alt="AI Generated Capsule Visual"
                    className="w-full h-64 object-cover rounded-lg border border-blue-500/30"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      AI Generated
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mint Button */}
            <div className="pt-6">
              <Button
                onClick={mintCapsule}
                disabled={isMinting || !title.trim() || !summary.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg py-6"
              >
                {isMinting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Minting Your Capsule...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    Mint Truth Capsule
                  </>
                )}
              </Button>
            </div>

            {/* Success State */}
            {minted && (
              <Card className="bg-green-900/20 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                    <h3 className="text-2xl font-bold text-green-300">
                      Capsule Successfully Minted!
                    </h3>
                    <p className="text-gray-300">
                      Your truth has been secured on the blockchain forever.
                    </p>

                    {txn && (
                      <a
                        href={`https://polygonscan.com/tx/${txn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Transaction on PolygonScan
                      </a>
                    )}

                    {/* Sharing Options */}
                    <div className="space-y-3">
                      <Label className="text-lg font-medium text-blue-300">
                        Share Your Creation
                      </Label>
                      <div className="flex items-center space-x-4">
                        <Select value={platform} onValueChange={setPlatform}>
                          <SelectTrigger className="bg-slate-800/50 border-blue-500/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-blue-500/30">
                            <SelectItem value="twitter">Twitter/X</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="ens">ENS Share</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          onClick={shareCapsule}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="pt-4 space-x-4">
                      <Button
                        onClick={() => setLocation("/dashboard")}
                        variant="outline"
                        className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                      >
                        View Dashboard
                      </Button>
                      <Button
                        onClick={() => window.location.reload()}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Create Another
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
