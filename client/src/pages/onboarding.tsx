import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Target,
  Settings,
  Globe
} from 'lucide-react';
import { 
  enterpriseAuth, 
  ONBOARDING_STEPS, 
  USER_TIERS, 
  getTierDisplayName,
  type UserProfile 
} from '@/lib/auth/enterprise-auth';
import { useLocation } from 'wouter';

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    industry: '',
    useCase: '',
    teamSize: '',
    complianceNeeds: [],
    integrations: [],
    aiAssistance: true
  });

  const totalSteps = ONBOARDING_STEPS.length;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    loadStepRecommendations();
  }, [currentStep]);

  const loadStepRecommendations = async () => {
    try {
      const recommendations = await enterpriseAuth.getOnboardingRecommendations(currentStep, {
        profile,
        preferences,
        step: currentStep
      });
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      await enterpriseAuth.updateProfile({
        ...profile,
        onboardingStep: totalSteps + 1,
        metadata: {
          ...profile.metadata,
          preferences,
          onboardingCompleted: true,
          completedAt: new Date().toISOString()
        }
      });
      setLocation('/');
    } catch (error) {
      console.error('Onboarding completion failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-400" />
                Tell us about your goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="media">Media & Entertainment</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="useCase">Primary Use Case</Label>
                <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, useCase: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="How will you use GUARDIANCHAIN?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content-protection">Content Protection</SelectItem>
                    <SelectItem value="idea-verification">Idea Verification</SelectItem>
                    <SelectItem value="legal-documentation">Legal Documentation</SelectItem>
                    <SelectItem value="research-validation">Research Validation</SelectItem>
                    <SelectItem value="brand-protection">Brand Protection</SelectItem>
                    <SelectItem value="data-monetization">Data Monetization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="teamSize">Organization Size</Label>
                <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, teamSize: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="small">Small Team (2-10)</SelectItem>
                    <SelectItem value="medium">Medium (11-50)</SelectItem>
                    <SelectItem value="large">Large (51-200)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (200+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Compliance Requirements</Label>
                <div className="space-y-3">
                  {['GDPR', 'CCPA', 'HIPAA', 'SOX', 'PCI DSS', 'ISO 27001'].map((compliance) => (
                    <div key={compliance} className="flex items-center space-x-2">
                      <Checkbox 
                        id={compliance}
                        checked={preferences.complianceNeeds.includes(compliance)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPreferences(prev => ({
                              ...prev,
                              complianceNeeds: [...prev.complianceNeeds, compliance]
                            }));
                          } else {
                            setPreferences(prev => ({
                              ...prev,
                              complianceNeeds: prev.complianceNeeds.filter(c => c !== compliance)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={compliance} className="text-sm">{compliance}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="security-preferences">Additional Security Notes</Label>
                <Textarea 
                  placeholder="Any specific security requirements or concerns..."
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-400" />
                Integration Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Platforms to Connect</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Google Workspace',
                    'Microsoft 365',
                    'Slack',
                    'Notion',
                    'GitHub',
                    'Figma',
                    'Adobe Creative',
                    'Salesforce'
                  ].map((integration) => (
                    <div key={integration} className="flex items-center space-x-2">
                      <Checkbox 
                        id={integration}
                        checked={preferences.integrations.includes(integration)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPreferences(prev => ({
                              ...prev,
                              integrations: [...prev.integrations, integration]
                            }));
                          } else {
                            setPreferences(prev => ({
                              ...prev,
                              integrations: prev.integrations.filter(i => i !== integration)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={integration} className="text-sm">{integration}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                AI Assistant Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ai-assistance"
                  checked={preferences.aiAssistance}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, aiAssistance: !!checked }))
                  }
                />
                <Label htmlFor="ai-assistance">Enable AI-powered recommendations and analysis</Label>
              </div>

              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="font-medium text-purple-400 mb-2">AI Features Include:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Content optimization suggestions</li>
                  <li>• Viral potential analysis</li>
                  <li>• Automated value estimation</li>
                  <li>• Compliance risk assessment</li>
                  <li>• Strategic recommendations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Setup Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-semibold mb-2">Welcome to GUARDIANCHAIN!</h3>
                <p className="text-slate-300 mb-6">
                  Your enterprise-grade truth verification platform is ready.
                </p>
              </div>

              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Your Configuration Summary:</h4>
                <div className="text-sm text-slate-300 space-y-1">
                  <p><strong>Industry:</strong> {preferences.industry}</p>
                  <p><strong>Use Case:</strong> {preferences.useCase}</p>
                  <p><strong>Team Size:</strong> {preferences.teamSize}</p>
                  <p><strong>Compliance:</strong> {preferences.complianceNeeds.join(', ') || 'None selected'}</p>
                  <p><strong>Integrations:</strong> {preferences.integrations.length} platforms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to GUARDIANCHAIN</h1>
          <p className="text-slate-300 mb-6">Let's set up your enterprise verification platform</p>
          
          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderStep()}
            
            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button 
                onClick={handlePrevious}
                disabled={currentStep === 1}
                variant="outline"
                className="bg-slate-700 hover:bg-slate-600"
              >
                Previous
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {currentStep === totalSteps ? (
                  loading ? 'Completing...' : 'Complete Setup'
                ) : (
                  <>
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* AI Recommendations Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Brain className="w-4 h-4 mr-2 text-green-400" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aiRecommendations ? (
                  <div className="space-y-4">
                    {aiRecommendations.recommendations && (
                      <div>
                        <h4 className="text-xs font-medium text-green-400 mb-2">Suggestions</h4>
                        <ul className="text-xs text-slate-300 space-y-1">
                          {aiRecommendations.recommendations.slice(0, 3).map((rec: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-3 h-3 text-green-400 mr-1 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {aiRecommendations.tips && (
                      <div>
                        <h4 className="text-xs font-medium text-blue-400 mb-2">Tips</h4>
                        <ul className="text-xs text-slate-300 space-y-1">
                          {aiRecommendations.tips.slice(0, 2).map((tip: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <Sparkles className="w-3 h-3 text-blue-400 mr-1 mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiRecommendations.estimatedTime && (
                      <div className="bg-slate-700 p-2 rounded text-center">
                        <span className="text-xs text-slate-400">
                          ⏱️ {aiRecommendations.estimatedTime}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}