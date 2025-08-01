import { Router } from "express";

const router = Router();

// Completely bypass all middleware for demo authentication
router.post("/demo-login", async (req, res) => {
  try {
    console.log("DEMO LOGIN ATTEMPT:", req.body);
    
    const { email, password } = req.body;
    
    // Accept any email/password for demo
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const user = {
      id: `demo-${Date.now()}`,
      email,
      firstName: email.split('@')[0] || "Demo", 
      lastName: "User",
      tier: "EXPLORER",
      role: "USER"
    };

    const token = `demo-token-${Date.now()}`;
    const session = {
      user,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    console.log("DEMO LOGIN SUCCESS:", email);
    
    res.json({
      success: true,
      message: "Demo login successful",
      session
    });

  } catch (error) {
    console.error("Demo login error:", error);
    res.status(500).json({
      success: false,
      message: "Demo login failed"
    });
  }
});

export default router;