
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// In-memory user store for demo (replace with DB in production)
const users: any[] = [];
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const router = Router();

// Register
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  if (users.find(u => u.email === email)) return res.status(400).json({ error: "User already exists" });
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, password: hashed, name };
  users.push(user);
  res.status(201).json({ message: "User registered" });
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Middleware to check JWT
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
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
  res.json({ id: user.id, email: user.email, name: user.name });
});

export default router;