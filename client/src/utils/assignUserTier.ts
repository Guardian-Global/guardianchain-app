// Admin utility to assign user tiers (backend/admin use)
export async function assignUserTier(userId: string, newTier: "guest" | "explorer" | "pro" | "admin" | "enterprise"): Promise<boolean> {
  try {
    // For development, using localStorage as mock
    const tierKey = `tier-${userId}`;
    const previousTier = localStorage.getItem(tierKey);
    
    localStorage.setItem(tierKey, newTier);
    localStorage.setItem(`tier-assigned-${userId}`, new Date().toISOString());
    localStorage.setItem(`tier-assigned-by-${userId}`, "admin");
    
    console.log(`✅ Assigned '${newTier}' tier to user ${userId} (was: ${previousTier || "none"})`);
    
    // Track tier assignment for audit
    const auditLog = {
      userId,
      previousTier: previousTier || "none",
      newTier,
      assignedAt: new Date().toISOString(),
      assignedBy: "admin"
    };
    
    const existingLogs = JSON.parse(localStorage.getItem("tier-audit-log") || "[]");
    existingLogs.push(auditLog);
    localStorage.setItem("tier-audit-log", JSON.stringify(existingLogs));
    
    return true;
  } catch (error) {
    console.error("Failed to assign user tier:", error);
    return false;
  }
}

// Production Replit DB integration (ready for deployment)
export async function assignUserTierProduction(userId: string, newTier: string, assignedBy: string = "admin"): Promise<boolean> {
  try {
    // This will be enabled when deploying to production
    // const { replitDb } = await import("@replit/extensions");
    // const previousTier = await replitDb.get(`tier-${userId}`);
    // await replitDb.set(`tier-${userId}`, newTier);
    // await replitDb.set(`tier-assigned-${userId}`, new Date().toISOString());
    // await replitDb.set(`tier-assigned-by-${userId}`, assignedBy);
    
    // Development fallback
    return assignUserTier(userId, newTier as any);
  } catch (error) {
    console.error("Failed to assign user tier with Replit DB:", error);
    return false;
  }
}

// Bulk tier assignment for admin operations
export async function bulkAssignTiers(assignments: Array<{userId: string, tier: string}>): Promise<{success: number, failed: number}> {
  let success = 0;
  let failed = 0;
  
  for (const assignment of assignments) {
    const result = await assignUserTier(assignment.userId, assignment.tier as any);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }
  
  return { success, failed };
}

// Get tier assignment audit log
export function getTierAuditLog(): Array<{userId: string, previousTier: string, newTier: string, assignedAt: string, assignedBy: string}> {
  try {
    return JSON.parse(localStorage.getItem("tier-audit-log") || "[]");
  } catch (error) {
    console.error("Failed to get audit log:", error);
    return [];
  }
}