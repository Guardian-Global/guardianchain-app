import twilio from "twilio";

// Initialize Twilio client when credentials are available
let twilioClient: twilio.Twilio | null = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );
}

export interface MessageData {
  to: string;
  from: string;
  body: string;
  mediaUrl?: string[];
}

export interface CallData {
  to: string;
  from: string;
  url: string; // TwiML endpoint for call instructions
  record?: boolean;
}

export class TwilioService {
  private client: twilio.Twilio;

  constructor() {
    if (!twilioClient) {
      throw new Error(
        "Twilio client not initialized. Please check your credentials.",
      );
    }
    this.client = twilioClient;
  }

  async sendMessage(messageData: MessageData) {
    try {
      const message = await this.client.messages.create({
        body: messageData.body,
        to: messageData.to,
        from: messageData.from,
        mediaUrl: messageData.mediaUrl,
      });

      return {
        success: true,
        messageId: message.sid,
        status: message.status,
      };
    } catch (error: any) {
      console.error("Twilio send message error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async initiateCall(callData: CallData) {
    try {
      const call = await this.client.calls.create({
        to: callData.to,
        from: callData.from,
        url: callData.url,
        record: callData.record || false,
      });

      return {
        success: true,
        callId: call.sid,
        status: call.status,
      };
    } catch (error: any) {
      console.error("Twilio initiate call error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getCallStatus(callSid: string) {
    try {
      const call = await this.client.calls(callSid).fetch();

      return {
        success: true,
        status: call.status,
        duration: call.duration,
        startTime: call.startTime,
        endTime: call.endTime,
      };
    } catch (error: any) {
      console.error("Twilio get call status error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async generateAccessToken(identity: string) {
    try {
      const { AccessToken } = require("twilio").jwt;
      const { VoiceGrant, VideoGrant } = AccessToken;

      const accessToken = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_API_KEY || process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_API_SECRET || process.env.TWILIO_AUTH_TOKEN!,
        { identity },
      );

      // Grant voice and video permissions
      const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
        incomingAllow: true,
      });

      const videoGrant = new VideoGrant({
        room: "legacy-capsule-room",
      });

      accessToken.addGrant(voiceGrant);
      accessToken.addGrant(videoGrant);

      return {
        success: true,
        token: accessToken.toJwt(),
        identity,
      };
    } catch (error: any) {
      console.error("Twilio generate access token error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const twilioService = twilioClient ? new TwilioService() : null;
