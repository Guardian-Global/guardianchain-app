import axios from "axios";

export interface StreamInput {
  uid: string;
  meta: {
    name: string;
    description?: string;
  };
  recording?: {
    mode: "automatic" | "never";
    timeoutSeconds?: number;
    requireSignedURLs?: boolean;
    allowedOrigins?: string[];
  };
}

export interface StreamOutput {
  uid: string;
  rtmps: {
    url: string;
    streamKey: string;
  };
  rtmpsPlayback?: {
    url: string;
  };
  srt?: {
    url: string;
    streamId: string;
  };
  webRTC?: {
    url: string;
  };
  status: {
    current: string;
  };
  meta: {
    name: string;
    description?: string;
  };
  created: string;
  modified: string;
  recording?: {
    mode: string;
    timeoutSeconds: number;
    requireSignedURLs: boolean;
    allowedOrigins: string[];
  };
}

class CloudflareStreamService {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    if (!process.env.CLOUDFLARE_API_TOKEN) {
      throw new Error("CLOUDFLARE_API_TOKEN is required");
    }

    if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
      throw new Error("CLOUDFLARE_ACCOUNT_ID is required");
    }

    this.baseURL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream`;
    this.headers = {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    };
  }

  async createLiveInput(
    streamData: StreamInput,
  ): Promise<{ success: boolean; data?: StreamOutput; error?: string }> {
    try {
      const response = await axios.post(
        `${this.baseURL}/live_inputs`,
        streamData,
        {
          headers: this.headers,
        },
      );

      return {
        success: true,
        data: response.data.result,
      };
    } catch (error: any) {
      console.error(
        "Cloudflare create live input error:",
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.errors?.[0]?.message || error.message,
      };
    }
  }

  async getLiveInput(
    uid: string,
  ): Promise<{ success: boolean; data?: StreamOutput; error?: string }> {
    try {
      const response = await axios.get(`${this.baseURL}/live_inputs/${uid}`, {
        headers: this.headers,
      });

      return {
        success: true,
        data: response.data.result,
      };
    } catch (error: any) {
      console.error(
        "Cloudflare get live input error:",
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.errors?.[0]?.message || error.message,
      };
    }
  }

  async listLiveInputs(): Promise<{
    success: boolean;
    data?: StreamOutput[];
    error?: string;
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/live_inputs`, {
        headers: this.headers,
      });

      return {
        success: true,
        data: response.data.result,
      };
    } catch (error: any) {
      console.error(
        "Cloudflare list live inputs error:",
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.errors?.[0]?.message || error.message,
      };
    }
  }

  async updateLiveInput(
    uid: string,
    updateData: Partial<StreamInput>,
  ): Promise<{ success: boolean; data?: StreamOutput; error?: string }> {
    try {
      const response = await axios.put(
        `${this.baseURL}/live_inputs/${uid}`,
        updateData,
        {
          headers: this.headers,
        },
      );

      return {
        success: true,
        data: response.data.result,
      };
    } catch (error: any) {
      console.error(
        "Cloudflare update live input error:",
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.errors?.[0]?.message || error.message,
      };
    }
  }

  async deleteLiveInput(
    uid: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await axios.delete(`${this.baseURL}/live_inputs/${uid}`, {
        headers: this.headers,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      console.error(
        "Cloudflare delete live input error:",
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.errors?.[0]?.message || error.message,
      };
    }
  }

  async getStreamAnalytics(
    uid: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await axios.get(
        `${this.baseURL}/live_inputs/${uid}/analytics`,
        {
          headers: this.headers,
        },
      );

      return {
        success: true,
        data: response.data.result,
      };
    } catch (error: any) {
      console.error(
        "Cloudflare get stream analytics error:",
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.errors?.[0]?.message || error.message,
      };
    }
  }

  generateStreamKey(): string {
    return `legacy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generatePlaybackURL(uid: string): string {
    return `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${uid}/manifest/video.m3u8`;
  }

  generateThumbnailURL(uid: string, time?: number): string {
    const timeParam = time ? `?time=${time}s` : "";
    return `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${uid}/thumbnails/thumbnail.jpg${timeParam}`;
  }
}

let cloudflareService: CloudflareStreamService | null = null;

try {
  if (process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ACCOUNT_ID) {
    cloudflareService = new CloudflareStreamService();
  }
} catch (error) {
  console.log("Cloudflare Stream service not available:", error);
}

export { cloudflareService };
