import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Simple mock authentication for development
export function setupSimpleAuth(app: Express) {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  app.use(session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: true, // Changed to true for development
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
      sameSite: 'lax' // Add sameSite for better compatibility
    },
    name: 'guardianchain.sid' // Custom session name
  }));

  // Mock login endpoint for development
  app.get("/api/login", (req: any, res) => {
    // Create a mock user session
    req.session.user = {
      id: "dev-user-123",
      email: "dev@guardianchain.app", 
      firstName: "Developer",
      lastName: "User",
      tier: "EXPLORER"
    };
    
    // Save the session explicitly
    req.session.save((err: any) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Session save failed' });
      }
      console.log('✓ User session created:', req.session.user);
      res.redirect("/");
    });
  });

  app.get("/api/logout", (req: any, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
}

export const isSimpleAuthenticated: RequestHandler = (req: any, res, next) => {
  console.log('Auth check - Session ID:', req.sessionID);
  console.log('Auth check - Session user:', req.session?.user);
  
  if (req.session?.user) {
    req.user = req.session.user;
    console.log('✓ Authentication successful for user:', req.user.id);
    return next();
  }
  
  console.log('❌ Authentication failed - no session user');
  return res.status(401).json({ message: "Unauthorized" });
};