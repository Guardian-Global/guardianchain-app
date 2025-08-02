// Figma Integration Guide Component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, Palette, Layout, Type, Box } from "lucide-react";
import { useState } from "react";

export default function FigmaIntegrationGuide() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = (text: string, tokenName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(tokenName);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const figmaTokens = {
    colors: [
      { name: "Primary (Guardian Blue)", value: "#3b82f6", description: "Primary brand color" },
      { name: "Secondary (Vault Black)", value: "#0f172a", description: "Dark background color" },
      { name: "Accent (Veritas Green)", value: "#22c55e", description: "Success and verification color" },
      { name: "Surface (Slate)", value: "#1e293b", description: "Card and surface backgrounds" },
      { name: "Warning", value: "#f97316", description: "Warning and signal color" },
      { name: "Text Light", value: "#f1f5f9", description: "Light text on dark backgrounds" },
    ],
    typography: [
      { name: "Brand Font", value: "Space Grotesk", description: "Headlines and brand elements" },
      { name: "Sans Font", value: "Inter", description: "Body text and UI elements" },
    ],
    spacing: [
      { name: "Capsule Radius", value: "32px", description: "Large component radius" },
      { name: "Vault Radius", value: "24px", description: "Medium component radius" },
      { name: "Button Radius", value: "8px", description: "Standard button radius" },
      { name: "Sidebar Width", value: "256px", description: "Navigation sidebar width" },
      { name: "Card Padding", value: "24px", description: "Standard card padding" },
    ],
    shadows: [
      { name: "Card Shadow", value: "0 10px 40px rgba(0, 0, 0, 0.15)", description: "Standard card shadow" },
      { name: "Install Button Shadow", value: "0 2px 6px rgba(0,0,0,0.25)", description: "Install button shadow" },
    ]
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-brand-light font-brand">
          Figma Design System Integration
        </h1>
        <p className="text-brand-light/80">
          Complete design tokens for seamless Figma to code workflow
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button 
          className="primary-button flex items-center gap-2"
          onClick={() => copyToClipboard(JSON.stringify(figmaTokens, null, 2), "all-tokens")}
        >
          <Download className="w-4 h-4" />
          Export All Tokens
        </Button>
        <Button 
          variant="outline"
          className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white"
          onClick={() => window.open('/figma-style-guide.guardianchain.json', '_blank')}
        >
          <Copy className="w-4 h-4 mr-2" />
          Download JSON
        </Button>
      </div>

      {/* Color Tokens */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Color Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {figmaTokens.colors.map((token) => (
              <div key={token.name} className="space-y-3">
                <div 
                  className="w-full h-16 rounded-vault border border-brand-surface cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: token.value }}
                  onClick={() => copyToClipboard(token.value, token.name)}
                />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-brand-light">{token.name}</span>
                    <Badge 
                      className="bg-brand-surface text-brand-light border-brand-primary/20 cursor-pointer hover:bg-brand-primary/20"
                      onClick={() => copyToClipboard(token.value, token.name)}
                    >
                      {copiedToken === token.name ? "Copied!" : token.value}
                    </Badge>
                  </div>
                  <p className="text-xs text-brand-light/60">{token.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography Tokens */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand flex items-center">
            <Type className="w-5 h-5 mr-2" />
            Typography Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {figmaTokens.typography.map((token) => (
              <div key={token.name} className="space-y-3">
                <div className="p-4 rounded-vault bg-brand-surface border border-brand-primary/20">
                  <h3 
                    className="text-xl text-brand-light mb-2"
                    style={{ fontFamily: token.value }}
                  >
                    {token.value} Sample Text
                  </h3>
                  <p className="text-brand-light/80 text-sm">{token.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10"
                  onClick={() => copyToClipboard(token.value, token.name)}
                >
                  <Copy className="w-3 h-3 mr-2" />
                  {copiedToken === token.name ? "Copied!" : `Copy ${token.name}`}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spacing & Layout Tokens */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand flex items-center">
            <Layout className="w-5 h-5 mr-2" />
            Spacing & Layout Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {figmaTokens.spacing.map((token) => (
              <div key={token.name} className="space-y-3">
                <div className="p-4 rounded-vault bg-brand-surface border border-brand-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-brand-light">{token.name}</span>
                    <Badge className="bg-brand-primary text-white text-xs">
                      {token.value}
                    </Badge>
                  </div>
                  <p className="text-xs text-brand-light/60">{token.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10"
                  onClick={() => copyToClipboard(token.value, token.name)}
                >
                  <Copy className="w-3 h-3 mr-2" />
                  {copiedToken === token.name ? "Copied!" : "Copy Value"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shadow Tokens */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand flex items-center">
            <Box className="w-5 h-5 mr-2" />
            Shadow Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {figmaTokens.shadows.map((token) => (
              <div key={token.name} className="space-y-3">
                <div 
                  className="w-full h-20 rounded-vault bg-brand-surface border border-brand-primary/20 flex items-center justify-center"
                  style={{ boxShadow: token.value }}
                >
                  <span className="text-brand-light font-brand">{token.name}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-brand-light/80">{token.description}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10"
                    onClick={() => copyToClipboard(token.value, token.name)}
                  >
                    <Copy className="w-3 h-3 mr-2" />
                    {copiedToken === token.name ? "Copied!" : "Copy CSS"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Instructions */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand">Figma Integration Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Badge className="bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                1
              </Badge>
              <div>
                <h4 className="text-brand-light font-medium">Import Color Tokens</h4>
                <p className="text-brand-light/60 text-sm">Copy color values to your Figma color styles</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge className="bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                2
              </Badge>
              <div>
                <h4 className="text-brand-light font-medium">Set Typography Styles</h4>
                <p className="text-brand-light/60 text-sm">Configure Space Grotesk and Inter font families</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge className="bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                3
              </Badge>
              <div>
                <h4 className="text-brand-light font-medium">Apply Spacing Tokens</h4>
                <p className="text-brand-light/60 text-sm">Use consistent radius and spacing values</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge className="bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                4
              </Badge>
              <div>
                <h4 className="text-brand-light font-medium">Create Component Library</h4>
                <p className="text-brand-light/60 text-sm">Build reusable components with token values</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}