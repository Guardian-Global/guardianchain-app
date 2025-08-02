import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  Target,
  Brain,
  Award,
  Briefcase,
  PieChart,
  Activity,
} from "lucide-react";
import EnhancedLogoDisplay from "@/components/assets/EnhancedLogoDisplay";
import SupabaseHeroBackground from "@/components/assets/SupabaseHeroBackground";

export function EnhancedFounderDashboard() {
  const businessMetrics = {
    monthlyRevenue: "$127,850",
    growthRate: "+23.5%",
    customerAcquisition: 1247,
    churnRate: "2.1%",
    marketValue: "$25.8M",
    userEngagement: "94.2%",
    profitMargin: "67%",
    burnRate: "$45K/month",
  };

  const strategicInitiatives = [
    {
      title: "Enterprise Expansion",
      progress: 78,
      status: "On Track",
      budget: "$250K",
    },
    { title: "AI Integration", progress: 92, status: "Ahead", budget: "$180K" },
    {
      title: "Global Markets",
      progress: 45,
      status: "Planning",
      budget: "$500K",
    },
    {
      title: "Security Audit",
      progress: 88,
      status: "Nearing Complete",
      budget: "$75K",
    },
  ];

  const keyMetrics = [
    {
      label: "Total Users",
      value: "15,247",
      change: "+8.2%",
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Monthly Revenue",
      value: "$127,850",
      change: "+15.3%",
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      label: "Market Cap",
      value: "$25.8M",
      change: "+23.5%",
      icon: TrendingUp,
      color: "text-purple-400",
    },
    {
      label: "User Engagement",
      value: "94.2%",
      change: "+2.1%",
      icon: Activity,
      color: "text-yellow-400",
    },
  ];

  return (
    <SupabaseHeroBackground overlay={true} className="min-h-screen">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <EnhancedLogoDisplay
              size="lg"
              variant="full"
              className="justify-center"
            />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                FOUNDER STRATEGIC DASHBOARD
              </h1>
              <p className="text-xl text-slate-300">
                Business Intelligence & Strategic Oversight • Welcome,{" "}
                {user?.firstName}
              </p>
            </div>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {keyMetrics.map((metric) => (
              <Card
                key={metric.label}
                className="bg-slate-800/50 border-slate-700"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{metric.label}</p>
                      <p className="text-2xl font-bold text-white">
                        {metric.value}
                      </p>
                      <p
                        className={`text-sm ${metric.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                      >
                        {metric.change} vs last month
                      </p>
                    </div>
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Strategic Dashboard Tabs */}
          <Tabs defaultValue="business" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800">
              <TabsTrigger value="business" className="text-white">
                Business
              </TabsTrigger>
              <TabsTrigger value="strategy" className="text-white">
                Strategy
              </TabsTrigger>
              <TabsTrigger value="finance" className="text-white">
                Finance
              </TabsTrigger>
              <TabsTrigger value="market" className="text-white">
                Market
              </TabsTrigger>
              <TabsTrigger value="team" className="text-white">
                Team
              </TabsTrigger>
            </TabsList>

            <TabsContent value="business" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue Overview */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-400" />
                      Revenue Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-green-400">
                      {businessMetrics.monthlyRevenue}
                    </div>
                    <div className="text-sm text-slate-400">
                      Monthly Recurring Revenue
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-600">
                        {businessMetrics.growthRate}
                      </Badge>
                      <span className="text-sm text-slate-400">
                        Growth Rate
                      </span>
                    </div>
                    <Button className="w-full">View Revenue Analytics</Button>
                  </CardContent>
                </Card>

                {/* Customer Metrics */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-400" />
                      Customer Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">New Customers:</span>
                        <span className="text-white">
                          {businessMetrics.customerAcquisition.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Churn Rate:</span>
                        <span className="text-green-400">
                          {businessMetrics.churnRate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Engagement:</span>
                        <span className="text-white">
                          {businessMetrics.userEngagement}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Customer Analysis
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Business Health Score */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
                    Business Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        A+
                      </div>
                      <div className="text-sm text-slate-400">
                        Overall Score
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        92%
                      </div>
                      <div className="text-sm text-slate-400">
                        Customer Satisfaction
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        78%
                      </div>
                      <div className="text-sm text-slate-400">Market Share</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        85%
                      </div>
                      <div className="text-sm text-slate-400">
                        Operational Efficiency
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategy" className="space-y-6">
              {/* Strategic Initiatives */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="h-5 w-5 mr-2 text-green-400" />
                    Strategic Initiatives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategicInitiatives.map((initiative, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-slate-700/50 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">
                            {initiative.title}
                          </h3>
                          <Badge
                            variant={
                              initiative.status === "Ahead"
                                ? "default"
                                : initiative.status === "On Track"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {initiative.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">
                            Progress: {initiative.progress}%
                          </span>
                          <span className="text-slate-400">
                            Budget: {initiative.budget}
                          </span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${initiative.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Market Positioning */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-blue-400" />
                      Market Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-blue-400">#2</div>
                    <div className="text-sm text-slate-400">Market Ranking</div>
                    <div className="text-lg text-white">
                      {businessMetrics.marketValue}
                    </div>
                    <div className="text-sm text-slate-400">
                      Current Valuation
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-purple-400" />
                      Innovation Index
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-purple-400">
                      94/100
                    </div>
                    <div className="text-sm text-slate-400">
                      Innovation Score
                    </div>
                    <Badge className="bg-purple-600">Industry Leader</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="finance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Financial Health */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-green-400" />
                      Profit Margin
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400">
                      {businessMetrics.profitMargin}
                    </div>
                    <div className="text-sm text-slate-400">Current Margin</div>
                    <div className="text-sm text-green-400 mt-2">
                      Above Industry Average
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                      Burn Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-400">
                      {businessMetrics.burnRate}
                    </div>
                    <div className="text-sm text-slate-400">Monthly Burn</div>
                    <div className="text-sm text-blue-400 mt-2">
                      18 months runway
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Award className="h-5 w-5 mr-2 text-yellow-400" />
                      Valuation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-400">
                      {businessMetrics.marketValue}
                    </div>
                    <div className="text-sm text-slate-400">
                      Current Valuation
                    </div>
                    <div className="text-sm text-yellow-400 mt-2">
                      Series A Ready
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Actions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Financial Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button className="bg-gradient-to-r from-green-600 to-blue-600">
                      Generate Financial Report
                    </Button>
                    <Button variant="outline">View Cash Flow</Button>
                    <Button variant="outline">Investment Analysis</Button>
                    <Button variant="outline">Budget Planning</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="market" className="space-y-6">
              {/* Market Intelligence */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-purple-400" />
                    Market Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        Market Trends
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            Blockchain Adoption:
                          </span>
                          <span className="text-green-400">+45% YoY</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            Truth Verification:
                          </span>
                          <span className="text-green-400">+78% Interest</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            Enterprise Demand:
                          </span>
                          <span className="text-green-400">+92% Growth</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        Competitive Position
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Market Share:</span>
                          <span className="text-white">23.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            Brand Recognition:
                          </span>
                          <span className="text-white">78%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            Customer Satisfaction:
                          </span>
                          <span className="text-white">94.2%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              {/* Team Performance */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-orange-400" />
                    Team Performance & Culture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">
                        4.8/5
                      </div>
                      <div className="text-sm text-slate-400">
                        Employee Satisfaction
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        12 days
                      </div>
                      <div className="text-sm text-slate-400">
                        Average Time to Hire
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">
                        95%
                      </div>
                      <div className="text-sm text-slate-400">
                        Retention Rate
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SupabaseHeroBackground>
  );
}

export default EnhancedFounderDashboard;
