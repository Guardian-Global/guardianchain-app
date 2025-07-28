// Real compliance checking - no mock data
export async function runComplianceCheck() {
  try {
    const response = await fetch("/api/compliance/status");

    if (!response.ok) {
      throw new Error(`Compliance service error: ${response.status}`);
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    throw new Error(
      "Compliance not configured: Connect compliance provider to activate"
    );
  }
}

export async function getComplianceAlerts() {
  try {
    const response = await fetch("/api/compliance/alerts");

    if (!response.ok) {
      throw new Error(`Compliance alerts error: ${response.status}`);
    }

    const data = await response.json();
    return data.alerts || [];
  } catch (error) {
    throw new Error("Compliance alerts unavailable: Service not configured");
  }
}

export async function runRegionalComplianceCheck(region: string) {
  try {
    const response = await fetch("/api/compliance/regional", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ region }),
    });

    if (!response.ok) {
      throw new Error(`Regional compliance error: ${response.status}`);
    }

    const data = await response.json();
    return data.compliance;
  } catch (error) {
    throw new Error("Regional compliance unavailable: Service not configured");
  }
}

// Legacy exports for compatibility
export const getComplianceStatus = runComplianceCheck;

export async function runComplianceAudit() {
  try {
    const response = await fetch("/api/compliance/audit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Compliance audit error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error("Compliance audit unavailable: Service not configured");
  }
}

export async function logComplianceEvent(event: any) {
  try {
    const response = await fetch("/api/compliance/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event }),
    });

    if (!response.ok) {
      throw new Error(`Compliance logging error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error("Compliance logging unavailable: Service not configured");
  }
}
