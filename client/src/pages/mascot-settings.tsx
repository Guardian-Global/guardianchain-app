import React from "react";
import MascotSettings from "@/components/mascot/MascotSettings";
import { MascotTrigger } from "@/components/mascot/OnboardingMascot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowLeft,
  Play,
  Shield,
  Heart,
  Star,
  Users,
  Target,
  Coins,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Link } from "wouter";

const TOUR_HIGHLIGHTS = [
  {
    title: "Profile Setup",
    description: "Complete your digital identity and choose your tier",
    icon: <Users className="h-4 w-4" />,
    color: "bg-blue-500",
  },
  {
    title: "Create Capsules",
    description: "Submit content for truth verification",
    icon: <Shield className="h-4 w-4" />,
    color: "bg-green-500",
  },
  {
    title: "Verify Content",
    description: "Help build our verified knowledge base",
    icon: <Target className="h-4 w-4" />,
    color: "bg-purple-500",
  },
  {
    title: "Earn Tokens",
    description: "Get rewarded for quality contributions",
    icon: <Coins className="h-4 w-4" />,
    color: "bg-yellow-500",
  },
  {
    title: "Advanced Features",
    description: "Discover AI tools, analytics, and more",
    icon: <Zap className="h-4 w-4" />,
    color: "bg-orange-500",
  },
];

export default function MascotSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/profile">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-purple-500" />
              Guardian Assistant
            </h1>
            <p className="text-muted-foreground">
              Your friendly guide to GUARDIANCHAIN features
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="lg:col-span-2">
          <MascotSettings />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Play className="h-5 w-5 text-green-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <MascotTrigger className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Start Guided Tour
              </MascotTrigger>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/profile">
                  <Users className="h-4 w-4 mr-2" />
                  Complete Profile
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/create-capsule">
                  <Shield className="h-4 w-4 mr-2" />
                  Create First Capsule
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tour Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-yellow-500" />
                What You'll Learn
              </CardTitle>
              <CardDescription>
                Guardian covers all the essentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TOUR_HIGHLIGHTS.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`${item.color} rounded-full p-1.5 text-white`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fun Facts */}
          <Card className="bg-gradient-to-br from-purple-50 to-green-50 dark:from-purple-950/20 dark:to-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-red-500" />
                About Guardian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Interactive step-by-step guidance
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Helpful tips and best practices
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Can be restarted anytime
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Covers all platform features
                </p>
              </div>
              
              <Separator />
              
              <div className="text-xs text-center text-muted-foreground">
                <p>Guardian makes onboarding fun and easy!</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  <span>Made with care by GUARDIANCHAIN</span>
                  <Sparkles className="h-3 w-3 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}