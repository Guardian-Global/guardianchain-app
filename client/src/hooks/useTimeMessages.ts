import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/apiClient";

export interface TimeMessage {
  id: string;
  title: string;
  content: string;
  scheduledFor: string;
  recipient: string;
  status: string;
  createdAt: string;
}

export function useSentTimeMessages() {
  return useQuery({
    queryKey: ["/api/time-messages/sent"],
    queryFn: () => api.timeMessages.getSent(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useReceivedTimeMessages() {
  return useQuery({
    queryKey: ["/api/time-messages/received"],
    queryFn: () => api.timeMessages.getReceived(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useSendTimeMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageData: any) => api.timeMessages.send(messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-messages/sent"] });
    },
  });
}
