import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileText, 
  Coins, 
  Users, 
  Globe,
  CheckCircle,
  ExternalLink,
  Mail,
  Rocket,
  Award,
  TrendingUp,
  Eye,
  Download
} from 'lucide-react';
import { generatePressKitPDF } from '@/utils/generatePressKit';
import { useToast } from '@/hooks/use-toast';

export default function LaunchAnnouncementPage() {
  const { toast } = useToast();

  const handlePressKitDownload = () => {
    try {
      generatePressKitPDF({
        companyName: 'GUARDIANCHAIN',
        tagline: 'Veritas Sealed. Truth Tokenized.',
        description: 'GUARDIANCHAIN has officially launched as the world\'s first sovereign memory infrastructure built for high-integrity capsule authorship, immutable emotional yield, and decentralized witness validation.',
        features: [
          'Truth Capsules - Seal personal or institutional memory',
          'Veritas Certificates - On-chain authorship & emotion proof',
          'GTT Token - Grief-weighted yield for testimony',
          'Jury Validation - Decentralized truth voting',
          'Capsule Explorer - Public or private memory graph'
        ],
        contact: {
          email: 'founder@guardianchain.app',
          website: 'https://guardianchain.app'
        }
      });
      
      toast({
        title: "Press Kit Downloaded",
        description: "Professional press materials ready for distribution",
      });
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const features = [
    {
      icon: FileText,
      title: 'Truth Capsules',
      description: 'Seal personal or institutional memory with cryptographic integrity'
    },
    {
      icon: Shield,
      title: 'Veritas Certificates',
      description: 'On-chain authorship & emotion proof for legal standing'
    },
    {
      icon: Coins,
      title: 'GTT Token',
      description: 'Grief-weighted yield rewards for authentic testimony'
    },
    {
      icon: Users,
      title: 'Jury Validation',
      description: 'Decentralized community truth voting and consensus'
    },
    {
      icon: Eye,
      title: 'Capsule Explorer',
      description: 'Public or private memory graph with advanced search'
    }
  ];

  const launchFeatures = [
    'Tiered yield claiming with automatic distribution',
    'Public replay with professional certifier dashboard',
    'PDF veritas proof bundles for legal documentation',
    'Institution onboarding with multi-role access control'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
              <Rocket className="w-4 h-4 mr-2" />
              Official Launch
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-white leading-tight">
                GUARDIANCHAIN
              </h1>
              <p className="text-2xl text-blue-200 font-medium">
                Veritas Sealed. Truth Tokenized.
              </p>
            </div>
            
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              GUARDIANCHAIN has officially launched as the world's first sovereign memory infrastructure 
              built for high-integrity capsule authorship, immutable emotional yield, and decentralized witness validation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                <Globe className="w-5 h-5 mr-2" />
                Explore Platform
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-400 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4"
                onClick={handlePressKitDownload}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Press Kit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">What We Offer</h2>
          <p className="text-xl text-slate-300">
            Revolutionary infrastructure for truth preservation and validation
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mainnet Launch Features */}
      <div className="bg-slate-800/30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-600 text-white px-4 py-2 text-lg mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Mainnet Ready
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Launch Features</h2>
            <p className="text-xl text-slate-300">
              Production-ready capabilities available from day one
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {launchFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-slate-300 text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Founder Quote */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Award className="w-10 h-10 text-blue-400" />
            </div>
            <blockquote className="text-2xl text-white font-medium mb-6 leading-relaxed">
              "GUARDIANCHAIN isn't just a platform — it's a sovereign engine for preserving what mattered most."
            </blockquote>
            <footer className="text-slate-300 text-lg">
              — <strong>Troy A. Cronin</strong>, Founder
            </footer>
          </CardContent>
        </Card>
      </div>

      {/* Contact & Links */}
      <div className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Get Started Today</h2>
          <p className="text-xl text-slate-300 mb-12">
            Join the truth preservation revolution and secure your legacy forever
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
              <Globe className="w-5 h-5 mr-2" />
              Visit guardianchain.app
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-400 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4"
            >
              <Mail className="w-5 h-5 mr-2" />
              founder@guardianchain.app
            </Button>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-700">
            <p className="text-slate-400">
              Experience the future of truth preservation and memory tokenization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}