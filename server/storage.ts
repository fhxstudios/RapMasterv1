import { type User, type InsertUser, type GameProfile, type InsertGameProfile, type Job, type ShopItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getGameProfile(userId: string): Promise<GameProfile | undefined>;
  createGameProfile(profile: InsertGameProfile): Promise<GameProfile>;
  updateGameProfile(userId: string, updates: Partial<GameProfile>): Promise<GameProfile | undefined>;
  getJobs(): Promise<Job[]>;
  getShopItems(): Promise<ShopItem[]>;
  getJobsByCategory(category: string): Promise<Job[]>;
  getShopItemsByCategory(category: string): Promise<ShopItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private gameProfiles: Map<string, GameProfile>;
  private jobs: Map<string, Job>;
  private shopItems: Map<string, ShopItem>;

  constructor() {
    this.users = new Map();
    this.gameProfiles = new Map();
    this.jobs = new Map();
    this.shopItems = new Map();
    this.initializeGameData();
  }

  private initializeGameData() {
    // Initialize default jobs
    const defaultJobs: Job[] = [
      {
        id: "job-1",
        title: "Fast Food Worker",
        description: "Easy work, basic pay",
        category: "entry",
        moneyReward: 20,
        energyReward: 5,
        energyCost: 10,
        fameReward: 0,
        requiredFame: 0,
        isActive: 1,
      },
      {
        id: "job-2",
        title: "Delivery Driver",
        description: "Drive around town",
        category: "entry",
        moneyReward: 35,
        energyReward: 3,
        energyCost: 15,
        fameReward: 0,
        requiredFame: 0,
        isActive: 1,
      },
      {
        id: "job-3",
        title: "Studio Assistant",
        description: "Help in recording studios",
        category: "mid",
        moneyReward: 75,
        energyReward: 0,
        energyCost: 20,
        fameReward: 2,
        requiredFame: 10,
        isActive: 1,
      },
    ];

    // Initialize default shop items
    const defaultShopItems: ShopItem[] = [
      // Lifestyle - Cars
      {
        id: "item-1",
        name: "Used Car",
        description: "Basic transportation",
        category: "lifestyle",
        price: 500,
        fameBoost: 0,
        reputationBoost: 5,
        fanBoost: 0,
        requiredLevel: 0,
        icon: "🚗",
      },
      {
        id: "item-4",
        name: "Sports Car",
        description: "Fast and flashy ride",
        category: "lifestyle",
        price: 15000,
        fameBoost: 10,
        reputationBoost: 25,
        fanBoost: 50,
        requiredLevel: 0,
        icon: "🏎️",
      },
      {
        id: "item-5",
        name: "Luxury SUV",
        description: "High-end status symbol",
        category: "lifestyle",
        price: 35000,
        fameBoost: 15,
        reputationBoost: 40,
        fanBoost: 100,
        requiredLevel: 0,
        icon: "🚙",
      },
      {
        id: "item-6",
        name: "Supercar",
        description: "Ultimate flex machine",
        category: "lifestyle",
        price: 100000,
        fameBoost: 30,
        reputationBoost: 75,
        fanBoost: 300,
        requiredLevel: 0,
        icon: "🏁",
      },
      
      // Lifestyle - Houses
      {
        id: "item-2",
        name: "Apartment",
        description: "Your first place",
        category: "lifestyle",
        price: 2000,
        fameBoost: 5,
        reputationBoost: 10,
        fanBoost: 0,
        requiredLevel: 0,
        icon: "🏠",
      },
      {
        id: "item-7",
        name: "Studio Loft",
        description: "Perfect for creating music",
        category: "lifestyle",
        price: 25000,
        fameBoost: 20,
        reputationBoost: 30,
        fanBoost: 75,
        requiredLevel: 0,
        icon: "🏢",
      },
      {
        id: "item-8",
        name: "Penthouse",
        description: "Top floor luxury living",
        category: "lifestyle",
        price: 75000,
        fameBoost: 40,
        reputationBoost: 60,
        fanBoost: 200,
        requiredLevel: 0,
        icon: "🏘️",
      },
      {
        id: "item-9",
        name: "Mansion",
        description: "Ultimate celebrity home",
        category: "lifestyle",
        price: 500000,
        fameBoost: 100,
        reputationBoost: 150,
        fanBoost: 1000,
        requiredLevel: 0,
        icon: "🏰",
      },

      // Fashion
      {
        id: "item-10",
        name: "Designer Sneakers",
        description: "Limited edition kicks",
        category: "fashion",
        price: 800,
        fameBoost: 3,
        reputationBoost: 5,
        fanBoost: 10,
        requiredLevel: 0,
        icon: "👟",
      },
      {
        id: "item-11",
        name: "Diamond Chain",
        description: "Bling that shines",
        category: "fashion",
        price: 5000,
        fameBoost: 8,
        reputationBoost: 15,
        fanBoost: 25,
        requiredLevel: 0,
        icon: "💎",
      },
      {
        id: "item-12",
        name: "Custom Grillz",
        description: "Gold teeth style",
        category: "fashion",
        price: 3000,
        fameBoost: 6,
        reputationBoost: 12,
        fanBoost: 20,
        requiredLevel: 0,
        icon: "😬",
      },
      {
        id: "item-13",
        name: "Designer Watch",
        description: "Luxury timepiece",
        category: "fashion",
        price: 12000,
        fameBoost: 12,
        reputationBoost: 25,
        fanBoost: 40,
        requiredLevel: 0,
        icon: "⌚",
      },
      {
        id: "item-14",
        name: "Custom Jacket",
        description: "Personalized style",
        category: "fashion",
        price: 2500,
        fameBoost: 5,
        reputationBoost: 10,
        fanBoost: 15,
        requiredLevel: 0,
        icon: "🧥",
      },

      // Studio Equipment
      {
        id: "item-3",
        name: "Basic Microphone",
        description: "Improves track quality",
        category: "studio",
        price: 200,
        fameBoost: 0,
        reputationBoost: 0,
        fanBoost: 0,
        requiredLevel: 0,
        icon: "🎤",
      },
      {
        id: "item-15",
        name: "Professional Microphone",
        description: "High-quality recording",
        category: "studio",
        price: 1500,
        fameBoost: 0,
        reputationBoost: 5,
        fanBoost: 0,
        requiredLevel: 0,
        icon: "🎙️",
      },
      {
        id: "item-16",
        name: "Mixing Board",
        description: "Advanced audio control",
        category: "studio",
        price: 5000,
        fameBoost: 0,
        reputationBoost: 10,
        fanBoost: 0,
        requiredLevel: 0,
        icon: "🎛️",
      },
      {
        id: "item-17",
        name: "Studio Monitors",
        description: "Perfect sound clarity",
        category: "studio",
        price: 3000,
        fameBoost: 0,
        reputationBoost: 8,
        fanBoost: 0,
        requiredLevel: 0,
        icon: "🔊",
      },
    ];

    defaultJobs.forEach(job => this.jobs.set(job.id, job));
    defaultShopItems.forEach(item => this.shopItems.set(item.id, item));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGameProfile(userId: string): Promise<GameProfile | undefined> {
    return Array.from(this.gameProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createGameProfile(profile: InsertGameProfile): Promise<GameProfile> {
    const id = randomUUID();
    const gameProfile: GameProfile = {
      ...profile,
      id,
      userId: profile.userId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.gameProfiles.set(id, gameProfile);
    return gameProfile;
  }

  async updateGameProfile(userId: string, updates: Partial<GameProfile>): Promise<GameProfile | undefined> {
    const profile = await this.getGameProfile(userId);
    if (!profile) return undefined;

    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date(),
    };
    this.gameProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  async getJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.isActive === 1);
  }

  async getJobsByCategory(category: string): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(
      job => job.category === category && job.isActive === 1
    );
  }

  async getShopItems(): Promise<ShopItem[]> {
    return Array.from(this.shopItems.values());
  }

  async getShopItemsByCategory(category: string): Promise<ShopItem[]> {
    return Array.from(this.shopItems.values()).filter(
      item => item.category === category
    );
  }
}

export const storage = new MemStorage();
