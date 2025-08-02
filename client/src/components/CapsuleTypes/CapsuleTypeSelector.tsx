import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Scale,
  Brain,
  Palette,
  Building,
  DollarSign,
  Award,
  Bot,
  Link,
  Video,
  Newspaper,
  AlertTriangle,
  Eye,
  Heart,
  Check,
  Info,
} from "lucide-react";
import {
  CapsuleType,
  CAPSULE_TYPE_CONFIGS,
  CapsuleTypeConfig,
} from "@/types/capsule";
import { BRAND_COLORS } from "@/lib/constants";

interface CapsuleTypeSelectorProps {
  selectedType: CapsuleType;
  onTypeSelect: (type: CapsuleType) => void;
}

const iconMap = {
  FileText,
  Scale,
  Brain,
  Palette,
  Building,
  DollarSign,
  Award,
  Bot,
  Link,
  Video,
  Newspaper,
  AlertTriangle,
  Eye,
  Heart,
};

export default function CapsuleTypeSelector({
  selectedType,
  onTypeSelect,
}: CapsuleTypeSelectorProps) {
  const [hoveredType, setHoveredType] = useState<CapsuleType | null>(null);

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || FileText;
    return Icon;
  };

  const getFeeCost = (config: CapsuleTypeConfig) => {
    return config.baseFee + config.premiumFee;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${BRAND_COLORS.GUARDIAN}20` }}
            >
              <Award
                className="h-5 w-5"
                style={{ color: BRAND_COLORS.GUARDIAN }}
              />
            </div>
            <span className="text-white">Choose Capsule Type</span>
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Select the type that best matches your content. Each type has
            specialized features and verification methods.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(CAPSULE_TYPE_CONFIGS).map((config) => {
              const Icon = getIcon(config.icon);
              const isSelected = selectedType === config.id;
              const isHovered = hoveredType === config.id;

              return (
                <Card
                  key={config.id}
                  className={`cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? "border-purple-500 bg-purple-900/20"
                      : isHovered
                        ? "border-slate-500 bg-slate-700/30"
                        : "border-slate-600 bg-slate-700/20 hover:bg-slate-700/30"
                  }`}
                  onClick={() => onTypeSelect(config.id)}
                  onMouseEnter={() => setHoveredType(config.id)}
                  onMouseLeave={() => setHoveredType(null)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${config.color}/20`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      {isSelected && (
                        <div className="p-1 bg-purple-500 rounded-full">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-white font-semibold text-sm mb-2">
                      {config.name}
                    </h3>

                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                      {config.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">
                          Total Cost
                        </span>
                        <Badge className="bg-yellow-600/20 text-yellow-400 text-xs">
                          {getFeeCost(config)} GTT
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {config.features.slice(0, 2).map((feature, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-slate-600 text-slate-300 text-xs px-1 py-0"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {config.features.length > 2 && (
                          <Badge
                            variant="outline"
                            className="border-slate-600 text-slate-400 text-xs px-1 py-0"
                          >
                            +{config.features.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Type Details */}
      {selectedType && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-400" />
              <span className="text-white">
                {CAPSULE_TYPE_CONFIGS[selectedType].name} Details
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              {CAPSULE_TYPE_CONFIGS[selectedType].description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">
                  Features Included
                </h4>
                <div className="space-y-1">
                  {CAPSULE_TYPE_CONFIGS[selectedType].features.map(
                    (feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-400" />
                        <span className="text-slate-300 text-sm">
                          {feature}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">
                  Cost Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Base Fee</span>
                    <span className="text-white">
                      {CAPSULE_TYPE_CONFIGS[selectedType].baseFee} GTT
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Premium Features</span>
                    <span className="text-white">
                      {CAPSULE_TYPE_CONFIGS[selectedType].premiumFee} GTT
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t border-slate-600 pt-2">
                    <span className="text-white">Total</span>
                    <span className="text-yellow-400">
                      {getFeeCost(CAPSULE_TYPE_CONFIGS[selectedType])} GTT
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {CAPSULE_TYPE_CONFIGS[selectedType].requiredFields && (
              <div>
                <h4 className="text-white font-semibold mb-2">
                  Required Information
                </h4>
                <div className="flex flex-wrap gap-2">
                  {CAPSULE_TYPE_CONFIGS[selectedType].requiredFields!.map(
                    (field, index) => (
                      <Badge
                        key={index}
                        className="bg-orange-600/20 text-orange-400"
                      >
                        {field
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
