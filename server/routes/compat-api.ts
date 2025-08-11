import { Router } from "express";
import type { Request, Response } from "express";
import fetch from "node-fetch";

const router = Router();


// Return static user info
router.get("/auth/user", (req: Request, res: Response) => {
  res.json({
    id: "user123",
    email: "user@example.com",
    name: "Demo User",
    role: "user",
    onboarded: true
  });
});

// Return static auth status
router.get("/auth/status", (req: Request, res: Response) => {
  res.json({ authenticated: true });
});

// Return static debug user
router.get("/debug/user", (req: Request, res: Response) => {
  res.json({
    id: "debug",
    email: "debug@example.com",
    debug: true,
    name: "Debug User"
  });
});

// Return static subscription plans
router.get("/subscription/plans", (req: Request, res: Response) => {
  res.json({
    plans: [
      { id: "free", name: "Free", price: 0, features: ["Basic access"] },
      { id: "pro", name: "Pro", price: 20, features: ["All features", "Priority support"] }
    ]
  });
});

export default router;
