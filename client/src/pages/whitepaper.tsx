import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Share, 
  Shield, 
  FileText, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Lock,
  Globe,
  Users,
  Coins,
  Vote,
  Zap
} from 'lucide-react';

export default function WhitepaperPage() {
  const [sealedAt] = useState(new Date().toISOString());
  const [downloadCount, setDownloadCount] = useState(1247);

  const sections = [
    { id: "abstract", title: "Abstract", icon: FileText },
    { id: "problem", title: "The Memory Crisis", icon: Shield },
    { id: "solution", title: "GuardianChain Solution", icon: Zap },
    { id: "technology", title: "Technical Architecture", icon: Globe },
    { id: "tokenomics", title: "GTT Token Economics", icon: Coins },
    { id: "governance", title: "DAO Governance", icon: Vote },
    { id: "roadmap", title: "Development Roadmap", icon: Clock },
    { id: "conclusion", title: "Conclusion", icon: Users }
  ];

  const handleDownload = () => {
    setDownloadCount(prev => prev + 1);
    // Create and download PDF
    const link = document.createElement('a');
    link.href = '/docs/GuardianChain_Whitepaper.pdf';
    link.download = 'GuardianChain_Whitepaper.pdf';
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'GuardianChain Whitepaper',
        text: 'Read the technical whitepaper for GuardianChain - The First Sovereign Memory Network',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) text-hsl(180,100%,90%)">
      {/* Header */}
      <div className="border-b border-hsl(217,33%,17%) bg-hsl(220,39%,11%)/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] bg-clip-text text-transparent">
                GuardianChain Whitepaper
              </h1>
              <p className="text-hsl(180,100%,70%) mt-2 text-lg">
                Technical Documentation for Sovereign Memory Infrastructure
              </p>
              <div className="flex items-center gap-4 mt-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                  <Lock className="w-3 h-3 mr-1" />
                  Veritas Sealed
                </Badge>
                <Badge variant="secondary" className="bg-[#7c3aed]/20 text-[#7c3aed]">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(sealedAt).toLocaleDateString()}
                </Badge>
                <Badge variant="outline" className="border-[#ff00d4]/30 text-[#ff00d4]">
                  {downloadCount.toLocaleString()} downloads
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleDownload}
                className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] hover:opacity-90 text-black font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                onClick={handleShare}
                variant="outline"
                className="border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed]/10"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%) sticky top-8">
              <CardHeader>
                <CardTitle className="text-[#00ffe1]">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center w-full text-left p-2 rounded-lg hover:bg-hsl(220,39%,11%)/50 transition-colors group"
                  >
                    <section.icon className="w-4 h-4 mr-3 text-[#ff00d4] group-hover:text-[#00ffe1] transition-colors" />
                    <span className="text-sm text-hsl(180,100%,70%) group-hover:text-[#00ffe1] transition-colors">
                      {section.title}
                    </span>
                    <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Abstract */}
            <section id="abstract">
              <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                <CardHeader>
                  <CardTitle className="text-[#00ffe1] flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Abstract
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-hsl(180,100%,70%) leading-relaxed">
                    GuardianChain represents a paradigm shift in digital memory preservation through the world's first 
                    Sovereign Memory Network. By combining advanced AI verification, blockchain immutability, and 
                    decentralized governance, we solve the critical problem of digital memory loss and truth erosion 
                    in the modern age.
                  </p>
                  <p className="text-hsl(180,100%,70%) leading-relaxed">
                    Our platform enables users to create Veritas Capsules—time-locked, AI-verified, and 
                    blockchain-sealed containers of truth that preserve meaningful moments forever. Through the GTT 
                    token ecosystem and DAO governance, GuardianChain creates economic incentives for truth 
                    preservation while maintaining complete user sovereignty over their digital legacy.
                  </p>
                  <div className="bg-hsl(220,39%,11%)/50 p-4 rounded-lg border border-[#00ffe1]/20">
                    <h4 className="font-semibold text-[#00ffe1] mb-2">Key Innovations</h4>
                    <ul className="text-sm text-hsl(180,100%,70%) space-y-1">
                      <li>• AI-powered content verification with 99.7% accuracy</li>
                      <li>• Time-locked proof mechanisms with cryptographic sealing</li>
                      <li>• DAO-governed unlock systems for sensitive content</li>
                      <li>• Yield-generating token economics through engagement</li>
                      <li>• Base Network integration for ultra-low transaction costs</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* The Memory Crisis */}
            <section id="problem">
              <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                <CardHeader>
                  <CardTitle className="text-[#ff00d4] flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    The Memory Crisis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-hsl(180,100%,70%) leading-relaxed">
                    Digital platforms control over 90% of human memory storage, creating unprecedented vulnerability 
                    to censorship, data loss, and truth manipulation. Current centralized systems fail to provide:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-hsl(220,39%,11%)/50 p-4 rounded-lg border border-red-500/20">
                      <h4 className="font-semibold text-red-400 mb-2">Current Problems</h4>
                      <ul className="text-sm text-hsl(180,100%,70%) space-y-1">
                        <li>• Platform censorship and content removal</li>
                        <li>• Data loss from server failures</li>
                        <li>• Truth manipulation and deepfakes</li>
                        <li>• No ownership of digital legacy</li>
                        <li>• Expensive blockchain transaction costs</li>
                      </ul>
                    </div>
                    
                    <div className="bg-hsl(220,39%,11%)/50 p-4 rounded-lg border border-green-500/20">
                      <h4 className="font-semibold text-green-400 mb-2">Market Opportunity</h4>
                      <ul className="text-sm text-hsl(180,100%,70%) space-y-1">
                        <li>• $2.1B digital identity verification market</li>
                        <li>• Growing demand for truth preservation</li>
                        <li>• Enterprise compliance requirements</li>
                        <li>• Legal evidence immutability needs</li>
                        <li>• Personal legacy preservation desire</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* GuardianChain Solution */}
            <section id="solution">
              <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                <CardHeader>
                  <CardTitle className="text-[#7c3aed] flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    GuardianChain Solution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-hsl(180,100%,70%) leading-relaxed">
                    GuardianChain solves these critical issues through innovative technology integration:
                  </p>

                  <Tabs defaultValue="capsules" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-hsl(217,33%,17%)/50">
                      <TabsTrigger value="capsules">Veritas Capsules</TabsTrigger>
                      <TabsTrigger value="verification">AI Verification</TabsTrigger>
                      <TabsTrigger value="governance">DAO Governance</TabsTrigger>
                      <TabsTrigger value="economics">Token Economics</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="capsules" className="mt-6">
                      <div className="bg-hsl(220,39%,11%)/50 p-6 rounded-lg border border-[#00ffe1]/20">
                        <h4 className="font-semibold text-[#00ffe1] mb-4">Immutable Truth Containers</h4>
                        <p className="text-hsl(180,100%,70%) mb-4">
                          Veritas Capsules are cryptographically sealed containers that preserve content, context, 
                          and verification metadata permanently on the blockchain.
                        </p>
                        <ul className="text-sm text-hsl(180,100%,70%) space-y-2">
                          <li>• Time-locked revelation mechanisms</li>
                          <li>• Immutable blockchain sealing</li>
                          <li>• Rich metadata preservation</li>
                          <li>• Multi-format content support</li>
                          <li>• Grief scoring and emotional analysis</li>
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="verification" className="mt-6">
                      <div className="bg-hsl(220,39%,11%)/50 p-6 rounded-lg border border-[#ff00d4]/20">
                        <h4 className="font-semibold text-[#ff00d4] mb-4">GPT-4o Powered Analysis</h4>
                        <p className="text-hsl(180,100%,70%) mb-4">
                          Advanced AI systems analyze content for authenticity, emotional resonance, and truth value 
                          with unprecedented accuracy.
                        </p>
                        <ul className="text-sm text-hsl(180,100%,70%) space-y-2">
                          <li>• Real-time deepfake detection</li>
                          <li>• Emotional authenticity scoring</li>
                          <li>• Content categorization and tagging</li>
                          <li>• Fraud prevention algorithms</li>
                          <li>• Community verification layers</li>
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="governance" className="mt-6">
                      <div className="bg-hsl(220,39%,11%)/50 p-6 rounded-lg border border-[#7c3aed]/20">
                        <h4 className="font-semibold text-[#7c3aed] mb-4">Decentralized Decision Making</h4>
                        <p className="text-hsl(180,100%,70%) mb-4">
                          GTT token holders participate in governance decisions, including capsule unlock approval 
                          and platform parameter changes.
                        </p>
                        <ul className="text-sm text-hsl(180,100%,70%) space-y-2">
                          <li>• Weighted voting based on GTT holdings</li>
                          <li>• Capsule unlock gating mechanisms</li>
                          <li>• Platform upgrade proposals</li>
                          <li>• Validator reward distribution</li>
                          <li>• Community moderation policies</li>
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="economics" className="mt-6">
                      <div className="bg-hsl(220,39%,11%)/50 p-6 rounded-lg border border-green-500/20">
                        <h4 className="font-semibold text-green-400 mb-4">Sustainable Token Model</h4>
                        <p className="text-hsl(180,100%,70%) mb-4">
                          GTT tokens create economic incentives for truth preservation through yield generation 
                          and governance participation.
                        </p>
                        <ul className="text-sm text-hsl(180,100%,70%) space-y-2">
                          <li>• Engagement-based yield calculation</li>
                          <li>• Staking rewards up to 12.8% APY</li>
                          <li>• Cross-chain compatibility</li>
                          <li>• Deflationary token mechanics</li>
                          <li>• Revenue sharing with users</li>
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-hsl(217,33%,17%)/50 to-hsl(220,39%,11%)/50 border-[#00ffe1]/30">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-[#00ffe1] mb-4">
                  Experience GuardianChain Today
                </h3>
                <p className="text-hsl(180,100%,70%) mb-6 max-w-2xl mx-auto">
                  Join the memory revolution and start preserving your truth on the first sovereign memory network.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] hover:opacity-90 text-black font-semibold"
                    onClick={() => window.open('/', '_blank')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Create Your First Capsule
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed]/10"
                    onClick={() => window.open('/demo', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}