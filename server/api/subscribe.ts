import { Request, Response } from "express";

export async function subscribeEmail(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Mock subscription logic - in production this would connect to an email service
    console.log(`New subscription: ${email}`);
    
    // Here you would typically:
    // 1. Validate email format more thoroughly
    // 2. Check if email already exists in database
    // 3. Add to email service (e.g., Mailchimp, SendGrid, etc.)
    // 4. Send welcome email
    // 5. Store subscription in database with timestamp

    // Mock storage for now
    const subscription = {
      email,
      subscribedAt: new Date().toISOString(),
      status: "active",
      source: "homepage"
    };

    res.json({ 
      success: true, 
      message: "Successfully subscribed to GuardianChain updates",
      subscription 
    });
  } catch (error) {
    console.error("Error processing subscription:", error);
    res.status(500).json({ error: "Failed to process subscription" });
  }
}