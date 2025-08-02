import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Crown,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  Globe,
  Building2,
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
  Flag,
  Scale,
  Gavel,
  Landmark,
} from "lucide-react";

interface SovereignLegacy {
  id: string;
  sovereignName: string;
  legacyType:
    | "constitutional"
    | "diplomatic"
    | "economic"
    | "military"
    | "cultural"
    | "territorial";
  nation: string;
  stakingPeriod: "100-year" | "500-year" | "1000-year" | "eternal";
  stakingAmount: number;
  projectedValue: number;
  guardianCount: number;
  citizensBenefiting: number;
  treatiesPreserved: number;
  territoryProtected: number; // in sq km
  publicAccess: boolean;
  securityLevel: "classified" | "state_secret" | "diplomatic" | "public";
  createdDate: string;
  maturityDate: string;
  status: "active" | "classified" | "ratified";
}

interface LegacyTemplate {
  name: string;
  description: string;
  minStaking: number;
  scopeAreas: string[];
  features: string[];
  roi: string;
  category:
    | "constitutional"
    | "diplomatic"
    | "economic"
    | "military"
    | "cultural"
    | "territorial";
}

export function SovereignLegacyCapsule() {
  const [activeTab, setActiveTab] = useState<
    "create" | "portfolio" | "templates" | "sovereignty"
  >("create");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const [legacyTemplates] = useState<LegacyTemplate[]>([
    {
      name: "Constitutional Foundation Archive",
      description:
        "Preservation of founding constitutional documents, amendments, and democratic principles for future generations",
      minStaking: 1000000000, // $1B
      scopeAreas: [
        "Constitutional documents",
        "Democratic institutions",
        "Legal precedents",
        "Governance evolution",
      ],
      features: [
        "Digital Constitution Archive",
        "Legal Precedent Database",
        "Governance Timeline",
        "Democratic Evolution Records",
      ],
      roi: "4,567% over 1000 years",
      category: "constitutional",
    },
    {
      name: "Diplomatic Treaty Vault",
      description:
        "Comprehensive archive of international treaties, diplomatic agreements, and peace accords",
      minStaking: 750000000, // $750M
      scopeAreas: [
        "International treaties",
        "Peace agreements",
        "Trade deals",
        "Diplomatic correspondence",
      ],
      features: [
        "Treaty Database",
        "Diplomatic Communications",
        "Peace Process Documentation",
        "International Relations History",
      ],
      roi: "3,247% over 500 years",
      category: "diplomatic",
    },
    {
      name: "Economic Sovereignty Reserve",
      description:
        "Strategic economic documentation including monetary policy, trade agreements, and sovereign wealth strategies",
      minStaking: 2000000000, // $2B
      scopeAreas: [
        "Monetary policy",
        "Trade strategies",
        "Economic indicators",
        "Sovereign wealth management",
      ],
      features: [
        "Economic Policy Archive",
        "Trade Documentation",
        "Monetary History",
        "Wealth Strategy Records",
      ],
      roi: "5,847% over 1000 years",
      category: "economic",
    },
    {
      name: "Territorial Sovereignty Archive",
      description:
        "Documentation of territorial claims, border agreements, and sovereign territory management",
      minStaking: 1500000000, // $1.5B
      scopeAreas: [
        "Border demarcation",
        "Territorial claims",
        "Resource rights",
        "Maritime boundaries",
      ],
      features: [
        "Territory Mapping",
        "Border Documentation",
        "Resource Inventories",
        "Sovereignty Claims",
      ],
      roi: "4,123% over 500 years",
      category: "territorial",
    },
    {
      name: "National Security Heritage",
      description:
        "Classified strategic documentation for national defense and security policy preservation",
      minStaking: 3000000000, // $3B
      scopeAreas: [
        "Defense strategies",
        "Security policies",
        "Intelligence archives",
        "Strategic planning",
      ],
      features: [
        "Classified Archives",
        "Defense Documentation",
        "Security Policy Records",
        "Strategic Intelligence",
      ],
      roi: "7,234% over 1000 years",
      category: "military",
    },
  ]);

  const [activeSovereignLegacies] = useState<SovereignLegacy[]>([
    {
      id: "1",
      sovereignName: "United States Constitutional Archive",
      legacyType: "constitutional",
      nation: "United States of America",
      stakingPeriod: "1000-year",
      stakingAmount: 1250000000,
      projectedValue: 57062500000,
      guardianCount: 247,
      citizensBenefiting: 335000000,
      treatiesPreserved: 1847,
      territoryProtected: 9833517, // sq km
      publicAccess: true,
      securityLevel: "public",
      createdDate: "2024-07-04",
      maturityDate: "3024-07-04",
      status: "active",
    },
    {
      id: "2",
      sovereignName: "European Union Diplomatic Legacy",
      legacyType: "diplomatic",
      nation: "European Union",
      stakingPeriod: "500-year",
      stakingAmount: 850000000,
      projectedValue: 27597500000,
      guardianCount: 156,
      citizensBenefiting: 450000000,
      treatiesPreserved: 3247,
      territoryProtected: 4233255, // sq km
      publicAccess: true,
      securityLevel: "diplomatic",
      createdDate: "2024-05-09",
      maturityDate: "2524-05-09",
      status: "ratified",
    },
    {
      id: "3",
      sovereignName: "Singapore Economic Sovereignty",
      legacyType: "economic",
      nation: "Republic of Singapore",
      stakingPeriod: "100-year",
      stakingAmount: 500000000,
      projectedValue: 29235000000,
      guardianCount: 45,
      citizensBenefiting: 6000000,
      treatiesPreserved: 567,
      territoryProtected: 728, // sq km
      publicAccess: false,
      securityLevel: "state_secret",
      createdDate: "2024-08-09",
      maturityDate: "2124-08-09",
      status: "classified",
    },
  ]);

  const [createForm, setCreateForm] = useState({
    sovereignName: "",
    legacyType: "constitutional",
    nation: "",
    stakingPeriod: "500-year",
    stakingAmount: 500000000,
    guardianCount: 25,
    publicAccess: false,
    securityLevel: "diplomatic",
    projectDescription: "",
    sovereigntyScope: "",
    successorProtocol: "",
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
      case "constitutional":
        return "bg-blue-600/20 text-blue-400";
      case "diplomatic":
        return "bg-green-600/20 text-green-400";
      case "economic":
        return "bg-yellow-600/20 text-yellow-400";
      case "military":
        return "bg-red-600/20 text-red-400";
      case "cultural":
        return "bg-purple-600/20 text-purple-400";
      case "territorial":
        return "bg-orange-600/20 text-orange-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  const getLegacyTypeIcon = (type: string) => {
    switch (type) {
      case "constitutional":
        return <Scale className="h-5 w-5" />;
      case "diplomatic":
        return <Flag className="h-5 w-5" />;
      case "economic":
        return <Coins className="h-5 w-5" />;
      case "military":
        return <Shield className="h-5 w-5" />;
      case "cultural":
        return <Crown className="h-5 w-5" />;
      case "territorial":
        return <Globe className="h-5 w-5" />;
      default:
        return <Landmark className="h-5 w-5" />;
    }
  };

  const calculateProjectedValue = (staking: number, years: number) => {
    // Sovereign legacy appreciation: 12.47% annually compounded (sovereignty value increase)
    return staking * Math.pow(1.1247, years);
  };

  const totalCitizens = activeSovereignLegacies.reduce(
    (sum, legacy) => sum + legacy.citizensBenefiting,
    0,
  );
  const totalTreaties = activeSovereignLegacies.reduce(
    (sum, legacy) => sum + legacy.treatiesPreserved,
    0,
  );
  const totalTerritory = activeSovereignLegacies.reduce(
    (sum, legacy) => sum + legacy.territoryProtected,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Sovereign Legacy Capsules
          </h2>
          <p className="text-slate-400">
            Preserve national sovereignty and governance legacy with
            multi-generational sovereign value appreciation
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-gold-600/20 text-yellow-400 border-yellow-500/30">
            {formatNumber(totalCitizens)} Citizens
          </Badge>
          <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
            {activeSovereignLegacies.length} Sovereign Nations
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
                <p className="text-sm text-slate-400">Total Sovereign Value</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(
                    activeSovereignLegacies.reduce(
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
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Citizens Protected</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(totalCitizens)}
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
                <p className="text-sm text-slate-400">Treaties Preserved</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(totalTreaties)}
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
                <p className="text-sm text-slate-400">Territory (sq km)</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(totalTerritory)}
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
          Create Sovereign Legacy
        </Button>
        <Button
          size="sm"
          variant={activeTab === "portfolio" ? "default" : "ghost"}
          onClick={() => setActiveTab("portfolio")}
          className="flex-1"
        >
          Active Sovereigns
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
          variant={activeTab === "sovereignty" ? "default" : "ghost"}
          onClick={() => setActiveTab("sovereignty")}
          className="flex-1"
        >
          Sovereignty Analytics
        </Button>
      </div>

      {/* Content Sections */}
      {activeTab === "create" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">
            Create Sovereign Legacy Capsule
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Sovereign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Sovereign Legacy Name
                  </label>
                  <Input
                    value={createForm.sovereignName}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        sovereignName: e.target.value,
                      })
                    }
                    placeholder="Enter sovereign legacy name"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Legacy Type
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
                    <option value="constitutional">
                      Constitutional Foundation
                    </option>
                    <option value="diplomatic">Diplomatic Treaties</option>
                    <option value="economic">Economic Sovereignty</option>
                    <option value="military">National Security</option>
                    <option value="cultural">Cultural Heritage</option>
                    <option value="territorial">Territorial Sovereignty</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Nation/Sovereign Entity
                  </label>
                  <Input
                    value={createForm.nation}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, nation: e.target.value })
                    }
                    placeholder="Enter nation or sovereign entity"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Sovereign Staking & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Sovereignty Period
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
                    <option value="100-year">100 Years</option>
                    <option value="500-year">500 Years</option>
                    <option value="1000-year">1000 Years (Millennial)</option>
                    <option value="eternal">Eternal Sovereignty</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Sovereign Staking (GTT)
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
                    placeholder="Minimum: 500,000,000 GTT"
                    className="bg-slate-700 border-slate-600"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Projected Value:{" "}
                    {formatCurrency(
                      calculateProjectedValue(createForm.stakingAmount, 500),
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Guardian Count
                  </label>
                  <Input
                    type="number"
                    value={createForm.guardianCount}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        guardianCount: parseInt(e.target.value),
                      })
                    }
                    placeholder="25-500 guardians"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Security Level
                  </label>
                  <select
                    value={createForm.securityLevel}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        securityLevel: e.target.value as any,
                      })
                    }
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    <option value="public">Public Access</option>
                    <option value="diplomatic">Diplomatic Level</option>
                    <option value="state_secret">State Secret</option>
                    <option value="classified">Classified</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Sovereign Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Sovereign Legacy Description
                </label>
                <Textarea
                  value={createForm.projectDescription}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      projectDescription: e.target.value,
                    })
                  }
                  placeholder="Describe the sovereign legacy and its critical importance to national continuity..."
                  className="bg-slate-700 border-slate-600 h-32"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Sovereignty Scope
                </label>
                <Textarea
                  value={createForm.sovereigntyScope}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      sovereigntyScope: e.target.value,
                    })
                  }
                  placeholder="Define the scope of sovereignty being preserved (territory, treaties, governance structures, etc.)..."
                  className="bg-slate-700 border-slate-600 h-24"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Successor Protocol
                </label>
                <Textarea
                  value={createForm.successorProtocol}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      successorProtocol: e.target.value,
                    })
                  }
                  placeholder="Instructions for future sovereign authorities and succession protocols..."
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
                    Enable Citizen Access
                  </span>
                </label>
              </div>

              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                <Crown className="h-4 w-4 mr-2" />
                Create Sovereign Legacy Capsule
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "portfolio" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Active Sovereign Legacies
          </h3>

          <div className="grid gap-6">
            {activeSovereignLegacies.map((legacy) => (
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
                            {legacy.sovereignName}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {legacy.nation}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={getLegacyTypeColor(legacy.legacyType)}
                            >
                              {legacy.legacyType.toUpperCase()}
                            </Badge>
                            <Badge
                              className={`${
                                legacy.securityLevel === "classified"
                                  ? "bg-red-600/20 text-red-400"
                                  : legacy.securityLevel === "state_secret"
                                    ? "bg-orange-600/20 text-orange-400"
                                    : legacy.securityLevel === "diplomatic"
                                      ? "bg-blue-600/20 text-blue-400"
                                      : "bg-green-600/20 text-green-400"
                              }`}
                            >
                              {legacy.securityLevel
                                .replace("_", " ")
                                .toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            Sovereign Value
                          </p>
                          <p className="text-lg font-bold text-white">
                            {formatCurrency(legacy.stakingAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Citizens</p>
                          <p className="text-lg font-bold text-blue-400">
                            {formatNumber(legacy.citizensBenefiting)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Treaties</p>
                          <p className="text-lg font-bold text-white">
                            {formatNumber(legacy.treatiesPreserved)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Territory (sq km)
                          </p>
                          <p className="text-lg font-bold text-white">
                            {formatNumber(legacy.territoryProtected)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-400">
                            Sovereignty Until: {legacy.maturityDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-slate-400">
                            {legacy.guardianCount} Guardians
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <Badge
                        className={`mb-3 ${
                          legacy.status === "active"
                            ? "bg-green-600/20 text-green-400"
                            : legacy.status === "classified"
                              ? "bg-red-600/20 text-red-400"
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
                          View Archive
                        </Button>
                        <Button
                          size="sm"
                          className="bg-yellow-600 hover:bg-yellow-700 w-full"
                        >
                          Manage Sovereignty
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
            Sovereign Legacy Templates
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
                          Sovereignty Scope
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {template.scopeAreas.map((scope, idx) => (
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
                        className="bg-yellow-600 hover:bg-yellow-700"
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

      {activeTab === "sovereignty" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">
            Sovereignty Analytics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  Sovereign Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Citizens</span>
                    <span className="text-blue-400 font-bold">
                      {formatNumber(totalCitizens)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Treaties Preserved</span>
                    <span className="text-green-400 font-bold">
                      {formatNumber(totalTreaties)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Territory Protected</span>
                    <span className="text-purple-400 font-bold">
                      {formatNumber(totalTerritory)} sq km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sovereign Value</span>
                    <span className="text-white font-medium">
                      {formatCurrency(
                        activeSovereignLegacies.reduce(
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
                  <Shield className="h-5 w-5 text-red-400" />
                  Security Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Classified Legacies</span>
                    <span className="text-red-400 font-bold">
                      {
                        activeSovereignLegacies.filter(
                          (l) => l.securityLevel === "classified",
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">State Secrets</span>
                    <span className="text-orange-400 font-bold">
                      {
                        activeSovereignLegacies.filter(
                          (l) => l.securityLevel === "state_secret",
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Diplomatic Level</span>
                    <span className="text-blue-400 font-bold">
                      {
                        activeSovereignLegacies.filter(
                          (l) => l.securityLevel === "diplomatic",
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Public Access</span>
                    <span className="text-green-400 font-bold">
                      {
                        activeSovereignLegacies.filter(
                          (l) => l.securityLevel === "public",
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-yellow-900/50 to-blue-900/50 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Sovereign Legacy Authority
                  </h4>
                  <p className="text-yellow-300 mb-4">
                    Protecting {formatNumber(totalCitizens)} citizens across{" "}
                    {formatNumber(totalTerritory)} sq km with{" "}
                    {formatNumber(totalTreaties)} treaties preserved through{" "}
                    {activeSovereignLegacies.length} sovereign legacies
                  </p>
                  <div className="flex items-center gap-4">
                    <ArrowUpRight className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-green-300">
                      4,567% average sovereignty value appreciation over
                      1000-year periods
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">
                    Total Sovereignty Value
                  </p>
                  <p className="text-3xl font-bold text-green-400">
                    {formatCurrency(
                      activeSovereignLegacies.reduce(
                        (sum, legacy) => sum + legacy.projectedValue,
                        0,
                      ),
                    )}
                  </p>
                  <p className="text-sm text-green-300">
                    Projected Sovereign Value
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
