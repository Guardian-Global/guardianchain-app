import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CAPSULE_TYPES,
  VERITAS_SEAL_TYPES,
  type CapsuleType,
  type VeritasSealType,
} from "@shared/schema";
import {
  Shield,
  FileText,
  Scale,
  Eye,
  Lock,
  Users,
  Building,
  GraduationCap,
  DollarSign,
  Globe,
  Vote,
  Stethoscope,
  Leaf,
  Zap,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface CapsuleTypeSelectorProps {
  selectedType?: CapsuleType;
  selectedSealType?: VeritasSealType;
  onTypeSelect: (type: CapsuleType) => void;
  onSealTypeSelect?: (sealType: VeritasSealType) => void;
  showVeritasSeals?: boolean;
}

export function CapsuleTypeSelector({
  selectedType,
  selectedSealType,
  onTypeSelect,
  onSealTypeSelect,
  showVeritasSeals = false,
}: CapsuleTypeSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("core");

  const capsuleCategories: Record<
    string,
    {
      title: string;
      description: string;
      types: Array<{
        type: CapsuleType;
        title: string;
        description: string;
        icon: any;
        color: string;
        tier: string;
        cost: string;
        premium?: boolean;
        secure?: boolean;
      }>;
    }
  > = {
    core: {
      title: "Core Truth Categories",
      description: "Fundamental truth verification types",
      types: [
        {
          type: CAPSULE_TYPES.NEWS_VERIFICATION,
          title: "News Verification",
          description:
            "Verify news articles, media reports, and journalistic content",
          icon: FileText,
          color: "bg-blue-500",
          tier: "Explorer",
          cost: "Free",
        },
        {
          type: CAPSULE_TYPES.HISTORICAL_RECORD,
          title: "Historical Record",
          description:
            "Document and preserve historical events and testimonies",
          icon: Clock,
          color: "bg-amber-500",
          tier: "Explorer",
          cost: "Free",
        },
        {
          type: CAPSULE_TYPES.PERSONAL_TESTIMONY,
          title: "Personal Testimony",
          description: "First-hand witness accounts and personal experiences",
          icon: Users,
          color: "bg-cyan-500",
          tier: "Explorer",
          cost: "Free",
        },
        {
          type: CAPSULE_TYPES.SCIENTIFIC_DATA,
          title: "Scientific Data",
          description:
            "Research findings, data analysis, and scientific documentation",
          icon: Zap,
          color: "bg-green-500",
          tier: "Seeker",
          cost: "1 GTT",
        },
        {
          type: CAPSULE_TYPES.LEGAL_DOCUMENT,
          title: "Legal Document",
          description: "Legal filings, contracts, and official documentation",
          icon: Scale,
          color: "bg-purple-500",
          tier: "Seeker",
          cost: "2 GTT",
        },
      ],
    },
    professional: {
      title: "Professional Verification",
      description: "Enterprise-grade truth certification tools",
      types: [
        {
          type: CAPSULE_TYPES.VERITAS_SEAL,
          title: "Veritas Seal",
          description:
            "Court-admissible professional verification with legal standing",
          icon: Shield,
          color: "bg-gold-500",
          tier: "Creator",
          cost: "10 GTT",
          premium: true,
        },
        {
          type: CAPSULE_TYPES.TRUTH_BOUNTY,
          title: "Truth Bounty",
          description: "Crowdsourced investigation with reward incentives",
          icon: DollarSign,
          color: "bg-emerald-500",
          tier: "Creator",
          cost: "Variable",
        },
        {
          type: CAPSULE_TYPES.TRUTH_REDEMPTION,
          title: "Truth Redemption",
          description: "Fact-checking and correction of misinformation",
          icon: AlertTriangle,
          color: "bg-orange-500",
          tier: "Creator",
          cost: "5 GTT",
        },
        {
          type: CAPSULE_TYPES.CONSPIRACY_CAPSULE,
          title: "Conspiracy Analysis",
          description: "Systematic analysis of conspiracy theories and claims",
          icon: Eye,
          color: "bg-indigo-500",
          tier: "Sovereign",
          cost: "15 GTT",
        },
      ],
    },
    institutional: {
      title: "Enterprise & Institutional",
      description: "High-stakes institutional verification",
      types: [
        {
          type: CAPSULE_TYPES.GOVERNMENT_RECORD,
          title: "Government Record",
          description: "Official government documents and public records",
          icon: Building,
          color: "bg-slate-600",
          tier: "Creator",
          cost: "8 GTT",
        },
        {
          type: CAPSULE_TYPES.CORPORATE_FILING,
          title: "Corporate Filing",
          description: "Business documents, SEC filings, and corporate records",
          icon: Building,
          color: "bg-gray-600",
          tier: "Creator",
          cost: "12 GTT",
        },
        {
          type: CAPSULE_TYPES.ACADEMIC_RESEARCH,
          title: "Academic Research",
          description: "Peer-reviewed research and academic publications",
          icon: GraduationCap,
          color: "bg-blue-600",
          tier: "Creator",
          cost: "6 GTT",
        },
        {
          type: CAPSULE_TYPES.MEDICAL_RECORD,
          title: "Medical Record",
          description: "Healthcare data and medical documentation",
          icon: Stethoscope,
          color: "bg-red-500",
          tier: "Sovereign",
          cost: "20 GTT",
        },
      ],
    },
    security: {
      title: "Security & Whistleblowing",
      description: "Secure anonymous reporting and leak verification",
      types: [
        {
          type: CAPSULE_TYPES.WHISTLEBLOWER_REPORT,
          title: "Whistleblower Report",
          description: "Secure, anonymous reporting with source protection",
          icon: Lock,
          color: "bg-red-600",
          tier: "Creator",
          cost: "Protected",
          secure: true,
        },
        {
          type: CAPSULE_TYPES.LEAK_VERIFICATION,
          title: "Leak Verification",
          description: "Authenticate leaked documents and insider information",
          icon: Lock,
          color: "bg-red-700",
          tier: "Sovereign",
          cost: "Protected",
          secure: true,
        },
        {
          type: CAPSULE_TYPES.ANONYMOUS_TIP,
          title: "Anonymous Tip",
          description: "Anonymous information sharing with identity protection",
          icon: Lock,
          color: "bg-red-500",
          tier: "Seeker",
          cost: "Protected",
          secure: true,
        },
      ],
    },
    specialized: {
      title: "Specialized Categories",
      description: "Domain-specific truth verification",
      types: [
        {
          type: CAPSULE_TYPES.FINANCIAL_DISCLOSURE,
          title: "Financial Disclosure",
          description: "Financial statements, audit reports, and market data",
          icon: DollarSign,
          color: "bg-green-600",
          tier: "Creator",
          cost: "15 GTT",
        },
        {
          type: CAPSULE_TYPES.ENVIRONMENTAL_REPORT,
          title: "Environmental Report",
          description: "Environmental impact studies and sustainability data",
          icon: Leaf,
          color: "bg-green-700",
          tier: "Creator",
          cost: "8 GTT",
        },
        {
          type: CAPSULE_TYPES.ELECTION_INTEGRITY,
          title: "Election Integrity",
          description:
            "Voting records, election data, and democratic processes",
          icon: Vote,
          color: "bg-blue-700",
          tier: "Sovereign",
          cost: "25 GTT",
        },
        {
          type: CAPSULE_TYPES.TECHNOLOGY_AUDIT,
          title: "Technology Audit",
          description:
            "Software audits, security assessments, and tech verification",
          icon: Zap,
          color: "bg-purple-600",
          tier: "Sovereign",
          cost: "18 GTT",
        },
        {
          type: CAPSULE_TYPES.SUPPLY_CHAIN_VERIFICATION,
          title: "Supply Chain Verification",
          description: "Product authenticity and supply chain transparency",
          icon: Globe,
          color: "bg-orange-600",
          tier: "Creator",
          cost: "10 GTT",
        },
      ],
    },
  };

  const veritasSealCategories: Record<
    string,
    {
      title: string;
      seals: Array<{
        type: VeritasSealType;
        title: string;
        description: string;
      }>;
    }
  > = {
    legal: {
      title: "Legal & Court-Admissible",
      seals: [
        {
          type: VERITAS_SEAL_TYPES.LEGAL_AFFIDAVIT,
          title: "Legal Affidavit",
          description: "Sworn legal statement",
        },
        {
          type: VERITAS_SEAL_TYPES.SWORN_TESTIMONY,
          title: "Sworn Testimony",
          description: "Under-oath witness statement",
        },
        {
          type: VERITAS_SEAL_TYPES.NOTARIZED_STATEMENT,
          title: "Notarized Statement",
          description: "Notary-certified document",
        },
        {
          type: VERITAS_SEAL_TYPES.COURT_EVIDENCE,
          title: "Court Evidence",
          description: "Admissible legal evidence",
        },
        {
          type: VERITAS_SEAL_TYPES.LEGAL_OPINION,
          title: "Legal Opinion",
          description: "Professional legal analysis",
        },
      ],
    },
    professional: {
      title: "Professional Certifications",
      seals: [
        {
          type: VERITAS_SEAL_TYPES.EXPERT_WITNESS,
          title: "Expert Witness",
          description: "Professional expert testimony",
        },
        {
          type: VERITAS_SEAL_TYPES.PROFESSIONAL_AUDIT,
          title: "Professional Audit",
          description: "Certified professional review",
        },
        {
          type: VERITAS_SEAL_TYPES.LICENSED_VERIFICATION,
          title: "Licensed Verification",
          description: "Licensed professional certification",
        },
        {
          type: VERITAS_SEAL_TYPES.CERTIFIED_ANALYSIS,
          title: "Certified Analysis",
          description: "Professional analytical report",
        },
      ],
    },
    investigative: {
      title: "Investigative & Journalistic",
      seals: [
        {
          type: VERITAS_SEAL_TYPES.INVESTIGATIVE_REPORT,
          title: "Investigative Report",
          description: "Professional investigation",
        },
        {
          type: VERITAS_SEAL_TYPES.SOURCE_PROTECTED,
          title: "Source Protected",
          description: "Journalist source protection",
        },
        {
          type: VERITAS_SEAL_TYPES.FACT_CHECK_VERIFIED,
          title: "Fact Check Verified",
          description: "Professional fact-checking",
        },
        {
          type: VERITAS_SEAL_TYPES.EDITORIAL_VERIFIED,
          title: "Editorial Verified",
          description: "Editorial board certification",
        },
      ],
    },
    academic: {
      title: "Academic & Scientific",
      seals: [
        {
          type: VERITAS_SEAL_TYPES.PEER_REVIEWED,
          title: "Peer Reviewed",
          description: "Academic peer review",
        },
        {
          type: VERITAS_SEAL_TYPES.ACADEMIC_CERTIFIED,
          title: "Academic Certified",
          description: "Academic institution certification",
        },
        {
          type: VERITAS_SEAL_TYPES.RESEARCH_VERIFIED,
          title: "Research Verified",
          description: "Research methodology verification",
        },
        {
          type: VERITAS_SEAL_TYPES.LABORATORY_CERTIFIED,
          title: "Laboratory Certified",
          description: "Lab testing certification",
        },
      ],
    },
    technology: {
      title: "Technology & Digital",
      seals: [
        {
          type: VERITAS_SEAL_TYPES.CRYPTOGRAPHICALLY_SIGNED,
          title: "Cryptographically Signed",
          description: "Digital signature verification",
        },
        {
          type: VERITAS_SEAL_TYPES.BLOCKCHAIN_VERIFIED,
          title: "Blockchain Verified",
          description: "Blockchain timestamp proof",
        },
        {
          type: VERITAS_SEAL_TYPES.DIGITAL_FORENSICS,
          title: "Digital Forensics",
          description: "Digital evidence analysis",
        },
        {
          type: VERITAS_SEAL_TYPES.TIMESTAMP_VERIFIED,
          title: "Timestamp Verified",
          description: "Time-stamped authenticity",
        },
      ],
    },
  };

  if (showVeritasSeals) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-gold-500" />
            Veritas Seal Types
          </h2>
          <p className="text-muted-foreground">
            Choose professional certification level
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {Object.keys(veritasSealCategories).map((key) => (
            <Button
              key={key}
              variant={activeCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(key)}
              className="capitalize"
            >
              {veritasSealCategories[key]?.title}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {veritasSealCategories[activeCategory]?.seals?.map((seal: any) => (
            <Card
              key={seal.type}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedSealType === seal.type
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => onSealTypeSelect?.(seal.type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold-500/10">
                    <Shield className="h-5 w-5 text-gold-500" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{seal.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {seal.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Capsule Type</h2>
        <p className="text-muted-foreground">
          Select the type of truth verification you need
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(capsuleCategories).map((key) => (
          <Button
            key={key}
            variant={activeCategory === key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(key)}
            className="capitalize"
          >
            {capsuleCategories[key].title}
          </Button>
        ))}
      </div>

      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            {capsuleCategories[activeCategory]?.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {capsuleCategories[activeCategory]?.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capsuleCategories[activeCategory]?.types?.map((capsuleType: any) => {
            const Icon = capsuleType.icon;
            return (
              <Card
                key={capsuleType.type}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedType === capsuleType.type
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => onTypeSelect(capsuleType.type)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${capsuleType.color}/10`}>
                        <Icon
                          className={`h-5 w-5 text-white`}
                          style={{
                            color: capsuleType.color
                              .replace("bg-", "")
                              .replace("-500", ""),
                          }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-sm">
                          {capsuleType.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {capsuleType.tier}
                          </Badge>
                          {capsuleType.premium && (
                            <Badge
                              variant="default"
                              className="text-xs bg-gold-500"
                            >
                              Premium
                            </Badge>
                          )}
                          {capsuleType.secure && (
                            <Badge variant="destructive" className="text-xs">
                              Secure
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Cost</div>
                      <div className="text-xs font-medium">
                        {capsuleType.cost}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    {capsuleType.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
