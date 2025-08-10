import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/queryClient";

export enum NotarizationStatus {
  PENDING = 'PENDING',
  NOTARIZED = 'NOTARIZED',
  CERTIFIED = 'CERTIFIED',
  LEGAL_GRADE = 'LEGAL_GRADE',
  DISPUTED = 'DISPUTED',
}

export enum EvidenceLevel {
  BASIC = 'BASIC',
  ENHANCED = 'ENHANCED',
  FORENSIC = 'FORENSIC',
  LEGAL = 'LEGAL',
}

export interface CapsuleCertificate {
  notarizationId: number;
  certificateHash: string;
  certificateUri: string;
  issuedAt: number;
  expiresAt: number;
  issuedBy: string;
  isValid: boolean;
}

export interface Capsule {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  truthScore?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  metadata?: Record<string, unknown>;
  notarizationStatus?: NotarizationStatus;
  evidenceLevel?: EvidenceLevel;
  contentHash?: string;
  ipfsHash?: string;
  jurisdictions?: string[];
  witnessCount?: number;
  isPublic?: boolean;
  retentionPeriod?: number;
  certificate?: CapsuleCertificate;
}

export function useCapsules(params?: Record<string, string>) {
  return useQuery<Capsule[]>({
    queryKey: ["/api/capsules", params],
  queryFn: () => api.capsules.getAll(params) as Promise<Capsule[]>,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCapsule(id: string) {
  return useQuery({
    queryKey: ["/api/capsules", id],
    queryFn: () => api.capsules.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useRecentCapsule() {
  return useQuery({
    queryKey: ["/api/capsules/recent"],
    queryFn: () => api.capsules.getRecent(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateCapsule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (capsuleData: Partial<Capsule>) => api.capsules.create(capsuleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
    },
  });
}

export function useUpdateCapsule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Capsule> }) =>
      api.capsules.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
    },
  });
}

export function useDeleteCapsule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.capsules.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
    },
  });
}
