import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Coins } from "lucide-react";

interface YieldData {
  name: string;
  yield: number;
  capsules: number;
  rank: number;
  change: number;
}

export default function YieldGauge() {
  const [yields, setYields] = useState<YieldData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demo - replace with actual API call
    setTimeout(() => {
      setYields([
        { name: "Guardian Alpha", yield: 1247, capsules: 89, rank: 1, change: 12.5 },
        { name: "Truth Keeper", yield: 987, capsules: 67, rank: 2, change: 8.3 },
        { name: "Validator Prime", yield: 756, capsules: 54, rank: 3, change: -2.1 },
        { name: "Chain Sentinel", yield: 623, capsules: 43, rank: 4, change: 15.7 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-accent" />
            Validator Yield Gauge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-brand-surface rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-accent" />
          Validator Yield Gauge
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {yields.map((validator, index) => (
          <div
            key={index}
            className="p-4 bg-brand-surface border border-brand-primary/10 rounded-lg hover:border-brand-primary/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  #{validator.rank}
                </Badge>
                <span className="font-medium text-brand-light">
                  {validator.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className={validator.change > 0 ? "text-green-400" : "text-red-400"}>
                  {validator.change > 0 ? "+" : ""}{validator.change}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-brand-light/80">
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-brand-warning" />
                <span>{validator.yield} GTT</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-brand-accent" />
                <span>{validator.capsules} verified</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}