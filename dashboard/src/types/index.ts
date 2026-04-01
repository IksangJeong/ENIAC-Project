// ============================================
// ENIAC Dashboard - Type Definitions
// ============================================

// Server Status Types
export interface ServerStatus {
  cpu: number;
  ram: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime: number;
  temperature?: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
}

// Crowd Level
export type CrowdLevel = "low" | "medium" | "high";

// Commit Ranking Types
export interface CommitRanking {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  commits: number;
  trend?: "up" | "down" | "same";
}

// Schedule Types
export type ScheduleType = "event" | "seminar" | "study" | "meeting";
export type ScheduleStatus = "upcoming" | "active" | "completed" | "archived";
export type SchedulePriority = "normal" | "high" | "critical";

export interface Schedule {
  id: string;
  title: string;
  type: ScheduleType;
  status: ScheduleStatus;
  priority: SchedulePriority;
  date: string;
  endDate?: string;
  location?: string;
  description?: string;
  participants?: number;
  isOfficial?: boolean;
}

// Quote Types
export interface Quote {
  quote: string;
  author: string;
  category?: string;
}

// Algorithm Challenge Types
export type ChallengeStatus = "waiting" | "in_progress" | "completed";

export interface ChallengeParticipant {
  userId: string;
  username: string;
  avatar: string;
  solved: boolean;
  solveTime?: number;
}

export interface AlgorithmChallenge {
  id: string;
  problemTitle: string;
  difficulty: "easy" | "medium" | "hard";
  status: ChallengeStatus;
  startTime: string;
  endTime?: string;
  participants: ChallengeParticipant[];
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  priority: "normal" | "important" | "urgent";
  author?: string;
}

// File Share Types
export interface FileShare {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
}

// WebSocket Event Types
export interface SocketEvents {
  "commit:new": { userId: string; username: string; repo: string; message: string };
  "challenge:update": AlgorithmChallenge;
  "crowd:change": CrowdLevel;
  "announcement:new": Announcement;
  "user:online": User;
  "user:offline": { userId: string };
  "server:status": ServerStatus;
}

// Dashboard State
export interface DashboardState {
  serverStatus: ServerStatus | null;
  onlineUsers: User[];
  crowdLevel: CrowdLevel;
  commitRankings: CommitRanking[];
  schedules: Schedule[];
  currentQuote: Quote | null;
  challenges: AlgorithmChallenge[];
  announcements: Announcement[];
  isConnected: boolean;
  lastUpdate: string | null;
}
