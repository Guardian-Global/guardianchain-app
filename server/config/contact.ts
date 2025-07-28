export const contactConfig = {
  // Master admin contact (from ProtonMail setup)
  masterAdmin: {
    email: "commander.guardian@protonmail.com",
    name: "GUARDIANCHAIN Master Admin",
    role: "Founder & Security Administrator",
  },

  // Business contact addresses
  business: {
    general: "contact@guardianchain.app",
    support: "support@guardianchain.app",
    security: "security@guardianchain.app",
    compliance: "compliance@guardianchain.app",
    legal: "legal@guardianchain.app",
    partnerships: "partnerships@guardianchain.app",
  },

  // Resend configuration with GUARDIANCHAIN branding
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    domain: "guardianchain.app",
    fromEmail: "noreply@guardianchain.app",
    replyTo: "commander.guardian@protonmail.com",
    branding: {
      logoUrl: "https://guardianchain.app/logo.png",
      primaryColor: "#8B5CF6", // Purple
      secondaryColor: "#10B981", // Green
      brandName: "GUARDIANCHAIN",
      tagline: "Immutable Truth Verification",
    },
  },

  // Emergency contact protocols
  emergency: {
    contacts: [
      {
        name: "Master Admin",
        email: "commander.guardian@protonmail.com",
        phone: "+1-XXX-XXX-XXXX", // To be configured
        priority: 1,
      },
    ],
    escalationTimeMinutes: 30,
    maxRetries: 3,
  },

  // Legal and compliance contacts
  legal: {
    lawyer: {
      name: "Corporate Legal Counsel",
      email: "legal@guardianchain.app",
      firm: "To be determined",
    },
    accountant: {
      name: "CPA Firm",
      email: "accounting@guardianchain.app",
      firm: "To be determined",
    },
    compliance: {
      name: "Compliance Officer",
      email: "compliance@guardianchain.app",
    },
  },

  // Technical support hierarchy
  technical: {
    level1: "support@guardianchain.app",
    level2: "technical@guardianchain.app",
    level3: "commander.guardian@protonmail.com",
  },
};

// SMTP configuration for ProtonMail Bridge
export const smtpConfig = {
  host: "smtp.protonmail.ch",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "commander.guardian@protonmail.com",
    pass: process.env.PROTONMAIL_APP_PASSWORD, // App-specific password
  },
  tls: {
    rejectUnauthorized: false,
  },
};
