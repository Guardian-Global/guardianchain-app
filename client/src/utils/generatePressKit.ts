import jsPDF from "jspdf";

interface PressKitData {
  companyName: string;
  tagline: string;
  description: string;
  features: string[];
  contact: {
    email: string;
    website: string;
  };
  launchDate?: string;
  additionalInfo?: string[];
}

export function generatePressKitPDF(data?: PressKitData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 30;

  // Default data if none provided
  const pressData: PressKitData = data || {
    companyName: "GUARDIANCHAIN",
    tagline: "Veritas Sealed. Truth Tokenized.",
    description:
      "GUARDIANCHAIN has officially launched as the world's first sovereign memory infrastructure built for high-integrity capsule authorship, immutable emotional yield, and decentralized witness validation.",
    features: [
      "Truth Capsules - Seal personal or institutional memory",
      "Veritas Certificates - On-chain authorship & emotion proof",
      "GTT Token - Grief-weighted yield for testimony",
      "Jury Validation - Decentralized truth voting",
      "Capsule Explorer - Public or private memory graph",
    ],
    contact: {
      email: "founder@guardianchain.app",
      website: "https://guardianchain.app",
    },
    launchDate: new Date().toLocaleDateString(),
    additionalInfo: [
      "Tiered yield claiming with automatic distribution",
      "Public replay with professional certifier dashboard",
      "PDF veritas proof bundles for legal documentation",
      "Institution onboarding with multi-role access control",
    ],
  };

  // Header
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(pressData.companyName, pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 15;

  // Tagline
  doc.setFontSize(16);
  doc.setFont("helvetica", "italic");
  doc.text(pressData.tagline, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 20;

  // Launch announcement
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("OFFICIAL LAUNCH ANNOUNCEMENT", pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 15;

  // Description
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const descriptionLines = doc.splitTextToSize(
    pressData.description,
    pageWidth - 40,
  );
  doc.text(descriptionLines, 20, yPosition);
  yPosition += descriptionLines.length * 5 + 15;

  // Core Features
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("CORE FEATURES", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  pressData.features.forEach((feature) => {
    const featureLines = doc.splitTextToSize(`• ${feature}`, pageWidth - 40);
    doc.text(featureLines, 25, yPosition);
    yPosition += featureLines.length * 4 + 3;
  });
  yPosition += 10;

  // Mainnet Launch Features
  if (pressData.additionalInfo && pressData.additionalInfo.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("MAINNET LAUNCH INCLUDES", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    pressData.additionalInfo.forEach((info) => {
      const infoLines = doc.splitTextToSize(`• ${info}`, pageWidth - 40);
      doc.text(infoLines, 25, yPosition);
      yPosition += infoLines.length * 4 + 3;
    });
    yPosition += 15;
  }

  // Founder Quote
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 30;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  const quote =
    "\"GUARDIANCHAIN isn't just a platform — it's a sovereign engine for preserving what mattered most.\"";
  const quoteLines = doc.splitTextToSize(quote, pageWidth - 60);
  doc.text(quoteLines, pageWidth / 2, yPosition, { align: "center" });
  yPosition += quoteLines.length * 5 + 5;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("— Troy A. Cronin, Founder", pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 20;

  // Contact Information
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("CONTACT INFORMATION", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Website: ${pressData.contact.website}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Email: ${pressData.contact.email}`, 20, yPosition);
  yPosition += 8;

  if (pressData.launchDate) {
    doc.text(`Launch Date: ${pressData.launchDate}`, 20, yPosition);
    yPosition += 8;
  }

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    "This press kit contains confidential and proprietary information.",
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" },
  );
  doc.text(
    "© 2025 GUARDIANCHAIN. All rights reserved.",
    pageWidth / 2,
    pageHeight - 12,
    { align: "center" },
  );

  // Generate and download
  const filename = "GuardianChain_Launch_PressKit.pdf";
  doc.save(filename);

  return filename;
}

// Function to generate a comprehensive press kit with multiple sections
export function generateComprehensivePressKit() {
  return generatePressKitPDF({
    companyName: "GUARDIANCHAIN",
    tagline: "Veritas Sealed. Truth Tokenized.",
    description:
      "GUARDIANCHAIN has officially launched as the world's first sovereign memory infrastructure built for high-integrity capsule authorship, immutable emotional yield, and decentralized witness validation. Our platform revolutionizes how truth is preserved, validated, and monetized in the digital age.",
    features: [
      "Truth Capsules - Cryptographically sealed personal or institutional memory preservation",
      "Veritas Certificates - Blockchain-verified authorship and emotional authenticity proof",
      "GTT Token - Grief-weighted yield rewards based on emotional resonance and truth value",
      "Jury Validation - Decentralized community-driven truth verification and consensus",
      "Capsule Explorer - Advanced search and discovery for public and private memory graphs",
      "Institutional Access - Enterprise-grade tools for legal and corporate truth preservation",
      "Validator Dashboard - Professional certification and verification workflow management",
      "Live Broadcasting - Real-time node monitoring and network health visualization",
    ],
    contact: {
      email: "founder@guardianchain.app",
      website: "https://guardianchain.app",
    },
    launchDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    additionalInfo: [
      "Tiered yield claiming system with automatic GTT token distribution",
      "Public capsule replay functionality with professional certifier dashboard",
      "Legal-grade PDF Veritas proof bundles for court admissibility",
      "Multi-role institutional onboarding with granular access controls",
      "AI-powered grief scoring and emotional resonance analysis",
      "Cross-platform mobile compatibility with responsive design",
      "Comprehensive API suite for enterprise integration",
      "Advanced analytics dashboard with yield tracking and performance metrics",
    ],
  });
}
