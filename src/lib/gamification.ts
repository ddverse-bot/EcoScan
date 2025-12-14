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
  reward: number; // EcoPoints
}

export interface Level {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  description: string;
}

export const LEVELS: Level[] = [
  {
    name: "Eco Beginner",
    minPoints: 0,
    maxPoints: 99,
    color: "bg-gray-100 text-gray-800",
    description: "Just starting your eco journey"
  },
  {
    name: "Green Explorer",
    minPoints: 100,
    maxPoints: 299,
    color: "bg-green-100 text-green-800",
    description: "Learning about environmental impact"
  },
  {
    name: "Carbon Detective",
    minPoints: 300,
    maxPoints: 599,
    color: "bg-blue-100 text-blue-800",
    description: "Investigating carbon footprints"
  },
  {
    name: "Sustainability Scout",
    minPoints: 600,
    maxPoints: 999,
    color: "bg-purple-100 text-purple-800",
    description: "Scouting for eco-friendly alternatives"
  },
  {
    name: "Zero Waste Hunter",
    minPoints: 1000,
    maxPoints: 1999,
    color: "bg-orange-100 text-orange-800",
    description: "Hunting down wasteful practices"
  },
  {
    name: "Climate Champion",
    minPoints: 2000,
    maxPoints: 3999,
    color: "bg-red-100 text-red-800",
    description: "Champion of climate action"
  },
  {
    name: "Eco Master",
    minPoints: 4000,
    maxPoints: 7999,
    color: "bg-yellow-100 text-yellow-800",
    description: "Master of sustainable living"
  },
  {
    name: "Planet Guardian",
    minPoints: 8000,
    maxPoints: Infinity,
    color: "bg-gradient-to-r from-green-400 to-blue-500 text-white",
    description: "Guardian of our planet"
  }
];

export const BADGES: { [key: string]: Omit<Badge, 'unlockedAt'> } = {
  first_scan: {
    id: 'first_scan',
    name: 'First Steps',
    description: 'Completed your first eco scan',
    icon: '🌱',
    rarity: 'common'
  },
  streak_3: {
    id: 'streak_3',
    name: 'Getting Started',
    description: 'Maintained a 3-day scanning streak',
    icon: '🔥',
    rarity: 'common'
  },
  streak_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintained a 7-day scanning streak',
    icon: '⚡',
    rarity: 'rare'
  },
  streak_30: {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintained a 30-day scanning streak',
    icon: '🏆',
    rarity: 'epic'
  },
  food_scanner: {
    id: 'food_scanner',
    name: 'Food Inspector',
    description: 'Scanned 10 food items',
    icon: '🍎',
    rarity: 'common'
  },
  plastic_hunter: {
    id: 'plastic_hunter',
    name: 'Plastic Hunter',
    description: 'Identified 5 plastic waste items',
    icon: '♻️',
    rarity: 'rare'
  },
  carbon_tracker: {
    id: 'carbon_tracker',
    name: 'Carbon Tracker',
    description: 'Tracked 1kg of CO₂ emissions',
    icon: '📊',
    rarity: 'rare'
  },
  eco_expert: {
    id: 'eco_expert',
    name: 'Eco Expert',
    description: 'Reached 1000 EcoPoints',
    icon: '🌟',
    rarity: 'epic'
  },
  planet_saver: {
    id: 'planet_saver',
    name: 'Planet Saver',
    description: 'Tracked 10kg of CO₂ emissions',
    icon: '🌍',
    rarity: 'legendary'
  }
};

export const ACHIEVEMENTS: { [key: string]: Omit<Achievement, 'progress' | 'completed'> } = {
  scan_master: {
    id: 'scan_master',
    name: 'Scan Master',
    description: 'Complete 100 scans',
    target: 100,
    reward: 500
  },
  streak_legend: {
    id: 'streak_legend',
    name: 'Streak Legend',
    description: 'Maintain a 100-day streak',
    target: 100,
    reward: 1000
  },
  category_explorer: {
    id: 'category_explorer',
    name: 'Category Explorer',
    description: 'Scan items from all 5 categories',
    target: 5,
    reward: 300
  },
  co2_conscious: {
    id: 'co2_conscious',
    name: 'CO₂ Conscious',
    description: 'Track 50kg of CO₂ emissions',
    target: 50000, // in grams
    reward: 750
  }
};

class GamificationService {
  private readonly STORAGE_KEY = 'ecoscan_progress';

  getProgress(): UserProgress {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse stored progress:', error);
      }
    }

    // Return default progress
    return {
      ecoPoints: 0,
      dailyStreak: 0,
      totalScans: 0,
      co2Tracked: 0,
      level: LEVELS[0].name,
      badges: [],
      lastScanDate: '',
      weeklyGoal: 50, // 50 scans per week
      achievements: Object.values(ACHIEVEMENTS).map(achievement => ({
        ...achievement,
        progress: 0,
        completed: false
      }))
    };
  }

  saveProgress(progress: UserProgress): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  addScanResult(co2Amount: number, category: string): {
    pointsEarned: number;
    newBadges: Badge[];
    levelUp: boolean;
    newLevel?: string;
  } {
    const progress = this.getProgress();
    const today = new Date().toDateString();
    
    // Calculate base points (10-30 based on impact level)
    const basePoints = this.calculatePoints(co2Amount, category);
    
    // Streak bonus
    const streakBonus = this.updateStreak(progress, today);
    const totalPoints = basePoints + streakBonus;
    
    // Update progress
    progress.ecoPoints += totalPoints;
    progress.totalScans += 1;
    progress.co2Tracked += co2Amount;
    progress.lastScanDate = today;
    
    // Check for level up
    const oldLevel = progress.level;
    progress.level = this.calculateLevel(progress.ecoPoints);
    const levelUp = oldLevel !== progress.level;
    
    // Check for new badges
    const newBadges = this.checkBadges(progress);
    progress.badges.push(...newBadges);
    
    // Update achievements
    this.updateAchievements(progress, category);
    
    this.saveProgress(progress);
    
    return {
      pointsEarned: totalPoints,
      newBadges,
      levelUp,
      newLevel: levelUp ? progress.level : undefined
    };
  }

  private calculatePoints(co2Amount: number, category: string): number {
    // Base points based on category and impact
    const categoryMultipliers = {
      'Food Items': 1.0,
      'Clothing': 1.2,
      'Plastic & Waste': 1.5,
      'Appliances': 1.1,
      'Transportation': 1.3,
      'General Items': 1.0
    };
    
    const multiplier = categoryMultipliers[category as keyof typeof categoryMultipliers] || 1.0;
    
    // More points for scanning high-impact items (educational value)
    if (co2Amount > 1000) return Math.floor(15 * multiplier); // High impact
    if (co2Amount > 100) return Math.floor(20 * multiplier);  // Medium impact
    return Math.floor(25 * multiplier); // Low impact (reward good choices)
  }

  private updateStreak(progress: UserProgress, today: string): number {
    const lastScan = new Date(progress.lastScanDate);
    const todayDate = new Date(today);
    const daysDiff = Math.floor((todayDate.getTime() - lastScan.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Continue streak
      progress.dailyStreak += 1;
    } else if (daysDiff === 0) {
      // Same day, no streak change
      return 0;
    } else {
      // Streak broken, reset
      progress.dailyStreak = 1;
    }
    
    // Streak bonus: 1 point per day in streak (max 30)
    return Math.min(progress.dailyStreak, 30);
  }

  private calculateLevel(points: number): string {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].minPoints) {
        return LEVELS[i].name;
      }
    }
    return LEVELS[0].name;
  }

  private checkBadges(progress: UserProgress): Badge[] {
    const newBadges: Badge[] = [];
    const existingBadgeIds = progress.badges.map(b => b.id);
    const now = new Date().toISOString();
    
    // Check each badge condition
    if (!existingBadgeIds.includes('first_scan') && progress.totalScans >= 1) {
      newBadges.push({ ...BADGES.first_scan, unlockedAt: now });
    }
    
    if (!existingBadgeIds.includes('streak_3') && progress.dailyStreak >= 3) {
      newBadges.push({ ...BADGES.streak_3, unlockedAt: now });
    }
    
    if (!existingBadgeIds.includes('streak_7') && progress.dailyStreak >= 7) {
      newBadges.push({ ...BADGES.streak_7, unlockedAt: now });
    }
    
    if (!existingBadgeIds.includes('streak_30') && progress.dailyStreak >= 30) {
      newBadges.push({ ...BADGES.streak_30, unlockedAt: now });
    }
    
    if (!existingBadgeIds.includes('carbon_tracker') && progress.co2Tracked >= 1000) {
      newBadges.push({ ...BADGES.carbon_tracker, unlockedAt: now });
    }
    
    if (!existingBadgeIds.includes('eco_expert') && progress.ecoPoints >= 1000) {
      newBadges.push({ ...BADGES.eco_expert, unlockedAt: now });
    }
    
    if (!existingBadgeIds.includes('planet_saver') && progress.co2Tracked >= 10000) {
      newBadges.push({ ...BADGES.planet_saver, unlockedAt: now });
    }
    
    return newBadges;
  }

  private updateAchievements(progress:UserProgress): void {
    // Update scan master achievement
    const scanMaster = progress.achievements.find(a => a.id === 'scan_master');
    if (scanMaster && !scanMaster.completed) {
      scanMaster.progress = progress.totalScans;
      if (scanMaster.progress >= scanMaster.target) {
        scanMaster.completed = true;
        progress.ecoPoints += scanMaster.reward;
      }
    }
    
    // Update streak legend achievement
    const streakLegend = progress.achievements.find(a => a.id === 'streak_legend');
    if (streakLegend && !streakLegend.completed) {
      streakLegend.progress = progress.dailyStreak;
      if (streakLegend.progress >= streakLegend.target) {
        streakLegend.completed = true;
        progress.ecoPoints += streakLegend.reward;
      }
    }
    
    // Update CO₂ conscious achievement
    const co2Conscious = progress.achievements.find(a => a.id === 'co2_conscious');
    if (co2Conscious && !co2Conscious.completed) {
      co2Conscious.progress = Math.floor(progress.co2Tracked);
      if (co2Conscious.progress >= co2Conscious.target) {
        co2Conscious.completed = true;
        progress.ecoPoints += co2Conscious.reward;
      }
    }
  }

  getLevelInfo(points: number): Level {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].minPoints) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  }

  getNextLevelInfo(points: number): Level | null {
    const currentLevel = this.getLevelInfo(points);
    const currentIndex = LEVELS.findIndex(l => l.name === currentLevel.name);
    
    if (currentIndex < LEVELS.length - 1) {
      return LEVELS[currentIndex + 1];
    }
    
    return null; // Already at max level
  }

  getProgressToNextLevel(points: number): number {
    const nextLevel = this.getNextLevelInfo(points);
    if (!nextLevel) return 100; // Max level
    
    const currentLevel = this.getLevelInfo(points);
    const progress = points - currentLevel.minPoints;
    const total = nextLevel.minPoints - currentLevel.minPoints;
    
    return Math.floor((progress / total) * 100);
  }

  resetProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const gamificationService = new GamificationService();