import { ShieldCheck, Award, Zap, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VerifyCapsule from '@/components/VerifyCapsule';
import ClaimNFT from '@/components/ClaimNFT';

export default function Certify() {
  const stats = [
    { label: 'Verified Capsules', value: '2,847', icon: ShieldCheck, color: 'text-green-400' },
    { label: 'NFTs Claimed', value: '1,923', icon: Award, color: 'text-purple-400' },
    { label: 'Active Verifiers', value: '456', icon: Users, color: 'text-blue-400' },
    { label: 'Success Rate', value: '94.7%', icon: TrendingUp, color: 'text-yellow-400' }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <span className="text-white text-xl font-bold">Capsule Integrity & Certification</span>
                <p className="text-slate-400 text-sm font-normal">
                  Verify capsule authenticity and claim your blockchain certificate
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Capsule Verification Section */}
          <div>
            <VerifyCapsule />
          </div>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-900 px-4 text-slate-400">Certificate Claiming</span>
            </div>
          </div>

          {/* NFT Claiming Section */}
          <div>
            <ClaimNFT />
          </div>
        </div>

        {/* Features Overview */}
        <Card className="mt-8 bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-400" />
                  Verification System
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Blockchain-based authenticity checks
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    DocuSign seal verification
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Grief score validation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Creator identity confirmation
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" />
                  NFT Certification
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    ERC-721 compliant certificates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    Rarity-based attributes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    Transferable proof of verification
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    Marketplace integration
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}