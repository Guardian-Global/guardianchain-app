import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Image,
  Video,
  FileText,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Download,
  ExternalLink,
} from "lucide-react";
import { useSupabaseAssets } from "@/hooks/useSupabaseAssets";
import SupabaseImageGallery from "@/components/assets/SupabaseImageGallery";
import SupabaseHeroBackground from "@/components/assets/SupabaseHeroBackground";
import AssetImplementationStatus from "@/components/assets/AssetImplementationStatus";
import { useToast } from "@/hooks/use-toast";

export default function AssetIntegration() {
  const {
    assets,
    recommendations,
    totalAssets,
    buckets,
    isLoading,
    getBrandingAssets,
    getHeroAssets,
    getBackgroundAssets,
    getAssetsByType,
  } = useSupabaseAssets();

  const { toast } = useToast();

  const implementationSuggestions = [
    {
      component: "Navigation Header",
      description: "Replace default logo with highest value branding asset",
      assets: getBrandingAssets().slice(0, 3),
      priority: "high",
      implementation:
        "Update EnhancedMegaNavigation.tsx to use EnhancedLogoDisplay component",
    },
    {
      component: "Homepage Hero",
      description:
        "Use hero or background assets for immersive landing experience",
      assets: [...getHeroAssets(), ...getBackgroundAssets()].slice(0, 3),
      priority: "high",
      implementation:
        "Wrap homepage sections with SupabaseHeroBackground component",
    },
    {
      component: "Dashboard Backgrounds",
      description: "Enhanced visual appeal for admin and user dashboards",
      assets: getBackgroundAssets().slice(0, 2),
      priority: "medium",
      implementation:
        "Add background assets to commander and founder dashboards",
    },
    {
      component: "Content Galleries",
      description: "Showcase all images throughout the application",
      assets: getAssetsByType("image").slice(0, 4),
      priority: "medium",
      implementation: "Use SupabaseImageGallery component on relevant pages",
    },
    {
      component: "Video Integration",
      description: "Integrate video assets for enhanced user experience",
      assets: getAssetsByType("video"),
      priority: "low",
      implementation: "Create video components for product demonstrations",
    },
  ];

  const copyImplementationCode = (component: string) => {
    const codeSnippets: { [key: string]: string } = {
      "Navigation Header": `import EnhancedLogoDisplay from "@/components/assets/EnhancedLogoDisplay";

// Replace existing logo with:
<EnhancedLogoDisplay 
  size="lg" 
  variant="full" 
  className="w-8 h-8"
/>`,
      "Homepage Hero": `import SupabaseHeroBackground from "@/components/assets/SupabaseHeroBackground";

// Wrap your hero section:
<SupabaseHeroBackground overlay={true}>
  {/* Your hero content */}
</SupabaseHeroBackground>`,
      "Content Galleries": `import SupabaseImageGallery from "@/components/assets/SupabaseImageGallery";

// Add image gallery:
<SupabaseImageGallery 
  category="showcase" 
  maxImages={8}
  gridCols={3}
/>`,
    };

    const code =
      codeSnippets[component] || "// Implementation code not available";

    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Code Copied",
        description: `Implementation code for ${component} copied to clipboard`,
      });
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-400 border-t-transparent mx-auto"></div>
            <h1 className="text-3xl font-bold text-white">
              Discovering Assets...
            </h1>
            <p className="text-slate-300">
              Scanning your Supabase storage for integration opportunities
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SupabaseHeroBackground overlay={true} className="min-h-screen">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              SUPABASE ASSET INTEGRATION
            </h1>
            <p className="text-xl text-slate-300">
              Maximize value from your {totalAssets} stored assets across{" "}
              {buckets} buckets
            </p>
          </div>

          {/* Asset Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Database className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">
                  {totalAssets}
                </div>
                <div className="text-sm text-slate-400">Total Assets</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Image className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">
                  {getAssetsByType("image").length}
                </div>
                <div className="text-sm text-slate-400">Images</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Video className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-white">
                  {getAssetsByType("video").length}
                </div>
                <div className="text-sm text-slate-400">Videos</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold text-white">
                  {getBrandingAssets().length}
                </div>
                <div className="text-sm text-slate-400">Branding Assets</div>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Recommendations */}
          <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-400" />
                Strategic Implementation Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {implementationSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-slate-700/50 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-white">
                          {suggestion.component}
                        </h3>
                        <Badge
                          variant={
                            suggestion.priority === "high"
                              ? "default"
                              : suggestion.priority === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {suggestion.priority} priority
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-400">
                        {suggestion.assets.length} assets available
                      </div>
                    </div>

                    <p className="text-slate-300">{suggestion.description}</p>

                    {/* Available Assets */}
                    {suggestion.assets.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {suggestion.assets.map((asset: any) => (
                          <div
                            key={asset.id}
                            className="flex items-center space-x-3 p-2 rounded bg-slate-600/50"
                          >
                            <Image className="h-4 w-4 text-blue-400" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white truncate">
                                {asset.name}
                              </div>
                              <div className="text-xs text-slate-400">
                                Value: {asset.value}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-600">
                      <div className="text-sm text-slate-400">
                        Implementation: {suggestion.implementation}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyImplementationCode(suggestion.component)
                          }
                        >
                          Copy Code
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Implement
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Asset Browser Tabs */}
          <Tabs defaultValue="galleries" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/70 backdrop-blur-sm">
              <TabsTrigger value="galleries" className="text-white">
                Image Galleries
              </TabsTrigger>
              <TabsTrigger value="branding" className="text-white">
                Branding Assets
              </TabsTrigger>
              <TabsTrigger value="backgrounds" className="text-white">
                Backgrounds
              </TabsTrigger>
              <TabsTrigger value="integration" className="text-white">
                Live Integration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="galleries">
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Showcase Image Galleries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SupabaseImageGallery
                    maxImages={12}
                    showControls={true}
                    gridCols={3}
                    className="space-y-6"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding">
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Branding Assets Collection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SupabaseImageGallery
                    category="branding"
                    maxImages={8}
                    showControls={true}
                    gridCols={4}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backgrounds">
              <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Background Assets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SupabaseImageGallery
                    category="background"
                    maxImages={6}
                    showControls={true}
                    gridCols={3}
                  />
                  <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">
                      Usage Example
                    </h3>
                    <p className="text-slate-300 text-sm mb-3">
                      These background assets are perfect for hero sections,
                      dashboard backgrounds, and immersive page layouts.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => copyImplementationCode("Homepage Hero")}
                    >
                      Copy Background Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integration">
              <AssetImplementationStatus />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SupabaseHeroBackground>
  );
}
