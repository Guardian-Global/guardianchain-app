import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  BarChart3, 
  Coins, 
  Link2, 
  Brain, 
  Shield, 
  Briefcase, 
  Globe,
  Download,
  ExternalLink
} from "lucide-react";

export default function DemoKit() {
  const demoSections = [
    {
      title: "Hero Video & Mission Statement",
      icon: Play,
      description: "Watch our 2-minute explainer video showcasing the GuardianChain vision",
      link: "/",
      status: "Live"
    },
    {
      title: "Real-time Metrics Dashboard",
      icon: BarChart3,
      description: "Live analytics showing platform growth, user engagement, and truth verification rates",
      link: "/dashboard/analytics",
      status: "Live"
    },
    {
      title: "GTT Token Summary & Supply Chart",
      icon: Coins,
      description: "Complete tokenomics overview with real-time price data and yield mechanics",
      link: "/token",
      status: "Live"
    },
    {
      title: "Public Capsule Feed & Reels",
      icon: Link2,
      description: "Interactive demo of our TikTok-style truth preservation experience",
      link: "/explore",
      status: "Live"
    },
    {
      title: "AI Features Showcase",
      icon: Brain,
      description: "GPT-powered title suggestions, voice summaries, and content verification",
      link: "/ai-features",
      status: "Demo"
    },
    {
      title: "Use Cases & Applications",
      icon: Shield,
      description: "Whistleblower protection, eternal declarations, and sovereign social profiles",
      link: "/use-cases",
      status: "Live"
    }
  ];

  const documentLinks = [
    {
      title: "Grant Eligibility PDF",
      description: "Complete technical specifications and funding requirements",
      url: "/assets/pdf/GuardianChain_GrantKit.pdf",
      type: "PDF"
    },
    {
      title: "Pitch Deck",
      description: "Investor-ready presentation with market analysis and projections",
      url: "/assets/pdf/GuardianChain_PitchDeck.pdf",
      type: "PDF"
    },
    {
      title: "Technical Whitepaper",
      description: "Deep dive into our truth verification and blockchain architecture",
      url: "/whitepaper",
      type: "Web"
    },
    {
      title: "Roadmap & Milestones",
      description: "Quarterly development timeline and key deliverables",
      url: "/roadmap",
      type: "Web"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-slate-900 dark:to-purple-950">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            🧾 GuardianChain Grant & Investor Demo Kit
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive demonstration package showcasing our truth preservation platform, 
            AI capabilities, and investment opportunity for grants and ecosystem partners.
          </p>
        </div>

        {/* Demo Sections */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            🎬 Interactive Demo Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoSections.map((section) => (
              <Card key={section.title} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <section.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
                        <Badge 
                          variant={section.status === "Live" ? "default" : "secondary"}
                          className="mt-1"
                        >
                          {section.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {section.description}
                  </p>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    <a href={section.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Demo
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <Card className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl">📊 Platform Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">139</div>
                <div className="text-blue-100 text-sm">Truth Capsules Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold">58</div>
                <div className="text-blue-100 text-sm">NFTs Minted</div>
              </div>
              <div>
                <div className="text-3xl font-bold">87%</div>
                <div className="text-blue-100 text-sm">Truth Verification Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold">6</div>
                <div className="text-blue-100 text-sm">Languages Supported</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Downloads */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            📋 Documentation & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentLinks.map((doc) => (
              <Card key={doc.title} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{doc.title}</h3>
                        <Badge variant="outline">{doc.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {doc.description}
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          {doc.type === "PDF" ? "Download PDF" : "View Online"}
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Grant Eligibility Highlights */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Grant Eligibility Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">✅ Qualifications Met</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Open source core protocol components</li>
                  <li>• Public goods focus (truth preservation)</li>
                  <li>• Novel blockchain use case implementation</li>
                  <li>• AI integration for social benefit</li>
                  <li>• Multilingual accessibility features</li>
                  <li>• Community governance structure</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">🎯 Grant Categories</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Web3 Social Impact Grants</li>
                  <li>• AI for Good Initiatives</li>
                  <li>• Blockchain Infrastructure Grants</li>
                  <li>• Digital Human Rights Programs</li>
                  <li>• Decentralized Storage Solutions</li>
                  <li>• Community Building Funds</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="text-center">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Partner With Us?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              We're actively seeking strategic partnerships, grant opportunities, and investment 
              to scale our truth preservation infrastructure globally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="/contact">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Schedule Demo Call
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="mailto:grants@guardianchain.app">
                  <Globe className="w-5 h-5 mr-2" />
                  Contact Grants Team
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}