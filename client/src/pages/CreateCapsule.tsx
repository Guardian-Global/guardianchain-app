import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Shield, 
  Lock, 
  Upload, 
  Eye, 
  EyeOff, 
  Calendar,
  Globe,
  Users,
  Coins,
  Sparkles
} from "lucide-react";
import EnhancedLayout from "@/components/layout/EnhancedLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AdvancedCard, AdvancedCardContent, AdvancedCardHeader, AdvancedCardTitle } from "@/components/ui/advanced-card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNotificationHelpers } from "@/components/ui/notification-system";
import { cn } from "@/lib/utils";

const capsuleSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  type: z.enum(["truth", "memory", "testimony", "evidence", "legacy", "witness"]),
  visibility: z.enum(["public", "private", "timelocked"]),
  unlockDate: z.string().optional(),
  allowComments: z.boolean().default(true),
  enableNFT: z.boolean().default(false)
});

type CapsuleFormData = z.infer<typeof capsuleSchema>;

const CreateCapsule: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { notifySuccess, notifyError } = useNotificationHelpers();

  const form = useForm<CapsuleFormData>({
    resolver: zodResolver(capsuleSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "truth",
      visibility: "public",
      allowComments: true,
      enableNFT: false
    }
  });

  const onSubmit = async (data: CapsuleFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      notifySuccess(
        "Capsule Created Successfully",
        "Your truth has been sealed and stored securely"
      );
      
      // Reset form
      form.reset();
    } catch (error) {
      notifyError(
        "Failed to Create Capsule",
        "Please try again or contact support"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedValues = form.watch();

  const capsuleTypes = [
    { value: "truth", label: "Truth", icon: Shield, color: "text-cyan-400" },
    { value: "memory", label: "Memory", icon: Sparkles, color: "text-purple-400" },
    { value: "testimony", label: "Testimony", icon: Users, color: "text-green-400" },
    { value: "evidence", label: "Evidence", icon: Lock, color: "text-red-400" },
    { value: "legacy", label: "Legacy", icon: Calendar, color: "text-yellow-400" },
    { value: "witness", label: "Witness", icon: Eye, color: "text-orange-400" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AuthGuard>
      <EnhancedLayout variant="dashboard" showNavigation={true}>
        <div className="lg:ml-72 min-h-screen p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Create Truth Capsule
                </h1>
                <p className="text-gray-400">
                  Seal your truth in an immutable capsule for eternity
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <motion.div variants={itemVariants}>
                  <AdvancedCard variant="glass">
                    <AdvancedCardHeader>
                      <AdvancedCardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-cyan-400" />
                        Capsule Details
                      </AdvancedCardTitle>
                    </AdvancedCardHeader>
                    <AdvancedCardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          {/* Title */}
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Title</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter capsule title..."
                                    className="bg-black/50 border-white/20 text-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Type */}
                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Capsule Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-black/50 border-white/20 text-white">
                                      <SelectValue placeholder="Select capsule type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {capsuleTypes.map((type) => {
                                      const Icon = type.icon;
                                      return (
                                        <SelectItem key={type.value} value={type.value}>
                                          <div className="flex items-center gap-2">
                                            <Icon className={cn("w-4 h-4", type.color)} />
                                            {type.label}
                                          </div>
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Content */}
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Content</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Share your truth..."
                                    className="bg-black/50 border-white/20 text-white min-h-[200px] resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Visibility */}
                          <FormField
                            control={form.control}
                            name="visibility"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Visibility</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-black/50 border-white/20 text-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="public">
                                      <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-green-400" />
                                        Public
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="private">
                                      <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-red-400" />
                                        Private
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="timelocked">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-yellow-400" />
                                        Time-locked
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Unlock Date (if time-locked) */}
                          {watchedValues.visibility === "timelocked" && (
                            <FormField
                              control={form.control}
                              name="unlockDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">Unlock Date</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="datetime-local"
                                      className="bg-black/50 border-white/20 text-white"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {/* Options */}
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="allowComments"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between space-y-0">
                                  <FormLabel className="text-white">Allow Comments</FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="enableNFT"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between space-y-0">
                                  <div>
                                    <FormLabel className="text-white">Mint as NFT</FormLabel>
                                    <p className="text-sm text-gray-400">
                                      Create a blockchain certificate (requires GTT)
                                    </p>
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

                          {/* Submit Button */}
                          <div className="flex gap-3">
                            <EnhancedButton
                              type="submit"
                              variant="quantum"
                              size="lg"
                              disabled={isSubmitting}
                              className="flex-1"
                            >
                              {isSubmitting ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                              ) : (
                                <>
                                  <Shield className="w-5 h-5 mr-2" />
                                  Seal Capsule
                                </>
                              )}
                            </EnhancedButton>

                            <EnhancedButton
                              type="button"
                              variant="glass"
                              size="lg"
                              onClick={() => setShowPreview(!showPreview)}
                            >
                              {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </EnhancedButton>
                          </div>
                        </form>
                      </Form>
                    </AdvancedCardContent>
                  </AdvancedCard>
                </motion.div>
              </div>

              {/* Preview & Info */}
              <div className="space-y-6">
                {/* Preview */}
                {showPreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    variants={itemVariants}
                  >
                    <AdvancedCard variant="glass">
                      <AdvancedCardHeader>
                        <AdvancedCardTitle className="flex items-center gap-2">
                          <Eye className="w-5 h-5 text-purple-400" />
                          Preview
                        </AdvancedCardTitle>
                      </AdvancedCardHeader>
                      <AdvancedCardContent>
                        <div className="space-y-3">
                          <h3 className="font-semibold text-white">
                            {watchedValues.title || "Untitled Capsule"}
                          </h3>
                          <div className="text-sm text-gray-400">
                            Type: {watchedValues.type}
                          </div>
                          <p className="text-gray-300 text-sm">
                            {watchedValues.content || "No content yet..."}
                          </p>
                        </div>
                      </AdvancedCardContent>
                    </AdvancedCard>
                  </motion.div>
                )}

                {/* Info Cards */}
                <motion.div variants={itemVariants}>
                  <AdvancedCard variant="glass">
                    <AdvancedCardHeader>
                      <AdvancedCardTitle className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-yellow-400" />
                        GTT Rewards
                      </AdvancedCardTitle>
                    </AdvancedCardHeader>
                    <AdvancedCardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Base Reward:</span>
                          <span className="text-white">50 GTT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">NFT Bonus:</span>
                          <span className="text-white">+25 GTT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Quality Bonus:</span>
                          <span className="text-white">+0-100 GTT</span>
                        </div>
                        <div className="border-t border-white/10 pt-2">
                          <div className="flex justify-between font-semibold">
                            <span className="text-white">Potential Total:</span>
                            <span className="text-yellow-400">
                              {watchedValues.enableNFT ? "75-175" : "50-150"} GTT
                            </span>
                          </div>
                        </div>
                      </div>
                    </AdvancedCardContent>
                  </AdvancedCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <AdvancedCard variant="glass">
                    <AdvancedCardHeader>
                      <AdvancedCardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-green-400" />
                        Security
                      </AdvancedCardTitle>
                    </AdvancedCardHeader>
                    <AdvancedCardContent>
                      <div className="space-y-2 text-sm text-gray-300">
                        <p>✓ End-to-end encryption</p>
                        <p>✓ IPFS immutable storage</p>
                        <p>✓ Blockchain verification</p>
                        <p>✓ Tamper-proof sealing</p>
                      </div>
                    </AdvancedCardContent>
                  </AdvancedCard>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </EnhancedLayout>
    </AuthGuard>
  );
};

export default CreateCapsule;