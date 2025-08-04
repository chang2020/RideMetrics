import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as StravaStrategy } from "passport-strava-oauth2";
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
      done(error, null);
    }
  });

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
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
        done(error, null);
      }
    }));
  }

  // Strava OAuth Strategy
  if (process.env.STRAVA_CLIENT_ID && process.env.STRAVA_CLIENT_SECRET) {
    passport.use(new StravaStrategy({
      clientID: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      callbackURL: "/api/auth/strava/callback",
      scope: ['read', 'activity:read_all']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists by Strava ID
        const existingUser = await storage.getUserByStravaId(profile.id);
        
        if (existingUser) {
          // Update existing user with fresh tokens
          const updatedUser = await storage.updateUser(existingUser.id, {
            stravaAccessToken: accessToken,
            stravaRefreshToken: refreshToken,
            stravaTokenExpiry: profile.expires_at,
            avatar: profile.profile || existingUser.avatar,
          });
          return done(null, updatedUser);
        }

        // Create new user from Strava
        const newUser = await storage.createUser({
          email: profile.email || `${profile.username}@strava.local`,
          name: `${profile.firstname} ${profile.lastname}`.trim() || profile.username,
          username: profile.username,
          avatar: profile.profile || null,
          provider: "strava",
          stravaId: profile.id,
          stravaAccessToken: accessToken,
          stravaRefreshToken: refreshToken,
          stravaTokenExpiry: profile.expires_at,
        });

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }));
  }

  // OAuth routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login?error=google" }),
    (req, res) => {
      // Store user in session
      if (req.user) {
        req.session.userId = (req.user as any).id;
      }
      res.redirect("/dashboard");
    }
  );

  app.get("/api/auth/strava",
    passport.authenticate("strava", { scope: ["read", "activity:read_all"] })
  );

  app.get("/api/auth/strava/callback",
    passport.authenticate("strava", { failureRedirect: "/login?error=strava" }),
    (req, res) => {
      // Store user in session
      if (req.user) {
        req.session.userId = (req.user as any).id;
      }
      res.redirect("/dashboard");
    }
  );
}