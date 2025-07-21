import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share, Twitter, MessageCircle, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OneClickSocialMediaShare() {
  const { toast } = useToast();

  const shareData = {
    title: "GTT Token - GUARDIANCHAIN Protocol Launch",
    text: "Discover the future of truth verification with GTT token! Join the decentralized truth economy. #GTT #GUARDIANCHAIN #TruthVerification",
    url: typeof window !== 'undefined' ? window.location.href : ''
  };

  const handleShare = async (platform: string) => {
    try {
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`, '_blank');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
          toast({
            title: "Copied!",
            description: "Share text copied to clipboard",
          });
          break;
        case 'native':
          if (navigator.share) {
            await navigator.share(shareData);
          } else {
            toast({
              title: "Not Supported",
              description: "Native sharing not available on this device",
              variant: "destructive",
            });
          }
          break;
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Could not share at this time",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share className="w-6 h-6 text-blue-500" />
          One-Click Social Media Share
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quick Share Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleShare('twitter')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            
            <Button
              onClick={() => handleShare('telegram')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Telegram
            </Button>
            
            <Button
              onClick={() => handleShare('copy')}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            
            <Button
              onClick={() => handleShare('native')}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              More Options
            </Button>
          </div>

          {/* Share Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-400">2.1K</div>
              <div className="text-sm text-slate-400">Total Shares</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-400">847</div>
              <div className="text-sm text-slate-400">Twitter</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-purple-400">623</div>
              <div className="text-sm text-slate-400">Telegram</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-yellow-400">658</div>
              <div className="text-sm text-slate-400">Other</div>
            </div>
          </div>

          {/* Viral Potential */}
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-300">Viral Potential Score</h4>
              <Badge className="bg-green-500/20 text-green-400">High</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Engagement Rate</span>
                <span className="text-green-400">12.4%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Trend Alignment</span>
                <span className="text-blue-400">85%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Shareability</span>
                <span className="text-purple-400">92%</span>
              </div>
            </div>
          </div>

          {/* Pre-written Messages */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-300">Quick Messages</h4>
            <div className="space-y-2">
              <div className="p-3 bg-slate-700/50 rounded-lg text-sm">
                "🚀 Just discovered GTT token! The future of truth verification is here. #GUARDIANCHAIN"
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg text-sm">
                "💎 GTT token showing incredible performance! Join the decentralized truth economy today."
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg text-sm">
                "🔥 GUARDIANCHAIN is revolutionizing how we verify truth. Don't miss the GTT token opportunity!"
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}