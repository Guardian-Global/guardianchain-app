import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, FileText, TrendingUp, Search, X } from 'lucide-react';

export default function WelcomeTour() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('seenWelcome')) {
      setShow(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('seenWelcome', 'true');
    setShow(false);
    // Redirect to login for authentication
    window.location.href = '/api/login';
  };

  const steps = [
    {
      icon: Shield,
      title: "Welcome to GUARDIANCHAIN",
      content: "The world's first sovereign memory preservation platform. Create truth capsules that grow in value over time."
    },
    {
      icon: FileText,
      title: "Submit Truth Capsules",
      content: "Upload documents, memories, and truth claims. Each capsule is secured on blockchain and preserved forever."
    },
    {
      icon: TrendingUp,
      title: "Earn GTT Token Rewards",
      content: "Your capsules generate yield through community verification and engagement. Real value from preserved truth."
    },
    {
      icon: Search,
      title: "Explore & Verify",
      content: "Discover capsules from others, verify their authenticity, and earn rewards for community participation."
    }
  ];

  if (!show) return null;

  const currentStep = steps[step];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-900 border-slate-700 max-w-md w-full">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <StepIcon className="w-6 h-6 text-white" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComplete}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            {currentStep.title}
          </h2>
          
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {currentStep.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === step ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-2">
              {step > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(step - 1)}
                  className="border-slate-600 text-slate-300"
                >
                  Back
                </Button>
              )}
              
              {step < steps.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setStep(step + 1)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Begin Journey
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}