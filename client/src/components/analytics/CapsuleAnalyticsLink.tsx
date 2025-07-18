import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BarChart3, ExternalLink } from "lucide-react";
import { BRAND_COLORS } from "@/lib/constants";

interface CapsuleAnalyticsLinkProps {
  capsuleId: string | number;
  variant?: "button" | "link" | "card";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export default function CapsuleAnalyticsLink({ 
  capsuleId, 
  variant = "button", 
  size = "md", 
  className = "",
  children 
}: CapsuleAnalyticsLinkProps) {
  const href = `/capsule/${capsuleId}/analytics`;

  if (variant === "link") {
    return (
      <Link href={href}>
        <a className={`inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors ${className}`}>
          <BarChart3 className="w-4 h-4" />
          {children || "View Analytics"}
          <ExternalLink className="w-3 h-3" />
        </a>
      </Link>
    );
  }

  if (variant === "card") {
    return (
      <Link href={href}>
        <div className={`p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-purple-500/50 transition-colors cursor-pointer ${className}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <BarChart3 className="w-5 h-5" style={{ color: BRAND_COLORS.GUARDIAN }} />
              </div>
              <div>
                <h3 className="text-white font-medium">Analytics Dashboard</h3>
                <p className="text-slate-400 text-sm">Capsule #{capsuleId}</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </div>
          {children && (
            <div className="mt-3 text-slate-300 text-sm">
              {children}
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Default button variant
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <Link href={href}>
      <Button
        style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}
        className={`${sizeClasses[size]} ${className}`}
      >
        <BarChart3 className="w-4 h-4 mr-2" />
        {children || "View Analytics"}
      </Button>
    </Link>
  );
}