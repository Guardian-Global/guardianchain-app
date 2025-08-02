import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface TierContextType {
  userRole: string;
  isLoading: boolean;
  refreshRole: () => Promise<void>;
}

const TierContext = createContext<TierContextType>({
  userRole: "guest",
  isLoading: true,
  refreshRole: async () => {}
});

export const useTierContext = () => useContext(TierContext);

interface TierProviderProps {
  children: ReactNode;
}

export function TierProvider({ children }: TierProviderProps) {
  const [userRole, setUserRole] = useState("guest");
  const [isLoading, setIsLoading] = useState(true);

  const fetchRole = async () => {
    try {
      setIsLoading(true);
      
      if (!isAuthenticated || !user) {
        setUserRole("guest");
        return;
      }

      // Get user tier from API
      const res = await fetch("/api/get-user-tier");
      const data = await res.json();
      setUserRole(data.tier || "guest");
      
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      setUserRole("guest");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, [isAuthenticated, user]);

  const refreshRole = async () => {
    await fetchRole();
  };

  return (
    <TierContext.Provider value={{ userRole, isLoading, refreshRole }}>
      {children}
    </TierContext.Provider>
  );
}