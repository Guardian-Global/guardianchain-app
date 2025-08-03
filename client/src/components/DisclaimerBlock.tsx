import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield, Info } from "lucide-react";

export default function DisclaimerBlock() {
  return (
    <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 mt-8">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-amber-400" />
          <h3 className="text-lg font-semibold text-amber-400">Important Disclosures</h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-400 mb-1">AI Yield Estimates</p>
                <p className="text-muted-foreground">
                  AI yield estimates are advisory insights based on algorithmic patterns, not financial guarantees or valuations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-green-400 mb-1">Content Ownership</p>
                <p className="text-muted-foreground">
                  You retain full custody and sovereign rights to your capsules. GuardianChain cannot access, edit, or delete your content.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-400 mb-1">Revenue Variability</p>
                <p className="text-muted-foreground">
                  GTT yields are variable, not guaranteed, and depend on smart contract logic, DAO funding, and protocol allocation.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-400 mb-1">Data Persistence</p>
                <p className="text-muted-foreground">
                  Long-term persistence depends on decentralized pinning. Users can export/backup their content at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-amber-500/20">
          <p className="text-xs text-muted-foreground">
            GuardianChain is a decentralized protocol. This platform provides interfaces to blockchain infrastructure but does not control your assets or data. 
            Always verify smart contract addresses and maintain your own wallet security.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}