import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Fix for the TanStack Query error with profile queries
export function useProfileQuery(projectId: string) {
  return useQuery({
    queryKey: ["/api/profile", projectId],
    queryFn: async () => {
      try {
        const response = await apiRequest(
          "GET",
          `/api/profile?project=${projectId}`,
        );
        return await response.json();
      } catch (error) {
        console.warn("Profile fetch failed:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
