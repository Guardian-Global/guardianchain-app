import jsPDF from 'jspdf';

interface PressKitData {
  companyName: string;
  tagline: string;
  description: string;
  features: string[];
  stats: {
    totalCapsules: number;
    verifiedCapsules: number;
    activeValidators: number;
    gttCirculating: number;
  };
  contact: {
    email: string;
    website: string;
    twitter?: string;
    linkedin?: string;
  };
}

export function generatePressKitPDF(data?: Partial<PressKitData>) {
  const pressKitData: PressKitData = {
    companyName: 'GUARDIANCHAIN',
    tagline: 'Veritas Sealed. Truth Tokenized.',
    description: `GUARDIANCHAIN has officially launched as the world's first sovereign memory infrastructure for high-integrity capsule authorship, emotional yield, and validator witness protection. Our platform transforms digital memories into immutable blockchain assets with community-driven truth verification.`,
    features: [
      'Truth Capsules: Immutable digital memory preservation',
      'Veritas Certificates: On-chain authorship proofs with legal standing',
      'GTT Token: Grief-weighted yield claims and emotional economics',
      'Jury Validation: Community-backed truth scoring and consensus',
      'Capsule Explorer: Memory access across all membership tiers',
      'Professional Validator Tools: Enterprise-grade content moderation',
      'AI-Powered Classification: Emotional content analysis and verification',
      'Real-Time Node Network: Live broadcast and synchronization'
    ],
    stats: {
      totalCapsules: 12847,
      verifiedCapsules: 8932,
      activeValidators: 247,
      gttCirculating: 2847392
    },
    contact: {
      email: 'founder@guardianchain.app',
      website: 'https://guardianchain.app',
      twitter: '@GuardianChainHQ',
      linkedin: 'company/guardianchain'
    },
    ...data
  };

  const doc = new jsPDF();
  
  // Header Section
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(pressKitData.companyName, 20, 25);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'italic');
  doc.text(pressKitData.tagline, 20, 35);
  
  // Horizontal line
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);
  
  // Description
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const splitDescription = doc.splitTextToSize(pressKitData.description, 170);
  doc.text(splitDescription, 20, 55);
  
  // Key Features Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Platform Features:', 20, 85);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  pressKitData.features.forEach((feature, index) => {
    doc.text(`• ${feature}`, 25, 95 + (index * 6));
  });
  
  // Statistics Section
  const statsY = 95 + (pressKitData.features.length * 6) + 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Platform Statistics:', 20, statsY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const stats = [
    `Total Capsules: ${pressKitData.stats.totalCapsules.toLocaleString()}`,
    `Verified Capsules: ${pressKitData.stats.verifiedCapsules.toLocaleString()}`,
    `Active Validators: ${pressKitData.stats.activeValidators.toLocaleString()}`,
    `GTT Tokens in Circulation: ${pressKitData.stats.gttCirculating.toLocaleString()}`
  ];
  
  stats.forEach((stat, index) => {
    doc.text(`• ${stat}`, 25, statsY + 10 + (index * 6));
  });
  
  // Contact Information
  const contactY = statsY + 10 + (stats.length * 6) + 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Media Contact:', 20, contactY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Email: ${pressKitData.contact.email}`, 25, contactY + 10);
  doc.text(`Website: ${pressKitData.contact.website}`, 25, contactY + 18);
  
  if (pressKitData.contact.twitter) {
    doc.text(`Twitter: ${pressKitData.contact.twitter}`, 25, contactY + 26);
  }
  
  if (pressKitData.contact.linkedin) {
    doc.text(`LinkedIn: ${pressKitData.contact.linkedin}`, 25, contactY + 34);
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('This press kit contains forward-looking statements about blockchain technology and digital asset markets.', 20, 280);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | GUARDIANCHAIN Enterprise Suite`, 20, 290);
  
  // Save the PDF
  const timestamp = new Date().toISOString().split('T')[0];
  doc.save(`GUARDIANCHAIN_Press_Kit_${timestamp}.pdf`);
  
  return {
    success: true,
    filename: `GUARDIANCHAIN_Press_Kit_${timestamp}.pdf`,
    data: pressKitData
  };
}

export function generateExecutiveSummary() {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('GUARDIANCHAIN', 20, 25);
  doc.text('Executive Summary', 20, 35);
  
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const sections = [
    {
      title: 'Mission Statement',
      content: 'GUARDIANCHAIN preserves human truth through immutable blockchain technology, creating a sovereign memory infrastructure that protects authentic narratives from digital manipulation and censorship.'
    },
    {
      title: 'Market Opportunity',
      content: 'The global need for truth verification has reached critical mass. With AI-generated content proliferating, our platform provides essential infrastructure for authentic memory preservation and community-driven verification.'
    },
    {
      title: 'Technology Innovation',
      content: 'Our grief-weighted tokenomics, jury-based validation system, and emotional AI classification represent breakthrough innovations in blockchain-based truth preservation and community governance.'
    },
    {
      title: 'Business Model',
      content: 'Revenue streams include transaction fees, enterprise API subscriptions, premium verification services, and institutional access licensing. Target: $50M ARR within 24 months.'
    }
  ];
  
  let currentY = 55;
  sections.forEach(section => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, 20, currentY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitContent = doc.splitTextToSize(section.content, 170);
    doc.text(splitContent, 20, currentY + 8);
    
    currentY += 8 + (splitContent.length * 4) + 10;
  });
  
  doc.save('GUARDIANCHAIN_Executive_Summary.pdf');
}

export function generateTechnicalWhitepaper() {
  const doc = new jsPDF();
  
  // Title Page
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('GUARDIANCHAIN', 105, 100, { align: 'center' });
  doc.text('Technical Whitepaper', 105, 115, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Sovereign Memory Infrastructure', 105, 130, { align: 'center' });
  doc.text('Version 1.0', 105, 145, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Published: ${new Date().toLocaleDateString()}`, 105, 200, { align: 'center' });
  
  // Add new page for content
  doc.addPage();
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Abstract', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const abstract = `GUARDIANCHAIN introduces a novel blockchain infrastructure for truth preservation through immutable memory capsules, grief-weighted tokenomics, and community-driven validation. This technical specification outlines our ERC-721 implementation, consensus mechanisms, and emotional AI classification system.`;
  
  const splitAbstract = doc.splitTextToSize(abstract, 170);
  doc.text(splitAbstract, 20, 35);
  
  // Table of Contents
  let currentY = 35 + (splitAbstract.length * 4) + 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', 20, currentY);
  
  const tableOfContents = [
    '1. Introduction',
    '2. Architecture Overview',
    '3. Smart Contract Implementation',
    '4. Tokenomics and Yield Mechanics',
    '5. Validation and Consensus',
    '6. AI Integration and Classification',
    '7. Security Considerations',
    '8. Future Developments'
  ];
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  tableOfContents.forEach((item, index) => {
    doc.text(item, 25, currentY + 10 + (index * 6));
  });
  
  doc.save('GUARDIANCHAIN_Technical_Whitepaper.pdf');
}