import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { unparse } from "papaparse";
import { Download, Filter, FileText, FileJson, TrendingUp, BarChart3 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function UnlocksDashboard() {
  const [unlocks, setUnlocks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auctionId, setAuctionId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [totalUnlocks, setTotalUnlocks] = useState(0);
  const [dailyTrends, setDailyTrends] = useState([]);
  const [auctionStats, setAuctionStats] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(true);

  useEffect(() => {
    fetch("/api/unlocks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUnlocks(data);
          setFiltered(data);
          setTotalUnlocks(data.length);
          
          // Calculate daily trends
          const trends = data.reduce((acc, unlock) => {
            const date = format(new Date(unlock.unlocked_at), 'yyyy-MM-dd');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});
          
          const sortedTrends = Object.entries(trends)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setDailyTrends(sortedTrends);
          
          // Calculate auction stats
          const auctionCounts = data.reduce((acc, unlock) => {
            const auctionTitle = unlock.auction_title || 'Unknown Auction';
            acc[auctionTitle] = (acc[auctionTitle] || 0) + 1;
            return acc;
          }, {});
          
          const sortedAuctionStats = Object.entries(auctionCounts)
            .map(([auction, count]) => ({ auction, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Top 10 auctions
          setAuctionStats(sortedAuctionStats);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch unlocks:", error);
        setLoading(false);
      });
  }, []);

  const handleFilter = () => {
    const filteredData = unlocks.filter((u) => {
      const matchesAuction = auctionId ? u.auction_id.toLowerCase().includes(auctionId.toLowerCase()) : true;
      const matchesWallet = walletAddress ? u.wallet_address.toLowerCase().includes(walletAddress.toLowerCase()) : true;
      return matchesAuction && matchesWallet;
    });
    setFiltered(filteredData);
  };

  const clearFilters = () => {
    setAuctionId("");
    setWalletAddress("");
    setFiltered(unlocks);
  };

  const handleExportCSV = () => {
    const exportData = filtered.map(unlock => ({
      auction_id: unlock.auction_id,
      auction_title: unlock.auction_title || 'N/A',
      wallet_address: unlock.wallet_address,
      user_id: unlock.user_id || 'N/A',
      unlocked_at: unlock.unlocked_at,
      created_at: unlock.created_at
    }));
    
    const csv = unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unlocks-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unlocks-${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">📜 Unlock Activity Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-slate-400">Loading unlock history...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">📜 Unlock Activity Dashboard</h1>
            <p className="text-slate-400">
              Monitor and analyze auction unlock events with advanced filtering and export capabilities
            </p>
            <div className="flex items-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{totalUnlocks}</p>
                <p className="text-sm text-slate-400">Total Unlocks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{dailyTrends.length}</p>
                <p className="text-sm text-slate-400">Active Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{auctionStats.length}</p>
                <p className="text-sm text-slate-400">Unique Auctions</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setShowAnalytics(!showAnalytics)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              size="sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {showAnalytics ? 'Hide' : 'Show'} Analytics
            </Button>
            <Button
              onClick={handleExportCSV}
              disabled={filtered.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={handleExportJSON}
              disabled={filtered.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <FileJson className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>

        {/* Analytics Section */}
        {showAnalytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Trends Chart */}
            <Card className="bg-slate-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Daily Unlock Trends</h3>
              </div>
              {dailyTrends.length > 0 ? (
                <Line
                  data={{
                    labels: dailyTrends.map(t => format(new Date(t.date), 'MMM dd')),
                    datasets: [{
                      label: 'Unlocks per day',
                      data: dailyTrends.map(t => t.count),
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 2,
                      fill: true,
                      tension: 0.4,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: '#e2e8f0' }
                      }
                    },
                    scales: {
                      x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#475569' }
                      },
                      y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#475569' }
                      }
                    }
                  }}
                  height={200}
                />
              ) : (
                <p className="text-slate-400 text-center py-8">No trend data available</p>
              )}
            </Card>

            {/* Top Auctions Chart */}
            <Card className="bg-slate-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Top Auctions by Unlocks</h3>
              </div>
              {auctionStats.length > 0 ? (
                <Bar
                  data={{
                    labels: auctionStats.map(s => s.auction.length > 20 ? s.auction.substring(0, 20) + '...' : s.auction),
                    datasets: [{
                      label: 'Unlock count',
                      data: auctionStats.map(s => s.count),
                      backgroundColor: 'rgba(168, 85, 247, 0.6)',
                      borderColor: 'rgba(168, 85, 247, 1)',
                      borderWidth: 1,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: '#e2e8f0' }
                      }
                    },
                    scales: {
                      x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#475569' }
                      },
                      y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#475569' }
                      }
                    }
                  }}
                  height={200}
                />
              ) : (
                <p className="text-slate-400 text-center py-8">No auction data available</p>
              )}
            </Card>
          </div>
        )}

        {/* Advanced Filtering */}
        <Card className="bg-slate-800 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold">Advanced Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Auction ID
              </label>
              <Input
                type="text"
                value={auctionId}
                onChange={(e) => setAuctionId(e.target.value)}
                placeholder="Filter by auction ID..."
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Wallet Address
              </label>
              <Input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Filter by wallet address..."
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <Button
                onClick={handleFilter}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Apply Filters
              </Button>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Clear
              </Button>
            </div>
            
            <div className="flex items-end">
              <div className="text-sm text-slate-400">
                Showing <span className="text-white font-medium">{filtered.length}</span> of{" "}
                <span className="text-white font-medium">{unlocks.length}</span> unlocks
              </div>
            </div>
          </div>
        </Card>

        {filtered.length === 0 ? (
          <Card className="bg-slate-800 p-8 text-center">
            {unlocks.length === 0 ? (
              <>
                <p className="text-slate-400 text-lg mb-2">No unlocks recorded yet.</p>
                <p className="text-slate-500 text-sm">
                  Auction unlock events will appear here when Truth Auctions reach their funding goals.
                </p>
              </>
            ) : (
              <>
                <p className="text-slate-400 text-lg mb-2">No unlocks match your filters.</p>
                <p className="text-slate-500 text-sm">
                  Try adjusting your search criteria or clearing the filters.
                </p>
              </>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {filtered.map((unlock) => (
              <Card key={unlock.id} className="bg-slate-800 p-6 hover:bg-slate-750 transition-colors border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {unlock.auction_title || 'Truth Auction Unlocked'}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">
                      Auction ID: <span className="font-mono text-blue-400">{unlock.auction_id}</span>
                    </p>
                    {unlock.auction_summary && (
                      <p className="text-slate-300 text-sm">
                        {unlock.auction_summary}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="bg-green-900/30 px-3 py-1 rounded-full border border-green-700">
                      <p className="text-green-400 text-sm font-medium">✅ UNLOCKED</p>
                    </div>
                    <p className="text-slate-400 text-xs mt-2">
                      {format(new Date(unlock.unlocked_at), 'PPp')}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-slate-700 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Wallet Address:</span>
                      <p className="font-mono text-white text-xs mt-1 break-all">
                        {unlock.wallet_address}
                      </p>
                    </div>
                    {unlock.user_id && (
                      <div>
                        <span className="text-slate-400">User ID:</span>
                        <p className="text-white mt-1">{unlock.user_id}</p>
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