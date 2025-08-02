import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Shield,
  Zap,
  Crown,
  Star,
  Sparkles,
  Brain,
  Network,
  Globe,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react";

interface AdditionalCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  marketSize: string;
  truthPotential: number;
  rewardMultiplier: number;
  urgency: "Low" | "Medium" | "High" | "Critical";
  examples: string[];
  whyEssential: string;
  color: string;
}

const ADDITIONAL_CATEGORIES: AdditionalCategory[] = [
  {
    id: "education-reformer",
    name: "Education Truth Reformer",
    icon: Brain,
    description:
      "Teachers, administrators, and education advocates exposing systemic failures",
    marketSize: "$7.3 Trillion Global Education Market",
    truthPotential: 9.2,
    rewardMultiplier: 3.5,
    urgency: "High",
    examples: [
      "Curriculum manipulation and bias exposure",
      "Educational funding fraud detection",
      "Teacher-student ratio truth verification",
      "Standardized testing corruption",
    ],
    whyEssential:
      "Education shapes society's future. Truth in education ensures informed citizens and prevents systematic indoctrination.",
    color: "from-indigo-600 to-blue-600",
  },
  {
    id: "legal-guardian",
    name: "Legal System Guardian",
    icon: Shield,
    description:
      "Lawyers, judges, and legal professionals exposing judicial corruption",
    marketSize: "$849 Billion Global Legal Services",
    truthPotential: 9.8,
    rewardMultiplier: 6.0,
    urgency: "Critical",
    examples: [
      "Judicial bias and corruption exposure",
      "Legal precedent manipulation",
      "Client confidentiality breaches",
      "Bar association misconduct",
    ],
    whyEssential:
      "Justice is the foundation of civilization. Legal truth ensures equal protection and prevents abuse of power.",
    color: "from-red-600 to-purple-600",
  },
  {
    id: "supply-chain-sentinel",
    name: "Supply Chain Truth Sentinel",
    icon: Network,
    description:
      "Logistics professionals exposing supply chain fraud and safety violations",
    marketSize: "$37.4 Trillion Global Supply Chain",
    truthPotential: 8.7,
    rewardMultiplier: 4.2,
    urgency: "High",
    examples: [
      "Product origin fraud verification",
      "Labor condition truth documentation",
      "Quality control standard breaches",
      "Environmental impact cover-ups",
    ],
    whyEssential:
      "Global supply chains affect every product we use. Truth ensures ethical sourcing and consumer safety.",
    color: "from-green-600 to-teal-600",
  },
  {
    id: "digital-sovereignty-defender",
    name: "Digital Sovereignty Defender",
    icon: Globe,
    description:
      "Tech workers exposing digital manipulation, censorship, and surveillance",
    marketSize: "$5.8 Trillion Global Tech Industry",
    truthPotential: 9.5,
    rewardMultiplier: 5.5,
    urgency: "Critical",
    examples: [
      "Algorithm bias exposure",
      "Data privacy violations",
      "Censorship mechanism revelation",
      "Surveillance program disclosure",
    ],
    whyEssential:
      "Digital platforms control information flow. Truth ensures free speech and prevents thought manipulation.",
    color: "from-cyan-600 to-blue-600",
  },
  {
    id: "humanitarian-truth-keeper",
    name: "Humanitarian Truth Keeper",
    icon: Users,
    description:
      "NGO workers and humanitarian aid professionals exposing corruption in relief efforts",
    marketSize: "$30 Billion Global Humanitarian Aid",
    truthPotential: 9.0,
    rewardMultiplier: 4.8,
    urgency: "High",
    examples: [
      "Aid distribution fraud",
      "Refugee camp condition truth",
      "Charity fund misappropriation",
      "Crisis response failures",
    ],
    whyEssential:
      "Humanitarian aid saves lives. Truth ensures resources reach those who need them most.",
    color: "from-emerald-600 to-green-600",
  },
  {
    id: "food-system-guardian",
    name: "Food System Truth Guardian",
    icon: Sparkles,
    description:
      "Agriculture and food industry professionals exposing safety and fraud issues",
    marketSize: "$8.7 Trillion Global Food Industry",
    truthPotential: 8.5,
    rewardMultiplier: 3.8,
    urgency: "High",
    examples: [
      "Food safety standard violations",
      "Pesticide contamination cover-ups",
      "Nutritional labeling fraud",
      "Factory farming condition exposure",
    ],
    whyEssential:
      "Food safety affects human health globally. Truth prevents illness and ensures quality nutrition.",
    color: "from-yellow-600 to-orange-600",
  },
  {
    id: "economic-truth-analyst",
    name: "Economic Truth Analyst",
    icon: TrendingUp,
    description:
      "Economists and financial analysts exposing market manipulation and economic deception",
    marketSize: "$421 Trillion Global Financial Assets",
    truthPotential: 9.7,
    rewardMultiplier: 7.5,
    urgency: "Critical",
    examples: [
      "Market manipulation schemes",
      "Economic data falsification",
      "Currency devaluation plots",
      "Inflation cause misrepresentation",
    ],
    whyEssential:
      "Economic truth affects global prosperity. Honest markets ensure fair wealth distribution and growth.",
    color: "from-amber-600 to-yellow-600",
  },
  {
    id: "energy-truth-pioneer",
    name: "Energy Truth Pioneer",
    icon: Zap,
    description:
      "Energy sector professionals exposing renewable vs fossil fuel deception",
    marketSize: "$6.8 Trillion Global Energy Market",
    truthPotential: 9.1,
    rewardMultiplier: 4.5,
    urgency: "High",
    examples: [
      "Renewable energy suppression",
      "Fossil fuel environmental impact hiding",
      "Energy pricing manipulation",
      "Grid efficiency cover-ups",
    ],
    whyEssential:
      "Energy powers civilization. Truth ensures sustainable development and prevents environmental destruction.",
    color: "from-lime-600 to-green-600",
  },
];

const DEPLOYMENT_PRIORITIES = [
  {
    category: "Critical Infrastructure",
    items: [
      "Legal System Guardian",
      "Economic Truth Analyst",
      "Digital Sovereignty Defender",
    ],
    reason:
      "These affect fundamental societal structures and democratic processes",
  },
  {
    category: "Human Welfare",
    items: [
      "Education Truth Reformer",
      "Humanitarian Truth Keeper",
      "Food System Truth Guardian",
    ],
    reason: "Direct impact on human health, education, and basic needs",
  },
  {
    category: "Global Systems",
    items: ["Supply Chain Truth Sentinel", "Energy Truth Pioneer"],
    reason: "These affect global trade, environment, and resource distribution",
  },
];

export default function CategoryDiscoveryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "priority">("grid");
  const { toast } = useToast();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = ADDITIONAL_CATEGORIES.find((c) => c.id === categoryId);
    toast({
      title: "Category Analyzed",
      description: `${category?.name} - Truth Potential: ${category?.truthPotential}/10`,
    });
  };

  const selectedCategoryData = ADDITIONAL_CATEGORIES.find(
    (c) => c.id === selectedCategory,
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Category Discovery & Deployment Strategy
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto">
            Essential truth verification categories missing from our current
            deployment. These represent $500+ trillion in global market value
            that needs truth protection.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center">
          <div className="flex gap-2 p-1 bg-slate-800 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
              size="sm"
            >
              Category Grid
            </Button>
            <Button
              variant={viewMode === "priority" ? "default" : "ghost"}
              onClick={() => setViewMode("priority")}
              size="sm"
            >
              Deployment Priority
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          !selectedCategory ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ADDITIONAL_CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card
                    key={category.id}
                    className="cursor-pointer hover:scale-105 transition-all duration-300 border-slate-700 hover:border-slate-600 bg-slate-800/50"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <CardHeader>
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-4`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-center text-lg">
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className="text-sm text-slate-400">
                        {category.description}
                      </p>
                      <div className="flex justify-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {category.rewardMultiplier}x GTT
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Truth: {category.truthPotential}/10
                        </Badge>
                        <div
                          className={`px-2 py-1 rounded text-xs text-white ${getUrgencyColor(
                            category.urgency,
                          )}`}
                        >
                          {category.urgency}
                        </div>
                      </div>
                      <p className="text-xs text-green-400 font-semibold">
                        {category.marketSize}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Selected Category Detail */
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(null)}
                  className="text-white border-slate-600"
                >
                  ← Back to Categories
                </Button>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedCategoryData?.color} flex items-center justify-center`}
                  >
                    {selectedCategoryData?.icon && (
                      <selectedCategoryData.icon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedCategoryData?.name}
                    </h2>
                    <p className="text-slate-400">
                      {selectedCategoryData?.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      Truth Verification Examples
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCategoryData?.examples.map((example, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg"
                        >
                          <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs font-bold text-blue-400">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm">{example}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Strategic Importance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Why This Category is Essential
                      </h4>
                      <p className="text-sm text-slate-300">
                        {selectedCategoryData?.whyEssential}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Market Size</h5>
                        <p className="text-xs text-green-400">
                          {selectedCategoryData?.marketSize}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Truth Potential</h5>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(10)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i <
                                  (selectedCategoryData?.truthPotential || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs">
                            {selectedCategoryData?.truthPotential}/10
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">
                          Reward Multiplier
                        </h5>
                        <p className="text-xs text-purple-400">
                          {selectedCategoryData?.rewardMultiplier}x GTT
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Urgency Level</h5>
                        <div
                          className={`px-2 py-1 rounded text-xs text-white w-fit ${getUrgencyColor(
                            selectedCategoryData?.urgency || "",
                          )}`}
                        >
                          {selectedCategoryData?.urgency}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        ) : (
          /* Priority View */
          <div className="space-y-6">
            {DEPLOYMENT_PRIORITIES.map((priority, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    {priority.category} (Deploy First)
                  </CardTitle>
                  <p className="text-slate-400 text-sm">{priority.reason}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {priority.items.map((item) => {
                      const category = ADDITIONAL_CATEGORIES.find(
                        (c) => c.name === item,
                      );
                      if (!category) return null;
                      const IconComponent = category.icon;

                      return (
                        <Card
                          key={item}
                          className="bg-slate-700/30 border-slate-600"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}
                              >
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">
                                  {category.name}
                                </h4>
                                <p className="text-xs text-slate-400">
                                  {category.marketSize}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="text-xs">
                                {category.truthPotential}/10 Truth
                              </Badge>
                              <div
                                className={`px-2 py-1 rounded text-xs text-white ${getUrgencyColor(
                                  category.urgency,
                                )}`}
                              >
                                {category.urgency}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-purple-400" />
                  Deployment Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  <strong>Phase 1:</strong> Deploy Critical Infrastructure
                  categories immediately - they affect democratic institutions
                  and financial systems.
                </p>
                <p className="text-slate-300">
                  <strong>Phase 2:</strong> Launch Human Welfare categories to
                  protect health, education, and basic needs.
                </p>
                <p className="text-slate-300">
                  <strong>Phase 3:</strong> Complete Global Systems categories
                  for comprehensive truth coverage.
                </p>
                <div className="text-center pt-4">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2">
                    Total Market Impact: $500+ Trillion Protected
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
