import React from 'react';
import { useState } from "react";
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Shield, 
  Brain, 
  Lock, 
  Calendar, 
  User, 
  CheckCircle, 
  Loader2,
  Scroll,
  Sparkles
} from 'lucide-react';

export default function EternalContracts() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Form state
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [contractTitle, setContractTitle] = useState("");
  
  // UI state
  const [verifying, setVerifying] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [verified, setVerified] = useState(false);
  const [published, setPublished] = useState(false);

  // AI Verification
  const verifyContract = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai/verify-contract', {
        content,
        title: contractTitle
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSummary(data.summary);
      setVerified(true);
      toast({
        title: "Contract Verified",
        description: "AI has analyzed your eternal declaration.",
      });
    },
    onError: (error) => {
      console.error('Verification failed:', error);
      toast({
        title: "Verification Failed",
        description: "Could not verify contract. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Publish Contract
  const publishContract = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/capsule/publish-contract', {
        title: contractTitle,
        content,
        summary,
        author: (user as any)?.email || 'anonymous',
        beneficiary: beneficiary || null,
        unlockDate: unlockDate || null,
        contractType: 'eternal_declaration',
        metadata: {
          wordCount: content.split(' ').length,
          hasVerification: verified,
          hasBeneficiary: !!beneficiary,
          hasUnlockDate: !!unlockDate
        }
      });
      return response.json();
    },
    onSuccess: (data) => {
      setPublished(true);
      queryClient.invalidateQueries({ queryKey: ['/api/contracts/recent'] });
      toast({
        title: "Contract Sealed Forever",
        description: `Your eternal declaration has been permanently recorded on-chain.`,
      });
    },
    onError: (error) => {
      console.error('Publishing failed:', error);
      toast({
        title: "Publishing Failed",
        description: "Could not seal your contract. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleVerify = () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please write your eternal declaration first.",
        variant: "destructive"
      });
      return;
    }
    verifyContract.mutate();
  };

  const handlePublish = () => {
    if (!content.trim() || !contractTitle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for your eternal contract.",
        variant: "destructive"
      });
      return;
    }
    publishContract.mutate();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <Card className="max-w-md bg-black/40 backdrop-blur-xl border-purple-500/20">
          <CardContent className="text-center py-8">
            <Lock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-purple-300 mb-2">Authentication Required</h2>
            <p className="text-gray-300 mb-4">You must be logged in to create eternal contracts.</p>
            <Button onClick={() => setLocation('/login')} className="bg-purple-600 hover:bg-purple-700">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Eternal Contracts
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Write permanent declarations. Use AI to verify clarity. Seal with cryptographic certainty.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                <Scroll className="w-3 h-3 mr-1" />
                Immutable
              </Badge>
              <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
              <Badge variant="outline" className="border-green-500/30 text-green-300">
                <Lock className="w-3 h-3 mr-1" />
                Eternal
              </Badge>
            </div>
          </div>

          {published ? (
            /* Success State */
            <Card className="bg-green-900/20 border-green-500/30">
              <CardContent className="text-center py-12">
                <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-green-300 mb-4">
                  Contract Sealed Forever
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  Your eternal declaration has been permanently recorded on the blockchain.
                  It will exist as long as the network survives.
                </p>
                <div className="space-x-4">
                  <Button
                    onClick={() => setLocation('/dashboard')}
                    variant="outline"
                    className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                  >
                    View Dashboard
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Create Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Contract Creation Form */
            <div className="space-y-6">
              
              {/* Contract Title */}
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-300 flex items-center">
                    <Scroll className="w-6 h-6 mr-2" />
                    Contract Declaration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-lg font-medium text-purple-300">
                      Title
                    </Label>
                    <Input
                      placeholder="Give your eternal contract a powerful title..."
                      value={contractTitle}
                      onChange={(e) => setContractTitle(e.target.value)}
                      className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400 text-lg"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-lg font-medium text-purple-300">
                      Contract Content
                    </Label>
                    <Textarea
                      rows={12}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your unchangeable truth here...

Examples:
• Personal declarations of values and principles
• Commitments to future generations
• Testimony that must be preserved
• Instructions for inheritance or legacy
• Promises that transcend time"
                      className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400 min-h-[300px]"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      {content.split(' ').filter(word => word.length > 0).length} words
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* AI Verification */}
              <Card className="bg-black/40 backdrop-blur-xl border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-300 flex items-center justify-between">
                    <div className="flex items-center">
                      <Brain className="w-6 h-6 mr-2" />
                      AI Veritas Check
                    </div>
                    <Button
                      onClick={handleVerify}
                      disabled={verifyContract.isPending || !content.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {verifyContract.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Verify Contract
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                
                {summary && (
                  <CardContent>
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <Label className="text-blue-300 font-medium">AI Analysis Summary</Label>
                      <p className="text-gray-200 whitespace-pre-wrap mt-2">{summary}</p>
                      <Badge className="mt-3 bg-green-500/20 text-green-300 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Contract Configuration */}
              <Card className="bg-black/40 backdrop-blur-xl border-gray-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-300">
                    Optional Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-lg font-medium text-gray-300 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Unlock Date (Optional)
                      </Label>
                      <Input
                        type="datetime-local"
                        value={unlockDate}
                        onChange={(e) => setUnlockDate(e.target.value)}
                        className="bg-slate-800/50 border-gray-500/30 text-white"
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        Contract will be sealed immediately but can specify when it becomes publicly readable
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-lg font-medium text-gray-300 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Beneficiary ENS or Wallet
                      </Label>
                      <Input
                        placeholder="0x... or username.eth"
                        value={beneficiary}
                        onChange={(e) => setBeneficiary(e.target.value)}
                        className="bg-slate-800/50 border-gray-500/30 text-white placeholder:text-gray-400"
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        Who can access this contract (leave empty for public)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seal Contract */}
              <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                <CardContent className="pt-6">
                  <Button
                    onClick={handlePublish}
                    disabled={publishContract.isPending || !content.trim() || !contractTitle.trim()}
                    className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-lg py-6"
                  >
                    {publishContract.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Sealing Contract Forever...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-3" />
                        🔒 Seal Permanently to GuardianChain
                      </>
                    )}
                  </Button>
                  
                  <p className="text-center text-gray-400 text-sm mt-4">
                    Warning: This action cannot be undone. Your contract will be permanently recorded on the blockchain.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}