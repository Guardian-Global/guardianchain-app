import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Component moved to archive during cleanup
import { TestTube2, Shield, Zap, Rocket } from "lucide-react";

export default function MintingTestPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TestTube2 className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              GUARDIANCHAIN Minting Test Center
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Comprehensive testing suite for capsule minting and blockchain
              integration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-purple-200 dark:border-purple-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="font-semibold">Smart Contract Tests</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verify deployment status and contract interaction functionality
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">API Integration Tests</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test backend endpoints, database connectivity, and API responses
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="h-5 w-5 text-green-600" />
                <span className="font-semibold">End-to-End Tests</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete workflow testing from capsule creation to blockchain
                minting
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-orange-200 dark:border-orange-700 mb-8">
          <CardHeader>
            <CardTitle className="text-orange-800 dark:text-orange-200">
              Testing Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Required Setup:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Wallet connected (MetaMask or compatible)</li>
                  <li>• Sufficient ETH balance for gas fees</li>
                  <li>• Test network access (Hardhat or Mumbai)</li>
                  <li>• Smart contracts deployed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Test Coverage:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Contract deployment verification</li>
                  <li>• Capsule creation and metadata</li>
                  <li>• NFT minting and IPFS upload</li>
                  <li>• Transaction confirmation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-200">
            Test Suite Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Badge variant="secondary" className="mb-4">
              Components Archived
            </Badge>
            <p className="text-gray-600 dark:text-gray-400">
              Test components have been moved to archive for production cleanup.
              Test suite functionality preserved in
              archive_cleanup/unlinked_components/.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
