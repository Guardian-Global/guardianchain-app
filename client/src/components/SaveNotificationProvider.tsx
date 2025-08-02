import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Save } from "lucide-react";

interface SaveNotificationContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  saveFunction?: () => Promise<void> | void;
  setSaveFunction: (fn: () => Promise<void> | void) => void;
}

const SaveNotificationContext = createContext<SaveNotificationContextType | undefined>(undefined);

export function useSaveNotification() {
  const context = useContext(SaveNotificationContext);
  if (context === undefined) {
    throw new Error('useSaveNotification must be used within a SaveNotificationProvider');
  }
  return context;
}

interface SaveNotificationProviderProps {
  children: React.ReactNode;
  hasUnsavedChanges: boolean;
  onSave?: () => Promise<void> | void;
  className?: string;
}

export function SaveNotificationProvider({ 
  children, 
  hasUnsavedChanges: externalUnsavedChanges,
  onSave,
  className = ""
}: SaveNotificationProviderProps) {
  const [internalUnsavedChanges, setInternalUnsavedChanges] = useState(false);
  const [saveFunction, setSaveFunction] = useState<(() => Promise<void> | void) | undefined>(() => onSave);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const { toast } = useToast();

  const hasUnsavedChanges = externalUnsavedChanges || internalUnsavedChanges;

  // Handle browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [hasUnsavedChanges]);

  // Handle navigation attempts
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
        setShowExitDialog(true);
        setPendingNavigation(window.location.pathname);
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [hasUnsavedChanges]);

  // Show periodic save reminders
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const reminderTimer = setTimeout(() => {
      toast({
        title: "Unsaved Changes",
        description: "You have unsaved changes in your sovereign profile.",
        action: saveFunction ? (
          <Button 
            size="sm" 
            onClick={() => {
              try {
                saveFunction();
                toast({
                  title: "Profile Saved",
                  description: "Your changes have been permanently recorded.",
                });
              } catch (error) {
                toast({
                  title: "Save Failed",
                  description: "Could not save your changes.",
                  variant: "destructive",
                });
              }
            }}
          >
            <Save className="w-3 h-3 mr-1" />
            Save Now
          </Button>
        ) : undefined,
      });
    }, 30000); // Remind after 30 seconds

    return () => clearTimeout(reminderTimer);
  }, [hasUnsavedChanges, saveFunction, toast]);

  const handleConfirmExit = () => {
    setInternalUnsavedChanges(false);
    setShowExitDialog(false);
    if (pendingNavigation) {
      window.location.href = pendingNavigation;
    }
  };

  const handleSaveAndExit = async () => {
    if (saveFunction) {
      try {
        await saveFunction();
        setInternalUnsavedChanges(false);
        setShowExitDialog(false);
        
        toast({
          title: "Profile Saved",
          description: "Your changes have been saved permanently.",
        });

        if (pendingNavigation) {
          setTimeout(() => {
            window.location.href = pendingNavigation;
          }, 500);
        }
      } catch (error) {
        toast({
          title: "Save Failed",
          description: "Could not save your changes before leaving.",
          variant: "destructive",
        });
      }
    }
  };

  const contextValue: SaveNotificationContextType = {
    hasUnsavedChanges,
    setHasUnsavedChanges: setInternalUnsavedChanges,
    saveFunction,
    setSaveFunction: (fn) => setSaveFunction(() => fn),
  };

  return (
    <SaveNotificationContext.Provider value={contextValue}>
      <div className={`relative ${className}`}>
        {/* Unsaved changes indicator */}
        {hasUnsavedChanges && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Unsaved Changes</span>
              {saveFunction && (
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={saveFunction}
                  className="ml-2 h-6 px-2"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
              )}
            </div>
          </div>
        )}

        {children}

        {/* Exit confirmation dialog */}
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Unsaved Changes Detected
              </AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes to your sovereign profile. These changes will be lost if you leave without saving.
                Your profile represents your permanent identity on the blockchain - would you like to save your changes first?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowExitDialog(false)}>
                Stay on Page
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmExit}
                className="bg-red-600 hover:bg-red-700"
              >
                Leave Without Saving
              </AlertDialogAction>
              {saveFunction && (
                <AlertDialogAction 
                  onClick={handleSaveAndExit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save & Leave
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SaveNotificationContext.Provider>
  );
}