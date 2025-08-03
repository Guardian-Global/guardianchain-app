import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function MemoryYieldChart() {
  const [data, setData] = useState<{ cluster: number, yield: number }[]>([]);

  useEffect(() => {
    fetch("/api/analytics/memory-yield")
      .then(res => res.json())
      .then(setData);
  }, []);

  const chartData = {
    labels: data.map(d => `Cluster ${d.cluster}`),
    datasets: [
      {
        label: "GTT Yield",
        data: data.map(d => d.yield),
        backgroundColor: "#22c55e"
      }
    ]
  };

  return (
    <div className="p-6 bg-slate-900 rounded-xl text-white">
      <h2 className="text-xl font-semibold mb-4">💰 GTT Yield by Capsule Cluster</h2>
      <Bar data={chartData} />
    </div>
  );
}