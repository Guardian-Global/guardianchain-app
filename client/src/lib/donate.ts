// Mock Supabase client for development
const mockSupabaseClient = {
  from: (table: string) => ({
    insert: (data: any) => ({
      then: (callback: (result: any) => void) => {
        console.log(`Donation logged to ${table}:`, data);
        callback({ data, error: null });
      },
    }),
    select: (columns: string) => ({
      order: (column: string, options: any) => ({
        limit: (count: number) => ({
          then: (callback: (result: any) => void) => {
            const mockDonations = [
              {
                id: 1,
                amount: 5,
                recipient: "trauma.survivor@example.com",
                donorId: "user-123",
                purpose: "Trauma survivor support",
                timestamp: new Date().toISOString(),
                status: "completed",
              },
              {
                id: 2,
                amount: 10,
                recipient: "whistleblower.protection@ngo.org",
                donorId: "user-456",
                purpose: "Whistleblower protection",
                timestamp: new Date().toISOString(),
                status: "completed",
              },
            ];
            callback({ data: mockDonations, error: null });
          },
        }),
      }),
    }),
  }),
};

export interface DonationRequest {
  amount: number;
  recipient: string;
  donorId?: string;
  purpose?: string;
  recipientType?: "individual" | "organization" | "dao" | "charity";
}

export interface Donation {
  id: number;
  amount: number;
  recipient: string;
  donorId: string;
  purpose: string;
  recipientType: string;
  timestamp: string;
  status: "pending" | "completed" | "failed";
  txHash?: string;
}

export async function donateCapsuleCredits(
  donation: DonationRequest
): Promise<void> {
  try {
    const donationRecord = {
      ...donation,
      timestamp: new Date().toISOString(),
      status: "completed",
      recipientType: donation.recipientType || "individual",
    };

    return new Promise((resolve, reject) => {
      mockSupabaseClient
        .from("donations")
        .insert([donationRecord])
        .then((result: any) => {
          if (result.error) {
            reject(new Error("Failed to process donation"));
          } else {
            resolve();
          }
        });
    });
  } catch (error) {
    console.error("Donation processing error:", error);
    throw error;
  }
}

export async function getDonationHistory(
  limit: number = 10
): Promise<Donation[]> {
  try {
    return new Promise((resolve) => {
      mockSupabaseClient
        .from("donations")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(limit)
        .then((result: any) => {
          resolve(result.data || []);
        });
    });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    throw error;
  }
}

export async function donateToTraumaSurvivor(
  amount: number,
  survivorEmail: string,
  donorId: string
) {
  return donateCapsuleCredits({
    amount,
    recipient: survivorEmail,
    donorId,
    purpose: "Trauma survivor support - providing voice to the voiceless",
    recipientType: "individual",
  });
}

export async function donateToNonprofit(
  amount: number,
  organizationEmail: string,
  donorId: string,
  cause: string
) {
  return donateCapsuleCredits({
    amount,
    recipient: organizationEmail,
    donorId,
    purpose: `Nonprofit support - ${cause}`,
    recipientType: "organization",
  });
}

export async function donateToPublicTruth(
  amount: number,
  donorId: string,
  campaign: string
) {
  return donateCapsuleCredits({
    amount,
    recipient: "public.truth.pool@guardianchain.org",
    donorId,
    purpose: `Public truth initiative - ${campaign}`,
    recipientType: "dao",
  });
}

export async function donateToCharity(
  amount: number,
  charityAddress: string,
  donorId: string,
  charityName: string
) {
  return donateCapsuleCredits({
    amount,
    recipient: charityAddress,
    donorId,
    purpose: `Charitable donation - ${charityName}`,
    recipientType: "charity",
  });
}

export interface DonationStats {
  totalDonations: number;
  totalAmount: number;
  traumaSurvivorSupport: number;
  nonprofitSupport: number;
  publicTruthFunding: number;
  charityDonations: number;
  topDonors: Array<{
    donorId: string;
    totalDonated: number;
    donationCount: number;
  }>;
}

export async function getDonationStats(): Promise<DonationStats> {
  // Mock donation statistics
  return {
    totalDonations: 247,
    totalAmount: 3420,
    traumaSurvivorSupport: 1890,
    nonprofitSupport: 856,
    publicTruthFunding: 432,
    charityDonations: 242,
    topDonors: [
      { donorId: "user-123", totalDonated: 156, donationCount: 12 },
      { donorId: "user-456", totalDonated: 89, donationCount: 8 },
      { donorId: "user-789", totalDonated: 67, donationCount: 15 },
    ],
  };
}

export function validateDonation(donation: DonationRequest): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!donation.amount || donation.amount <= 0) {
    errors.push("Donation amount must be greater than 0");
  }

  if (!donation.recipient || donation.recipient.trim() === "") {
    errors.push("Recipient is required");
  }

  if (donation.amount > 100) {
    errors.push("Single donation cannot exceed 100 capsule credits");
  }

  // Email validation for individual recipients
  if (
    donation.recipientType === "individual" &&
    donation.recipient.includes("@")
  ) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(donation.recipient)) {
      errors.push("Invalid email address format");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function calculateDonationImpact(
  amount: number,
  recipientType: string
): string {
  switch (recipientType) {
    case "individual":
      return `Enables ${amount} truth capsules for trauma survivors to share their stories safely`;
    case "organization":
      return `Provides ${amount} verification credits for nonprofit investigations and advocacy`;
    case "dao":
      return `Contributes ${amount} capsules to public truth initiatives and community oversight`;
    case "charity":
      return `Supports ${amount} charitable documentation and transparency efforts`;
    default:
      return `Provides ${amount} capsule credits for truth preservation and verification`;
  }
}
