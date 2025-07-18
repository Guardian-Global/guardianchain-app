export type CapsuleType = 
  | "STANDARD"
  | "LEGAL"
  | "KNOWLEDGE"
  | "CREATOR"
  | "CIVIC"
  | "FINANCIAL"
  | "VERITAS_CERTIFICATE"
  | "AI_GENERATED"
  | "CROSS_CHAIN_ASSET"
  | "MULTIMEDIA_STORY"
  | "CITIZEN_JOURNALISM"
  | "FRAUD_PROOF"
  | "WITNESS_TESTIMONY"
  | "SOULBOUND_MEMOIR";

export interface CapsuleTypeConfig {
  id: CapsuleType;
  name: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  baseFee: number;
  premiumFee: number;
  requiredFields?: string[];
  validationRules?: object;
}

export const CAPSULE_TYPE_CONFIGS: Record<CapsuleType, CapsuleTypeConfig> = {
  STANDARD: {
    id: "STANDARD",
    name: "Standard Capsule",
    description: "Basic truth verification with community validation",
    icon: "FileText",
    color: "bg-blue-500",
    features: ["Community Voting", "Basic Sealing", "IPFS Storage"],
    baseFee: 50,
    premiumFee: 25
  },
  LEGAL: {
    id: "LEGAL",
    name: "Legal Capsule",
    description: "DocuSign integration with legal-grade attestation",
    icon: "Scale",
    color: "bg-purple-600",
    features: ["DocuSign Verification", "Legal Attestation", "Notarization", "Court-Ready"],
    baseFee: 200,
    premiumFee: 100,
    requiredFields: ["legalFramework", "jurisdiction", "attestationType"]
  },
  KNOWLEDGE: {
    id: "KNOWLEDGE",
    name: "Knowledge Capsule",
    description: "Research, citations, and collaborative knowledge building",
    icon: "Brain",
    color: "bg-emerald-600",
    features: ["Citation Tracking", "Version Control", "Peer Review", "Fork Support"],
    baseFee: 75,
    premiumFee: 50,
    requiredFields: ["sources", "methodology"]
  },
  CREATOR: {
    id: "CREATOR",
    name: "Creator Capsule",
    description: "Multimedia content with royalty and attribution tracking",
    icon: "Palette",
    color: "bg-pink-600",
    features: ["Royalty Logic", "Attribution Tracking", "OpenSea Integration", "Creator Tools"],
    baseFee: 100,
    premiumFee: 75,
    requiredFields: ["creatorRights", "licensingTerms"]
  },
  CIVIC: {
    id: "CIVIC",
    name: "Civic Capsule",
    description: "Public accountability and civic engagement",
    icon: "Building",
    color: "bg-red-600",
    features: ["Identity Verification", "DAO Voting", "Public Records", "Soulbound"],
    baseFee: 150,
    premiumFee: 75,
    requiredFields: ["publicInterest", "verificationLevel"]
  },
  FINANCIAL: {
    id: "FINANCIAL",
    name: "Financial Capsule",
    description: "Audit trails and financial transparency",
    icon: "DollarSign",
    color: "bg-yellow-600",
    features: ["Audit Trail", "SEC Compliance", "Smart Contracts", "Financial Proof"],
    baseFee: 300,
    premiumFee: 150,
    requiredFields: ["auditStandard", "complianceFramework"]
  },
  VERITAS_CERTIFICATE: {
    id: "VERITAS_CERTIFICATE",
    name: "Veritas Certificate",
    description: "Premium certification with highest verification standards",
    icon: "Award",
    color: "bg-gold-600",
    features: ["Premium Verification", "Certificate NFT", "Institutional Grade", "Lifetime Validity"],
    baseFee: 500,
    premiumFee: 250
  },
  AI_GENERATED: {
    id: "AI_GENERATED",
    name: "AI-Generated Capsule",
    description: "AI-created content with provenance tracking",
    icon: "Bot",
    color: "bg-cyan-600",
    features: ["AI Attribution", "Model Tracking", "Synthetic Media Detection", "Provenance Chain"],
    baseFee: 125,
    premiumFee: 75
  },
  CROSS_CHAIN_ASSET: {
    id: "CROSS_CHAIN_ASSET",
    name: "Cross-Chain Asset",
    description: "Multi-blockchain asset verification and bridging",
    icon: "Link",
    color: "bg-indigo-600",
    features: ["Multi-Chain Support", "Bridge Verification", "Asset Tracking", "Interoperability"],
    baseFee: 200,
    premiumFee: 100
  },
  MULTIMEDIA_STORY: {
    id: "MULTIMEDIA_STORY",
    name: "Multimedia Story",
    description: "Rich media storytelling with interactive elements",
    icon: "Video",
    color: "bg-orange-600",
    features: ["Rich Media", "Interactive Elements", "Story Timeline", "Media Authentication"],
    baseFee: 150,
    premiumFee: 100
  },
  CITIZEN_JOURNALISM: {
    id: "CITIZEN_JOURNALISM",
    name: "Citizen Journalism",
    description: "Independent journalism with source protection",
    icon: "Newspaper",
    color: "bg-gray-600",
    features: ["Source Protection", "Anonymous Submission", "Fact Checking", "Press Freedom"],
    baseFee: 100,
    premiumFee: 50
  },
  FRAUD_PROOF: {
    id: "FRAUD_PROOF",
    name: "Fraud Proof",
    description: "Evidence collection for fraud and misconduct reporting",
    icon: "AlertTriangle",
    color: "bg-red-700",
    features: ["Evidence Chain", "Whistleblower Protection", "Legal Integration", "Anonymous Reporting"],
    baseFee: 250,
    premiumFee: 125
  },
  WITNESS_TESTIMONY: {
    id: "WITNESS_TESTIMONY",
    name: "Witness Testimony",
    description: "First-hand account verification with witness protection",
    icon: "Eye",
    color: "bg-amber-600",
    features: ["Witness Verification", "Testimony Validation", "Timeline Verification", "Legal Standing"],
    baseFee: 175,
    premiumFee: 100
  },
  SOULBOUND_MEMOIR: {
    id: "SOULBOUND_MEMOIR",
    name: "Soulbound Memoir",
    description: "Personal legacy and life story preservation",
    icon: "Heart",
    color: "bg-rose-600",
    features: ["Non-Transferable", "Legacy Preservation", "Family Sharing", "Lifetime Archive"],
    baseFee: 300,
    premiumFee: 150
  }
};

export interface CapsuleBlock {
  id: string;
  type: "text" | "image" | "video" | "link" | "seal" | "signature" | "citation" | "media";
  content: string;
  metadata?: object;
}

export interface CapsuleMetadata {
  category: string;
  tags: string[];
  griefScore: number;
  credibilityScore: number;
  type: CapsuleType;
  customFields?: Record<string, any>;
}