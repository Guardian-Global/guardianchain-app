import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Camera,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Lock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IdentityVerificationProps {
  onComplete: () => void;
}

type VerificationMethod = "document" | "biometric" | "social";
type VerificationStatus = "pending" | "in_progress" | "completed" | "failed";

export default function IdentityVerification({
  onComplete,
}: IdentityVerificationProps) {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] =
    useState<VerificationMethod | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("pending");
  const [isLoading, setIsLoading] = useState(false);

  const verificationMethods = [
    {
      id: "document" as VerificationMethod,
      title: "Government ID Verification",
      description:
        "Upload a government-issued ID (passport, driver's license, national ID)",
      icon: <FileText className="h-6 w-6" />,
      recommended: true,
      features: [
        "Industry-standard KYC compliance",
        "AI-powered document verification",
        "Real-time fraud detection",
        "Secure encrypted storage",
      ],
    },
    {
      id: "biometric" as VerificationMethod,
      title: "Biometric Verification",
      description: "Face recognition and liveness detection using your camera",
      icon: <Camera className="h-6 w-6" />,
      recommended: false,
      features: [
        "Advanced liveness detection",
        "Face matching technology",
        "Anti-spoofing protection",
        "Quick 30-second process",
      ],
    },
    {
      id: "social" as VerificationMethod,
      title: "Social Identity Verification",
      description: "Verify through established social media accounts",
      icon: <User className="h-6 w-6" />,
      recommended: false,
      features: [
        "LinkedIn profile verification",
        "GitHub account linking",
        "Twitter/X verification",
        "Cross-platform identity matching",
      ],
    },
  ];

  const startVerification = async (method: VerificationMethod) => {
    setIsLoading(true);
    setSelectedMethod(method);
    setVerificationStatus("in_progress");

    try {
      // Simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // For demo purposes, simulate successful verification
      const success = Math.random() > 0.1; // 90% success rate

      if (success) {
        setVerificationStatus("completed");
        toast({
          title: "Verification Successful!",
          description: "Your identity has been verified successfully.",
        });

        // Complete the step after a short delay
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setVerificationStatus("failed");
        toast({
          title: "Verification Failed",
          description: "Please try again with a different method.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setVerificationStatus("failed");
      toast({
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetVerification = () => {
    setSelectedMethod(null);
    setVerificationStatus("pending");
  };

  if (verificationStatus === "completed") {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Identity Verified!
          </h3>
          <p className="text-slate-400">
            Your identity has been successfully verified. You now have full
            access to all platform features.
          </p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500">
          <Shield className="h-3 w-3 mr-1" />
          Verified Account
        </Badge>
      </div>
    );
  }

  if (verificationStatus === "in_progress") {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center">
          <Clock className="h-10 w-10 text-purple-400 animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Verification in Progress
          </h3>
          <p className="text-slate-400">
            Please wait while we verify your identity. This usually takes 1-3
            minutes.
          </p>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full animate-pulse"
            style={{ width: "70%" }}
          ></div>
        </div>
        <Button
          variant="outline"
          onClick={resetVerification}
          className="border-slate-600 text-slate-300"
        >
          Cancel Verification
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Verify Your Identity
        </h3>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Identity verification helps us prevent bots, imposters, and fraudulent
          accounts. Choose your preferred verification method below.
        </p>
      </div>

      {/* Security Notice */}
      <Alert className="bg-blue-500/10 border-blue-500/20">
        <Lock className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200">
          <strong>Your privacy is protected:</strong> All verification data is
          encrypted and stored securely. We never share your personal
          information with third parties.
        </AlertDescription>
      </Alert>

      {/* Verification Methods */}
      <div className="grid gap-4">
        {verificationMethods.map((method) => (
          <Card
            key={method.id}
            className={`bg-slate-700/50 border-slate-600 cursor-pointer transition-all hover:bg-slate-700/70 ${
              selectedMethod === method.id ? "ring-2 ring-purple-500" : ""
            }`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  {method.icon}
                  {method.title}
                </div>
                {method.recommended && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500">
                    Recommended
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">{method.description}</p>
              <ul className="space-y-2">
                {method.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => selectedMethod && startVerification(selectedMethod)}
          disabled={!selectedMethod || isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white min-w-[200px]"
        >
          {isLoading ? "Starting Verification..." : "Start Verification"}
        </Button>
      </div>

      {/* Verification Failed State */}
      {verificationStatus === "failed" && (
        <Alert className="bg-red-500/10 border-red-500/20">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            Verification failed. Please try again with a different method or
            contact support if the issue persists.
          </AlertDescription>
        </Alert>
      )}

      {/* Help Section */}
      <div className="text-center">
        <p className="text-slate-400 text-sm mb-2">
          Need help with verification?
        </p>
        <Button
          variant="link"
          className="text-purple-400 hover:text-purple-300 p-0"
        >
          Contact Support Team
        </Button>
      </div>
    </div>
  );
}
