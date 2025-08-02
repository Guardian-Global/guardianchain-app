import { useLocation } from "wouter";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import ProposalResults from "@/components/dao/ProposalResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DAOResultsPage() {
  const [location] = useLocation();
  
  // Extract proposal ID from URL path like /dao/results/prop_123
  const pathParts = location.split('/');
  const proposalId = pathParts[pathParts.length - 1];

  if (!proposalId || proposalId === 'results') {
    return (
      <Layout>
        <PageHeader
          title="DAO Results"
          description="No proposal ID specified"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "DAO Governance", href: "/dao" },
            { label: "Results" }
          ]}
        />
        <div className="p-6 text-center">
          <p className="text-brand-light/60 mb-4">No proposal ID was provided.</p>
          <Button 
            onClick={() => window.location.href = '/dao'}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to DAO
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="DAO Voting Results"
        description="View detailed voting results and outcome"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "DAO Governance", href: "/dao" },
          { label: "Results" }
        ]}
      />

      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/dao'}
            className="border-brand-surface text-brand-light hover:bg-brand-surface"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to DAO
          </Button>
        </div>

        <ProposalResults proposalId={proposalId} />
      </div>
    </Layout>
  );
}