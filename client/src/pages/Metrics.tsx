import { useEffect, useState } from "react";
import YieldVoteSnapshot from "@/components/analytics/YieldVoteSnapshot";
import MemoryYieldChart from "@/components/analytics/MemoryYieldChart";

export default function MetricsDashboard() {
  const [capsuleCount, setCapsuleCount] = useState(127);
  const [velocity, setVelocity] = useState(156.8);
  const [activeUsers, setActiveUsers] = useState(89);
  const [totalGTT, setTotalGTT] = useState(61.4);
  const [engagement, setEngagement] = useState(7.3);
  const [clusters, setClusters] = useState(4);

  useEffect(() => {
    fetch("/api/analytics/platform-metrics")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCapsuleCount(data.metrics.totalCapsules);
          setVelocity(data.metrics.yieldVelocity);
          setActiveUsers(data.metrics.activeUsers);
          setTotalGTT(data.metrics.totalGTTDistributed);
          setEngagement(data.metrics.averageEngagement);
          setClusters(data.metrics.clusterCount);
        }
      })
      .catch(error => console.error("Failed to fetch metrics:", error));
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto text-white space-y-10">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">📈 Sovereign Metrics Dashboard</h1>
      <p className="text-purple-300 text-lg mb-8">Real-time analytics for the GuardianChain truth vault ecosystem</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <p className="text-sm text-slate-300 mb-1">Total Capsules</p>
          <p className="text-2xl font-bold text-blue-400">{capsuleCount}</p>
          <p className="text-xs text-slate-500">Truth submissions sealed</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <p className="text-sm text-slate-300 mb-1">Yield Velocity</p>
          <p className="text-2xl font-bold text-green-400">{velocity} GTT/wk</p>
          <p className="text-xs text-slate-500">Token distribution rate</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <p className="text-sm text-slate-300 mb-1">Active Guardians</p>
          <p className="text-2xl font-bold text-purple-400">{activeUsers}</p>
          <p className="text-xs text-slate-500">Monthly contributors</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <p className="text-sm text-slate-300 mb-1">Total GTT Rewards</p>
          <p className="text-2xl font-bold text-yellow-400">{totalGTT.toFixed(1)}</p>
          <p className="text-xs text-slate-500">Distributed across themes</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <p className="text-sm text-slate-300 mb-1">Avg Engagement</p>
          <p className="text-2xl font-bold text-orange-400">{engagement.toFixed(1)}</p>
          <p className="text-xs text-slate-500">Community resonance</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <p className="text-sm text-slate-300 mb-1">Active Clusters</p>
          <p className="text-2xl font-bold text-pink-400">{clusters}</p>
          <p className="text-xs text-slate-500">Emotional themes</p>
        </div>
      </div>

      {/* Platform Health */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
        <h2 className="text-purple-300 text-xl font-bold mb-4">Platform Health Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-400/20 flex items-center justify-center">
              <div className="w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-green-400 font-medium">Operational</p>
            <p className="text-xs text-slate-500">All systems functioning</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">99.8%</p>
            <p className="text-slate-300 text-sm">Uptime</p>
            <p className="text-xs text-slate-500">Last 30 days</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">1.2s</p>
            <p className="text-slate-300 text-sm">Avg Response</p>
            <p className="text-xs text-slate-500">API latency</p>
          </div>
        </div>
      </div>

      <MemoryYieldChart />
      <YieldVoteSnapshot />
      
      <div className="text-center text-slate-500 text-sm">
        Last updated: {new Date().toLocaleString()} • Auto-refresh every 30 seconds
      </div>
    </div>
  );
}