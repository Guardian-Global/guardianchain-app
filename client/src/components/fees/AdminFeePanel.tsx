import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { Settings, UserX, RefreshCw, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { getContractAddress, CONTRACT_ABIS } from "@/lib/contracts";
import { useChainId } from "wagmi";

export default function AdminFeePanel() {
  const [userAddress, setUserAddress] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [newFeeAmount, setNewFeeAmount] = useState("");
  const [isSettingFee, setIsSettingFee] = useState(false);

  const chainId = useChainId();
  const { address } = useAccount();
  const { toast } = useToast();

  const feeManagerAddress = getContractAddress(chainId, "feeManager");

  const { writeContract, isPending } = useWriteContract();

  const resetUserFee = async () => {
    if (!userAddress || !selectedAction) {
      toast({
        title: "Missing Information",
        description: "Please enter user address and select an action",
        variant: "destructive",
      });
      return;
    }

    try {
      writeContract({
        address: feeManagerAddress as `0x${string}`,
        abi: CONTRACT_ABIS.FeeManager,
        functionName: "resetFee",
        args: [userAddress, selectedAction],
      });

      toast({
        title: "Fee Reset Initiated",
        description: `Resetting ${selectedAction} fee for ${userAddress.slice(
          0,
          6,
        )}...${userAddress.slice(-4)}`,
      });
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset user fee",
        variant: "destructive",
      });
    }
  };

  const updateFee = async () => {
    if (!selectedAction || !newFeeAmount) {
      toast({
        title: "Missing Information",
        description: "Please select action and enter new fee amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const feeInWei = BigInt(parseFloat(newFeeAmount) * 1e18);

      writeContract({
        address: feeManagerAddress as `0x${string}`,
        abi: CONTRACT_ABIS.FeeManager,
        functionName: "setFee",
        args: [selectedAction, feeInWei],
      });

      toast({
        title: "Fee Update Initiated",
        description: `Setting ${selectedAction} fee to ${newFeeAmount} GTT`,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update fee",
        variant: "destructive",
      });
    }
  };

  if (!address) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">
            Connect your wallet to access admin controls
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-red-700/30 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <Settings className="h-5 w-5" />
          Admin Fee Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-red-700 bg-red-900/20">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-red-300">
            ⚠️ Admin functions require treasury privileges. Only authorized
            addresses can execute these operations.
          </AlertDescription>
        </Alert>

        {/* Reset User Fee Section */}
        <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <UserX className="h-4 w-4" />
            Reset User Fee
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">User Address</Label>
              <Input
                placeholder="0x..."
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-300">Action Type</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mint">NFT Minting</SelectItem>
                  <SelectItem value="seal">Capsule Sealing</SelectItem>
                  <SelectItem value="proposal">DAO Proposal</SelectItem>
                  <SelectItem value="verification">
                    Content Verification
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={resetUserFee}
            disabled={isPending || !userAddress || !selectedAction}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Resetting Fee...
              </>
            ) : (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Reset User Fee
              </>
            )}
          </Button>
        </div>

        {/* Update Fee Structure Section */}
        <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Update Fee Structure
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Action Type</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mint">NFT Minting</SelectItem>
                  <SelectItem value="seal">Capsule Sealing</SelectItem>
                  <SelectItem value="proposal">DAO Proposal</SelectItem>
                  <SelectItem value="verification">
                    Content Verification
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-300">New Fee (GTT)</Label>
              <Input
                type="number"
                placeholder="50"
                value={newFeeAmount}
                onChange={(e) => setNewFeeAmount(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <Button
            onClick={updateFee}
            disabled={isPending || !selectedAction || !newFeeAmount}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Updating Fee...
              </>
            ) : (
              <>
                <Settings className="mr-2 h-4 w-4" />
                Update Fee Structure
              </>
            )}
          </Button>
        </div>

        {/* Current Status */}
        <div className="text-xs text-slate-500 text-center">
          Contract:{" "}
          {feeManagerAddress
            ? `${feeManagerAddress.slice(0, 6)}...${feeManagerAddress.slice(
                -4,
              )}`
            : "Not deployed"}
        </div>
      </CardContent>
    </Card>
  );
}
