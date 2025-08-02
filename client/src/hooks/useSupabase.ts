import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/apiClient";

export function useSupabaseAssets() {
  return useQuery({
    queryKey: ['/api/supabase/assets/discover'],
    queryFn: () => api.supabase.discoverAssets(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useUploadAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata?: any }) => 
      api.supabase.uploadAsset(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/supabase/assets/discover'] });
    },
  });
}