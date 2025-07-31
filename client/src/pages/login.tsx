import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, Rocket, Shield, Star } from "lucide-react";

export default function LoginPage() {
  useEffect(() => {
    // Automatically redirect to Replit Auth after a brief delay
    const timer = setTimeout(() => {
      window.location.href = '/api/login';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginClick = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="bg-slate-800/50 border-slate-700 max-w-md w-full shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full">
              <Shield className="w-12 h-12 text-purple-400" />
            </div>
          </div>
          
          <CardTitle className="text-2xl text-white mb-2">
            Welcome to GUARDIANCHAIN
          </CardTitle>
          <p className="text-slate-300">
            Secure authentication powered by Replit
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Login Benefits */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
              <Rocket className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm font-medium text-white">Start Earning GTT</div>
                <div className="text-xs text-slate-400">Begin your truth verification journey</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
              <Star className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-sm font-medium text-white">Join the Community</div>
                <div className="text-xs text-slate-400">Connect with truth seekers worldwide</div>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={handleLoginClick}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Continue with Replit Auth
          </Button>

          {/* Auto-redirect message */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Redirecting automatically in 2 seconds...
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex justify-center gap-4 text-xs">
            <a href="/terms" className="text-slate-400 hover:text-white">
              Terms of Service
            </a>
            <a href="/privacy" className="text-slate-400 hover:text-white">
              Privacy Policy
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}