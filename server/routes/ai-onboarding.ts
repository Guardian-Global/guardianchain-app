import { Router } from "express";
import { consolidatedAuth } from "../auth/authConsolidation";

const router = Router();

// AI Onboarding suggestions endpoint
router.post("/onboarding-suggestions", consolidatedAuth, async (req, res) => {
  try {
    const { step, userInput, context } = req.body;

    let suggestions: any[] = [];

    switch (step) {
      case "personal-info":
        suggestions = [
          {
            field: "username",
            value: userInput.firstName?.toLowerCase() + (userInput.lastName?.charAt(0)?.toLowerCase() || ""),
            text: "Suggested username based on your name"
          },
          {
            field: "timezone",
            value: "EST",
            text: "Most common timezone for our users"
          }
        ];
        break;

      case "contact-info":
        if (userInput.company?.toLowerCase().includes("guardian")) {
          suggestions.push({
            field: "jobTitle",
            value: "Blockchain Developer",
            text: "Suggested role for GUARDIANCHAIN team members"
          });
        }
        if (!userInput.industry) {
          suggestions.push({
            field: "industry",
            value: "blockchain",
            text: "Most relevant for truth verification platform"
          });
        }
        break;

      case "about":
        if (!userInput.bio || userInput.bio.length < 50) {
          suggestions.push({
            field: "bio",
            value: `Passionate about truth verification and digital sovereignty. Excited to join GUARDIANCHAIN's mission to create an immutable truth ecosystem powered by blockchain technology.`,
            text: "Professional bio template for GUARDIANCHAIN"
          });
        }
        if (!userInput.interests) {
          suggestions.push({
            field: "interests",
            value: "Blockchain Technology, Truth Verification, Digital Sovereignty, Web3, Decentralized Systems",
            text: "Relevant interests for platform users"
          });
        }
        break;

      case "social-links":
        if (userInput.linkedin && !userInput.twitter) {
          suggestions.push({
            text: "Consider adding Twitter for broader reach in crypto community"
          });
        }
        if (userInput.github) {
          suggestions.push({
            text: "Great! GitHub shows your technical credibility"
          });
        }
        break;

      case "media":
        suggestions = [
          {
            text: "Professional headshot increases profile trust by 40%"
          },
          {
            text: "30-second introduction video builds stronger connections"
          },
          {
            text: "Ensure good lighting and clear audio for videos"
          }
        ];
        break;

      default:
        suggestions = [
          {
            text: "Complete all steps for maximum platform benefits"
          }
        ];
    }

    res.json({
      success: true,
      suggestions,
      step,
      context: "GUARDIANCHAIN AI Assistant"
    });

  } catch (error) {
    console.error("AI suggestions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate suggestions"
    });
  }
});

// Profile completion check
router.get("/completion-status", authenticateToken, async (req, res) => {
  try {
    // This would check profile completeness and return recommendations
    const completionScore = 75; // Calculate based on filled fields
    const recommendations = [
      "Add a professional bio to increase trust",
      "Upload a profile picture for better recognition",
      "Connect social accounts for credibility"
    ];

    res.json({
      success: true,
      completionScore,
      recommendations,
      nextSteps: [
        "Complete onboarding process",
        "Create your first truth capsule",
        "Verify other users' content"
      ]
    });

  } catch (error) {
    console.error("Completion status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get completion status"
    });
  }
});

export default router;