import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  Shield,
  RotateCcw,
  Settings,
  Heart,
  Star,
  User,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useMascot } from "./MascotProvider";

export default function MascotSettings() {
  const {
    startOnboarding,
    isOnboardingComplete,
    mascotEnabled,
    setMascotEnabled,
  } = useMascot();

  const completedDate = localStorage.getItem("onboarding_completed_date");
  const formattedDate = completedDate 
    ? new Date(completedDate).toLocaleDateString()
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            Guardian Assistant Settings
          </CardTitle>
          <CardDescription>
            Manage your onboarding mascot and tutorial preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mascot Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Guardian Assistant</span>
                <Badge variant={mascotEnabled ? "default" : "secondary"}>
                  {mascotEnabled ? "Active" : "Disabled"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Show the helpful Guardian mascot for onboarding and tips
              </p>
            </div>
            <Switch
              checked={mascotEnabled}
              onCheckedChange={setMascotEnabled}
            />
          </div>

          <Separator />

          {/* Onboarding Status */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Onboarding Status
            </h3>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tutorial Completion</span>
                <Badge variant={isOnboardingComplete ? "default" : "secondary"}>
                  {isOnboardingComplete ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Complete
                    </>
                  ) : (
                    "Pending"
                  )}
                </Badge>
              </div>

              {isOnboardingComplete && formattedDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completed on</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formattedDate}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Actions
            </h3>
            
            <div className="grid gap-3">
              <Button
                onClick={startOnboarding}
                variant="outline"
                className="w-full justify-start"
                disabled={!mascotEnabled}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isOnboardingComplete ? "Restart Tutorial" : "Start Tutorial"}
              </Button>

              <Button
                onClick={() => {
                  localStorage.removeItem("onboarding_completed");
                  localStorage.removeItem("onboarding_completed_date");
                  window.location.reload();
                }}
                variant="outline"
                className="w-full justify-start text-muted-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All Progress
              </Button>
            </div>
          </div>

          <Separator />

          {/* Info */}
          <div className="bg-gradient-to-r from-purple-50 to-green-50 dark:from-purple-950/20 dark:to-green-950/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-purple-500 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-sm">About Guardian</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Guardian is your friendly AI assistant designed to help new users 
                  navigate GUARDIANCHAIN's features. The interactive tutorial covers 
                  profile setup, capsule creation, verification, earning tokens, and 
                  advanced features. You can restart the tour anytime!
                </p>
                <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                  <Star className="h-3 w-3" />
                  Made with care by the GUARDIANCHAIN team
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}