// Real notification system - no mock data
export async function fetchNotifications() {
  try {
    const response = await fetch("/api/notifications");

    if (!response.ok) {
      throw new Error(`Notifications service error: ${response.status}`);
    }

    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    throw new Error(
      "Notifications not configured: Connect notification provider to activate",
    );
  }
}

export async function markNotificationRead(id: string) {
  try {
    const response = await fetch(`/api/notifications/${id}/read`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Mark read error: ${response.status}`);
    }

    return true;
  } catch (error) {
    throw new Error("Notification update failed: " + (error as Error).message);
  }
}

export async function getSystemAlerts() {
  try {
    const response = await fetch("/api/system/alerts");

    if (!response.ok) {
      throw new Error(`System alerts error: ${response.status}`);
    }

    const data = await response.json();
    return data.alerts || [];
  } catch (error) {
    throw new Error("System alerts unavailable: Service not configured");
  }
}
