import React, { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CAPSULE_FACTORY_V2_ABI, getContractAddress } from "@/lib/contracts";
import { VERITUS_NODE, BRAND_COLORS } from "@/lib/constants";
import { Shield, CheckCircle, TrendingUp, Loader2, AlertTriangle } from "lucide-react";

export default function VeritusNodePanel() {
  const { address, chainId } = useAccount();
  const { toast } = useToast();
  
  const [capsuleId, setCapsuleId] = useState<number>(0);
  const [yieldValue, setYieldValue] = useState<number>(0);

  const { writeContract: writeSeal, data: sealHash, isPending: isSealPending } = useWriteContract();
  const { writeContract: writeYield, data: yieldHash, isPending: isYieldPending } = useWriteContract();
  
  const { isLoading: isSealConfirming } = useWaitForTransactionReceipt({
    hash: sealHash,
  });
  
  const { isLoading: isYieldConfirming } = useWaitForTransactionReceipt({
    hash: yieldHash,
  });

  const isVeritus = address?.toLowerCase() === VERITUS_NODE.toLowerCase();
  const isLoading = isSealPending || isYieldPending || isSealConfirming || isYieldConfirming;

  const handleSealCapsule = () => {
    if (!address || !chainId || capsuleId <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid capsule ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const factoryAddress = getContractAddress(chainId, 'factoryV2') as `0x${string}`;
      
      writeSeal({
        address: factoryAddress,
        abi: CAPSULE_FACTORY_V2_ABI,
        functionName: 'sealCapsule',
        args: [BigInt(capsuleId)],
      });

      toast({
        title: "Sealing Capsule",
        description: `Processing seal for Capsule #${capsuleId}...`,
      });
    } catch (error) {
      console.error('Error sealing capsule:', error);
      toast({
        title: "Sealing Failed",
        description: "Failed to seal capsule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAssignYield = () => {
    if (!address || !chainId || capsuleId <= 0 || yieldValue <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid capsule ID and yield value",
        variant: "destructive",
      });
      return;
    }

    try {
      const factoryAddress = getContractAddress(chainId, 'factoryV2') as `0x${string}`;
      
      writeYield({
        address: factoryAddress,
        abi: CAPSULE_FACTORY_V2_ABI,
        functionName: 'assignYield',
        args: [BigInt(capsuleId), BigInt(yieldValue)],
      });

      toast({
        title: "Assigning Yield",
        description: `Processing yield assignment for Capsule #${capsuleId}...`,
      });
    } catch (error) {
      console.error('Error assigning yield:', error);
      toast({
        title: "Yield Assignment Failed",
        description: "Failed to assign yield. Please try again.",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    if (sealHash && !isSealConfirming && !isSealPending) {
      toast({
        title: "Capsule Sealed Successfully!",
        description: `Capsule #${capsuleId} has been sealed and verified.`,
      });
    }
  }, [sealHash, isSealConfirming, isSealPending, capsuleId, toast]);

  React.useEffect(() => {
    if (yieldHash && !isYieldConfirming && !isYieldPending) {
      toast({
        title: "Yield Assigned Successfully!",
        description: `Emotional yield of ${yieldValue} assigned to Capsule #${capsuleId}.`,
      });
    }
  }, [yieldHash, isYieldConfirming, isYieldPending, capsuleId, yieldValue, toast]);

  if (!isVeritus) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Access Denied</h3>
              <p className="text-sm text-slate-400">
                Only the Veritus node may use this admin panel.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Current Veritus: {VERITUS_NODE}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="w-5 h-5" style={{ color: BRAND_COLORS.GUARDIAN }} />
          Veritus Admin Panel
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="border-green-500/30 text-green-400 bg-green-500/10"
          >
            Authenticated
          </Badge>
          <span className="text-xs text-slate-400">
            CapsuleFactoryV2 Control Center
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Capsule ID Input */}
        <div className="space-y-2">
          <Label htmlFor="capsuleId" className="text-white">Capsule ID</Label>
          <Input
            id="capsuleId"
            type="number"
            value={capsuleId || ''}
            onChange={(e) => setCapsuleId(parseInt(e.target.value) || 0)}
            placeholder="Enter capsule ID..."
            className="bg-slate-700/50 border-slate-600 text-white"
            min="1"
          />
        </div>

        {/* Seal Capsule Section */}
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <h3 className="flex items-center gap-2 text-white font-medium mb-3">
            <CheckCircle className="w-4 h-4" />
            Seal Verification
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Verify and seal a capsule after content review. This marks the capsule as authentic.
          </p>
          <Button
            onClick={handleSealCapsule}
            disabled={isLoading || capsuleId <= 0}
            className="w-full"
            style={{ 
              backgroundColor: BRAND_COLORS.CHAIN,
              color: 'white'
            }}
          >
            {isSealPending || isSealConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isSealPending ? 'Sealing...' : 'Confirming...'}
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Seal Capsule
              </>
            )}
          </Button>
        </div>

        {/* Yield Assignment Section */}
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <h3 className="flex items-center gap-2 text-white font-medium mb-3">
            <TrendingUp className="w-4 h-4" />
            Yield Assignment
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Assign final emotional yield value after capsule review and analysis.
          </p>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="yieldValue" className="text-white">Yield Value</Label>
              <Input
                id="yieldValue"
                type="number"
                value={yieldValue || ''}
                onChange={(e) => setYieldValue(parseInt(e.target.value) || 0)}
                placeholder="Enter yield value..."
                className="bg-slate-700/50 border-slate-600 text-white"
                min="1"
                max="10000"
              />
              <p className="text-xs text-slate-500">
                Recommended range: 50-500 for most capsules, 500+ for exceptional content
              </p>
            </div>
            
            <Button
              onClick={handleAssignYield}
              disabled={isLoading || capsuleId <= 0 || yieldValue <= 0}
              className="w-full"
              style={{ 
                backgroundColor: BRAND_COLORS.GUARDIAN,
                color: 'white'
              }}
            >
              {isYieldPending || isYieldConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isYieldPending ? 'Assigning...' : 'Confirming...'}
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Assign Yield
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="text-xs text-slate-500 p-3 bg-slate-700/20 rounded border border-slate-600">
          <strong>Workflow:</strong>
          <ol className="mt-1 ml-4 list-decimal space-y-1">
            <li>User creates capsule with CapsuleCreator</li>
            <li>You review content and seal if authentic</li>
            <li>You assign final emotional yield value</li>
            <li>Capsule becomes available for yield claiming</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}