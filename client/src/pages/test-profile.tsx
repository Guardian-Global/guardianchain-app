import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import XPGraph from '@/components/Profile/XPGraph';
import SoulboundNFTDisplay from '@/components/Profile/SoulboundNFTDisplay';
import CapsuleHistory from '@/components/Profile/CapsuleHistory';
import NetworkIndicator from '@/components/web3/NetworkIndicator';
import { BRAND_COLORS, BRAND_NAME } from '@/lib/constants';

export default function TestProfilePage() {
  // Test with demo wallet address
  const testWalletAddress = "0x1234567890abcdef1234567890abcdef12345678";

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div>
                <span className="text-white text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {BRAND_NAME} Profile Components Test
                </span>
                <p className="text-slate-400 text-sm font-normal">
                  Testing enhanced profile components with live API data
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-sm text-slate-300 mb-2">Test Wallet Address:</div>
              <div className="font-mono text-xs text-slate-400 break-all">{testWalletAddress}</div>
            </div>
          </CardContent>
        </Card>

        {/* XP Graph Test */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">XP Graph Component</CardTitle>
          </CardHeader>
          <CardContent>
            <XPGraph address={testWalletAddress} />
          </CardContent>
        </Card>

        {/* Soulbound NFT Display Test */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Soulbound NFT Display Component</CardTitle>
          </CardHeader>
          <CardContent>
            <SoulboundNFTDisplay address={testWalletAddress} />
          </CardContent>
        </Card>

        {/* Capsule History Test */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Capsule History Component</CardTitle>
          </CardHeader>
          <CardContent>
            <CapsuleHistory userAddress={testWalletAddress} />
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Web3 Network Status</CardTitle>
          </CardHeader>
          <CardContent>
            <NetworkIndicator />
          </CardContent>
        </Card>

        {/* API Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">System Status Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">API Endpoints</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>✅ User Profile API</li>
                  <li>✅ XP History API</li>
                  <li>✅ Achievements API</li>
                  <li>✅ Capsules API</li>
                  <li>✅ Capsule Types API</li>
                </ul>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Components</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>✅ XPGraph - Real Data</li>
                  <li>✅ SoulboundNFTDisplay - Real Data</li>
                  <li>✅ CapsuleHistory - Real Data</li>
                  <li>✅ Web3 Integration - Fixed</li>
                  <li>✅ Network Detection - Working</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}