import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  Brain,
  Shield,
  Upload,
  Coins,
  Eye,
  Layers,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ContentAnalysis {
  griefScore: number;
  emotionalResonance: number;
  truthLikelihood: number;
  contentType: string;
  themes: string[];
  sentiment: string;
  complexity: string;
  suggestedTags: string[];
  moderationFlags: string[];
  summary: string;
}

interface ModerationResult {
  approved: boolean;
  issues: string[];
  severity: string;
  recommendations: string[];
}

interface CapsuleData {
  title: string;
  content: string;
  tags: string[];
  analysis?: ContentAnalysis;
  moderation?: ModerationResult;
  ipfsHash?: string;
  nftTokenId?: string;
}

type Step =
  | "input"
  | "analyzing"
  | "moderating"
  | "ipfs"
  | "minting"
  | "complete";

export default function CapsuleCreationFlow() {
  const [step, setStep] = useState<Step>("input");
  const [capsuleData, setCapsuleData] = useState<CapsuleData>({
    title: "",
    content: "",
    tags: [],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Content Analysis Mutation
  const analyzeContentMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const response = await apiRequest("POST", "/api/capsules/analyze", data);
      return response.json();
    },
    onSuccess: (analysis: ContentAnalysis) => {
      setCapsuleData((prev) => ({ ...prev, analysis }));
      setStep("moderating");
      setProgress(40);
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Content analysis failed. Please try again.",
        variant: "destructive",
      });
      setStep("input");
    },
  });

  // Content Moderation Mutation
  const moderateContentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/capsules/moderate", {
        content,
      });
      return response.json();
    },
    onSuccess: (moderation: ModerationResult) => {
      setCapsuleData((prev) => ({ ...prev, moderation }));
      if (moderation.approved) {
        setStep("ipfs");
        setProgress(60);
        uploadToIPFS();
      } else {
        toast({
          title: "Content Flagged",
          description: `Content was flagged: ${moderation.issues.join(", ")}`,
          variant: "destructive",
        });
        setStep("input");
      }
    },
  });

  // IPFS Upload Mutation
  const ipfsUploadMutation = useMutation({
    mutationFn: async (data: CapsuleData) => {
      const response = await apiRequest(
        "POST",
        "/api/capsules/upload-ipfs",
        data,
      );
      return response.json();
    },
    onSuccess: (result: { hash: string; url: string }) => {
      setCapsuleData((prev) => ({ ...prev, ipfsHash: result.hash }));
      setStep("minting");
      setProgress(80);
      mintNFT(result.hash);
    },
  });

  // NFT Minting Mutation
  const mintNFTMutation = useMutation({
    mutationFn: async (ipfsHash: string) => {
      const response = await apiRequest("POST", "/api/capsules/mint-nft", {
        ipfsHash,
        ...capsuleData,
      });
      return response.json();
    },
    onSuccess: (result: { tokenId: string; transactionHash: string }) => {
      setCapsuleData((prev) => ({ ...prev, nftTokenId: result.tokenId }));
      setStep("complete");
      setProgress(100);
      toast({
        title: "Capsule Created Successfully!",
        description: `NFT minted with token ID: ${result.tokenId}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
    },
  });

  const handleSubmit = () => {
    if (!capsuleData.title.trim() || !capsuleData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content.",
        variant: "destructive",
      });
      return;
    }

    setStep("analyzing");
    setProgress(20);
    analyzeContentMutation.mutate({
      title: capsuleData.title,
      content: capsuleData.content,
    });
  };

  const moderateContent = () => {
    moderateContentMutation.mutate(capsuleData.content);
  };

  const uploadToIPFS = () => {
    ipfsUploadMutation.mutate(capsuleData);
  };

  const mintNFT = (ipfsHash: string) => {
    mintNFTMutation.mutate(ipfsHash);
  };

  const addTag = () => {
    if (currentTag.trim() && !capsuleData.tags.includes(currentTag.trim())) {
      setCapsuleData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCapsuleData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const resetFlow = () => {
    setStep("input");
    setProgress(0);
    setCapsuleData({
      title: "",
      content: "",
      tags: [],
    });
  };

  const getGriefTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case 2:
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case 3:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case 4:
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case 5:
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-brand-surface text-brand-light border-brand-surface";
    }
  };

  // Auto-proceed through steps when not requiring user input
  useEffect(() => {
    if (step === "moderating" && capsuleData.analysis) {
      const timer = setTimeout(() => {
        moderateContent();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, capsuleData.analysis]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-brand-light">Creation Progress</span>
            <span className="text-sm text-brand-light">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-brand-light/60 mt-2">
            <span>Input</span>
            <span>Analysis</span>
            <span>Moderation</span>
            <span>IPFS</span>
            <span>Minting</span>
            <span>Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Input Step */}
      {step === "input" && (
        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle className="text-brand-light font-brand">
              Create Truth Capsule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-brand-light/80 mb-2 block">
                Title
              </label>
              <Input
                value={capsuleData.title}
                onChange={(e) =>
                  setCapsuleData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter capsule title..."
                className="bg-brand-surface border-brand-surface text-brand-light"
              />
            </div>

            <div>
              <label className="text-sm text-brand-light/80 mb-2 block">
                Content
              </label>
              <Textarea
                value={capsuleData.content}
                onChange={(e) =>
                  setCapsuleData((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                placeholder="Share your truth, memory, or important information..."
                rows={6}
                className="bg-brand-surface border-brand-surface text-brand-light resize-none"
              />
            </div>

            <div>
              <label className="text-sm text-brand-light/80 mb-2 block">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add tag..."
                  className="bg-brand-surface border-brand-surface text-brand-light"
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="sm" variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {capsuleData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-brand-surface text-brand-light"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-brand-light/60 hover:text-brand-light"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-brand-primary hover:bg-brand-primary/90"
              disabled={
                !capsuleData.title.trim() || !capsuleData.content.trim()
              }
            >
              Create Capsule
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Processing Steps */}
      {(step === "analyzing" ||
        step === "moderating" ||
        step === "ipfs" ||
        step === "minting") && (
        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-brand-primary" />

              {step === "analyzing" && (
                <div>
                  <h3 className="text-lg font-semibold text-brand-light mb-2">
                    <Brain className="w-5 h-5 inline mr-2" />
                    Analyzing Content
                  </h3>
                  <p className="text-brand-light/60">
                    AI is analyzing your content for grief scoring, emotional
                    resonance, and metadata generation...
                  </p>
                </div>
              )}

              {step === "moderating" && (
                <div>
                  <h3 className="text-lg font-semibold text-brand-light mb-2">
                    <Shield className="w-5 h-5 inline mr-2" />
                    Content Moderation
                  </h3>
                  <p className="text-brand-light/60">
                    Checking content for platform safety and compliance...
                  </p>
                </div>
              )}

              {step === "ipfs" && (
                <div>
                  <h3 className="text-lg font-semibold text-brand-light mb-2">
                    <Upload className="w-5 h-5 inline mr-2" />
                    Uploading to IPFS
                  </h3>
                  <p className="text-brand-light/60">
                    Storing your capsule on the decentralized IPFS network...
                  </p>
                </div>
              )}

              {step === "minting" && (
                <div>
                  <h3 className="text-lg font-semibold text-brand-light mb-2">
                    <Coins className="w-5 h-5 inline mr-2" />
                    Minting NFT
                  </h3>
                  <p className="text-brand-light/60">
                    Creating your truth capsule as a blockchain NFT...
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {capsuleData.analysis && step !== "input" && (
        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle className="text-brand-light font-brand flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Badge
                  className={getGriefTierColor(capsuleData.analysis.griefScore)}
                >
                  Grief Tier {capsuleData.analysis.griefScore}
                </Badge>
                <p className="text-xs text-brand-light/60 mt-1">
                  Emotional Weight
                </p>
              </div>
              <div className="text-center">
                <div className="text-brand-accent font-semibold">
                  {capsuleData.analysis.emotionalResonance}%
                </div>
                <p className="text-xs text-brand-light/60">
                  Emotional Resonance
                </p>
              </div>
              <div className="text-center">
                <div className="text-brand-primary font-semibold">
                  {capsuleData.analysis.truthLikelihood}%
                </div>
                <p className="text-xs text-brand-light/60">Truth Likelihood</p>
              </div>
            </div>

            {capsuleData.analysis.themes.length > 0 && (
              <div>
                <p className="text-sm text-brand-light/80 mb-2">
                  Detected Themes:
                </p>
                <div className="flex flex-wrap gap-2">
                  {capsuleData.analysis.themes.map((theme, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-brand-surface text-brand-light/80"
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-brand-surface p-3 rounded-vault">
              <p className="text-sm text-brand-light/80 mb-1">AI Summary:</p>
              <p className="text-brand-light text-sm">
                {capsuleData.analysis.summary}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {step === "complete" && (
        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-brand-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-brand-light mb-2">
              Capsule Created Successfully!
            </h3>
            <p className="text-brand-light/60 mb-6">
              Your truth capsule has been permanently stored on IPFS and minted
              as an NFT.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-brand-surface p-4 rounded-vault">
                <Layers className="w-6 h-6 text-brand-primary mx-auto mb-2" />
                <p className="text-sm text-brand-light/80">IPFS Hash</p>
                <p className="text-xs text-brand-light font-mono break-all">
                  {capsuleData.ipfsHash}
                </p>
              </div>
              <div className="bg-brand-surface p-4 rounded-vault">
                <Coins className="w-6 h-6 text-brand-accent mx-auto mb-2" />
                <p className="text-sm text-brand-light/80">NFT Token ID</p>
                <p className="text-lg text-brand-light font-semibold">
                  #{capsuleData.nftTokenId}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => (window.location.href = "/capsules/gallery")}
                className="bg-brand-primary hover:bg-brand-primary/90"
              >
                <Eye className="w-4 h-4 mr-2" />
                View in Gallery
              </Button>
              <Button
                onClick={resetFlow}
                variant="outline"
                className="border-brand-surface text-brand-light hover:bg-brand-surface"
              >
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
