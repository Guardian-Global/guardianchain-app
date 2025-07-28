import { BRAND_NAME, BRAND_COLORS } from "@/lib/constants";

interface BrandedTextProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  showColors?: boolean;
}

export function BrandedText({
  className = "",
  size = "md",
  showColors = true,
}: BrandedTextProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  };

  if (showColors) {
    return (
      <span className={`${sizeClasses[size]} font-bold ${className}`}>
        <span style={{ color: BRAND_COLORS.GUARDIAN }}>GUARDIAN</span>
        <span style={{ color: BRAND_COLORS.CHAIN }}>CHAIN</span>
      </span>
    );
  }

  return (
    <span className={`${sizeClasses[size]} font-bold ${className}`}>
      {BRAND_NAME}
    </span>
  );
}

export function useBrandName() {
  return BRAND_NAME;
}

export function useBrandColors() {
  return BRAND_COLORS;
}
