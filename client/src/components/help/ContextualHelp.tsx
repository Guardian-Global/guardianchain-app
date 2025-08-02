import React, { useState } from "react";
import { HelpCircle, X, Lightbulb, Book, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface HelpContent {
  id: string;
  title: string;
  description: string;
  steps?: string[];
  tips?: string[];
  relatedFeatures?: string[];
  complexity: "beginner" | "intermediate" | "advanced";
  category:
    | "capsule"
    | "verification"
    | "token"
    | "analytics"
    | "security"
    | "general";
}

interface ContextualHelpProps {
  content: HelpContent;
  position?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md" | "lg";
  trigger?: "hover" | "click";
  className?: string;
}

const HELP_CONTENT_DATABASE: Record<string, HelpContent> = {
  "capsule-creation": {
    id: "capsule-creation",
    title: "Creating Truth Capsules",
    description:
      "Truth capsules are immutable containers for verified information. They serve as the foundation of the GUARDIANCHAIN truth verification ecosystem.",
    steps: [
      "Choose a clear, descriptive title",
      "Add comprehensive content with evidence",
      "Set appropriate privacy and access controls",
      "Configure verification requirements",
      "Submit for community review",
    ],
    tips: [
      "Include multiple sources for stronger verification",
      "Use clear, factual language",
      "Consider future access needs when setting privacy",
    ],
    relatedFeatures: ["verification-process", "privacy-controls"],
    complexity: "beginner",
    category: "capsule",
  },
  "verification-process": {
    id: "verification-process",
    title: "Community Verification",
    description:
      "The verification process ensures truth accuracy through community consensus and expert review.",
    steps: [
      "Submit evidence supporting your claim",
      "Wait for community review period",
      "Respond to questions from verifiers",
      "Receive verification status and GTT rewards",
    ],
    tips: [
      "Higher quality evidence leads to faster verification",
      "Engage constructively with the community",
      "Multiple verification rounds improve accuracy",
    ],
    relatedFeatures: ["capsule-creation", "gtt-rewards"],
    complexity: "intermediate",
    category: "verification",
  },
  "gtt-rewards": {
    id: "gtt-rewards",
    title: "GTT Token Rewards",
    description:
      "Earn GTT tokens for creating verified content, participating in verification, and contributing to platform growth.",
    steps: [
      "Create high-quality truth capsules",
      "Participate in verification process",
      "Build reputation through consistent accuracy",
      "Claim rewards from your dashboard",
    ],
    tips: [
      "Verified content earns exponentially more rewards",
      "Regular participation increases multipliers",
      "Quality over quantity for maximum earnings",
    ],
    relatedFeatures: ["capsule-creation", "verification-process"],
    complexity: "intermediate",
    category: "token",
  },
  "privacy-controls": {
    id: "privacy-controls",
    title: "Privacy & Access Controls",
    description:
      "Advanced privacy settings allow you to control who can access your content and under what conditions.",
    steps: [
      "Select visibility level (Public, Private, Restricted)",
      "Set access requirements (GTT stake, verification level)",
      "Configure time-based access controls",
      "Enable anonymous submission if needed",
    ],
    tips: [
      "Balance privacy with verification needs",
      "Consider long-term access requirements",
      "Anonymous submissions receive different verification",
    ],
    relatedFeatures: ["capsule-creation", "security-features"],
    complexity: "advanced",
    category: "security",
  },
  "analytics-dashboard": {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    description:
      "Comprehensive analytics help you understand capsule performance, audience engagement, and earning potential.",
    steps: [
      "Select time range for analysis",
      "Choose specific capsules to examine",
      "Review performance metrics",
      "Export data for deeper analysis",
    ],
    tips: [
      "Weekly reviews help optimize content strategy",
      "Compare high and low performers",
      "Use trends to predict optimal posting times",
    ],
    relatedFeatures: ["capsule-creation", "gtt-rewards"],
    complexity: "intermediate",
    category: "analytics",
  },
};

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  content,
  position = "top",
  size = "md",
  trigger = "click",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: "w-80",
    md: "w-96",
    lg: "w-[480px]",
  };

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  const complexityColors = {
    beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const categoryIcons = {
    capsule: Book,
    verification: HelpCircle,
    token: Zap,
    analytics: HelpCircle,
    security: HelpCircle,
    general: Lightbulb,
  };

  const CategoryIcon = categoryIcons[content.category];

  const handleTrigger = () => {
    if (trigger === "click") {
      setIsOpen(!isOpen);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleTrigger}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="p-1 h-auto text-slate-400 hover:text-purple-400 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </Button>

      {/* Help Bubble */}
      {isOpen && (
        <div
          className={`absolute z-50 ${positionClasses[position]} ${sizeClasses[size]}`}
        >
          <Card className="bg-slate-800/95 border-slate-700 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <CategoryIcon className="w-5 h-5 text-purple-400" />
                  <CardTitle className="text-white text-sm font-semibold">
                    {content.title}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${complexityColors[content.complexity]}`}
                  >
                    {content.complexity}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="p-1 h-auto text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-slate-300 text-sm leading-relaxed">
                {content.description}
              </p>

              {/* Steps */}
              {content.steps && (
                <div>
                  <h4 className="text-white font-medium text-sm mb-2">
                    How to use:
                  </h4>
                  <ol className="space-y-1">
                    {content.steps.map((step, index) => (
                      <li key={index} className="text-slate-300 text-sm flex">
                        <span className="text-purple-400 font-medium mr-2 min-w-[1.2rem]">
                          {index + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Tips */}
              {content.tips && (
                <div>
                  <h4 className="text-white font-medium text-sm mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-1 text-yellow-400" />
                    Pro tips:
                  </h4>
                  <ul className="space-y-1">
                    {content.tips.map((tip, index) => (
                      <li key={index} className="text-slate-300 text-sm flex">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Features */}
              {content.relatedFeatures && (
                <div>
                  <h4 className="text-white font-medium text-sm mb-2">
                    Related features:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {content.relatedFeatures.map((featureId) => {
                      const feature = HELP_CONTENT_DATABASE[featureId];
                      return feature ? (
                        <Badge
                          key={featureId}
                          variant="outline"
                          className="text-xs text-slate-400 border-slate-600 hover:border-purple-500/50 cursor-pointer transition-colors"
                        >
                          {feature.title}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Arrow indicator */}
          <div
            className={`absolute w-3 h-3 bg-slate-800 border-slate-700 transform rotate-45 ${
              position === "top"
                ? "top-full -mt-1.5 left-4 border-r border-b"
                : position === "bottom"
                  ? "bottom-full -mb-1.5 left-4 border-l border-t"
                  : position === "left"
                    ? "left-full -ml-1.5 top-4 border-r border-t"
                    : "right-full -mr-1.5 top-4 border-l border-b"
            }`}
          />
        </div>
      )}
    </div>
  );
};

// Quick access component for common help topics
export const QuickHelp: React.FC<{
  helpId: string;
  position?: "top" | "bottom" | "left" | "right";
}> = ({ helpId, position = "top" }) => {
  const content = HELP_CONTENT_DATABASE[helpId];

  if (!content) {
    return null;
  }

  return <ContextualHelp content={content} position={position} />;
};

// Export the help content database for external use
export { HELP_CONTENT_DATABASE };
