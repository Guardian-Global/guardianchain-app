import { Request, Response } from 'express';

// Onboarding module completion tracking
interface OnboardingModule {
  id: string;
  title: string;
  completedAt?: Date;
  userId: string;
}

// In-memory storage for demo (replace with database)
const completedModules: Map<string, OnboardingModule[]> = new Map();

// Complete an onboarding module
export async function completeModule(req: Request, res: Response) {
  try {
    const { moduleId } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!moduleId) {
      return res.status(400).json({ error: 'Module ID is required' });
    }

    // Get user's completed modules
    const userModules = completedModules.get(userId) || [];
    
    // Check if already completed
    const existingModule = userModules.find(m => m.id === moduleId);
    if (existingModule) {
      return res.json({ success: true, message: 'Module already completed' });
    }

    // Add new completed module
    const newModule: OnboardingModule = {
      id: moduleId,
      title: getModuleTitle(moduleId),
      completedAt: new Date(),
      userId
    };

    userModules.push(newModule);
    completedModules.set(userId, userModules);

    res.json({ 
      success: true, 
      message: 'Module completed successfully',
      completedModule: newModule
    });
  } catch (error) {
    console.error('Error completing onboarding module:', error);
    res.status(500).json({ error: 'Failed to complete module' });
  }
}

// Get user's onboarding progress
export async function getOnboardingProgress(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userModules = completedModules.get(userId) || [];
    const totalModules = 4; // Total number of onboarding modules
    const completedCount = userModules.length;
    const progressPercentage = (completedCount / totalModules) * 100;

    res.json({
      success: true,
      progress: {
        completedModules: userModules,
        totalModules,
        completedCount,
        progressPercentage,
        isComplete: completedCount === totalModules
      }
    });
  } catch (error) {
    console.error('Error fetching onboarding progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
}

// Helper function to get module titles
function getModuleTitle(moduleId: string): string {
  const titles: Record<string, string> = {
    'sovereignty': 'Digital Sovereignty',
    'revenue': 'Superior Revenue Sharing',
    'verification': 'AI-Powered Truth Verification',
    'community': 'DAO Governance & Community'
  };
  
  return titles[moduleId] || 'Unknown Module';
}

// Reset onboarding progress (for testing)
export async function resetOnboardingProgress(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    completedModules.delete(userId);

    res.json({ 
      success: true, 
      message: 'Onboarding progress reset successfully' 
    });
  } catch (error) {
    console.error('Error resetting onboarding progress:', error);
    res.status(500).json({ error: 'Failed to reset progress' });
  }
}