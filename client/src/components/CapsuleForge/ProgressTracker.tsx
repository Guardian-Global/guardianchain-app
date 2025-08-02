import React from "react";
import { CheckCircle, Clock, Upload, Zap, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressStep {
  id: string;
  label: string;
  description: string;
  status: "pending" | "active" | "completed" | "error";
  icon: React.ComponentType<any>;
}

interface ProgressTrackerProps {
  currentStep: string;
  steps?: ProgressStep[];
  progress: number;
  isUploading: boolean;
  metadata?: {
    ipfsHash?: string;
    estimatedTime?: string;
    fileSize?: string;
  };
}

const defaultSteps: ProgressStep[] = [
  {
    id: "content-analysis",
    label: "Content Analysis",
    description: "AI analyzing content for optimization",
    status: "pending",
    icon: Bot,
  },
  {
    id: "metadata-extraction",
    label: "Metadata Extraction",
    description: "Extracting key information and tags",
    status: "pending",
    icon: Zap,
  },
  {
    id: "ipfs-upload",
    label: "IPFS Upload",
    description: "Uploading to decentralized storage",
    status: "pending",
    icon: Upload,
  },
  {
    id: "blockchain-mint",
    label: "Blockchain Minting",
    description: "Creating immutable truth capsule",
    status: "pending",
    icon: CheckCircle,
  },
];

export default function ProgressTracker({
  currentStep,
  steps = defaultSteps,
  progress,
  isUploading,
  metadata = {},
}: ProgressTrackerProps) {
  const getStepStatus = (stepId: string): ProgressStep["status"] => {
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    const currentIndex = steps.findIndex((step) => step.id === currentStep);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex && isUploading) return "active";
    if (stepIndex === currentIndex && !isUploading) return "pending";
    return "pending";
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-400" />
          Real-time Creation Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Overall Progress</span>
            <span className="text-purple-400 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Progress */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.id);
            const IconComponent = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  stepStatus === "active"
                    ? "bg-purple-900/30 border border-purple-500/50"
                    : stepStatus === "completed"
                      ? "bg-green-900/20 border border-green-500/30"
                      : "bg-slate-900/30"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    stepStatus === "completed"
                      ? "bg-green-500 text-white"
                      : stepStatus === "active"
                        ? "bg-purple-500 text-white animate-pulse"
                        : "bg-slate-700 text-slate-400"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium">{step.label}</h4>
                    <Badge
                      variant={
                        stepStatus === "completed"
                          ? "default"
                          : stepStatus === "active"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        stepStatus === "completed"
                          ? "bg-green-500"
                          : stepStatus === "active"
                            ? "bg-purple-500"
                            : ""
                      }
                    >
                      {stepStatus === "completed"
                        ? "Done"
                        : stepStatus === "active"
                          ? "Processing"
                          : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Metadata Display */}
        {(metadata.ipfsHash || metadata.estimatedTime || metadata.fileSize) && (
          <div className="bg-slate-900/50 rounded-lg p-4 space-y-2">
            <h4 className="text-white font-medium">Progress Details</h4>
            {metadata.ipfsHash && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">IPFS Hash:</span>
                <span className="text-green-400 font-mono">
                  {metadata.ipfsHash.slice(0, 20)}...
                </span>
              </div>
            )}
            {metadata.estimatedTime && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Est. Time:</span>
                <span className="text-purple-400">
                  {metadata.estimatedTime}
                </span>
              </div>
            )}
            {metadata.fileSize && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Content Size:</span>
                <span className="text-blue-400">{metadata.fileSize}</span>
              </div>
            )}
          </div>
        )}

        {/* Real-time Status */}
        <div className="text-center">
          {isUploading ? (
            <div className="flex items-center justify-center gap-2 text-purple-400">
              <div className="animate-spin w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"></div>
              <span className="text-sm">Creating your truth capsule...</span>
            </div>
          ) : progress === 100 ? (
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Capsule created successfully!</span>
            </div>
          ) : (
            <div className="text-slate-400 text-sm">
              Ready to begin creation process
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
