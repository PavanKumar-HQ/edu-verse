import { useState, useEffect, useCallback } from 'react';

export interface LearningDNA {
  cognitiveVelocity: number;
  neuralRetention: number;
  focusFrequency: number;
  practicalSynergy: number;
  xp: number;
  level: number;
  streak: number;
  rank: string;
  weakTopics: string[];
  strongTopics: string[];
  totalQuizzesTaken: number;
  totalLabsCompleted: number;
  burnoutRisk: number;
  adaptiveDifficulty: 'beginner' | 'intermediate' | 'advanced';
  badges: string[];
  completedMissions: string[];
  lastActive: string;
  // Advanced Features
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'read-write';
  paceTrend: 'accelerating' | 'steady' | 'slowing';
  currentGoal?: {
    id: string;
    title: string;
    deadline: string;
    progress: number;
  };
  dailyQuests: {
    id: string;
    text: string;
    completed: boolean;
    xp: number;
  }[];
}

const DEFAULT_DNA: LearningDNA = {
  cognitiveVelocity: 72,
  neuralRetention: 85,
  focusFrequency: 68,
  practicalSynergy: 91,
  xp: 4820,
  level: 14,
  streak: 7,
  rank: 'Technomancer',
  weakTopics: ['SQL Injection', 'Blockchain Consensus', 'Neural Weights'],
  strongTopics: ['Network Defense', 'Ethical Hacking', 'Python Scripting'],
  totalQuizzesTaken: 23,
  totalLabsCompleted: 8,
  burnoutRisk: 18,
  adaptiveDifficulty: 'intermediate',
  badges: ['first_lab', 'streak_7', 'quiz_ace', 'speed_learner'],
  completedMissions: [],
  lastActive: new Date().toISOString(),
  learningStyle: 'visual',
  paceTrend: 'steady',
  dailyQuests: [
    { id: '1', text: 'Complete a Cyber Lab', completed: false, xp: 200 },
    { id: '2', text: 'Master 1 Weak Topic', completed: false, xp: 150 },
    { id: '3', text: '15 Minute Focus Session', completed: false, xp: 100 }
  ]
};

const XP_PER_LEVEL = 500;

function getRank(level: number): string {
  if (level >= 30) return 'Neural Sage';
  if (level >= 20) return 'Architect';
  if (level >= 14) return 'Technomancer';
  if (level >= 10) return 'Specialist';
  if (level >= 5) return 'Apprentice';
  return 'Novice';
}

export function useLearningDNA() {
  const [dna, setDNA] = useState<LearningDNA>(() => {
    try {
      const saved = localStorage.getItem('geniusphere_dna_v4');
      if (saved) return { ...DEFAULT_DNA, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_DNA;
  });

  useEffect(() => {
    localStorage.setItem('geniusphere_dna_v4', JSON.stringify(dna));
  }, [dna]);

  const addXP = useCallback((amount: number) => {
    setDNA(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      return { ...prev, xp: newXP, level: newLevel, rank: getRank(newLevel) };
    });
  }, []);

  const updateAfterQuiz = useCallback((score: number, topic: string) => {
    setDNA(prev => {
      const newWeak = score < 60 && !prev.weakTopics.includes(topic)
        ? [...prev.weakTopics.slice(-4), topic] : prev.weakTopics;
      const newStrong = score >= 80 && !prev.strongTopics.includes(topic)
        ? [...prev.strongTopics.slice(-4), topic] : prev.strongTopics;
      
      // Update Mastery Progress if goal exists
      const newGoal = prev.currentGoal ? { ...prev.currentGoal, progress: Math.min(100, prev.currentGoal.progress + 2) } : undefined;

      return {
        ...prev,
        neuralRetention: Math.min(100, prev.neuralRetention + (score >= 70 ? 2 : -3)),
        cognitiveVelocity: Math.min(100, prev.cognitiveVelocity + (score >= 80 ? 2 : -1)),
        totalQuizzesTaken: prev.totalQuizzesTaken + 1,
        weakTopics: newWeak,
        strongTopics: newStrong,
        adaptiveDifficulty: score >= 85 ? 'advanced' : score >= 60 ? 'intermediate' : 'beginner',
        burnoutRisk: Math.min(100, prev.burnoutRisk + (score < 50 ? 5 : -2)),
        currentGoal: newGoal,
      };
    });
    addXP(score >= 80 ? 100 : score >= 60 ? 60 : 30);
  }, [addXP]);

  const updateAfterLab = useCallback(() => {
    setDNA(prev => ({
      ...prev,
      totalLabsCompleted: prev.totalLabsCompleted + 1,
      practicalSynergy: Math.min(100, prev.practicalSynergy + 3),
      focusFrequency: Math.min(100, prev.focusFrequency + 2),
      learningStyle: 'kinesthetic', // Lab heavy usage indicates kinesthetic
    }));
    addXP(200);
  }, [addXP]);

  const completeMission = useCallback((missionId: string) => {
    setDNA(prev => ({
      ...prev,
      completedMissions: [...prev.completedMissions, missionId],
    }));
    addXP(150);
  }, [addXP]);

  const setGoal = useCallback((title: string, deadline: string) => {
    setDNA(prev => ({
      ...prev,
      currentGoal: { id: Date.now().toString(), title, deadline, progress: 0 }
    }));
  }, []);

  const xpInLevel = dna.xp % XP_PER_LEVEL;
  const xpProgress = (xpInLevel / XP_PER_LEVEL) * 100;

  return { 
    dna, 
    addXP, 
    updateAfterQuiz, 
    updateAfterLab, 
    completeMission, 
    setGoal,
    xpProgress, 
    xpInLevel, 
    XP_PER_LEVEL 
  };
}

