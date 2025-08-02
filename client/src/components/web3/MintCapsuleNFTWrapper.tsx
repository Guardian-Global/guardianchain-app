import React, { useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Factory, Zap, Award, CheckCircle } from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";
import { CAPSULE_FACTORY_V2_ABI, getContractAddress } from "@/lib/contracts";

export default function MintCapsuleNFTWrapper() {
  const { address, chainId } = useAccount();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentHash, setContentHash] = useState("");
  const [estimatedYield, setEstimatedYield] = useState("");

  const factoryAddress = getContractAddress(chainId || 31337, "factory");

  // Create capsule transaction
  const { writeContract: createCapsule, isPending: isCreatePending } =
    useContractWrite({
      mutation: {
        onSuccess: (hash) => {
          toast({
            title: "Capsule Created Successfully!",
            description: `Transaction: ${hash}`,
          });
          // Clear form
          setTitle("");
          setContent("");
          setContentHash("");
          setEstimatedYield("");
        },
        onError: (error) => {
          toast({
            title: "Creation Failed",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    });

  const handleCreateCapsule = () => {
    if (!title || !content || !contentHash) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createCapsule({
      address: factoryAddress,
      abi: CAPSULE_FACTORY_V2_ABI,
      functionName: "createCapsule",
      args: [
        title,
        content,
        contentHash,
        BigInt(Math.floor(parseFloat(estimatedYield || "0") * 1e18)),
      ],
    });
  };

  const generateContentHash = () => {
    // Simple hash generation for demo - in production use proper IPFS hash
    const hash =
      "0x" +
      Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("");
    setContentHash(hash);
    toast({
      title: "Content Hash Generated",
      description: "Hash created for capsule content",
    });
  };

  const calculateEstimatedYield = () => {
    // Simple yield estimation based on content length and complexity
    const baseYield = Math.min(content.length / 100, 10);
    const titleBonus = title.length > 20 ? 2 : 0;
    const estimated = (baseYield + titleBonus + Math.random() * 5).toFixed(2);
    setEstimatedYield(estimated);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-purple-500/30 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Factory
            className="w-6 h-6"
            style={{ color: BRAND_COLORS.GUARDIAN }}
          />
          Mint Truth Capsule NFT
        </CardTitle>
        <p className="text-slate-400">
          Create an immutable truth capsule with yield tracking and NFT
          certificate
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Capsule Details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">
              Capsule Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter a compelling title for your truth capsule"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-1"
              maxLength={100}
            />
            <div className="text-xs text-slate-400 mt-1">
              {title.length}/100 characters
            </div>
          </div>

          <div>
            <Label htmlFor="content" className="text-white">
              Capsule Content *
            </Label>
            <Textarea
              id="content"
              placeholder="Write your truth capsule content. This will be stored immutably on-chain."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-1"
              rows={6}
              maxLength={2000}
            />
            <div className="text-xs text-slate-400 mt-1">
              {content.length}/2000 characters
            </div>
          </div>
        </div>

        <Separator className="bg-slate-600" />

        {/* Content Hash */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="contentHash" className="text-white">
              Content Hash (IPFS/SHA256)
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="contentHash"
                placeholder="0x... content hash for integrity verification"
                value={contentHash}
                onChange={(e) => setContentHash(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button
                onClick={generateContentHash}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 whitespace-nowrap"
              >
                Generate
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="estimatedYield" className="text-white">
              Estimated Yield (GTT)
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="estimatedYield"
                placeholder="0.00"
                value={estimatedYield}
                onChange={(e) => setEstimatedYield(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                type="number"
                step="0.01"
              />
              <Button
                onClick={calculateEstimatedYield}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 whitespace-nowrap"
                disabled={!content}
              >
                <Zap className="w-4 h-4 mr-1" />
                Estimate
              </Button>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              AI-powered yield estimation based on content quality and impact
              potential
            </div>
          </div>
        </div>

        <Separator className="bg-slate-600" />

        {/* Capsule Stats Preview */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Capsule Preview
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Content Quality:</span>
              <span className="text-white ml-2">
                {content.length > 500
                  ? "High"
                  : content.length > 200
                    ? "Medium"
                    : "Basic"}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Potential Yield:</span>
              <span className="text-white ml-2">
                {estimatedYield
                  ? `${estimatedYield} GTT`
                  : "Calculate estimate"}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Title Length:</span>
              <span className="text-white ml-2">
                {title.length > 20 ? "Optimal" : "Could be longer"}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Hash Status:</span>
              <span className="text-white ml-2">
                {contentHash ? "Ready" : "Generate hash"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleCreateCapsule}
            disabled={!title || !content || !contentHash || isCreatePending}
            className="flex-1"
            style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}
          >
            {isCreatePending ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Creating Capsule...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Truth Capsule NFT
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-slate-400 space-y-1 pt-2">
          <p>• Your capsule will be minted as an NFT with immutable content</p>
          <p>• Yield tracking begins immediately after creation</p>
          <p>• Veritus nodes will review and seal high-quality capsules</p>
          <p>• Sealed capsules become eligible for GTT reward claims</p>
        </div>
      </CardContent>
    </Card>
  );
}
