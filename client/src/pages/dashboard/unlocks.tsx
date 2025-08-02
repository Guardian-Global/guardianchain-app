import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

export default function UnlocksDashboard() {
  const [unlocks, setUnlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/unlocks")
      .then((res) => res.json())
      .then((data) => {
        setUnlocks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch unlocks:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">📜 Unlock Activity</h1>
          <p className="text-slate-400">Loading unlock history...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📜 Unlock Activity</h1>

        {unlocks.length === 0 ? (
          <Card className="bg-slate-800 p-8 text-center">
            <p className="text-slate-400 text-lg">No unlocks recorded yet.</p>
            <p className="text-slate-500 text-sm mt-2">
              Auction unlock events will appear here when Truth Auctions reach their funding goals.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {unlocks.map((unlock) => (
              <Card key={unlock.id} className="bg-slate-800 p-6 hover:bg-slate-750 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {unlock.auction_title || 'Truth Auction Unlocked'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Auction ID: <span className="font-mono">{unlock.auction_id}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-medium">✅ UNLOCKED</p>
                    <p className="text-slate-400 text-xs">
                      {format(new Date(unlock.unlocked_at), 'PPp')}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-slate-700 pt-3 mt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400">Wallet:</span>
                      <p className="font-mono text-white text-xs">
                        {unlock.wallet_address}
                      </p>
                    </div>
                    {unlock.user_id && (
                      <div>
                        <span className="text-slate-400">User:</span>
                        <p className="text-white">{unlock.user_id}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}