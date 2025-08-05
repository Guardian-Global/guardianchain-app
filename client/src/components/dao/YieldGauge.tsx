import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Clock,
  Target,
  Award
} from "lucide-react";

interface YieldData {
  totalYield: number;
  currentAPY: number;
  projectedYield: number;
  stakingRewards: number;
  validatorRewards: number;
  performanceBonus: number;
}

export default function YieldGauge() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  // Mock data - replace with actual API call
  const yieldData: YieldData = {
    totalYield: 15420.50,
    currentAPY: 12.5,
    projectedYield: 18750.00,
    stakingRewards: 8940.25,
    validatorRewards: 4230.15,
    performanceBonus: 2250.10
  };

  const periods = [
    { key: "7d", label: "7 Days" },
    { key: "30d", label: "30 Days" }, 
    { key: "90d", label: "90 Days" },
    { key: "1y", label: "1 Year" }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-primary" />
            Yield Performance Gauge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Period Selector */}
          <div className="flex gap-2">
            {periods.map((period) => (
              <Button
                key={period.key}
                variant={selectedPeriod === period.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.key)}
                className={
                  selectedPeriod === period.key
                    ? "bg-brand-primary text-white"
                    : "border-brand-surface text-brand-light hover:bg-brand-surface"
                }
              >
                {period.label}
              </Button>
            ))}
          </div>

          {/* Main Yield Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-brand-surface rounded-lg">
              <DollarSign className="w-8 h-8 text-brand-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-light">
                {yieldData.totalYield.toLocaleString(undefined, { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </div>
              <div className="text-sm text-brand-light/60">Total Yield (GTT)</div>
            </div>

            <div className="text-center p-4 bg-brand-surface rounded-lg">
              <Percent className="w-8 h-8 text-brand-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-light">
                {yieldData.currentAPY}%
              </div>
              <div className="text-sm text-brand-light/60">Current APY</div>
            </div>

            <div className="text-center p-4 bg-brand-surface rounded-lg">
              <Target className="w-8 h-8 text-brand-warning mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-light">
                {yieldData.projectedYield.toLocaleString(undefined, { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </div>
              <div className="text-sm text-brand-light/60">Projected ({selectedPeriod})</div>
            </div>
          </div>

          {/* Yield Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-light">Yield Breakdown</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brand-primary rounded-full"></div>
                  <span className="text-brand-light">Staking Rewards</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-light font-semibold">
                    {yieldData.stakingRewards.toLocaleString(undefined, { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })} GTT
                  </span>
                  <Badge variant="outline" className="border-brand-primary text-brand-primary">
                    58%
                  </Badge>
                </div>
              </div>
              <Progress value={58} className="h-2" />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brand-accent rounded-full"></div>
                  <span className="text-brand-light">Validator Rewards</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-light font-semibold">
                    {yieldData.validatorRewards.toLocaleString(undefined, { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })} GTT
                  </span>
                  <Badge variant="outline" className="border-brand-accent text-brand-accent">
                    27%
                  </Badge>
                </div>
              </div>
              <Progress value={27} className="h-2" />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brand-warning rounded-full"></div>
                  <span className="text-brand-light">Performance Bonus</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-light font-semibold">
                    {yieldData.performanceBonus.toLocaleString(undefined, { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })} GTT
                  </span>
                  <Badge variant="outline" className="border-brand-warning text-brand-warning">
                    15%
                  </Badge>
                </div>
              </div>
              <Progress value={15} className="h-2" />
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-brand-surface">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-brand-primary" />
              <div>
                <div className="text-sm text-brand-light/60">Next Payout</div>
                <div className="text-brand-light font-medium">2 days, 14 hours</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-brand-accent" />
              <div>
                <div className="text-sm text-brand-light/60">Yield Rank</div>
                <div className="text-brand-light font-medium">#47 of 1,234</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}