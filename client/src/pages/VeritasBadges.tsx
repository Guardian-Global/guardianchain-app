import React from "react";
import { Helmet } from "react-helmet-async";
import VeritasBadgeSection from "@/components/profile/VeritasBadgeSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Award, Download, Star } from "lucide-react";

export default function VeritasBadgesPage() {
  return (
    <>
      <Helmet>
        <title>Veritas Badges | GuardianChain</title>
        <meta name="description" content="Download and showcase your earned Veritas verification badges from GuardianChain" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-cyan-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Veritas Badges
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Showcase your verification achievements and download your earned badges to use across platforms
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Earn Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Complete truth verifications with high accuracy to earn your Veritas badges
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Download className="w-5 h-5 text-blue-400" />
                  Download Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Download high-quality SVG badges to showcase on your profiles and platforms
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="w-5 h-5 text-purple-400" />
                  Build Reputation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  Use your badges to build trust and showcase your verification expertise
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Badge Section */}
          <VeritasBadgeSection />

          {/* Badge Usage Guide */}
          <Card className="bg-slate-800 border-slate-700 mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">How to Use Your Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">Professional Profiles</h3>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Add to LinkedIn profile and resume</li>
                    <li>• Include in professional bio sections</li>
                    <li>• Use in email signatures</li>
                    <li>• Display on personal websites</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Social Platforms</h3>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Share on Twitter and social media</li>
                    <li>• Add to Discord and forum profiles</li>
                    <li>• Include in blog author bios</li>
                    <li>• Use in NFT profile pictures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}