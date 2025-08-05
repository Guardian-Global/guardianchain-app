import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, User, Mail, CheckCircle, Settings, Activity } from "lucide-react";

// Registration schema
const registrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters"),
});

// Profile update schema
const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  website: z.string().url("Invalid website URL").or(z.string().length(0)).optional(),
  twitter: z.string().max(50, "Twitter handle must be less than 50 characters").optional(),
  github: z.string().max(50, "GitHub username must be less than 50 characters").optional(),
  linkedin: z.string().max(100, "LinkedIn profile must be less than 100 characters").optional(),
});

type RegistrationData = z.infer<typeof registrationSchema>;
type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

interface CompleteAuthFlowProps {
  onAuthStateChange?: (authenticated: boolean) => void;
}

export default function CompleteAuthFlow({ onAuthStateChange }: CompleteAuthFlowProps) {
  const [currentStep, setCurrentStep] = useState<"login" | "register" | "verify" | "profile" | "complete">("login");
  const [verificationToken, setVerificationToken] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check current user status
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth-complete/me"],
    retry: false,
  });

  // Registration form
  const registrationForm = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      username: "",
    },
  });

  // Profile form
  const profileForm = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      username: currentUser?.username || "",
      bio: currentUser?.bio || "",
      location: currentUser?.location || "",
      website: currentUser?.website || "",
      twitter: currentUser?.twitter || "",
      github: currentUser?.github || "",
      linkedin: currentUser?.linkedin || "",
    },
  });

  // Update profile form when user data loads
  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        username: currentUser.username || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        website: currentUser.website || "",
        twitter: currentUser.twitter || "",
        github: currentUser.github || "",
        linkedin: currentUser.linkedin || "",
      });
    }
  }, [currentUser, profileForm]);

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegistrationData) => apiRequest("/api/auth-complete/register", "POST", data),
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: "Please check your email for verification instructions.",
      });
      setVerificationToken(data.verificationToken); // For testing
      setCurrentStep("verify");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    },
  });

  // Email verification mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => apiRequest("/api/auth-complete/verify-email", "POST", { token }),
    onSuccess: () => {
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified.",
      });
      setCurrentStep("profile");
      queryClient.invalidateQueries({ queryKey: ["/api/auth-complete/me"] });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired verification token.",
        variant: "destructive",
      });
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (email: string) => apiRequest("/api/auth-complete/login", "POST", { email }),
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.firstName}!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth-complete/me"] });
      onAuthStateChange?.(true);
      if (!data.user.onboardingCompleted) {
        setCurrentStep("profile");
      } else {
        setCurrentStep("complete");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your email or complete registration first.",
        variant: "destructive",
      });
    },
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileUpdateData) => apiRequest("/api/auth-complete/profile", "PUT", data),
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth-complete/me"] });
      completeOnboardingMutation.mutate();
    },
    onError: (error: any) => {
      toast({
        title: "Profile Update Failed",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
    },
  });

  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation({
    mutationFn: () => apiRequest("/api/auth-complete/complete-onboarding", "POST"),
    onSuccess: () => {
      toast({
        title: "Welcome to GuardianChain!",
        description: "Your account setup is complete.",
      });
      setCurrentStep("complete");
      onAuthStateChange?.(true);
      queryClient.invalidateQueries({ queryKey: ["/api/auth-complete/me"] });
    },
  });

  // User activities query
  const { data: userActivities } = useQuery({
    queryKey: ["/api/auth-complete/activities"],
    enabled: currentUser?.id && currentStep === "complete",
  });

  if (userLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If user is fully authenticated and onboarded
  if (currentUser?.emailVerified && currentUser?.onboardingCompleted && currentStep === "complete") {
    return (
      <Card className="w-full max-w-2xl mx-auto" data-testid="complete-auth-dashboard">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Welcome to GuardianChain, {currentUser.firstName}!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Account Information</Label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm"><strong>Email:</strong> {currentUser.email}</p>
                <p className="text-sm"><strong>Username:</strong> {currentUser.username}</p>
                <p className="text-sm"><strong>Tier:</strong> {currentUser.tier}</p>
                <p className="text-sm"><strong>Member since:</strong> {new Date(currentUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            {userActivities && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Activity Summary</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm"><strong>Total Activities:</strong> {userActivities.stats.totalActivities}</p>
                  <p className="text-sm"><strong>Recent Logins:</strong> {userActivities.stats.recentLogins}</p>
                  <p className="text-sm"><strong>Profile Complete:</strong> {userActivities.stats.profileCompleteness}%</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => setCurrentStep("profile")}
              variant="outline"
              data-testid="button-edit-profile"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button 
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/auth-complete/activities"] });
              }}
              variant="outline"
              data-testid="button-refresh-activities"
            >
              <Activity className="h-4 w-4 mr-2" />
              Refresh Activities
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6" data-testid="complete-auth-flow">
      {/* Login Step */}
      {currentStep === "login" && (
        <Card data-testid="card-login">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Sign In to GuardianChain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;
                if (email) {
                  loginMutation.mutate(email);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="login-email">Email Address</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  data-testid="input-login-email"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign In
              </Button>
            </form>
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setCurrentStep("register")}
                data-testid="button-show-register"
              >
                Don't have an account? Sign up
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registration Step */}
      {currentStep === "register" && (
        <Card data-testid="card-register">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Create Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={registrationForm.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...registrationForm.register("firstName")}
                    data-testid="input-first-name"
                  />
                  {registrationForm.formState.errors.firstName && (
                    <p className="text-sm text-destructive">{registrationForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...registrationForm.register("lastName")}
                    data-testid="input-last-name"
                  />
                  {registrationForm.formState.errors.lastName && (
                    <p className="text-sm text-destructive">{registrationForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...registrationForm.register("email")}
                  data-testid="input-email"
                />
                {registrationForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{registrationForm.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...registrationForm.register("username")}
                  data-testid="input-username"
                />
                {registrationForm.formState.errors.username && (
                  <p className="text-sm text-destructive">{registrationForm.formState.errors.username.message}</p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
                data-testid="button-register"
              >
                {registerMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Account
              </Button>
            </form>
            
            <div className="text-center mt-4">
              <Button
                variant="link"
                onClick={() => setCurrentStep("login")}
                data-testid="button-show-login"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Verification Step */}
      {currentStep === "verify" && (
        <Card data-testid="card-verify">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Verify Your Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We've sent a verification link to your email address. Click the link in the email or enter the verification token below.
            </p>
            
            {/* For testing purposes - in production, remove this */}
            {verificationToken && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">For testing:</p>
                <p className="text-sm font-mono">{verificationToken}</p>
              </div>
            )}
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const token = formData.get("token") as string;
                if (token) {
                  verifyEmailMutation.mutate(token);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="token">Verification Token</Label>
                <Input
                  id="token"
                  name="token"
                  placeholder="Enter verification token"
                  data-testid="input-verification-token"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={verifyEmailMutation.isPending}
                data-testid="button-verify-email"
              >
                {verifyEmailMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Verify Email
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Profile Setup Step */}
      {currentStep === "profile" && (
        <Card data-testid="card-profile">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Complete Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit((data) => updateProfileMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-firstName">First Name</Label>
                  <Input
                    id="profile-firstName"
                    {...profileForm.register("firstName")}
                    data-testid="input-profile-first-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-lastName">Last Name</Label>
                  <Input
                    id="profile-lastName"
                    {...profileForm.register("lastName")}
                    data-testid="input-profile-last-name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profile-username">Username</Label>
                <Input
                  id="profile-username"
                  {...profileForm.register("username")}
                  data-testid="input-profile-username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  {...profileForm.register("bio")}
                  placeholder="Tell us about yourself..."
                  data-testid="input-bio"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  {...profileForm.register("location")}
                  placeholder="City, Country"
                  data-testid="input-location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  {...profileForm.register("website")}
                  placeholder="https://your-website.com"
                  data-testid="input-website"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    {...profileForm.register("twitter")}
                    placeholder="@username"
                    data-testid="input-twitter"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    {...profileForm.register("github")}
                    placeholder="username"
                    data-testid="input-github"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    {...profileForm.register("linkedin")}
                    placeholder="profile-url"
                    data-testid="input-linkedin"
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={updateProfileMutation.isPending}
                data-testid="button-update-profile"
              >
                {updateProfileMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Complete Setup
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}