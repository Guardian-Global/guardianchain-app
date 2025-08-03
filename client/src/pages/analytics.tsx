import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import CapsuleClusteringDashboard from "@/components/analytics/CapsuleClusteringDashboard";

export default function AnalyticsPage() {
  return (
    <>
      <Helmet>
        <title>AI Analytics - GuardianChain</title>
        <meta 
          name="description" 
          content="Advanced AI-powered analytics and clustering analysis for truth capsules. Discover hidden patterns and emotional themes using machine learning." 
        />
      </Helmet>

      <Layout>
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <PageHeader title="AI Analytics Dashboard" />

          <CapsuleClusteringDashboard />
        </div>
      </Layout>
    </>
  );
}