import PDFDocument from "pdfkit";
import fs from "fs";

export function generateArchiveCert({ title, griefScore, author, chain, timestamp, outputPath }) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(18).text("📜 GuardianChain Archive Certificate", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(\`Title: \${title}\`);
  doc.text(\`GriefScore: \${griefScore}\`);
  doc.text(\`Author: \${author}\`);
  doc.text(\`Chain: \${chain}\`);
  doc.text(\`Timestamp: \${new Date(timestamp).toUTCString()}\`);
  doc.moveDown();
  doc.text("This capsule has been securely archived and verified by GuardianChain.");
  doc.end();
}
