import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, Star, Clock, Eye, Heart, MessageCircle, Share2, 
  Play, Pause, Volume2, Download, Bookmark, MoreHorizontal,
  Zap, Award, Globe, Lock, Unlock, Users, TrendingUp,
  FileText, Image, Video, Mic, Code, Link, Calendar,
  ChevronDown, ChevronUp, ExternalLink, Copy, Send,
  ThumbsUp, ThumbsDown, Flag, ArrowLeft, Maximize2,
  BarChart3, Network, GitBranch, Database, Coins
} from "lucide-react";

interface CapsuleDetailViewerProps {
  capsuleId: string;
  onBack?: () => void;
  fullscreen?: boolean;
}

export function CapsuleDetailViewer({ capsuleId, onBack, fullscreen = false }: CapsuleDetailViewerProps) {
  const [activeTab, setActiveTab] = useState("content");
  const [isPlaying, setIsPlaying] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [verificationVote, setVerificationVote] = useState<'truth' | 'doubt' | null>(null);

  // Mock capsule data - in real app this would come from API
  const capsule = {
    id: capsuleId,
    title: "Corporate Whistleblower Evidence: Data Harvesting Scandal",
    description: "Comprehensive documentation of illegal data collection practices by TechCorp Inc., including internal emails, database schemas, and employee testimonies. This evidence package includes multiple forms of verification and has been independently confirmed by 3 sources.",
    content: {
      text: `# Executive Summary

Through my role as Senior Data Engineer at TechCorp Inc. from 2022-2024, I discovered systematic violations of user privacy that extend far beyond what was disclosed in their privacy policy.

## Key Findings

1. **Unauthorized Data Collection**: TechCorp has been collecting biometric data (voice patterns, typing cadence, mouse movement patterns) without explicit user consent since early 2023.

2. **Third-Party Data Sales**: Internal emails confirm that user behavioral profiles were sold to advertising networks and political consulting firms for $12.50 per complete profile.

3. **Shadow Profile Creation**: The company maintains detailed profiles on non-users by aggregating data from users' contact lists, email interactions, and public social media activity.

## Evidence Overview

- 47 internal emails documenting the data collection program
- Database schema showing undisclosed data fields
- Meeting recordings discussing monetization strategies
- Code samples from the data collection framework
- Financial records showing revenue from data sales

## Timeline

**January 2023**: Initial implementation of enhanced tracking
**March 2023**: First documented data sale to Meridian Analytics
**June 2023**: Expansion to include biometric data collection
**September 2023**: Shadow profile system deployment
**December 2023**: Discovery of the program during routine audit
**February 2024**: Internal report to compliance team (ignored)
**April 2024**: Resignation and evidence compilation

This disclosure is made in good faith to protect user privacy and hold corporations accountable for their data practices.`,
      audio: "/api/audio/whistleblower-testimony.mp3",
      documents: [
        { name: "Internal_Emails_Evidence.pdf", size: "2.4 MB", type: "pdf" },
        { name: "Database_Schema_Analysis.xlsx", size: "892 KB", type: "xlsx" },
        { name: "Meeting_Recordings_Transcript.docx", size: "1.2 MB", type: "docx" },
        { name: "Financial_Records_Q3_2023.pdf", size: "3.1 MB", type: "pdf" }
      ]
    },
    type: "mixed",
    privacy: "dao-sealed",
    truthScore: 96,
    verificationLevel: "DAO Verified",
    emotionalResonance: 94,
    griefScore: 78,
    createdAt: "2025-08-03T15:30:00Z",
    unlockDate: "2025-12-01T00:00:00Z",
    author: {
      name: "DataGuardian_2024",
      tier: "Sovereign",
      verified: true,
      reputation: 847
    },
    metrics: {
      views: 15429,
      likes: 2847,
      comments: 456,
      shares: 892,
      truthVotes: 1234,
      doubtVotes: 67
    },
    tags: ["whistleblower", "corporate-crime", "data-privacy", "evidence", "verified"],
    lineage: {
      parentCapsule: "cap_parent_001",
      childCapsules: 23,
      influenceScore: 456,
      citedBy: 89
    },
    nft: {
      minted: true,
      tokenId: "5678",
      blockchain: "Polygon",
      price: 1.2,
      royalties: 10
    },
    verification: {
      communityScore: 94,
      expertReviews: 3,
      blockchainProofs: 5,
      crossReferences: 12
    }
  };

  const mockComments = [
    {
      id: "1",
      author: "TechEthicsAdvocate",
      avatar: "",
      tier: "Guardian",
      content: "This is exactly the kind of evidence we need to hold big tech accountable. Thank you for your courage in bringing this forward.",
      timestamp: "2 hours ago",
      likes: 45,
      verified: true
    },
    {
      id: "2", 
      author: "LegalExpert_2024",
      avatar: "",
      tier: "Sovereign",
      content: "From a legal perspective, this documentation appears to meet the standards for regulatory filing. I've cross-referenced with similar cases.",
      timestamp: "4 hours ago",
      likes: 67,
      verified: true
    },
    {
      id: "3",
      author: "PrivacyResearcher",
      avatar: "",
      tier: "Seeker",
      content: "The biometric data collection aspect is particularly concerning. This violates multiple international privacy laws.",
      timestamp: "6 hours ago",
      likes: 23,
      verified: false
    }
  ];

  const handleVerificationVote = (vote: 'truth' | 'doubt') => {
    setVerificationVote(vote);
    // In real app, would make API call
    console.log(`Voted ${vote} for capsule ${capsuleId}`);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-[#0d1117]' : ''} min-h-screen text-[#f0f6fc] p-6 overflow-auto`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="text-[#8b949e] hover:text-[#f0f6fc]">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gradient-neural">
                {capsule.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-[#8b949e]">
                <span>by {capsule.author.name}</span>
                <span>•</span>
                <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{capsule.metrics.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-[#30363d] text-[#8b949e]">
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="border-[#30363d] text-[#8b949e]">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="border-[#30363d] text-[#8b949e]">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-[#161b22] border-[#30363d] p-1 grid grid-cols-5">
                <TabsTrigger value="content" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-[#0d1117]">
                  Content
                </TabsTrigger>
                <TabsTrigger value="evidence" className="data-[state=active]:bg-[#ff00d4] data-[state=active]:text-[#0d1117]">
                  Evidence
                </TabsTrigger>
                <TabsTrigger value="verification" className="data-[state=active]:bg-[#7c3aed] data-[state=active]:text-[#0d1117]">
                  Verification
                </TabsTrigger>
                <TabsTrigger value="lineage" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-[#0d1117]">
                  Lineage
                </TabsTrigger>
                <TabsTrigger value="nft" className="data-[state=active]:bg-[#f79009] data-[state=active]:text-[#0d1117]">
                  NFT
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardContent className="p-6">
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-[#f0f6fc] leading-relaxed">
                        {capsule.content.text}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Audio Content */}
                {capsule.content.audio && (
                  <Card className="bg-[#161b22] border-[#30363d]">
                    <CardHeader>
                      <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
                        <Mic className="w-5 h-5 text-[#00ffe1]" />
                        Audio Testimony
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-[#21262d] rounded-lg p-4">
                        <div className="flex items-center gap-4">
                          <Button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
                          >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </Button>
                          <div className="flex-1">
                            <Progress value={35} className="h-3 bg-[#30363d]" />
                          </div>
                          <span className="text-sm text-[#8b949e]">8:34 / 24:17</span>
                          <Button size="sm" variant="ghost">
                            <Volume2 className="w-4 h-4 text-[#8b949e]" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4 text-[#8b949e]" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="evidence" className="space-y-6">
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardHeader>
                    <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
                      <Database className="w-5 h-5 text-[#ff00d4]" />
                      Supporting Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {capsule.content.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-[#21262d] rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-[#00ffe1]" />
                          <div>
                            <div className="font-semibold text-[#f0f6fc]">{doc.name}</div>
                            <div className="text-sm text-[#8b949e]">{doc.size} • {doc.type.toUpperCase()}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-[#30363d] text-[#8b949e]">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-[#30363d] text-[#8b949e]">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification" className="space-y-6">
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardHeader>
                    <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#7c3aed]" />
                      Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-[#21262d] rounded-lg">
                        <div className="text-2xl font-bold text-[#00ffe1]">{capsule.verification.communityScore}%</div>
                        <div className="text-sm text-[#8b949e]">Community Score</div>
                      </div>
                      <div className="text-center p-4 bg-[#21262d] rounded-lg">
                        <div className="text-2xl font-bold text-[#ff00d4]">{capsule.verification.expertReviews}</div>
                        <div className="text-sm text-[#8b949e]">Expert Reviews</div>
                      </div>
                      <div className="text-center p-4 bg-[#21262d] rounded-lg">
                        <div className="text-2xl font-bold text-[#7c3aed]">{capsule.verification.blockchainProofs}</div>
                        <div className="text-sm text-[#8b949e]">Blockchain Proofs</div>
                      </div>
                      <div className="text-center p-4 bg-[#21262d] rounded-lg">
                        <div className="text-2xl font-bold text-[#10b981]">{capsule.verification.crossReferences}</div>
                        <div className="text-sm text-[#8b949e]">Cross References</div>
                      </div>
                    </div>

                    <div className="bg-[#21262d] rounded-lg p-6">
                      <h4 className="font-semibold text-[#f0f6fc] mb-4">Cast Your Verification Vote</h4>
                      <div className="flex gap-4">
                        <Button 
                          variant={verificationVote === 'truth' ? 'default' : 'outline'}
                          onClick={() => handleVerificationVote('truth')}
                          className={verificationVote === 'truth' ? 'bg-[#10b981] text-[#0d1117]' : 'border-[#10b981] text-[#10b981]'}
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Truth ({capsule.metrics.truthVotes})
                        </Button>
                        <Button 
                          variant={verificationVote === 'doubt' ? 'default' : 'outline'}
                          onClick={() => handleVerificationVote('doubt')}
                          className={verificationVote === 'doubt' ? 'bg-[#f85149] text-[#0d1117]' : 'border-[#f85149] text-[#f85149]'}
                        >
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Doubt ({capsule.metrics.doubtVotes})
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lineage" className="space-y-6">
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardHeader>
                    <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-[#10b981]" />
                      Truth Lineage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-[#21262d] rounded-lg">
                        <div className="text-xl font-bold text-[#10b981]">{capsule.lineage.childCapsules}</div>
                        <div className="text-sm text-[#8b949e]">Child Capsules</div>
                      </div>
                      <div className="text-center p-4 bg-[#21262d] rounded-lg">
                        <div className="text-xl font-bold text-[#00ffe1]">{capsule.lineage.influenceScore}</div>
                        <div className="text-sm text-[#8b949e]">Influence Score</div>
                      </div>
                      <div className="text-center p-4 bg-[#21262d] rounded-lg">
                        <div className="text-xl font-bold text-[#ff00d4]">{capsule.lineage.citedBy}</div>
                        <div className="text-sm text-[#8b949e]">Citations</div>
                      </div>
                    </div>
                    
                    <div className="bg-[#21262d] rounded-lg p-4">
                      <h4 className="font-semibold text-[#f0f6fc] mb-3">Lineage Tree</h4>
                      <div className="text-sm text-[#8b949e]">
                        Visual lineage tree would be rendered here showing parent and child relationships
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nft" className="space-y-6">
                {capsule.nft.minted ? (
                  <Card className="bg-[#161b22] border-[#30363d]">
                    <CardHeader>
                      <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
                        <Coins className="w-5 h-5 text-[#f79009]" />
                        NFT Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-gradient-to-r from-[#7c3aed]/20 to-[#ff00d4]/20 rounded-lg p-6 border border-[#7c3aed]/30">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="text-sm text-[#8b949e] mb-1">Token ID</div>
                            <div className="font-semibold text-[#f0f6fc]">#{capsule.nft.tokenId}</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#8b949e] mb-1">Blockchain</div>
                            <div className="font-semibold text-[#f0f6fc]">{capsule.nft.blockchain}</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#8b949e] mb-1">Current Price</div>
                            <div className="font-semibold text-[#00ffe1]">{capsule.nft.price} ETH</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#8b949e] mb-1">Royalties</div>
                            <div className="font-semibold text-[#f0f6fc]">{capsule.nft.royalties}%</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                          <Button className="bg-[#7c3aed] text-[#f0f6fc] hover:bg-[#6d28d9]">
                            View on OpenSea
                          </Button>
                          <Button variant="outline" className="border-[#30363d] text-[#8b949e]">
                            View Transaction
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-[#161b22] border-[#30363d]">
                    <CardContent className="p-6 text-center">
                      <div className="text-[#8b949e] mb-4">This capsule has not been minted as an NFT</div>
                      <Button className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]">
                        Mint as NFT
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00ffe1] to-[#ff00d4] p-0.5">
                    <div className="w-full h-full rounded-full bg-[#161b22] flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#8b949e]" />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#f0f6fc]">{capsule.author.name}</div>
                    <div className="text-sm text-[#8b949e]">{capsule.author.tier} • {capsule.author.reputation} rep</div>
                  </div>
                </div>
                <Button className="w-full bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]">
                  Follow Guardian
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc] text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-[#30363d] text-[#8b949e]">
                  <Heart className="w-4 h-4 mr-2" />
                  Like ({capsule.metrics.likes})
                </Button>
                <Button variant="outline" className="w-full border-[#30363d] text-[#8b949e]">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Bookmark
                </Button>
                <Button variant="outline" className="w-full border-[#30363d] text-[#8b949e]">
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc] text-lg">
                  Comments ({capsule.metrics.comments})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts on this capsule..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc] resize-none"
                    rows={3}
                  />
                  <Button 
                    onClick={handleComment}
                    disabled={!newComment.trim()}
                    className="w-full bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-4 pt-4 border-t border-[#30363d]">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="bg-[#21262d] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-[#f0f6fc] text-sm">{comment.author}</span>
                        {comment.verified && <Shield className="w-3 h-3 text-[#00ffe1]" />}
                        <Badge variant="outline" className="border-[#30363d] text-[#8b949e] text-xs">
                          {comment.tier}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#f0f6fc] mb-2">{comment.content}</p>
                      <div className="flex items-center justify-between text-xs text-[#8b949e]">
                        <span>{comment.timestamp}</span>
                        <div className="flex items-center gap-2">
                          <button className="hover:text-[#ff69b4]">
                            <Heart className="w-3 h-3" />
                          </button>
                          <span>{comment.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}