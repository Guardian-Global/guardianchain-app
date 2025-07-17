import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, FileText, Image, Link as LinkIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const createCapsuleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  isPublic: z.boolean().default(true),
  creatorId: z.number().default(1), // Mock user ID for now
});

type CreateCapsuleData = z.infer<typeof createCapsuleSchema>;

const categories = [
  "Technology",
  "Science",
  "Politics",
  "Economics",
  "Health",
  "Environment",
  "Social Issues",
  "Predictions",
  "Facts",
  "Analysis",
  "Other"
];

export default function CreateCapsule() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateCapsuleData>({
    resolver: zodResolver(createCapsuleSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      category: "",
      isPublic: true,
      creatorId: 1,
    },
  });

  const createCapsuleMutation = useMutation({
    mutationFn: async (data: CreateCapsuleData) => {
      const response = await apiRequest("POST", "/api/capsules", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/capsules/featured"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Capsule Created",
        description: "Your truth capsule has been submitted for verification.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create capsule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CreateCapsuleData) => {
    setIsSubmitting(true);
    try {
      await createCapsuleMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4 gradient-text">Create Truth Capsule</h1>
          <p className="text-slate-400 text-lg">
            Submit your truth claim with supporting evidence for community verification.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Capsule Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter a compelling title for your truth capsule"
                              className="bg-slate-900 border-slate-600"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A clear, concise title that summarizes your claim or statement.
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
                              placeholder="Provide a brief description of your truth capsule"
                              className="bg-slate-900 border-slate-600 min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A summary that will be visible in capsule previews and search results.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-900 border-slate-600">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the most relevant category for your capsule.
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
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide detailed content, evidence, and supporting information"
                              className="bg-slate-900 border-slate-600 min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include all relevant details, sources, evidence, and reasoning. The more comprehensive, the better.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-600 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Public Capsule</FormLabel>
                            <FormDescription>
                              Make this capsule visible to all users and eligible for community verification.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full gradient-primary hover:from-primary/90 hover:to-secondary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Capsule..." : "Create Truth Capsule"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Supporting Materials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                  <Image className="mr-2 h-4 w-4" />
                  Add Images
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Add Links
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                  <FileText className="mr-2 h-4 w-4" />
                  DocuSign Seal
                </Button>
                <p className="text-xs text-slate-400">
                  Add supporting evidence to strengthen your capsule's credibility and verification score.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Verification Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-sm text-slate-300">Submit capsule</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">2</div>
                  <span className="text-sm text-slate-400">Community review</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-sm text-slate-400">Verification voting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">4</div>
                  <span className="text-sm text-slate-400">Earn GTT rewards</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border-emerald-700/50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-emerald-400 mb-2">💡 Pro Tips</h3>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Include multiple credible sources</li>
                  <li>• Be specific and factual</li>
                  <li>• Avoid speculation or opinion</li>
                  <li>• Use DocuSign for legal verification</li>
                  <li>• Higher quality = higher GTT rewards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
