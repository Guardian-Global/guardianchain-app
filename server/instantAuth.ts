import type { Express, RequestHandler } from "express";

// Instant authentication that works without cookies or sessions
export function setupInstantAuth(app: Express) {
  
  // Simple login that just redirects - authentication is automatic
  app.get("/api/login", (req: any, res) => {
    console.log('✓ Login endpoint called - redirecting to dashboard');
    res.redirect("/?logged_in=true");
  });

  app.get("/api/logout", (req: any, res) => {
    console.log('✓ Logout endpoint called');
    res.redirect("/");
  });
}

export const isInstantAuthenticated: RequestHandler = (req: any, res, next) => {
  // For development, always authenticate successfully
  req.user = {
    id: "dev-user-123",
    email: "dev@guardianchain.app", 
    firstName: "Developer",
    lastName: "User",
    tier: "EXPLORER"
  };
  
  console.log('✓ Instant authentication - always successful');
  return next();
};