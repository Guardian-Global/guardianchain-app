import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Shield, 
  Search, 
  Zap, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu,
  Database,
  Network,
  TrendingUp,
  Download,
  MessageSquare
} from "lucide-react";

interface IPFSMetadata {
  title: string;
  griefScore: number;
  author: string;
  description: string;
  category?: string;
  timestamp?: string;
  emotionalResonance?: number;
}

interface UnlockBoostResult {
  canUnlock: boolean;
  timeReduction: number;
  boostType: string;
  remainingTime: number;
  eligibleBoosts: string[];
  remainingTimeFormatted: string;
  timeReductionFormatted: string;
}

interface ZKVerificationResult {
  valid: boolean;
  confidenceScore: number;
  verificationTime: number;
  errors?: string[];
}

interface AuditResult {
  capsuleId: string;
  title: string;
  griefScore: number;
  chain: string;
  unlocked: boolean;
  zkValid: boolean;
  confidenceScore: number;
  boostType: string;
  timeReduction: number;
  timestamp: string;
  errors?: string[];
}

export default function ValidatorPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ipfs");

  // IPFS Metadata State
  const [ipfsCid, setIpfsCid] = useState("");
  const [ipfsMetadata, setIpfsMetadata] = useState<IPFSMetadata | null>(null);
  const [batchCids, setBatchCids] = useState("");
  const [batchResults, setBatchResults] = useState<any[]>([]);

  // Unlock Boost State
  const [boostParams, setBoostParams] = useState({
    griefScore: 8,
    chainId: 8453,
    unlockTimestamp: Date.now() + 3600000,
    userTier: "CREATOR" as const,
    premiumBonus: true
  });
  const [boostResult, setBoostResult] = useState<UnlockBoostResult | null>(null);

  // ZK Verification State
  const [zkParams, setZkParams] = useState({
    griefScore: 8,
    chainId: 8453,
    unlockTimestamp: Date.now() + 1800000,
    userAddress: "0x742d35Cc6635Ca0532aB6d15e12c1F8D1a4eF0b7",
    nonce: "123456"
  });
  const [zkResult, setZkResult] = useState<ZKVerificationResult | null>(null);

  // Audit State
  const [auditData, setAuditData] = useState("");
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [auditSummary, setAuditSummary] = useState<any>(null);

  // Fetch IPFS Metadata
  const fetchIPFSMetadata = async () => {
    if (!ipfsCid.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid IPFS CID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("GET", `/api/validation/ipfs-meta/${ipfsCid.trim()}`);
      setIpfsMetadata(response.metadata);
      toast({
        title: "Success",
        description: "IPFS metadata fetched successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch IPFS metadata",
        variant: "destructive"
      });
      setIpfsMetadata(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Batch IPFS Metadata
  const fetchBatchIPFSMetadata = async () => {
    const cids = batchCids.split('\n').map(cid => cid.trim()).filter(cid => cid);
    if (cids.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter at least one IPFS CID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/validation/ipfs-meta/batch", { cids });
      setBatchResults(response.results);
      toast({
        title: "Success",
        description: `Batch fetch completed: ${response.successfulFetches}/${response.totalRequested} successful`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch batch IPFS metadata",
        variant: "destructive"
      });
      setBatchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Check Unlock Boost
  const checkUnlockBoost = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/validation/unlock-boost", boostParams);
      setBoostResult(response.boostResult);
      toast({
        title: "Success",
        description: response.unlockEligible ? "Capsule can be unlocked!" : "Capsule is still locked"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check unlock boost",
        variant: "destructive"
      });
      setBoostResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Verify ZK Proof
  const verifyZKProof = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/validation/zk-verify", zkParams);
      setZkResult(response.verification);
      toast({
        title: "Success",
        description: response.verification.valid ? "ZK proof is valid!" : "ZK proof failed validation"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify ZK proof",
        variant: "destructive"
      });
      setZkResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Run Validation Audit
  const runValidationAudit = async () => {
    let capsules;
    try {
      capsules = JSON.parse(auditData || "[]");
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please enter valid JSON data for capsules",
        variant: "destructive"
      });
      return;
    }

    if (!Array.isArray(capsules) || capsules.length === 0) {
      // Generate sample data for demonstration
      capsules = [
        {
          id: "cap_demo_001",
          cid: "QmMockCID123",
          title: "Demo Base Capsule",
          chain: "base",
          chainId: 8453,
          griefScore: 9,
          unlockTimestamp: Date.now() + 1800000,
          userTier: "CREATOR",
          premiumBonus: true
        },
        {
          id: "cap_demo_002", 
          cid: "QmMockCID456",
          title: "Demo Polygon Capsule",
          chain: "polygon",
          chainId: 137,
          griefScore: 6,
          unlockTimestamp: Date.now() + 3600000,
          userTier: "SEEKER",
          premiumBonus: false
        },
        {
          id: "cap_demo_003",
          cid: "QmMockCID789",
          title: "Demo High Grief Capsule",
          chain: "base",
          chainId: 8453,
          griefScore: 10,
          unlockTimestamp: Date.now() + 900000,
          userTier: "SOVEREIGN",
          premiumBonus: true
        }
      ];
    }

    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/validation/audit", { 
        capsules, 
        exportToCSV: true 
      });
      setAuditResults(response.results);
      setAuditSummary(response.audit);
      toast({
        title: "Success",
        description: `Audit completed: ${response.audit.unlockedCount}/${response.audit.totalCapsules} unlocked`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run validation audit",
        variant: "destructive"
      });
      setAuditResults([]);
      setAuditSummary(null);
    } finally {
      setLoading(false);
    }
  };

  // Test Discord Webhook
  const testDiscordWebhook = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/validation/test-discord");
      toast({
        title: response.success ? "Success" : "Warning",
        description: response.message,
        variant: response.success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test Discord webhook",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getChainBadgeColor = (chainId: number) => {
    switch (chainId) {
      case 8453: return "bg-blue-500";
      case 137: return "bg-purple-500";
      case 1: return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 8453: return "Base";
      case 137: return "Polygon";
      case 1: return "Ethereum";
      default: return "Unknown";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-cyan-400" />
          <h1 className="text-3xl font-bold text-white">GuardianChain Validator</h1>
        </div>
        <p className="text-gray-300 text-lg">
          Enterprise-grade validation tools for grief scores, IPFS metadata, zero-knowledge proofs, and capsule auditing
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
          <TabsTrigger value="ipfs" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            IPFS Metadata
          </TabsTrigger>
          <TabsTrigger value="boost" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Unlock Boost
          </TabsTrigger>
          <TabsTrigger value="zk" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            ZK Verification
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Audit System
          </TabsTrigger>
        </TabsList>

        {/* IPFS Metadata Tab */}
        <TabsContent value="ipfs" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Single CID Fetch */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Search className="h-5 w-5" />
                  Single CID Fetch
                </CardTitle>
                <CardDescription>
                  Fetch metadata for a single IPFS Content Identifier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ipfs-cid">IPFS CID</Label>
                  <Input
                    id="ipfs-cid"
                    value={ipfsCid}
                    onChange={(e) => setIpfsCid(e.target.value)}
                    placeholder="QmExampleCID123..."
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <Button 
                  onClick={fetchIPFSMetadata} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Fetching..." : "Fetch Metadata"}
                </Button>

                {ipfsMetadata && (
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Metadata Result</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Title:</strong> {ipfsMetadata.title}</div>
                      <div><strong>Author:</strong> {ipfsMetadata.author}</div>
                      <div className="flex items-center gap-2">
                        <strong>Grief Score:</strong> 
                        <Badge variant={ipfsMetadata.griefScore >= 8 ? "default" : "secondary"}>
                          {ipfsMetadata.griefScore}/10
                        </Badge>
                      </div>
                      <div><strong>Description:</strong> {ipfsMetadata.description}</div>
                      {ipfsMetadata.emotionalResonance && (
                        <div><strong>Emotional Resonance:</strong> {ipfsMetadata.emotionalResonance}%</div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Batch CID Fetch */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Network className="h-5 w-5" />
                  Batch CID Fetch
                </CardTitle>
                <CardDescription>
                  Fetch metadata for multiple CIDs (max 50)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="batch-cids">IPFS CIDs (one per line)</Label>
                  <Textarea
                    id="batch-cids"
                    value={batchCids}
                    onChange={(e) => setBatchCids(e.target.value)}
                    placeholder="QmExampleCID1...&#10;QmExampleCID2...&#10;QmExampleCID3..."
                    rows={4}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <Button 
                  onClick={fetchBatchIPFSMetadata} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Fetching..." : "Batch Fetch"}
                </Button>

                {batchResults.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-white">Batch Results</h4>
                    {batchResults.map((result, index) => (
                      <div key={index} className="p-2 bg-gray-700 rounded text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-xs bg-gray-600 px-1 rounded">{result.cid.slice(0, 12)}...</code>
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        {result.metadata && (
                          <div>
                            <strong>{result.metadata.title}</strong> - Grief: {result.metadata.griefScore}/10
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Unlock Boost Tab */}
        <TabsContent value="boost" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5" />
                  Boost Parameters
                </CardTitle>
                <CardDescription>
                  Configure parameters for unlock boost validation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grief-score">Grief Score</Label>
                    <Input
                      id="grief-score"
                      type="number"
                      min="0"
                      max="10"
                      value={boostParams.griefScore}
                      onChange={(e) => setBoostParams(prev => ({
                        ...prev,
                        griefScore: parseInt(e.target.value) || 0
                      }))}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="chain-id">Chain ID</Label>
                    <select
                      id="chain-id"
                      value={boostParams.chainId}
                      onChange={(e) => setBoostParams(prev => ({
                        ...prev,
                        chainId: parseInt(e.target.value)
                      }))}
                      className="w-full h-10 px-3 rounded-md bg-gray-700 border border-gray-600 text-white"
                    >
                      <option value={8453}>Base (8453)</option>
                      <option value={137}>Polygon (137)</option>
                      <option value={1}>Ethereum (1)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="unlock-timestamp">Unlock Time (hours from now)</Label>
                  <Input
                    id="unlock-timestamp"
                    type="number"
                    min="0"
                    max="168"
                    step="0.5"
                    value={Math.round((boostParams.unlockTimestamp - Date.now()) / (1000 * 60 * 60) * 10) / 10}
                    onChange={(e) => setBoostParams(prev => ({
                      ...prev,
                      unlockTimestamp: Date.now() + (parseFloat(e.target.value) || 1) * 60 * 60 * 1000
                    }))}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user-tier">User Tier</Label>
                    <select
                      id="user-tier"
                      value={boostParams.userTier}
                      onChange={(e) => setBoostParams(prev => ({
                        ...prev,
                        userTier: e.target.value as any
                      }))}
                      className="w-full h-10 px-3 rounded-md bg-gray-700 border border-gray-600 text-white"
                    >
                      <option value="EXPLORER">Explorer</option>
                      <option value="SEEKER">Seeker</option>
                      <option value="CREATOR">Creator</option>
                      <option value="SOVEREIGN">Sovereign</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="premium-bonus"
                      checked={boostParams.premiumBonus}
                      onChange={(e) => setBoostParams(prev => ({
                        ...prev,
                        premiumBonus: e.target.checked
                      }))}
                      className="rounded"
                    />
                    <Label htmlFor="premium-bonus">Premium Bonus</Label>
                  </div>
                </div>

                <Button 
                  onClick={checkUnlockBoost} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Checking..." : "Check Unlock Boost"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5" />
                  Boost Results
                </CardTitle>
                <CardDescription>
                  Unlock eligibility and optimization details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {boostResult ? (
                  <div className="space-y-4">
                    <Alert className={boostResult.canUnlock ? "border-green-600 bg-green-950" : "border-yellow-600 bg-yellow-950"}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>
                        {boostResult.canUnlock ? "Unlock Available" : "Still Locked"}
                      </AlertTitle>
                      <AlertDescription>
                        {boostResult.canUnlock 
                          ? "This capsule can be unlocked now!"
                          : `Remaining time: ${boostResult.remainingTimeFormatted}`
                        }
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Boost Type:</strong>
                        <Badge className="ml-2">{boostResult.boostType}</Badge>
                      </div>
                      <div>
                        <strong>Time Reduction:</strong>
                        <span className="ml-2 text-green-400">{boostResult.timeReductionFormatted}</span>
                      </div>
                    </div>

                    {boostResult.eligibleBoosts.length > 0 && (
                      <div>
                        <strong className="block mb-2">Active Boosts:</strong>
                        <div className="flex flex-wrap gap-1">
                          {boostResult.eligibleBoosts.map((boost, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {boost}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    Configure parameters and click "Check Unlock Boost" to see results
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ZK Verification Tab */}
        <TabsContent value="zk" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Cpu className="h-5 w-5" />
                  ZK Proof Parameters
                </CardTitle>
                <CardDescription>
                  Configure zero-knowledge proof verification parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zk-grief-score">Grief Score</Label>
                    <Input
                      id="zk-grief-score"
                      type="number"
                      min="0"
                      max="10"
                      value={zkParams.griefScore}
                      onChange={(e) => setZkParams(prev => ({
                        ...prev,
                        griefScore: parseInt(e.target.value) || 0
                      }))}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zk-chain-id">Chain ID</Label>
                    <select
                      id="zk-chain-id"
                      value={zkParams.chainId}
                      onChange={(e) => setZkParams(prev => ({
                        ...prev,
                        chainId: parseInt(e.target.value)
                      }))}
                      className="w-full h-10 px-3 rounded-md bg-gray-700 border border-gray-600 text-white"
                    >
                      <option value={8453}>Base (8453)</option>
                      <option value={137}>Polygon (137)</option>
                      <option value={1}>Ethereum (1)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="zk-unlock-timestamp">Unlock Time (minutes from now)</Label>
                  <Input
                    id="zk-unlock-timestamp"
                    type="number"
                    min="0"
                    max="10080"
                    value={Math.round((zkParams.unlockTimestamp - Date.now()) / (1000 * 60))}
                    onChange={(e) => setZkParams(prev => ({
                      ...prev,
                      unlockTimestamp: Date.now() + (parseInt(e.target.value) || 30) * 60 * 1000
                    }))}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="zk-user-address">User Address (optional)</Label>
                  <Input
                    id="zk-user-address"
                    value={zkParams.userAddress}
                    onChange={(e) => setZkParams(prev => ({
                      ...prev,
                      userAddress: e.target.value
                    }))}
                    placeholder="0x742d35Cc6635Ca0532aB6d15e12c1F8D1a4eF0b7"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="zk-nonce">Nonce (optional)</Label>
                  <Input
                    id="zk-nonce"
                    value={zkParams.nonce}
                    onChange={(e) => setZkParams(prev => ({
                      ...prev,
                      nonce: e.target.value
                    }))}
                    placeholder="123456"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <Button 
                  onClick={verifyZKProof} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Verifying..." : "Verify ZK Proof"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  Verification Results
                </CardTitle>
                <CardDescription>
                  Zero-knowledge proof validation outcome
                </CardDescription>
              </CardHeader>
              <CardContent>
                {zkResult ? (
                  <div className="space-y-4">
                    <Alert className={zkResult.valid ? "border-green-600 bg-green-950" : "border-red-600 bg-red-950"}>
                      {zkResult.valid ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <AlertTitle>
                        {zkResult.valid ? "Proof Valid" : "Proof Invalid"}
                      </AlertTitle>
                      <AlertDescription>
                        Confidence Score: {zkResult.confidenceScore}%
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Confidence Score</span>
                        <Badge variant={zkResult.confidenceScore >= 90 ? "default" : "secondary"}>
                          {zkResult.confidenceScore}%
                        </Badge>
                      </div>
                      <Progress value={zkResult.confidenceScore} className="h-2" />
                    </div>

                    <div className="text-sm">
                      <strong>Verification Time:</strong> {zkResult.verificationTime}ms
                    </div>

                    {zkResult.errors && zkResult.errors.length > 0 && (
                      <div>
                        <strong className="block mb-2 text-red-400">Errors:</strong>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-300">
                          {zkResult.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    Configure parameters and click "Verify ZK Proof" to see results
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit System Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileCheck className="h-5 w-5" />
                Validation Audit System
              </CardTitle>
              <CardDescription>
                Run comprehensive validation audits on capsule data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="audit-data">Capsule Data (JSON format, leave empty for demo data)</Label>
                <Textarea
                  id="audit-data"
                  value={auditData}
                  onChange={(e) => setAuditData(e.target.value)}
                  placeholder='[{"id": "cap_001", "cid": "QmExample...", "title": "Sample Capsule", "chain": "base", "chainId": 8453, "griefScore": 8}]'
                  rows={6}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={runValidationAudit} 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Running Audit..." : "Run Validation Audit"}
                </Button>
                <Button 
                  onClick={testDiscordWebhook} 
                  disabled={loading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Test Discord
                </Button>
              </div>

              {auditSummary && (
                <div className="mt-6">
                  <h4 className="font-semibold text-white mb-4">Audit Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">{auditSummary.totalCapsules}</div>
                        <div className="text-sm text-gray-300">Total Capsules</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">{auditSummary.unlockedCount}</div>
                        <div className="text-sm text-gray-300">Unlocked ({auditSummary.unlockRate}%)</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400">{auditSummary.zkValidCount}</div>
                        <div className="text-sm text-gray-300">ZK Valid ({auditSummary.zkValidRate}%)</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-400">{auditSummary.averageGriefScore}</div>
                        <div className="text-sm text-gray-300">Avg Grief Score</div>
                      </CardContent>
                    </Card>
                  </div>

                  {auditResults.length > 0 && (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      <h5 className="font-semibold text-white">Detailed Results</h5>
                      {auditResults.map((result, index) => (
                        <div key={index} className="p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <strong className="text-white">{result.title}</strong>
                              <Badge className={getChainBadgeColor(137)} variant="secondary">
                                {result.chain.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              {result.unlocked ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-400" />
                              )}
                              {result.zkValid ? (
                                <Shield className="h-4 w-4 text-blue-400" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-400" />
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-300">
                            <div>Grief: {result.griefScore}/10</div>
                            <div>Boost: {result.boostType}</div>
                            <div>Confidence: {result.confidenceScore}%</div>
                            <div>Status: {result.unlocked ? "Unlocked" : "Locked"}</div>
                          </div>
                          {result.errors && result.errors.length > 0 && (
                            <div className="mt-2 text-xs text-red-300">
                              Errors: {result.errors.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}