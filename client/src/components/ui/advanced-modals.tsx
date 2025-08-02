import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertTriangle, Info, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedButton } from "./enhanced-button";

interface AdvancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  variant?: "default" | "success" | "warning" | "danger" | "quantum";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
}

export const AdvancedModal: React.FC<AdvancedModalProps> = ({
  isOpen,
  onClose,
  title,
  variant = "default",
  size = "md",
  children,
  footer,
  showCloseButton = true,
  closeOnBackdrop = true,
  className
}) => {
  const variants = {
    default: {
      header: "bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700",
      content: "bg-gradient-to-br from-slate-900 to-black border-slate-700"
    },
    success: {
      header: "bg-gradient-to-r from-green-800 to-emerald-900 border-green-600",
      content: "bg-gradient-to-br from-green-900/50 to-black border-green-600/30"
    },
    warning: {
      header: "bg-gradient-to-r from-yellow-800 to-orange-900 border-yellow-600",
      content: "bg-gradient-to-br from-yellow-900/50 to-black border-yellow-600/30"
    },
    danger: {
      header: "bg-gradient-to-r from-red-800 to-rose-900 border-red-600",
      content: "bg-gradient-to-br from-red-900/50 to-black border-red-600/30"
    },
    quantum: {
      header: "bg-gradient-to-r from-purple-800 via-cyan-800 to-yellow-800 border-purple-500",
      content: "bg-gradient-to-br from-purple-900/50 via-cyan-900/30 to-yellow-900/30 border-purple-500/30"
    }
  };

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] max-h-[95vh]"
  };

  const style = variants[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "relative w-full rounded-xl border backdrop-blur-md shadow-2xl",
                sizes[size],
                style.content,
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {title && (
                <div className={cn(
                  "flex items-center justify-between p-6 border-b rounded-t-xl",
                  style.header
                )}>
                  <div className="flex items-center gap-3">
                    {variant === "success" && <Check className="w-5 h-5 text-green-400" />}
                    {variant === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                    {variant === "danger" && <AlertTriangle className="w-5 h-5 text-red-400" />}
                    {variant === "quantum" && <Zap className="w-5 h-5 text-purple-400" />}
                    {variant === "default" && <Info className="w-5 h-5 text-blue-400" />}
                    
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                  </div>
                  
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
                  {footer}
                </div>
              )}

              {/* Quantum Effects */}
              {variant === "quantum" && (
                <>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-yellow-500 opacity-60" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full blur-sm"
                  />
                </>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: "default" | "danger" | "warning";
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = "default",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
    if (!loading) onClose();
  };

  return (
    <AdvancedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      size="sm"
      closeOnBackdrop={!loading}
      footer={
        <>
          <EnhancedButton
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </EnhancedButton>
          <EnhancedButton
            variant={variant === "danger" ? "destructive" : "quantum"}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </EnhancedButton>
        </>
      }
    >
      <p className="text-gray-300">{message}</p>
    </AdvancedModal>
  );
};

interface LoadingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  progress?: number;
  variant?: "default" | "quantum";
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  title = "Processing...",
  message = "Please wait while we process your request.",
  progress,
  variant = "quantum"
}) => {
  return (
    <AdvancedModal
      isOpen={isOpen}
      onClose={() => {}}
      title={title}
      variant={variant}
      size="sm"
      showCloseButton={false}
      closeOnBackdrop={false}
    >
      <div className="text-center space-y-4">
        <p className="text-gray-300">{message}</p>
        
        {/* Loading Spinner */}
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
          />
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="w-full">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>
    </AdvancedModal>
  );
};

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
  autoClose?: number;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  actionButton,
  autoClose
}) => {
  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  const variantMap = {
    success: "success" as const,
    error: "danger" as const,
    warning: "warning" as const,
    info: "default" as const
  };

  return (
    <AdvancedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variantMap[type]}
      size="sm"
      footer={
        <>
          {actionButton && (
            <EnhancedButton
              variant="quantum"
              onClick={() => {
                actionButton.onClick();
                onClose();
              }}
            >
              {actionButton.text}
            </EnhancedButton>
          )}
          <EnhancedButton variant="ghost" onClick={onClose}>
            Close
          </EnhancedButton>
        </>
      }
    >
      <p className="text-gray-300">{message}</p>
    </AdvancedModal>
  );
};