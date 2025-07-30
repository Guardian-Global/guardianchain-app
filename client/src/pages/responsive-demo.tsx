import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LogoDisplay from "@/components/assets/LogoDisplay";
import VideoDisplay from "@/components/assets/VideoDisplay";
import EnhancedLogoDisplay from "@/components/assets/EnhancedLogoDisplay";
import ResponsiveLogoSuite from "@/components/assets/ResponsiveLogoSuite";
import { Monitor, Tablet, Smartphone, Maximize } from "lucide-react";

export default function ResponsiveDemo() {
  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Responsive Logo Scaling Demo
          </h1>
          <p className="text-xl text-slate-300">
            See how GUARDIANCHAIN logos adapt to different device sizes
          </p>
        </div>

        {/* Device Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Smartphone className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-white font-semibold sm:hidden">Mobile (Active)</p>
              <p className="text-sm text-slate-400 hidden sm:block">Mobile</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Tablet className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-white font-semibold hidden sm:block md:hidden">Small (Active)</p>
              <p className="text-sm text-slate-400 sm:hidden md:block">Small</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Monitor className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-white font-semibold hidden md:block lg:hidden">Medium (Active)</p>
              <p className="text-sm text-slate-400 md:hidden lg:block">Medium</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Maximize className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-white font-semibold hidden lg:block">Large (Active)</p>
              <p className="text-sm text-slate-400 lg:hidden">Large</p>
            </CardContent>
          </Card>
        </div>

        {/* Logo Size Demonstrations */}
        <div className="space-y-12">
          {/* Static Logo Scaling */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Monitor className="h-5 w-5 text-purple-400" />
                Static Logo Responsive Scaling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {["sm", "md", "lg", "xl"].map((size) => (
                <div key={size} className="space-y-4">
                  <h3 className="text-lg font-semibold text-white capitalize">
                    Size: {size}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <p className="text-sm text-slate-400 mb-4">GUARDIANCHAIN Logo</p>
                      <LogoDisplay 
                        size={size as any} 
                        variant="full" 
                        type="guardianchain"
                        className="mx-auto"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-400 mb-4">GTT Logo</p>
                      <LogoDisplay 
                        size={size as any} 
                        variant="full" 
                        type="gtt"
                        className="mx-auto"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Video Logo Scaling */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Tablet className="h-5 w-5 text-green-400" />
                Video Logo Responsive Scaling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {["sm", "md", "lg", "xl"].map((size) => (
                <div key={size} className="space-y-4">
                  <h3 className="text-lg font-semibold text-white capitalize">
                    Size: {size}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <p className="text-sm text-slate-400 mb-4">GUARDIANCHAIN Video</p>
                      <VideoDisplay 
                        type="guardianchain" 
                        size={size as any}
                        className="mx-auto rounded-lg shadow-lg"
                        autoPlay={true}
                        loop={true}
                        muted={true}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-400 mb-4">GTT Video</p>
                      <VideoDisplay 
                        type="gtt" 
                        size={size as any}
                        className="mx-auto rounded-lg shadow-lg"
                        autoPlay={true}
                        loop={true}
                        muted={true}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Complete Logo Suite */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Maximize className="h-5 w-5 text-blue-400" />
                Complete Responsive Logo Suite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-6">
                  GUARDIANCHAIN Complete Suite
                </h3>
                <ResponsiveLogoSuite 
                  logoType="guardianchain"
                  showVideo={true}
                  showStatic={true}
                  showEnhanced={false}
                  className="mb-8"
                />
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-6">
                  GTT Complete Suite
                </h3>
                <ResponsiveLogoSuite 
                  logoType="gtt"
                  showVideo={true}
                  showStatic={true}
                  showEnhanced={false}
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation Demo */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-yellow-400" />
                Navigation Logo Scaling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6">
                The navigation logo automatically adapts:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="text-md font-semibold text-white mb-4">Mobile</h4>
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                    <EnhancedLogoDisplay size="md" variant="icon" className="mx-auto" />
                  </div>
                  <p className="text-sm text-slate-400 mt-2">Icon only</p>
                </div>
                <div className="text-center">
                  <h4 className="text-md font-semibold text-white mb-4">Tablet</h4>
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-center space-x-2">
                      <EnhancedLogoDisplay size="md" variant="icon" />
                      <span className="text-lg font-bold text-purple-400">GC</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">Icon + abbreviated</p>
                </div>
                <div className="text-center">
                  <h4 className="text-md font-semibold text-white mb-4">Desktop</h4>
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-center space-x-2">
                      <EnhancedLogoDisplay size="lg" variant="icon" />
                      <span className="text-xl font-bold">
                        <span className="text-purple-400">GUARDIAN</span>
                        <span className="text-green-400">CHAIN</span>
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">Full logo + text</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Breakpoint Info */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-900/20 to-green-900/20 border-purple-500/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Current Breakpoint Information
              </h3>
              <div className="text-slate-300">
                <p className="sm:hidden">📱 Mobile View (under 640px)</p>
                <p className="hidden sm:block md:hidden">📱 Small View (640px - 768px)</p>
                <p className="hidden md:block lg:hidden">💻 Medium View (768px - 1024px)</p>
                <p className="hidden lg:block xl:hidden">🖥️ Large View (1024px - 1280px)</p>
                <p className="hidden xl:block">🖥️ Extra Large View (over 1280px)</p>
              </div>
              <p className="text-sm text-slate-400 mt-4">
                Resize your browser window to see the responsive scaling in action!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}