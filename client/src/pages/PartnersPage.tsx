import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Mail, 
  Globe, 
  Users, 
  Award,
  Handshake,
  Download,
  ExternalLink
} from "lucide-react";

export default function PartnersPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Handshake className="h-10 w-10 text-yellow-400" />
          <h1 className="text-4xl font-bold text-white">Partners & Grants</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          GuardianChain is committed to transparency, sovereign innovation, and long-term sustainability. 
          Below you'll find our official partner explainer deck, revenue model, and contact for collaboration.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Revenue Explainer Deck */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <FileText className="h-6 w-6 text-purple-400" />
              Revenue & Compliance Explainer Deck
            </CardTitle>
            <CardDescription>
              Comprehensive 6-page PDF describing GTT tokenomics, DAO structure, and compliant yield logic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">What's Included:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• GTT Token Economics & Distribution</li>
                <li>• DAO Governance Structure</li>
                <li>• Revenue Share Framework</li>
                <li>• Compliance & Regulatory Approach</li>
                <li>• Partnership Opportunities</li>
                <li>• Technical Architecture Overview</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button 
                asChild 
                className="flex-1"
              >
                <a
                  href="/GuardianChain_Revenue_Explainer_Deck.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                asChild
              >
                <a
                  href="/GuardianChain_Revenue_Share_Summary.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Summary
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Mail className="h-6 w-6 text-blue-400" />
              Contact & Collaboration
            </CardTitle>
            <CardDescription>
              Get in touch for partnerships, grants, or investment opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                <Mail className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <a 
                    href="mailto:compliance@guardianchain.app"
                    className="text-blue-400 hover:underline"
                  >
                    compliance@guardianchain.app
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                <Globe className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Website</p>
                  <a 
                    href="https://guardianchain.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline"
                  >
                    guardianchain.app
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Partnership Areas:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                <div>• Strategic Investment</div>
                <div>• Technology Integration</div>
                <div>• Grant Funding</div>
                <div>• Validator Networks</div>
                <div>• Enterprise Adoption</div>
                <div>• Academic Research</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partnership Benefits */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-gray-800 border-gray-700 text-center">
          <CardContent className="p-6">
            <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Strategic Partnerships
            </h3>
            <p className="text-gray-300 text-sm">
              Join our ecosystem of validators, enterprises, and technology partners building the future of truth infrastructure.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-center">
          <CardContent className="p-6">
            <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Grant Funding
            </h3>
            <p className="text-gray-300 text-sm">
              We welcome grant opportunities from foundations, governments, and organizations supporting decentralized infrastructure.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-center">
          <CardContent className="p-6">
            <Handshake className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Investment Opportunities
            </h3>
            <p className="text-gray-300 text-sm">
              Connect with our compliant revenue model and participate in building sovereign Web3 infrastructure.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Statement */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Compliance & Transparency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">
              GuardianChain operates with full transparency and regulatory compliance at the forefront of our operations. 
              Our tokenomics and revenue model are designed to align with evolving regulatory frameworks while maintaining 
              the decentralized and sovereign nature of our platform.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Regulatory Approach</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• SEC compliance framework</li>
                  <li>• Transparent tokenomics</li>
                  <li>• Community governance</li>
                  <li>• Regular audits</li>
                </ul>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Partnership Benefits</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Early ecosystem access</li>
                  <li>• Revenue sharing opportunities</li>
                  <li>• Technical collaboration</li>
                  <li>• Brand partnership visibility</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-8 rounded-xl border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Partner with GuardianChain?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join us in building the future of decentralized truth infrastructure. Whether you're an investor, 
            technology partner, or grant organization, we'd love to explore collaboration opportunities.
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <a href="mailto:compliance@guardianchain.app" className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Get In Touch
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}