import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  value: string;
  label: string;
  color: string;
}

export default function LiveStats() {
  const stats: StatItem[] = [
    { value: "25,847", label: "Truth Capsules", color: "text-blue-400" },
    { value: "12,450", label: "Active Guardians", color: "text-green-400" },
    { value: "98.7%", label: "Verification Accuracy", color: "text-purple-400" },
    { value: "$2.4M", label: "GTT Distributed", color: "text-yellow-400" }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-slate-800/50 border-slate-700/50 text-center">
          <CardContent className="p-6">
            <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
            <div className="text-gray-400">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}