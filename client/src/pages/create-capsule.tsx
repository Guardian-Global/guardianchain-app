import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import CapsuleCreationFlow from "@/components/capsule/CapsuleCreationFlow";

export default function CreateCapsulePage() {
  return (
    <Layout>
      <PageHeader
        title="Create Truth Capsule"
        subtitle="Preserve your truth, memory, or important information on the blockchain"
      />

      <div className="p-6">
        <CapsuleCreationFlow />
      </div>
    </Layout>
  );
}
