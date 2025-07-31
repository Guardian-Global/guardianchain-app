import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Rocket, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function LoginSuccessPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Auto-redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      setLocation('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  const handleContinue = () => {
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="bg-slate-800/50 border-slate-700 max-w-md w-full shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>
          
          <CardTitle className="text-2xl text-white mb-2">
            Welcome to GUARDIANCHAIN!
          </CardTitle>
          <p className="text-slate-300">
            Authentication successful. Setting up your account...
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Success Message */}
          <div className="text-center space-y-2">
            <p className="text-green-400 font-medium">Login Successful!</p>
            <p className="text-slate-400 text-sm">
              You're now part of the truth verification revolution
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
              <Rocket className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm font-medium text-white">Start Your Journey</div>
                <div className="text-xs text-slate-400">Create your first truth capsule</div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={handleContinue}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Continue to Dashboard
          </Button>

          {/* Auto-redirect message */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Redirecting automatically in 3 seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}