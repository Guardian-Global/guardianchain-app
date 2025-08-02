import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AuctionViewPage() {
  const [match, params] = useRoute("/auction/:id");
  const auctionId = params?.id;
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [funding, setFunding] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [contributing, setContributing] = useState(false);

  useEffect(() => {
    if (!auctionId) return;
    
    const fetchAuction = async () => {
      try {
        const res = await fetch(`/api/auction/${auctionId}`);
        const data = await res.json();
        
        if (res.ok) {
          setAuction(data);
          setFunding(data.funded || 0);
          setUnlocked(data.unlocked || false);
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

  const handleFund = async () => {
    if (!auctionId) return;
    
    setContributing(true);
    
    try {
      const res = await fetch(`/api/auction/${auctionId}/fund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 100 }), // Placeholder contribution
      });
      
      const json = await res.json();
      
      if (json.success) {
        setFunding(prev => prev + 100);
        toast.success("Contribution successful! 🎯");
      } else {
        toast.error(json.error || "Contribution failed");
      }
    } catch (error) {
      toast.error("Network error occurred");
    } finally {
      setContributing(false);
    }
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
            <div className="text-center">
              <p className="text-green-400 text-xl font-bold mb-4">
                ✅ Reserve Met — Truth Ready for Unlock
              </p>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                disabled
              >
                Truth Unlocked
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-slate-300 mb-4">
                Contribute to unlock this sealed disclosure
              </p>
              <Button 
                onClick={handleFund}
                disabled={contributing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2"
              >
                {contributing ? "Contributing..." : "Contribute 100 GTT"}
              </Button>
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