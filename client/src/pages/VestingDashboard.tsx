import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  FileText, 
  RefreshCw, 
  Wallet, 
  Crown, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter
} from "lucide-react";

// Global types for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ABI = [
  "function vestedAmount() view returns (uint256)",
  "function releasable() view returns (uint256)",
  "function released() view returns (uint256)",
  "function beneficiary() view returns (address)",
  "function release()",
  "function cliff() view returns (uint256)",
  "function start() view returns (uint256)",
  "function duration() view returns (uint256)"
];

const contributors = [
  {
    name: "Founder Team",
    address: "0x742d35Cc6634C0532925a3b8D00C8a0eCe4f8db3",
    distributor: "0x123...456", // Replace with actual GTTDistributor address
    role: "Founder",
    allocation: "1,250,000,000 GTT"
  },
  {
    name: "Core Development",
    address: "0x456d35Cc6634C0532925a3b8D00C8a0eCe4f8db7",
    distributor: "0x789...abc",
    role: "Development",
    allocation: "312,500,000 GTT"
  },
  {
    name: "Ecosystem Fund",
    address: "0x789d35Cc6634C0532925a3b8D00C8a0eCe4f8db9",
    distributor: "0xdef...123",
    role: "Ecosystem",
    allocation: "625,000,000 GTT"
  },
  {
    name: "Community Rewards",
    address: "0xabcd35Cc6634C0532925a3b8D00C8a0eCe4f8def",
    distributor: "0x456...789",
    role: "Community",
    allocation: "312,500,000 GTT"
  }
];

interface VestingData {
  name: string;
  wallet: string;
  vested: string;
  released: string;
  releasable: string;
  rawReleasable: string;
  distributor: string;
  role: string;
  allocation: string;
  cliffStatus: string;
  progressPercent: number;
}

export default function VestingDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<VestingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showReleasableOnly, setShowReleasableOnly] = useState(false);
  const [totalStats, setTotalStats] = useState({
    totalVested: "0",
    totalReleased: "0",
    totalReleasable: "0"
  });

  // Check admin access - using type assertion for extended tier types
  const isAdmin = (user?.tier as string) === "ADMIN" || user?.tier === "SOVEREIGN";

  const fetchVestingData = async () => {
    setRefreshing(true);
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      const vestingData = await Promise.all(
        contributors.map(async (contributor) => {
          try {
            const contract = new ethers.Contract(contributor.distributor, ABI, provider);
            
            // Get vesting data
            const [vested, released, releasable, beneficiary, cliff, start, duration] = await Promise.all([
              contract.vestedAmount(),
              contract.released(),
              contract.releasable(),
              contract.beneficiary(),
              contract.cliff().catch(() => BigInt(0)),
              contract.start().catch(() => BigInt(0)),
              contract.duration().catch(() => BigInt(31536000)) // 1 year default
            ]);

            const vestedAmount = ethers.formatUnits(vested, 18);
            const releasedAmount = ethers.formatUnits(released, 18);
            const releasableAmount = ethers.formatUnits(releasable, 18);
            
            // Calculate cliff status
            const now = BigInt(Math.floor(Date.now() / 1000));
            const cliffReached = now >= (start + cliff);
            const cliffStatus = cliffReached ? "Passed" : "Pending";
            
            // Calculate progress percentage
            const totalAllocation = parseFloat(contributor.allocation.replace(/[^0-9.]/g, ''));
            const progressPercent = totalAllocation > 0 ? (parseFloat(vestedAmount) / totalAllocation) * 100 : 0;

            // Send cliff alert if just reached
            if (cliffReached && parseFloat(releasableAmount) > 0) {
              fetch("/api/vesting/webhook/cliff-alert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  contributor: contributor.name, 
                  wallet: beneficiary,
                  releasable: releasableAmount
                })
              }).catch(console.warn);
            }

            return {
              name: contributor.name,
              wallet: beneficiary,
              vested: vestedAmount,
              released: releasedAmount,
              releasable: releasableAmount,
              rawReleasable: releasable.toString(),
              distributor: contributor.distributor,
              role: contributor.role,
              allocation: contributor.allocation,
              cliffStatus,
              progressPercent: Math.min(progressPercent, 100)
            };
          } catch (error) {
            console.warn(`Failed to fetch data for ${contributor.name}:`, error);
            return {
              name: contributor.name,
              wallet: contributor.address,
              vested: "0",
              released: "0",
              releasable: "0",
              rawReleasable: "0",
              distributor: contributor.distributor,
              role: contributor.role,
              allocation: contributor.allocation,
              cliffStatus: "Unknown",
              progressPercent: 0
            };
          }
        })
      );

      // Calculate totals
      const totals = vestingData.reduce((acc, item) => ({
        totalVested: (parseFloat(acc.totalVested) + parseFloat(item.vested)).toFixed(2),
        totalReleased: (parseFloat(acc.totalReleased) + parseFloat(item.released)).toFixed(2),
        totalReleasable: (parseFloat(acc.totalReleasable) + parseFloat(item.releasable)).toFixed(2)
      }), { totalVested: "0", totalReleased: "0", totalReleasable: "0" });

      setData(vestingData);
      setTotalStats(totals);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch vesting data:", error);
      toast({
        title: "Connection Error",
        description: "Please connect your wallet and ensure you're on the correct network",
        variant: "destructive"
      });
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  const handleExportCSV = () => {
    const csv = ["Name,Role,Wallet,Allocation,Vested,Released,Releasable,Cliff Status,Progress %"];
    data.forEach(d => {
      csv.push(`${d.name},${d.role},${d.wallet},${d.allocation},${d.vested},${d.released},${d.releasable},${d.cliffStatus},${d.progressPercent.toFixed(2)}%`);
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GTT_Vesting_Dashboard_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Vesting data exported to CSV successfully"
    });
  };

  const handleClaim = async (distributor: string, contributorName: string) => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(distributor, ABI, signer);
      
      toast({
        title: "Processing Claim",
        description: `Claiming vested GTT tokens for ${contributorName}...`
      });

      const tx = await contract.release();
      await tx.wait();
      
      toast({
        title: "Claim Successful",
        description: `GTT tokens claimed successfully for ${contributorName}`
      });
      
      // Refresh data after claim
      fetchVestingData();
    } catch (error: any) {
      console.error("Claim failed:", error);
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim tokens",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchVestingData();
    }
  }, [isAdmin]);

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: "Vested GTT",
        data: data.map(d => parseFloat(d.vested)),
        backgroundColor: "hsl(180, 100%, 50%)",
        borderColor: "hsl(180, 100%, 60%)",
        borderWidth: 1
      },
      {
        label: "Released GTT",
        data: data.map(d => parseFloat(d.released)),
        backgroundColor: "hsl(291, 100%, 50%)",
        borderColor: "hsl(291, 100%, 60%)",
        borderWidth: 1
      },
      {
        label: "Releasable GTT",
        data: data.map(d => parseFloat(d.releasable)),
        backgroundColor: "hsl(262, 83%, 58%)",
        borderColor: "hsl(262, 83%, 68%)",
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(180, 100%, 90%)'
        }
      },
      title: {
        display: true,
        text: 'GTT Token Vesting Progress',
        color: 'hsl(180, 100%, 90%)'
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'hsl(180, 100%, 90%)'
        },
        grid: {
          color: 'hsl(180, 100%, 20%)'
        }
      },
      y: {
        ticks: {
          color: 'hsl(180, 100%, 90%)'
        },
        grid: {
          color: 'hsl(180, 100%, 20%)'
        }
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <Crown className="mx-auto h-16 w-16 text-cyan-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
              <p className="text-gray-400">
                GTT Vesting Dashboard requires ADMIN or SOVEREIGN tier access.
              </p>
              <Badge variant="secondary" className="mt-4 bg-red-500/20 text-red-400">
                Current Tier: {user?.tier || "EXPLORER"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              GTT Vesting Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Monitor contributor token vesting and release schedules</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchVestingData}
              disabled={refreshing}
              className="bg-cyan-600 hover:bg-cyan-700"
              data-testid="button-refresh-vesting"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-white/10 hover:bg-white/5"
              data-testid="button-export-csv"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search contributors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 w-64"
                  data-testid="input-search-contributors"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="releasable-filter"
                  checked={showReleasableOnly}
                  onCheckedChange={(checked) => setShowReleasableOnly(checked as boolean)}
                />
                <label htmlFor="releasable-filter" className="text-sm text-gray-300 cursor-pointer">
                  Show Releasable Only
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-cyan-400 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Total Vested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {parseFloat(totalStats.totalVested).toLocaleString()} GTT
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Total Released
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {parseFloat(totalStats.totalReleased).toLocaleString()} GTT
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-400 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Total Releasable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {parseFloat(totalStats.totalReleasable).toLocaleString()} GTT
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
              <p className="text-gray-400">Loading vesting data...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Vesting Table */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Contributor Vesting Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-gray-300">Contributor</th>
                        <th className="text-left py-3 px-4 text-gray-300">Role</th>
                        <th className="text-left py-3 px-4 text-gray-300">Allocation</th>
                        <th className="text-right py-3 px-4 text-gray-300">Vested</th>
                        <th className="text-right py-3 px-4 text-gray-300">Released</th>
                        <th className="text-right py-3 px-4 text-gray-300">Releasable</th>
                        <th className="text-center py-3 px-4 text-gray-300">Cliff</th>
                        <th className="text-center py-3 px-4 text-gray-300">Progress</th>
                        <th className="text-center py-3 px-4 text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data
                        .filter(item => {
                          const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchesFilter = showReleasableOnly ? parseFloat(item.releasable) > 0 : true;
                          return matchesSearch && matchesFilter;
                        })
                        .map((item, i) => {
                          const hasReleasable = parseFloat(item.releasable) > 0;
                          const canClaim = window.ethereum?.selectedAddress?.toLowerCase() === item.wallet.toLowerCase();
                          
                          return (
                            <tr 
                              key={i} 
                              className={`border-b border-white/5 ${hasReleasable ? 'bg-green-500/10' : ''}`}
                              data-testid={`row-contributor-${i}`}
                            >
                            <td className="py-3 px-4">
                              <div className="text-white font-medium">{item.name}</div>
                              <div className="text-xs text-gray-400 truncate max-w-32">{item.wallet}</div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                                {item.role}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-300">{item.allocation}</td>
                            <td className="py-3 px-4 text-right text-cyan-400 font-mono">
                              {parseFloat(item.vested).toLocaleString()} GTT
                            </td>
                            <td className="py-3 px-4 text-right text-purple-400 font-mono">
                              {parseFloat(item.released).toLocaleString()} GTT
                            </td>
                            <td className="py-3 px-4 text-right text-yellow-400 font-mono">
                              {parseFloat(item.releasable).toLocaleString()} GTT
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge 
                                variant={item.cliffStatus === "Passed" ? "default" : "secondary"}
                                className={item.cliffStatus === "Passed" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}
                              >
                                {item.cliffStatus}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="text-sm text-gray-300">{item.progressPercent.toFixed(1)}%</div>
                              <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(item.progressPercent, 100)}%` }}
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {canClaim && hasReleasable && (
                                <Button
                                  onClick={() => handleClaim(item.distributor, item.name)}
                                  size="sm"
                                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                                  data-testid={`button-claim-${i}`}
                                >
                                  <Wallet className="h-3 w-3 mr-1" />
                                  Claim
                                </Button>
                              )}
                              {!canClaim && hasReleasable && (
                                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Available
                                </Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Vesting Chart */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Vesting Progress Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}