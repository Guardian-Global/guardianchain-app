import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BadgeCheck, 
  FileCheck, 
  Lock, 
  Shield, 
  Clock,
  Gavel,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function VeritasSealPage() {
  const sealFeatures = [
    {
      icon: BadgeCheck,
      title: "AI-Signed Authorship",
      description: "Cryptographic verification of capsule creator identity",
      color: "green"
    },
    {
      icon: FileCheck,
      title: "Immutable Capsule Hash",
      description: "Blockchain-verified content integrity protection",
      color: "blue"
    },
    {
      icon: Lock,
      title: "Timestamped & Chain-Attested",
      description: "Irrefutable proof of creation time and authenticity",
      color: "purple"
    },
    {
      icon: Gavel,
      title: "Legal Admissibility",
      description: "Court-ready documentation with forensic standards",
      color: "yellow"
    },
    {
      icon: Eye,
      title: "Public Accountability",
      description: "Transparent verification accessible to all parties",
      color: "cyan"
    },
    {
      icon: Shield,
      title: "Identity Protection",
      description: "Anonymous verification with selective disclosure",
      color: "red"
    }
  ];

  const sealTypes = [
    {
      name: "Standard Seal",
      price: "Free",
      features: ["Basic timestamping", "Content hash verification", "Public attestation"],
      badge: "BASIC"
    },
    {
      name: "Legal Seal",
      price: "$49",
      features: ["Court-admissible format", "Notarized attestation", "Legal document package", "Expert witness support"],
      badge: "PROFESSIONAL"
    },
    {
      name: "Enterprise Seal",
      price: "$199",
      features: ["Multi-signature verification", "Compliance documentation", "Audit trail", "Institution backing", "Legal insurance"],
      badge: "PREMIUM"
    }
  ];

  const recentSeals = [
    { type: "Whistleblower Document", status: "Sealed", time: "2 min ago", hash: "0x742d...9A6C" },
    { type: "Legal Evidence", status: "Verified", time: "15 min ago", hash: "0x8c7C...F0a73" },
    { type: "Corporate Disclosure", status: "Pending", time: "1 hr ago", hash: "0x959C...239db" },
    { type: "Scientific Research", status: "Sealed", time: "3 hrs ago", hash: "0x1A2B...8E9F" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🛡️ VERITAS SEAL
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Official cryptographic notarization of digital truth capsules — provably timestamped and identity-sealed
          </p>
          <Badge className="bg-green-600/20 text-green-400 text-lg px-4 py-2">
            LEGALLY ADMISSIBLE VERIFICATION
          </Badge>
        </div>

        {/* Seal Features */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              Cryptographic Truth Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sealFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                      feature.color === 'green' ? 'bg-green-600/20' :
                      feature.color === 'blue' ? 'bg-blue-600/20' :
                      feature.color === 'purple' ? 'bg-purple-600/20' :
                      feature.color === 'yellow' ? 'bg-yellow-600/20' :
                      feature.color === 'cyan' ? 'bg-cyan-600/20' :
                      'bg-red-600/20'
                    }`}>
                      <Icon className={`h-8 w-8 ${
                        feature.color === 'green' ? 'text-green-400' :
                        feature.color === 'blue' ? 'text-blue-400' :
                        feature.color === 'purple' ? 'text-purple-400' :
                        feature.color === 'yellow' ? 'text-yellow-400' :
                        feature.color === 'cyan' ? 'text-cyan-400' :
                        'text-red-400'
                      }`} />
                    </div>
                    <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                    <p className="text-slate-300 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Seal Types & Pricing */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Choose Your Seal Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sealTypes.map((seal, index) => (
              <Card key={index} className={`bg-slate-800/50 border-slate-600 hover:border-purple-500/50 transition-all ${
                seal.name === 'Legal Seal' ? 'ring-2 ring-purple-500/50' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{seal.name}</CardTitle>
                    <Badge className={`
                      ${seal.badge === 'BASIC' ? 'bg-blue-600/20 text-blue-400' : ''}
                      ${seal.badge === 'PROFESSIONAL' ? 'bg-purple-600/20 text-purple-400' : ''}
                      ${seal.badge === 'PREMIUM' ? 'bg-yellow-600/20 text-yellow-400' : ''}
                    `}>
                      {seal.badge}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-green-400">{seal.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {seal.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      seal.name === 'Legal Seal' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    {seal.name === 'Standard Seal' ? 'Start Free Seal' : 'Upgrade to ' + seal.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Seals Activity */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Clock className="h-6 w-6 text-blue-400" />
              <span>Recent Veritas Seals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSeals.map((seal, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      seal.status === 'Sealed' ? 'bg-green-400' :
                      seal.status === 'Verified' ? 'bg-blue-400' :
                      'bg-yellow-400'
                    }`}></div>
                    <div>
                      <p className="text-white font-semibold">{seal.type}</p>
                      <p className="text-slate-400 text-sm">{seal.hash}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`
                      ${seal.status === 'Sealed' ? 'bg-green-600/20 text-green-400' : ''}
                      ${seal.status === 'Verified' ? 'bg-blue-600/20 text-blue-400' : ''}
                      ${seal.status === 'Pending' ? 'bg-yellow-600/20 text-yellow-400' : ''}
                    `}>
                      {seal.status}
                    </Badge>
                    <p className="text-slate-400 text-sm mt-1">{seal.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Seal Your Truth?
            </h2>
            <p className="text-slate-300 mb-6">
              Create legally admissible, immutable proof of your capsule's authenticity
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                onClick={() => window.location.href = '/create-capsule'}
              >
                <BadgeCheck className="h-5 w-5 mr-2" />
                Seal a Capsule
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-green-500 text-green-400 hover:bg-green-600/20"
                onClick={() => window.location.href = '/veritas-seal'}
              >
                <FileCheck className="h-5 w-5 mr-2" />
                View Verification Guide
              </Button>
            </div>

            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center justify-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <p className="text-yellow-400 text-sm">
                  Veritas Seals create permanent, immutable records. Ensure all information is accurate before sealing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}