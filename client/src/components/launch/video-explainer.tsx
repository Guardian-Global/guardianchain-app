import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Play, Download, Share, Eye, Clock } from "lucide-react";
import { useState } from "react";

export default function VideoExplainer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900/20 to-green-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-6 h-6 text-purple-500" />
            GUARDIANCHAIN Protocol Explainer Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-slate-800/50 rounded-lg relative overflow-hidden">
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                <Button
                  size="lg"
                  onClick={() => setIsPlaying(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Play GTT Token Overview (3:47)
                </Button>
              </div>
            ) : (
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                src="https://mpjgcleldijxkvbuxiqg.supabase.co/storage/v1/object/public/media-assets/GUARDIANCHAIN_PROTOCOL_VIDEO_MAIN.mp4"
              >
                Your browser does not support the video tag.
              </video>
            )}

            <div className="absolute top-4 left-4">
              <Badge className="bg-purple-600 text-white">HD Quality</Badge>
            </div>

            <div className="absolute top-4 right-4">
              <Badge className="bg-green-600 text-white">
                <Eye className="w-3 h-3 mr-1" />
                24.7K views
              </Badge>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <Clock className="w-8 h-8 text-blue-400 mx-auto" />
              <h4 className="font-semibold">Quick Overview</h4>
              <p className="text-sm text-slate-400">
                3-minute comprehensive explanation of GTT token economics
              </p>
            </div>

            <div className="text-center space-y-2">
              <Download className="w-8 h-8 text-green-400 mx-auto" />
              <h4 className="font-semibold">Download</h4>
              <p className="text-sm text-slate-400">
                Available in 4K, 1080p, and mobile formats
              </p>
            </div>

            <div className="text-center space-y-2">
              <Share className="w-8 h-8 text-purple-400 mx-auto" />
              <h4 className="font-semibold">Share</h4>
              <p className="text-sm text-slate-400">
                One-click sharing to social media platforms
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>Video Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                <span>0:00 - Introduction</span>
                <Badge variant="outline">30s</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                <span>0:30 - GTT Token Utility</span>
                <Badge variant="outline">90s</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                <span>2:00 - Truth Verification</span>
                <Badge variant="outline">60s</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                <span>3:00 - Getting Started</span>
                <Badge variant="outline">47s</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Video className="w-4 h-4 mr-2" />
                Technical Deep Dive (12 min)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Play className="w-4 h-4 mr-2" />
                Investor Presentation (8 min)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                White Paper PDF
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Share className="w-4 h-4 mr-2" />
                Share Video Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Video Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-400">24.7K</div>
              <div className="text-sm text-slate-400">Total Views</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-400">94%</div>
              <div className="text-sm text-slate-400">Completion Rate</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-400">4.9★</div>
              <div className="text-sm text-slate-400">User Rating</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-yellow-400">2.1K</div>
              <div className="text-sm text-slate-400">Shares</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
