import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Shield, 
  Coins, 
  Network, 
  Zap, 
  Globe, 
  Lock,
  TrendingUp,
  Users,
  Sparkles,
  Brain,
  Eye,
  Calendar
} from "lucide-react";

interface Whitepaper {
  id: string;
  title: string;
  subtitle: string;
  version: string;
  lastUpdated: string;
  pages: number;
  category: 'Technical' | 'Economic' | 'Governance' | 'Security';
  description: string;
  keyTopics: string[];
  icon: any;
  downloadUrl: string;
  color: string;
}

const WHITEPAPERS: Whitepaper[] = [
  {
    id: "guardianchain-protocol",
    title: "GUARDIANCHAIN Protocol",
    subtitle: "Decentralized Truth Verification Infrastructure",
    version: "v2.1",
    lastUpdated: "July 2025",
    pages: 47,
    category: "Technical",
    description: "Comprehensive technical documentation of the GUARDIANCHAIN truth verification protocol, consensus mechanisms, and blockchain architecture.",
    keyTopics: [
      "Truth Capsule Architecture",
      "Consensus Verification Algorithms", 
      "IPFS Integration & Storage",
      "Cross-Chain Interoperability",
      "Veritus Node Network",
      "Smart Contract Security"
    ],
    icon: Shield,
    downloadUrl: "/whitepapers/guardianchain-protocol-v2.1.pdf",
    color: "from-blue-600 to-purple-600"
  },
  {
    id: "gtt-tokenomics",
    title: "GTT Token Economics",
    subtitle: "Guardian Truth Token Mathematical Model",
    version: "v1.8",
    lastUpdated: "July 2025", 
    pages: 32,
    category: "Economic",
    description: "Detailed analysis of GTT token distribution, yield generation mechanics, staking rewards, and sustainable tokenomics design.",
    keyTopics: [
      "Token Distribution Model",
      "Yield Generation Mathematics",
      "Staking Reward Calculations",
      "Deflationary Burn Mechanisms",
      "Treasury Management",
      "Market Cap Projections"
    ],
    icon: Coins,
    downloadUrl: "/whitepapers/gtt-tokenomics-v1.8.pdf",
    color: "from-green-600 to-emerald-600"
  },
  {
    id: "dao-governance",
    title: "DAO Governance Framework",
    subtitle: "Decentralized Autonomous Organization Structure",
    version: "v1.5",
    lastUpdated: "July 2025",
    pages: 28,
    category: "Governance",
    description: "Governance mechanisms, voting protocols, proposal systems, and community-driven decision making processes.",
    keyTopics: [
      "Voting Weight Calculations",
      "Proposal Lifecycle Management",
      "Treasury Governance",
      "Community Moderation",
      "Reputation Scoring",
      "Dispute Resolution"
    ],
    icon: Users,
    downloadUrl: "/whitepapers/dao-governance-v1.5.pdf",
    color: "from-purple-600 to-pink-600"
  },
  {
    id: "security-audit",
    title: "Security & Audit Report",
    subtitle: "Comprehensive Security Analysis",
    version: "v3.2",
    lastUpdated: "July 2025",
    pages: 56,
    category: "Security",
    description: "Independent security audits, penetration testing results, smart contract security analysis, and threat mitigation strategies.",
    keyTopics: [
      "Smart Contract Audits",
      "Penetration Testing Results",
      "Cryptographic Security",
      "Multi-Signature Implementation",
      "Access Control Systems",
      "Emergency Response Protocols"
    ],
    icon: Lock,
    downloadUrl: "/whitepapers/security-audit-v3.2.pdf",
    color: "from-red-600 to-orange-600"
  },
  {
    id: "truth-verification",
    title: "Truth Verification Methodology",
    subtitle: "Advanced Content Verification Systems",
    version: "v2.0",
    lastUpdated: "July 2025",
    pages: 41,
    category: "Technical",
    description: "Deep dive into truth verification algorithms, community consensus mechanisms, and content authenticity validation.",
    keyTopics: [
      "Content Authenticity Algorithms",
      "Community Verification Process",
      "Evidence Chain Validation",
      "Source Attribution Systems",
      "Reputation Impact Analysis",
      "Appeal & Review Mechanisms"
    ],
    icon: Eye,
    downloadUrl: "/whitepapers/truth-verification-v2.0.pdf",
    color: "from-cyan-600 to-blue-600"
  },
  {
    id: "ai-integration",
    title: "AI Integration Framework",
    subtitle: "Sovereign AI Assistant Architecture",
    version: "v1.3",
    lastUpdated: "July 2025",
    pages: 35,
    category: "Technical",
    description: "Implementation of AI-powered content analysis, recommendation systems, and sovereign AI assistant functionality.",
    keyTopics: [
      "AI Content Analysis Pipeline",
      "Machine Learning Models",
      "Privacy-Preserving AI",
      "Recommendation Algorithms",
      "Natural Language Processing",
      "AI Ethics & Governance"
    ],
    icon: Brain,
    downloadUrl: "/whitepapers/ai-integration-v1.3.pdf",
    color: "from-indigo-600 to-purple-600"
  },
  {
    id: "cross-chain",
    title: "Cross-Chain Infrastructure",
    subtitle: "Multi-Blockchain Integration Strategy",
    version: "v1.7",
    lastUpdated: "July 2025",
    pages: 39,
    category: "Technical",
    description: "Technical specifications for cross-chain compatibility, bridge protocols, and multi-network token deployment.",
    keyTopics: [
      "Bridge Protocol Design",
      "Multi-Chain Deployment",
      "Liquidity Pool Management",
      "Cross-Chain Messaging",
      "Network Interoperability",
      "Gas Optimization"
    ],
    icon: Network,
    downloadUrl: "/whitepapers/cross-chain-v1.7.pdf",
    color: "from-teal-600 to-green-600"
  },
  {
    id: "defi-protocols",
    title: "DeFi Integration Protocols",
    subtitle: "Decentralized Finance Ecosystem",
    version: "v1.4",
    lastUpdated: "July 2025",
    pages: 33,
    category: "Economic",
    description: "DeFi protocol integrations, yield farming strategies, liquidity provision mechanisms, and financial ecosystem design.",
    keyTopics: [
      "Automated Market Making",
      "Yield Farming Strategies",
      "Liquidity Mining Programs",
      "Lending & Borrowing",
      "Synthetic Assets",
      "Risk Management"
    ],
    icon: TrendingUp,
    downloadUrl: "/whitepapers/defi-protocols-v1.4.pdf",
    color: "from-yellow-600 to-orange-600"
  },
  {
    id: "enterprise-adoption",
    title: "Enterprise Adoption Strategy",
    subtitle: "B2B Integration & Compliance Framework",
    version: "v1.2",
    lastUpdated: "July 2025",
    pages: 44,
    category: "Governance",
    description: "Enterprise integration strategies, compliance frameworks, regulatory alignment, and institutional adoption pathways.",
    keyTopics: [
      "Enterprise API Integration",
      "Compliance Frameworks",
      "KYC/AML Procedures",
      "Institutional Custody",
      "Regulatory Alignment",
      "SLA Guarantees"
    ],
    icon: Globe,
    downloadUrl: "/whitepapers/enterprise-adoption-v1.2.pdf",
    color: "from-gray-600 to-slate-600"
  },
  {
    id: "roadmap-milestones",
    title: "Roadmap & Development Milestones",
    subtitle: "Strategic Development Timeline",
    version: "v2.3",
    lastUpdated: "July 2025",
    pages: 29,
    category: "Governance",
    description: "Comprehensive development roadmap, milestone tracking, feature releases, and long-term strategic vision.",
    keyTopics: [
      "Development Timeline",
      "Feature Release Schedule",
      "Technology Milestones",
      "Partnership Roadmap",
      "Community Growth",
      "Market Expansion"
    ],
    icon: Calendar,
    downloadUrl: "/whitepapers/roadmap-milestones-v2.3.pdf",
    color: "from-violet-600 to-purple-600"
  }
];

export default function WhitepapersPage() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical': return 'bg-blue-500';
      case 'Economic': return 'bg-green-500';
      case 'Governance': return 'bg-purple-500';
      case 'Security': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const downloadWhitepaper = (whitepaper: Whitepaper) => {
    // In production, this would trigger actual file download
    window.open(whitepaper.downloadUrl, '_blank');
  };

  const categories = ['All', 'Technical', 'Economic', 'Governance', 'Security'];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            GUARDIANCHAIN Whitepapers
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto">
            Comprehensive technical documentation, economic models, and governance frameworks 
            for the world's leading decentralized truth verification protocol.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-400">{WHITEPAPERS.length}</div>
              <p className="text-sm text-slate-400">Total Documents</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-400">
                {WHITEPAPERS.reduce((sum, wp) => sum + wp.pages, 0)}
              </div>
              <p className="text-sm text-slate-400">Total Pages</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {new Set(WHITEPAPERS.map(wp => wp.category)).size}
              </div>
              <p className="text-sm text-slate-400">Categories</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-400">100%</div>
              <p className="text-sm text-slate-400">Up to Date</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="All" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {WHITEPAPERS
                  .filter(wp => category === 'All' || wp.category === category)
                  .map((whitepaper) => {
                    const IconComponent = whitepaper.icon;
                    return (
                      <Card key={whitepaper.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300">
                        <CardHeader>
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${whitepaper.color} flex items-center justify-center mx-auto mb-4`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className="text-center text-lg">{whitepaper.title}</CardTitle>
                          <p className="text-center text-sm text-slate-400">{whitepaper.subtitle}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Badge className={getCategoryColor(whitepaper.category)}>
                              {whitepaper.category}
                            </Badge>
                            <div className="text-right text-sm text-slate-400">
                              <div>v{whitepaper.version}</div>
                              <div>{whitepaper.pages} pages</div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-300">{whitepaper.description}</p>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Key Topics:</h4>
                            <div className="flex flex-wrap gap-1">
                              {whitepaper.keyTopics.slice(0, 3).map((topic, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                              {whitepaper.keyTopics.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{whitepaper.keyTopics.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-slate-700">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs text-slate-400">
                                Updated: {whitepaper.lastUpdated}
                              </span>
                              <FileText className="w-4 h-4 text-slate-400" />
                            </div>
                            
                            <Button 
                              onClick={() => downloadWhitepaper(whitepaper)}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Additional Information */}
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              Document Library Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Open Source Documentation</h4>
                <p className="text-sm text-slate-300">
                  All GUARDIANCHAIN whitepapers are publicly available and regularly updated 
                  to reflect the latest protocol developments and community feedback.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Version Control</h4>
                <p className="text-sm text-slate-300">
                  Each document maintains version history with clear changelog tracking. 
                  Subscribe to updates to receive notifications when new versions are released.
                </p>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                Last Updated: July 2025 - All Documents Current
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}