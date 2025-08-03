import { useEffect, useState } from "react";

export default function VaultDashboard() {
  const [vault, setVault] = useState(null);

  useEffect(() => {
    fetch("/api/vault/stats").then(res => res.json()).then(setVault);
  }, []);

  if (!vault) return <p className="p-4">Loading vault stats...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🏛 DAO Vault Overview</h1>
      <ul className="text-sm space-y-2">
        <li>🪙 Total GTT in Vault: <strong>{vault.totalGTT}</strong></li>
        <li>🧾 Last Disbursement: <strong>{vault.lastDisbursement}</strong></li>
        <li>👥 Pending Approvals: <strong>{vault.pendingTxs}</strong></li>
      </ul>
    </div>
  );
}
