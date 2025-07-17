import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ShareButtons from "@/components/social/share-buttons";
import DynamicMeta from "@/components/seo/dynamic-meta";
import { Share2, Eye, ExternalLink, Globe } from "lucide-react";

export default function ShareDemo() {
  const mockCapsule = {
    id: 123,
    title: "Arctic Ice Sheet Analysis: Critical Temperature Trends 2020-2024",
    description: "Comprehensive scientific analysis of Arctic ice sheet melting patterns with peer-reviewed temperature data showing accelerated warming trends in the Greenland ice sheet.",
    category: "science",
    status: "sealed",
    griefScore: "1.0",
    gttReward: "250.00",
    verificationCount: 12,
    replayCount: 45,
    creatorId: 42,
    docusignEnvelopeId: "env_arctic_study_2024",
    veritasSealUrl: "https://demo.docusign.net/arctic-study-seal",
    imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=123&backgroundColor=1e293b",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z"
  };

  const shareUrl = `https://guardianchain.app/capsule/${mockCapsule.id}`;
  const shareTitle = `Immutable Truth Capsule: ${mockCapsule.title}`;
  const shareDescription = `${mockCapsule.description} • Verified truth on GuardianChain with grief score ${mockCapsule.griefScore}`;

  return (
    <>
      {/* Dynamic Meta Tags for this demo */}
      <DynamicMeta 
        title="Social Sharing Demo – GuardianChain"
        description="Demonstration of viral capsule sharing with rich OpenGraph metadata and social media integration."
        image="https://api.dicebear.com/7.x/shapes/svg?seed=share-demo&backgroundColor=1e293b"
        url="https://guardianchain.app/share-demo"
      />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Social Sharing Integration Demo
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Test viral capsule sharing with dynamic OpenGraph metadata, Twitter Cards, 
            and cross-platform social media integration for immutable truth verification.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mock Capsule Preview */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-400" />
                Sample Truth Capsule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-purple-600 text-white">
                        Sealed with Veritas
                      </Badge>
                      <Badge className="bg-blue-600 text-white">
                        {mockCapsule.category}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {mockCapsule.title}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {mockCapsule.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">GTT Reward</div>
                    <div className="font-bold text-green-400">{mockCapsule.gttReward} GTT</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold text-white">{mockCapsule.griefScore}</div>
                    <div className="text-slate-400">Grief Score</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{mockCapsule.verificationCount}</div>
                    <div className="text-slate-400">Verifications</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{mockCapsule.replayCount}</div>
                    <div className="text-slate-400">Replays</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    View Veritas Certificate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Interface */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-green-400" />
                Social Sharing Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ShareButtons
                title={shareTitle}
                url={shareUrl}
                image={mockCapsule.imageUrl}
                description={shareDescription}
              />
            </CardContent>
          </Card>
        </div>

        {/* Implementation Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* OpenGraph Meta Tags */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Generated OpenGraph Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 p-4 rounded-lg">
                <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
{`<meta property="og:title" content="${shareTitle}" />
<meta property="og:description" content="${shareDescription}" />
<meta property="og:image" content="${mockCapsule.imageUrl}" />
<meta property="og:url" content="${shareUrl}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="GuardianChain" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${shareTitle}" />
<meta name="twitter:description" content="${shareDescription}" />
<meta name="twitter:image" content="${mockCapsule.imageUrl}" />
<meta name="twitter:site" content="@guardianchain" />`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Share URLs */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Generated Share Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-medium text-white mb-1">Twitter/X</div>
                  <code className="text-blue-400 break-all">
                    https://twitter.com/intent/tweet?text={encodeURIComponent(shareTitle)}&url={shareUrl}&hashtags=GuardianChain,TruthVerification,Web3
                  </code>
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Facebook</div>
                  <code className="text-blue-400 break-all">
                    https://www.facebook.com/sharer/sharer.php?u={shareUrl}&quote={shareTitle}
                  </code>
                </div>
                <div>
                  <div className="font-medium text-white mb-1">LinkedIn</div>
                  <code className="text-blue-400 break-all">
                    https://www.linkedin.com/sharing/share-offsite/?url={shareUrl}&title={shareTitle}
                  </code>
                </div>
                <div>
                  <div className="font-medium text-white mb-1">WhatsApp</div>
                  <code className="text-blue-400 break-all">
                    https://wa.me/?text={shareTitle}%20{shareUrl}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Implemented */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Viral Sharing Features Implemented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-white">✅ Dynamic Meta Tags</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• OpenGraph properties for rich previews</li>
                  <li>• Twitter Card with large image support</li>
                  <li>• Dynamic title, description, image generation</li>
                  <li>• SEO-optimized structured data</li>
                  <li>• Capsule-specific metadata injection</li>
                </ul>

                <h4 className="font-semibold text-white mt-4">✅ Social Platform Integration</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Twitter/X with hashtag support</li>
                  <li>• Facebook with quote sharing</li>
                  <li>• LinkedIn professional network</li>
                  <li>• WhatsApp mobile-first sharing</li>
                  <li>• Email with formatted content</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white">✅ User Experience</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Native mobile sharing API support</li>
                  <li>• One-click copy link functionality</li>
                  <li>• Toast notifications for feedback</li>
                  <li>• Compact mode for card integration</li>
                  <li>• Responsive grid layouts</li>
                </ul>

                <h4 className="font-semibold text-white mt-4">✅ Branding & Attribution</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• GuardianChain branding consistency</li>
                  <li>• Immutable proof messaging</li>
                  <li>• Grief score and verification highlights</li>
                  <li>• Creator protection through attribution</li>
                  <li>• Legal proof URL integration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Ready for Viral Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Eye className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-medium">Social sharing integration complete</span>
              </div>
              <p className="text-slate-400 max-w-lg mx-auto">
                Truth capsules now support viral sharing with rich metadata, proper attribution, 
                and immutable proof branding across all major social platforms.
              </p>
              <div className="text-xs text-slate-500">
                Ready for: Capsule ROI analytics • GTT smart contracts • Creator invitation flow • Dispute protection
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}