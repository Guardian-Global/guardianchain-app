/**
 * API Client for GuardianChain
 * Centralized HTTP client with authentication and error handling
 */

const API_BASE_URL = '/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error || errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or parsing errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const queryString = params 
      ? '?' + new URLSearchParams(params).toString()
      : '';
    
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload helper
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Convenience methods for common API operations
export const api = {
  // Authentication
  auth: {
    getUser: () => apiClient.get('/auth/user'),
    logout: () => apiClient.post('/auth/logout'),
  },

  // User operations
  user: {
    getStats: () => apiClient.get('/user/stats'),
    getTier: () => apiClient.get('/get-user-tier'),
    updateProfile: (data: any) => apiClient.patch('/user/profile', data),
  },

  // Capsules
  capsules: {
    getAll: (params?: Record<string, string>) => apiClient.get('/capsules', params),
    getById: (id: string) => apiClient.get(`/capsules/${id}`),
    create: (data: any) => apiClient.post('/capsules', data),
    update: (id: string, data: any) => apiClient.patch(`/capsules/${id}`, data),
    delete: (id: string) => apiClient.delete(`/capsules/${id}`),
    getRecent: () => apiClient.get('/capsules/recent'),
  },

  // Analytics
  analytics: {
    getCapsules: () => apiClient.get('/analytics/capsules'),
    getFinancial: () => apiClient.get('/analytics/financial'),
  },

  // Token data
  token: {
    getLiveData: () => apiClient.get('/token/live-data'),
    getHistory: () => apiClient.get('/token/history'),
  },

  // SMRI (Social Memory Reputation Index)
  smri: {
    getByWallet: (wallet: string) => apiClient.get(`/smri/${wallet}`),
    getLeaderboard: () => apiClient.get('/smri/leaderboard'),
  },

  // Time messages
  timeMessages: {
    getSent: () => apiClient.get('/time-messages/sent'),
    getReceived: () => apiClient.get('/time-messages/received'),
    send: (data: any) => apiClient.post('/time-messages', data),
  },

  // Reels
  reels: {
    getAll: () => apiClient.get('/reels'),
    create: (data: any) => apiClient.post('/reels', data),
    update: (id: string, data: any) => apiClient.patch(`/reels/${id}`, data),
  },

  // AI services
  ai: {
    translate: (data: any) => apiClient.post('/ai/translate', data),
    summary: (data: any) => apiClient.post('/ai/summary', data),
    analyze: (data: any) => apiClient.post('/ai/analyze', data),
  },

  // NFT operations
  nft: {
    mint: (data: any) => apiClient.post('/nft/mint', data),
    getMetadata: (tokenId: string) => apiClient.get(`/nft/metadata/${tokenId}`),
  },

  // Supabase assets
  supabase: {
    discoverAssets: () => apiClient.get('/supabase/assets/discover'),
    uploadAsset: (file: File, metadata?: any) => 
      apiClient.uploadFile('/supabase/assets/upload', file, metadata),
  },
};

export default apiClient;