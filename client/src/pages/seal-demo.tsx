import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, Star, CheckCircle, ExternalLink } from "lucide-react";
import SealStatus from "@/components/veritas/seal-status";

export default function SealDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [sealResult, setSealResult] = useState<any>(null);
  const { toast } = useToast();

  const testVeritasSeal = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/veritas/test-seal");
      const data = await response.json();
      
      setSealResult(data);
      toast({
        title: "Veritas Seal Test Successful",
        description: "DocuSign integration is working correctly",
      });
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            DocuSign Veritas Seal Integration
          </h1>
          <p className="text-slate-400 text-lg">
            Demonstration of blockchain-backed document verification for truth capsules
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span>Veritas Seal Testing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              Click the button below to test the DocuSign Veritas Seal integration. 
              This will generate a sample truth capsule and demonstrate the sealing process.
            </p>
            
            <Button 
              onClick={testVeritasSeal}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing Veritas Seal...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Test Veritas Seal Integration
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {sealResult && (
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Status:</span>
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {sealResult.seal?.status || 'Success'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-slate-300">Envelope ID:</strong>
                    <div className="text-slate-400 font-mono text-xs">
                      {sealResult.seal?.envelopeId}
                    </div>
                  </div>
                  <div>
                    <strong className="text-slate-300">Document Size:</strong>
                    <div className="text-slate-400">
                      {sealResult.seal?.pdfSize} bytes
                    </div>
                  </div>
                  <div>
                    <strong className="text-slate-300">DocuSign Configured:</strong>
                    <div className="text-slate-400">
                      {sealResult.config?.docusignConfigured ? '✅ Yes' : '❌ No'}
                    </div>
                  </div>
                  <div>
                    <strong className="text-slate-300">Database Connected:</strong>
                    <div className="text-slate-400">
                      {sealResult.config?.supabaseConfigured ? '✅ Yes' : '❌ No'}
                    </div>
                  </div>
                </div>

                {sealResult.seal?.veritasUrl && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(sealResult.seal.veritasUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Sample Veritas Certificate
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Show the seal status component with the mock data */}
            <SealStatus 
              capsule={{
                id: sealResult.capsule?.id || 999,
                status: "sealed",
                docusignEnvelopeId: sealResult.seal?.envelopeId,
                veritasSealUrl: sealResult.seal?.veritasUrl,
                title: sealResult.capsule?.title || "Test Capsule"
              }}
            />
          </div>
        )}

        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-slate-300">How Veritas Sealing Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-400">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <div>
                  <strong className="text-slate-300">Content Capture:</strong> Truth capsule content is formatted into a tamper-proof PDF document.
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <div>
                  <strong className="text-slate-300">DocuSign Sealing:</strong> Document is sent to DocuSign for Veritas Seal application with blockchain timestamping.
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <div>
                  <strong className="text-slate-300">Legal Validity:</strong> Sealed document provides legally admissible proof of content authenticity and submission time.
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                <div>
                  <strong className="text-slate-300">Verification:</strong> Users can verify the seal through DocuSign's platform and blockchain records.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}