import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface YieldVoteData {
  theme: string;
  cluster: number;
  gttYield: number;
  voteCount: number;
}

export default function YieldVoteSnapshot() {
  const [data, setData] = useState<YieldVoteData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [yieldRes, voteRes] = await Promise.all([
          fetch("/api/gtt/theme-yield"),
          fetch("/api/dao/vote-summary")
        ]);
        
        const yieldData = await yieldRes.json();
        const voteData = await voteRes.json();
        
        if (yieldData.yields && voteData.themes) {
          const combined = yieldData.yields.map((yieldItem: any) => {
            const voteItem = voteData.themes.find((v: any) => v.cluster === yieldItem.cluster) || {};
            return {
              theme: yieldItem.theme,
              cluster: yieldItem.cluster,
              gttYield: yieldItem.gttYield || 0,
              voteCount: voteItem.voteCount || 0
            };
          });
          setData(combined);
        }
      } catch (error) {
        console.error("Failed to fetch yield vs vote data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.map(d => d.theme || `Cluster ${d.cluster}`),
    datasets: [
      {
        label: "GTT Yield",
        data: data.map(d => d.gttYield),
        backgroundColor: "#22c55e",
        yAxisID: "y"
      },
      {
        label: "DAO Votes", 
        data: data.map(d => d.voteCount),
        backgroundColor: "#3b82f6",
        yAxisID: "y1"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { 
        position: "top" as const,
        labels: { color: "#e2e8f0" }
      },
      tooltip: { 
        mode: "index" as const, 
        intersect: false,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#f1f5f9",
        bodyColor: "#e2e8f0"
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(71, 85, 105, 0.3)" }
      },
      y: { 
        beginAtZero: true, 
        position: "left" as const,
        title: { display: true, text: "GTT Yield", color: "#22c55e" },
        ticks: { color: "#22c55e" },
        grid: { color: "rgba(71, 85, 105, 0.3)" }
      },
      y1: {
        beginAtZero: true,
        position: "right" as const,
        title: { display: true, text: "DAO Votes", color: "#3b82f6" },
        ticks: { color: "#3b82f6" },
        grid: { drawOnChartArea: false }
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-slate-900 rounded-xl text-white">
        <h2 className="text-xl font-bold mb-4">📊 GTT Yield vs DAO Votes by Theme</h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-slate-400">Loading correlation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 rounded-xl text-white">
      <h2 className="text-xl font-bold mb-4">📊 GTT Yield vs DAO Votes by Theme</h2>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-800 p-3 rounded">
          <span className="text-slate-400">Total GTT Yield:</span>
          <span className="text-green-400 font-bold ml-2">
            {data.reduce((sum, item) => sum + item.gttYield, 0).toFixed(1)} GTT
          </span>
        </div>
        <div className="bg-slate-800 p-3 rounded">
          <span className="text-slate-400">Total DAO Votes:</span>
          <span className="text-blue-400 font-bold ml-2">
            {data.reduce((sum, item) => sum + item.voteCount, 0)} votes
          </span>
        </div>
      </div>
    </div>
  );
}