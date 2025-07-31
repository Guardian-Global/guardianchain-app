import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, DollarSign, Scale, MessageCircle, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { BRAND_COLORS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";

interface TruthRedemptionProps {
  capsuleId?: string;
  onRedemptionCreated?: (redemptionData: any) => void;
}

export default function TruthRedemption({ capsuleId, onRedemptionCreated }: TruthRedemptionProps) {
  const { toast } = useToast();
  const [redemptionType, setRedemptionType] = useState("public_apology");
  const [targetIndividual, setTargetIndividual] = useState("");
  const [description, setDescription] = useState("");
  const [compensationAmount, setCompensationAmount] = useState("");
  const [publicStatement, setPublicStatement] = useState("");

  const redemptionTypes = [
    { value: "public_apology", label: "Public Apology", icon: MessageCircle, color: "text-blue-400" },
    { value: "financial_compensation", label: "Financial Compensation", icon: DollarSign, color: "text-green-400" },
    { value: "legal_acknowledgment", label: "Legal Acknowledgment", icon: Scale, color: "text-purple-400" },
    { value: "restorative_action", label: "Restorative Action", icon: Heart, color: "text-red-400" },
  ];

  // Fetch active redemption requests
  const { data: activeRedemptions } = useQuery({
    queryKey: ["/api/truth-redemption/active"],
    retry: false,
  });

  const createRedemptionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/truth-redemption", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Truth Redemption Initiated",
        description: "Redemption request has been created and published.",
      });
      onRedemptionCreated?.(data);
      // Reset form
      setTargetIndividual("");
      setDescription("");
      setCompensationAmount("");
      setPublicStatement("");
    },
    onError: (error: any) => {
      toast({
        title: "Redemption Creation Failed",
        description: error.message || "Failed to create truth redemption.",
        variant: "destructive",
      });
    },
  });

  const handleCreateRedemption = () => {
    if (!targetIndividual.trim() || !description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createRedemptionMutation.mutate({
      capsuleId: capsuleId || null,
      redemptionType,
      targetIndividual: targetIndividual.trim(),
      description: description.trim(),
      compensationAmount: compensationAmount ? parseFloat(compensationAmount) : null,
      publicStatement: publicStatement.trim() || null,
    });
  };

  const selectedType = redemptionTypes.find(type => type.value === redemptionType);
  const IconComponent = selectedType?.icon || MessageCircle;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Truth Redemption</h1>
        <p className="text-slate-400">
          Facilitate public acknowledgment and reparations for disclosed truths
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Redemption */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Heart className="w-5 h-5" style={{ color: BRAND_COLORS.CHAIN }} />
              Create Truth Redemption
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Redemption Type</label>
              <div className="grid grid-cols-2 gap-2">
                {redemptionTypes.map((type) => {
                  const TypeIcon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setRedemptionType(type.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        redemptionType === type.value
                          ? "border-purple-600 bg-purple-600/20"
                          : "border-slate-600 bg-slate-700/30 hover:bg-slate-700/50"
                      }`}
                    >
                      <TypeIcon className={`w-4 h-4 mb-1 ${type.color}`} />
                      <div className="text-sm font-medium text-white">{type.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Target Individual/Entity *</label>
              <Input
                value={targetIndividual}
                onChange={(e) => setTargetIndividual(e.target.value)}
                placeholder="Name of person or organization being addressed"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the truth disclosed and what redemption is being sought..."
                className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
              />
            </div>

            {redemptionType === "financial_compensation" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Compensation Amount (USD)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={compensationAmount}
                  onChange={(e) => setCompensationAmount(e.target.value)}
                  placeholder="Amount of financial compensation sought"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Public Statement (Optional)</label>
              <Textarea
                value={publicStatement}
                onChange={(e) => setPublicStatement(e.target.value)}
                placeholder="Draft a public statement that would satisfy the redemption..."
                className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
              />
            </div>

            <Button
              onClick={handleCreateRedemption}
              disabled={createRedemptionMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {createRedemptionMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Redemption...
                </>
              ) : (
                <>
                  <IconComponent className="w-4 h-4 mr-2" />
                  Create Truth Redemption
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Active Redemptions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Scale className="w-5 h-5" style={{ color: BRAND_COLORS.CHAIN }} />
              Active Redemptions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mock active redemptions */}
            {[
              {
                id: "1",
                type: "public_apology",
                target: "MegaCorp Industries",
                description: "Environmental damage cover-up",
                status: "pending",
                daysActive: 3,
              },
              {
                id: "2",
                type: "financial_compensation",
                target: "Dr. Sarah Chen",
                description: "Research fraud exposure",
                status: "acknowledged",
                daysActive: 7,
                amount: 50000,
              },
              {
                id: "3",
                type: "restorative_action",
                target: "City Council",
                description: "Corruption disclosure",
                status: "in_progress",
                daysActive: 14,
              },
            ].map((redemption) => {
              const typeInfo = redemptionTypes.find(t => t.value === redemption.type);
              const StatusIcon = typeInfo?.icon || MessageCircle;
              
              return (
                <Card key={redemption.id} className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${typeInfo?.color}`} />
                        <h3 className="font-semibold text-white text-sm">{redemption.target}</h3>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${
                          redemption.status === "acknowledged" ? "text-green-400 border-green-600" :
                          redemption.status === "in_progress" ? "text-blue-400 border-blue-600" :
                          "text-yellow-400 border-yellow-600"
                        }`}
                      >
                        {redemption.status.replace("_", " ")}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-slate-400 mb-2">{redemption.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{typeInfo?.label}</span>
                      <span>{redemption.daysActive} days active</span>
                    </div>

                    {redemption.amount && (
                      <div className="mt-2 text-xs text-green-400">
                        Compensation: ${redemption.amount.toLocaleString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            <Button variant="outline" className="w-full border-slate-600 text-slate-300">
              View All Redemptions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">How Truth Redemption Works</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="font-semibold text-white">1. Truth Disclosed</h3>
            <p className="text-sm text-slate-400">Truth capsule reveals wrongdoing or harm</p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">2. Redemption Requested</h3>
            <p className="text-sm text-slate-400">Affected parties request appropriate response</p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white">3. Public Visibility</h3>
            <p className="text-sm text-slate-400">Redemption request becomes publicly visible</p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white">4. Resolution</h3>
            <p className="text-sm text-slate-400">Acknowledgment and reparations provided</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}