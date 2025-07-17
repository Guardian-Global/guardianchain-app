import { Star, Shield, ExternalLink, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SealStatusProps {
  capsule: {
    id: number;
    status: string;
    docusignEnvelopeId?: string | null;
    veritasSealUrl?: string | null;
    title: string;
  };
}

export default function SealStatus({ capsule }: SealStatusProps) {
  const isSealed = capsule.status === "sealed" && capsule.docusignEnvelopeId;
  
  if (!isSealed) {
    return null;
  }

  return (
    <Card className="border-purple-600/20 bg-purple-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-purple-400">
          <Shield className="h-5 w-5" />
          <span>Veritas Seal Verification</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-purple-600 text-white">
            <Star className="h-3 w-3 mr-1" />
            Sealed with Veritas
          </Badge>
          <div className="flex items-center space-x-1 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Verified Authentic</span>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <p className="text-slate-300">
            This truth capsule has been sealed with DocuSign's Veritas technology, 
            providing legal authenticity and tamper-proof evidence.
          </p>
          <div className="text-slate-400">
            <strong>Envelope ID:</strong> {capsule.docusignEnvelopeId}
          </div>
        </div>

        {capsule.veritasSealUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
            onClick={() => window.open(capsule.veritasSealUrl!, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Veritas Certificate
          </Button>
        )}

        <div className="pt-2 border-t border-slate-700 text-xs text-slate-500">
          This verification provides immutable proof that the content was submitted 
          at the specified time with legal validity through DocuSign's blockchain-backed 
          verification system.
        </div>
      </CardContent>
    </Card>
  );
}