import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Image, ExternalLink, Shield, Check, Clock, Star } from "lucide-react";

export default function NFTDemo() {
  const { toast } = useToast();
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const runNFTTest = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/mint/test");
      const data = await response.json();
      setTestResult(data);
      
      if (data.success) {
        toast({
          title: "NFT Test Successful!",
          description: "All NFT minting components are configured correctly.",
        });
      }
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

  const testVeritasSeal = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/veritas/test-seal");
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Veritas Seal Test Successful!",
          description: "DocuSign integration is working correctly.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Veritas Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateNFTMinting = async () => {
    setIsMinting(true);
    try {
      const response = await apiRequest("POST", "/api/mint", {
        capsuleId: 999,
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678"
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "NFT Simulation Successful!",
          description: `Metadata uploaded to IPFS: ${data.ipfsHash}`,
        });
      } else {
        throw new Error(data.error || "Minting simulation failed");
      }
    } catch (error: any) {
      toast({
        title: "Simulation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          GuardianChain NFT Integration Demo
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Test the complete NFT minting workflow including Veritas Seal verification, 
          IPFS metadata upload, and blockchain integration capabilities.
        </p>
      </div>

      {/* Integration Status Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              DocuSign Veritas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge className="bg-green-600 text-white">
                <Check className="h-3 w-3 mr-1" />
                Configured
              </Badge>
              <p className="text-sm text-slate-400">
                Legal document sealing and verification with DocuSign Veritas technology.
              </p>
              <Button 
                onClick={testVeritasSeal}
                disabled={isLoading}
                size="sm" 
                className="w-full"
                variant="outline"
              >
                Test Seal Integration
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-blue-400" />
              IPFS Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge className="bg-green-600 text-white">
                <Check className="h-3 w-3 mr-1" />
                Configured
              </Badge>
              <p className="text-sm text-slate-400">
                Decentralized metadata storage via Pinata IPFS gateway.
              </p>
              <Button 
                onClick={runNFTTest}
                disabled={isLoading}
                size="sm" 
                className="w-full"
                variant="outline"
              >
                Test IPFS Upload
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Blockchain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge className="bg-yellow-600 text-white">
                <Clock className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
              <p className="text-sm text-slate-400">
                NFT contract deployment and minting ready for production.
              </p>
              <Button 
                onClick={simulateNFTMinting}
                disabled={isMinting}
                size="sm" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isMinting ? "Simulating..." : "Simulate Mint"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mock Capsule Example */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            Example: Sealed Truth Capsule Ready for NFT Minting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Climate Data Verification Report</h3>
                <p className="text-slate-400">
                  Scientific study documenting temperature anomalies in Arctic ice sheets between 2020-2024, 
                  verified by peer review and sealed with DocuSign Veritas for legal authenticity.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-blue-600 text-white">Science</Badge>
                  <Badge className="bg-purple-600 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Sealed with Veritas
                  </Badge>
                  <Badge className="bg-green-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Grief Score: 1.0
                  </Badge>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm text-slate-400">GTT Reward</div>
                <div className="text-lg font-bold text-green-400">100.00 GTT</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                View Veritas Certificate
              </Button>
              <Button 
                onClick={simulateNFTMinting}
                disabled={isMinting}
                size="sm" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Image className="h-3 w-3 mr-2" />
                {isMinting ? "Minting..." : "Mint as NFT"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResult && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-400" />
              NFT Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Configuration Status</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Thirdweb:</span>
                      <Badge className={testResult.thirdwebConfigured ? "bg-green-600" : "bg-red-600"}>
                        {testResult.thirdwebConfigured ? "Ready" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pinata IPFS:</span>
                      <Badge className={testResult.pinataConfigured ? "bg-green-600" : "bg-red-600"}>
                        {testResult.pinataConfigured ? "Ready" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ready for Minting:</span>
                      <Badge className={testResult.readyForMinting ? "bg-green-600" : "bg-yellow-600"}>
                        {testResult.readyForMinting ? "Yes" : "Demo Mode"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Sample NFT Metadata</h4>
                  <div className="text-sm space-y-1">
                    <div><span className="text-slate-400">Name:</span> {testResult.generatedMetadata?.name}</div>
                    <div><span className="text-slate-400">Category:</span> {testResult.mockCapsule?.category}</div>
                    <div><span className="text-slate-400">Attributes:</span> {testResult.generatedMetadata?.attributes?.length} traits</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-900 rounded-lg">
                <pre className="text-xs text-slate-300 overflow-x-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Implementation Notes */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Implementation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-400 mt-0.5" />
              <div>
                <strong>Veritas Seal Integration:</strong> Complete with DocuSign API, PDF generation, and legal verification workflow.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-400 mt-0.5" />
              <div>
                <strong>IPFS Metadata Upload:</strong> Functional with Pinata gateway for decentralized storage.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-400 mt-0.5" />
              <div>
                <strong>NFT Metadata Schema:</strong> ERC-721 compliant with GuardianChain-specific attributes.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-yellow-400 mt-0.5" />
              <div>
                <strong>Smart Contract Deployment:</strong> Ready for production deployment on Polygon network.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-400 mt-0.5" />
              <div>
                <strong>Frontend Integration:</strong> Capsule cards show minting buttons and verification status.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}