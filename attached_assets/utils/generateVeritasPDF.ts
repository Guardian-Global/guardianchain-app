import PDFDocument from "pdfkit";
import fs from "fs";

export async function generateVeritasPDF({
  title,
  griefScore,
  creator,
  description,
  outputPath
}) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text("🧠 Veritas Certificate", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Title: ${title}`);
  doc.text(`Creator: ${creator}`);
  doc.text(`GriefScore: ${griefScore}`);
  doc.moveDown();
  doc.fontSize(12).text("Description:");
  doc.text(description, { align: "left" });

  doc.end();
}
