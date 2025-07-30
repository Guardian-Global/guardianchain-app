import React from "react";

interface LogoDisplayProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "full" | "icon";
  className?: string;
}

const LogoDisplay: React.FC<LogoDisplayProps> = ({ 
  size = "md", 
  variant = "default",
  className = "" 
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  const logoPath = variant === "full" ? "/assets/GUARDIANCHAIN_logo.png" : "/assets/logo.png";

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoPath}
        alt="GUARDIANCHAIN Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
      {variant === "full" && (
        <span className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          GUARDIANCHAIN
        </span>
      )}
    </div>
  );
};

export default LogoDisplay;
export { LogoDisplay };