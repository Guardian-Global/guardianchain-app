import React from "react";
import { HelpCircle, Info, Zap, Shield, Globe, Upload, Bot } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipData {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: "blockchain" | "ipfs" | "privacy" | "ai" | "general";
}

const tooltipData: TooltipData[] = [
  {
    id: "ipfs-storage",
    title: "IPFS Storage",
    description: "InterPlanetary File System (IPFS) is a decentralized storage network that ensures your content remains permanently accessible and tamper-proof. Your content is automatically uploaded and distributed across multiple nodes.",
    icon: Upload,
    category: "ipfs",
  },
  {
    id: "content-hash",
    title: "Content Hash",
    description: "A unique cryptographic fingerprint of your content that proves authenticity and detects any unauthorized changes. Generated automatically from your content using secure algorithms.",
    icon: Zap,
    category: "blockchain",
  },
  {
    id: "access-levels",
    title: "Access Levels",
    description: "Control who can view your truth capsule: Public (everyone), Private (only you), Restricted (selected people), or Premium (paid access). These permissions are enforced by smart contracts.",
    icon: Shield,
    category: "privacy",
  },
  {
    id: "truth-verification",
    title: "Truth Verification",
    description: "Community-driven verification process where validators review your content for accuracy and authenticity. Verified content earns higher GTT rewards and trust scores.",
    icon: Globe,
    category: "blockchain",
  },
  {
    id: "ai-optimization",
    title: "AI Content Optimization",
    description: "Advanced AI analyzes your content to suggest optimal categories, tags, access levels, and settings to maximize reach, engagement, and truth verification success.",
    icon: Bot,
    category: "ai",
  },
  {
    id: "blockchain-immutability",
    title: "Blockchain Immutability",
    description: "Once your capsule is minted on the blockchain, it becomes permanently immutable. No one can alter, delete, or censor your truth - it exists forever as an unalterable record.",
    icon: Zap,
    category: "blockchain",
  },
  {
    id: "gtt-rewards",
    title: "GTT Token Rewards",
    description: "Guardian Truth Token (GTT) rewards are earned based on content quality, verification success, and community engagement. Higher quality truth content earns more tokens.",
    icon: Zap,
    category: "blockchain",
  },
  {
    id: "privacy-controls",
    title: "Advanced Privacy",
    description: "Granular privacy controls including viewing costs, authentication requirements, time-delayed reveals, and multi-signature access for sensitive information.",
    icon: Shield,
    category: "privacy",
  },
];

interface ContextualTooltipProps {
  id: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function ContextualTooltip({
  id,
  children,
  side = "top",
  align = "center",
}: ContextualTooltipProps) {
  const tooltip = tooltipData.find(t => t.id === id);
  
  if (!tooltip) {
    return <>{children}</>;
  }

  const IconComponent = tooltip.icon;
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "blockchain": return "text-purple-400 border-purple-500/30 bg-purple-900/20";
      case "ipfs": return "text-green-400 border-green-500/30 bg-green-900/20";
      case "privacy": return "text-yellow-400 border-yellow-500/30 bg-yellow-900/20";
      case "ai": return "text-blue-400 border-blue-500/30 bg-blue-900/20";
      default: return "text-slate-400 border-slate-500/30 bg-slate-900/20";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative inline-flex items-center">
            {children}
            <HelpCircle className="h-4 w-4 text-slate-400 hover:text-white ml-1 cursor-help transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={`max-w-sm p-4 border ${getCategoryColor(tooltip.category)}`}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconComponent className="h-5 w-5" />
              <h4 className="font-semibold text-white">{tooltip.title}</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {tooltip.description}
            </p>
            <div className="flex items-center gap-1 pt-1">
              <Info className="h-3 w-3 text-slate-500" />
              <span className="text-xs text-slate-500 capitalize">
                {tooltip.category} concept
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Predefined tooltip components for common use cases
export const IPFSTooltip = ({ children }: { children: React.ReactNode }) => (
  <ContextualTooltip id="ipfs-storage">{children}</ContextualTooltip>
);

export const ContentHashTooltip = ({ children }: { children: React.ReactNode }) => (
  <ContextualTooltip id="content-hash">{children}</ContextualTooltip>
);

export const AccessLevelTooltip = ({ children }: { children: React.ReactNode }) => (
  <ContextualTooltip id="access-levels">{children}</ContextualTooltip>
);

export const TruthVerificationTooltip = ({ children }: { children: React.ReactNode }) => (
  <ContextualTooltip id="truth-verification">{children}</ContextualTooltip>
);

export const AIOptimizationTooltip = ({ children }: { children: React.ReactNode }) => (
  <ContextualTooltip id="ai-optimization">{children}</ContextualTooltip>
);

export const BlockchainTooltip = ({ children }: { children: React.ReactNode }) => (
  <ContextualTooltip id="blockchain-immutability">{children}</ContextualTooltip>
);

export const GTTRewardsTooltip = ({ children }: { children: React.ReactNode }) => (
  <ContextualTooltip id="gtt-rewards">{children}</ContextualTooltip>
);

export const PrivacyTooltip = ({ children }: { children: React.ReactNode }) => (
  <ContextualTooltip id="privacy-controls">{children}</ContextualTooltip>
);

export default ContextualTooltip;