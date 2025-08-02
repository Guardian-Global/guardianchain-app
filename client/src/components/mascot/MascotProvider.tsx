import React, { createContext, useContext, useState, useEffect } from "react";
import OnboardingMascot from "./OnboardingMascot";

interface MascotContextType {
  showMascot: boolean;
  startOnboarding: () => void;
  dismissMascot: () => void;
  isOnboardingComplete: boolean;
  mascotEnabled: boolean;
  setMascotEnabled: (enabled: boolean) => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export function useMascot() {
  const context = useContext(MascotContext);
  if (!context) {
    throw new Error("useMascot must be used within a MascotProvider");
  }
  return context;
}

interface MascotProviderProps {
  children: React.ReactNode;
}

export function MascotProvider({ children }: MascotProviderProps) {
  const [showMascot, setShowMascot] = useState(false);
  const [mascotEnabled, setMascotEnabled] = useState(true);

  const isOnboardingComplete = localStorage.getItem("onboarding_completed") === "true";

  // Auto-start onboarding for new authenticated users
  useEffect(() => {
    if (isAuthenticated && user && !isOnboardingComplete && mascotEnabled) {
      // Small delay to let the app settle
      const timer = setTimeout(() => {
        setShowMascot(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, isOnboardingComplete, mascotEnabled]);

  const startOnboarding = () => {
    localStorage.removeItem("onboarding_completed");
    setShowMascot(true);
  };

  const dismissMascot = () => {
    setShowMascot(false);
  };

  const handleComplete = () => {
    setShowMascot(false);
  };

  const contextValue: MascotContextType = {
    showMascot,
    startOnboarding,
    dismissMascot,
    isOnboardingComplete,
    mascotEnabled,
    setMascotEnabled,
  };

  return (
    <MascotContext.Provider value={contextValue}>
      {children}
      {mascotEnabled && (
        <OnboardingMascot
          isVisible={showMascot}
          onComplete={handleComplete}
          onDismiss={dismissMascot}
          autoStart={false}
        />
      )}
    </MascotContext.Provider>
  );
}