import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  Check,
  X,
  Loader2,
  ExternalLink,
  Download,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SealModalProps {
  capsuleId: string;
  capsuleTitle?: string;
  content: string;
  onClose: () => void;
  onSealed?: (sealData: any) => void;
}

interface SealResponse {
  success: boolean;
  seal: {
    sealId: string;
    envelopeId: string;
    status: string;
    veritasUrl: string;
    certificateUrl: string;
    expiresAt: string;
  };
  capsule: any;
}

export default function SealModal({
  capsuleId,
  capsuleTitle,
  content,
  onClose,
  onSealed,
}: SealModalProps) {
  const [sealData, setSealData] = useState<SealResponse | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sealMutation = useMutation({
    mutationFn: async (data: { capsuleId: string; content: string }) => {
      const response = await apiRequest("POST", "/api/seal", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create Veritas seal");
      }
      return response.json();
    },
    onSuccess: (data: SealResponse) => {
      setSealData(data);
      onSealed?.(data);

      // Invalidate relevant queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      queryClient.invalidateQueries({
        queryKey: [`/api/capsules/${capsuleId}`],
      });

      toast({
        title: "Veritas Seal Created",
        description:
          "Your capsule has been successfully sealed with DocuSign Veritas",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sealing Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSeal = () => {
    sealMutation.mutate({
      capsuleId,
      content,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {sealData ? "Veritas Seal Created" : "Create Veritas Seal"}
                </h3>
                <p className="text-sm text-slate-400 font-normal">
                  {capsuleTitle || `Capsule #${capsuleId}`}
                </p>
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!sealData ? (
            // Pre-seal state
            <div className="space-y-4">
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-white mb-2">
                  What is a Veritas Seal?
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  A Veritas Seal is a DocuSign-powered digital certificate that
                  creates immutable proof of your capsule's authenticity and
                  timestamp. Once sealed, the content cannot be altered without
                  detection.
                </p>
              </div>

              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-1">
                      Important Notice
                    </h4>
                    <p className="text-blue-200 text-sm">
                      Sealing this capsule will make it permanently immutable.
                      You will not be able to edit the content after sealing.
                      Please review your content carefully.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg max-h-40 overflow-y-auto">
                <h4 className="font-semibold text-white mb-2">
                  Content Preview
                </h4>
                <p className="text-slate-300 text-sm whitespace-pre-wrap">
                  {content.length > 300
                    ? `${content.substring(0, 300)}...`
                    : content}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleSeal}
                  disabled={sealMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {sealMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Seal...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Create Veritas Seal
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // Post-seal success state
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="bg-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Seal Created Successfully!
                </h3>
                <p className="text-slate-300">
                  Your capsule is now permanently sealed and verified
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-400"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Sealed
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Seal ID:</span>
                      <span className="text-white font-mono text-xs">
                        {sealData.seal.sealId.slice(0, 12)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <Badge variant="default" className="bg-green-600">
                        {sealData.seal.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expires:</span>
                      <span className="text-white text-xs">
                        {new Date(sealData.seal.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-3">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    <a
                      href={sealData.seal.veritasUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Veritas Seal
                    </a>
                    <a
                      href={sealData.seal.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download Certificate
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-green-900/20 p-4 rounded-lg border border-green-700">
                <h4 className="font-semibold text-green-400 mb-2">
                  What happens next?
                </h4>
                <ul className="text-green-200 text-sm space-y-1">
                  <li>
                    • Your capsule is now immutably sealed and timestamped
                  </li>
                  <li>
                    • The Veritas certificate provides legal-grade proof of
                    authenticity
                  </li>
                  <li>
                    • You can now share the sealed capsule with verified
                    provenance
                  </li>
                  <li>
                    • The seal will be visible to all viewers as a trust
                    indicator
                  </li>
                </ul>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={onClose}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-8"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
