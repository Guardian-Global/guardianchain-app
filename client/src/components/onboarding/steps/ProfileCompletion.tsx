import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, User, Building, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileCompletionProps {
  onComplete: () => void;
}

export default function ProfileCompletion({ onComplete }: ProfileCompletionProps) {
  const { user, updateProfile } = useUnifiedAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      company: "",
      jobTitle: "",
      country: "",
      bio: "",
      website: "",
      linkedin: "",
    },
  });

  const watchedFields = watch();
  const completedFields = Object.values(watchedFields).filter(Boolean).length;
  const totalFields = Object.keys(watchedFields).length;
  const profileProgress = (completedFields / totalFields) * 100;

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const success = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        // Additional profile data would be stored in a separate profile table
      });

      if (success) {
        toast({
          title: "Profile Updated!",
          description: "Your profile has been successfully completed.",
        });
        onComplete();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailVerification = async () => {
    try {
      // In a real implementation, this would call an API to send verification email
      setEmailVerificationSent(true);
      toast({
        title: "Verification Email Sent",
        description: "Please check your email and click the verification link.",
      });
    } catch (error) {
      toast({
        title: "Failed to Send Email",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Verification Section */}
      <Card className="bg-slate-700/50 border-slate-600">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Email Verification</p>
                <p className="text-slate-400 text-sm">{user?.email}</p>
              </div>
            </div>
            {user?.emailVerified ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Button
                onClick={sendEmailVerification}
                variant="outline"
                size="sm"
                disabled={emailVerificationSent}
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                {emailVerificationSent ? "Email Sent" : "Verify Email"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Progress */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Complete Your Profile</h3>
        <Badge variant="outline" className="text-slate-300">
          {Math.round(profileProgress)}% Complete
        </Badge>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-white">
              First Name *
            </Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-white">
              Last Name *
            </Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-white">
              Company
            </Label>
            <Input
              id="company"
              {...register("company")}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Your company name"
            />
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-white">
              Job Title
            </Label>
            <Input
              id="jobTitle"
              {...register("jobTitle")}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Your job title"
            />
          </div>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country" className="text-white">
            Country *
          </Label>
          <Select onValueChange={(value) => setValue("country", value)}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="fr">France</SelectItem>
              <SelectItem value="jp">Japan</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-red-400 text-sm">{errors.country.message}</p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-white">
            Bio
          </Label>
          <Textarea
            id="bio"
            {...register("bio")}
            className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
            placeholder="Tell us about yourself and your interest in truth verification..."
          />
          {errors.bio && (
            <p className="text-red-400 text-sm">{errors.bio.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-white">
              Website
            </Label>
            <Input
              id="website"
              {...register("website")}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="https://yourwebsite.com"
            />
            {errors.website && (
              <p className="text-red-400 text-sm">{errors.website.message}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="text-white">
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              {...register("linkedin")}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="https://linkedin.com/in/yourprofile"
            />
            {errors.linkedin && (
              <p className="text-red-400 text-sm">{errors.linkedin.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={!isValid || isLoading || !user?.emailVerified}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading ? "Saving Profile..." : "Complete Profile"}
          </Button>
          
          {!user?.emailVerified && (
            <p className="text-yellow-400 text-sm mt-2 text-center">
              Please verify your email before completing your profile
            </p>
          )}
        </div>
      </form>
    </div>
  );
}