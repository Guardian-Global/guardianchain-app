import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck, DollarSign, Clock, CheckCircle } from "lucide-react";

interface LicenseVerification {
  id: string;
  capsuleId: string;
  licenseType: "commercial" | "exclusive" | "creative_commons";
  status: "pending" | "approved" | "rejected";
  payoutAmount: number;
  verifierName: string;
  submittedDate: string;
  processingTime: string;
}

export default function LicenseVerifier() {
  const { data: verifications, isLoading } = useQuery({
    queryKey: ["/api/explorer/verifiers"],
  });

  if (isLoading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-brand-light/60">Loading license verifications...</p>
        </CardContent>
      </Card>
    );
  }

  const getLicenseColor = (type: string) => {
    switch (type) {
      case "commercial": return "text-green-400 border-green-500";
      case "exclusive": return "text-purple-400 border-purple-500";
      case "creative_commons": return "text-blue-400 border-blue-500";
      default: return "text-gray-400 border-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-400 border-green-500";
      case "rejected": return "text-red-400 border-red-500";
      case "pending": return "text-yellow-400 border-yellow-500";
      default: return "text-gray-400 border-gray-500";
    }
  };

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-brand-accent" />
          License Verification Queue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {verifications?.map((verification: LicenseVerification) => (
            <div key={verification.id} className="p-4 bg-brand-surface rounded-lg border border-brand-light/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    className={getLicenseColor(verification.licenseType)}
                  >
                    {verification.licenseType.replace('_', ' ')}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={getStatusColor(verification.status)}
                  >
                    {verification.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-brand-warning" />
                  <span className="text-sm font-medium text-brand-warning">
                    {verification.payoutAmount} GTT
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-light/60">Capsule ID:</span>
                  <span className="text-brand-light font-mono">{verification.capsuleId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-light/60">Verifier:</span>
                  <span className="text-brand-light">{verification.verifierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-light/60">Submitted:</span>
                  <span className="text-brand-light/80">{verification.submittedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-light/60">Processing Time:</span>
                  <span className="text-brand-light/80 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {verification.processingTime}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 h-8">
                  View Details
                </Button>
                {verification.status === "pending" && (
                  <Button size="sm" className="flex-1 h-8 bg-brand-primary hover:bg-brand-primary/80">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}