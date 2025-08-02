import { useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/apiClient";

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface SummaryRequest {
  content: string;
  type?: "brief" | "detailed" | "voice";
}

export interface AnalysisRequest {
  content: string;
  type?: "emotion" | "truth" | "sentiment" | "full";
}

export function useTranslate() {
  return useMutation({
    mutationFn: (data: TranslationRequest) => api.ai.translate(data),
  });
}

export function useSummary() {
  return useMutation({
    mutationFn: (data: SummaryRequest) => api.ai.summary(data),
  });
}

export function useAnalyze() {
  return useMutation({
    mutationFn: (data: AnalysisRequest) => api.ai.analyze(data),
  });
}
