import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Hash,
  Calendar,
  User,
  FileText,
  Eye,
  ExternalLink,
  Copy,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerificationResult {
  id: string;
  hash: string;
  title: string;
  author: string;
  createdAt: string;
  blockchainTx: string;
  status: "verified" | "unverified" | "tampered" | "not_found";
  verificationData: {
    ipfsHash: string;
    merkleRoot: string;
    signature: string;
    timestamp: number;
    blockNumber: number;
    networkId: string;
  };
  metadata: {
    fileSize: number;
    contentType: string;
    originalFilename?: string;
    griefScore: number;
    verificationLevel: string;
  };
  integrity: {
    hashMatch: boolean;
    signatureValid: boolean;
    timestampValid: boolean;
    chainOfCustody: boolean;
  };
}

export default function VerifyPage() {
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState<"hash" | "id" | "tx">("hash");

  const {
    data: verificationResult,
    isLoading,
    error,
    refetch,
  } = useQuery<VerificationResult>({
    queryKey: ["/api/verify", searchInput, searchType],
    enabled: searchInput.length > 10,
    retry: false,
  });

  const handleSearch = () => {
    if (searchInput.trim().length < 10) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid hash, ID, or transaction hash.",
        variant: "destructive",
      });
      return;
    }
    refetch();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "unverified":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case "tampered":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "not_found":
        return <XCircle className="w-6 h-6 text-gray-500" />;
      default:
        return <Shield className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-50 border-green-200";
      case "unverified":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "tampered":
        return "text-red-600 bg-red-50 border-red-200";
      case "not_found":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "verified":
        return "This content has been verified and authenticated on the blockchain.";
      case "unverified":
        return "This content exists but verification is incomplete or pending.";
      case "tampered":
        return "Warning: This content may have been tampered with or corrupted.";
      case "not_found":
        return "No content found matching the provided identifier.";
      default:
        return "Unknown verification status.";
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const formatDate = (timestamp: number | string) => {
    const date = new Date(
      typeof timestamp === "number" ? timestamp * 1000 : timestamp,
    );
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Truth Verifier
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Verify the authenticity and integrity of truth capsules using
            blockchain technology.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Verify Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Type Selection */}
            <div className="flex space-x-4">
              <Button
                variant={searchType === "hash" ? "default" : "outline"}
                onClick={() => setSearchType("hash")}
                size="sm"
              >
                <Hash className="w-4 h-4 mr-1" />
                Content Hash
              </Button>
              <Button
                variant={searchType === "id" ? "default" : "outline"}
                onClick={() => setSearchType("id")}
                size="sm"
              >
                <FileText className="w-4 h-4 mr-1" />
                Capsule ID
              </Button>
              <Button
                variant={searchType === "tx" ? "default" : "outline"}
                onClick={() => setSearchType("tx")}
                size="sm"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Transaction Hash
              </Button>
            </div>

            {/* Search Input */}
            <div className="flex space-x-2">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={`Enter ${searchType === "hash" ? "content hash" : searchType === "id" ? "capsule ID" : "transaction hash"}...`}
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading || searchInput.length < 10}
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              {searchType === "hash" &&
                "Enter the SHA-256 hash of the content to verify its integrity."}
              {searchType === "id" &&
                "Enter the unique capsule identifier to verify its authenticity."}
              {searchType === "tx" &&
                "Enter the blockchain transaction hash that sealed the content."}
            </p>
          </CardContent>
        </Card>

        {/* Verification Results */}
        {verificationResult && (
          <div className="space-y-6">
            {/* Status Overview */}
            <Card
              className={`border-2 ${getStatusColor(verificationResult.status)}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(verificationResult.status)}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold capitalize">
                      {verificationResult.status}
                    </h2>
                    <p className="text-sm mt-1">
                      {getStatusMessage(verificationResult.status)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(verificationResult.status)}>
                    {verificationResult.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Content Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Content Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {verificationResult.title}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Author
                      </label>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{verificationResult.author}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Created
                      </label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(verificationResult.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Grief Score
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {verificationResult.metadata.griefScore}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Verification Level
                      </label>
                      <Badge variant="outline">
                        {verificationResult.metadata.verificationLevel}
                      </Badge>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        File Size
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {(verificationResult.metadata.fileSize / 1024).toFixed(
                          2,
                        )}{" "}
                        KB
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Blockchain Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Transaction Hash
                      </label>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {formatHash(verificationResult.blockchainTx)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(verificationResult.blockchainTx)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Block Number
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {verificationResult.verificationData.blockNumber.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Network
                      </label>
                      <Badge variant="outline">
                        {verificationResult.verificationData.networkId}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Content Hash
                      </label>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {formatHash(verificationResult.hash)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(verificationResult.hash)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        IPFS Hash
                      </label>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {formatHash(
                            verificationResult.verificationData.ipfsHash,
                          )}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              verificationResult.verificationData.ipfsHash,
                            )
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Timestamp
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(
                          verificationResult.verificationData.timestamp,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integrity Checks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Integrity Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>Hash Match</span>
                    {verificationResult.integrity.hashMatch ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>Signature Valid</span>
                    {verificationResult.integrity.signatureValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>Timestamp Valid</span>
                    {verificationResult.integrity.timestampValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>Chain of Custody</span>
                    {verificationResult.integrity.chainOfCustody ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex space-x-4 justify-center">
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Capsule
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <XCircle className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-800">
                    Verification Failed
                  </h3>
                  <p className="text-red-600">
                    Unable to verify the provided identifier. Please check the
                    input and try again.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How Verification Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                GuardianChain uses blockchain technology to ensure the
                authenticity and integrity of truth capsules:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Content Hashing:</strong> Each capsule is hashed using
                  SHA-256 to create a unique fingerprint.
                </li>
                <li>
                  <strong>Blockchain Sealing:</strong> The hash is recorded on
                  the blockchain with a timestamp.
                </li>
                <li>
                  <strong>IPFS Storage:</strong> Content is stored on IPFS for
                  decentralized access.
                </li>
                <li>
                  <strong>Cryptographic Signatures:</strong> Digital signatures
                  ensure author authenticity.
                </li>
                <li>
                  <strong>Merkle Proofs:</strong> Efficient verification without
                  revealing content.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
