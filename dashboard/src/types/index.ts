import { DepartmentId } from "@/lib/constants";

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
export type UserRole = "admin" | "member" | "viewer";

export interface User {
  id: string;
  name: string;
  username?: string;
  email?: string;
  avatar?: string;
  role?: UserRole;
  status: "online" | "offline" | "away";
  statusMessage?: string;
  metrics?: {
    todayCommits: number;
    weeklyActivity: number[]; // Array of commit counts for last 7 days
  };
  lastSeen?: string;
}

// Member Types (Extended from User for the Members Page)
export interface Member extends User {
  position: string; // e.g., "Lead Developer", "UI Designer", "PM"
  department: DepartmentId; // Strictly typed now
  bio?: string;
  skills: string[];
  socialLinks?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
  joinDate: string;
}

// Group Types (New: Study/Project Clusters)
export type GroupType = "study" | "project";
export type GroupStatus = "booting" | "processing" | "stabilized" | "halted";

export interface Group {
  id: string;
  name: string;
  type: GroupType;
  status: GroupStatus;
  description: string;
  goal?: string;
  progress: number; // 0 to 100
  leaderId: string; // Member.id
  memberIds: string[]; // Member.ids
  techStack: string[];
  repoUrl?: string;
  docUrl?: string;
  createdAt: string;
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
  participantIds?: string[]; // New: Linked member IDs
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
