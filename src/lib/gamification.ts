export interface UserProgress {
  ecoPoints: number;
  dailyStreak: number;
  totalScans: number;
  co2Tracked: number; // in grams
  level: string;
  badges: Badge[];
  lastScanDate: string;
  weeklyGoal: number;
  achievements: Achievement[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: number;
}

export interface Level {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  description: string;
}

export const LEVELS: Level[] = [
  { name: 'Eco Beginner', minPoints: 0, maxPoints: 99, color: 'bg-gray-100', description: 'Starting out' },
  { name: 'Green Explorer', minPoints: 100, maxPoints: 299, color: 'bg-green-100', description: 'Learning impact' },
  { name: 'Carbon Detective', minPoints: 300, maxPoints: 599, color: 'bg-blue-100', description: 'Tracking carbon' },
  { name: 'Sustainability Scout', minPoints: 600, maxPoints: 999, color: 'bg-purple-100', description: 'Eco conscious' },
  { name: 'Zero Waste Hunter', minPoints: 1000, maxPoints: 1999, color: 'bg-orange-100', description: 'Reducing waste' },
  { name: 'Climate Champion', minPoints: 2000, maxPoints: 3999, color: 'bg-red-100', description: 'Climate action' },
  { name: 'Eco Master', minPoints: 4000, maxPoints: 7999, color: 'bg-yellow-100', description: 'Eco leader' },
  { name: 'Planet Guardian', minPoints: 8000, maxPoints: Infinity, color: 'bg-green-500', description: 'Planet protector' }
];

export const BADGES: Record<string, Omit<Badge, 'unlockedAt'>> = {
  first_scan: { id: 'first_scan', name: 'First Scan', description: 'Completed first scan', icon: '🌱', rarity: 'common' },
  streak_7: { id: 'streak_7', name: '7 Day Streak', description: '7 day streak', icon: '🔥', rarity: 'rare' },
  eco_expert: { id: 'eco_expert', name: 'Eco Expert', description: '1000 EcoPoints', icon: '🌍', rarity: 'epic' }
};

export const ACHIEVEMENTS: Record<string, Omit<Achievement, 'progress' | 'completed'>> = {
  scan_master: { id: 'scan_master', name: 'Scan Master', description: '100 scans', target: 100, reward: 500 },
  streak_legend: { id: 'streak_legend', name: 'Streak Legend', description: '100 day streak', target: 100, reward: 1000 },
  co2_conscious: { id: 'co2_conscious', name: 'CO₂ Conscious', description: '50kg CO₂', target: 50000, reward: 750 }
};

class GamificationService {
  private readonly STORAGE_KEY = 'ecoscan_progress';

  getProgress(): UserProgress {
    if (typeof window === 'undefined') {
      return this.defaultProgress();
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.defaultProgress();
      }
    }

    return this.defaultProgress();
  }

  private defaultProgress(): UserProgress {
    return {
      ecoPoints: 0,
      dailyStreak: 0,
      totalScans: 0,
      co2Tracked: 0,
      level: LEVELS[0].name,
      badges: [],
      lastScanDate: '',
      weeklyGoal: 50,
      achievements: Object.values(ACHIEVEMENTS).map(a => ({
        ...a,
        progress: 0,
        completed: false
      }))
    };
  }

  saveProgress(progress: UserProgress): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    }
  }

  addScanResult(co2Amount: number): void {
    const progress = this.getProgress();
    const today = new Date().toDateString();

    progress.totalScans += 1;
    progress.co2Tracked += co2Amount;
    progress.ecoPoints += 20;
    progress.lastScanDate = today;

    progress.level = this.calculateLevel(progress.ecoPoints);
    this.updateAchievements(progress);
    this.saveProgress(progress);
  }

  private calculateLevel(points: number): string {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].minPoints) {
        return LEVELS[i].name;
      }
    }
    return LEVELS[0].name;
  }

  private updateAchievements(progress: UserProgress): void {
    const scanMaster = progress.achievements.find(a => a.id === 'scan_master');
    if (scanMaster && !scanMaster.completed) {
      scanMaster.progress = progress.totalScans;
      if (scanMaster.progress >= scanMaster.target) {
        scanMaster.completed = true;
        progress.ecoPoints += scanMaster.reward;
      }
    }

    const streakLegend = progress.achievements.find(a => a.id === 'streak_legend');
    if (streakLegend && !streakLegend.completed) {
      streakLegend.progress = progress.dailyStreak;
      if (streakLegend.progress >= streakLegend.target) {
        streakLegend.completed = true;
        progress.ecoPoints += streakLegend.reward;
      }
    }

    const co2Conscious = progress.achievements.find(a => a.id === 'co2_conscious');
    if (co2Conscious && !co2Conscious.completed) {
      co2Conscious.progress = Math.floor(progress.co2Tracked);
      if (co2Conscious.progress >= co2Conscious.target) {
        co2Conscious.completed = true;
        progress.ecoPoints += co2Conscious.reward;
      }
    }
  }

  resetProgress(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}

export const gamificationService = new GamificationService();
