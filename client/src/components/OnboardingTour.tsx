import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft, Sparkles, Shield, Coins, Users, Search } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  position: { top?: string; left?: string; right?: string; bottom?: string };
  highlight?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to GUARDIANCHAIN',
    description: 'Your sovereign memory infrastructure where truth is sealed and tokenized. Let\'s explore the key features that make your memories immortal.',
    icon: Sparkles,
    position: { top: '50%', left: '50%' }
  },
  {
    id: 'create-capsule',
    title: 'Create Truth Capsules',
    description: 'Seal your most important memories with cryptographic proof. Each capsule becomes an immutable piece of your legacy.',
    icon: Shield,
    position: { top: '20%', left: '20%' },
    highlight: '[data-tour="create-capsule"]'
  },
  {
    id: 'earn-rewards',
    title: 'Earn GTT Tokens',
    description: 'Your emotional resonance generates yield. The more grief or joy your capsule carries, the more tokens you earn.',
    icon: Coins,
    position: { top: '20%', right: '20%' },
    highlight: '[data-tour="token-rewards"]'
  },
  {
    id: 'jury-validation',
    title: 'Join the Jury',
    description: 'Validate other capsules and earn rewards. Your judgment helps maintain the integrity of our truth network.',
    icon: Users,
    position: { bottom: '20%', left: '20%' },
    highlight: '[data-tour="jury-panel"]'
  },
  {
    id: 'explore-capsules',
    title: 'Explore & Discover',
    description: 'Browse the collective memory of humanity. Filter by emotion, time period, or search for specific truths.',
    icon: Search,
    position: { bottom: '20%', right: '20%' },
    highlight: '[data-tour="capsule-explorer"]'
  }
];

interface OnboardingTourProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingTour({ isOpen, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [isOpen]);

  const currentTourStep = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onSkip, 300);
  };

  // Highlight target element
  useEffect(() => {
    if (currentTourStep.highlight) {
      const element = document.querySelector(currentTourStep.highlight);
      if (element) {
        element.classList.add('tour-highlight');
        return () => element.classList.remove('tour-highlight');
      }
    }
  }, [currentTourStep]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
        )}
      </AnimatePresence>

      {/* Tour Card */}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed z-[101]"
            style={{
              top: currentTourStep.position.top || 'auto',
              left: currentTourStep.position.left || 'auto',
              right: currentTourStep.position.right || 'auto',
              bottom: currentTourStep.position.bottom || 'auto',
              transform: currentTourStep.position.top === '50%' && currentTourStep.position.left === '50%' 
                ? 'translate(-50%, -50%)' : 'none'
            }}
          >
            <Card className="w-80 bg-slate-900/95 border-blue-500/30 shadow-2xl backdrop-blur-md">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <currentTourStep.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {currentTourStep.title}
                      </h3>
                      <p className="text-xs text-blue-400">
                        Step {currentStep + 1} of {tourSteps.length}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-slate-400 hover:text-white h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  {currentTourStep.description}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-1 mb-4">
                  <motion.div
                    className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={isFirstStep}
                    className="text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex space-x-1">
                    {tourSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentStep ? 'bg-blue-500' : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLastStep ? (
                      <>
                        Complete
                        <Sparkles className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Tour highlight styles (add to global CSS)
export const tourHighlightStyles = `
.tour-highlight {
  position: relative;
  z-index: 99;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  animation: tour-pulse 2s infinite;
}

@keyframes tour-pulse {
  0%, 100% { 
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% { 
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.5);
  }
}
`;