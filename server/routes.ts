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
        energy: 100, // Full energy restoration each week
      });

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Track release endpoint
  app.post("/api/game/track/release", async (req, res) => {
    try {
      const { userId, trackId } = req.body;
      const profile = await storage.getGameProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const tracks = Array.isArray(profile.tracks) ? profile.tracks as any[] : [];
      const trackIndex = tracks.findIndex(t => t.id === trackId);
      
      if (trackIndex === -1) {
        return res.status(404).json({ message: "Track not found" });
      }

      // Release the track with initial stats
      const track = tracks[trackIndex];
      track.isReleased = true;
      track.releaseDate = new Date().toISOString().split('T')[0];
      track.views = Math.floor(Math.random() * 1000) + (track.quality * 10);
      track.streams = Math.floor(track.views * 0.7);
      track.likes = Math.floor(track.views * 0.05);
      track.dislikes = Math.floor(track.views * 0.01);
      track.comments = Math.floor(track.views * 0.02);
      track.earnings = Math.floor(track.streams * 0.003);
      track.hasVideo = false;
      track.videoViews = 0;

      // Update fame and fans based on track quality
      const fameGain = Math.floor(track.quality * 0.5);
      const fanGain = Math.floor(track.views * 0.1);

      const updatedProfile = await storage.updateGameProfile(userId, {
        tracks: tracks,
        fame: profile.fame + fameGain,
        fans: profile.fans + fanGain,
        money: profile.money + track.earnings,
        netWorth: profile.money + track.earnings
      });

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Music video creation endpoint
  app.post("/api/game/music-video", async (req, res) => {
    try {
      const { userId, trackId, budget } = req.body;
      const profile = await storage.getGameProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      if (profile.money < budget) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      const tracks = Array.isArray(profile.tracks) ? profile.tracks as any[] : [];
      const trackIndex = tracks.findIndex(t => t.id === trackId);
      
      if (trackIndex === -1) {
        return res.status(404).json({ message: "Track not found" });
      }

      const track = tracks[trackIndex];
      if (track.hasVideo) {
        return res.status(400).json({ message: "Track already has a music video" });
      }

      // Create music video with budget-based quality
      const videoQuality = budget === 500 ? 30 : budget === 2000 ? 60 : 90;
      track.hasVideo = true;
      track.videoViews = Math.floor(Math.random() * 5000) + (videoQuality * 50);
      
      // Video boosts track performance
      track.views += Math.floor(track.videoViews * 0.3);
      track.streams += Math.floor(track.videoViews * 0.2);
      track.likes += Math.floor(track.videoViews * 0.05);
      track.earnings += Math.floor(track.videoViews * 0.002);

      const fameBoost = Math.floor(videoQuality * 0.5);
      const fanBoost = Math.floor(track.videoViews * 0.05);

      const updatedProfile = await storage.updateGameProfile(userId, {
        tracks: tracks,
        money: profile.money - budget + Math.floor(track.videoViews * 0.002),
        fame: profile.fame + fameBoost,
        fans: profile.fans + fanBoost,
        netWorth: profile.money - budget + Math.floor(track.videoViews * 0.002)
      });

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Social media post creation endpoint
  app.post("/api/game/social/post", async (req, res) => {
    try {
      const { userId, content, type, trackId } = req.body;
      const profile = await storage.getGameProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Create new post with realistic engagement
      const baseEngagement = Math.floor(Math.random() * 1000) + (profile.fame * 10);
      const newPost = {
        id: `post-${Date.now()}`,
        type,
        content,
        likes: Math.floor(baseEngagement * 0.05),
        comments: Math.floor(baseEngagement * 0.02),
        shares: Math.floor(baseEngagement * 0.01),
        views: baseEngagement,
        timestamp: new Date().toISOString(),
        trackId: trackId || undefined
      };

      const socialPosts = Array.isArray(profile.socialPosts) ? profile.socialPosts as any[] : [];
      socialPosts.unshift(newPost);

      // Limit to 50 most recent posts
      if (socialPosts.length > 50) {
        socialPosts.splice(50);
      }

      // Update social stats based on post type and engagement
      const socialStats = profile.socialStats as any;
      const followerGain = Math.floor(newPost.views * 0.01);
      const subscriberGain = Math.floor(newPost.views * 0.005);

      const updatedSocialStats = {
        ...socialStats,
        rapGramFollowers: (socialStats.rapGramFollowers || 0) + followerGain,
        rapTubeSubscribers: (socialStats.rapTubeSubscribers || 0) + subscriberGain,
        totalStreams: (socialStats.totalStreams || 0) + Math.floor(newPost.views * 0.1)
      };

      const updatedProfile = await storage.updateGameProfile(userId, {
        socialPosts: socialPosts,
        socialStats: updatedSocialStats,
        fame: profile.fame + Math.floor(newPost.views * 0.001),
        fans: profile.fans + followerGain
      });

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Social media promotion endpoint
  app.post("/api/game/social/promote", async (req, res) => {
    try {
      const { userId, trackId, budget } = req.body;
      const profile = await storage.getGameProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      if (profile.money < budget) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      const tracks = Array.isArray(profile.tracks) ? profile.tracks as any[] : [];
      const track = tracks.find(t => t.id === trackId);
      
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }

      // Calculate promotion effectiveness based on budget
      const multiplier = budget === 100 ? 2 : budget === 500 ? 5 : 10;
      const promotionViews = Math.floor(Math.random() * 10000) + (budget * 10);
      
      // Boost track performance
      track.views += promotionViews * multiplier;
      track.streams += Math.floor(promotionViews * multiplier * 0.6);
      track.likes += Math.floor(promotionViews * multiplier * 0.04);
      track.earnings += Math.floor(promotionViews * multiplier * 0.003);

      // Update social stats
      const socialStats = profile.socialStats as any;
      const updatedSocialStats = {
        ...socialStats,
        rapGramFollowers: (socialStats.rapGramFollowers || 0) + Math.floor(promotionViews * multiplier * 0.02),
        rapTubeSubscribers: (socialStats.rapTubeSubscribers || 0) + Math.floor(promotionViews * multiplier * 0.01),
        totalStreams: (socialStats.totalStreams || 0) + Math.floor(promotionViews * multiplier * 0.6)
      };

      const fameGain = Math.floor(promotionViews * multiplier * 0.002);
      const fanGain = Math.floor(promotionViews * multiplier * 0.02);

      const updatedProfile = await storage.updateGameProfile(userId, {
        tracks: tracks,
        socialStats: updatedSocialStats,
        money: profile.money - budget + track.earnings,
        fame: profile.fame + fameGain,
        fans: profile.fans + fanGain,
        netWorth: profile.money - budget + track.earnings
      });

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
