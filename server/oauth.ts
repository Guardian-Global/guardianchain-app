import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import type { Express } from 'express';

// OAuth configuration interface
export interface OAuthConfig {
  google?: {
    clientId: string;
    clientSecret: string;
    callbackURL: string;
  };
  github?: {
    clientId: string;
    clientSecret: string;
    callbackURL: string;
  };
}

// User profile from OAuth providers
export interface OAuthProfile {
  id: string;
  provider: 'google' | 'github';
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  username?: string;
}

/**
 * Initialize OAuth strategies for production use
 * This extends the debug authentication system for real-world deployment
 */
export function initializeOAuth(app: Express, config: OAuthConfig) {
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize/deserialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Google OAuth Strategy
  if (config.google?.clientId && config.google?.clientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.google.clientId,
          clientSecret: config.google.clientSecret,
          callbackURL: config.google.callbackURL || '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user: OAuthProfile = {
              id: profile.id,
              provider: 'google',
              email: profile.emails?.[0]?.value || '',
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              avatar: profile.photos?.[0]?.value,
            };
            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );

    // Google OAuth routes
    app.get('/auth/google', 
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    app.get('/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      (req, res) => {
        // Successful authentication, redirect to dashboard
        res.redirect('/dashboard');
      }
    );
  }

  // GitHub OAuth Strategy
  if (config.github?.clientId && config.github?.clientSecret) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: config.github.clientId,
          clientSecret: config.github.clientSecret,
          callbackURL: config.github.callbackURL || '/auth/github/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user: OAuthProfile = {
              id: profile.id,
              provider: 'github',
              email: profile.emails?.[0]?.value || '',
              firstName: profile.displayName?.split(' ')[0],
              lastName: profile.displayName?.split(' ')[1],
              avatar: profile.photos?.[0]?.value,
              username: profile.username,
            };
            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );

    // GitHub OAuth routes
    app.get('/auth/github',
      passport.authenticate('github', { scope: ['user:email'] })
    );

    app.get('/auth/github/callback',
      passport.authenticate('github', { failureRedirect: '/login' }),
      (req, res) => {
        // Successful authentication, redirect to dashboard
        res.redirect('/dashboard');
      }
    );
  }

  // Logout route
  app.get('/auth/logout', (req, res) => {
    req.logout(() => {
      res.redirect('/');
    });
  });

  // OAuth user info endpoint
  app.get('/api/auth/oauth-user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  });
}

/**
 * Middleware to check OAuth authentication
 */
export function requireOAuthAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'OAuth authentication required' });
}

/**
 * Get OAuth configuration from environment variables
 */
export function getOAuthConfig(): OAuthConfig {
  return {
    google: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
    } : undefined,
    github: process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || '/auth/github/callback',
    } : undefined,
  };
}