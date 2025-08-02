import type { Express, RequestHandler } from "express";

// Ultra-simple debug authentication that logs everything
export function setupDebugAuth(app: Express) {
  app.get("/api/login", (req: any, res) => {
    console.log("🔵 DEBUG: /api/login endpoint called");
    res.redirect("/#logged-in");
  });

  app.get("/api/logout", (req: any, res) => {
    console.log("🔵 DEBUG: /api/logout endpoint called");
    res.redirect("/");
  });
}

export const isDebugAuthenticated: RequestHandler = (req: any, res, next) => {
  console.log("🔵 DEBUG: isDebugAuthenticated middleware called");
  console.log("🔵 DEBUG: Request path:", req.path);
  console.log("🔵 DEBUG: Request method:", req.method);

  // Always authenticate for debugging
  req.user = {
    id: "debug-user-456",
    email: "debug@guardianchain.app",
    firstName: "Debug",
    lastName: "User",
    tier: "EXPLORER",
  };

  console.log("🔵 DEBUG: User set:", req.user);
  console.log(
    "✅ DEBUG: Authentication successful - continuing to next middleware",
  );
  return next();
};
