import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGroupSchema, insertActivitySchema, insertGroupActivitySchema } from "@shared/schema";
import { stravaAPI } from "./strava-api";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (mock for now)
  app.get("/api/user", async (req, res) => {
    try {
      const users = await storage.getUsers();
      const user = users[0]; // Get first user as demo user
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user groups
  app.get("/api/groups", async (req, res) => {
    try {
      const users = await storage.getUsers();
      const user = users[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const groups = await storage.getGroupsByUserId(user.id);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create group
  app.post("/api/groups", async (req, res) => {
    try {
      const users = await storage.getUsers();
      const user = users[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const groupData = insertGroupSchema.parse({
        ...req.body,
        ownerId: user.id,
      });
      
      const group = await storage.createGroup(groupData);
      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ message: "Invalid group data" });
    }
  });

  // Get group details
  app.get("/api/groups/:id", async (req, res) => {
    try {
      const group = await storage.getGroup(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get group members
  app.get("/api/groups/:id/members", async (req, res) => {
    try {
      const members = await storage.getGroupMembers(req.params.id);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get group activities (feed)
  app.get("/api/groups/:id/activities", async (req, res) => {
    try {
      const activities = await storage.getGroupActivities(req.params.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user activities
  app.get("/api/activities", async (req, res) => {
    try {
      const users = await storage.getUsers();
      const user = users[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const activities = await storage.getActivitiesByUserId(user.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create activity
  app.post("/api/activities", async (req, res) => {
    try {
      const users = await storage.getUsers();
      const user = users[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const activityData = insertActivitySchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const activity = await storage.createActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  // Get user statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const users = await storage.getUsers();
      const user = users[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const activities = await storage.getActivitiesByUserId(user.id);
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const weeklyActivities = activities.filter(a => a.startTime >= oneWeekAgo);
      const monthlyActivities = activities.filter(a => a.startTime >= oneMonthAgo);

      const weeklyDistance = weeklyActivities.reduce((sum, a) => sum + a.distance, 0) / 1000; // Convert to km
      const avgSpeed = weeklyActivities.length > 0 
        ? weeklyActivities.reduce((sum, a) => sum + a.averageSpeed, 0) / weeklyActivities.length / 10 // Convert from km/h * 10
        : 0;
      const totalElevation = weeklyActivities.reduce((sum, a) => sum + (a.elevationGain || 0), 0);

      // Generate weekly data for chart
      const weeklyData = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        const weekActivities = activities.filter(a => a.startTime >= weekStart && a.startTime < weekEnd);
        const distance = weekActivities.reduce((sum, a) => sum + a.distance, 0) / 1000;
        const speed = weekActivities.length > 0 
          ? weekActivities.reduce((sum, a) => sum + a.averageSpeed, 0) / weekActivities.length / 10
          : 0;
        
        weeklyData.push({
          week: `${i + 1}주차`,
          distance: Math.round(distance * 10) / 10,
          speed: Math.round(speed * 10) / 10,
        });
      }

      res.json({
        weeklyDistance: Math.round(weeklyDistance * 10) / 10,
        avgSpeed: Math.round(avgSpeed * 10) / 10,
        elevation: totalElevation,
        weeklyData,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Start Strava OAuth flow
  app.get("/api/strava/auth", async (req, res) => {
    try {
      const authUrl = stravaAPI.getAuthorizationUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error("Strava auth error:", error);
      res.status(500).json({ message: "Failed to generate auth URL" });
    }
  });

  // Handle Strava OAuth callback
  app.get("/api/strava/callback", async (req, res) => {
    try {
      const { code } = req.query;
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ message: "Missing authorization code" });
      }

      // Exchange code for tokens
      const tokens = await stravaAPI.exchangeCodeForTokens(code);
      
      // Get athlete info
      const athlete = await stravaAPI.getAthlete(tokens.access_token);

      // Update user with Strava data
      const users = await storage.getUsers();
      const user = users[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await storage.updateUser(user.id, {
        stravaConnected: true,
        stravaId: athlete.id,
        stravaAccessToken: tokens.access_token,
        stravaRefreshToken: tokens.refresh_token,
        stravaTokenExpiry: tokens.expires_at,
        name: `${athlete.firstname} ${athlete.lastname}`,
        avatar: athlete.profile
      });

      // Redirect to dashboard
      res.redirect('/?strava=connected');
    } catch (error) {
      console.error("Strava callback error:", error);
      res.redirect('/?strava=error');
    }
  });

  // Manual Strava connect
  app.post("/api/strava/connect", async (req, res) => {
    try {
      const authUrl = stravaAPI.getAuthorizationUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error("Strava connect error:", error);
      res.status(500).json({ message: "Failed to initiate Strava connection" });
    }
  });

  // Sync activities from Strava
  app.post("/api/strava/sync", async (req, res) => {
    try {
      const users = await storage.getUsers();
      const user = users[0];
      if (!user || !user.stravaConnected || !user.stravaAccessToken) {
        return res.status(400).json({ message: "Strava not connected" });
      }

      // Get activities from Strava
      const stravaActivities = await stravaAPI.getActivities(user.stravaAccessToken);
      
      // Convert and store activities
      const activities = stravaActivities
        .filter(activity => activity.type === 'Ride') // Only cycling activities
        .map(activity => ({
          userId: user.id,
          title: activity.name,
          distance: Math.round(activity.distance), // meters
          duration: activity.moving_time, // seconds
          elevationGain: Math.round(activity.total_elevation_gain || 0), // meters
          averageSpeed: Math.round(activity.average_speed * 36), // m/s to km/h * 10
          maxSpeed: Math.round((activity.max_speed || 0) * 36), // m/s to km/h * 10
          activityType: "ride",
          startTime: new Date(activity.start_date)
        }));

      // Store activities
      for (const activity of activities) {
        await storage.createActivity(activity);
      }

      res.json({ 
        message: "Activities synced successfully", 
        count: activities.length 
      });
    } catch (error) {
      console.error("Strava sync error:", error);
      res.status(500).json({ message: "Failed to sync activities" });
    }
  });

  // Logout endpoint
  app.post("/api/logout", async (req, res) => {
    try {
      // In a real app, this would clear session/token
      // For now, we'll just return success
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
