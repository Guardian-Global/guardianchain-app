import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// In-memory user store for demo (replace with DB in production)
interface DemoUser {
  id: number;
  email: string;
  password: string; // hashed
  name?: string;
  firstName?: string;
  lastName?: string;
  walletAddress?: string;
  profileImageUrl?: string;
  tier?: string;
  createdAt?: string;
  updatedAt?: string;
}
const users: DemoUser[] = [];
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const router = Router();

// Register
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  if (users.find(u => u.email === email)) return res.status(400).json({ error: "User already exists" });
  const hashed = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();
  const user: DemoUser = { id: users.length + 1, email, password: hashed, name, createdAt: now, updatedAt: now };
  users.push(user);
  res.status(201).json({ message: "User registered" });
});

// Login (sets httpOnly cookie + returns token)
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  // Set cookie for legacy fetches using credentials: 'include'
  res.cookie("gc_jwt", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, walletAddress: user.walletAddress } });
});

// Middleware to check JWT
function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) return header.slice(7);
  // Fallback to cookie
  const cookieToken = (req as any).cookies?.gc_jwt;
  return cookieToken || null;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Get current user
router.get("/me", requireAuth, (req: Request, res: Response) => {
  const user = users.find(u => u.id === (req as any).user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    walletAddress: user.walletAddress,
    tier: "EXPLORER",
    onboardingCompleted: true,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});

// Compatibility: /status endpoint
router.get("/status", (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) return res.json({ status: "ok", authenticated: false });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    const user = users.find(u => u.id === decoded.id);
    return res.json({ status: "ok", authenticated: !!user, userId: user?.id });
  } catch {
    return res.json({ status: "ok", authenticated: false });
  }
});

// Compatibility: /user endpoint
router.get("/user", (req: Request, res: Response) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({
      id: user.id,
      email: user.email,
      tier: "EXPLORER",
      onboardingCompleted: true,
      walletAddress: user.walletAddress,
      firstName: user.firstName || user.name?.split(" ")[0] || "",
      lastName: user.lastName || user.name?.split(" ")[1] || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Logout (clear cookie on server side)
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("gc_jwt", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  res.json({ message: "Logged out" });
});

// Update profile (name parts)
router.patch("/profile", requireAuth, (req: Request, res: Response) => {
  const user = users.find(u => u.id === (req as any).user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { firstName, lastName, name } = req.body;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (name) user.name = name;
  user.updatedAt = new Date().toISOString();
  res.json({ message: "Profile updated", user: { id: user.id, email: user.email, name: user.name, firstName: user.firstName, lastName: user.lastName } });
});

// Link wallet
router.post("/link-wallet", requireAuth, (req: Request, res: Response) => {
  const user = users.find(u => u.id === (req as any).user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { walletAddress } = req.body;
  if (!walletAddress) return res.status(400).json({ error: "walletAddress required" });
  user.walletAddress = walletAddress;
  user.updatedAt = new Date().toISOString();
  res.json({ message: "Wallet linked", walletAddress });
});

// Unlink wallet
router.delete("/unlink/:walletAddress", requireAuth, (req: Request, res: Response) => {
  const user = users.find(u => u.id === (req as any).user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.walletAddress !== req.params.walletAddress) return res.status(400).json({ error: "Wallet mismatch" });
  user.walletAddress = undefined;
  user.updatedAt = new Date().toISOString();
  res.json({ message: "Wallet unlinked" });
});

export default router;