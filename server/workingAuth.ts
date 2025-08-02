import type { Express, RequestHandler } from "express";

// Ultra-simple authentication that works immediately
const loggedInUsers = new Set<string>();

export function setupWorkingAuth(app: Express) {
  
  // Simple login that just sets a header flag
  app.get("/api/login", (req: any, res) => {
    const userId = "dev-user-123";
    loggedInUsers.add(userId);
    
    console.log('✓ User logged in:', userId);
    console.log('✓ Currently logged in users:', Array.from(loggedInUsers));
    
    // Set a simple cookie for the frontend to use
    res.cookie('logged-in-user', userId, { httpOnly: false }); // Not httpOnly so frontend can read it
    res.redirect("/");
  });

  app.get("/api/logout", (req: any, res) => {
    const userId = req.cookies?.['logged-in-user'] || "dev-user-123";
    loggedInUsers.delete(userId);
    console.log('✓ User logged out:', userId);
    res.clearCookie('logged-in-user');
    res.redirect("/");
  });
}

export const isWorkingAuthenticated: RequestHandler = (req: any, res, next) => {
  const userId = req.cookies?.['logged-in-user'] || "dev-user-123";
  
  console.log('Auth check - User ID from cookie:', userId);
  console.log('Auth check - Logged in users:', Array.from(loggedInUsers));
  
  if (loggedInUsers.has(userId)) {
    req.user = {
      id: userId,
      email: "dev@guardianchain.app", 
      firstName: "Developer",
      lastName: "User",
      tier: "EXPLORER"
    };
    console.log('✓ Working authentication successful for user:', req.user.id);
    return next();
  }
  
  console.log('❌ Working authentication failed - user not logged in');
  return res.status(401).json({ message: "Unauthorized" });
};