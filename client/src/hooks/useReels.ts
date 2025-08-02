import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/apiClient";

export interface Reel {
  id: string;
  name: string;
  capsuleIds: string[];
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useReels() {
  return useQuery<Reel[]>({
    queryKey: ["/api/reels"],
    queryFn: () => api.reels.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateReel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reelData: any) => api.reels.create(reelData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reels"] });
    },
  });
}

export function useUpdateReel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.reels.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reels"] });
    },
  });
}
