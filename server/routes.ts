import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameProfileSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Game profile routes
  app.post("/api/game/profile", async (req, res) => {
    try {
      const profileData = insertGameProfileSchema.parse(req.body);
      const profile = await storage.createGameProfile(profileData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  app.get("/api/game/profile/:userId", async (req, res) => {
    try {
      const profile = await storage.getGameProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/game/profile/:userId", async (req, res) => {
    try {
      const updates = req.body;
      const profile = await storage.updateGameProfile(req.params.userId, updates);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Jobs routes
  app.get("/api/game/jobs", async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/game/jobs/:category", async (req, res) => {
    try {
      const jobs = await storage.getJobsByCategory(req.params.category);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Shop routes
  app.get("/api/game/shop", async (req, res) => {
    try {
      const items = await storage.getShopItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/game/shop/:category", async (req, res) => {
    try {
      const items = await storage.getShopItemsByCategory(req.params.category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Work job endpoint
  app.post("/api/game/work", async (req, res) => {
    try {
      const { userId, jobId } = req.body;
      const profile = await storage.getGameProfile(userId);
      const jobs = await storage.getJobs();
      const job = jobs.find(j => j.id === jobId);
      
      if (!profile || !job) {
        return res.status(404).json({ message: "Profile or job not found" });
      }

      if (profile.energy < job.energyCost) {
        return res.status(400).json({ message: "Not enough energy" });
      }

      if (profile.fame < (job.requiredFame || 0)) {
        return res.status(400).json({ message: "Not enough fame" });
      }

      const updatedProfile = await storage.updateGameProfile(userId, {
        money: profile.money + job.moneyReward,
        energy: profile.energy - job.energyCost + (job.energyReward || 0),
        fame: profile.fame + (job.fameReward || 0),
        netWorth: profile.netWorth + job.moneyReward,
      });

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Create track endpoint
  app.post("/api/game/track", async (req, res) => {
    try {
      const { userId, title, beat } = req.body;
      const profile = await storage.getGameProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      if (profile.energy < 20) {
        return res.status(400).json({ message: "Not enough energy" });
      }

      const trackQuality = Math.floor(Math.random() * 50) + 25 + 
        (profile.skills as any).rapping * 2 + 
        (profile.skills as any).production * 2;

      const newTrack = {
        id: `track-${Date.now()}`,
        title,
        beat,
        quality: trackQuality,
        isReleased: false,
      };

      const tracks = Array.isArray(profile.tracks) ? profile.tracks : [];
      tracks.push(newTrack);

      const updatedProfile = await storage.updateGameProfile(userId, {
        energy: profile.energy - 20,
        tracks: tracks,
      });

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Upgrade skill endpoint
  app.post("/api/game/skill/upgrade", async (req, res) => {
    try {
      const { userId, skillName } = req.body;
      const profile = await storage.getGameProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const skills = profile.skills as any;
      const currentLevel = skills[skillName] || 1;
      const energyCost = currentLevel;

      if (profile.energy < energyCost) {
        return res.status(400).json({ message: "Not enough energy" });
      }

      const updatedSkills = {
        ...skills,
        [skillName]: currentLevel + 1,
      };

      const updatedProfile = await storage.updateGameProfile(userId, {
        energy: profile.energy - energyCost,
        skills: updatedSkills,
      });

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Advance week endpoint
  app.post("/api/game/advance-week", async (req, res) => {
    try {
      const { userId } = req.body;
      const profile = await storage.getGameProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Calculate new year and age based on weeks passed
      const weeksPerYear = 52;
      const currentWeek = Math.floor((profile.year - 2020) * weeksPerYear) + 1;
      const newWeek = currentWeek + 1;
      const newYear = 2020 + Math.floor(newWeek / weeksPerYear);
      const ageIncrease = newYear > profile.year ? 1 : 0;

      const updatedProfile = await storage.updateGameProfile(userId, {
        year: newYear,
        age: profile.age + ageIncrease,
        energy: Math.min(100, profile.energy + 10), // Natural energy recovery
      });

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
