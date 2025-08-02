import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  PlayCircle,
  Lightbulb,
  Target,
  Compass,
  Star
} from 'lucide-react';

interface WalkthroughStep {
  target: string;
  title: string;
  description: string;
  action?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
}

interface WalkthroughOverlayProps {
  isActive: boolean;
  steps: WalkthroughStep[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  onSkip: () => void;
  title: string;
  description: string;
}

export default function WalkthroughOverlay({
  isActive,
  steps,
  currentStep,
  onNext,
  onPrevious,
  onComplete,
  onSkip,
  title,
  description
}: WalkthroughOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [highlightElement, setHighlightElement] = useState<Element | null>(null);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive && steps[currentStep]) {
      const targetElement = document.querySelector(`[data-walkthrough="${steps[currentStep].target}"]`);
      if (targetElement) {
        setHighlightElement(targetElement);
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isActive, currentStep, steps]);

  if (!isVisible || !steps.length) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const getTooltipPosition = (element: Element | null) => {
    if (!element) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const rect = element.getBoundingClientRect();
    const position = currentStepData.position || 'bottom';
    
    switch (position) {
      case 'top':
        return {
          top: `${rect.top - 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - 20}px`,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 20}px`,
          transform: 'translate(0, -50%)'
        };
      default:
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, 0)'
        };
    }
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
      
      {/* Highlight Spotlight */}
      {highlightElement && (
        <div
          className="fixed z-45 pointer-events-none"
          style={{
            top: highlightElement.getBoundingClientRect().top - 8,
            left: highlightElement.getBoundingClientRect().left - 8,
            width: highlightElement.getBoundingClientRect().width + 16,
            height: highlightElement.getBoundingClientRect().height + 16,
            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '12px',
            animation: 'pulse 2s infinite'
          }}
        />
      )}

      {/* Walkthrough Card */}
      <Card 
        className="fixed z-50 w-96 bg-black/90 backdrop-blur-xl border-indigo-500/30 shadow-2xl"
        style={getTooltipPosition(highlightElement)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">{title}</CardTitle>
                <p className="text-sm text-gray-400 mt-1">{description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">
                Step {currentStep + 1} of {steps.length}
              </span>
              <Badge variant="outline" className="border-indigo-400 text-indigo-300">
                {Math.round(progress)}%
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current Step Content */}
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Target className="w-3 h-3 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">{currentStepData.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {currentStepData.description}
                </p>
                {currentStepData.action && (
                  <div className="mt-3 p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-lg">
                    <div className="flex items-center">
                      <Lightbulb className="w-4 h-4 text-indigo-400 mr-2" />
                      <span className="text-sm text-indigo-300 font-medium">
                        {currentStepData.action}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={isFirstStep}
              className="border-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-gray-400"
              >
                Skip Tour
              </Button>
              
              {isLastStep ? (
                <Button
                  onClick={onComplete}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Complete
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Mini Steps Preview */}
          <div className="pt-3 border-t border-gray-700">
            <div className="flex space-x-2 overflow-x-auto">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`
                    flex-shrink-0 w-3 h-3 rounded-full cursor-pointer transition-colors
                    ${index < currentStep 
                      ? 'bg-green-500' 
                      : index === currentStep 
                        ? 'bg-indigo-500' 
                        : 'bg-gray-600'
                    }
                  `}
                  onClick={() => {
                    // Allow jumping to any step
                    const diff = index - currentStep;
                    if (diff > 0) {
                      for (let i = 0; i < diff; i++) onNext();
                    } else if (diff < 0) {
                      for (let i = 0; i < Math.abs(diff); i++) onPrevious();
                    }
                  }}
                  title={step.title}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Celebration for Completion */}
      {isLastStep && (
        <div className="fixed top-4 right-4 z-60">
          <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-green-300 font-medium">Almost there! One more step...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5); }
          50% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.8), 0 0 0 9999px rgba(0, 0, 0, 0.5); }
        }
      `}</style>
    </>
  );
}