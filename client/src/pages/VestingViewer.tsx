import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Coins, Calendar, TrendingUp } from "lucide-react";

const DISTRIBUTOR_ADDRESS = process.env.NEXT_PUBLIC_GTT_DISTRIBUTOR || "";
const DISTRIBUTOR_ABI = [
  "function vestedAmount() view returns (uint256)",
  "function releasable() view returns (uint256)",
  "function getVestingInfo() view returns (uint256, uint256, uint256, uint256, uint256, uint256)",
  "function release()",
  "function beneficiary() view returns (address)"
];

interface VestingInfo {
  start: number;
  cliff: number;
  duration: number;
  released: string;
  vested: string;
  releasable: string;
}

export default function VestingViewer() {
  const [vestingInfo, setVestingInfo] = useState<VestingInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [isBeneficiary, setIsBeneficiary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]);
        setIsConnected(true);
        await loadVestingInfo();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  const loadVestingInfo = async () => {
    if (!DISTRIBUTOR_ADDRESS || !window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(DISTRIBUTOR_ADDRESS, DISTRIBUTOR_ABI, provider);

      const [start, cliff, duration, released, vested, releasable] = await contract.getVestingInfo();
      const beneficiary = await contract.beneficiary();

      setIsBeneficiary(userAddress.toLowerCase() === beneficiary.toLowerCase());
      
      setVestingInfo({
        start: Number(start),
        cliff: Number(cliff),
        duration: Number(duration),
        released: ethers.formatUnits(released, 18),
        vested: ethers.formatUnits(vested, 18),
        releasable: ethers.formatUnits(releasable, 18)
      });
    } catch (error) {
      console.error("Failed to load vesting info:", error);
    }
  };

  const claimTokens = async () => {
    if (!vestingInfo || !window.ethereum || !isBeneficiary) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(DISTRIBUTOR_ADDRESS, DISTRIBUTOR_ABI, signer);

      const tx = await contract.release();
      await tx.wait();
      
      alert("✅ Tokens claimed successfully!");
      await loadVestingInfo();
    } catch (error) {
      console.error("Failed to claim tokens:", error);
      alert("❌ Failed to claim tokens. Check console for details.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isConnected) {
      loadVestingInfo();
    }
  }, [isConnected, userAddress]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getVestingProgress = () => {
    if (!vestingInfo) return 0;
    const now = Math.floor(Date.now() / 1000);
    if (now < vestingInfo.start) return 0;
    if (now >= vestingInfo.start + vestingInfo.duration) return 100;
    return ((now - vestingInfo.start) / vestingInfo.duration) * 100;
  };

  const timeUntilCliff = () => {
    if (!vestingInfo) return "Unknown";
    const now = Math.floor(Date.now() / 1000);
    if (now >= vestingInfo.cliff) return "Cliff period ended";
    const remaining = vestingInfo.cliff - now;
    const days = Math.floor(remaining / (24 * 60 * 60));
    return `${days} days remaining`;
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">🔐 GTT Founder Vesting Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to view vesting information and claim available tokens.
          </p>
          <Button onClick={connectWallet} size="lg">
            Connect Wallet
          </Button>
        </Card>
      </div>
    );
  }

  if (!vestingInfo) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 text-center">
          <p>Loading vesting information...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          GTT Founder Vesting Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          4-year vesting schedule with 6-month cliff period
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-cyan-400" />
            <div>
              <p className="text-sm text-muted-foreground">Total Vested</p>
              <p className="text-2xl font-bold">{parseFloat(vestingInfo.vested).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">GTT</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm text-muted-foreground">Available to Claim</p>
              <p className="text-2xl font-bold text-green-400">{parseFloat(vestingInfo.releasable).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">GTT</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-muted-foreground">Already Released</p>
              <p className="text-2xl font-bold">{parseFloat(vestingInfo.released).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">GTT</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">Cliff Status</p>
              <p className="text-sm font-bold">{timeUntilCliff()}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Vesting Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Vesting Progress</span>
              <span>{getVestingProgress().toFixed(1)}%</span>
            </div>
            <Progress value={getVestingProgress()} className="h-3" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">{formatDate(vestingInfo.start)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cliff Date</p>
              <p className="font-medium">{formatDate(vestingInfo.cliff)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">End Date</p>
              <p className="font-medium">{formatDate(vestingInfo.start + vestingInfo.duration)}</p>
            </div>
          </div>
        </div>
      </Card>

      {isBeneficiary && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Claim Tokens</h2>
          <p className="text-muted-foreground mb-4">
            You can claim {vestingInfo.releasable} GTT that has vested and is available for release.
          </p>
          <Button 
            onClick={claimTokens} 
            disabled={parseFloat(vestingInfo.releasable) === 0 || isLoading}
            size="lg"
            className="w-full md:w-auto"
          >
            {isLoading ? "Claiming..." : `Claim ${parseFloat(vestingInfo.releasable).toLocaleString()} GTT`}
          </Button>
        </Card>
      )}

      {!isBeneficiary && userAddress && (
        <Card className="p-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <p className="text-yellow-800 dark:text-yellow-200">
            You are not the beneficiary of this vesting contract. Only the founder can claim tokens.
          </p>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Transparency & Fairness</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• 4-year linear vesting ensures long-term commitment</p>
          <p>• 6-month cliff prevents immediate token access</p>
          <p>• All vesting parameters are immutable and transparent</p>
          <p>• Contract source code is verified and publicly auditable</p>
        </div>
      </Card>
    </div>
  );
}