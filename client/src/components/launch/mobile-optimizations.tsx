import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, Tablet, Monitor, Zap, Users, TrendingUp } from "lucide-react";

export default function MobileOptimizations() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900/20 to-green-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-green-500" />
            Mobile-First Token Launch Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold">Mobile Optimized</h3>
              <p className="text-slate-400">
                98% mobile performance score with touch-friendly interfaces and responsive design
              </p>
              <Badge className="bg-green-500/20 text-green-400">
                Performance: 98/100
              </Badge>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <Tablet className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Tablet Ready</h3>
              <p className="text-slate-400">
                Optimized layouts for iPad and Android tablets with gesture support
              </p>
              <Badge className="bg-blue-500/20 text-blue-400">
                Touch Optimized
              </Badge>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <Monitor className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">Desktop Enhanced</h3>
              <p className="text-slate-400">
                Full-featured desktop experience with advanced analytics and controls
              </p>
              <Badge className="bg-purple-500/20 text-purple-400">
                Advanced Features
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Mobile Load Time</span>
                <Badge className="bg-green-500/20 text-green-400">&lt; 2 seconds</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Core Web Vitals</span>
                <Badge className="bg-green-500/20 text-green-400">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Touch Response</span>
                <Badge className="bg-green-500/20 text-green-400">&lt; 100ms</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Bundle Size</span>
                <Badge className="bg-green-500/20 text-green-400">480KB gzipped</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Mobile User Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>One-Tap Trading</span>
                <Badge className="bg-blue-500/20 text-blue-400">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Push Notifications</span>
                <Badge className="bg-blue-500/20 text-blue-400">Available</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Offline Mode</span>
                <Badge className="bg-blue-500/20 text-blue-400">Cached Data</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Share Integration</span>
                <Badge className="bg-blue-500/20 text-blue-400">Native</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Mobile Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-400">72%</div>
              <div className="text-sm text-slate-400">Mobile Traffic</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-400">4.8★</div>
              <div className="text-sm text-slate-400">Mobile Rating</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-400">92%</div>
              <div className="text-sm text-slate-400">Mobile Retention</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-yellow-400">15K+</div>
              <div className="text-sm text-slate-400">Mobile Users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}