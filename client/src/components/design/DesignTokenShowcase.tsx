// Design Token Showcase Component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DesignTokenShowcase() {
  const colorTokens = [
    { name: "Primary", value: "#3b82f6", css: "brand-primary", description: "Guardian Blue — trust + tech" },
    { name: "Secondary", value: "#0f172a", css: "brand-secondary", description: "Vault Black — memory permanence" },
    { name: "Accent", value: "#22c55e", css: "brand-accent", description: "Veritas Green — proof and yield" },
    { name: "Surface", value: "#1e293b", css: "brand-surface", description: "Surface token" },
    { name: "Warning", value: "#f97316", css: "brand-warning", description: "Signal Orange" },
    { name: "Danger", value: "#ef4444", css: "brand-danger", description: "Danger token" },
  ];

  const radiusTokens = [
    { name: "Capsule", value: "2rem", css: "rounded-capsule", description: "Capsule radius token" },
    { name: "Vault", value: "1.5rem", css: "rounded-vault", description: "Vault radius token" },
  ];

  const shadowTokens = [
    { name: "Card", css: "shadow-card", description: "Standard card shadow" },
    { name: "Brand", css: "shadow-brand", description: "Brand shadow with primary color" },
    { name: "Brand Large", css: "shadow-brand-lg", description: "Large brand shadow" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-brand-light font-brand">
          GuardianChain Design Token System
        </h1>
        <p className="text-brand-light/80">
          Standardized design tokens for consistent visual identity
        </p>
      </div>

      {/* Color Tokens */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand">Color Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {colorTokens.map((token) => (
              <div key={token.name} className="space-y-2">
                <div 
                  className="w-full h-16 rounded-vault border border-brand-surface"
                  style={{ backgroundColor: token.value }}
                />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-brand-light">{token.name}</span>
                    <Badge className={`bg-${token.css} text-white text-xs`}>
                      {token.value}
                    </Badge>
                  </div>
                  <p className="text-xs text-brand-light/60">{token.description}</p>
                  <code className="text-xs text-brand-accent bg-brand-surface px-1 rounded">
                    .bg-{token.css}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Radius Tokens */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand">Radius Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {radiusTokens.map((token) => (
              <div key={token.name} className="space-y-2">
                <div 
                  className={`w-full h-16 bg-brand-primary ${token.css} border border-brand-surface`}
                />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-brand-light">{token.name}</span>
                    <Badge className="bg-brand-accent text-white text-xs">
                      {token.value}
                    </Badge>
                  </div>
                  <p className="text-xs text-brand-light/60">{token.description}</p>
                  <code className="text-xs text-brand-accent bg-brand-surface px-1 rounded">
                    .{token.css}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shadow Tokens */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand">Shadow Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shadowTokens.map((token) => (
              <div key={token.name} className="space-y-2">
                <div 
                  className={`w-full h-16 bg-brand-surface ${token.css} rounded-vault border border-brand-primary/20`}
                />
                <div className="space-y-1">
                  <span className="text-sm font-medium text-brand-light">{token.name}</span>
                  <p className="text-xs text-brand-light/60">{token.description}</p>
                  <code className="text-xs text-brand-accent bg-brand-surface px-1 rounded">
                    .{token.css}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography Tokens */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand">Typography Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-brand text-brand-light">Space Grotesk (Brand Font)</h3>
            <p className="text-brand-light/80">Used for headings, titles, and brand elements</p>
            <code className="text-xs text-brand-accent bg-brand-surface px-1 rounded">
              .font-brand
            </code>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-sans text-brand-light">Inter (Sans Font)</h3>
            <p className="text-brand-light/80">Used for body text and UI elements</p>
            <code className="text-xs text-brand-accent bg-brand-surface px-1 rounded">
              .font-sans
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Examples */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand">Interactive Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button className="guardian-hover bg-brand-primary hover:bg-brand-primary/90">
              Guardian Button
            </Button>
            <Button className="capsule-premium-hover bg-brand-accent hover:bg-brand-accent/90">
              Veritas Button
            </Button>
            <Button className="bg-brand-warning hover:bg-brand-warning/90">
              Signal Button
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-capsule bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20">
              <h4 className="font-brand text-brand-light mb-2">Capsule Card</h4>
              <p className="text-brand-light/80 text-sm">Premium capsule radius with gradient background</p>
            </div>
            <div className="p-4 rounded-vault bg-brand-surface shadow-brand-lg border border-brand-surface">
              <h4 className="font-brand text-brand-light mb-2">Vault Card</h4>
              <p className="text-brand-light/80 text-sm">Vault radius with brand shadow</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}