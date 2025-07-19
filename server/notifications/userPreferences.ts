import { sendGuardianEmail } from "../lib/mailer";

export interface NotificationPreferences {
  email: string;
  userId: string;
  preferences: {
    capsuleEvents: boolean;
    memoryUpdates: boolean;
    legacyProtocol: boolean;
    daoGovernance: boolean;
    weeklyDigest: boolean;
    monthlyReport: boolean;
    securityAlerts: boolean;
    yieldUpdates: boolean;
  };
}

// In-memory storage for demo - in production, store in Supabase
const userPreferences: Map<string, NotificationPreferences> = new Map();

export function getUserPreferences(userId: string): NotificationPreferences | null {
  return userPreferences.get(userId) || null;
}

export function updateUserPreferences(userId: string, prefs: Partial<NotificationPreferences['preferences']>): NotificationPreferences {
  const existing = userPreferences.get(userId);
  const updated: NotificationPreferences = {
    email: existing?.email || '',
    userId,
    preferences: {
      ...existing?.preferences,
      ...prefs,
    } as NotificationPreferences['preferences']
  };
  
  userPreferences.set(userId, updated);
  return updated;
}

export function setUserEmail(userId: string, email: string): void {
  const existing = userPreferences.get(userId);
  const updated: NotificationPreferences = {
    email,
    userId,
    preferences: existing?.preferences || {
      capsuleEvents: true,
      memoryUpdates: true,
      legacyProtocol: true,
      daoGovernance: true,
      weeklyDigest: true,
      monthlyReport: true,
      securityAlerts: true,
      yieldUpdates: true,
    }
  };
  
  userPreferences.set(userId, updated);
}

export async function sendPreferencesUpdateConfirmation(userId: string) {
  const prefs = getUserPreferences(userId);
  if (!prefs) return;

  await sendGuardianEmail({
    to: prefs.email,
    subject: "✅ GUARDIANCHAIN Notification Preferences Updated",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7F5AF0 0%, #2CB67D 100%); color: white; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2CB67D;">✅ Preferences Updated</h2>
        <p>Your notification preferences have been successfully updated.</p>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #FFD700; margin-top: 0;">Current Settings</h3>
          <p>📦 Capsule Events: <strong>${prefs.preferences.capsuleEvents ? 'Enabled' : 'Disabled'}</strong></p>
          <p>🧠 Memory Updates: <strong>${prefs.preferences.memoryUpdates ? 'Enabled' : 'Disabled'}</strong></p>
          <p>👁️ Legacy Protocol: <strong>${prefs.preferences.legacyProtocol ? 'Enabled' : 'Disabled'}</strong></p>
          <p>🗳️ DAO Governance: <strong>${prefs.preferences.daoGovernance ? 'Enabled' : 'Disabled'}</strong></p>
          <p>📈 Weekly Digest: <strong>${prefs.preferences.weeklyDigest ? 'Enabled' : 'Disabled'}</strong></p>
          <p>🏆 Monthly Report: <strong>${prefs.preferences.monthlyReport ? 'Enabled' : 'Disabled'}</strong></p>
          <p>🛡️ Security Alerts: <strong>${prefs.preferences.securityAlerts ? 'Enabled' : 'Disabled'}</strong></p>
          <p>💰 Yield Updates: <strong>${prefs.preferences.yieldUpdates ? 'Enabled' : 'Disabled'}</strong></p>
        </div>

        <p>You can update these preferences anytime in your GUARDIANCHAIN profile settings.</p>
        <p style="color: #2CB67D; font-weight: bold;">GUARDIANCHAIN - Digital Sovereignty Secured</p>
      </div>
    `,
  });
}

// Utility function to check if user wants specific notification type
export function shouldSendNotification(userId: string, notificationType: keyof NotificationPreferences['preferences']): boolean {
  const prefs = getUserPreferences(userId);
  return prefs?.preferences[notificationType] ?? true; // Default to true if no preferences set
}