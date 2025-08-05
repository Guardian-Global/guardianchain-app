import React from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Users, Globe, Award } from "lucide-react";
import { Link } from "wouter";

interface SectionData {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  icon: React.ComponentType<any>;
}

const sections: Record<string, SectionData> = {
  "truth-verification": {
    id: "truth-verification",
    title: "Truth Verification Protocol",
    description: "Advanced blockchain-based truth verification system",
    icon: Shield,
    content: (
      <div className="space-y-8">
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted-foreground">
            Our truth verification protocol uses advanced cryptographic methods 
            to ensure the integrity and authenticity of digital content.
          </p>
          <h3 className="text-2xl font-bold text-primary">Key Features</h3>
          <ul className="space-y-2">
            <li>Immutable blockchain timestamping</li>
            <li>AI-powered content analysis</li>
            <li>Community-based verification</li>
            <li>Enterprise-grade security</li>
          </ul>
        </div>
      </div>
    )
  },
  "community": {
    id: "community",
    title: "Guardian Community",
    description: "Join our global network of truth guardians",
    icon: Users,
    content: (
      <div className="space-y-8">
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted-foreground">
            Be part of a worldwide community dedicated to preserving and 
            verifying digital truth across all platforms.
          </p>
          <h3 className="text-2xl font-bold text-primary">Community Benefits</h3>
          <ul className="space-y-2">
            <li>Earn GTT tokens for verification work</li>
            <li>Access to exclusive guardian tools</li>
            <li>Voting rights in platform governance</li>
            <li>Recognition and reputation building</li>
          </ul>
        </div>
      </div>
    )
  },
  "global-network": {
    id: "global-network",
    title: "Global Truth Network",
    description: "Worldwide infrastructure for truth preservation",
    icon: Globe,
    content: (
      <div className="space-y-8">
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted-foreground">
            Our global network spans 150+ countries, providing 24/7 truth 
            verification and preservation services.
          </p>
          <h3 className="text-2xl font-bold text-primary">Network Features</h3>
          <ul className="space-y-2">
            <li>99.99% uptime guarantee</li>
            <li>Multi-regional data redundancy</li>
            <li>Real-time global synchronization</li>
            <li>Regulatory compliance worldwide</li>
          </ul>
        </div>
      </div>
    )
  },
  "enterprise": {
    id: "enterprise",
    title: "Enterprise Solutions",
    description: "Scalable truth verification for Fortune 500 companies",
    icon: Award,
    content: (
      <div className="space-y-8">
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted-foreground">
            Custom enterprise solutions designed for large-scale truth 
            verification and compliance requirements.
          </p>
          <h3 className="text-2xl font-bold text-primary">Enterprise Features</h3>
          <ul className="space-y-2">
            <li>Custom API integrations</li>
            <li>Dedicated support team</li>
            <li>Advanced analytics dashboard</li>
            <li>White-label solutions available</li>
          </ul>
        </div>
      </div>
    )
  }
};

export default function SectionPage() {
  const [, params] = useRoute("/section/:id");
  const sectionId = params?.id;
  
  const section = sectionId ? sections[sectionId] : null;

  if (!section) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Section Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The section you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const IconComponent = section.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="bg-secondary/50">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/20">
                <IconComponent className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-primary mb-4">
              {section.title}
            </CardTitle>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {section.description}
            </p>
          </CardHeader>
          
          <CardContent className="pt-0">
            {section.content}
            
            <div className="mt-12 text-center">
              <Button size="lg" className="bg-primary hover:bg-primary/80">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}