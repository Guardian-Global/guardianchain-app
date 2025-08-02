import type { Express } from "express";
import { isDebugAuthenticated } from "../debugAuth";

interface SessionData {
  sessionId: string;
  userId: string;
  startTime: number;
  endTime?: number;
  pagesVisited: string[];
  actionsCompleted: string[];
  timeSpent: number;
  interactions: number;
}

interface EngagementMetrics {
  sessionTime: number;
  pagesVisited: string[];
  actionsCompleted: string[];
  streakDays: number;
  totalSessions: number;
  lastActive: string;
  engagementScore: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: string;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: string;
  expires: string;
}

// In-memory storage for demo (in production, use database)
const userSessions = new Map<string, SessionData[]>();
const userMetrics = new Map<string, EngagementMetrics>();
const userChallenges = new Map<string, DailyChallenge[]>();

export function registerEngagementRoutes(app: Express) {
  // Track user session
  app.post('/api/engagement/track-session', isDebugAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { sessionId, startTime, userAgent, path } = req.body;

      if (!userSessions.has(userId)) {
        userSessions.set(userId, []);
      }

      const sessions = userSessions.get(userId)!;
      let currentSession = sessions.find(s => s.sessionId === sessionId);

      if (!currentSession) {
        currentSession = {
          sessionId,
          userId,
          startTime,
          pagesVisited: [path],
          actionsCompleted: [],
          timeSpent: 0,
          interactions: 0
        };
        sessions.push(currentSession);
      } else {
        // Update existing session
        if (!currentSession.pagesVisited.includes(path)) {
          currentSession.pagesVisited.push(path);
        }
        currentSession.timeSpent = Date.now() - currentSession.startTime;
        currentSession.interactions++;
      }

      // Update user metrics
      const metrics = calculateEngagementMetrics(userId, sessions);
      userMetrics.set(userId, metrics);

      res.json({ success: true, metrics });
    } catch (error) {
      console.error('Failed to track session:', error);
      res.status(500).json({ error: 'Failed to track session' });
    }
  });

  // Get daily challenges
  app.get('/api/engagement/daily-challenges', isDebugAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      if (!userChallenges.has(userId)) {
        const challenges = generateDailyChallenges(userId);
        userChallenges.set(userId, challenges);
      }

      const challenges = userChallenges.get(userId)!;
      res.json({ challenges });
    } catch (error) {
      console.error('Failed to load challenges:', error);
      res.status(500).json({ error: 'Failed to load challenges' });
    }
  });

  // Complete daily challenge
  app.post('/api/engagement/complete-challenge/:challengeId', isDebugAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { challengeId } = req.params;

      const challenges = userChallenges.get(userId) || [];
      const challenge = challenges.find(c => c.id === challengeId);

      if (!challenge || challenge.progress < challenge.maxProgress) {
        return res.status(400).json({ error: 'Challenge not completed' });
      }

      // Mark as completed (remove from list)
      const updatedChallenges = challenges.filter(c => c.id !== challengeId);
      userChallenges.set(userId, updatedChallenges);

      res.json({ 
        success: true, 
        reward: challenge.reward,
        message: `Congratulations! You earned ${challenge.reward}!`
      });
    } catch (error) {
      console.error('Failed to complete challenge:', error);
      res.status(500).json({ error: 'Failed to complete challenge' });
    }
  });

  // Get user personalization profile
  app.get('/api/personalization/profile', isDebugAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const sessions = userSessions.get(userId) || [];
      
      const personality = generatePersonalityProfile(userId, sessions);
      res.json({ personality });
    } catch (error) {
      console.error('Failed to load profile:', error);
      res.status(500).json({ error: 'Failed to load profile' });
    }
  });

  // Track user behavior for personalization
  app.post('/api/personalization/track', isDebugAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { action, path, timestamp, sessionData } = req.body;

      // In production, this would update user behavior analytics
      console.log(`📊 Tracking behavior for ${userId}:`, { action, path, timestamp });

      res.json({ success: true });
    } catch (error) {
      console.error('Failed to track behavior:', error);
      res.status(500).json({ error: 'Failed to track behavior' });
    }
  });
}

function calculateEngagementMetrics(userId: string, sessions: SessionData[]): EngagementMetrics {
  const totalSessions = sessions.length;
  const currentSession = sessions[sessions.length - 1];
  
  // Calculate unique pages visited
  const allPages = new Set<string>();
  sessions.forEach(session => {
    session.pagesVisited.forEach(page => allPages.add(page));
  });

  // Calculate streak days (simplified)
  const streakDays = Math.min(totalSessions, 7); // Max 7 day streak for demo

  // Calculate engagement score
  const baseScore = 50;
  const sessionBonus = Math.min(totalSessions * 5, 30);
  const pageBonus = Math.min(allPages.size * 3, 20);
  const engagementScore = Math.min(baseScore + sessionBonus + pageBonus, 100);

  // Generate achievements
  const achievements = generateAchievements(userId, sessions);

  return {
    sessionTime: currentSession?.timeSpent || 0,
    pagesVisited: Array.from(allPages),
    actionsCompleted: [],
    streakDays,
    totalSessions,
    lastActive: new Date().toISOString(),
    engagementScore,
    achievements
  };
}

function generateAchievements(userId: string, sessions: SessionData[]): Achievement[] {
  const achievements: Achievement[] = [];

  // First Session Achievement
  achievements.push({
    id: 'first_session',
    title: 'Welcome Guardian',
    description: 'Complete your first session',
    icon: 'star',
    unlocked: sessions.length >= 1,
    progress: Math.min(sessions.length, 1),
    maxProgress: 1,
    reward: '10 GTT'
  });

  // Page Explorer Achievement
  const uniquePages = new Set<string>();
  sessions.forEach(s => s.pagesVisited.forEach(p => uniquePages.add(p)));
  
  achievements.push({
    id: 'page_explorer',
    title: 'Digital Explorer',
    description: 'Visit 5 different pages',
    icon: 'crown',
    unlocked: uniquePages.size >= 5,
    progress: Math.min(uniquePages.size, 5),
    maxProgress: 5,
    reward: '25 GTT'
  });

  // Session Streak Achievement
  achievements.push({
    id: 'session_streak',
    title: 'Consistency Master',
    description: 'Login for 3 consecutive days',
    icon: 'zap',
    unlocked: sessions.length >= 3,
    progress: Math.min(sessions.length, 3),
    maxProgress: 3,
    reward: '50 GTT'
  });

  return achievements;
}

function generateDailyChallenges(userId: string): DailyChallenge[] {
  const challenges: DailyChallenge[] = [];
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  challenges.push({
    id: 'create_capsule_daily',
    title: 'Truth Seeker',
    description: 'Create your first capsule today',
    progress: 0,
    maxProgress: 1,
    reward: '100 GTT',
    expires: tomorrow.toISOString()
  });

  challenges.push({
    id: 'explore_features',
    title: 'Feature Explorer',
    description: 'Visit 3 different feature pages',
    progress: 0,
    maxProgress: 3,
    reward: '50 GTT',
    expires: tomorrow.toISOString()
  });

  challenges.push({
    id: 'session_time',
    title: 'Deep Dive',
    description: 'Spend 10 minutes exploring GuardianChain',
    progress: 0,
    maxProgress: 600, // 10 minutes in seconds
    reward: '30 GTT',
    expires: tomorrow.toISOString()
  });

  return challenges;
}

function generatePersonalityProfile(userId: string, sessions: SessionData[]) {
  // Analyze user behavior to determine personality traits
  const uniquePages = new Set<string>();
  sessions.forEach(s => s.pagesVisited.forEach(p => uniquePages.add(p)));

  const explorerScore = Math.min(uniquePages.size * 15, 100);
  const creatorScore = sessions.filter(s => s.pagesVisited.includes('/create')).length * 20;
  const socialScore = 50; // Default social score
  const analyticalScore = sessions.filter(s => s.pagesVisited.includes('/dashboard')).length * 25;
  const collectorScore = 40; // Default collector score

  return {
    traits: {
      explorer: explorerScore,
      creator: Math.min(creatorScore, 100),
      social: socialScore,
      analytical: Math.min(analyticalScore, 100),
      collector: collectorScore
    },
    preferences: {
      contentTypes: ['personal_memory', 'wisdom'],
      activityTimes: ['evening'],
      engagementStyle: 'guided',
      riskTolerance: 'moderate'
    },
    journey: {
      stage: sessions.length < 2 ? 'newcomer' : 
             sessions.length < 5 ? 'explorer' : 
             sessions.length < 10 ? 'creator' : 'expert',
      completedActions: [],
      skillLevels: {},
      interests: []
    }
  };
}