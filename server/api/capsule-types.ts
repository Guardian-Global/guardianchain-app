import type { Request, Response } from "express";
import { CAPSULE_TYPE_CONFIGS } from "../../client/src/types/capsule";

export async function getCapsuleTypes(req: Request, res: Response) {
  try {
    res.json({
      types: Object.values(CAPSULE_TYPE_CONFIGS),
      count: Object.keys(CAPSULE_TYPE_CONFIGS).length
    });
  } catch (error) {
    console.error("Error fetching capsule types:", error);
    res.status(500).json({ 
      error: "Failed to fetch capsule types",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export async function validateCapsuleType(req: Request, res: Response) {
  try {
    const { type, data } = req.body;

    if (!type || !CAPSULE_TYPE_CONFIGS[type]) {
      return res.status(400).json({
        error: "Invalid capsule type",
        validTypes: Object.keys(CAPSULE_TYPE_CONFIGS)
      });
    }

    const config = CAPSULE_TYPE_CONFIGS[type];
    const validation = {
      isValid: true,
      errors: [] as string[],
      warnings: [] as string[],
      totalCost: config.baseFee + config.premiumFee
    };

    // Check required fields
    if (config.requiredFields) {
      for (const field of config.requiredFields) {
        if (!data.metadata || !data.metadata[field]) {
          validation.isValid = false;
          validation.errors.push(`Required field missing: ${field}`);
        }
      }
    }

    // Type-specific validations
    switch (type) {
      case 'LEGAL':
        if (!data.metadata?.legalFramework) {
          validation.warnings.push("Legal framework not specified");
        }
        break;
      case 'FINANCIAL':
        if (!data.metadata?.auditStandard) {
          validation.warnings.push("Audit standard not specified");
        }
        break;
      case 'CIVIC':
        if (!data.metadata?.publicInterest) {
          validation.warnings.push("Public interest justification recommended");
        }
        break;
    }

    res.json(validation);

  } catch (error) {
    console.error("Error validating capsule type:", error);
    res.status(500).json({ 
      error: "Validation failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}