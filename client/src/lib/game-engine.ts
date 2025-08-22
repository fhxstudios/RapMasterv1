import type { GameProfile, Track } from "@shared/schema";

export class GameEngine {
  static calculateTrackQuality(profile: GameProfile, beat: string): number {
    const skills = profile.skills as any;
    const baseQuality = Math.floor(Math.random() * 50) + 25;
    const skillBonus = (skills.rapping || 1) * 2 + (skills.production || 1) * 2;
    const beatBonus = beat.includes("Premium") ? 20 : 0;
    
    return Math.min(100, baseQuality + skillBonus + beatBonus);
  }

  static calculateSkillUpgradeCost(currentLevel: number): number {
    return currentLevel;
  }

  static calculateViewsFromRelease(track: Track, profile: GameProfile): number {
    const baseViews = Math.floor(Math.random() * 1000) + 100;
    const qualityMultiplier = track.quality / 100;
    const fameMultiplier = (profile.fame + 1) / 10;
    
    return Math.floor(baseViews * qualityMultiplier * fameMultiplier);
  }

  static calculateFameGain(views: number): number {
    return Math.floor(views / 1000);
  }

  static calculateReputationGain(action: string): number {
    const gains: Record<string, number> = {
      'release_track': 2,
      'release_album': 10,
      'music_video': 5,
      'buy_car': 5,
      'buy_house': 10,
    };
    
    return gains[action] || 0;
  }

  static calculateNetWorth(profile: GameProfile): number {
    const money = profile.money;
    const assets = Array.isArray(profile.inventory) 
      ? (profile.inventory as any[]).reduce((total, item) => total + (item.value || 0), 0)
      : 0;
    
    return money + assets;
  }

  static generateRandomStageName(): string {
    const prefixes = ['Lil', 'Big', 'Young', 'MC', 'DJ', 'King', 'Queen'];
    const suffixes = ['Beats', 'Flow', 'Vibe', 'Money', 'Gold', 'Fire', 'Storm'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${prefix} ${suffix}`;
  }

  static advanceTime(profile: GameProfile): Partial<GameProfile> {
    // Advance by one week
    const currentWeek = Math.floor((profile.year - 2020) * 52 + Math.floor(Math.random() * 52));
    const newWeek = currentWeek + 1;
    const newYear = 2020 + Math.floor(newWeek / 52);
    const ageIncrease = newYear - profile.year;
    
    return {
      year: newYear,
      age: profile.age + ageIncrease,
      energy: Math.min(100, profile.energy + 10), // Natural energy recovery
    };
  }

  static checkAchievements(profile: GameProfile): string[] {
    const achievements: string[] = [];
    
    if (profile.fame >= 100 && profile.fame < 105) {
      achievements.push("Rising Star - Reached 100 Fame!");
    }
    
    if (profile.money >= 10000 && profile.money < 10100) {
      achievements.push("Big Money - Earned $10,000!");
    }
    
    const tracks = Array.isArray(profile.tracks) ? profile.tracks : [];
    if (tracks.length === 1) {
      achievements.push("First Track - Created your first track!");
    }
    
    return achievements;
  }
}
