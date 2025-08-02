import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Search, 
  Filter, 
  Eye, 
  Heart,
  Globe,
  FileText,
  Image,
  Video,
  Mic,
  Briefcase,
  AlertTriangle,
  Star,
  TrendingUp,
  Clock
} from "lucide-react";
import { Link } from "wouter";

interface TruthCapsule {
  id: string;
  title: string;
  description: string;
  type: string;
  author: string;
  verified: boolean;
  verificationLevel: string;
  truthScore: number;
  views: number;
  createdAt: string;
  tags: string[];
}

const mockCapsules: TruthCapsule[] = [
  {
    id: '1',
    title: 'Climate Change Evidence 2024',
    description: 'Comprehensive documentation of global temperature changes with satellite data verification.',
    type: 'news-report',
    author: 'dr.climate',
    verified: true,
    verificationLevel: 'sealed',
    truthScore: 98,
    views: 15420,
    createdAt: '2025-08-01',
    tags: ['climate', 'science', 'data', 'verified']
  },
  {
    id: '2',
    title: 'Personal Memory: Wedding Day',
    description: 'Preserving the most important day of my life with immutable blockchain storage.',
    type: 'personal-memory',
    author: 'happycouple2025',
    verified: true,
    verificationLevel: 'verified',
    truthScore: 95,
    views: 892,
    createdAt: '2025-07-30',
    tags: ['personal', 'memory', 'love', 'family']
  },
  {
    id: '3',
    title: 'Corporate Whistleblower Report',
    description: 'Protected disclosure regarding financial irregularities at major corporation.',
    type: 'whistleblower',
    author: 'anonymous_guardian',
    verified: true,
    verificationLevel: 'sealed',
    truthScore: 99,
    views: 8765,
    createdAt: '2025-07-28',
    tags: ['corporate', 'whistleblower', 'finance', 'protected']
  },
  {
    id: '4',
    title: 'Election Fraud Investigation',
    description: 'Detailed analysis of voting irregularities with photographic evidence.',
    type: 'media-evidence',
    author: 'truthseeker2025',
    verified: false,
    verificationLevel: 'standard',
    truthScore: 87,
    views: 23456,
    createdAt: '2025-07-25',
    tags: ['election', 'investigation', 'evidence', 'democracy']
  }
];

const capsuleTypeIcons = {
  'personal-memory': Heart,
  'news-report': Globe,
  'document-archive': FileText,
  'media-evidence': Image,
  'video-testimony': Video,
  'audio-recording': Mic,
  'business-record': Briefcase,
  'whistleblower': AlertTriangle,
};

export default function Vault() {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: capsules = mockCapsules } = useQuery<TruthCapsule[]>({
    queryKey: ['/api/capsules/public'],
    enabled: true
  });

  const filteredCapsules = (capsules as TruthCapsule[])
    .filter((capsule: TruthCapsule) => {
      const matchesSearch = capsule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           capsule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           capsule.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === "all" || capsule.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a: TruthCapsule, b: TruthCapsule) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'truth-score':
          return b.truthScore - a.truthScore;
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const getVerificationBadge = (level: string, verified: boolean) => {
    if (!verified) {
      return <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">Pending</Badge>;
    }
    
    switch (level) {
      case 'sealed':
        return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">Veritas Sealed</Badge>;
      case 'verified':
        return <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Verified</Badge>;
      default:
        return <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">Standard</Badge>;
    }
  };

  const getTruthScoreColor = (score: number) => {
    if (score >= 95) return "text-green-400";
    if (score >= 85) return "text-yellow-400";
    if (score >= 75) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-800/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/logo/GUARDIANCHAIN_logo.png" 
                alt="GuardianChain" 
                className="h-8 w-auto"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Truth Vault
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Button asChild>
                  <Link href="/create-truth-capsule">Create Capsule</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/api/login">Login to Create</Link>
                </Button>
              )}
              <Button variant="ghost" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Explore Verified Truth
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Browse thousands of verified truth capsules from guardians around the world. Search, filter, and discover immutable truth.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-slate-800/50 border-slate-700/50 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search truth capsules, authors, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="personal-memory">Personal Memory</SelectItem>
                  <SelectItem value="news-report">News Report</SelectItem>
                  <SelectItem value="document-archive">Document Archive</SelectItem>
                  <SelectItem value="media-evidence">Media Evidence</SelectItem>
                  <SelectItem value="video-testimony">Video Testimony</SelectItem>
                  <SelectItem value="audio-recording">Audio Recording</SelectItem>
                  <SelectItem value="business-record">Business Record</SelectItem>
                  <SelectItem value="whistleblower">Whistleblower</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="truth-score">Truth Score</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Stats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            Showing {filteredCapsules.length} truth capsules
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-400 border-green-500/30">
              {(capsules as TruthCapsule[]).filter((c: TruthCapsule) => c.verified).length} Verified
            </Badge>
            <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
              {(capsules as TruthCapsule[]).filter((c: TruthCapsule) => c.verificationLevel === 'sealed').length} Sealed
            </Badge>
          </div>
        </div>

        {/* Capsules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapsules.map((capsule: TruthCapsule) => {
            const TypeIcon = capsuleTypeIcons[capsule.type as keyof typeof capsuleTypeIcons] || Shield;
            
            return (
              <Card key={capsule.id} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200 hover:scale-105 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-700/50 rounded-lg">
                        <TypeIcon className="h-4 w-4 text-blue-400" />
                      </div>
                      {getVerificationBadge(capsule.verificationLevel, capsule.verified)}
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${getTruthScoreColor(capsule.truthScore)}`}>
                        {capsule.truthScore}%
                      </div>
                      <div className="text-xs text-gray-400">Truth Score</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-white line-clamp-2 mb-2">
                      {capsule.title}
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {capsule.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {capsule.tags.slice(0, 3).map((tag: string) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs border-slate-600 text-gray-400"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {capsule.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-slate-600 text-gray-400">
                        +{capsule.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {capsule.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(capsule.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      by {capsule.author}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCapsules.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No capsules found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or browse all truth capsules.
            </p>
            <Button onClick={() => { setSearchTerm(""); setSelectedType("all"); }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        {!isAuthenticated && (
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 mt-8">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Join the Truth Network</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Create your own truth capsules, verify others' content, and earn GTT rewards for maintaining the integrity of information.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/api/login">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}