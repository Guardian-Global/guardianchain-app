import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, ArrowLeft, Crown } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <CardTitle className="text-xl text-white">
            Access Restricted
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-slate-300 mb-6">
            You need higher tier access to view this content. Upgrade your
            account to unlock premium GUARDIANCHAIN features.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-300">Current Access</span>
              <span className="text-blue-400 font-medium">Explorer</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-300">Required Access</span>
              <div className="flex items-center text-yellow-400 font-medium">
                <Crown className="w-4 h-4 mr-1" />
                Creator+
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/">
              <Button
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link href="/upgrade">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Access
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
