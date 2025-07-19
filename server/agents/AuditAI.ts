import { sendGuardianEmail } from "../lib/mailer";
import { notifyAdminOnCritical } from "../notifications/notifyAdmin";

interface TreasuryData {
  balance: number;
  gttCirculation: number;
  weeklyVolume: number;
  monthlyRevenue: number;
}

interface InvoiceData {
  id: string;
  vendor: string;
  amount: number;
  status: 'pending' | 'paid' | 'disputed';
  dueDate: string;
  category: string;
}

interface VendorData {
  address: string;
  name: string;
  lifetimePayouts: number;
  paid: boolean;
  lastPayment: string;
  trustScore: number;
}

interface AuditReport {
  timestamp: string;
  totalTreasury: number;
  pendingInvoices: number;
  vendorsPaid: number;
  riskFlags: string[];
  complianceScore: number;
  recommendations: string[];
}

export class AuditAI {
  private static readonly RISK_THRESHOLDS = {
    HIGH_VENDOR_PAYOUT_RATIO: 0.15, // 15% of treasury
    MAX_PENDING_INVOICES: 10,
    MIN_TREASURY_BUFFER: 50000, // Minimum GTT treasury reserve
    VENDOR_TRUST_THRESHOLD: 0.7
  };

  /**
   * Run comprehensive financial audit with AI analysis
   */
  static async runAudit(data: {
    treasury: TreasuryData;
    invoices: InvoiceData[];
    vendors: VendorData[];
  }): Promise<AuditReport> {
    const report: AuditReport = {
      timestamp: new Date().toISOString(),
      totalTreasury: data.treasury.balance,
      pendingInvoices: data.invoices.filter(inv => inv.status === 'pending').length,
      vendorsPaid: data.vendors.filter(v => v.paid).length,
      riskFlags: [],
      complianceScore: 100,
      recommendations: []
    };

    // Perform risk analysis
    await this.analyzeRisks(data, report);
    
    // Calculate compliance score
    this.calculateComplianceScore(report);
    
    // Generate AI recommendations
    await this.generateRecommendations(data, report);
    
    // Send audit report
    await this.sendAuditReport(report, data);
    
    // Check for critical issues
    if (report.riskFlags.length > 0 || report.complianceScore < 80) {
      await this.sendCriticalAlert(report);
    }

    return report;
  }

  /**
   * Analyze financial risks and flag potential issues
   */
  private static async analyzeRisks(
    data: { treasury: TreasuryData; invoices: InvoiceData[]; vendors: VendorData[] },
    report: AuditReport
  ): Promise<void> {
    const { treasury, invoices, vendors } = data;

    // Check vendor payout concentration
    const totalVendorPayouts = vendors.reduce((sum, v) => sum + v.lifetimePayouts, 0);
    const payoutRatio = totalVendorPayouts / treasury.balance;
    
    if (payoutRatio > this.RISK_THRESHOLDS.HIGH_VENDOR_PAYOUT_RATIO) {
      report.riskFlags.push(`High vendor payout concentration: ${(payoutRatio * 100).toFixed(1)}%`);
      report.complianceScore -= 15;
    }

    // Check pending invoice count
    if (report.pendingInvoices > this.RISK_THRESHOLDS.MAX_PENDING_INVOICES) {
      report.riskFlags.push(`Excessive pending invoices: ${report.pendingInvoices}`);
      report.complianceScore -= 10;
    }

    // Check treasury buffer
    if (treasury.balance < this.RISK_THRESHOLDS.MIN_TREASURY_BUFFER) {
      report.riskFlags.push(`Low treasury reserve: ${treasury.balance} GTT`);
      report.complianceScore -= 20;
    }

    // Check vendor trust scores
    const lowTrustVendors = vendors.filter(v => v.trustScore < this.RISK_THRESHOLDS.VENDOR_TRUST_THRESHOLD);
    if (lowTrustVendors.length > 0) {
      report.riskFlags.push(`${lowTrustVendors.length} vendors below trust threshold`);
      report.complianceScore -= 5;
    }

    // Check for overdue invoices
    const overdueInvoices = invoices.filter(inv => {
      return inv.status === 'pending' && new Date(inv.dueDate) < new Date();
    });
    
    if (overdueInvoices.length > 0) {
      report.riskFlags.push(`${overdueInvoices.length} overdue invoices`);
      report.complianceScore -= 8;
    }
  }

  /**
   * Calculate overall compliance score
   */
  private static calculateComplianceScore(report: AuditReport): void {
    // Ensure compliance score doesn't go below 0
    report.complianceScore = Math.max(0, report.complianceScore);
    
    // Add bonus points for good performance
    if (report.riskFlags.length === 0) {
      report.complianceScore = Math.min(100, report.complianceScore + 5);
    }
  }

  /**
   * Generate AI-powered recommendations
   */
  private static async generateRecommendations(
    data: { treasury: TreasuryData; invoices: InvoiceData[]; vendors: VendorData[] },
    report: AuditReport
  ): Promise<void> {
    const { treasury, invoices, vendors } = data;

    // Treasury management recommendations
    if (treasury.balance < this.RISK_THRESHOLDS.MIN_TREASURY_BUFFER * 2) {
      report.recommendations.push("Consider increasing GTT treasury reserves through protocol fees");
    }

    // Vendor management recommendations
    const highPayoutVendors = vendors
      .filter(v => v.lifetimePayouts > treasury.balance * 0.05)
      .sort((a, b) => b.lifetimePayouts - a.lifetimePayouts);
    
    if (highPayoutVendors.length > 0) {
      report.recommendations.push(`Review payment terms with top vendor: ${highPayoutVendors[0].name}`);
    }

    // Invoice processing recommendations
    const pendingAmount = invoices
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0);
    
    if (pendingAmount > treasury.balance * 0.1) {
      report.recommendations.push("Process pending invoices to maintain vendor relationships");
    }

    // Diversification recommendations
    const vendorCount = vendors.length;
    if (vendorCount < 5) {
      report.recommendations.push("Consider diversifying vendor base to reduce dependency risk");
    }

    // Growth recommendations
    if (treasury.weeklyVolume > treasury.monthlyRevenue * 0.8) {
      report.recommendations.push("Strong volume growth detected - consider scaling infrastructure");
    }
  }

  /**
   * Send comprehensive audit report via email
   */
  private static async sendAuditReport(report: AuditReport, data: any): Promise<void> {
    const riskLevel = report.complianceScore >= 90 ? "LOW" : 
                     report.complianceScore >= 80 ? "MEDIUM" : "HIGH";
    
    const riskEmoji = riskLevel === "LOW" ? "🟢" : 
                      riskLevel === "MEDIUM" ? "🟡" : "🔴";

    const markdown = `
# 🧾 GUARDIANCHAIN Weekly Financial Audit

**Audit Date:** ${new Date(report.timestamp).toLocaleDateString()}  
**Risk Level:** ${riskEmoji} ${riskLevel}  
**Compliance Score:** ${report.complianceScore}/100

## 💰 Treasury Overview

- **Total Balance:** ${report.totalTreasury.toLocaleString()} GTT
- **Weekly Volume:** ${data.treasury.weeklyVolume.toLocaleString()} GTT
- **Monthly Revenue:** ${data.treasury.monthlyRevenue.toLocaleString()} GTT
- **GTT Circulation:** ${data.treasury.gttCirculation.toLocaleString()} tokens

## 📊 Financial Activity

- **Pending Invoices:** ${report.pendingInvoices}
- **Vendors Paid This Week:** ${report.vendorsPaid}
- **Transaction Count:** ${data.vendors.length + data.invoices.length}

## 🚨 Risk Assessment

${report.riskFlags.length > 0 ? 
  report.riskFlags.map(flag => `- ⚠️ ${flag}`).join('\n') : 
  '- ✅ No risk flags detected'
}

## 💡 AI Recommendations

${report.recommendations.length > 0 ?
  report.recommendations.map(rec => `- 🎯 ${rec}`).join('\n') :
  '- ✅ System operating optimally'
}

## 🏛️ Vendor Summary

${data.vendors.slice(0, 5).map((vendor: VendorData) => `
### ${vendor.name}
- **Lifetime Payouts:** ${vendor.lifetimePayouts.toLocaleString()} GTT
- **Trust Score:** ${(vendor.trustScore * 100).toFixed(1)}%
- **Last Payment:** ${vendor.lastPayment}
`).join('\n')}

## 📈 Performance Metrics

- **Treasury Growth:** ${((data.treasury.balance / 100000 - 1) * 100).toFixed(1)}% (vs baseline)
- **Vendor Efficiency:** ${(data.vendors.filter((v: VendorData) => v.trustScore > 0.8).length / data.vendors.length * 100).toFixed(1)}%
- **Invoice Processing:** ${((data.invoices.filter((i: InvoiceData) => i.status === 'paid').length / data.invoices.length) * 100).toFixed(1)}%

---

**[View Full Dashboard](https://guardianchain.app/admin/financial)** | **[Treasury Details](https://guardianchain.app/treasury)** | **[Audit History](https://guardianchain.app/admin/audits)**

*This audit was generated by GUARDIANCHAIN AI Financial Integrity Agent*
`;

    await sendGuardianEmail({
      to: "founder+guardian-admin@guardianchain.org",
      subject: `🧠 Weekly Financial Audit - ${riskLevel} Risk`,
      notificationType: "financial_audit",
      forceSend: true,
      markdown
    });
  }

  /**
   * Send critical alert for high-risk situations
   */
  private static async sendCriticalAlert(report: AuditReport): Promise<void> {
    const alertMessage = `Financial audit detected ${report.riskFlags.length} risk flags with compliance score of ${report.complianceScore}/100`;
    
    await notifyAdminOnCritical(alertMessage, {
      complianceScore: report.complianceScore,
      riskFlags: report.riskFlags,
      treasuryBalance: report.totalTreasury,
      pendingInvoices: report.pendingInvoices,
      auditTimestamp: report.timestamp
    });
  }

  /**
   * Schedule automated audits
   */
  static async scheduleWeeklyAudit(): Promise<void> {
    // This would integrate with a job scheduler in production
    console.log("📅 Weekly financial audit scheduled");
    
    // Mock data for demonstration
    const mockData = {
      treasury: {
        balance: 150000,
        gttCirculation: 1000000,
        weeklyVolume: 25000,
        monthlyRevenue: 85000
      },
      invoices: [
        { id: "INV-001", vendor: "ProtonMail", amount: 500, status: 'paid' as const, dueDate: "2025-01-15", category: "Infrastructure" },
        { id: "INV-002", vendor: "AWS", amount: 1200, status: 'pending' as const, dueDate: "2025-01-20", category: "Cloud Services" }
      ],
      vendors: [
        { address: "0x123", name: "ProtonMail", lifetimePayouts: 5000, paid: true, lastPayment: "2025-01-15", trustScore: 0.95 },
        { address: "0x456", name: "AWS", lifetimePayouts: 12000, paid: false, lastPayment: "2025-01-01", trustScore: 0.88 }
      ]
    };

    await this.runAudit(mockData);
  }
}