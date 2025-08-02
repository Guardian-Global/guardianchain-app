import type { Express, RequestHandler } from "express";

// In-memory session storage for immediate testing
const sessions = new Map<string, any>();
let sessionCounter = 0;

// Simple memory-based authentication for immediate testing
export function setupMemoryAuth(app: Express) {
  
  // Mock login endpoint that creates a session in memory
  app.get("/api/login", (req: any, res) => {
    const sessionId = `session-${++sessionCounter}`;
    const user = {
      id: "dev-user-123",
      email: "dev@guardianchain.app", 
      firstName: "Developer",
      lastName: "User",
      tier: "EXPLORER"
    };
    
    // Store session in memory
    sessions.set(sessionId, { user });
    
    console.log('✓ Memory session created:', sessionId, user);
    
    // Set cookie and redirect
    res.cookie('auth-session', sessionId, { 
      httpOnly: true, 
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    res.redirect("/");
  });

  app.get("/api/logout", (req: any, res) => {
    const sessionId = req.cookies?.['auth-session'];
    if (sessionId) {
      sessions.delete(sessionId);
      console.log('✓ Session deleted:', sessionId);
    }
    res.clearCookie('auth-session');
    res.redirect("/");
  });
}

export const isMemoryAuthenticated: RequestHandler = (req: any, res, next) => {
  const sessionId = req.cookies?.['auth-session'];
  console.log('Auth check - Session ID:', sessionId);
  
  if (sessionId && sessions.has(sessionId)) {
    const sessionData = sessions.get(sessionId);
    req.user = sessionData.user;
    console.log('✓ Memory authentication successful for user:', req.user.id);
    return next();
  }
  
  console.log('❌ Memory authentication failed - no valid session');
  return res.status(401).json({ message: "Unauthorized" });
};