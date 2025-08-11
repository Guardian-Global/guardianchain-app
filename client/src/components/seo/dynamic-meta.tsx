import { useEffect } from "react";
import type { Capsule } from "@/types/schema";

interface DynamicMetaProps {
  capsule?: Capsule;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function DynamicMeta({
  capsule,
  title,
  description,
  image,
  url,
}: DynamicMetaProps) {
  useEffect(() => {
    // Determine meta values
    const metaTitle = capsule
      ? `${capsule.title} – GuardianChain`
      : title || "GuardianChain – Immutable Truth Verification";

    const metaDescription = capsule
      ? `${capsule.description} • Verified truth capsule with grief score ${capsule.griefScore} • Sealed with blockchain technology`
      : description ||
        "Decentralized truth verification platform with blockchain-sealed capsules and community governance.";

    const metaImage =
      capsule?.imageUrl ||
      image ||
      `https://api.dicebear.com/7.x/shapes/svg?seed=${
        capsule?.id || "guardianchain"
      }&backgroundColor=1e293b`;

    const metaUrl = capsule
      ? `https://guardianchain.app/capsule/${capsule.id}`
      : url || "https://guardianchain.app";

    // Update document title
    document.title = metaTitle;

    // Update or create meta tags
    const updateMetaTag = (
      property: string,
      content: string,
      isName = false,
    ) => {
      const selector = isName
        ? `meta[name="${property}"]`
        : `meta[property="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement("meta");
        if (isName) {
          meta.setAttribute("name", property);
        } else {
          meta.setAttribute("property", property);
        }
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    // OpenGraph tags
    updateMetaTag("og:title", metaTitle);
    updateMetaTag("og:description", metaDescription);
    updateMetaTag("og:image", metaImage);
    updateMetaTag("og:url", metaUrl);
    updateMetaTag("og:type", "article");
    updateMetaTag("og:site_name", "GuardianChain");

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image", true);
    updateMetaTag("twitter:title", metaTitle, true);
    updateMetaTag("twitter:description", metaDescription, true);
    updateMetaTag("twitter:image", metaImage, true);
    updateMetaTag("twitter:site", "@guardianchain", true);
    updateMetaTag("twitter:creator", "@guardianchain", true);

    // Standard meta tags
    updateMetaTag("description", metaDescription, true);
    updateMetaTag(
      "keywords",
      "blockchain, truth verification, NFT, Web3, decentralized, immutable proof, DocuSign",
      true,
    );
    updateMetaTag("author", "GuardianChain", true);

    // Additional structured data for capsules
    if (capsule) {
      updateMetaTag("article:author", `Creator #${capsule.creatorId}`, true);
      updateMetaTag(
        "article:published_time",
        capsule.createdAt || new Date().toISOString(),
      );
      updateMetaTag(
        "article:modified_time",
        capsule.updatedAt || capsule.createdAt || new Date().toISOString(),
      );
      updateMetaTag("article:section", capsule.category);
      updateMetaTag("article:tag", `grief-score-${capsule.griefScore}`, true);

      if (capsule.status === "sealed") {
        updateMetaTag("article:tag", "veritas-sealed", true);
      }
    }

    // Cleanup function
    return () => {
      // Reset to default values when component unmounts
      document.title = "GuardianChain – Immutable Truth Verification";
    };
  }, [capsule, title, description, image, url]);

  return null; // This component doesn't render anything
}

// Helper function to generate preview image URL for capsules
export function generateCapsulePreviewImage(capsule: Capsule): string {
  if (capsule.imageUrl) {
    return capsule.imageUrl;
  }

  // Generate a deterministic preview image based on capsule data
  const params = new URLSearchParams({
    seed: capsule.id.toString(),
    backgroundColor: "1e293b",
    size: "800",
    format: "svg",
  });

  return `https://api.dicebear.com/7.x/shapes/svg?${params.toString()}`;
}

// Helper function to generate structured data JSON-LD
export function generateCapsuleStructuredData(capsule: Capsule) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: capsule.title,
    description: capsule.description,
    image: generateCapsulePreviewImage(capsule),
    url: `https://guardianchain.app/capsule/${capsule.id}`,
    datePublished: capsule.createdAt,
    dateModified: capsule.updatedAt || capsule.createdAt,
    author: {
      "@type": "Person",
      name: `Creator #${capsule.creatorId}`,
    },
    publisher: {
      "@type": "Organization",
      name: "GuardianChain",
      url: "https://guardianchain.app",
    },
    articleSection: capsule.category,
    keywords: [
      "blockchain verification",
      "immutable truth",
      "Web3",
      capsule.category,
      capsule.status === "sealed" ? "veritas sealed" : "pending verification",
    ].join(", "),
    isAccessibleForFree: true,
    inLanguage: "en-US",
  };
}
