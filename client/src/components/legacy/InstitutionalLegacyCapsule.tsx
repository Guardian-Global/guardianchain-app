import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  Crown,
  Shield,
  Globe,
  Target,
  Zap,
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
} from "lucide-react";

interface InstitutionalLegacy {
  id: string;
  institutionName: string;
  institutionType:
    | "corporation"
    | "government"
    | "foundation"
    | "university"
    | "ngo";
  capsuleType: "leadership" | "innovation" | "impact" | "crisis" | "milestone";
  stakingPeriod: "25-year" | "50-year" | "100-year" | "perpetual";
  stakingAmount: number;
  projectedValue: number;
  trusteeCount: number;
  publicAccess: boolean;
  complianceLevel: "basic" | "enterprise" | "government";
  createdDate: string;
  unlockDate: string;
  status: "active" | "locked" | "inherited";
}

interface LegacyTemplate {
  name: string;
  description: string;
  minStaking: number;
  targetAudience: string;
  features: string[];
  roi: string;
  category: "leadership" | "innovation" | "crisis" | "milestone";
}

export function InstitutionalLegacyCapsule() {
  const [activeTab, setActiveTab] = useState<
    "create" | "portfolio" | "templates" | "governance"
  >("create");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const [legacyTemplates] = useState<LegacyTemplate[]>([
    {
      name: "CEO Legacy Vault",
      description:
        "Comprehensive leadership documentation for Fortune 500 CEOs and C-suite executives",
      minStaking: 50000000, // $50M
      targetAudience: "Fortune 500 Companies, Executive Boards",
      features: [
        "Strategic Decision Archive",
        "Leadership Philosophy",
        "Crisis Management Records",
        "Succession Planning",
      ],
      roi: "847% over 100 years",
      category: "leadership",
    },
    {
      name: "Innovation Patent Archive",
      description:
        "Institutional R&D documentation and patent legacy for technology companies",
      minStaking: 25000000, // $25M
      targetAudience: "Tech Companies, Research Institutions",
      features: [
        "Patent Documentation",
        "R&D Process Records",
        "Innovation Timeline",
        "Technical Knowledge Transfer",
      ],
      roi: "1,240% over 50 years",
      category: "innovation",
    },
    {
      name: "Government Policy Legacy",
      description:
        "Official government decision-making records and policy development documentation",
      minStaking: 100000000, // $100M
      targetAudience: "Government Agencies, Sovereign Nations",
      features: [
        "Policy Development Records",
        "Decision Rationale Archive",
        "Public Impact Analysis",
        "Historical Context",
      ],
      roi: "567% over 100 years",
      category: "milestone",
    },
    {
      name: "Crisis Response Archive",
      description:
        "Institutional crisis management and response documentation for future preparedness",
      minStaking: 75000000, // $75M
      targetAudience: "Emergency Response Organizations, Corporations",
      features: [
        "Crisis Timeline Documentation",
        "Response Strategy Archive",
        "Lessons Learned Database",
        "Recovery Protocols",
      ],
      roi: "923% over 25 years",
      category: "crisis",
    },
  ]);

  const [activeLegacies] = useState<InstitutionalLegacy[]>([
    {
      id: "1",
      institutionName: "Goldman Sachs",
      institutionType: "corporation",
      capsuleType: "leadership",
      stakingPeriod: "100-year",
      stakingAmount: 75000000,
      projectedValue: 635250000,
      trusteeCount: 12,
      publicAccess: false,
      complianceLevel: "enterprise",
      createdDate: "2024-06-15",
      unlockDate: "2124-06-15",
      status: "active",
    },
    {
      id: "2",
      institutionName: "U.S. Department of Treasury",
      institutionType: "government",
      capsuleType: "crisis",
      stakingPeriod: "perpetual",
      stakingAmount: 150000000,
      projectedValue: 1275000000,
      trusteeCount: 25,
      publicAccess: true,
      complianceLevel: "government",
      createdDate: "2024-03-10",
      unlockDate: "Perpetual",
      status: "locked",
    },
    {
      id: "3",
      institutionName: "MIT Technology Review",
      institutionType: "university",
      capsuleType: "innovation",
      stakingPeriod: "50-year",
      stakingAmount: 40000000,
      projectedValue: 496000000,
      trusteeCount: 8,
      publicAccess: true,
      complianceLevel: "enterprise",
      createdDate: "2024-09-22",
      unlockDate: "2074-09-22",
      status: "active",
    },
  ]);

  const [createForm, setCreateForm] = useState({
    institutionName: "",
    institutionType: "corporation",
    capsuleType: "leadership",
    stakingPeriod: "100-year",
    stakingAmount: 50000000,
    trusteeCount: 5,
    publicAccess: false,
    complianceLevel: "enterprise",
    legacyContent: "",
    successorInstructions: "",
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

  const getInstitutionTypeColor = (type: string) => {
    switch (type) {
      case "corporation":
        return "bg-blue-600/20 text-blue-400";
      case "government":
        return "bg-purple-600/20 text-purple-400";
      case "foundation":
        return "bg-green-600/20 text-green-400";
      case "university":
        return "bg-yellow-600/20 text-yellow-400";
      case "ngo":
        return "bg-red-600/20 text-red-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  const getCapsuleTypeColor = (type: string) => {
    switch (type) {
      case "leadership":
        return "bg-purple-600/20 text-purple-400";
      case "innovation":
        return "bg-blue-600/20 text-blue-400";
      case "impact":
        return "bg-green-600/20 text-green-400";
      case "crisis":
        return "bg-red-600/20 text-red-400";
      case "milestone":
        return "bg-yellow-600/20 text-yellow-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  const calculateProjectedValue = (staking: number, years: number) => {
    // Institutional legacy appreciation: 8.47% annually compounded
    return staking * Math.pow(1.0847, years);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Institutional Legacy Capsules
          </h2>
          <p className="text-slate-400">
            Preserve institutional knowledge and leadership legacy with
            multi-generational value appreciation
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
            Enterprise Grade
          </Badge>
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
            {activeLegacies.length} Active Legacies
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
                <p className="text-sm text-slate-400">Total Staked Value</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(
                    activeLegacies.reduce(
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
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Projected Value</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(
                    activeLegacies.reduce(
                      (sum, legacy) => sum + legacy.projectedValue,
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
                <Building2 className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Institutions</p>
                <p className="text-xl font-bold text-white">
                  {activeLegacies.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Users className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Trustees</p>
                <p className="text-xl font-bold text-white">
                  {activeLegacies.reduce(
                    (sum, legacy) => sum + legacy.trusteeCount,
                    0,
                  )}
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
          Create Legacy
        </Button>
        <Button
          size="sm"
          variant={activeTab === "portfolio" ? "default" : "ghost"}
          onClick={() => setActiveTab("portfolio")}
          className="flex-1"
        >
          Active Legacies
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
          variant={activeTab === "governance" ? "default" : "ghost"}
          onClick={() => setActiveTab("governance")}
          className="flex-1"
        >
          Governance
        </Button>
      </div>

      {/* Content Sections */}
      {activeTab === "create" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">
            Create Institutional Legacy Capsule
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Institution Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Institution Name
                  </label>
                  <Input
                    value={createForm.institutionName}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        institutionName: e.target.value,
                      })
                    }
                    placeholder="Enter institution name"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Institution Type
                  </label>
                  <select
                    value={createForm.institutionType}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        institutionType: e.target.value as any,
                      })
                    }
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    <option value="corporation">Corporation</option>
                    <option value="government">Government</option>
                    <option value="foundation">Foundation</option>
                    <option value="university">University</option>
                    <option value="ngo">NGO</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Legacy Type
                  </label>
                  <select
                    value={createForm.capsuleType}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        capsuleType: e.target.value as any,
                      })
                    }
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    <option value="leadership">Leadership Legacy</option>
                    <option value="innovation">Innovation Archive</option>
                    <option value="impact">Impact Documentation</option>
                    <option value="crisis">Crisis Response</option>
                    <option value="milestone">Institutional Milestones</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Staking & Governance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Staking Period
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
                    <option value="perpetual">Perpetual</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Staking Amount (GTT)
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
                    placeholder="Minimum: 10,000,000 GTT"
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
                    Trustee Count
                  </label>
                  <Input
                    type="number"
                    value={createForm.trusteeCount}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        trusteeCount: parseInt(e.target.value),
                      })
                    }
                    placeholder="5-50 trustees"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Legacy Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Legacy Documentation
                </label>
                <Textarea
                  value={createForm.legacyContent}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      legacyContent: e.target.value,
                    })
                  }
                  placeholder="Document the institutional knowledge, decisions, and legacy to be preserved..."
                  className="bg-slate-700 border-slate-600 h-32"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Successor Instructions
                </label>
                <Textarea
                  value={createForm.successorInstructions}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      successorInstructions: e.target.value,
                    })
                  }
                  placeholder="Instructions for future institutional leaders and stakeholders..."
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
                    Enable Public Access
                  </span>
                </label>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Vault className="h-4 w-4 mr-2" />
                Create Institutional Legacy Capsule
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "portfolio" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Active Institutional Legacies
          </h3>

          <div className="grid gap-6">
            {activeLegacies.map((legacy) => (
              <Card key={legacy.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-purple-600/20 rounded-lg">
                          <Building2 className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">
                            {legacy.institutionName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={getInstitutionTypeColor(
                                legacy.institutionType,
                              )}
                            >
                              {legacy.institutionType.toUpperCase()}
                            </Badge>
                            <Badge
                              className={getCapsuleTypeColor(
                                legacy.capsuleType,
                              )}
                            >
                              {legacy.capsuleType.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500">Staked Value</p>
                          <p className="text-lg font-bold text-white">
                            {formatCurrency(legacy.stakingAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Projected Value
                          </p>
                          <p className="text-lg font-bold text-green-400">
                            {formatCurrency(legacy.projectedValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Trustees</p>
                          <p className="text-lg font-bold text-white">
                            {legacy.trusteeCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Period</p>
                          <p className="text-lg font-bold text-white">
                            {legacy.stakingPeriod}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-400">
                            Unlock: {legacy.unlockDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {legacy.publicAccess ? (
                            <Eye className="h-4 w-4 text-green-400" />
                          ) : (
                            <Shield className="h-4 w-4 text-red-400" />
                          )}
                          <span className="text-sm text-slate-400">
                            {legacy.publicAccess ? "Public Access" : "Private"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <Badge
                        className={`mb-3 ${
                          legacy.status === "active"
                            ? "bg-green-600/20 text-green-400"
                            : legacy.status === "locked"
                              ? "bg-yellow-600/20 text-yellow-400"
                              : "bg-blue-600/20 text-blue-400"
                        }`}
                      >
                        {legacy.status.toUpperCase()}
                      </Badge>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 w-full"
                        >
                          Manage
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
            Institutional Legacy Templates
          </h3>

          <div className="grid gap-6">
            {legacyTemplates.map((template, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-blue-600/20 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-400" />
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
                          className={getCapsuleTypeColor(template.category)}
                        >
                          {template.category.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
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
                            Target Audience
                          </p>
                          <p className="text-sm text-slate-400">
                            {template.targetAudience}
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
                        className="bg-blue-600 hover:bg-blue-700"
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

      {activeTab === "governance" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">
            Legacy Governance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Trustee Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Trustees</span>
                    <span className="text-white font-medium">
                      {activeLegacies.reduce(
                        (sum, legacy) => sum + legacy.trusteeCount,
                        0,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Institutions</span>
                    <span className="text-white font-medium">
                      {activeLegacies.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Governance Proposals</span>
                    <span className="text-green-400 font-medium">
                      12 Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Enterprise Grade</span>
                    <span className="text-green-400 font-medium">
                      {
                        activeLegacies.filter(
                          (l) => l.complianceLevel === "enterprise",
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Government Grade</span>
                    <span className="text-green-400 font-medium">
                      {
                        activeLegacies.filter(
                          (l) => l.complianceLevel === "government",
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Audit Status</span>
                    <span className="text-green-400 font-medium">
                      All Compliant
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-purple-900/50 to-green-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Institutional Legacy Excellence
                  </h4>
                  <p className="text-purple-300 mb-4">
                    Preserving institutional knowledge with{" "}
                    {formatCurrency(
                      activeLegacies.reduce(
                        (sum, legacy) => sum + legacy.stakingAmount,
                        0,
                      ),
                    )}{" "}
                    in staked value across Fortune 500 and government
                    institutions
                  </p>
                  <div className="flex items-center gap-4">
                    <ArrowUpRight className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-green-300">
                      847% average value appreciation over 100-year periods
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Total Legacy Value</p>
                  <p className="text-3xl font-bold text-green-400">
                    {formatCurrency(
                      activeLegacies.reduce(
                        (sum, legacy) => sum + legacy.projectedValue,
                        0,
                      ),
                    )}
                  </p>
                  <p className="text-sm text-green-300">Projected Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
