import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  Shield,
  Zap,
  Trophy,
  Target,
  Rocket,
  Star,
  Building,
  Network,
} from "lucide-react";

const ProtocolStrategy: React.FC = () => {
  const valueDrivers = [
    {
      category: "Enterprise Adoption",
      icon: <Building className="w-6 h-6" />,
      color: "bg-blue-600",
      initiatives: [
        "Supply Chain Truth Verification for Fortune 500",
        "Legal Document Authentication Platform",
        "Healthcare Record Integrity System",
        "Financial Audit Trail Infrastructure",
      ],
      targetValue: "$50B+ Market",
    },
    {
      category: "Real-World Asset Integration",
      icon: <Globe className="w-6 h-6" />,
      color: "bg-green-600",
      initiatives: [
        "Property Deed NFT Tokenization",
        "Luxury Goods Authentication",
        "IP Patent Protection System",
        "Carbon Credit Verification",
      ],
      targetValue: "$231B+ RWA Market",
    },
    {
      category: "Advanced Tokenomics",
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-purple-600",
      initiatives: [
        "Revenue-Backed GTT Token Model",
        "Protocol-Owned Liquidity Strategy",
        "Cross-Chain Yield Generation",
        "Deflationary Burn Mechanisms",
      ],
      targetValue: "$10B+ Protocol Value",
    },
    {
      category: "AI-Powered Innovation",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-yellow-600",
      initiatives: [
        "AI Truth Verification Engine",
        "Automated Content Moderation",
        "Predictive Fraud Detection",
        "Dynamic NFT Evolution",
      ],
      targetValue: "$177B+ AI Market",
    },
  ];

  const marketPositioning = [
    {
      title: "Truth Infrastructure Protocol",
      description:
        "Become the foundational layer for truth verification across all industries",
      metrics: "10,000+ Enterprise Clients",
    },
    {
      title: "Cross-Chain Interoperability",
      description:
        "First protocol to seamlessly verify truth across Ethereum, Bitcoin, Solana",
      metrics: "50+ Blockchain Networks",
    },
    {
      title: "Regulatory Compliance Leader",
      description:
        "Pioneer in regulatory-compliant truth verification and audit trails",
      metrics: "100+ Country Compliance",
    },
    {
      title: "Creator Economy Platform",
      description:
        "Primary platform for content creators to monetize verified truth",
      metrics: "$1B+ Creator Earnings",
    },
  ];

  const competitiveAdvantages = [
    "First-mover advantage in truth verification",
    "Immutable blockchain-based evidence",
    "AI-powered authenticity scoring",
    "Enterprise-grade security and compliance",
    "Cross-platform interoperability",
    "Community-driven governance",
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-purple-900 via-blue-900 to-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-yellow-600 text-black font-bold px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              2025 Billion-Dollar Protocol Strategy
            </Badge>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              GUARDIANCHAIN
            </h1>
            <h2 className="text-3xl font-bold mb-4">
              The World's Highest Valued Truth Protocol
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto">
              Strategic roadmap to capture $100B+ market value through
              enterprise adoption, real-world asset integration, and
              revolutionary truth verification technology.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Market Opportunity */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Total Addressable Market
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  $177B
                </div>
                <div className="text-sm text-slate-400">
                  Web3 Market by 2033
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  $231B
                </div>
                <div className="text-sm text-slate-400">NFT Market by 2030</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  $104B
                </div>
                <div className="text-sm text-slate-400">
                  Web3 Gaming by 2030
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  $68B
                </div>
                <div className="text-sm text-slate-400">
                  Event Ticketing by 2025
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Value Drivers */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Strategic Value Drivers
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {valueDrivers.map((driver, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <div className={`p-2 rounded-lg ${driver.color} mr-3`}>
                      {driver.icon}
                    </div>
                    <div>
                      <div>{driver.category}</div>
                      <div className="text-sm font-normal text-slate-400">
                        {driver.targetValue}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {driver.initiatives.map((initiative, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-slate-300"
                      >
                        <Target className="w-4 h-4 mr-2 text-green-400" />
                        {initiative}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Market Positioning */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Market Positioning Strategy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketPositioning.map((position, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{position.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">{position.description}</p>
                  <Badge className="bg-green-600">{position.metrics}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Competitive Advantages */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Competitive Moats
          </h2>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {competitiveAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-slate-300">{advantage}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Revenue Projections */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Revenue Projections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-center text-white">
                  <div className="text-3xl font-bold text-green-400">
                    Q2 2025
                  </div>
                  <div className="text-sm text-slate-400">Early Adoption</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-300">
                  <li>• $10M Protocol Revenue</li>
                  <li>• 1,000 Enterprise Clients</li>
                  <li>• $1B GTT Market Cap</li>
                  <li>• 50M Truth Capsules</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 ring-2 ring-purple-500">
              <CardHeader>
                <CardTitle className="text-center text-white">
                  <div className="text-3xl font-bold text-purple-400">
                    Q4 2025
                  </div>
                  <div className="text-sm text-slate-400">Mass Adoption</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-300">
                  <li>• $100M Protocol Revenue</li>
                  <li>• 10,000 Enterprise Clients</li>
                  <li>• $10B GTT Market Cap</li>
                  <li>• 500M Truth Capsules</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-center text-white">
                  <div className="text-3xl font-bold text-yellow-400">2026</div>
                  <div className="text-sm text-slate-400">
                    Protocol Dominance
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-300">
                  <li>• $1B+ Protocol Revenue</li>
                  <li>• 100,000 Enterprise Clients</li>
                  <li>• $100B+ GTT Market Cap</li>
                  <li>• 5B+ Truth Capsules</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Implementation Roadmap */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Execution Roadmap
          </h2>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 rounded-full p-2">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      Phase 1: Foundation (Q1 2025)
                    </h3>
                    <p className="text-slate-300">
                      Launch enterprise SDK, onboard first 100 clients,
                      establish regulatory partnerships
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 rounded-full p-2">
                    <Network className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      Phase 2: Scale (Q2-Q3 2025)
                    </h3>
                    <p className="text-slate-300">
                      Cross-chain integration, AI verification engine, 1,000+
                      enterprise partnerships
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600 rounded-full p-2">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      Phase 3: Dominance (Q4 2025)
                    </h3>
                    <p className="text-slate-300">
                      Global deployment, billion-dollar protocol revenue, IPO
                      preparation
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500">
            <CardContent className="pt-6 pb-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Build the Future of Truth?
              </h2>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Join the movement to create the world's most valuable truth
                verification protocol. The future of digital authenticity starts
                now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold">
                  Launch Enterprise SDK
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-900"
                >
                  Partner with GUARDIANCHAIN
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ProtocolStrategy;
