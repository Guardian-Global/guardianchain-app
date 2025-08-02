import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  withBlur?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallback,
  loadingComponent,
  errorComponent,
  withBlur = true,
  priority = false,
  className,
  ...props
}) => {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading");
  const [imageSrc, setImageSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageState("loading");
    setImageSrc(src);
  }, [src]);

  const handleLoad = () => {
    setImageState("loaded");
  };

  const handleError = () => {
    setImageState("error");
    if (fallback) {
      setImageSrc(fallback);
      setImageState("loading");
    }
  };

  const defaultLoadingComponent = (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
    />
  );

  const defaultErrorComponent = (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
      <div className="text-center text-gray-500">
        <svg
          className="w-12 h-12 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm">Image not found</p>
      </div>
    </div>
  );

  if (imageState === "error" && !fallback) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {errorComponent || defaultErrorComponent}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {imageState === "loading" && (
        <div className="absolute inset-0 z-10">
          {loadingComponent || defaultLoadingComponent}
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: imageState === "loaded" ? 1 : 0,
          filter: withBlur && imageState === "loading" ? "blur(20px)" : "blur(0px)"
        }}
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
            imageState === "loaded" ? "scale-100" : "scale-105",
            className
          )}
          loading={priority ? "eager" : "lazy"}
          {...props}
        />
      </motion.div>
    </div>
  );
};

export default OptimizedImage;