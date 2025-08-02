import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { unparse } from "papaparse";
import { FileText, FileJson, DollarSign, TrendingUp, Users, Coins } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function YieldDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/yield/analytics")
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch yield analytics:", error);
        setLoading(false);
      });
  }, []);

  const handleExportCSV = () => {
    if (!analytics?.recentDistributions) return;
    
    const exportData = analytics.recentDistributions.map(dist => ({
      auction_id: dist.auction_id,
      unlocker_wallet: dist.unlocker_wallet,
      author_yield: dist.author_yield,
      beneficiary_yield: dist.beneficiary_yield,
      referrer_wallet: dist.referrer_wallet || 'N/A',
      referrer_yield: dist.referrer_yield || 0,
      timestamp: dist.timestamp
    }));
    
    const csv = unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gtt-yield-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!analytics) return;
    
    const blob = new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gtt-yield-${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">💰 GTT Yield Analytics</h1>
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full"></div>
            <p className="text-slate-400">Loading yield analytics...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!analytics) {
    return (
      <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">💰 GTT Yield Analytics</h1>
          <Card className="bg-slate-800 p-8 text-center">
            <p className="text-slate-400 text-lg">Failed to load yield analytics.</p>
            <p className="text-slate-500 text-sm mt-2">
              Please try refreshing the page or check your connection.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  const yieldDistributionData = {
    labels: ['Author Yield', 'Beneficiary Yield', 'Referrer Yield'],
    datasets: [{
      data: [analytics.authorYield, analytics.beneficiaryYield, analytics.referrerYield],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',   // Green for authors
        'rgba(59, 130, 246, 0.8)',  // Blue for beneficiaries
        'rgba(168, 85, 247, 0.8)',  // Purple for referrers
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(168, 85, 247, 1)',
      ],
      borderWidth: 2,
    }],
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">💰 GTT Yield Analytics Dashboard</h1>
            <p className="text-slate-400">
              Monitor and analyze GTT token yield distributions across the auction ecosystem
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleExportCSV}
              disabled={!analytics?.recentDistributions?.length}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={handleExportJSON}
              disabled={!analytics}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <FileJson className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {analytics.totalYield.toFixed(2)}
                </p>
                <p className="text-sm text-slate-400">Total GTT Distributed</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">
                  {analytics.totalDistributions}
                </p>
                <p className="text-sm text-slate-400">Total Distributions</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">
                  {analytics.authorYield.toFixed(2)}
                </p>
                <p className="text-sm text-slate-400">Author Earnings</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-900/30 rounded-lg">
                <Coins className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-400">
                  {analytics.beneficiaryYield.toFixed(2)}
                </p>
                <p className="text-sm text-slate-400">Beneficiary Rewards</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Yield Distribution Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 p-6">
            <h3 className="text-lg font-semibold mb-4">GTT Yield Distribution</h3>
            {analytics.totalYield > 0 ? (
              <div className="h-64 flex items-center justify-center">
                <Doughnut
                  data={yieldDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { color: '#e2e8f0' }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No yield data available</p>
            )}
          </Card>

          <Card className="bg-slate-800 p-6">
            <h3 className="text-lg font-semibold mb-4">Yield Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span className="text-green-400">Author Yield</span>
                <span className="font-semibold">{analytics.authorYield.toFixed(4)} GTT</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span className="text-blue-400">Beneficiary Yield</span>
                <span className="font-semibold">{analytics.beneficiaryYield.toFixed(4)} GTT</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span className="text-purple-400">Referrer Yield</span>
                <span className="font-semibold">{analytics.referrerYield.toFixed(4)} GTT</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-600 rounded border-t border-slate-500">
                <span className="text-white font-semibold">Total Distributed</span>
                <span className="font-bold text-green-400">{analytics.totalYield.toFixed(4)} GTT</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Distributions */}
        <Card className="bg-slate-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Yield Distributions</h3>
          {analytics.recentDistributions?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-3 text-slate-400">Auction ID</th>
                    <th className="text-left p-3 text-slate-400">Unlocker</th>
                    <th className="text-right p-3 text-slate-400">Author</th>
                    <th className="text-right p-3 text-slate-400">Beneficiary</th>
                    <th className="text-right p-3 text-slate-400">Referrer</th>
                    <th className="text-right p-3 text-slate-400">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentDistributions.map((dist, index) => (
                    <tr key={dist.id || index} className="border-b border-slate-700 hover:bg-slate-750">
                      <td className="p-3 font-mono text-xs">
                        {dist.auction_id.substring(0, 8)}...
                      </td>
                      <td className="p-3 font-mono text-xs">
                        {dist.unlocker_wallet.substring(0, 10)}...
                      </td>
                      <td className="p-3 text-right text-green-400">
                        {Number(dist.author_yield).toFixed(4)}
                      </td>
                      <td className="p-3 text-right text-blue-400">
                        {Number(dist.beneficiary_yield).toFixed(4)}
                      </td>
                      <td className="p-3 text-right text-purple-400">
                        {Number(dist.referrer_yield || 0).toFixed(4)}
                      </td>
                      <td className="p-3 text-right text-slate-400 text-xs">
                        {format(new Date(dist.timestamp), 'MMM dd, HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No recent distributions found.</p>
          )}
        </Card>
      </div>
    </main>
  );
}