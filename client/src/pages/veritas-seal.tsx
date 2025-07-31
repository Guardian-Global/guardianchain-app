import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, FileText, Stamp, CheckCircle, AlertTriangle, Crown } from "lucide-react";

export default function VeritasSealPage() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    documentType: "evidence",
    importance: "high"
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: "Veritas Seal Requested",
      description: "Your document has been submitted for DocuSign legal verification.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              Veritas Seal
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            DocuSign-powered legal verification for ultimate truth authentication. 
            Create legally binding, notarized truth capsules with enterprise-grade security.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stamp className="w-5 h-5 text-purple-400" />
                Legal Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Document Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="bg-slate-700 border-slate-600"
              />
              <Textarea
                placeholder="Document content to be legally verified..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="bg-slate-700 border-slate-600 min-h-[200px]"
              />
              <div className="flex gap-4">
                <select 
                  className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded"
                  value={formData.documentType}
                  onChange={(e) => setFormData({...formData, documentType: e.target.value})}
                >
                  <option value="evidence">Evidence Document</option>
                  <option value="testimony">Testimony</option>
                  <option value="contract">Legal Contract</option>
                  <option value="disclosure">Truth Disclosure</option>
                </select>
                <select 
                  className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded"
                  value={formData.importance}
                  onChange={(e) => setFormData({...formData, importance: e.target.value})}
                >
                  <option value="critical">Critical</option>
                  <option value="high">High Priority</option>
                  <option value="standard">Standard</option>
                </select>
              </div>
              <Button 
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Request Veritas Seal
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-green-400" />
                Verification Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>DocuSign Legal Binding</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Notarized Authentication</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Blockchain Immutability</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>International Legal Recognition</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Enterprise-Grade Security</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-green-900/20 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">Premium Feature</span>
                </div>
                <p className="text-sm text-slate-300">
                  Veritas Seal requires CREATOR or SOVEREIGN tier subscription. 
                  Upgrade to access DocuSign legal verification.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}