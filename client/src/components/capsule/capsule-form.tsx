import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Shield,
  Upload,
  Brain,
  Coins,
  Lock,
  Globe,
  FileText,
  Zap,
} from "lucide-react";

const capsuleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  evidence: z.string().optional(),
  visibility: z.boolean().default(true),
  creator: z.string().default("anonymous"),
});

type CapsuleFormData = z.infer<typeof capsuleSchema>;

interface CapsuleFormProps {
  onSuccess?: (capsule: any) => void;
}

export function CapsuleForm({ onSuccess }: CapsuleFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [pendingMint, setPendingMint] = useState(false);
  const [pendingVeritas, setPendingVeritas] = useState(false);

  const form = useForm<CapsuleFormData>({
    resolver: zodResolver(capsuleSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      category: "",
      evidence: "",
      visibility: true,
      creator: "anonymous", // This would come from auth context
    },
  });

  const createCapsuleMutation = useMutation({
    mutationFn: async (data: CapsuleFormData) => {
      const response = await apiRequest("POST", "/api/capsules", {
        ...data,
        griefScore: "0.95", // Initial high score
        status: "pending",
        gttEarned: "0",
      });
      return response.json();
    },
    onSuccess: (capsule) => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Truth Capsule Created",
        description: "Your capsule has been submitted for verification.",
      });
      onSuccess?.(capsule);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create capsule",
        variant: "destructive",
      });
    },
  });

  const mintNFTMutation = useMutation({
    mutationFn: async (capsuleData: any) => {
      const response = await apiRequest("POST", "/api/mint", {
        capsuleId: capsuleData.id,
        title: capsuleData.title,
        description: capsuleData.description,
        userWallet: "0x742d35Cc6634C0532925a3b8D295a7B76e0Cd5a7", // Would come from wallet
      });
      return response.json();
    },
    onSuccess: (nftData) => {
      setPendingMint(false);
      toast({
        title: "NFT Minted Successfully",
        description: `Token ID: ${nftData.nft.tokenId}`,
      });
    },
    onError: (error: any) => {
      setPendingMint(false);
      toast({
        title: "NFT Minting Failed",
        description: error.message || "Failed to mint NFT",
        variant: "destructive",
      });
    },
  });

  const veritasSealMutation = useMutation({
    mutationFn: async (capsuleData: any) => {
      const response = await apiRequest("POST", "/api/veritas/seal", {
        capsuleId: capsuleData.id,
        userEmail: "user@example.com", // Would come from auth context
      });
      return response.json();
    },
    onSuccess: (veritasData) => {
      setPendingVeritas(false);
      toast({
        title: "Veritas Seal Requested",
        description: `Envelope ID: ${veritasData.envelopeId}`,
      });
    },
    onError: (error: any) => {
      setPendingVeritas(false);
      toast({
        title: "Veritas Seal Failed",
        description: error.message || "Failed to request Veritas seal",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CapsuleFormData) => {
    const capsule = await createCapsuleMutation.mutateAsync(data);

    // Auto-trigger NFT minting and Veritas seal for high-quality submissions
    if (data.content.length > 200 && data.evidence) {
      setPendingMint(true);
      setPendingVeritas(true);

      setTimeout(() => {
        mintNFTMutation.mutate(capsule);
      }, 1000);

      setTimeout(() => {
        veritasSealMutation.mutate(capsule);
      }, 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Truth Capsule Details
            </CardTitle>
            <CardDescription>
              Create an immutable record of truth with supporting evidence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capsule Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief, descriptive title for your truth capsule"
                          className="bg-slate-700 border-slate-600"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Concise summary of your claim or statement"
                          className="bg-slate-700 border-slate-600 min-h-[100px]"
                          {...field}
                        />
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
                      <FormLabel>Full Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed information, context, analysis, and supporting arguments"
                          className="bg-slate-700 border-slate-600 min-h-[250px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-slate-700 border-slate-600">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="politics">Politics</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="technology">
                              Technology
                            </SelectItem>
                            <SelectItem value="economics">Economics</SelectItem>
                            <SelectItem value="social">
                              Social Issues
                            </SelectItem>
                            <SelectItem value="environment">
                              Environment
                            </SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-600 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {field.value ? (
                              <Globe className="inline h-4 w-4 mr-1" />
                            ) : (
                              <Lock className="inline h-4 w-4 mr-1" />
                            )}
                            {field.value ? "Public" : "Private"}
                          </FormLabel>
                          <div className="text-sm text-slate-400">
                            {field.value
                              ? "Visible to everyone"
                              : "Only visible to you"}
                          </div>
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
                </div>

                {/* Advanced Options */}
                <div className="border border-slate-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Evidence & Verification
                      </h3>
                      <p className="text-sm text-slate-400">
                        Additional supporting materials
                      </p>
                    </div>
                    <Switch
                      checked={isAdvanced}
                      onCheckedChange={setIsAdvanced}
                    />
                  </div>

                  {isAdvanced && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="evidence"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supporting Evidence</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="URLs, citations, references, documents, or additional context that supports your claims"
                                className="bg-slate-700 border-slate-600"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-400" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              Veritas Seal
                            </div>
                            <div className="text-xs text-slate-400">
                              DocuSign legal verification
                            </div>
                          </div>
                          {pendingVeritas && (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
                          <Zap className="h-5 w-5 text-purple-400" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              NFT Minting
                            </div>
                            <div className="text-xs text-slate-400">
                              Blockchain permanence
                            </div>
                          </div>
                          {pendingMint && (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={createCapsuleMutation.isPending}
                  className="w-full gradient-primary py-6 text-lg font-semibold"
                >
                  {createCapsuleMutation.isPending
                    ? "Creating Capsule..."
                    : "Submit Truth Capsule"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Info */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-400" />
              GTT Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Base Submission:</span>
                <span className="font-semibold">10 GTT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Community Verification:</span>
                <span className="font-semibold">+25 GTT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">High Quality Bonus:</span>
                <span className="font-semibold">+15 GTT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Evidence Bonus:</span>
                <span className="font-semibold">+10 GTT</span>
              </div>
              <div className="border-t border-slate-600 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Potential Total:</span>
                  <span className="text-amber-400">60 GTT</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              Truth Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                  1
                </div>
                <div>
                  <div className="font-medium">Submission</div>
                  <div className="text-sm text-slate-400">
                    Content enters verification queue
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <div className="font-medium">Community Review</div>
                  <div className="text-sm text-slate-400">
                    Experts verify claims and evidence
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <div className="font-medium">Grief Score</div>
                  <div className="text-sm text-slate-400">
                    Algorithmic truthfulness rating
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <div>
                  <div className="font-medium">Blockchain Record</div>
                  <div className="text-sm text-slate-400">
                    Permanent truth verification
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
