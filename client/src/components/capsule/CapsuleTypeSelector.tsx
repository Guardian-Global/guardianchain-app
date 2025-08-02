import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Scale,
  Brain,
  Palette,
  Users,
  TrendingUp,
  Shield,
  Bot,
  Link,
  Film,
  Newspaper,
  AlertTriangle,
  UserCheck,
  Heart,
  Check,
  Star,
  Zap,
} from "lucide-react";
import { CAPSULE_TYPE_CONFIGS, CapsuleType } from "@/types/capsule";
import { BRAND_COLORS } from "@/lib/constants";

interface CapsuleTypeSelectorProps {
  selectedType: CapsuleType;
  onTypeSelect: (type: CapsuleType) => void;
}

const getTypeIcon = (type: CapsuleType) => {
  switch (type) {
    case "STANDARD":
      return FileText;
    case "LEGAL":
      return Scale;
    case "KNOWLEDGE":
      return Brain;
    case "CREATOR":
      return Palette;
    case "CIVIC":
      return Users;
    case "FINANCIAL":
      return TrendingUp;
    case "VERITAS_CERTIFICATE":
      return Shield;
    case "AI_GENERATED":
      return Bot;
    case "CROSS_CHAIN_ASSET":
      return Link;
    case "MULTIMEDIA_STORY":
      return Film;
    case "CITIZEN_JOURNALISM":
      return Newspaper;
    case "FRAUD_PROOF":
      return AlertTriangle;
    case "WITNESS_TESTIMONY":
      return UserCheck;
    case "SOULBOUND_MEMOIR":
      return Heart;
    default:
      return FileText;
  }
};

const getFeeCSSClass = (totalFee: number) => {
  if (totalFee <= 100) return "text-green-400";
  if (totalFee <= 300) return "text-yellow-400";
  if (totalFee <= 500) return "text-orange-400";
  return "text-red-400";
};

export default function CapsuleTypeSelector({
  selectedType,
  onTypeSelect,
}: CapsuleTypeSelectorProps) {
  const [expandedType, setExpandedType] = useState<CapsuleType | null>(null);

  const capsuleTypes = Object.values(CAPSULE_TYPE_CONFIGS);
  const selectedConfig = CAPSULE_TYPE_CONFIGS[selectedType];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.GUARDIAN}20` }}
          >
            <Shield
              className="h-5 w-5"
              style={{ color: BRAND_COLORS.GUARDIAN }}
            />
          </div>
          <div>
            <span className="text-white">Select Capsule Type</span>
            <div className="text-sm text-slate-400">
              Choose the verification level and features for your capsule
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Type Summary */}
        {selectedConfig && (
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {React.createElement(getTypeIcon(selectedType), {
                  className: "w-6 h-6 text-white",
                })}
                <div>
                  <h3 className="text-white font-semibold">
                    {selectedConfig.name}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {selectedConfig.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-bold text-lg ${getFeeCSSClass(
                    selectedConfig.baseFee + selectedConfig.premiumFee,
                  )}`}
                >
                  {selectedConfig.baseFee + selectedConfig.premiumFee} GTT
                </div>
                <div className="text-slate-400 text-xs">Total Cost</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedConfig.features.map((feature, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="border-slate-600 text-slate-300 text-xs"
                >
                  <Check className="w-3 h-3 mr-1" />
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capsuleTypes.map((config) => {
            const Icon = getTypeIcon(config.id);
            const isSelected = selectedType === config.id;
            const isExpanded = expandedType === config.id;
            const totalFee = config.baseFee + config.premiumFee;

            return (
              <Card
                key={config.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected
                    ? "border-purple-500 bg-purple-900/20"
                    : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                }`}
                onClick={() => onTypeSelect(config.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? "bg-purple-600" : "bg-slate-700"
                        }`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">
                          {config.name}
                        </h4>
                        <div
                          className={`font-semibold text-sm ${getFeeCSSClass(
                            totalFee,
                          )}`}
                        >
                          {totalFee} GTT
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="p-1 rounded-full bg-purple-600">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                    {config.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {config.features.slice(0, 2).map((feature, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="border-slate-600 text-slate-400 text-xs px-1 py-0"
                      >
                        {feature}
                      </Badge>
                    ))}
                    {config.features.length > 2 && (
                      <Badge
                        variant="outline"
                        className="border-slate-600 text-slate-500 text-xs px-1 py-0"
                      >
                        +{config.features.length - 2}
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedType(isExpanded ? null : config.id);
                    }}
                  >
                    {isExpanded ? "Less" : "More"} Details
                  </Button>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="text-slate-500">Base Fee:</span>
                          <span className="text-white ml-1">
                            {config.baseFee} GTT
                          </span>
                        </div>
                        <div className="text-xs">
                          <span className="text-slate-500">Premium Fee:</span>
                          <span className="text-white ml-1">
                            {config.premiumFee} GTT
                          </span>
                        </div>
                        {config.requiredFields && (
                          <div className="text-xs">
                            <span className="text-slate-500">Required:</span>
                            <div className="text-slate-400 mt-1">
                              {config.requiredFields.join(", ")}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cost Breakdown */}
        {selectedConfig && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Cost Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Base Processing Fee</span>
                <span className="text-white">{selectedConfig.baseFee} GTT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Premium Features</span>
                <span className="text-white">
                  {selectedConfig.premiumFee} GTT
                </span>
              </div>
              <div className="border-t border-slate-600 pt-2 flex justify-between font-semibold">
                <span className="text-white">Total Cost</span>
                <span
                  className={getFeeCSSClass(
                    selectedConfig.baseFee + selectedConfig.premiumFee,
                  )}
                >
                  {selectedConfig.baseFee + selectedConfig.premiumFee} GTT
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
