import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Zap,
  Database,
  Cloud,
  Users,
  GitBranch,
  Lock,
  Monitor,
  Smartphone,
  Globe,
  Eye,
  Rocket,
  Settings,
  CheckCircle,
  AlertTriangle,
  Star,
  Crown,
} from "lucide-react";

interface ReplitTool {
  name: string;
  description: string;
  status: "active" | "available" | "needs-setup";
  category:
    | "ai"
    | "deployment"
    | "storage"
    | "collaboration"
    | "security"
    | "enterprise";
  icon: React.ComponentType<{ className?: string }>;
  benefit: string;
  action?: string;
}

const REPLIT_TOOLS: ReplitTool[] = [
  // AI-Powered Tools
  {
    name: "Replit Agent",
    description:
      "AI assistant for app setup, feature development, and API integration",
    status: "active",
    category: "ai",
    icon: Zap,
    benefit: "10x faster development with natural language programming",
    action: "Enhance with custom prompts",
  },
  {
    name: "Replit Assistant",
    description: "Code completion, debugging, and intelligent autocomplete",
    status: "active",
    category: "ai",
    icon: Shield,
    benefit: "Advanced mode for direct code changes and package management",
    action: "Enable Advanced Mode",
  },
  {
    name: "Dynamic Intelligence",
    description: "Extended Thinking and High Power mode with Claude Opus",
    status: "available",
    category: "ai",
    icon: Crown,
    benefit: "Deeper analysis and complex problem-solving capabilities",
    action: "Activate for GTT deployment",
  },
  {
    name: "Web Search",
    description:
      "Real-time web search for current information and documentation",
    status: "available",
    category: "ai",
    icon: Globe,
    benefit: "Overcome knowledge cutoffs with live data access",
    action: "Enable for blockchain research",
  },
  {
    name: "Visual Editor",
    description: "Direct visual edits to UI with seamless source code updates",
    status: "available",
    category: "ai",
    icon: Eye,
    benefit: "Real-time UI editing without coding",
    action: "Configure for React components",
  },

  // Deployment Options
  {
    name: "Autoscale Deployments",
    description: "Automatic resource scaling based on traffic patterns",
    status: "needs-setup",
    category: "deployment",
    icon: Rocket,
    benefit: "Handle viral GTT token launch traffic automatically",
    action: "Deploy for launch day",
  },
  {
    name: "Reserved VM Deployments",
    description: "Dedicated computing resources for consistent performance",
    status: "available",
    category: "deployment",
    icon: Cloud,
    benefit: "Guaranteed performance for high-stakes trading",
    action: "Reserve for mainnet",
  },
  {
    name: "Custom Domains",
    description: "Professional domain names for your deployments",
    status: "needs-setup",
    category: "deployment",
    icon: Globe,
    benefit: "guardianchain.io domain for enterprise credibility",
    action: "Purchase & configure",
  },
  {
    name: "Private Deployments",
    description: "Restricted access for organization members only",
    status: "available",
    category: "deployment",
    icon: Lock,
    benefit: "Secure enterprise-only access control",
    action: "Enable for admin panels",
  },
  {
    name: "Deployment Monitoring",
    description: "Performance metrics, logs, and status tracking",
    status: "available",
    category: "deployment",
    icon: Monitor,
    benefit: "Real-time GTT token performance monitoring",
    action: "Configure alerts",
  },

  // Storage & Database Tools
  {
    name: "Replit SQL Database",
    description: "Fully-managed SQL database with visual management",
    status: "active",
    category: "storage",
    icon: Database,
    benefit: "Professional data management with point-in-time restore",
    action: "Optimize for production",
  },
  {
    name: "Object Storage",
    description: "Cloud storage for images, videos, and documents",
    status: "needs-setup",
    category: "storage",
    icon: Cloud,
    benefit: "Store 40+ Supabase assets with persistent access",
    action: "Migrate assets",
  },
  {
    name: "Key-Value Store",
    description: "Simple built-in database for configuration data",
    status: "available",
    category: "storage",
    icon: Settings,
    benefit: "Fast configuration and caching layer",
    action: "Implement for settings",
  },

  // Collaboration & Teams
  {
    name: "Multiplayer Editing",
    description: "Real-time collaboration with up to 50 users",
    status: "active",
    category: "collaboration",
    icon: Users,
    benefit: "Team development for scaling GUARDIANCHAIN",
    action: "Invite development team",
  },
  {
    name: "Git Integration",
    description: "Visual Git interface with conflict resolution",
    status: "active",
    category: "collaboration",
    icon: GitBranch,
    benefit: "Professional version control and branching",
    action: "Optimize workflows",
  },
  {
    name: "SAML SSO",
    description: "Enterprise authentication with identity providers",
    status: "available",
    category: "enterprise",
    icon: Shield,
    benefit: "Enterprise-grade security and user management",
    action: "Configure for Teams",
  },

  // Security & Enterprise
  {
    name: "Replit Auth",
    description: "Enterprise-grade authentication system",
    status: "active",
    category: "security",
    icon: Lock,
    benefit: "Secure user accounts and personalized experiences",
    action: "Enhance with custom roles",
  },
  {
    name: "Security Scanner",
    description: "Automated vulnerability detection and fixes",
    status: "available",
    category: "security",
    icon: Shield,
    benefit: "Production-ready security for token platform",
    action: "Run comprehensive scan",
  },
  {
    name: "Secrets Management",
    description: "Encrypted environment variables for sensitive data",
    status: "active",
    category: "security",
    icon: Lock,
    benefit: "Secure API keys and private keys",
    action: "Audit current secrets",
  },
  {
    name: "Mobile App",
    description: "Create and deploy apps from mobile devices",
    status: "available",
    category: "enterprise",
    icon: Smartphone,
    benefit: "Deploy GTT updates from anywhere",
    action: "Download & configure",
  },
  {
    name: "CLUI Interface",
    description: "Command line interface for quick actions",
    status: "available",
    category: "enterprise",
    icon: Settings,
    benefit: "Rapid deployment and management commands",
    action: "Configure shortcuts",
  },
];

export default function ReplitToolsIntegration() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTools, setActiveTools] = useState<ReplitTool[]>([]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setActiveTools(REPLIT_TOOLS);
    } else {
      setActiveTools(
        REPLIT_TOOLS.filter((tool) => tool.category === selectedCategory),
      );
    }
  }, [selectedCategory]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "available":
        return "bg-blue-600";
      case "needs-setup":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "ACTIVE";
      case "available":
        return "AVAILABLE";
      case "needs-setup":
        return "SETUP REQUIRED";
      default:
        return "UNKNOWN";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ai":
        return <Zap className="h-4 w-4" />;
      case "deployment":
        return <Rocket className="h-4 w-4" />;
      case "storage":
        return <Database className="h-4 w-4" />;
      case "collaboration":
        return <Users className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "enterprise":
        return <Crown className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const categories = [
    "all",
    "ai",
    "deployment",
    "storage",
    "collaboration",
    "security",
    "enterprise",
  ];

  const getStatsForCategory = (category: string) => {
    const tools =
      category === "all"
        ? REPLIT_TOOLS
        : REPLIT_TOOLS.filter((t) => t.category === category);
    return {
      total: tools.length,
      active: tools.filter((t) => t.status === "active").length,
      available: tools.filter((t) => t.status === "available").length,
      needsSetup: tools.filter((t) => t.status === "needs-setup").length,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Replit Tools & Integrations
        </h1>
        <p className="text-xl text-slate-300 max-w-4xl mx-auto">
          20+ powerful Replit platform tools to supercharge your GUARDIANCHAIN
          deployment
        </p>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            {
              label: "Total Tools",
              value: REPLIT_TOOLS.length,
              color: "text-white",
            },
            {
              label: "Active",
              value: REPLIT_TOOLS.filter((t) => t.status === "active").length,
              color: "text-green-400",
            },
            {
              label: "Available",
              value: REPLIT_TOOLS.filter((t) => t.status === "available")
                .length,
              color: "text-blue-400",
            },
            {
              label: "Setup Needed",
              value: REPLIT_TOOLS.filter((t) => t.status === "needs-setup")
                .length,
              color: "text-orange-400",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-lg p-4 text-center"
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="capitalize flex items-center gap-2"
          >
            {getCategoryIcon(category)}
            {category}
            <Badge className="bg-slate-700 text-white text-xs ml-1">
              {getStatsForCategory(category).total}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTools.map((tool, index) => (
          <Card
            key={index}
            className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <tool.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">
                      {tool.name}
                    </CardTitle>
                    <Badge
                      className={`${getStatusColor(tool.status)} text-white text-xs mt-1`}
                    >
                      {getStatusText(tool.status)}
                    </Badge>
                  </div>
                </div>
                {getCategoryIcon(tool.category)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                {tool.description}
              </p>

              <div className="bg-slate-700/30 rounded-lg p-3">
                <p className="text-green-400 text-sm font-medium mb-1">
                  💡 Benefit:
                </p>
                <p className="text-slate-300 text-sm">{tool.benefit}</p>
              </div>

              {tool.action && (
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white"
                  size="sm"
                >
                  {tool.action}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deployment Readiness */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Rocket className="h-5 w-5 text-purple-400" />
            GUARDIANCHAIN Launch Day Enhancement Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">
                ✅ Already Active (7 tools)
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Replit Agent & Assistant</li>
                <li>• SQL Database</li>
                <li>• Multiplayer Editing</li>
                <li>• Git Integration</li>
                <li>• Replit Auth</li>
                <li>• Secrets Management</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">
                🔵 Ready to Enable (9 tools)
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Dynamic Intelligence</li>
                <li>• Web Search</li>
                <li>• Visual Editor</li>
                <li>• Reserved VM Deployments</li>
                <li>• Security Scanner</li>
                <li>• Mobile App</li>
                <li>• CLUI Interface</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-400">
                ⚡ Setup Required (4 tools)
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Autoscale Deployments</li>
                <li>• Custom Domains</li>
                <li>• Object Storage</li>
                <li>• SAML SSO</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6 text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              🚀 MAXIMUM PLATFORM ENHANCEMENT READY
            </h3>
            <p className="text-slate-300 mb-6">
              20+ Replit tools identified and analyzed for immediate
              GUARDIANCHAIN supercharging
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white px-8 py-3">
              <Rocket className="mr-2 h-5 w-5" />
              IMPLEMENT ALL ENHANCEMENTS
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
