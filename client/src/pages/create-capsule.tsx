import { ArrowLeft, Zap } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";
import CapsuleCreator from "@/components/web3/CapsuleCreator";
import CapsuleTypeSelector from "@/components/capsule/CapsuleTypeSelector";

export default function CreateCapsule() {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </Link>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            {BRAND_NAME} Capsule Studio V2
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl">
            Create immutable truth capsules with enhanced yield tracking and
            Veritus verification. Powered by CapsuleFactoryV2 smart contract for
            secure, permanent storage.
          </p>
        </div>

        {/* Enhanced Capsule Creation System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* CapsuleFactoryV2 Creator */}
          <div className="space-y-6">
            <CapsuleCreator />
          </div>

          {/* Advanced Features Info */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap
                    className="w-5 h-5"
                    style={{ color: BRAND_COLORS.CHAIN }}
                  />
                  CapsuleFactoryV2 Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">
                    Enhanced Features:
                  </h3>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Emotional yield calculation and tracking</li>
                    <li>• Veritus node verification system</li>
                    <li>• Immutable story titles and summaries</li>
                    <li>• Advanced capsule status progression</li>
                    <li>• IPFS content hash integration</li>
                    <li>• Smart contract yield assignment</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">
                    Creation Workflow:
                  </h3>
                  <ol className="text-sm text-slate-300 space-y-1 list-decimal ml-4">
                    <li>Upload content to IPFS</li>
                    <li>Create capsule with content hash</li>
                    <li>Veritus node reviews and seals</li>
                    <li>Final emotional yield assigned</li>
                    <li>Capsule becomes claimable for GTT rewards</li>
                  </ol>
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-sm text-purple-200">
                    <strong>Smart Contract:</strong> All capsules are stored
                    on-chain with immutable metadata and yield tracking for
                    transparent reward distribution.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Legacy Type Selector for Reference */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Legacy Capsule Types
                </CardTitle>
                <p className="text-sm text-slate-400">
                  Reference guide for specialized capsule categories
                </p>
              </CardHeader>
              <CardContent>
                <CapsuleTypeSelector
                  selectedType="enhanced"
                  onTypeChange={() => {}}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
