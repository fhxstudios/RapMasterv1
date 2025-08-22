import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gameProfiles = pgTable("game_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  stageName: text("stage_name").notNull(),
  avatar: integer("avatar").notNull().default(1),
  city: text("city").notNull(),
  age: integer("age").notNull().default(20),
  year: integer("year").notNull().default(2020),
  money: integer("money").notNull().default(100),
  energy: integer("energy").notNull().default(50),
  fame: integer("fame").notNull().default(0),
  reputation: integer("reputation").notNull().default(0),
  fans: integer("fans").notNull().default(0),
  netWorth: integer("net_worth").notNull().default(100),
  skills: jsonb("skills").notNull().default({
    rapping: 1,
    production: 1,
    socialMedia: 1,
    performance: 1,
    business: 1
  }),
  inventory: jsonb("inventory").notNull().default([]),
  tracks: jsonb("tracks").notNull().default([]),
  albums: jsonb("albums").notNull().default([]),
  socialStats: jsonb("social_stats").notNull().default({
    rapGramFollowers: 0,
    rapTubeSubscribers: 0,
    totalStreams: 0,
    verified: false,
    premiumVerified: false
  }),
  socialPosts: jsonb("social_posts").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // entry, mid, rap-related
  moneyReward: integer("money_reward").notNull(),
  energyReward: integer("energy_reward").notNull(),
  energyCost: integer("energy_cost").notNull(),
  fameReward: integer("fame_reward").default(0),
  requiredFame: integer("required_fame").default(0),
  isActive: integer("is_active").notNull().default(1),
});

export const shopItems = pgTable("shop_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // lifestyle, studio, fashion
  price: integer("price").notNull(),
  fameBoost: integer("fame_boost").default(0),
  reputationBoost: integer("reputation_boost").default(0),
  fanBoost: integer("fan_boost").default(0),
  requiredLevel: integer("required_level").default(0),
  icon: text("icon").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameProfileSchema = createInsertSchema(gameProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
});

export const insertShopItemSchema = createInsertSchema(shopItems).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GameProfile = typeof gameProfiles.$inferSelect;
export type InsertGameProfile = z.infer<typeof insertGameProfileSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type ShopItem = typeof shopItems.$inferSelect;
export type InsertShopItem = z.infer<typeof insertShopItemSchema>;

// Game-specific types
export interface Track {
  id: string;
  title: string;
  beat: string;
  quality: number;
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  streams: number;
  releaseDate?: string;
  isReleased: boolean;
  hasVideo: boolean;
  videoViews: number;
  earnings: number;
}

export interface Album {
  id: string;
  title: string;
  tracks: string[];
  sales: number;
  quality: number;
  releaseDate: string;
}

export interface GameStats {
  totalTracks: number;
  totalAlbums: number;
  totalMusicVideos: number;
  totalViews: number;
  totalStreams: number;
  totalEarnings: number;
}

export interface MusicVideo {
  id: string;
  trackId: string;
  title: string;
  budget: number;
  quality: number;
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  releaseDate: string;
  earnings: number;
}

export interface SocialMediaPost {
  id: string;
  type: 'photo' | 'video' | 'text' | 'track_announcement' | 'video_announcement';
  content: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timestamp: string;
  trackId?: string;
  videoId?: string;
}
