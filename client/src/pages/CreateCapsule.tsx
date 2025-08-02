import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  FileText, 
  Image, 
  Video, 
  Mic, 
  Globe, 
  Briefcase, 
  Heart,
  AlertTriangle,
  Zap,
  Brain,
  Upload
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const createCapsuleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be under 2000 characters"),
  content: z.string().min(1, "Content is required"),
  type: z.string().min(1, "Capsule type is required"),
  tags: z.string().optional(),
  isPublic: z.boolean().default(true),
  veritasLevel: z.enum(["standard", "verified", "sealed"]).default("standard")
});

type CreateCapsuleForm = z.infer<typeof createCapsuleSchema>;

const capsuleTypes = [
  { id: "personal-memory", label: "Personal Memory", icon: Heart, color: "text-pink-400", description: "Preserve personal moments and experiences" },
  { id: "news-report", label: "News Report", icon: Globe, color: "text-blue-400", description: "Document breaking news and events" },
  { id: "document-archive", label: "Document Archive", icon: FileText, color: "text-green-400", description: "Store important documents" },
  { id: "media-evidence", label: "Media Evidence", icon: Image, color: "text-purple-400", description: "Visual proof and documentation" },
  { id: "video-testimony", label: "Video Testimony", icon: Video, color: "text-red-400", description: "First-hand accounts and testimonies" },
  { id: "audio-recording", label: "Audio Recording", icon: Mic, color: "text-yellow-400", description: "Voice recordings and audio evidence" },
  { id: "business-record", label: "Business Record", icon: Briefcase, color: "text-cyan-400", description: "Corporate and business documentation" },
  { id: "whistleblower", label: "Whistleblower", icon: AlertTriangle, color: "text-orange-400", description: "Protected disclosure reports" },
];

export default function CreateCapsule() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<string>("");

  const form = useForm<CreateCapsuleForm>({
    resolver: zodResolver(createCapsuleSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      type: "",
      tags: "",
      isPublic: true,
      veritasLevel: "standard"
    },
  });

  const createCapsuleMutation = useMutation({
    mutationFn: async (data: CreateCapsuleForm) => {
      return apiRequest("POST", "/api/capsules", data);
    },
    onSuccess: () => {
      toast({
        title: "Capsule Created",
        description: "Your truth capsule has been successfully created and submitted for verification.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create capsule. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to create truth capsules.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/api/login">Login to Continue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (data: CreateCapsuleForm) => {
    createCapsuleMutation.mutate(data);
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    form.setValue("type", typeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-800/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/logo/GUARDIANCHAIN_logo.png" 
                alt="GuardianChain" 
                className="h-8 w-auto"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Create Truth Capsule
              </h1>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Preserve Your Truth Forever
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create an immutable truth capsule that will be verified by our community and preserved on-chain for digital immortality.
            </p>
          </div>

          <Tabs defaultValue="type" className="space-y-6">
            <TabsList className="bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger value="type">Choose Type</TabsTrigger>
              <TabsTrigger value="content" disabled={!selectedType}>Add Content</TabsTrigger>
              <TabsTrigger value="verification" disabled={!selectedType}>Verification</TabsTrigger>
            </TabsList>

            {/* Type Selection */}
            <TabsContent value="type" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Select Capsule Type
                  </CardTitle>
                  <CardDescription>
                    Choose the type that best describes your truth capsule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {capsuleTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.id;
                      
                      return (
                        <div
                          key={type.id}
                          onClick={() => handleTypeSelect(type.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-105 ${
                            isSelected
                              ? 'bg-white/10 border-white/30 ring-2 ring-blue-400'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="p-3 bg-slate-800/50 rounded-lg">
                              <Icon className={`h-6 w-6 ${type.color}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{type.label}</h3>
                              <p className="text-sm text-gray-400 mt-1">{type.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {selectedType && (
                <div className="text-center">
                  <Button 
                    onClick={() => {
                      form.setValue("type", selectedType);
                      const contentTab = document.querySelector('[value="content"]') as HTMLElement;
                      contentTab?.click();
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue to Content
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Content Creation */}
            <TabsContent value="content" className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-400" />
                        Capsule Content
                      </CardTitle>
                      <CardDescription>
                        Provide detailed information about your truth capsule
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter a descriptive title for your truth capsule"
                                className="bg-slate-700 border-slate-600"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A clear, concise title that describes your truth capsule
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide a detailed description of your truth capsule..."
                                className="bg-slate-700 border-slate-600 min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Explain the context, importance, and details of your truth capsule
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Main Content</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter the main content of your truth capsule..."
                                className="bg-slate-700 border-slate-600 min-h-[200px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              The primary content that will be verified and preserved
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="blockchain, verification, truth (comma-separated)"
                                className="bg-slate-700 border-slate-600"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Add relevant tags to help others discover your capsule
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <div className="text-center">
                    <Button 
                      type="button"
                      onClick={() => {
                        const verificationTab = document.querySelector('[value="verification"]') as HTMLElement;
                        verificationTab?.click();
                      }}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Continue to Verification
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {/* Verification Options */}
            <TabsContent value="verification" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    Verification Level
                  </CardTitle>
                  <CardDescription>
                    Choose your verification level and submit your truth capsule
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="veritasLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Veritas Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-700 border-slate-600">
                              <SelectValue placeholder="Select verification level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-blue-400">Standard</Badge>
                                <span>Community verification</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="verified">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-green-400">Verified</Badge>
                                <span>Professional validation</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="sealed">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-yellow-400">Sealed</Badge>
                                <span>Veritas sealed guarantee</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Higher verification levels provide stronger truth guarantees
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
                    <h3 className="font-semibold mb-3 text-green-400">✨ AI Enhancement Available</h3>
                    <p className="text-gray-300 mb-4">
                      Our AI can help optimize your title, suggest relevant tags, and estimate potential GTT rewards based on your content.
                    </p>
                    <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-600/20">
                      <Brain className="h-4 w-4 mr-2" />
                      Enhance with AI
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={createCapsuleMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {createCapsuleMutation.isPending ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          Creating Capsule...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Create Truth Capsule
                        </>
                      )}
                    </Button>
                    
                    <Button variant="outline" asChild>
                      <Link href="/dashboard">Cancel</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}