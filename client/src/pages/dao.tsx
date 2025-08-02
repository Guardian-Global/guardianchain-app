import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Gavel, Plus, Vote, Shield, FileText, Calendar } from "lucide-react";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import ProposalList from "@/components/dao/ProposalList";
import { useAuth } from "@/hooks/useAuth";

const proposalSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  endTime: z.string().optional(),
});

type ProposalForm = z.infer<typeof proposalSchema>;

export default function DAOPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const form = useForm<ProposalForm>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: "",
      description: "",
      endTime: "",
    },
  });

  const createProposalMutation = useMutation({
    mutationFn: async (data: ProposalForm) => {
      return apiRequest("POST", "/api/dao/proposals", data);
    },
    onSuccess: () => {
      toast({
        title: "Proposal Created",
        description: "Your proposal has been submitted for voting.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dao/proposals"] });
      setIsCreateOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ proposalId, choice }: { proposalId: string; choice: string }) => {
      return apiRequest("POST", "/api/dao/vote", { proposalId, choice });
    },
    onSuccess: () => {
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded on the blockchain.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dao/proposals"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Voting Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVote = (proposalId: string, choice: 'support' | 'reject' | 'abstain') => {
    voteMutation.mutate({ proposalId, choice });
  };

  const onSubmit = (data: ProposalForm) => {
    createProposalMutation.mutate(data);
  };

  return (
    <Layout>
      <PageHeader
        title="DAO Governance"
        description="Participate in GuardianChain decentralized governance"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "DAO Governance" }
        ]}
      />

      <div className="space-y-8 p-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Gavel className="w-8 h-8 text-brand-primary" />
            <h1 className="text-3xl font-bold text-brand-light font-brand">
              GuardianChain DAO
            </h1>
          </div>
          <p className="text-lg text-brand-light/80 max-w-2xl mx-auto">
            Shape the future of truth preservation through decentralized governance.
            Create proposals, vote on initiatives, and earn GTT rewards for participation.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-brand-secondary border-brand-surface shadow-card">
            <CardContent className="p-6 text-center">
              <Vote className="w-8 h-8 text-brand-accent mx-auto mb-3" />
              <div className="text-2xl font-bold text-brand-light mb-1">12</div>
              <div className="text-sm text-brand-light/60">Active Proposals</div>
            </CardContent>
          </Card>
          
          <Card className="bg-brand-secondary border-brand-surface shadow-card">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-brand-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-brand-light mb-1">1,247</div>
              <div className="text-sm text-brand-light/60">Total Votes Cast</div>
            </CardContent>
          </Card>
          
          <Card className="bg-brand-secondary border-brand-surface shadow-card">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-brand-warning mx-auto mb-3" />
              <div className="text-2xl font-bold text-brand-light mb-1">89</div>
              <div className="text-sm text-brand-light/60">Truth Certificates</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="proposals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-brand-surface">
            <TabsTrigger value="proposals" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
              Active Proposals
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
              Voting History
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
              Truth Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proposals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-brand-light">Active Proposals</h2>
              
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Proposal
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-brand-secondary border-brand-surface max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-brand-light font-brand">Create New Proposal</DialogTitle>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-brand-light">Proposal Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter proposal title..."
                                className="bg-brand-surface border-brand-primary/20 text-brand-light"
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
                            <FormLabel className="text-brand-light">Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Detailed description of your proposal..."
                                className="bg-brand-surface border-brand-primary/20 text-brand-light min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-brand-light">End Time (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="datetime-local"
                                className="bg-brand-surface border-brand-primary/20 text-brand-light"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex gap-3">
                        <Button 
                          type="submit" 
                          disabled={createProposalMutation.isPending}
                          className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
                        >
                          {createProposalMutation.isPending ? "Creating..." : "Create Proposal"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsCreateOpen(false)}
                          className="border-brand-surface text-brand-light hover:bg-brand-surface"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <ProposalList 
              onVote={handleVote}
              userAddress={user?.walletAddress}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-brand-secondary border-brand-surface">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-brand-light/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-brand-light mb-2">Voting History</h3>
                <p className="text-brand-light/60">
                  Your voting history will appear here once you start participating in governance.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <Card className="bg-brand-secondary border-brand-surface">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-brand-light/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-brand-light mb-2">Truth Certificates</h3>
                <p className="text-brand-light/60">
                  Truth certificates for verified capsules will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}