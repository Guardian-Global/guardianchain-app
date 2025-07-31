import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Note: Progress component will be created if missing
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { 
  User, 
  Camera, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Target,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Video,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Facebook
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Onboarding step schema
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  dateOfBirth: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional()
});

const contactInfoSchema = z.object({
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional()
});

const aboutSchema = z.object({
  bio: z.string().min(20, "Bio should be at least 20 characters").max(500, "Bio should not exceed 500 characters"),
  interests: z.string().optional(),
  goals: z.string().optional(),
  experience: z.string().optional()
});

const socialLinksSchema = z.object({
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  facebook: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal(""))
});

const mediaSchema = z.object({
  profilePicture: z.string().optional(),
  profileVideo: z.string().optional(),
  coverImage: z.string().optional()
});

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  schema: z.ZodSchema;
  component: React.ComponentType<any>;
}

interface AIAssistedOnboardingProps {
  onComplete: () => void;
}

// AI Suggestions component
const AISuggestions: React.FC<{ step: string; userInput?: any; onApplySuggestion: (suggestion: any) => void }> = ({ 
  step, 
  userInput, 
  onApplySuggestion 
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/ai/onboarding-suggestions", {
        step,
        userInput,
        context: "GUARDIANCHAIN profile optimization"
      });
      
      if (response && typeof response === 'object' && 'suggestions' in response) {
        setSuggestions((response as any).suggestions || []);
      }
    } catch (error) {
      console.error("AI suggestions error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step) {
      generateSuggestions();
    }
  }, [step, userInput]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-purple-900/20 to-green-900/20 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 animate-pulse text-purple-400" />
            <span className="text-sm text-slate-300">AI analyzing your profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-purple-900/20 to-green-900/20 border-purple-500/20">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">AI Recommendations</span>
        </div>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
              <span className="text-xs text-slate-300">{suggestion.text}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onApplySuggestion(suggestion)}
                className="text-purple-400 hover:text-purple-300 h-6 px-2"
              >
                Apply
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Personal Info Step
const PersonalInfoStep: React.FC<{ form: any; onNext: () => void }> = ({ form, onNext }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">First Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-slate-800 border-slate-600 text-white" placeholder="John" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Last Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-slate-800 border-slate-600 text-white" placeholder="Doe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-300">Username</FormLabel>
            <FormControl>
              <Input {...field} className="bg-slate-800 border-slate-600 text-white" placeholder="johndoe" />
            </FormControl>
            <FormDescription className="text-slate-400">
              This will be your unique identifier on GUARDIANCHAIN
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Location</FormLabel>
              <FormControl>
                <Input {...field} className="bg-slate-800 border-slate-600 text-white" placeholder="New York, NY" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Timezone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                  <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                  <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="CET">Central European Time (CET)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <AISuggestions 
        step="personal-info" 
        userInput={form.watch()} 
        onApplySuggestion={(suggestion) => {
          if (suggestion.field && suggestion.value) {
            form.setValue(suggestion.field, suggestion.value);
          }
        }}
      />
    </div>
  );
};

// Contact Info Step
const ContactInfoStep: React.FC<{ form: any; onNext: () => void }> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Phone Number</FormLabel>
              <FormControl>
                <Input {...field} className="bg-slate-800 border-slate-600 text-white" placeholder="+1 (555) 123-4567" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Website</FormLabel>
              <FormControl>
                <Input {...field} className="bg-slate-800 border-slate-600 text-white" placeholder="https://yoursite.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Company</FormLabel>
              <FormControl>
                <Input {...field} className="bg-slate-800 border-slate-600 text-white" placeholder="GUARDIANCHAIN Corp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Job Title</FormLabel>
              <FormControl>
                <Input {...field} className="bg-slate-800 border-slate-600 text-white" placeholder="Founder & CEO" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-300">Industry</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="blockchain">Blockchain & Cryptocurrency</SelectItem>
                <SelectItem value="technology">Technology & Software</SelectItem>
                <SelectItem value="finance">Finance & Banking</SelectItem>
                <SelectItem value="media">Media & Publishing</SelectItem>
                <SelectItem value="education">Education & Research</SelectItem>
                <SelectItem value="healthcare">Healthcare & Medicine</SelectItem>
                <SelectItem value="legal">Legal & Compliance</SelectItem>
                <SelectItem value="consulting">Consulting & Advisory</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <AISuggestions 
        step="contact-info" 
        userInput={form.watch()} 
        onApplySuggestion={(suggestion) => {
          if (suggestion.field && suggestion.value) {
            form.setValue(suggestion.field, suggestion.value);
          }
        }}
      />
    </div>
  );
};

// About Section Step
const AboutStep: React.FC<{ form: any }> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-300">Professional Bio</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="bg-slate-800 border-slate-600 text-white min-h-[120px]" 
                placeholder="Tell us about yourself, your experience, and what brings you to GUARDIANCHAIN..."
              />
            </FormControl>
            <FormDescription className="text-slate-400">
              {field.value?.length || 0}/500 characters
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="interests"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-300">Interests & Expertise</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="bg-slate-800 border-slate-600 text-white" 
                placeholder="Blockchain, Truth Verification, Digital Sovereignty, Web3..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="goals"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-300">Goals on GUARDIANCHAIN</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="bg-slate-800 border-slate-600 text-white" 
                placeholder="What do you hope to achieve on the platform?"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <AISuggestions 
        step="about" 
        userInput={form.watch()} 
        onApplySuggestion={(suggestion) => {
          if (suggestion.field && suggestion.value) {
            form.setValue(suggestion.field, suggestion.value);
          }
        }}
      />
    </div>
  );
};

// Social Links Step
const SocialLinksStep: React.FC<{ form: any }> = ({ form }) => {
  const socialPlatforms = [
    { name: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
    { name: "twitter", label: "Twitter/X", icon: Twitter, placeholder: "https://twitter.com/username" },
    { name: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/username" },
    { name: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/username" },
    { name: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/username" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-white mb-2">Connect Your Social Presence</h3>
        <p className="text-sm text-slate-400">Link your social accounts to build trust and credibility</p>
      </div>

      <div className="space-y-4">
        {socialPlatforms.map((platform) => (
          <FormField
            key={platform.name}
            control={form.control}
            name={platform.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 flex items-center space-x-2">
                  <platform.icon className="w-4 h-4" />
                  <span>{platform.label}</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-slate-800 border-slate-600 text-white" 
                    placeholder={platform.placeholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      <AISuggestions 
        step="social-links" 
        userInput={form.watch()} 
        onApplySuggestion={(suggestion) => {
          if (suggestion.field && suggestion.value) {
            form.setValue(suggestion.field, suggestion.value);
          }
        }}
      />
    </div>
  );
};

// Media Upload Step
const MediaStep: React.FC<{ form: any }> = ({ form }) => {
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleFileUpload = async (file: File, type: 'picture' | 'video') => {
    const setLoading = type === 'picture' ? setUploadingPicture : setUploadingVideo;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload/profile-media', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        const fieldName = type === 'picture' ? 'profilePicture' : 'profileVideo';
        form.setValue(fieldName, result.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-white mb-2">Profile Media</h3>
        <p className="text-sm text-slate-400">Add a profile picture and introduction video</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Profile Picture</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg">
                {form.watch('profilePicture') ? (
                  <img 
                    src={form.watch('profilePicture')} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Upload profile picture</p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'picture');
                }}
                className="bg-slate-700 border-slate-600 text-white"
                disabled={uploadingPicture}
              />
              {uploadingPicture && <p className="text-sm text-purple-400">Uploading...</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span>Introduction Video</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg">
                {form.watch('profileVideo') ? (
                  <video 
                    src={form.watch('profileVideo')} 
                    className="w-full h-full object-cover rounded-lg"
                    controls
                  />
                ) : (
                  <div className="text-center">
                    <Video className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Upload introduction video</p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'video');
                }}
                className="bg-slate-700 border-slate-600 text-white"
                disabled={uploadingVideo}
              />
              {uploadingVideo && <p className="text-sm text-purple-400">Uploading...</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <AISuggestions 
        step="media" 
        userInput={form.watch()} 
        onApplySuggestion={(suggestion) => {
          // Media suggestions might include recommendations for video content, etc.
        }}
      />
    </div>
  );
};

export const AIAssistedOnboarding: React.FC<AIAssistedOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { updateProfile, user } = useUnifiedAuth();
  const { toast } = useToast();

  const steps: OnboardingStep[] = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Let's start with the basics about you",
      icon: User,
      schema: personalInfoSchema,
      component: PersonalInfoStep
    },
    {
      id: "contact",
      title: "Contact & Professional",
      description: "Your professional details and contact information",
      icon: Briefcase,
      schema: contactInfoSchema,
      component: ContactInfoStep
    },
    {
      id: "about",
      title: "About You",
      description: "Tell us your story and what brings you here",
      icon: Target,
      schema: aboutSchema,
      component: AboutStep
    },
    {
      id: "social",
      title: "Social Presence",
      description: "Connect your social accounts for credibility",
      icon: Globe,
      schema: socialLinksSchema,
      component: SocialLinksStep
    },
    {
      id: "media",
      title: "Profile Media",
      description: "Add your profile picture and introduction video",
      icon: Camera,
      schema: mediaSchema,
      component: MediaStep
    }
  ];

  const form = useForm({
    resolver: zodResolver(steps[currentStep].schema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      // Initialize other fields based on current step
    }
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", "/api/auth/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully"
      });
    }
  });

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const stepData = form.getValues();
    
    // Save current step data
    try {
      await saveProfileMutation.mutateAsync(stepData);
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save profile data",
        variant: "destructive"
      });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Reset form for next step
      form.reset();
    } else {
      // Complete onboarding
      await updateProfile({ onboardingCompleted: true } as any);
      toast({
        title: "Welcome to GUARDIANCHAIN!",
        description: "Your profile is now complete. Enjoy exploring the platform!"
      });
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Welcome to GUARDIANCHAIN</h1>
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-600 to-green-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg flex items-center justify-center">
            <currentStepData.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{currentStepData.title}</h2>
            <p className="text-sm text-slate-400">{currentStepData.description}</p>
          </div>
        </div>
      </div>

      <Card className="bg-slate-800 border-slate-700 mb-6">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
              <StepComponent form={form} onNext={handleNext} />
              
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="border-slate-600 text-slate-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  type="submit"
                  disabled={saveProfileMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Profile
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Step indicator */}
      <div className="flex justify-center space-x-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`w-3 h-3 rounded-full ${
              index <= currentStep 
                ? 'bg-gradient-to-r from-purple-600 to-green-600' 
                : 'bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AIAssistedOnboarding;