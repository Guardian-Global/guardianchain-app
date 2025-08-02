import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Users, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Globe,
  Mail,
  Phone,
  FileText,
  Zap,
  Crown,
  Star
} from "lucide-react";

interface InstitutionalForm {
  organizationType: string;
  organizationName: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  useCases: string[];
  estimatedVolume: string;
  complianceRequirements: string[];
  description: string;
  terms: boolean;
  dataProcessing: boolean;
}

export default function InstitutionalOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<InstitutionalForm>({
    organizationType: '',
    organizationName: '',
    industry: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
    useCases: [],
    estimatedVolume: '',
    complianceRequirements: [],
    description: '',
    terms: false,
    dataProcessing: false
  });

  const steps = [
    {
      title: "Organization Details",
      description: "Tell us about your institution",
      icon: Building2
    },
    {
      title: "Contact Information", 
      description: "Primary contact details",
      icon: Users
    },
    {
      title: "Use Cases & Requirements",
      description: "How you plan to use GuardianChain",
      icon: Shield
    },
    {
      title: "Compliance & Legal",
      description: "Terms and regulatory requirements",
      icon: FileText
    }
  ];

  const organizationTypes = [
    { id: 'enterprise', label: 'Enterprise Corporation', description: 'Large companies and multinationals' },
    { id: 'government', label: 'Government Agency', description: 'Federal, state, or local government' },
    { id: 'ngo', label: 'Non-Profit Organization', description: 'NGOs and charitable organizations' },
    { id: 'financial', label: 'Financial Institution', description: 'Banks, credit unions, investment firms' },
    { id: 'healthcare', label: 'Healthcare Provider', description: 'Hospitals, clinics, medical research' },
    { id: 'education', label: 'Educational Institution', description: 'Universities, schools, research institutes' },
    { id: 'media', label: 'Media Organization', description: 'News outlets, publishing companies' },
    { id: 'legal', label: 'Legal Firm', description: 'Law firms and legal services' }
  ];

  const useCases = [
    { id: 'document-verification', label: 'Document Verification', description: 'Authenticate official documents and records' },
    { id: 'compliance-reporting', label: 'Compliance Reporting', description: 'Regulatory compliance and audit trails' },
    { id: 'whistleblower-protection', label: 'Whistleblower Protection', description: 'Secure anonymous reporting system' },
    { id: 'evidence-preservation', label: 'Evidence Preservation', description: 'Legal evidence and testimony storage' },
    { id: 'brand-protection', label: 'Brand Protection', description: 'Combat misinformation and protect reputation' },
    { id: 'research-integrity', label: 'Research Integrity', description: 'Scientific data verification and publication' },
    { id: 'supply-chain', label: 'Supply Chain Verification', description: 'Product authenticity and traceability' },
    { id: 'internal-transparency', label: 'Internal Transparency', description: 'Employee communications and transparency' }
  ];

  const complianceRequirements = [
    { id: 'gdpr', label: 'GDPR Compliance', description: 'European data protection regulation' },
    { id: 'hipaa', label: 'HIPAA Compliance', description: 'Healthcare information privacy' },
    { id: 'sox', label: 'SOX Compliance', description: 'Sarbanes-Oxley financial reporting' },
    { id: 'ferpa', label: 'FERPA Compliance', description: 'Educational records privacy' },
    { id: 'pci-dss', label: 'PCI DSS', description: 'Payment card industry standards' },
    { id: 'iso27001', label: 'ISO 27001', description: 'Information security management' },
    { id: 'fedramp', label: 'FedRAMP', description: 'Federal cloud computing standards' },
    { id: 'other', label: 'Other Requirements', description: 'Custom compliance needs' }
  ];

  const volumeOptions = [
    { id: 'small', label: '1-100 capsules/month', tier: 'Professional' },
    { id: 'medium', label: '100-1,000 capsules/month', tier: 'Enterprise' },
    { id: 'large', label: '1,000-10,000 capsules/month', tier: 'Scale' },
    { id: 'enterprise', label: '10,000+ capsules/month', tier: 'Custom' }
  ];

  const updateFormData = (key: keyof InstitutionalForm, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayField = (key: 'useCases' | 'complianceRequirements', value: string) => {
    const currentArray = formData[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(key, newArray);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle institutional onboarding submission
    console.log('Institutional onboarding submitted:', formData);
    // This would typically send data to backend for processing
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.organizationType && formData.organizationName && formData.industry;
      case 1:
        return formData.contactName && formData.contactEmail;
      case 2:
        return formData.useCases.length > 0 && formData.estimatedVolume;
      case 3:
        return formData.terms && formData.dataProcessing;
      default:
        return false;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Institutional Onboarding
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Enterprise-grade truth verification infrastructure for organizations requiring scalable, compliant solutions
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
              <Crown className="h-3 w-3 mr-1" />
              Institutional Grade
            </Badge>
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
              <Shield className="h-3 w-3 mr-1" />
              SOC 2 Compliant
            </Badge>
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
              <Star className="h-3 w-3 mr-1" />
              Custom Solutions
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Setup Progress</CardTitle>
                <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isActive 
                        ? 'bg-blue-600/20 border-blue-500/50' 
                        : isCompleted 
                          ? 'bg-green-600/10 border-green-500/30' 
                          : 'bg-slate-700/30 border-slate-600/50'
                    }`}>
                      <div className={`p-2 rounded-lg ${
                        isActive 
                          ? 'bg-blue-600/30' 
                          : isCompleted 
                            ? 'bg-green-600/30' 
                            : 'bg-slate-600/30'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <Icon className={`h-5 w-5 ${
                            isActive ? 'text-blue-400' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm ${
                          isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-white'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Steps */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <steps[currentStep].icon className="h-6 w-6 text-blue-400" />
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Step 0: Organization Details */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-white mb-3 block">Organization Type</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {organizationTypes.map((type) => (
                        <Card
                          key={type.id}
                          className={`cursor-pointer transition-all ${
                            formData.organizationType === type.id
                              ? 'bg-blue-600/20 border-blue-500/50'
                              : 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50'
                          }`}
                          onClick={() => updateFormData('organizationType', type.id)}
                        >
                          <CardContent className="p-4">
                            <h4 className="font-medium text-white mb-1">{type.label}</h4>
                            <p className="text-sm text-gray-400">{type.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="orgName" className="text-sm font-medium text-white">
                        Organization Name *
                      </Label>
                      <Input
                        id="orgName"
                        value={formData.organizationName}
                        onChange={(e) => updateFormData('organizationName', e.target.value)}
                        placeholder="Your organization name"
                        className="mt-1 bg-slate-700/50 border-slate-600/50"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="industry" className="text-sm font-medium text-white">
                        Industry *
                      </Label>
                      <Input
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => updateFormData('industry', e.target.value)}
                        placeholder="e.g., Financial Services, Healthcare"
                        className="mt-1 bg-slate-700/50 border-slate-600/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName" className="text-sm font-medium text-white">
                        Primary Contact Name *
                      </Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => updateFormData('contactName', e.target.value)}
                        placeholder="Full name"
                        className="mt-1 bg-slate-700/50 border-slate-600/50"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contactEmail" className="text-sm font-medium text-white">
                        Business Email *
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => updateFormData('contactEmail', e.target.value)}
                        placeholder="contact@organization.com"
                        className="mt-1 bg-slate-700/50 border-slate-600/50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPhone" className="text-sm font-medium text-white">
                        Phone Number
                      </Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => updateFormData('contactPhone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="mt-1 bg-slate-700/50 border-slate-600/50"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="website" className="text-sm font-medium text-white">
                        Website URL
                      </Label>
                      <Input
                        id="website"
                        value={formData.websiteUrl}
                        onChange={(e) => updateFormData('websiteUrl', e.target.value)}
                        placeholder="https://organization.com"
                        className="mt-1 bg-slate-700/50 border-slate-600/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Use Cases & Requirements */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-white mb-3 block">
                      Primary Use Cases * (Select all that apply)
                    </Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {useCases.map((useCase) => (
                        <div key={useCase.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={useCase.id}
                            checked={formData.useCases.includes(useCase.id)}
                            onCheckedChange={() => toggleArrayField('useCases', useCase.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label htmlFor={useCase.id} className="text-sm font-medium text-white cursor-pointer">
                              {useCase.label}
                            </Label>
                            <p className="text-xs text-gray-400 mt-1">{useCase.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-white mb-3 block">
                      Estimated Monthly Volume *
                    </Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {volumeOptions.map((volume) => (
                        <Card
                          key={volume.id}
                          className={`cursor-pointer transition-all ${
                            formData.estimatedVolume === volume.id
                              ? 'bg-blue-600/20 border-blue-500/50'
                              : 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50'
                          }`}
                          onClick={() => updateFormData('estimatedVolume', volume.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-white">{volume.label}</h4>
                              <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs">
                                {volume.tier}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-white">
                      Additional Requirements
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Describe any specific requirements, integrations, or customizations needed..."
                      className="mt-1 bg-slate-700/50 border-slate-600/50 min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Compliance & Legal */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-white mb-3 block">
                      Compliance Requirements (Select all that apply)
                    </Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {complianceRequirements.map((req) => (
                        <div key={req.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={req.id}
                            checked={formData.complianceRequirements.includes(req.id)}
                            onCheckedChange={() => toggleArrayField('complianceRequirements', req.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label htmlFor={req.id} className="text-sm font-medium text-white cursor-pointer">
                              {req.label}
                            </Label>
                            <p className="text-xs text-gray-400 mt-1">{req.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4 p-6 bg-slate-700/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.terms}
                        onCheckedChange={(checked) => updateFormData('terms', checked)}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
                        I agree to the <a href="/legal/terms" className="text-blue-400 hover:underline">Terms of Service</a> and 
                        <a href="/legal/privacy" className="text-blue-400 hover:underline ml-1">Privacy Policy</a>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="dataProcessing"
                        checked={formData.dataProcessing}
                        onCheckedChange={(checked) => updateFormData('dataProcessing', checked)}
                        className="mt-1"
                      />
                      <Label htmlFor="dataProcessing" className="text-sm text-gray-300 cursor-pointer">
                        I consent to the processing of organizational data for institutional onboarding and service delivery
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t border-slate-700/50">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="border-slate-600/50"
                >
                  Previous
                </Button>
                
                {currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Submit Application
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}