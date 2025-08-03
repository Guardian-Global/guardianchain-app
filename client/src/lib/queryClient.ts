import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Enhanced global queryFn that handles all API routes properly
const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const url = typeof queryKey[0] === "string" ? queryKey[0] : "/";
  const res = await fetch(url, {
    credentials: "include",
  });
  
  if (!res.ok) {
    throw new Error(`${res.status}: ${res.statusText}`);
  }
  
  return res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 20 * 60 * 1000, // 20 minutes
      retry: false,
      networkMode: "online",
    },
    mutations: {
      retry: false,
      networkMode: "online",
    },
  },
});

// API helper functions
async function apiGet<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
  const response = await fetch(`/api${endpoint}${queryString}`, {
    credentials: "include"
  });
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

async function apiPost<T>(endpoint: string, data?: any): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include"
  });
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

async function apiPatch<T>(endpoint: string, data?: any): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include"
  });
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    method: "DELETE",
    credentials: "include"
  });
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

// Export API object that matches the expected interface
export const api = {
  // Authentication
  auth: {
    getUser: () => apiGet("/auth/user"),
    logout: () => apiPost("/auth/logout"),
  },

  // User operations
  user: {
    getStats: () => apiGet("/user/stats"),
    getTier: () => apiGet("/get-user-tier"),
    updateProfile: (data: any) => apiPatch("/user/profile", data),
  },

  // Capsules
  capsules: {
    getAll: (params?: Record<string, string>) => apiGet("/capsules", params),
    getById: (id: string) => apiGet(`/capsules/${id}`),
    create: (data: any) => apiPost("/capsules", data),
    update: (id: string, data: any) => apiPatch(`/capsules/${id}`, data),
    delete: (id: string) => apiDelete(`/capsules/${id}`),
    getRecent: () => apiGet("/capsules/recent"),
  },

  // Analytics
  analytics: {
    getCapsules: () => apiGet("/analytics/capsules"),
    getFinancial: () => apiGet("/analytics/financial"),
  },

  // Token data
  token: {
    getLiveData: () => apiGet("/token/live-data"),
    getHistory: () => apiGet("/token/history"),
  },

  // SMRI (Social Memory Reputation Index)
  smri: {
    getByWallet: (wallet: string) => apiGet(`/smri/${wallet}`),
    getLeaderboard: () => apiGet("/smri/leaderboard"),
  },

  // Time messages
  timeMessages: {
    getSent: () => apiGet("/time-messages/sent"),
    getReceived: () => apiGet("/time-messages/received"),
    send: (data: any) => apiPost("/time-messages", data),
  },

  // Reels
  reels: {
    getAll: () => apiGet("/reels"),
    create: (data: any) => apiPost("/reels", data),
    update: (id: string, data: any) => apiPatch(`/reels/${id}`, data),
  },

  // AI services
  ai: {
    translate: (data: any) => apiPost("/ai/translate", data),
    summary: (data: any) => apiPost("/ai/summary", data),
    analyze: (data: any) => apiPost("/ai/analyze", data),
  },

  // NFT operations
  nft: {
    mint: (data: any) => apiPost("/nft/mint", data),
    getMetadata: (tokenId: string) => apiGet(`/nft/metadata/${tokenId}`),
  },

  // Supabase assets
  supabase: {
    discoverAssets: () => apiGet("/supabase/assets/discover"),
    uploadAsset: async (file: File, metadata?: any) => {
      const formData = new FormData();
      formData.append("file", file);
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
      }

      const response = await fetch("/api/supabase/assets/upload", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
  },
};
