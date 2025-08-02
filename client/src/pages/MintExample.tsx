// MintExample.tsx - Comprehensive Design Token Usage Example
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Coins, Shield, Vault, Zap, Star, Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";

export default function MintExample() {
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState("capsule");

  return (
    <Layout>
      <PageHeader
        title="Design Token Mint Example"
        description="Comprehensive demonstration of GuardianChain design tokens in action"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Design System", href: "/design-tokens" },
          { label: "Mint Example" },
        ]}
      />

      <div className="space-y-8 p-6">
        {/* Header Section with Brand Typography */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-brand text-brand-light mb-2">
            GuardianChain Mint Experience
          </h1>
          <p className="text-lg font-sans text-brand-light/80 max-w-2xl mx-auto">
            Experience the premium visual identity system with standardized
            design tokens for consistent styling throughout the platform.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-center justify-center space-x-2 mb-8">
          {[
            { id: "capsule", label: "Truth Capsule", icon: Shield },
            { id: "vault", label: "Memory Vault", icon: Vault },
            { id: "yield", label: "GTT Yield", icon: Coins },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 rounded-vault font-brand transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "bg-brand-primary text-white shadow-brand"
                      : "bg-brand-surface text-brand-light hover:bg-brand-primary/20"
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form Interface */}
          <Card className="bg-brand-secondary border-brand-surface shadow-card">
            <CardHeader className="space-y-4">
              <CardTitle className="text-brand-light font-brand flex items-center">
                <Zap className="w-5 h-5 mr-2 text-brand-accent" />
                Create{" "}
                {activeTab === "capsule"
                  ? "Truth Capsule"
                  : activeTab === "vault"
                    ? "Memory Vault"
                    : "GTT Yield Position"}
              </CardTitle>
              <Separator className="bg-brand-surface" />
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-brand-light/80 mb-2 block">
                    Title
                  </label>
                  <Input
                    placeholder="Enter your truth capsule title..."
                    className="bg-brand-surface border-brand-primary/20 text-brand-light placeholder:text-brand-light/50 rounded-vault"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-brand-light/80 mb-2 block">
                    Content
                  </label>
                  <Textarea
                    placeholder="Share your truth, memory, or testimony..."
                    className="bg-brand-surface border-brand-primary/20 text-brand-light placeholder:text-brand-light/50 rounded-vault min-h-[120px]"
                  />
                </div>

                {/* Tag Selection */}
                <div>
                  <label className="text-sm font-medium text-brand-light/80 mb-2 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Truth", "Memory", "Testimony", "Legacy", "Proof"].map(
                      (tag) => (
                        <Badge
                          key={tag}
                          className="bg-brand-accent/20 text-brand-accent border-brand-accent/30 hover:bg-brand-accent hover:text-white cursor-pointer transition-all duration-200 rounded-vault"
                        >
                          {tag}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <Button
                  className="w-full guardian-pulse capsule-premium-hover bg-brand-primary hover:bg-brand-primary/90 text-white font-brand py-3 rounded-capsule shadow-brand-lg"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Mint Truth Capsule
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white rounded-vault transition-all duration-300"
                >
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Preview & Stats */}
          <div className="space-y-6">
            {/* Preview Card */}
            <Card className="bg-brand-surface border-brand-primary/20 shadow-brand">
              <CardHeader>
                <CardTitle className="text-brand-light font-brand">
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-capsule bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20">
                    <h3 className="font-brand text-brand-light mb-2">
                      Your Truth Capsule
                    </h3>
                    <p className="text-brand-light/80 text-sm mb-3">
                      This is a preview of your capsule with premium styling
                      using design tokens.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-brand-accent text-white rounded-vault">
                        Verified
                      </Badge>
                      <div className="flex items-center text-brand-light/60 text-xs">
                        <Heart className="w-3 h-3 mr-1" />
                        <span>124</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-brand-secondary border-brand-surface shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-brand-accent mb-1">
                    250
                  </div>
                  <div className="text-sm text-brand-light/60">GTT Earned</div>
                </CardContent>
              </Card>

              <Card className="bg-brand-secondary border-brand-surface shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-brand-warning mb-1">
                    4.8
                  </div>
                  <div className="text-sm text-brand-light/60">Truth Score</div>
                </CardContent>
              </Card>
            </div>

            {/* Design Token Showcase */}
            <Card className="bg-brand-secondary border-brand-surface">
              <CardHeader>
                <CardTitle className="text-brand-light font-brand text-sm">
                  Active Design Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <div className="text-brand-light/60">Colors:</div>
                    <div className="text-brand-accent">✓ Primary (#3b82f6)</div>
                    <div className="text-brand-accent">✓ Accent (#22c55e)</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-brand-light/60">Radius:</div>
                    <div className="text-brand-accent">✓ Capsule (2rem)</div>
                    <div className="text-brand-accent">✓ Vault (1.5rem)</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <div className="text-brand-light/60">Typography:</div>
                    <div className="text-brand-accent">✓ Space Grotesk</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-brand-light/60">Shadows:</div>
                    <div className="text-brand-accent">✓ Brand shadows</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Section */}
        <div className="text-center pt-8">
          <div className="inline-flex items-center space-x-2 text-brand-light/60">
            <Star className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-sans">
              Powered by GuardianChain Design Token System
            </span>
            <Star className="w-4 h-4 text-brand-accent" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
