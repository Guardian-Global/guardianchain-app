// PDFExport.tsx — Export search results as PDF using @react-pdf/renderer
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  item: { marginBottom: 10 },
  title: { fontSize: 18, marginBottom: 10 },
});

const CapsulePDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>GuardianMap Search Results</Text>
      {data.map((r, i) => (
        <Text key={i} style={styles.item}>
          ID: {r.id} | Grief Tier: {r.grief_tier} | Tags:{" "}
          {(r.tags || []).join(", ")}
        </Text>
      ))}
    </Page>
  </Document>
);

export default function PDFExport({ data }) {
  return (
    <div className="mt-2">
      <PDFDownloadLink
        document={<CapsulePDF data={data} />}
        fileName="guardianmap_results.pdf"
        className="px-3 py-1 bg-indigo-700 text-white rounded"
      >
        ⬇️ Export PDF
      </PDFDownloadLink>
    </div>
  );
}
