import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Note: Progress component would be imported from shadcn/ui but not available in current setup
import { Vault, Users, Clock, CheckCircle, XCircle, Shield } from "lucide-react";

interface MultisigTransaction {
  id: string;
  type: "disbursement" | "payout" | "governance";
  amount: number;
  recipient: string;
  description: string;
  signatures: number;
  requiredSignatures: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  signers: string[];
}

interface VaultStats {
  totalGTT: number;
  lastDisbursement: string;
  pendingTxs: number;
  weeklyDisbursement: number;
  validatorRewards: number;
  treasuryHealth: number;
}

export default function MultisigVault() {
  const { data: vaultStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/vault/stats"],
  });

  const { data: pendingTxs, isLoading: txsLoading } = useQuery({
    queryKey: ["/api/vault/pending-transactions"],
  });

  if (statsLoading || txsLoading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-brand-light/60">Loading vault dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  const stats: VaultStats = vaultStats || {
    totalGTT: 2847650,
    lastDisbursement: "2 hours ago",
    pendingTxs: 4,
    weeklyDisbursement: 125000,
    validatorRewards: 45000,
    treasuryHealth: 87
  };

  return (
    <div className="space-y-6">
      {/* Vault Overview */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light flex items-center gap-2">
            <Vault className="w-5 h-5 text-brand-accent" />
            DAO Vault Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-brand-surface rounded">
              <div className="text-2xl font-bold text-brand-warning">{stats.totalGTT.toLocaleString()}</div>
              <div className="text-xs text-brand-light/60">Total GTT</div>
            </div>
            <div className="text-center p-3 bg-brand-surface rounded">
              <div className="text-2xl font-bold text-brand-success">{stats.weeklyDisbursement.toLocaleString()}</div>
              <div className="text-xs text-brand-light/60">Weekly Disbursement</div>
            </div>
            <div className="text-center p-3 bg-brand-surface rounded">
              <div className="text-2xl font-bold text-brand-accent">{stats.validatorRewards.toLocaleString()}</div>
              <div className="text-xs text-brand-light/60">Validator Rewards</div>
            </div>
            <div className="text-center p-3 bg-brand-surface rounded">
              <div className="text-2xl font-bold text-brand-light">{stats.pendingTxs}</div>
              <div className="text-xs text-brand-light/60">Pending Approvals</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-brand-light/80">Treasury Health</span>
              <span className="text-sm font-medium text-brand-light">{stats.treasuryHealth}%</span>
            </div>
            <div className="w-full bg-brand-dark h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-success to-brand-warning transition-all duration-300"
                style={{ width: `${stats.treasuryHealth}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Multisig Transactions */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-accent" />
            Pending Multisig Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {pendingTxs?.map((tx: MultisigTransaction) => (
              <div key={tx.id} className="p-4 bg-brand-surface rounded-lg border border-brand-light/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={
                        tx.type === "disbursement" ? "border-blue-500 text-blue-400" :
                        tx.type === "payout" ? "border-green-500 text-green-400" :
                        "border-purple-500 text-purple-400"
                      }
                    >
                      {tx.type}
                    </Badge>
                    <span className="font-medium text-brand-warning">
                      {tx.amount.toLocaleString()} GTT
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-brand-light/50">
                    <Clock className="w-3 h-3" />
                    {tx.createdAt}
                  </div>
                </div>

                <p className="text-sm text-brand-light/80 mb-3">{tx.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-light/60">Recipient:</span>
                    <span className="text-brand-light font-mono text-xs">{tx.recipient}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-brand-light/60 text-sm">Signatures:</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: tx.requiredSignatures }, (_, i) => (
                          <div 
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < tx.signatures ? 'bg-green-500' : 'bg-brand-light/20'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-brand-light">
                        {tx.signatures}/{tx.requiredSignatures}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-8">
                    <Shield className="w-3 h-3 mr-1" />
                    Sign
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1 h-8">
                    <XCircle className="w-3 h-3 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}