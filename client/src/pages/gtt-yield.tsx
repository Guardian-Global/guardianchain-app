import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import GTTYieldClaimInterface from "@/components/capsule/GTTYieldClaimInterface";

export default function GTTYieldPage() {
  return (
    <Layout>
      <PageHeader
        title="GTT Yield Claiming"
        subtitle="Claim GTT token yields based on your grief tier contributions"
      />

      <div className="p-6">
        <GTTYieldClaimInterface />
      </div>
    </Layout>
  );
}