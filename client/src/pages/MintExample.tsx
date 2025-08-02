// Example page demonstrating Layout and PageHeader usage
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Clock, Award } from "lucide-react";

export default function MintExample() {
  const { user } = useAuth();
  const userTier = user?.tier?.toLowerCase() || 'explorer';

  return (
    <Layout title="Mint Capsule NFT - GuardianChain" tier={userTier}>
      <PageHeader
        title="🧬 Mint Capsule NFT"
        subtitle="Tokenize your sealed truth for permanent verifiability on the blockchain"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Minting Form Card */}
        <Card className="bg-brand-secondary border-brand-surface shadow-brand">
          <CardHeader>
            <CardTitle className="text-brand-light font-brand flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-primary" />
              NFT Minting Studio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-brand-light text-sm">Capsule Type</span>
                <Badge className="bg-brand-accent text-white">Truth Vault</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-light text-sm">Verification Status</span>
                <Badge className="bg-brand-primary text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-light text-sm">Time Lock</span>
                <Badge className="bg-brand-warning text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  7 Days
                </Badge>
              </div>
            </div>
            <Button className="w-full guardian-hover bg-brand-primary hover:bg-brand-primary/90">
              <Zap className="w-4 h-4 mr-2" />
              Mint Capsule NFT
            </Button>
          </CardContent>
        </Card>

        {/* Benefits Card */}
        <Card className="bg-brand-surface border-brand-primary shadow-brand-lg">
          <CardHeader>
            <CardTitle className="text-brand-light font-brand flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-accent" />
              NFT Benefits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-brand-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-brand-light text-sm font-medium">Proof of Authenticity</p>
                  <p className="text-brand-light/70 text-xs">Immutable blockchain verification</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-brand-accent rounded-full mt-2"></div>
                <div>
                  <p className="text-brand-light text-sm font-medium">GTT Yield Earning</p>
                  <p className="text-brand-light/70 text-xs">Earn tokens based on grief score</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-brand-warning rounded-full mt-2"></div>
                <div>
                  <p className="text-brand-light text-sm font-medium">OpenSea Integration</p>
                  <p className="text-brand-light/70 text-xs">Trade on major NFT marketplaces</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Showcase */}
      <div className="mt-8 p-6 rounded-capsule bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20">
        <h3 className="text-lg font-semibold text-brand-light font-brand mb-2">
          Premium Brand Experience
        </h3>
        <p className="text-brand-light/80 text-sm mb-4">
          Experience the enhanced GuardianChain visual identity with Guardian Blue accents, 
          premium animations, and institutional-grade styling throughout the platform.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge className="guardian-pulse bg-brand-primary text-white">Guardian Blue</Badge>
          <Badge className="capsule-premium-hover bg-brand-secondary text-brand-light border border-brand-surface">Vault Black</Badge>
          <Badge className="truth-shimmer bg-brand-accent text-white">Veritas Green</Badge>
          <Badge className="bg-brand-warning text-white">Signal Orange</Badge>
        </div>
      </div>
    </Layout>
  );
}