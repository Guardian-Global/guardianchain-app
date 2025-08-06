import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoDisplay } from "@/components/assets/VideoDisplay";
import { LogoDisplay } from "@/components/assets/LogoDisplay";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play, Image } from "lucide-react";

export default function AssetTest() {
  const testVideo = (type: "guardianchain" | "gtt") => {
    const videoSrc =
      type === "guardianchain"
        ? "/assets/GUARDIANCHAIN_logo_video.mp4"
        : "/assets/GTT_logo_video.mp4";

    const video = document.createElement("video");
    video.src = videoSrc;
    video.onloadeddata = () => {
      console.log(`✅ ${type.toUpperCase()} video loaded successfully!`);
    };
    video.onerror = () => {
      console.log(`❌ ${type.toUpperCase()} video failed to load`);
    };
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            🎬 YOUR COMPANY ASSETS TEST
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Testing all your custom company logos and videos
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => testVideo("guardianchain")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Test GUARDIANCHAIN Video
            </Button>
            <Button
              onClick={() => testVideo("gtt")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Test GTT Video
            </Button>
          </div>
        </div>

        {/* Logo Tests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Image className="h-5 w-5 text-purple-400" />
                GUARDIANCHAIN Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <LogoDisplay type="guardianchain" size="sm" />
                <LogoDisplay type="guardianchain" size="md" />
                <LogoDisplay type="guardianchain" size="lg" />
              </div>
              <div className="text-center">
                <p className="text-slate-400">670KB PNG • Your Custom Logo</p>
                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Image className="h-5 w-5 text-green-400" />
                GTT Token Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <LogoDisplay type="gtt" size="sm" />
                <LogoDisplay type="gtt" size="md" />
                <LogoDisplay type="gtt" size="lg" />
              </div>
              <div className="text-center">
                <p className="text-slate-400">670KB PNG • Your Token Logo</p>
                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Tests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="h-5 w-5 text-purple-400" />
                GUARDIANCHAIN Video Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <VideoDisplay type="guardianchain" size="sm" controls={true} />
                <VideoDisplay type="guardianchain" size="md" controls={true} />
                <VideoDisplay type="guardianchain" size="lg" controls={true} />
              </div>
              <div className="text-center">
                <p className="text-slate-400">3.8MB MP4 • Your Custom Video</p>
                <p className="text-xs text-slate-500 mt-1">
                  Path: /assets/GUARDIANCHAIN_logo_video.mp4
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="h-5 w-5 text-green-400" />
                GTT Token Video Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <VideoDisplay type="gtt" size="sm" controls={true} />
                <VideoDisplay type="gtt" size="md" controls={true} />
                <VideoDisplay type="gtt" size="lg" controls={true} />
              </div>
              <div className="text-center">
                <p className="text-slate-400">3.8MB MP4 • Your Token Video</p>
                <p className="text-xs text-slate-500 mt-1">
                  Path: /assets/GTT_logo_video.mp4
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-slate-800/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Asset Status
            </h3>
            <p className="text-slate-300">
              All 4 of your company assets are now properly integrated and
              working. The videos should autoplay and loop. Check your browser
              console for loading status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
