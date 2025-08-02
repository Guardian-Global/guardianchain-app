import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Cpu,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Globe,
  Target,
  Activity,
  BarChart3,
  PieChart,
  FileText,
  Lock,
  Coins,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Archive,
  Vault,
  Award,
  Eye,
  History,
  Microchip,
  Rocket,
  Atom,
  Binary,
  Database,
  Network,
} from "lucide-react";

interface TechnologicalLegacy {
  id: string;
  projectName: string;
  legacyType:
    | "ai"
    | "quantum"
    | "biotech"
    | "nanotech"
    | "fusion"
    | "space"
    | "crypto"
    | "neural";
  industry: string;
  stakingPeriod: "25-year" | "50-year" | "100-year" | "200-year";
  stakingAmount: number;
  projectedValue: number;
  innovatorCount: number;
  patentsProtected: number;
  researchDataTB: number;
  globalImpact: number; // people affected
  publicAccess: boolean;
  ipProtectionLevel:
    | "open_source"
    | "patent_protected"
    | "trade_secret"
    | "classified";
  createdDate: string;
  maturityDate: string;
  status: "developing" | "breakthrough" | "commercialized";
}

interface LegacyTemplate {
  name: string;
  description: string;
  minStaking: number;
  technologyScope: string[];
  features: string[];
  roi: string;
  category:
    | "ai"
    | "quantum"
    | "biotech"
    | "nanotech"
    | "fusion"
    | "space"
    | "crypto"
    | "neural";
}

export function TechnologicalLegacyCapsule() {
  const [activeTab, setActiveTab] = useState<
    "create" | "portfolio" | "templates" | "innovation"
  >("create");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const [legacyTemplates] = useState<LegacyTemplate[]>([
    {
      name: "AI Superintelligence Archive",
      description:
        "Comprehensive documentation of artificial general intelligence development and ethical AI frameworks",
      minStaking: 5000000000, // $5B
      technologyScope: [
        "AGI algorithms",
        "Neural architectures",
        "Ethical frameworks",
        "Safety protocols",
      ],
      features: [
        "AI Model Archives",
        "Training Data Vaults",
        "Safety Protocol Documentation",
        "Ethical Guidelines",
      ],
      roi: "12,567% over 200 years",
      category: "ai",
    },
    {
      name: "Quantum Computing Legacy",
      description:
        "Preservation of quantum computing breakthroughs, algorithms, and quantum supremacy achievements",
      minStaking: 3000000000, // $3B
      technologyScope: [
        "Quantum algorithms",
        "Hardware designs",
        "Error correction",
        "Quantum cryptography",
      ],
      features: [
        "Quantum Algorithm Library",
        "Hardware Blueprints",
        "Research Data Archive",
        "Patent Portfolio",
      ],
      roi: "8,947% over 100 years",
      category: "quantum",
    },
    {
      name: "Fusion Energy Breakthrough",
      description:
        "Documentation of fusion energy achievements and clean energy revolution technologies",
      minStaking: 10000000000, // $10B
      technologyScope: [
        "Fusion reactor designs",
        "Plasma physics",
        "Materials science",
        "Energy systems",
      ],
      features: [
        "Reactor Design Archive",
        "Plasma Physics Data",
        "Materials Research",
        "Energy Grid Integration",
      ],
      roi: "25,847% over 200 years",
      category: "fusion",
    },
    {
      name: "Biotechnology Revolution",
      description:
        "Comprehensive archive of biotechnology breakthroughs including gene therapy and synthetic biology",
      minStaking: 7500000000, // $7.5B
      technologyScope: [
        "Gene editing",
        "Synthetic biology",
        "Protein engineering",
        "Therapeutic development",
      ],
      features: [
        "Genetic Libraries",
        "Protein Databases",
        "Therapeutic Blueprints",
        "Clinical Trial Data",
      ],
      roi: "15,234% over 100 years",
      category: "biotech",
    },
    {
      name: "Space Colonization Archive",
      description:
        "Preservation of space exploration technologies, colonization plans, and interplanetary systems",
      minStaking: 15000000000, // $15B
      technologyScope: [
        "Spacecraft design",
        "Life support systems",
        "Terraforming tech",
        "Space habitats",
      ],
      features: [
        "Mission Archives",
        "Technology Blueprints",
        "Colonization Plans",
        "Resource Mapping",
      ],
      roi: "34,567% over 200 years",
      category: "space",
    },
  ]);

  const [activeTechLegacies] = useState<TechnologicalLegacy[]>([
    {
      id: "1",
      projectName: "OpenAI Superintelligence Project",
      legacyType: "ai",
      industry: "Artificial Intelligence",
      stakingPeriod: "100-year",
      stakingAmount: 8500000000,
      projectedValue: 760475000000,
      innovatorCount: 1247,
      patentsProtected: 8943,
      researchDataTB: 150000,
      globalImpact: 8000000000,
      publicAccess: true,
      ipProtectionLevel: "patent_protected",
      createdDate: "2024-11-30",
      maturityDate: "2124-11-30",
      status: "breakthrough",
    },
    {
      id: "2",
      projectName: "ITER Fusion Legacy",
      legacyType: "fusion",
      industry: "Clean Energy",
      stakingPeriod: "200-year",
      stakingAmount: 12000000000,
      projectedValue: 3102480000000,
      innovatorCount: 2847,
      patentsProtected: 15672,
      researchDataTB: 280000,
      globalImpact: 7500000000,
      publicAccess: false,
      ipProtectionLevel: "trade_secret",
      createdDate: "2024-06-21",
      maturityDate: "2224-06-21",
      status: "developing",
    },
    {
      id: "3",
      projectName: "CRISPR Gene Editing Archive",
      legacyType: "biotech",
      industry: "Biotechnology",
      stakingPeriod: "100-year",
      stakingAmount: 6750000000,
      projectedValue: 602887500000,
      innovatorCount: 945,
      patentsProtected: 12847,
      researchDataTB: 95000,
      globalImpact: 2000000000,
      publicAccess: true,
      ipProtectionLevel: "patent_protected",
      createdDate: "2024-09-15",
      maturityDate: "2124-09-15",
      status: "commercialized",
    },
  ]);

  const [createForm, setCreateForm] = useState({
    projectName: "",
    legacyType: "ai",
    industry: "",
    stakingPeriod: "100-year",
    stakingAmount: 1000000000,
    innovatorCount: 50,
    publicAccess: false,
    ipProtectionLevel: "patent_protected",
    projectDescription: "",
    technologyBreakthrough: "",
    commercializationPlan: "",
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const getLegacyTypeColor = (type: string) => {
    switch (type) {
      case "ai":
        return "bg-purple-600/20 text-purple-400";
      case "quantum":
        return "bg-blue-600/20 text-blue-400";
      case "biotech":
        return "bg-green-600/20 text-green-400";
      case "nanotech":
        return "bg-yellow-600/20 text-yellow-400";
      case "fusion":
        return "bg-orange-600/20 text-orange-400";
      case "space":
        return "bg-indigo-600/20 text-indigo-400";
      case "crypto":
        return "bg-cyan-600/20 text-cyan-400";
      case "neural":
        return "bg-pink-600/20 text-pink-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  const getLegacyTypeIcon = (type: string) => {
    switch (type) {
      case "ai":
        return <Cpu className="h-5 w-5" />;
      case "quantum":
        return <Atom className="h-5 w-5" />;
      case "biotech":
        return <Zap className="h-5 w-5" />;
      case "nanotech":
        return <Microchip className="h-5 w-5" />;
      case "fusion":
        return <Activity className="h-5 w-5" />;
      case "space":
        return <Rocket className="h-5 w-5" />;
      case "crypto":
        return <Binary className="h-5 w-5" />;
      case "neural":
        return <Network className="h-5 w-5" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };

  const calculateProjectedValue = (staking: number, years: number) => {
    // Technological legacy appreciation: 15.67% annually compounded (technology value increase)
    return staking * Math.pow(1.1567, years);
  };

  const totalPatents = activeTechLegacies.reduce(
    (sum, legacy) => sum + legacy.patentsProtected,
    0,
  );
  const totalResearchData = activeTechLegacies.reduce(
    (sum, legacy) => sum + legacy.researchDataTB,
    0,
  );
  const totalGlobalImpact = activeTechLegacies.reduce(
    (sum, legacy) => sum + legacy.globalImpact,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Technological Legacy Capsules
          </h2>
          <p className="text-slate-400">
            Preserve breakthrough technologies and innovations with exponential
            value appreciation over generations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
            {formatNumber(totalPatents)} Patents
          </Badge>
          <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
            {activeTechLegacies.length} Breakthrough Projects
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Innovation Value</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(
                    activeTechLegacies.reduce(
                      (sum, legacy) => sum + legacy.stakingAmount,
                      0,
                    ),
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <FileText className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Patents Protected</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(totalPatents)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Database className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Research Data (TB)</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(totalResearchData)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Globe className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Global Impact</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(totalGlobalImpact / 1000000)}M
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
        <Button
          size="sm"
          variant={activeTab === "create" ? "default" : "ghost"}
          onClick={() => setActiveTab("create")}
          className="flex-1"
        >
          Create Tech Legacy
        </Button>
        <Button
          size="sm"
          variant={activeTab === "portfolio" ? "default" : "ghost"}
          onClick={() => setActiveTab("portfolio")}
          className="flex-1"
        >
          Active Projects
        </Button>
        <Button
          size="sm"
          variant={activeTab === "templates" ? "default" : "ghost"}
          onClick={() => setActiveTab("templates")}
          className="flex-1"
        >
          Templates
        </Button>
        <Button
          size="sm"
          variant={activeTab === "innovation" ? "default" : "ghost"}
          onClick={() => setActiveTab("innovation")}
          className="flex-1"
        >
          Innovation Analytics
        </Button>
      </div>

      {/* Content Sections */}
      {activeTab === "create" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">
            Create Technological Legacy Capsule
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Technology Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Technology Project Name
                  </label>
                  <Input
                    value={createForm.projectName}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        projectName: e.target.value,
                      })
                    }
                    placeholder="Enter breakthrough technology name"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Technology Type
                  </label>
                  <select
                    value={createForm.legacyType}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        legacyType: e.target.value as any,
                      })
                    }
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    <option value="ai">Artificial Intelligence</option>
                    <option value="quantum">Quantum Computing</option>
                    <option value="biotech">Biotechnology</option>
                    <option value="nanotech">Nanotechnology</option>
                    <option value="fusion">Fusion Energy</option>
                    <option value="space">Space Technology</option>
                    <option value="crypto">Cryptographic Systems</option>
                    <option value="neural">Neural Interfaces</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Industry/Sector
                  </label>
                  <Input
                    value={createForm.industry}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, industry: e.target.value })
                    }
                    placeholder="e.g., Healthcare, Energy, Computing"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Innovation Staking & IP Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Innovation Period
                  </label>
                  <select
                    value={createForm.stakingPeriod}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        stakingPeriod: e.target.value as any,
                      })
                    }
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    <option value="25-year">25 Years</option>
                    <option value="50-year">50 Years</option>
                    <option value="100-year">100 Years</option>
                    <option value="200-year">200 Years</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Innovation Staking (GTT)
                  </label>
                  <Input
                    type="number"
                    value={createForm.stakingAmount}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        stakingAmount: parseInt(e.target.value),
                      })
                    }
                    placeholder="Minimum: 1,000,000,000 GTT"
                    className="bg-slate-700 border-slate-600"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Projected Value:{" "}
                    {formatCurrency(
                      calculateProjectedValue(createForm.stakingAmount, 100),
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Innovator Count
                  </label>
                  <Input
                    type="number"
                    value={createForm.innovatorCount}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        innovatorCount: parseInt(e.target.value),
                      })
                    }
                    placeholder="10-5000 innovators"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    IP Protection Level
                  </label>
                  <select
                    value={createForm.ipProtectionLevel}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        ipProtectionLevel: e.target.value as any,
                      })
                    }
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    <option value="open_source">Open Source</option>
                    <option value="patent_protected">Patent Protected</option>
                    <option value="trade_secret">Trade Secret</option>
                    <option value="classified">Classified</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Technology Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Technology Description
                </label>
                <Textarea
                  value={createForm.projectDescription}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      projectDescription: e.target.value,
                    })
                  }
                  placeholder="Describe the breakthrough technology and its revolutionary potential..."
                  className="bg-slate-700 border-slate-600 h-32"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Breakthrough Innovation
                </label>
                <Textarea
                  value={createForm.technologyBreakthrough}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      technologyBreakthrough: e.target.value,
                    })
                  }
                  placeholder="Detail the specific breakthrough and technical innovation..."
                  className="bg-slate-700 border-slate-600 h-24"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Commercialization Plan
                </label>
                <Textarea
                  value={createForm.commercializationPlan}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      commercializationPlan: e.target.value,
                    })
                  }
                  placeholder="Strategy for bringing technology to market and scaling globally..."
                  className="bg-slate-700 border-slate-600 h-24"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={createForm.publicAccess}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        publicAccess: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-slate-300">
                    Enable Research Access
                  </span>
                </label>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Cpu className="h-4 w-4 mr-2" />
                Create Technological Legacy Capsule
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "portfolio" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Active Technology Legacy Projects
          </h3>

          <div className="grid gap-6">
            {activeTechLegacies.map((legacy) => (
              <Card key={legacy.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`p-3 rounded-lg ${getLegacyTypeColor(legacy.legacyType)}`}
                        >
                          {getLegacyTypeIcon(legacy.legacyType)}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">
                            {legacy.projectName}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {legacy.industry}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={getLegacyTypeColor(legacy.legacyType)}
                            >
                              {legacy.legacyType.toUpperCase()}
                            </Badge>
                            <Badge
                              className={`${
                                legacy.ipProtectionLevel === "classified"
                                  ? "bg-red-600/20 text-red-400"
                                  : legacy.ipProtectionLevel === "trade_secret"
                                    ? "bg-orange-600/20 text-orange-400"
                                    : legacy.ipProtectionLevel ===
                                        "patent_protected"
                                      ? "bg-blue-600/20 text-blue-400"
                                      : "bg-green-600/20 text-green-400"
                              }`}
                            >
                              {legacy.ipProtectionLevel
                                .replace("_", " ")
                                .toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            Innovation Value
                          </p>
                          <p className="text-lg font-bold text-white">
                            {formatCurrency(legacy.stakingAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Patents</p>
                          <p className="text-lg font-bold text-purple-400">
                            {formatNumber(legacy.patentsProtected)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Research Data
                          </p>
                          <p className="text-lg font-bold text-white">
                            {formatNumber(legacy.researchDataTB)} TB
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Global Impact
                          </p>
                          <p className="text-lg font-bold text-white">
                            {formatNumber(legacy.globalImpact / 1000000)}M
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-400">
                            Innovation Until: {legacy.maturityDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-slate-400">
                            {legacy.innovatorCount} Innovators
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <Badge
                        className={`mb-3 ${
                          legacy.status === "breakthrough"
                            ? "bg-green-600/20 text-green-400"
                            : legacy.status === "developing"
                              ? "bg-yellow-600/20 text-yellow-400"
                              : "bg-blue-600/20 text-blue-400"
                        }`}
                      >
                        {legacy.status.toUpperCase()}
                      </Badge>
                      <div className="mb-3">
                        <p className="text-sm text-slate-400">
                          Projected Value
                        </p>
                        <p className="text-xl font-bold text-green-400">
                          {formatCurrency(legacy.projectedValue)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline">
                          View Research
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 w-full"
                        >
                          Manage Innovation
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Technology Legacy Templates
          </h3>

          <div className="grid gap-6">
            {legacyTemplates.map((template, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`p-3 rounded-lg ${getLegacyTypeColor(template.category)}`}
                        >
                          {getLegacyTypeIcon(template.category)}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">
                            {template.name}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {template.description}
                          </p>
                        </div>
                        <Badge
                          className={getLegacyTypeColor(template.category)}
                        >
                          {template.category.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            Minimum Staking
                          </p>
                          <p className="text-lg font-bold text-white">
                            {formatCurrency(template.minStaking)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Projected ROI
                          </p>
                          <p className="text-lg font-bold text-green-400">
                            {template.roi}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-slate-500 mb-2">
                          Technology Scope
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {template.technologyScope.map((scope, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 mb-2">
                          Template Features
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {template.features.map((feature, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <Button
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => setSelectedTemplate(template.name)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "innovation" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">
            Innovation Analytics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-purple-400" />
                  Innovation Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Patents Protected</span>
                    <span className="text-purple-400 font-bold">
                      {formatNumber(totalPatents)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Research Data (TB)</span>
                    <span className="text-blue-400 font-bold">
                      {formatNumber(totalResearchData)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Global Impact</span>
                    <span className="text-green-400 font-bold">
                      {formatNumber(totalGlobalImpact / 1000000)}M people
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Innovation Value</span>
                    <span className="text-white font-medium">
                      {formatCurrency(
                        activeTechLegacies.reduce(
                          (sum, legacy) => sum + legacy.stakingAmount,
                          0,
                        ),
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  IP Protection Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Patent Protected</span>
                    <span className="text-blue-400 font-bold">
                      {
                        activeTechLegacies.filter(
                          (l) => l.ipProtectionLevel === "patent_protected",
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trade Secrets</span>
                    <span className="text-orange-400 font-bold">
                      {
                        activeTechLegacies.filter(
                          (l) => l.ipProtectionLevel === "trade_secret",
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Open Source</span>
                    <span className="text-green-400 font-bold">
                      {
                        activeTechLegacies.filter(
                          (l) => l.ipProtectionLevel === "open_source",
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Classified</span>
                    <span className="text-red-400 font-bold">
                      {
                        activeTechLegacies.filter(
                          (l) => l.ipProtectionLevel === "classified",
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Technological Innovation Leadership
                  </h4>
                  <p className="text-purple-300 mb-4">
                    Protecting {formatNumber(totalPatents)} patents with{" "}
                    {formatNumber(totalResearchData)} TB research data impacting{" "}
                    {formatNumber(totalGlobalImpact / 1000000)}M people globally
                  </p>
                  <div className="flex items-center gap-4">
                    <ArrowUpRight className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-green-300">
                      15,567% average technology value appreciation over
                      100-year periods
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">
                    Total Innovation Value
                  </p>
                  <p className="text-3xl font-bold text-green-400">
                    {formatCurrency(
                      activeTechLegacies.reduce(
                        (sum, legacy) => sum + legacy.projectedValue,
                        0,
                      ),
                    )}
                  </p>
                  <p className="text-sm text-green-300">
                    Projected Technology Value
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
