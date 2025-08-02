import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

interface GuardianNode {
  id: string;
  wallet: string;
  latitude: number;
  longitude: number;
  truth_score: number;
  capsule_count: number;
  region: string;
  country: string;
  city: string;
  reputation_tier: "Bronze" | "Silver" | "Gold" | "Veritas";
  activity_level: "low" | "medium" | "high";
  last_active: string;
  specialties: string[];
  connections: string[];
  influence_radius: number;
}

interface ExportOptions {
  includeConnections: boolean;
  includeMetrics: boolean;
  includeSpecialties: boolean;
  includeTimestamp: boolean;
  includeWatermark: boolean;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    backgroundColor: "#0f172a",
    color: "#ffffff",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottom: "2px solid #3b82f6",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b82f6",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 10,
    color: "#64748b",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#22c55e",
    marginBottom: 10,
    borderBottom: "1px solid #374151",
    paddingBottom: 3,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    padding: 5,
    backgroundColor: "#1e293b",
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#94a3b8",
    flex: 1,
  },
  statValue: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "bold",
  },
  guardianGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  guardianCard: {
    width: "48%",
    backgroundColor: "#1e293b",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    border: "1px solid #374151",
  },
  guardianHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  guardianId: {
    fontSize: 9,
    color: "#3b82f6",
    fontWeight: "bold",
  },
  tierBadge: {
    fontSize: 8,
    padding: "2 6",
    borderRadius: 10,
    color: "#ffffff",
  },
  veritasTier: { backgroundColor: "#fbbf24" },
  goldTier: { backgroundColor: "#eab308" },
  silverTier: { backgroundColor: "#9ca3af" },
  bronzeTier: { backgroundColor: "#f97316" },
  guardianInfo: {
    fontSize: 8,
    color: "#d1d5db",
    marginBottom: 2,
  },
  specialties: {
    fontSize: 7,
    color: "#22c55e",
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#64748b",
    borderTop: "1px solid #374151",
    paddingTop: 10,
  },
  watermark: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    fontSize: 48,
    color: "#1e293b",
    opacity: 0.1,
    zIndex: -1,
  },
});

const GuardianMapPDF = ({
  guardians,
  options,
}: {
  guardians: GuardianNode[];
  options: ExportOptions;
}) => {
  const totalGuardians = guardians.length;
  const tierCounts = guardians.reduce(
    (acc, guardian) => {
      acc[guardian.reputation_tier] = (acc[guardian.reputation_tier] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const avgTruthScore =
    guardians.reduce((sum, g) => sum + g.truth_score, 0) / totalGuardians;
  const totalCapsules = guardians.reduce((sum, g) => sum + g.capsule_count, 0);
  const activeGuardians = guardians.filter(
    (g) => g.activity_level === "high",
  ).length;

  const getTierStyle = (tier: string) => {
    switch (tier) {
      case "Veritas":
        return styles.veritasTier;
      case "Gold":
        return styles.goldTier;
      case "Silver":
        return styles.silverTier;
      case "Bronze":
        return styles.bronzeTier;
      default:
        return styles.bronzeTier;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {options.includeWatermark && (
          <Text style={styles.watermark}>GUARDIANCHAIN</Text>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>GuardianChain Network Report</Text>
          <Text style={styles.subtitle}>Global Guardian Map Analysis</Text>
          {options.includeTimestamp && (
            <Text style={styles.timestamp}>
              Generated: {new Date().toLocaleString()}
            </Text>
          )}
        </View>

        {/* Network Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Network Overview</Text>

          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>Total Guardians:</Text>
            <Text style={styles.statValue}>
              {totalGuardians.toLocaleString()}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>Average Truth Score:</Text>
            <Text style={styles.statValue}>{avgTruthScore.toFixed(1)}</Text>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>Total Capsules:</Text>
            <Text style={styles.statValue}>
              {totalCapsules.toLocaleString()}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>High Activity Guardians:</Text>
            <Text style={styles.statValue}>
              {activeGuardians} (
              {((activeGuardians / totalGuardians) * 100).toFixed(1)}%)
            </Text>
          </View>
        </View>

        {/* Tier Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reputation Tier Distribution</Text>

          {Object.entries(tierCounts).map(([tier, count]) => (
            <View key={tier} style={styles.statsRow}>
              <Text style={styles.statLabel}>{tier} Tier:</Text>
              <Text style={styles.statValue}>
                {count} ({((count / totalGuardians) * 100).toFixed(1)}%)
              </Text>
            </View>
          ))}
        </View>

        {/* Guardian Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guardian Network Details</Text>

          <View style={styles.guardianGrid}>
            {guardians.slice(0, 20).map((guardian) => (
              <View key={guardian.id} style={styles.guardianCard}>
                <View style={styles.guardianHeader}>
                  <Text style={styles.guardianId}>
                    {guardian.wallet.slice(0, 8)}...{guardian.wallet.slice(-4)}
                  </Text>
                  <Text
                    style={[
                      styles.tierBadge,
                      getTierStyle(guardian.reputation_tier),
                    ]}
                  >
                    {guardian.reputation_tier}
                  </Text>
                </View>

                <Text style={styles.guardianInfo}>
                  📍 {guardian.city}, {guardian.country}
                </Text>

                <Text style={styles.guardianInfo}>
                  🎯 Truth Score: {guardian.truth_score} | 📦 Capsules:{" "}
                  {guardian.capsule_count}
                </Text>

                <Text style={styles.guardianInfo}>
                  🔗 Activity: {guardian.activity_level.toUpperCase()}
                </Text>

                {options.includeSpecialties &&
                  guardian.specialties.length > 0 && (
                    <Text style={styles.specialties}>
                      Specialties: {guardian.specialties.slice(0, 2).join(", ")}
                      {guardian.specialties.length > 2 &&
                        ` +${guardian.specialties.length - 2} more`}
                    </Text>
                  )}

                {options.includeConnections && (
                  <Text style={styles.guardianInfo}>
                    🌐 Connections: {guardian.connections.length}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {guardians.length > 20 && (
            <Text
              style={[
                styles.guardianInfo,
                { textAlign: "center", marginTop: 10 },
              ]}
            >
              ... and {guardians.length - 20} more guardians
            </Text>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          GuardianChain Truth Vault • Generated from Guardian Map •
          guardianchain.app
          {options.includeTimestamp &&
            ` • ${new Date().toISOString().split("T")[0]}`}
        </Text>
      </Page>
    </Document>
  );
};

interface GuardianPDFExportProps {
  guardians: GuardianNode[];
  options: ExportOptions;
  filename?: string;
}

export default function GuardianPDFExport({
  guardians,
  options,
  filename,
}: GuardianPDFExportProps) {
  const defaultFilename = `guardianmap_report_${guardians.length}guardians_${new Date().toISOString().split("T")[0]}.pdf`;

  return (
    <PDFDownloadLink
      document={<GuardianMapPDF guardians={guardians} options={options} />}
      fileName={filename || defaultFilename}
    >
      {({ loading }) => (
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          className="border-indigo-500/30"
        >
          <FileText className="w-4 h-4 mr-1" />
          {loading ? "Generating..." : "PDF Report"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
