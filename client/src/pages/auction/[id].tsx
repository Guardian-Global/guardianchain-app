import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";
import 'react-toastify/dist/ReactToastify.css';

// Mock contract address - replace with actual deployed contract
const AUCTION_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
const AUCTION_ABI = [
  {
    "inputs": [
      {"name": "auctionId", "type": "uint256"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "fundAuction",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function useCountdown(targetDate: number) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, targetDate - now);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, timeLeft };
}

export default function AuctionViewPage() {
  const [match, params] = useRoute("/auction/:id");
  const auctionId = params?.id;
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [funding, setFunding] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("100");
  const [disclosureContent, setDisclosureContent] = useState<string | null>(null);
  
  const { address, isConnected } = useAccount();
  const { days, hours, minutes, seconds, timeLeft } = useCountdown(auction?.expiresAt || 0);

  // Smart contract interaction setup
  const { config: contractConfig } = usePrepareContractWrite({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_ABI,
    functionName: "fundAuction",
    args: [BigInt(auctionId || 0), parseEther(contributionAmount)],
    enabled: !!auctionId && !!contributionAmount && isConnected,
  });

  const { 
    data: txData, 
    write: fundAuctionWrite, 
    isLoading: isWriting 
  } = useContractWrite(contractConfig);

  const { 
    isLoading: isTxLoading, 
    isSuccess: isTxSuccess 
  } = useWaitForTransaction({
    hash: txData?.hash,
  });

  useEffect(() => {
    if (!auctionId) return;
    
    const fetchAuction = async () => {
      try {
        const res = await fetch(`/api/auction/${auctionId}`);
        const data = await res.json();
        
        if (res.ok) {
          setAuction({
            ...data,
            expiresAt: data.expiresAt || Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days default
          });
          setFunding(data.funded || 0);
          setUnlocked(data.unlocked || false);
          
          // If auction is unlocked, fetch disclosure content
          if (data.unlocked) {
            fetchDisclosureContent();
          }
        } else {
          toast.error("Failed to load auction");
        }
      } catch (error) {
        toast.error("Network error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [auctionId]);

  useEffect(() => {
    if (isTxSuccess) {
      toast.success("GTT contribution successful! 🎯");
      setFunding(prev => prev + parseFloat(contributionAmount));
    }
  }, [isTxSuccess, contributionAmount]);

  const fetchDisclosureContent = async () => {
    try {
      const res = await fetch(`/api/auction/${auctionId}/disclosure`);
      const data = await res.json();
      
      if (res.ok) {
        setDisclosureContent(data.content);
      }
    } catch (error) {
      console.error("Failed to fetch disclosure content:", error);
    }
  };

  const handleFundWithContract = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error("Please enter a valid contribution amount");
      return;
    }

    try {
      fundAuctionWrite?.();
    } catch (error) {
      toast.error("Transaction failed");
      console.error("Funding error:", error);
    }
  };

  const handleDownloadDisclosure = () => {
    if (!disclosureContent) return;
    
    const blob = new Blob([disclosureContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truth-disclosure-${auctionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Truth disclosure downloaded!");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-slate-400">Loading auction...</p>
        </div>
      </main>
    );
  }

  if (!auction) {
    return (
      <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-red-400">Auction not found.</p>
        </div>
      </main>
    );
  }

  const percent = Math.min(100, (funding / auction.reservePrice) * 100);
  const canUnlock = funding >= auction.reservePrice;

  return (
    <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      <Card className="bg-slate-800 p-8 max-w-3xl mx-auto border border-slate-700">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2 text-white">{auction.title}</h1>
          <p className="text-slate-400 text-lg">{auction.summary}</p>
        </div>

        {/* Countdown Timer */}
        {timeLeft > 0 && (
          <div className="mb-6 p-4 bg-slate-700 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-300 text-sm mb-2">🕒 Time Remaining</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-800 p-2 rounded">
                <p className="text-xl font-bold text-white">{days}</p>
                <p className="text-xs text-slate-400">Days</p>
              </div>
              <div className="bg-slate-800 p-2 rounded">
                <p className="text-xl font-bold text-white">{hours}</p>
                <p className="text-xs text-slate-400">Hours</p>
              </div>
              <div className="bg-slate-800 p-2 rounded">
                <p className="text-xl font-bold text-white">{minutes}</p>
                <p className="text-xs text-slate-400">Min</p>
              </div>
              <div className="bg-slate-800 p-2 rounded">
                <p className="text-xl font-bold text-white">{seconds}</p>
                <p className="text-xs text-slate-400">Sec</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-slate-400">
              Funding Progress
            </p>
            <p className="text-sm text-slate-300 font-medium">
              {funding} / {auction.reservePrice} GTT ({percent.toFixed(1)}%)
            </p>
          </div>
          <Progress 
            value={percent} 
            className="h-3 bg-slate-700"
          />
        </div>

        <div className="mb-8">
          {canUnlock ? (
            <div className="text-center space-y-4">
              <p className="text-green-400 text-xl font-bold">
                ✅ Reserve Met — Truth Ready for Unlock
              </p>
              {disclosureContent ? (
                <div className="space-y-3">
                  <div className="bg-slate-700 p-4 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">
                      {disclosureContent.substring(0, 500)}
                      {disclosureContent.length > 500 && "..."}
                    </p>
                  </div>
                  <Button 
                    onClick={handleDownloadDisclosure}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                  >
                    📥 Download Full Disclosure
                  </Button>
                </div>
              ) : (
                <p className="text-slate-400">Loading disclosure content...</p>
              )}
            </div>
          ) : timeLeft <= 0 ? (
            <div className="text-center">
              <p className="text-red-400 text-xl font-bold mb-4">
                ⏰ Auction Expired
              </p>
              <p className="text-slate-400">This truth auction has ended without meeting its reserve.</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-slate-300 mb-4">
                Contribute GTT to unlock this sealed disclosure
              </p>
              
              {!isConnected ? (
                <p className="text-yellow-400 mb-4">
                  Please connect your wallet to contribute
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Input
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      placeholder="Amount in GTT"
                      className="w-32 bg-slate-700 text-white border-slate-600"
                      min="1"
                    />
                    <span className="text-slate-400">GTT</span>
                  </div>
                  
                  <Button 
                    onClick={handleFundWithContract}
                    disabled={isWriting || isTxLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2"
                  >
                    {isWriting || isTxLoading 
                      ? "Processing..." 
                      : `Contribute ${contributionAmount} GTT`
                    }
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-slate-700 pt-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Reserve Price</p>
              <p className="text-white font-medium">{auction.reservePrice} GTT</p>
            </div>
            <div>
              <p className="text-slate-400">Auction ID</p>
              <p className="text-white font-mono text-xs">{auction.id}</p>
            </div>
          </div>
          
          {auction.beneficiaries && auction.beneficiaries.length > 0 && (
            <div>
              <p className="text-slate-400 text-sm mb-2">Beneficiaries</p>
              <div className="space-y-1">
                {auction.beneficiaries.map((addr: string, index: number) => (
                  <p key={index} className="text-white font-mono text-xs bg-slate-700 p-2 rounded">
                    {addr}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </main>
  );
}