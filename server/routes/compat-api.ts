import { Router } from "express";
import type { Request, Response } from "express";
import fetch from "node-fetch";

const router = Router();

// Proxy to /api/auth-complete/me
router.get("/auth/user", async (req: Request, res: Response) => {
  try {
    // If you use sessions, you can call the handler directly instead of fetch
    const response = await fetch("http://localhost:3000/api/auth-complete/me", {
      headers: req.headers as any
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user info" });
  }
});

// Auth status endpoint
router.get("/auth/status", async (req: Request, res: Response) => {
  try {
    const response = await fetch("http://localhost:3000/api/auth-complete/me", {
      headers: req.headers as any
    });
    if (response.status === 401) return res.json({ authenticated: false });
    res.json({ authenticated: true });
  } catch (err) {
    res.json({ authenticated: false });
  }
});

// Debug user endpoint (returns user or stub)
router.get("/debug/user", async (req: Request, res: Response) => {
  try {
    const response = await fetch("http://localhost:3000/api/auth-complete/me", {
      headers: req.headers as any
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    res.status(200).json({ id: "debug", email: "debug@example.com", debug: true });
  }
});

// Subscription plans stub
router.get("/subscription/plans", (req: Request, res: Response) => {
  res.json({
    plans: [
      { id: "free", name: "Free", price: 0, features: ["Basic access"] },
      { id: "pro", name: "Pro", price: 20, features: ["All features", "Priority support"] }
    ]
  });
});

export default router;
