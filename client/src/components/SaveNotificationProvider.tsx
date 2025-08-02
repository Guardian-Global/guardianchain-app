import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Save, AlertTriangle } from "lucide-react";

interface SaveNotificationContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  saveChanges: (changeData: any, changeType: string) => Promise<void>;
  clearUnsavedChanges: () => void;
  trackChanges: (changeData: any, changeType: string) => void;
}

const SaveNotificationContext = createContext<SaveNotificationContextType | undefined>(undefined);

export function useSaveNotification() {
  const context = useContext(SaveNotificationContext);
  if (!context) {
    throw new Error("useSaveNotification must be used within SaveNotificationProvider");
  }
  return context;
}

interface SaveNotificationProviderProps {
  children: React.ReactNode;
  userId: string;
}

export function SaveNotificationProvider({ children, userId }: SaveNotificationProviderProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate session ID for tracking changes
  const sessionId = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)[0];

  const saveUserChanges = useMutation({
    mutationFn: (data: any) => apiRequest("/api/user/save-changes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      setHasUnsavedChanges(false);
      setPendingChanges([]);
      toast({
        title: "Changes Saved",
        description: "Your changes have been saved successfully.",
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      });
    },
  });

  const trackChanges = useCallback((changeData: any, changeType: string) => {
    const changeEntry = {
      id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      changeType,
      changeData,
      timestamp: new Date().toISOString(),
    };

    setPendingChanges(prev => [...prev, changeEntry]);
    setHasUnsavedChanges(true);

    // Auto-save changes to temporary storage
    const tempChanges = {
      userId,
      sessionId,
      changeType,
      changeData,
      hasUnsavedChanges: true,
    };

    // Store in sessionStorage as backup
    try {
      const existingChanges = JSON.parse(sessionStorage.getItem(`unsaved_changes_${userId}`) || "[]");
      existingChanges.push(tempChanges);
      sessionStorage.setItem(`unsaved_changes_${userId}`, JSON.stringify(existingChanges));
    } catch (error) {
      console.error("Failed to store temporary changes:", error);
    }
  }, [userId, sessionId]);

  const saveChanges = useCallback(async (changeData?: any, changeType?: string) => {
    const changesToSave = changeData && changeType 
      ? [{ changeType, changeData, timestamp: new Date().toISOString() }]
      : pendingChanges;

    if (changesToSave.length === 0) return;

    await saveUserChanges.mutateAsync({
      userId,
      sessionId,
      changes: changesToSave,
    });

    // Clear temporary storage
    sessionStorage.removeItem(`unsaved_changes_${userId}`);
  }, [userId, sessionId, pendingChanges, saveUserChanges]);

  const clearUnsavedChanges = useCallback(() => {
    setHasUnsavedChanges(false);
    setPendingChanges([]);
    sessionStorage.removeItem(`unsaved_changes_${userId}`);
  }, [userId]);

  // Intercept navigation attempts when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Load any existing unsaved changes on mount
  useEffect(() => {
    try {
      const savedChanges = sessionStorage.getItem(`unsaved_changes_${userId}`);
      if (savedChanges) {
        const changes = JSON.parse(savedChanges);
        if (changes.length > 0) {
          setPendingChanges(changes);
          setHasUnsavedChanges(true);
          toast({
            title: "Unsaved Changes Detected",
            description: "You have unsaved changes from a previous session.",
            action: (
              <Button 
                size="sm" 
                onClick={() => saveChanges()}
                disabled={saveUserChanges.isPending}
              >
                <Save className="w-3 h-3 mr-1" />
                Save Now
              </Button>
            ),
          });
        }
      }
    } catch (error) {
      console.error("Failed to load saved changes:", error);
    }
  }, [userId, saveChanges, toast, saveUserChanges.isPending]);

  const handleNavigationAttempt = (newPath: string) => {
    if (hasUnsavedChanges && newPath !== location) {
      setPendingNavigation(newPath);
      setShowExitDialog(true);
      return false;
    }
    return true;
  };

  const handleSaveAndContinue = async () => {
    try {
      await saveChanges();
      setShowExitDialog(false);
      if (pendingNavigation) {
        setLocation(pendingNavigation);
        setPendingNavigation(null);
      }
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  };

  const handleDiscardAndContinue = () => {
    clearUnsavedChanges();
    setShowExitDialog(false);
    if (pendingNavigation) {
      setLocation(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const contextValue: SaveNotificationContextType = {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    saveChanges,
    clearUnsavedChanges,
    trackChanges,
  };

  return (
    <SaveNotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Navigation Warning Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Unsaved Changes
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you continue without saving.
              What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel onClick={() => setShowExitDialog(false)}>
              Stay on Page
            </AlertDialogCancel>
            <Button 
              variant="destructive" 
              onClick={handleDiscardAndContinue}
            >
              Discard Changes
            </Button>
            <AlertDialogAction
              onClick={handleSaveAndContinue}
              disabled={saveUserChanges.isPending}
              className="flex items-center gap-1"
            >
              <Save className="w-3 h-3" />
              Save & Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Floating Save Reminder */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>You have unsaved changes</span>
              <Button 
                size="sm" 
                onClick={() => saveChanges()}
                disabled={saveUserChanges.isPending}
                className="ml-2"
              >
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </SaveNotificationContext.Provider>
  );
}