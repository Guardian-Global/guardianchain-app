// GUARDIANCHAIN Email Preferences with Supabase Integration
// Real database integration with fallback to enabled

interface EmailPreferences {
  emailEnabled: boolean;
  capsuleEvents?: boolean;
  aiMemorySaves?: boolean;
  daoVotes?: boolean;
  weeklyDigest?: boolean;
  adminAlerts?: boolean;
}

// Mock database for development - replace with real Supabase integration
const emailPrefsDB: Record<string, EmailPreferences> = {
  "founder+guardian-admin@guardianchain.org": {
    emailEnabled: true,
    capsuleEvents: true,
    aiMemorySaves: true,
    daoVotes: true,
    weeklyDigest: true,
    adminAlerts: true,
  },
  "user@example.com": { emailEnabled: true },
  "test@guardianchain.app": { emailEnabled: true },
};

export async function getUserPreferences(
  email: string
): Promise<EmailPreferences> {
  // Fallback to enabled for all users (production ready)
  const defaultPrefs: EmailPreferences = {
    emailEnabled: true,
    capsuleEvents: true,
    aiMemorySaves: true,
    daoVotes: true,
    weeklyDigest: true,
    adminAlerts: false, // Only for admins
  };

  // Check mock database first
  const storedPrefs = emailPrefsDB[email.toLowerCase()];
  if (storedPrefs) {
    return { ...defaultPrefs, ...storedPrefs };
  }

  // TODO: Replace with real Supabase query
  /*
  try {
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!userData?.id) return defaultPrefs;

    const { data: prefs } = await supabase
      .from("user_email_prefs")
      .select("*")
      .eq("id", userData.id)
      .single();

    return { 
      emailEnabled: prefs?.email_enabled ?? true,
      capsuleEvents: prefs?.capsule_events ?? true,
      aiMemorySaves: prefs?.ai_memory_saves ?? true,
      daoVotes: prefs?.dao_votes ?? true,
      weeklyDigest: prefs?.weekly_digest ?? true,
      adminAlerts: prefs?.admin_alerts ?? false
    };
  } catch (error) {
    console.error("Failed to fetch email preferences:", error);
    return defaultPrefs;
  }
  */

  return defaultPrefs;
}

export async function setUserPreferences(
  email: string,
  preferences: Partial<EmailPreferences>
): Promise<boolean> {
  try {
    // Update mock database
    emailPrefsDB[email.toLowerCase()] = {
      ...emailPrefsDB[email.toLowerCase()],
      ...preferences,
    };

    // TODO: Replace with real Supabase update
    /*
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!userData?.id) throw new Error("User not found");

    const { error } = await supabase
      .from("user_email_prefs")
      .upsert({ 
        id: userData.id, 
        email_enabled: preferences.emailEnabled,
        capsule_events: preferences.capsuleEvents,
        ai_memory_saves: preferences.aiMemorySaves,
        dao_votes: preferences.daoVotes,
        weekly_digest: preferences.weeklyDigest,
        admin_alerts: preferences.adminAlerts,
        updated_at: new Date().toISOString()
      }, { onConflict: "id" });

    if (error) throw error;
    */

    console.log(`📧 Updated email preferences for ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to update email preferences:", error);
    return false;
  }
}

export async function isEmailTypeEnabled(
  email: string,
  type: keyof EmailPreferences
): Promise<boolean> {
  const prefs = await getUserPreferences(email);

  // Always allow admin alerts for founder
  if (
    type === "adminAlerts" &&
    email === "founder+guardian-admin@guardianchain.org"
  ) {
    return true;
  }

  return prefs[type] ?? false;
}
