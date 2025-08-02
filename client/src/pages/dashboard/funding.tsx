import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { unparse } from "papaparse";
import { FileText, FileJson, DollarSign, TrendingUp, Users, Target } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function FundingDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/funding/analytics")
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch funding analytics:", error);
        setLoading(false);
      });
  }, []);

  const handleExportCSV = () => {
    if (!analytics?.recentFunding) return;
    
    const exportData = analytics.recentFunding.map(funding => ({
      auction_id: funding.auction_id,
      auction_title: funding.auctions?.title || 'Unknown',
      amount: funding.amount,
      wallet_address: funding.wallet_address,
      transaction_hash: funding.transaction_hash || 'N/A',
      funded_at: funding.funded_at
    }));
    
    const csv = unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auction-funding-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!analytics) return;
    
    const blob = new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auction-funding-${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">💰 Auction Funding Analytics</h1>
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full"></div>
            <p className="text-slate-400">Loading funding analytics...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!analytics) {
    return (
      <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">💰 Auction Funding Analytics</h1>
          <Card className="bg-slate-800 p-8 text-center">
            <p className="text-slate-400 text-lg">Failed to load funding analytics.</p>
            <p className="text-slate-500 text-sm mt-2">
              Please try refreshing the page or check your connection.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">💰 Auction Funding Analytics Dashboard</h1>
            <p className="text-slate-400">
              Monitor and analyze funding contributions across all Truth Auctions
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleExportCSV}
              disabled={!analytics?.recentFunding?.length}
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
                  {analytics.totalFunding.toFixed(4)} ETH
                </p>
                <p className="text-sm text-slate-400">Total Funding</p>
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
                  {analytics.totalContributions}
                </p>
                <p className="text-sm text-slate-400">Total Contributions</p>
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
                  {analytics.uniqueContributors}
                </p>
                <p className="text-sm text-slate-400">Unique Contributors</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-900/30 rounded-lg">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-400">
                  {analytics.avgContribution.toFixed(4)} ETH
                </p>
                <p className="text-sm text-slate-400">Avg Contribution</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Funding */}
        <Card className="bg-slate-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Funding Contributions</h3>
          {analytics.recentFunding?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-3 text-slate-400">Auction</th>
                    <th className="text-left p-3 text-slate-400">Contributor</th>
                    <th className="text-right p-3 text-slate-400">Amount</th>
                    <th className="text-left p-3 text-slate-400">Transaction</th>
                    <th className="text-right p-3 text-slate-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentFunding.map((funding, index) => (
                    <tr key={funding.id || index} className="border-b border-slate-700 hover:bg-slate-750">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-white">
                            {funding.auctions?.title || 'Unknown Auction'}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            {funding.auction_id.substring(0, 8)}...
                          </p>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs text-slate-300">
                        {funding.wallet_address.substring(0, 10)}...
                      </td>
                      <td className="p-3 text-right text-green-400 font-semibold">
                        {Number(funding.amount).toFixed(4)} ETH
                      </td>
                      <td className="p-3">
                        {funding.transaction_hash ? (
                          <a 
                            href={`https://etherscan.io/tx/${funding.transaction_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-mono text-xs"
                          >
                            {funding.transaction_hash.substring(0, 10)}...
                          </a>
                        ) : (
                          <span className="text-slate-500 text-xs">Pending</span>
                        )}
                      </td>
                      <td className="p-3 text-right text-slate-400 text-xs">
                        {format(new Date(funding.funded_at), 'MMM dd, HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No funding contributions found.</p>
          )}
        </Card>
      </div>
    </main>
  );
}