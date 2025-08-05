import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Users, Lock, Zap } from "lucide-react";

const SimpleLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-hsl(180,100%,90%) mb-4">
            Welcome to GuardianChain
          </h1>
          <p className="text-xl text-hsl(180,100%,90%)/70 mb-8">
            Secure Truth Vault Capsule Platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-hsl(218,54%,9%)/80 backdrop-blur-xl border-hsl(180,100%,90%)/20">
            <CardHeader>
              <CardTitle className="text-hsl(180,100%,90%) flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Secure Truth Capsules
              </CardTitle>
              <CardDescription className="text-hsl(180,100%,90%)/70">
                Create time-locked truth capsules with blockchain verification
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-hsl(218,54%,9%)/80 backdrop-blur-xl border-hsl(180,100%,90%)/20">
            <CardHeader>
              <CardTitle className="text-hsl(180,100%,90%) flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                GTT Token Rewards
              </CardTitle>
              <CardDescription className="text-hsl(180,100%,90%)/70">
                Earn GTT tokens through truth verification and community engagement
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Link href="/auth/signup">
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 py-3"
                data-testid="button-signup"
              >
                Create Account
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button 
                variant="outline" 
                className="border-hsl(180,100%,90%)/20 text-hsl(180,100%,90%) hover:bg-hsl(180,100%,90%)/10 px-8 py-3"
                data-testid="button-login"
              >
                Sign In
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-hsl(180,100%,90%)/50">
            Authentication required to access all features
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLanding;