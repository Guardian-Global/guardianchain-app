import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Gift, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTierContext } from "@/context/TierContext";

export default function ReferralsPage() {
  const { userRole } = useTierContext();
  const { toast } = useToast();
  const [referralCode] = useState("GUARDIAN2025");
  
  const isPro = userRole === "pro" || userRole === "enterprise";

  const copyReferralLink = () => {
    const link = `https://guardianchain.replit.app/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <Gift className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <CardTitle className="text-2xl text-white">Referral Program</CardTitle>
              <CardDescription className="text-slate-300">
                Earn rewards by inviting friends to GUARDIANCHAIN
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="p-6 bg-slate-700/30 rounded-lg border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-2">Pro Feature Required</h3>
                <p className="text-slate-300 mb-4">
                  Unlock the referral program with Pro membership and earn GTT tokens for every successful referral.
                </p>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <a href="/upgrade">Upgrade to Pro</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto pt-20 space-y-6">
        {/* Header */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <Gift className="w-16 h-16 mx-auto text-purple-400 mb-4" />
            <CardTitle className="text-3xl text-white">Referral Program</CardTitle>
            <CardDescription className="text-slate-300">
              Earn 50 GTT tokens for every Pro subscription you refer
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Referral Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-sm text-slate-400">Total Referrals</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto text-green-400 mb-2" />
              <div className="text-2xl font-bold text-white">600</div>
              <div className="text-sm text-slate-400">GTT Earned</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Gift className="w-8 h-8 mx-auto text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-sm text-slate-400">Pro Conversions</div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Your Referral Link</CardTitle>
            <CardDescription className="text-slate-300">
              Share this link to earn rewards when friends upgrade to Pro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={`https://guardianchain.replit.app/signup?ref=${referralCode}`}
                readOnly
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button onClick={copyReferralLink} variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="secondary">Your Code: {referralCode}</Badge>
              <Badge variant="outline" className="text-green-400 border-green-400">
                50 GTT per Pro conversion
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-white font-semibold mb-1">Share Link</h3>
                <p className="text-slate-400 text-sm">Send your referral link to friends</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-white font-semibold mb-1">They Upgrade</h3>
                <p className="text-slate-400 text-sm">Friends sign up and upgrade to Pro</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-white font-semibold mb-1">Earn GTT</h3>
                <p className="text-slate-400 text-sm">Receive 50 GTT tokens instantly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}