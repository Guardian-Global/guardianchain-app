import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
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
  Music,
  Palette,
  Camera,
  Theater,
  Languages,
  Map,
} from "lucide-react";

interface CulturalLegacy {
  id: string;
  projectName: string;
  legacyType:
    | "language"
    | "art"
    | "music"
    | "literature"
    | "traditions"
    | "monuments"
    | "archaeology";
  culture: string;
  stakingPeriod: "100-year" | "500-year" | "1000-year" | "eternal";
  stakingAmount: number;
  projectedValue: number;
  custodianCount: number;
  artifactsPreserved: number;
  beneficiaries: number;
  publicAccess: boolean;
  unescoStatus: boolean;
  certificationLevel: "local" | "national" | "international";
  createdDate: string;
  maturityDate: string;
  status: "active" | "preserving" | "archived";
}

interface LegacyTemplate {
  name: string;
  description: string;
  minStaking: number;
  preservationScope: string[];
  features: string[];
  roi: string;
  category:
    | "language"
    | "art"
    | "music"
    | "literature"
    | "traditions"
    | "monuments"
    | "archaeology";
}

export function CulturalLegacyCapsule() {
  const [activeTab, setActiveTab] = useState<
    "create" | "portfolio" | "templates" | "preservation"
  >("create");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const [legacyTemplates] = useState<LegacyTemplate[]>([
    {
      name: "Indigenous Language Preservation",
      description:
        "Comprehensive documentation and revitalization of endangered indigenous languages and oral traditions",
      minStaking: 50000000, // $50M
      preservationScope: [
        "Oral histories",
        "Language documentation",
        "Cultural practices",
        "Traditional knowledge",
      ],
      features: [
        "Digital Archives",
        "Audio/Video Documentation",
        "Language Learning Programs",
        "Cultural Education",
      ],
      roi: "1,567% over 500 years",
      category: "language",
    },
    {
      name: "Ancient Art & Manuscript Archive",
      description:
        "Digital preservation and physical conservation of ancient artworks, manuscripts, and cultural artifacts",
      minStaking: 100000000, // $100M
      preservationScope: [
        "Historical manuscripts",
        "Ancient artworks",
        "Archaeological artifacts",
        "Cultural objects",
      ],
      features: [
        "3D Scanning",
        "Climate-Controlled Storage",
        "Digital Reconstruction",
        "Virtual Museums",
      ],
      roi: "2,347% over 1000 years",
      category: "art",
    },
    {
      name: "Traditional Music Heritage",
      description:
        "Preservation of traditional music, instruments, and performance practices from around the world",
      minStaking: 30000000, // $30M
      preservationScope: [
        "Traditional compositions",
        "Instrument crafting",
        "Performance techniques",
        "Musical traditions",
      ],
      features: [
        "Audio Archives",
        "Instrument Preservation",
        "Master Classes",
        "Performance Documentation",
      ],
      roi: "987% over 500 years",
      category: "music",
    },
    {
      name: "Monumental Heritage Protection",
      description:
        "Long-term preservation and restoration of historical monuments and archaeological sites",
      minStaking: 200000000, // $200M
      preservationScope: [
        "Archaeological sites",
        "Historical monuments",
        "Ancient architecture",
        "Cultural landscapes",
      ],
      features: [
        "Structural Preservation",
        "Environmental Protection",
        "Tourism Management",
        "Research Programs",
      ],
      roi: "3,456% over 1000 years",
      category: "monuments",
    },
    {
      name: "Living Traditions Archive",
      description:
        "Documentation and continuity of living cultural traditions, ceremonies, and social practices",
      minStaking: 40000000, // $40M
      preservationScope: [
        "Ceremonial practices",
        "Traditional crafts",
        "Social customs",
        "Community wisdom",
      ],
      features: [
        "Ethnographic Documentation",
        "Craft Workshops",
        "Ceremony Recording",
        "Knowledge Transfer",
      ],
      roi: "1,234% over 500 years",
      category: "traditions",
    },
  ]);

  const [activeCulturalLegacies] = useState<CulturalLegacy[]>([
    {
      id: "1",
      projectName: "Mayan Language Revival Project",
      legacyType: "language",
      culture: "Maya Civilization",
      stakingPeriod: "500-year",
      stakingAmount: 75000000,
      projectedValue: 1175000000,
      custodianCount: 45,
      artifactsPreserved: 15000,
      beneficiaries: 250000,
      publicAccess: true,
      unescoStatus: true,
      certificationLevel: "international",
      createdDate: "2024-03-20",
      maturityDate: "2524-03-20",
      status: "active",
    },
    {
      id: "2",
      projectName: "Angkor Wat Digital Archive",
      legacyType: "monuments",
      culture: "Khmer Empire",
      stakingPeriod: "1000-year",
      stakingAmount: 150000000,
      projectedValue: 5184000000,
      custodianCount: 85,
      artifactsPreserved: 50000,
      beneficiaries: 2000000,
      publicAccess: true,
      unescoStatus: true,
      certificationLevel: "international",
      createdDate: "2024-01-15",
      maturityDate: "3024-01-15",
      status: "preserving",
    },
    {
      id: "3",
      projectName: "Celtic Music Heritage",
      legacyType: "music",
      culture: "Celtic Traditions",
      stakingPeriod: "500-year",
      stakingAmount: 45000000,
      projectedValue: 705000000,
      custodianCount: 30,
      artifactsPreserved: 8500,
      beneficiaries: 500000,
      publicAccess: true,
      unescoStatus: false,
      certificationLevel: "national",
      createdDate: "2024-06-10",
      maturityDate: "2524-06-10",
      status: "active",
    },
  ]);

  const [createForm, setCreateForm] = useState({
    projectName: "",
    legacyType: "language",
    culture: "",
    stakingPeriod: "500-year",
    stakingAmount: 30000000,
    custodianCount: 10,
    publicAccess: true,
    unescoStatus: false,
    certificationLevel: "local",
    projectDescription: "",
    preservationPlan: "",
    culturalSignificance: "",
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
      case "language":
        return "bg-blue-600/20 text-blue-400";
      case "art":
        return "bg-purple-600/20 text-purple-400";
      case "music":
        return "bg-green-600/20 text-green-400";
      case "literature":
        return "bg-yellow-600/20 text-yellow-400";
      case "traditions":
        return "bg-red-600/20 text-red-400";
      case "monuments":
        return "bg-gray-600/20 text-gray-400";
      case "archaeology":
        return "bg-orange-600/20 text-orange-400";
      default:
        return "bg-slate-600/20 text-slate-400";
    }
  };

  const getLegacyTypeIcon = (type: string) => {
    switch (type) {
      case "language":
        return <Languages className="h-5 w-5" />;
      case "art":
        return <Palette className="h-5 w-5" />;
      case "music":
        return <Music className="h-5 w-5" />;
      case "literature":
        return <BookOpen className="h-5 w-5" />;
      case "traditions":
        return <Users className="h-5 w-5" />;
      case "monuments":
        return <Crown className="h-5 w-5" />;
      case "archaeology":
        return <Archive className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const calculateProjectedValue = (staking: number, years: number) => {
    // Cultural legacy appreciation: 10.67% annually compounded (cultural value increase)
    return staking * Math.pow(1.1067, years);
  };

  const totalArtifacts = activeCulturalLegacies.reduce(
    (sum, legacy) => sum + legacy.artifactsPreserved,
    0,
  );
  const totalBeneficiaries = activeCulturalLegacies.reduce(
    (sum, legacy) => sum + legacy.beneficiaries,
    0,
  );
  const totalCustodians = activeCulturalLegacies.reduce(
    (sum, legacy) => sum + legacy.custodianCount,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Cultural Legacy Capsules
          </h2>
          <p className="text-slate-400">
            Preserve human cultural heritage and knowledge for future
            generations with millennial value appreciation
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
            {formatNumber(totalArtifacts)} Artifacts
          </Badge>
          <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
            {activeCulturalLegacies.length} Active Projects
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
                    activeCulturalLegacies.reduce(
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
                <Archive className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Artifacts Preserved</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(totalArtifacts)}
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
                <p className="text-sm text-slate-400">Beneficiaries</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(totalBeneficiaries)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Shield className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Cultural Custodians</p>
                <p className="text-xl font-bold text-white">
                  {totalCustodians}
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
          Create Cultural Legacy
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
          variant={activeTab === "preservation" ? "default" : "ghost"}
          onClick={() => setActiveTab("preservation")}
          className="flex-1"
        >
          Preservation Analytics
        </Button>
      </div>

      {/* Content Sections */}
      {activeTab === "create" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">
            Create Cultural Legacy Capsule
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Cultural Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Project Name
                  </label>
                  <Input
                    value={createForm.projectName}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        projectName: e.target.value,
                      })
                    }
                    placeholder="Enter cultural project name"
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
                    <option value="language">Language Preservation</option>
                    <option value="art">Art & Manuscripts</option>
                    <option value="music">Traditional Music</option>
                    <option value="literature">Literature Archive</option>
                    <option value="traditions">Living Traditions</option>
                    <option value="monuments">Monuments & Sites</option>
                    <option value="archaeology">Archaeological Heritage</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Culture/Civilization
                  </label>
                  <Input
                    value={createForm.culture}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, culture: e.target.value })
                    }
                    placeholder="e.g., Maya, Celtic, Aboriginal, etc."
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Preservation & Governance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Preservation Period
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
                    <option value="eternal">Eternal Preservation</option>
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
                    placeholder="Minimum: 30,000,000 GTT"
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
                    Cultural Custodians
                  </label>
                  <Input
                    type="number"
                    value={createForm.custodianCount}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        custodianCount: parseInt(e.target.value),
                      })
                    }
                    placeholder="5-100 custodians"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Cultural Heritage Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Project Description
                </label>
                <Textarea
                  value={createForm.projectDescription}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      projectDescription: e.target.value,
                    })
                  }
                  placeholder="Describe the cultural heritage and its significance..."
                  className="bg-slate-700 border-slate-600 h-32"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Cultural Significance
                </label>
                <Textarea
                  value={createForm.culturalSignificance}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      culturalSignificance: e.target.value,
                    })
                  }
                  placeholder="Explain the historical and cultural importance..."
                  className="bg-slate-700 border-slate-600 h-24"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Preservation Plan
                </label>
                <Textarea
                  value={createForm.preservationPlan}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      preservationPlan: e.target.value,
                    })
                  }
                  placeholder="Detailed preservation methodology and long-term strategy..."
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

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={createForm.unescoStatus}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        unescoStatus: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-slate-300">
                    UNESCO Recognition
                  </span>
                </label>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <BookOpen className="h-4 w-4 mr-2" />
                Create Cultural Legacy Capsule
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "portfolio" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Active Cultural Legacy Projects
          </h3>

          <div className="grid gap-6">
            {activeCulturalLegacies.map((legacy) => (
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
                            {legacy.culture}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={getLegacyTypeColor(legacy.legacyType)}
                            >
                              {legacy.legacyType.toUpperCase()}
                            </Badge>
                            {legacy.unescoStatus && (
                              <Badge className="bg-gold-600/20 text-yellow-400">
                                UNESCO
                              </Badge>
                            )}
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
                          <p className="text-xs text-slate-500">Artifacts</p>
                          <p className="text-lg font-bold text-purple-400">
                            {formatNumber(legacy.artifactsPreserved)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Beneficiaries
                          </p>
                          <p className="text-lg font-bold text-white">
                            {formatNumber(legacy.beneficiaries)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Custodians</p>
                          <p className="text-lg font-bold text-white">
                            {legacy.custodianCount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-400">
                            Preservation Until: {legacy.maturityDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {legacy.publicAccess ? (
                            <Eye className="h-4 w-4 text-green-400" />
                          ) : (
                            <Shield className="h-4 w-4 text-red-400" />
                          )}
                          <span className="text-sm text-slate-400">
                            {legacy.publicAccess
                              ? "Public Access"
                              : "Restricted"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <Badge
                        className={`mb-3 ${
                          legacy.status === "active"
                            ? "bg-green-600/20 text-green-400"
                            : legacy.status === "preserving"
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
                          View Archive
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 w-full"
                        >
                          Manage Heritage
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
            Cultural Legacy Templates
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
                          Preservation Scope
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {template.preservationScope.map((scope, idx) => (
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

      {activeTab === "preservation" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">
            Cultural Preservation Analytics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Archive className="h-5 w-5 text-purple-400" />
                  Preservation Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Artifacts</span>
                    <span className="text-purple-400 font-bold">
                      {formatNumber(totalArtifacts)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Cultural Beneficiaries
                    </span>
                    <span className="text-blue-400 font-bold">
                      {formatNumber(totalBeneficiaries)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">UNESCO Sites</span>
                    <span className="text-yellow-400 font-bold">
                      {
                        activeCulturalLegacies.filter((l) => l.unescoStatus)
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cultural Value</span>
                    <span className="text-white font-medium">
                      {formatCurrency(totalArtifacts * 150000)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-400" />
                  Global Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cultures Preserved</span>
                    <span className="text-green-400 font-bold">
                      {activeCulturalLegacies.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Custodians</span>
                    <span className="text-blue-400 font-bold">
                      {totalCustodians}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      International Projects
                    </span>
                    <span className="text-purple-400 font-bold">
                      {
                        activeCulturalLegacies.filter(
                          (l) => l.certificationLevel === "international",
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Preservation Years</span>
                    <span className="text-white font-medium">2,024 Total</span>
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
                    Cultural Heritage Leadership
                  </h4>
                  <p className="text-purple-300 mb-4">
                    Preserving {formatNumber(totalArtifacts)} cultural artifacts
                    with {formatNumber(totalBeneficiaries)} beneficiaries across{" "}
                    {activeCulturalLegacies.length} heritage projects
                  </p>
                  <div className="flex items-center gap-4">
                    <ArrowUpRight className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-green-300">
                      1,567% average cultural value appreciation over 500-year
                      periods
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">
                    Total Cultural Legacy Value
                  </p>
                  <p className="text-3xl font-bold text-green-400">
                    {formatCurrency(
                      activeCulturalLegacies.reduce(
                        (sum, legacy) => sum + legacy.projectedValue,
                        0,
                      ),
                    )}
                  </p>
                  <p className="text-sm text-green-300">
                    Projected Heritage Value
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
