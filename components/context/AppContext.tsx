import React, { createContext, useContext, useState } from 'react';

// Radar data type
export interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

// Stats data type
export interface PlatformStat {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: string; // we will use string name and map to lucide icon in component
  color: string;
  bg: string;
}

interface AppState {
  radarStats: RadarData[];
  platformStats: PlatformStat[];
  updateRadarStat: (subject: string, newScore: number) => void;
  updatePlatformStat: (label: string, newValue: string) => void;
}

const defaultRadarStats: RadarData[] = [
  { subject: 'Technology', A: 85, fullMark: 100 },
  { subject: 'Finance', A: 65, fullMark: 100 },
  { subject: 'Professional', A: 92, fullMark: 100 },
  { subject: 'AI/ML', A: 78, fullMark: 100 },
  { subject: 'Cybersecurity', A: 88, fullMark: 100 },
  { subject: 'Soft Skills', A: 70, fullMark: 100 },
];

const defaultPlatformStats: PlatformStat[] = [
  { label: 'Active Learners', value: '2,847', change: '+12%', up: true, icon: 'Users', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Quiz Attempts', value: '14,230', change: '+28%', up: true, icon: 'Brain', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Labs Completed', value: '3,891', change: '+19%', up: true, icon: 'Zap', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Astra AI Queries', value: '8,102', change: '+45%', up: true, icon: 'Activity', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { label: 'Avg. Session Time', value: '42 min', change: '-3%', up: false, icon: 'TrendingUp', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { label: 'Drop-off Rate', value: '8.2%', change: '-5%', up: true, icon: 'AlertTriangle', color: 'text-red-400', bg: 'bg-red-500/10' },
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [radarStats, setRadarStats] = useState<RadarData[]>(defaultRadarStats);
  const [platformStats, setPlatformStats] = useState<PlatformStat[]>(defaultPlatformStats);

  const updateRadarStat = (subject: string, newScore: number) => {
    setRadarStats(prev => 
      prev.map(stat => stat.subject === subject ? { ...stat, A: newScore } : stat)
    );
  };

  const updatePlatformStat = (label: string, newValue: string) => {
    setPlatformStats(prev => 
      prev.map(stat => stat.label === label ? { ...stat, value: newValue } : stat)
    );
  };

  return (
    <AppContext.Provider value={{ radarStats, platformStats, updateRadarStat, updatePlatformStat }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
