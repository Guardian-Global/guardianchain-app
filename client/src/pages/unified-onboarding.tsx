import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function UnifiedOnboardingPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    agreedToTerms: false,
    tier: "EXPLORER" as const,
    industry: "",
    useCase: "",
  });

  const handleLogin = () => {
    setCurrentStep(1);
    toast({
      title: "Login Successful",
      description: "Welcome back to GUARDIANCHAIN",
    });
  };

  const handleRegister = () => {
    setCurrentStep(1);
    toast({
      title: "Account Created",
      description: "Welcome to GUARDIANCHAIN",
    });
  };

  const handleMasterLogin = () => {
    setCurrentStep(3);
    toast({
      title: "Master Access Granted",
      description: "Full system access enabled",
    });
  };

  const AuthStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome to GUARDIANCHAIN
        </h2>
        <p className="text-slate-400">Choose your access method</p>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Sign Up</TabsTrigger>
          <TabsTrigger value="master">Master</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <div>
            <Label htmlFor="loginEmail">Email</Label>
            <Input
              id="loginEmail"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-slate-800 border-slate-700"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <Label htmlFor="loginPassword">Password</Label>
            <Input
              id="loginPassword"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="bg-slate-800 border-slate-700"
            />
          </div>
          <Button
            onClick={handleLogin}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Sign In
          </Button>
        </TabsContent>

        <TabsContent value="register" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="registerEmail">Email</Label>
            <Input
              id="registerEmail"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-slate-800 border-slate-700"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <Label htmlFor="registerPassword">Password</Label>
            <Input
              id="registerPassword"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="bg-slate-800 border-slate-700"
              placeholder="Minimum 8 characters"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreedToTerms}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, agreedToTerms: !!checked })
              }
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the Terms of Service and Privacy Policy
            </Label>
          </div>
          <Button
            onClick={handleRegister}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!formData.agreedToTerms}
          >
            Create Account
          </Button>
        </TabsContent>

        <TabsContent value="master" className="space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-red-400 font-semibold mb-2">
              Master Admin Access
            </h3>
            <p className="text-sm text-slate-400">
              Master credentials provide full system access and override all
              restrictions.
            </p>
          </div>
          <div>
            <Label htmlFor="masterEmail">Master Email</Label>
            <Input
              id="masterEmail"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-slate-800 border-slate-700"
              placeholder="master@guardianchain.org"
            />
          </div>
          <div>
            <Label htmlFor="masterPassword">Master Password</Label>
            <Input
              id="masterPassword"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="bg-slate-800 border-slate-700"
            />
          </div>
          <Button
            onClick={handleMasterLogin}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Master Access
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );

  const TierStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Tier</h2>
        <p className="text-slate-400">
          Select the tier that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          {
            id: "EXPLORER",
            name: "Explorer",
            price: "Free",
            features: [
              "Basic access",
              "Community features",
              "10 capsules/month",
            ],
          },
          {
            id: "SEEKER",
            name: "Seeker",
            price: "$9/month",
            features: [
              "Enhanced access",
              "Priority support",
              "100 capsules/month",
            ],
          },
          {
            id: "CREATOR",
            name: "Creator",
            price: "$29/month",
            features: [
              "Professional tools",
              "Advanced analytics",
              "Unlimited capsules",
            ],
          },
          {
            id: "SOVEREIGN",
            name: "Sovereign",
            price: "$99/month",
            features: ["Full access", "Custom branding", "Enterprise support"],
          },
        ].map((tier) => (
          <Card
            key={tier.id}
            className={`cursor-pointer transition-all ${
              formData.tier === tier.id
                ? "border-purple-500 bg-purple-900/20"
                : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
            }`}
            onClick={() => setFormData({ ...formData, tier: tier.id as any })}
          >
            <CardHeader>
              <CardTitle className="text-white">{tier.name}</CardTitle>
              <p className="text-purple-400 font-semibold">{tier.price}</p>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-400 space-y-1">
                {tier.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={() => setCurrentStep(2)}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        Continue
      </Button>
    </div>
  );

  const ProfileStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Complete Your Profile
        </h2>
        <p className="text-slate-400">
          Tell us about yourself to customize your experience
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) =>
              setFormData({ ...formData, industry: e.target.value })
            }
            className="bg-slate-800 border-slate-700"
            placeholder="e.g., Technology, Finance, Healthcare"
          />
        </div>
        <div>
          <Label htmlFor="useCase">Primary Use Case</Label>
          <Input
            id="useCase"
            value={formData.useCase}
            onChange={(e) =>
              setFormData({ ...formData, useCase: e.target.value })
            }
            className="bg-slate-800 border-slate-700"
            placeholder="e.g., Content verification, Research, Journalism"
          />
        </div>
      </div>

      <Button
        onClick={() => setCurrentStep(3)}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        Complete Setup
      </Button>
    </div>
  );

  const CompletionStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome to GUARDIANCHAIN!
        </h2>
        <p className="text-slate-400">
          Your account is ready. Start exploring the truth verification
          platform.
        </p>
      </div>
      <Button
        onClick={() => (window.location.href = "/")}
        className="bg-purple-600 hover:bg-purple-700"
      >
        Enter Platform
      </Button>
    </div>
  );

  const steps = [
    {
      title: "Authentication",
      description: "Sign in or create account",
      component: AuthStep,
      required: true,
    },
    {
      title: "Choose Tier",
      description: "Select your access level",
      component: TierStep,
      required: true,
    },
    {
      title: "Profile Setup",
      description: "Complete your profile",
      component: ProfileStep,
      required: false,
    },
    {
      title: "Welcome",
      description: "You're all set!",
      component: CompletionStep,
      required: false,
    },
  ];

  const CurrentStepComponent = steps[currentStep]?.component || AuthStep;

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index <= currentStep
                      ? "bg-purple-600 text-white"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-2">
                  <div className="text-sm font-medium text-white">
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-400">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? "bg-purple-600" : "bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8">
            <CurrentStepComponent />
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
