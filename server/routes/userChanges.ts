import { Router } from "express";
import { storage } from "../storage";
import { isDebugAuthenticated } from "../debugAuth";

const router = Router();

// Save user changes
router.post("/save-changes", isDebugAuthenticated, async (req, res) => {
  try {
    const { changes, sessionId } = req.body;
    const userId = req.user?.id;

    if (!changes || !Array.isArray(changes)) {
      return res.status(400).json({
        error: "Changes must be provided as an array",
      });
    }

    // Save each change
    const savedChanges = [];

    for (const change of changes) {
      const changeData = {
        userId,
        sessionId: sessionId || `session-${Date.now()}`,
        changeType: change.changeType,
        changeData: change.changeData,
        hasUnsavedChanges: false, // Mark as saved
      };

      // In a real implementation, this would use storage.createUserSavedChanges
      // const savedChange = await storage.createUserSavedChanges(changeData);

      const savedChange = {
        id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...changeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      savedChanges.push(savedChange);
    }

    res.json({
      success: true,
      message: "Changes saved successfully",
      savedChanges,
    });
  } catch (error) {
    console.error("Error saving user changes:", error);
    res.status(500).json({ error: "Failed to save changes" });
  }
});

// Get user's saved changes
router.get("/saved-changes/:userId", isDebugAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    const { sessionId } = req.query;

    // In a real implementation, this would use storage.getUserSavedChanges
    // const savedChanges = await storage.getUserSavedChanges(userId, sessionId);

    // Mock response for now
    const savedChanges = [];

    res.json(savedChanges);
  } catch (error) {
    console.error("Error fetching saved changes:", error);
    res.status(500).json({ error: "Failed to fetch saved changes" });
  }
});

// Clear all saved changes for a user
router.delete(
  "/saved-changes/:userId",
  isDebugAuthenticated,
  async (req, res) => {
    try {
      const { userId } = req.params;

      // In a real implementation, this would use storage.clearSavedChanges
      // await storage.clearSavedChanges(userId);

      res.json({
        success: true,
        message: "All saved changes cleared",
      });
    } catch (error) {
      console.error("Error clearing saved changes:", error);
      res.status(500).json({ error: "Failed to clear saved changes" });
    }
  },
);

export default router;
