import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Shield, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Award,
  TrendingUp,
  FileCheck,
  Clock,
  Star
} from "lucide-react";

interface LicenseMetrics {
  totalLicenses: number;
  activeLicenses: number;
  revenueGenerated: number;
  averageRoyalty: number;
  topLicensedCapsules: Array<{
    capsuleId: string;
    title: string;
    licenses: number;
    revenue: number;
  }>;
  licenseTypeDistribution: Record<string, number>;
}

interface VerifierStats {
  totalVerifications: number;
  successfulVerifications: number;
  failedVerifications: number;
  averageSecurityScore: number;
  commonFailureReasons: Record<string, number>;
  authorizedSignerUsage: Record<string, number>;
}

export default function VerifiersPage() {
  const { toast } = useToast();
  const [licenseMetrics, setLicenseMetrics] = useState<LicenseMetrics | null>(null);
  const [verifierStats, setVerifierStats] = useState<VerifierStats | null>(null);
  const [searchLicense, setSearchLicense] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadVerifierData();
  }, []);

  const loadVerifierData = async () => {
    try {
      setLoading(true);
      
      // Load license metrics
      try {
        const licenseResponse = await apiRequest("GET", "/api/licenses/metrics");
        setLicenseMetrics(licenseResponse.metrics);
      } catch (error) {
        console.log("License metrics not available:", error);
      }

      // Load verifier statistics
      try {
        const verifierResponse = await apiRequest("GET", "/api/redeem/verify-stats");
        setVerifierStats(verifierResponse.stats);
      } catch (error) {
        console.log("Verifier stats not available:", error);
      }

    } catch (error) {
      console.error("Failed to load verifier data:", error);
      toast({
        title: "Error",
        description: "Failed to load verifier data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyLicense = async () => {
    if (!searchLicense.trim()) {
      toast({
        title: "Error",
        description: "Please enter a license ID to verify",
        variant: "destructive"
      });
      return;
    }

    try {
      setVerifying(true);
      
      const response = await apiRequest("POST", "/api/licenses/verify", {
        licenseId: searchLicense.trim()
      });

      setVerificationResult(response);
      
      if (response.valid) {
        toast({
          title: "License Valid",
          description: "License verification successful"
        });
      } else {
        toast({
          title: "License Invalid",
          description: response.error || "License verification failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify license",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  const getLicenseTypeBadge = (type: string) => {
    const badges = {
      'standard': <Badge variant="outline">Standard</Badge>,
      'commercial': <Badge className="bg-blue-600">Commercial</Badge>,
      'exclusive': <Badge className="bg-purple-600">Exclusive</Badge>,
      'creative_commons': <Badge className="bg-green-600">Creative Commons</Badge>
    };
    return badges[type as keyof typeof badges] || <Badge variant="secondary">{type}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Verifiers Explorer</h1>
        </div>
        <p className="text-gray-300 text-lg">
          License verification, validation statistics, and security metrics
        </p>
      </div>

      {/* License Verification */}
      <Card className="bg-gray-800 border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="h-5 w-5" />
            License Verification
          </CardTitle>
          <CardDescription>
            Verify the authenticity and validity of capsule licenses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter license ID to verify..."
              value={searchLicense}
              onChange={(e) => setSearchLicense(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              onKeyPress={(e) => e.key === 'Enter' && verifyLicense()}
            />
            <Button onClick={verifyLicense} disabled={verifying}>
              {verifying ? "Verifying..." : "Verify License"}
            </Button>
          </div>

          {verificationResult && (
            <div className={`p-4 rounded-lg border ${
              verificationResult.valid 
                ? 'bg-green-900/20 border-green-600' 
                : 'bg-red-900/20 border-red-600'
            }`}>
              <div className="flex items-start gap-3">
                {verificationResult.valid ? (
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-400 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">
                    {verificationResult.valid ? "License Valid" : "License Invalid"}
                  </h3>
                  
                  {verificationResult.valid && verificationResult.license && (
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400">Capsule ID:</span>
                          <span className="text-white ml-2">{verificationResult.license.capsuleId}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Type:</span>
                          <span className="ml-2">{getLicenseTypeBadge(verificationResult.license.licenseType)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Grief Score:</span>
                          <span className="text-white ml-2">{verificationResult.license.griefScore}/10</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Truth Confidence:</span>
                          <span className="text-white ml-2">{verificationResult.license.truthConfidence}%</span>
                        </div>
                      </div>
                      
                      {verificationResult.license.verification.isVerified && (
                        <div className="flex items-center gap-2 mt-3">
                          <Badge className="bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                          <span className="text-sm text-gray-300">
                            Compliance Score: {verificationResult.license.verification.complianceScore}/100
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {!verificationResult.valid && verificationResult.error && (
                    <p className="text-red-300">{verificationResult.error}</p>
                  )}

                  {verificationResult.warnings && verificationResult.warnings.length > 0 && (
                    <div className="mt-3">
                      <p className="text-yellow-400 font-medium">Warnings:</p>
                      <ul className="text-yellow-300 text-sm mt-1">
                        {verificationResult.warnings.map((warning: string, index: number) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="licenses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="licenses">License Metrics</TabsTrigger>
          <TabsTrigger value="verification">Verification Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="space-y-6">
          {licenseMetrics ? (
            <>
              {/* License Overview */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {licenseMetrics.totalLicenses}
                    </div>
                    <div className="text-gray-300 flex items-center justify-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      Total Licenses
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {licenseMetrics.activeLicenses}
                    </div>
                    <div className="text-gray-300 flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Active Licenses
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      {licenseMetrics.revenueGenerated.toFixed(0)}
                    </div>
                    <div className="text-gray-300 flex items-center justify-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Revenue (GTT)
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {licenseMetrics.averageRoyalty.toFixed(1)}%
                    </div>
                    <div className="text-gray-300 flex items-center justify-center gap-2">
                      <Award className="h-4 w-4" />
                      Avg Royalty
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* License Type Distribution */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">License Type Distribution</CardTitle>
                  <CardDescription>Breakdown of license types in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(licenseMetrics.licenseTypeDistribution).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getLicenseTypeBadge(type)}
                          <span className="text-white capitalize">{type.replace('_', ' ')}</span>
                        </div>
                        <div className="text-white font-bold">{count}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Licensed Capsules */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Star className="h-5 w-5" />
                    Top Licensed Capsules
                  </CardTitle>
                  <CardDescription>Most licensed truth capsules by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  {licenseMetrics.topLicensedCapsules.length > 0 ? (
                    <div className="space-y-3">
                      {licenseMetrics.topLicensedCapsules.map((capsule, index) => (
                        <div key={capsule.capsuleId} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-white font-medium">{capsule.title}</p>
                              <p className="text-sm text-gray-400">{capsule.capsuleId.slice(0, 12)}...</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">{capsule.revenue.toFixed(2)} GTT</p>
                            <p className="text-sm text-gray-400">{capsule.licenses} licenses</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-8">No licensed capsules yet</p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <p className="text-gray-300">License metrics not available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          {verifierStats ? (
            <>
              {/* Verification Overview */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {verifierStats.totalVerifications}
                    </div>
                    <div className="text-gray-300 flex items-center justify-center gap-2">
                      <Users className="h-4 w-4" />
                      Total Verifications
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {((verifierStats.successfulVerifications / verifierStats.totalVerifications) * 100).toFixed(1)}%
                    </div>
                    <div className="text-gray-300 flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Success Rate
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {verifierStats.averageSecurityScore.toFixed(1)}
                    </div>
                    <div className="text-gray-300 flex items-center justify-center gap-2">
                      <Shield className="h-4 w-4" />
                      Avg Security Score
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      {verifierStats.failedVerifications}
                    </div>
                    <div className="text-gray-300 flex items-center justify-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Failed Verifications
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Common Failure Reasons */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Common Failure Reasons</CardTitle>
                  <CardDescription>Most frequent causes of verification failures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(verifierStats.commonFailureReasons)
                      .sort(([,a], [,b]) => b - a)
                      .map(([reason, count]) => (
                        <div key={reason} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <span className="text-white capitalize">{reason.replace('_', ' ')}</span>
                          <Badge variant="destructive">{count}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Authorized Signer Usage */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Authorized Signer Activity</CardTitle>
                  <CardDescription>Usage statistics for authorized verification signers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(verifierStats.authorizedSignerUsage).map(([signer, usage]) => (
                      <div key={signer} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div>
                          <p className="text-white font-mono">{signer}</p>
                          <p className="text-sm text-gray-400">Authorized Signer</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{usage}</p>
                          <p className="text-sm text-gray-400">verifications</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <p className="text-gray-300">Verification statistics not available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}