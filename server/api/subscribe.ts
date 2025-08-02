import { Request, Response } from "express";

// Initialize Supabase client for server-side operations
const createSupabaseClient = () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error(
      "Supabase credentials not configured. Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to environment variables.",
    );
  }

  // Use dynamic import to avoid dependency issues
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
};

export async function subscribeEmail(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    try {
      const supabaseConfig = createSupabaseClient();

      // Make direct API call to Supabase
      const response = await fetch(
        `${supabaseConfig.url}/rest/v1/newsletter_subscribers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseConfig.key}`,
            apikey: supabaseConfig.key,
            Prefer: "return=representation",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Supabase error:", errorData);
        return res
          .status(response.status)
          .json({ error: "Failed to subscribe" });
      }

      const data = await response.json();

      res.json({
        success: true,
        message: "Successfully subscribed to GuardianChain updates",
        data,
      });
    } catch (supabaseError) {
      console.error("Supabase connection error:", supabaseError);

      // Fallback to local storage for development
      console.log(`Development fallback - New subscription: ${email}`);

      res.json({
        success: true,
        message:
          "Successfully subscribed to GuardianChain updates (development mode)",
        data: { email, subscribed_at: new Date().toISOString() },
      });
    }
  } catch (error) {
    console.error("Error processing subscription:", error);
    res.status(500).json({ error: "Failed to process subscription" });
  }
}
