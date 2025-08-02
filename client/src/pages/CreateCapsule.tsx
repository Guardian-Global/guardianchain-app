import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  CAPSULE_TYPES, 
  VERITAS_SEAL_TYPES, 
  URGENCY_LEVELS, 
  SENSITIVITY_LEVELS, 
  LEGAL_IMPORTANCE, 
  EVIDENCE_TYPES, 
  SUBMISSION_METHODS 
} from "@shared/schema";
import { Shield, Scale, Eye, Clock, FileText, Users, Lock, Zap } from "lucide-react";

const createCapsuleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title too long"),
  content: z.string().min(20, "Content must be at least 20 characters").max(10000, "Content too long"),
  capsuleType: z.string().min(1, "Please select a capsule type"),
  category: z.string().optional(),
  veritasSealType: z.string().optional(),
  urgencyLevel: z.string().default("normal"),
  sensitivityLevel: z.string().default("public"),
  jurisdictionRegion: z.string().optional(),
  legalImportance: z.string().default("standard"),
  evidenceType: z.string().optional(),
  submissionMethod: z.string().default("standard"),
  tags: z.string().optional(),
  isPrivate: z.boolean().default(false),
  accessCost: z.number().min(0).default(0),
});

type CreateCapsuleForm = z.infer<typeof createCapsuleSchema>;

export default function CreateCapsule() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<string>("");

  const form = useForm<CreateCapsuleForm>({
    resolver: zodResolver(createCapsuleSchema),
    defaultValues: {
      title: "",
      content: "",
      capsuleType: "",
      urgencyLevel: "normal",
      sensitivityLevel: "public",
      legalImportance: "standard",
      submissionMethod: "standard",
      isPrivate: false,
      accessCost: 0,
    },
  });

  const createCapsuleMutation = useMutation({
    mutationFn: async (data: CreateCapsuleForm) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
      };
      return apiRequest("POST", "/api/capsules", payload);
    },
    onSuccess: () => {
      toast({
        title: "Capsule Created",
        description: "Your truth capsule has been submitted for verification.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateCapsuleForm) => {
    createCapsuleMutation.mutate(data);
  };

  const getCapsuleTypeInfo = (type: string) => {
    const typeConfig: Record<string, { icon: any; color: string; description: string }> = {
      [CAPSULE_TYPES.NEWS_VERIFICATION]: { icon: FileText, color: "bg-blue-500", description: "Verify news articles and media reports" },
      [CAPSULE_TYPES.VERITAS_SEAL]: { icon: Shield, color: "bg-gold-500", description: "Professional court-admissible verification" },
      [CAPSULE_TYPES.WHISTLEBLOWER_REPORT]: { icon: Lock, color: "bg-red-500", description: "Secure anonymous reporting system" },
      [CAPSULE_TYPES.LEGAL_DOCUMENT]: { icon: Scale, color: "bg-purple-500", description: "Legal documentation and compliance" },
      [CAPSULE_TYPES.SCIENTIFIC_DATA]: { icon: Zap, color: "bg-green-500", description: "Research data and scientific findings" },
      [CAPSULE_TYPES.HISTORICAL_RECORD]: { icon: Clock, color: "bg-amber-500", description: "Historical documentation and archives" },
      [CAPSULE_TYPES.PERSONAL_TESTIMONY]: { icon: Users, color: "bg-cyan-500", description: "Personal witness statements" },
    };
    return typeConfig[type] || { icon: FileText, color: "bg-gray-500", description: "Standard truth capsule" };
  };

  const isVeritasSealRequired = selectedType === CAPSULE_TYPES.VERITAS_SEAL;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Create Truth Capsule</h1>
        <p className="text-muted-foreground">Submit information for verification and preservation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Truth Capsule Details</CardTitle>
              <CardDescription>
                Provide comprehensive information about your truth submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter capsule title..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide detailed information..."
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Capsule Type Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Capsule Type</h3>
                    
                    <FormField
                      control={form.control}
                      name="capsuleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Type</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value} 
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedType(value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select capsule type..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={CAPSULE_TYPES.NEWS_VERIFICATION}>📰 News Verification</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.HISTORICAL_RECORD}>📚 Historical Record</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.PERSONAL_TESTIMONY}>👤 Personal Testimony</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.SCIENTIFIC_DATA}>🔬 Scientific Data</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.LEGAL_DOCUMENT}>⚖️ Legal Document</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.VERITAS_SEAL}>🛡️ Veritas Seal</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.TRUTH_BOUNTY}>💰 Truth Bounty</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.WHISTLEBLOWER_REPORT}>🔒 Whistleblower Report</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.GOVERNMENT_RECORD}>🏛️ Government Record</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.CORPORATE_FILING}>🏢 Corporate Filing</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.ACADEMIC_RESEARCH}>🎓 Academic Research</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.MEDICAL_RECORD}>🏥 Medical Record</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.FINANCIAL_DISCLOSURE}>💵 Financial Disclosure</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.ENVIRONMENTAL_REPORT}>🌍 Environmental Report</SelectItem>
                                <SelectItem value={CAPSULE_TYPES.ELECTION_INTEGRITY}>🗳️ Election Integrity</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedType && (
                      <Alert>
                        <FileText className="h-4 w-4" />
                        <AlertDescription>
                          {getCapsuleTypeInfo(selectedType).description}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Veritas Seal Options */}
                  {isVeritasSealRequired && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Shield className="h-5 w-5 text-gold-500" />
                          Veritas Seal Certification
                        </h3>
                        
                        <FormField
                          control={form.control}
                          name="veritasSealType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Seal Type</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Veritas seal type..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={VERITAS_SEAL_TYPES.LEGAL_AFFIDAVIT}>⚖️ Legal Affidavit</SelectItem>
                                    <SelectItem value={VERITAS_SEAL_TYPES.SWORN_TESTIMONY}>🤝 Sworn Testimony</SelectItem>
                                    <SelectItem value={VERITAS_SEAL_TYPES.NOTARIZED_STATEMENT}>📋 Notarized Statement</SelectItem>
                                    <SelectItem value={VERITAS_SEAL_TYPES.COURT_EVIDENCE}>🏛️ Court Evidence</SelectItem>
                                    <SelectItem value={VERITAS_SEAL_TYPES.EXPERT_WITNESS}>👨‍⚖️ Expert Witness</SelectItem>
                                    <SelectItem value={VERITAS_SEAL_TYPES.PROFESSIONAL_AUDIT}>📊 Professional Audit</SelectItem>
                                    <SelectItem value={VERITAS_SEAL_TYPES.INVESTIGATIVE_REPORT}>🔍 Investigative Report</SelectItem>
                                    <SelectItem value={VERITAS_SEAL_TYPES.PEER_REVIEWED}>🎓 Peer Reviewed</SelectItem>
                                    <SelectItem value={VERITAS_SEAL_TYPES.CRYPTOGRAPHICALLY_SIGNED}>🔐 Cryptographically Signed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Advanced Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Advanced Options</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="urgencyLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Urgency Level</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={URGENCY_LEVELS.CRITICAL}>🚨 Critical</SelectItem>
                                  <SelectItem value={URGENCY_LEVELS.HIGH}>⚡ High</SelectItem>
                                  <SelectItem value={URGENCY_LEVELS.NORMAL}>📋 Normal</SelectItem>
                                  <SelectItem value={URGENCY_LEVELS.LOW}>⏳ Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sensitivityLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sensitivity Level</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={SENSITIVITY_LEVELS.PUBLIC}>🌐 Public</SelectItem>
                                  <SelectItem value={SENSITIVITY_LEVELS.RESTRICTED}>🔒 Restricted</SelectItem>
                                  <SelectItem value={SENSITIVITY_LEVELS.CONFIDENTIAL}>🔐 Confidential</SelectItem>
                                  <SelectItem value={SENSITIVITY_LEVELS.SECRET}>🛡️ Secret</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="tag1, tag2, tag3..."
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Separate tags with commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setLocation("/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createCapsuleMutation.isPending}
                      className="gradient-primary"
                    >
                      {createCapsuleMutation.isPending ? "Creating..." : "Create Capsule"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Capsule Types Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-full justify-start">
                  <Shield className="h-3 w-3 mr-1" />
                  Veritas Seal: Court-admissible
                </Badge>
                <Badge variant="secondary" className="w-full justify-start">
                  <Eye className="h-3 w-3 mr-1" />
                  News: Media verification
                </Badge>
                <Badge variant="secondary" className="w-full justify-start">
                  <Lock className="h-3 w-3 mr-1" />
                  Whistleblower: Anonymous tips
                </Badge>
                <Badge variant="secondary" className="w-full justify-start">
                  <Scale className="h-3 w-3 mr-1" />
                  Legal: Official documents
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1. Submit your capsule</p>
              <p>2. Community verification</p>
              <p>3. Professional review (if needed)</p>
              <p>4. Truth score calculation</p>
              <p>5. GTT token rewards</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}