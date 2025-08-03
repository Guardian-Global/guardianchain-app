// guardianmap.tsx — GuardianMap page loader
import CapsuleSearch from "@/components/CapsuleSearch";
import TruthClusterMap from "@/components/TruthClusterMap";

export default function GuardianMapPage() {
  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">🧭 GuardianMap: Capsule Discovery Engine</h1>
      <CapsuleSearch />
      <TruthClusterMap />
    </div>
  );
}
