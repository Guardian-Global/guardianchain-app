import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  CheckCircle,
  ExternalLink,
  FileText,
  Clock,
  Star,
  Loader2,
} from "lucide-react";
import { BRAND_COLORS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface VeritasSealProps {
  capsuleId?: string;
  onSealComplete?: (sealData: any) => void;
}

export default function VeritasSeal({
  capsuleId,
  onSealComplete,
}: VeritasSealProps) {
  const { toast } = useToast();
  const [selectedCapsuleId, setSelectedCapsuleId] = useState(capsuleId || "");
  const [sealReason, setSealReason] = useState("");
  const [isSealing, setIsSealing] = useState(false);

  const sealMutation = useMutation({
    mutationFn: async (data: { capsuleId: string; reason: string }) => {
      return apiRequest("POST", "/api/veritas/seal", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Veritas Seal Applied",
        description:
          "Your truth capsule has been sealed with DocuSign verification.",
      });
      onSealComplete?.(data);
      setSealReason("");
    },
    onError: (error: any) => {
      toast({
        title: "Seal Failed",
        description: error.message || "Failed to apply Veritas seal.",
        variant: "destructive",
      });
    },
  });

  const handleSeal = () => {
    if (!selectedCapsuleId.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a capsule ID to seal.",
        variant: "destructive",
      });
      return;
    }

    sealMutation.mutate({
      capsuleId: selectedCapsuleId.trim(),
      reason: sealReason.trim(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Veritas Seal</h1>
        <p className="text-slate-400">
          Apply immutable DocuSign verification to your truth capsules for legal
          authenticity
        </p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5" style={{ color: BRAND_COLORS.CHAIN }} />
            Apply Veritas Seal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Capsule ID</label>
            <Input
              value={selectedCapsuleId}
              onChange={(e) => setSelectedCapsuleId(e.target.value)}
              placeholder="Enter capsule ID to seal"
              className="bg-slate-700/50 border-slate-600 text-white"
              disabled={!!capsuleId} // Disable if capsuleId prop is provided
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Seal Reason (Optional)
            </label>
            <Textarea
              value={sealReason}
              onChange={(e) => setSealReason(e.target.value)}
              placeholder="Describe why this capsule needs legal verification..."
              className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleSeal}
            disabled={sealMutation.isPending || !selectedCapsuleId.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {sealMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Applying Veritas Seal...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Apply Veritas Seal
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4 text-center">
            <FileText
              className="w-8 h-8 mx-auto mb-2"
              style={{ color: BRAND_COLORS.CHAIN }}
            />
            <h3 className="font-semibold text-white mb-1">
              Legal Authenticity
            </h3>
            <p className="text-sm text-slate-400">
              DocuSign-backed verification with legal validity
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4 text-center">
            <Clock
              className="w-8 h-8 mx-auto mb-2"
              style={{ color: BRAND_COLORS.CHAIN }}
            />
            <h3 className="font-semibold text-white mb-1">
              Immutable Timestamp
            </h3>
            <p className="text-sm text-slate-400">
              Blockchain-backed proof of submission time
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4 text-center">
            <Star
              className="w-8 h-8 mx-auto mb-2"
              style={{ color: BRAND_COLORS.CHAIN }}
            />
            <h3 className="font-semibold text-white mb-1">
              Premium Verification
            </h3>
            <p className="text-sm text-slate-400">
              Highest level of truth verification available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">How Veritas Seal Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-slate-400">
          <div className="flex items-start gap-3">
            <Badge
              variant="outline"
              className="border-purple-600 text-purple-400 mt-1"
            >
              1
            </Badge>
            <p>Enter your capsule ID and optional verification reason</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge
              variant="outline"
              className="border-purple-600 text-purple-400 mt-1"
            >
              2
            </Badge>
            <p>System generates DocuSign envelope with your capsule content</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge
              variant="outline"
              className="border-purple-600 text-purple-400 mt-1"
            >
              3
            </Badge>
            <p>Legal verification seal is applied with blockchain timestamp</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge
              variant="outline"
              className="border-purple-600 text-purple-400 mt-1"
            >
              4
            </Badge>
            <p>
              Immutable certificate link is generated for public verification
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
