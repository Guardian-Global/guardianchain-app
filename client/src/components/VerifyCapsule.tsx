import { useState } from "react";
import {
  Shield,
  CheckCircle,
  XCircle,
  Search,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const VerifyCapsule = () => {
  const [capsuleId, setCapsuleId] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    capsuleData?: {
      title: string;
      creator: string;
      timestamp: string;
      griefScore: number;
      sealStatus: string;
      category: string;
      docuSignId?: string;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock verification data for demo
  const mockCapsules = {
    "VC-001": {
      title: "Climate Data Analysis Q3 2024",
      creator: "0xAb...123",
      timestamp: "2024-07-15T10:30:00Z",
      griefScore: 94,
      sealStatus: "Sealed",
      category: "Environment",
      docuSignId: "DS-7891234",
    },
    "VC-002": {
      title: "Financial Transparency Report",
      creator: "0xCd...456",
      timestamp: "2024-07-14T14:20:00Z",
      griefScore: 89,
      sealStatus: "Sealed",
      category: "Economics",
      docuSignId: "DS-7891235",
    },
    "VC-003": {
      title: "Medical Research Truth",
      creator: "0xEf...789",
      timestamp: "2024-07-13T09:15:00Z",
      griefScore: 97,
      sealStatus: "Sealed",
      category: "Health",
      docuSignId: "DS-7891236",
    },
  };

  const handleVerify = async () => {
    if (!capsuleId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a capsule ID to verify",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const capsuleData = mockCapsules[capsuleId as keyof typeof mockCapsules];

    if (capsuleData) {
      setVerificationResult({
        verified: true,
        capsuleData,
      });
      toast({
        title: "Verification Successful",
        description: "Capsule authenticity confirmed",
      });
    } else {
      setVerificationResult({
        verified: false,
      });
      toast({
        title: "Verification Failed",
        description: "Capsule not found or invalid",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Environment: "bg-green-600",
      Economics: "bg-yellow-600",
      Health: "bg-purple-600",
      Technology: "bg-blue-600",
      Legal: "bg-gray-600",
      Politics: "bg-red-600",
    };
    return colors[category] || "bg-slate-600";
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <span className="text-white">Capsule Verification</span>
        </CardTitle>
        <p className="text-slate-400">
          Verify the authenticity and integrity of any GuardianChain capsule
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Enter Capsule ID (e.g. VC-001, VC-002, VC-003)"
              value={capsuleId}
              onChange={(e) => setCapsuleId(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              onKeyPress={(e) => e.key === "Enter" && handleVerify()}
            />
          </div>
          <Button
            onClick={handleVerify}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Verifying...
              </div>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Verify
              </>
            )}
          </Button>
        </div>

        {verificationResult && (
          <div className="mt-6">
            {verificationResult.verified ? (
              <Card className="border-green-500/30 bg-green-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-400">
                        ✅ Verified Capsule
                      </h3>
                      <p className="text-sm text-slate-300">
                        This capsule is authentic and verified
                      </p>
                    </div>
                  </div>

                  {verificationResult.capsuleData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-slate-400">
                            Title
                          </label>
                          <p className="text-white font-semibold">
                            {verificationResult.capsuleData.title}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-400">
                            Creator
                          </label>
                          <p className="text-white font-mono text-sm">
                            {verificationResult.capsuleData.creator}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-400">
                            Category
                          </label>
                          <Badge
                            className={`${getCategoryColor(
                              verificationResult.capsuleData.category
                            )} text-white`}
                          >
                            {verificationResult.capsuleData.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-slate-400">
                            Grief Score
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-yellow-400">
                              {verificationResult.capsuleData.griefScore}
                            </span>
                            <Zap className="w-4 h-4 text-yellow-400" />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-400">
                            Seal Status
                          </label>
                          <Badge className="bg-green-600 text-white">
                            {verificationResult.capsuleData.sealStatus}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-400">
                            DocuSign ID
                          </label>
                          <p className="text-blue-400 font-mono text-sm">
                            {verificationResult.capsuleData.docuSignId}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-red-500/30 bg-red-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-8 w-8 text-red-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-400">
                        ❌ Verification Failed
                      </h3>
                      <p className="text-sm text-slate-300">
                        Capsule not found or invalid. Please check the ID and
                        try again.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">
              Demo Mode
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Try sample IDs: VC-001, VC-002, VC-003 for verification demo
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifyCapsule;
