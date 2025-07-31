import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  X, 
  Lightbulb, 
  Target, 
  Zap,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from "lucide-react";

interface TooltipStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position: "top" | "bottom" | "left" | "right" | "center";
  action?: {
    text: string;
    onClick: () => void;
  };
  reward?: number;
  mandatory?: boolean;
}

interface InteractiveTooltipProps {
  steps: TooltipStep[];
  isActive: boolean;
  onComplete: () => void;
  onClose: () => void;
  currentStepIndex?: number;
}

export default function InteractiveTooltip({ 
  steps, 
  isActive, 
  onComplete, 
  onClose,
  currentStepIndex = 0 
}: InteractiveTooltipProps) {
  const [currentStep, setCurrentStep] = useState(currentStepIndex);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentTooltip = steps[currentStep];

  useEffect(() => {
    if (!isActive || !currentTooltip) return;

    const updatePosition = () => {
      const targetElement = document.querySelector(currentTooltip.target);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      setHighlightRect(rect);

      let x = 0;
      let y = 0;

      switch (currentTooltip.position) {
        case "top":
          x = rect.left + rect.width / 2;
          y = rect.top - 20;
          break;
        case "bottom":
          x = rect.left + rect.width / 2;
          y = rect.bottom + 20;
          break;
        case "left":
          x = rect.left - 20;
          y = rect.top + rect.height / 2;
          break;
        case "right":
          x = rect.right + 20;
          y = rect.top + rect.height / 2;
          break;
        case "center":
          x = window.innerWidth / 2;
          y = window.innerHeight / 2;
          break;
      }

      setTooltipPosition({ x, y });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [currentStep, currentTooltip, isActive]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  if (!isActive || !currentTooltip) return null;

  const getTooltipStyle = () => {
    let transform = "translate(-50%, -50%)";
    
    switch (currentTooltip.position) {
      case "top":
        transform = "translate(-50%, -100%)";
        break;
      case "bottom":
        transform = "translate(-50%, 0%)";
        break;
      case "left":
        transform = "translate(-100%, -50%)";
        break;
      case "right":
        transform = "translate(0%, -50%)";
        break;
    }

    return {
      position: "fixed" as const,
      left: tooltipPosition.x,
      top: tooltipPosition.y,
      transform,
      zIndex: 10001,
    };
  };

  return createPortal(
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 10000 }}
        onClick={skipTour}
      />

      {/* Highlight cutout */}
      {highlightRect && (
        <div
          className="fixed border-2 border-purple-400 bg-transparent pointer-events-none animate-pulse"
          style={{
            left: highlightRect.left - 4,
            top: highlightRect.top - 4,
            width: highlightRect.width + 8,
            height: highlightRect.height + 8,
            zIndex: 10000,
            borderRadius: "8px",
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
          }}
        />
      )}

      {/* Tooltip */}
      <Card
        ref={tooltipRef}
        style={getTooltipStyle()}
        className="bg-slate-800 border-slate-600 max-w-sm shadow-2xl"
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/20 rounded">
                <Lightbulb className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white text-sm">
                {currentTooltip.title}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-white"
              onClick={skipTour}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-1 mb-3">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full flex-1 ${
                  index <= currentStep ? "bg-purple-400" : "bg-slate-600"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <p className="text-slate-300 text-sm mb-4 leading-relaxed">
            {currentTooltip.content}
          </p>

          {/* Reward badge */}
          {currentTooltip.reward && (
            <Badge className="mb-3 bg-gradient-to-r from-yellow-600 to-orange-600">
              <Target className="w-3 h-3 mr-1" />
              +{currentTooltip.reward} GTT
            </Badge>
          )}

          {/* Action button */}
          {currentTooltip.action && (
            <Button
              size="sm"
              className="w-full mb-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={currentTooltip.action.onClick}
            >
              <Zap className="w-4 h-4 mr-2" />
              {currentTooltip.action.text}
            </Button>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="h-8 px-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-xs text-slate-400 px-2">
                {currentStep + 1} of {steps.length}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={nextStep}
                className="h-8 px-2"
              >
                {currentStep === steps.length - 1 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="text-xs text-slate-400 hover:text-white h-8"
              >
                Skip Tour
              </Button>
              
              <Button
                size="sm"
                onClick={nextStep}
                className="h-8 bg-purple-600 hover:bg-purple-700"
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>,
    document.body
  );
}

// Hook for managing tooltip tours
export function useTooltipTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentTour, setCurrentTour] = useState<TooltipStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const startTour = (steps: TooltipStep[], startIndex = 0) => {
    setCurrentTour(steps);
    setCurrentStepIndex(startIndex);
    setIsActive(true);
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentTour([]);
    setCurrentStepIndex(0);
  };

  const resetTour = () => {
    setCurrentStepIndex(0);
  };

  return {
    isActive,
    currentTour,
    currentStepIndex,
    startTour,
    endTour,
    resetTour,
  };
}