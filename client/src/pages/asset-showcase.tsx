import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAssets } from "@/components/assets/AssetProvider";
import { LogoDisplay } from "@/components/assets/LogoDisplay";
import { VideoDisplay } from "@/components/assets/VideoDisplay";
import { NFTIconDisplay } from "@/components/assets/NFTIconDisplay";
import { CapsuleArtDisplay } from "@/components/assets/CapsuleArtDisplay";
import {
  Image,
  Video,
  Shield,
  Star,
  Palette,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function AssetShowcase() {
  const {
    assets,
    logos,
    videos,
    nftIcons,
    capsuleArt,
    loading,
    error,
    refreshAssets,
  } = useAssets();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Loading Your Assets
              </h2>
              <p className="text-slate-300">
                Discovering assets from your Supabase storage...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Asset Loading Error
              </h2>
              <p className="text-slate-300 mb-4">{error}</p>
              <Button
                onClick={refreshAssets}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Retry Loading Assets
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              GUARDIANCHAIN Asset Gallery
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Your complete collection of logos, videos, NFT art, and capsule
            designs from Supabase
          </p>
          <div className="flex justify-center space-x-6 text-sm text-slate-400">
            <span>{assets.length} Total Assets</span>
            <span>{logos.length} Logos</span>
            <span>{videos.length} Videos</span>
            <span>{nftIcons.length} NFT Icons</span>
            <span>{capsuleArt.length} Capsule Art</span>
          </div>
        </div>

        {/* Logo Showcase */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Palette className="w-6 h-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Brand Logos</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {["main", "icon", "text", "full"].map((variant) => (
              <Card key={variant} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <LogoDisplay
                    size="xl"
                    variant={variant as any}
                    className="mx-auto mb-3"
                  />
                  <p className="text-sm text-slate-300 capitalize">
                    {variant} Logo
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Video Showcase */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Video className="w-6 h-6 text-green-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Video Assets</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["explainer", "demo", "hero", "main"].map((variant) => (
              <Card key={variant} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white capitalize">
                    {variant} Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoDisplay
                    variant={variant as any}
                    autoplay={false}
                    controls={true}
                    className="w-full aspect-video rounded"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* NFT Icons Showcase */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-blue-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">
              NFT Icons Collection
            </h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-4">
            {["guardian", "capsule", "badge", "tier", "achievement"].map(
              (type) =>
                ["common", "rare", "epic", "legendary"].map((rarity) => (
                  <Card
                    key={`${type}-${rarity}`}
                    className="bg-slate-800/50 border-slate-700 p-3"
                  >
                    <CardContent className="p-0 text-center">
                      <NFTIconDisplay
                        type={type as any}
                        rarity={rarity as any}
                        size="lg"
                        animated={rarity === "legendary"}
                        className="mx-auto mb-2"
                      />
                      <p className="text-xs text-slate-400 capitalize">
                        {type}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {rarity}
                      </p>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </section>

        {/* Capsule Art Showcase */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-amber-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">
              Capsule Art Gallery
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["truth", "legal", "news", "science", "creative", "civic"].map(
              (category) => (
                <Card
                  key={category}
                  className="bg-slate-800/50 border-slate-700"
                >
                  <CardContent className="p-4 text-center">
                    <CapsuleArtDisplay
                      variant="cover"
                      category={category as any}
                      size="lg"
                      className="mx-auto mb-3"
                    />
                    <p className="text-sm text-slate-300 capitalize">
                      {category}
                    </p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </section>

        {/* Asset Statistics */}
        <section className="mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Asset Integration Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-white">
                    {assets.length}
                  </div>
                  <div className="text-sm text-slate-400">Total Assets</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">
                    {logos.length}
                  </div>
                  <div className="text-sm text-slate-400">Brand Logos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">
                    {videos.length}
                  </div>
                  <div className="text-sm text-slate-400">Video Assets</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">
                    {nftIcons.length + capsuleArt.length}
                  </div>
                  <div className="text-sm text-slate-400">Art & Icons</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Refresh Assets */}
        <div className="text-center">
          <Button
            onClick={refreshAssets}
            className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
          >
            Refresh Asset Library
          </Button>
        </div>
      </div>
    </div>
  );
}
