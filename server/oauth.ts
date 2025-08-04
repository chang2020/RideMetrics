import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";
import type { Express } from "express";

export function setupOAuth(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize/deserialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
    const callbackURL = `https://${domain}/api/auth/google/callback`;
    
    console.log("Google OAuth Config:", {
      clientId: process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + "...",
      callbackURL,
      hasSecret: !!process.env.GOOGLE_CLIENT_SECRET
    });
    
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
      scope: ['profile', 'email']
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // Check if user exists
        const existingUser = await storage.getUserByEmail(profile.emails?.[0]?.value || "");
        
        if (existingUser) {
          // Update existing user with Google data
          const updatedUser = await storage.updateUser(existingUser.id, {
            googleId: profile.id,
            provider: "google",
            avatar: profile.photos?.[0]?.value || existingUser.avatar,
            name: profile.displayName || existingUser.name,
          });
          return done(null, updatedUser);
        }

        // Create new user
        const newUser = await storage.createUser({
          email: profile.emails?.[0]?.value || "",
          name: profile.displayName || "",
          username: profile.username || profile.emails?.[0]?.value?.split('@')[0] || "",
          avatar: profile.photos?.[0]?.value || null,
          provider: "google",
          googleId: profile.id,
        });

        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }));
  }

  // OAuth routes
  app.get("/api/auth/google", (req, res, next) => {
    console.log("Google OAuth initiated");
    passport.authenticate("google", { 
      scope: ["profile", "email"],
      prompt: "select_account"
    })(req, res, next);
  });

  app.get("/api/auth/google/callback", (req, res, next) => {
    console.log("Google OAuth callback received:", req.query);
    
    // Check for OAuth errors first
    if (req.query.error) {
      console.error("Google OAuth error:", req.query.error, "Description:", req.query.error_description);
      if (req.query.error === 'access_denied') {
        return res.redirect("/login?error=google_denied");
      }
      return res.redirect("/login?error=google");
    }
    
    passport.authenticate("google", { 
      failureRedirect: "/login?error=google_auth_failed",
      successRedirect: "/dashboard"
    })(req, res, next);
  });

  // Strava OAuth (redirect to existing Strava implementation)
  app.get("/api/auth/strava", (req, res) => {
    console.log("Strava OAuth initiated, redirecting to /api/strava/auth");
    res.redirect("/api/strava/auth");
  });
}