import { Member, Group, Schedule, ClearanceType, Announcement } from "@/types";
import { mockMembers, mockGroups, mockSchedules, mockAnnouncements } from "./mockData";

export interface ServerUser {
  id: string;
  username: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "member";
  clearance: ClearanceType;
  isApproved: boolean;
  avatar?: string;
  resetRequested?: boolean;
  resetRequestReason?: string;
  resetRequestedAt?: string;
}

const globalForDb = global as unknown as {
  serverUsers: ServerUser[];
  serverGroups: Group[];
  serverSchedules: Schedule[];
  serverMembers: Member[];
  serverAnnouncements: Announcement[];
};

export const serverUsers: ServerUser[] = globalForDb.serverUsers || [
  {
    id: "admin-id",
    username: "dev_admin",
    name: "Root Dev Admin",
    email: "dev@eniac.com",
    password: "dev123",
    role: "admin",
    clearance: "root",
    isApproved: true,
  },
  {
    id: "officer-id",
    username: "officer_admin",
    name: "Officer Admin",
    email: "officer@eniac.com",
    password: "officer123",
    role: "admin",
    clearance: "officer",
    isApproved: true,
  },
  {
    id: "user-id",
    username: "user",
    name: "Regular User",
    email: "user@example.com",
    password: "user123",
    role: "member",
    clearance: "member",
    isApproved: true,
  },
  {
    id: "user-id-2",
    username: "user-2",
    name: "Regular User 2",
    email: "user-2@example.com",
    password: "user123",
    role: "member",
    clearance: "member",
    isApproved: false,
  },
  ...mockMembers.map((m) => ({
    id: m.id,
    username: m.username || m.name,
    name: m.name,
    email: m.email || `${m.username || m.id}@eniac.com`,
    role: (m.role === "admin" ? "admin" : "member") as "admin" | "member",
    clearance: (m.role === "admin" ? "root" : "member") as ClearanceType,
    isApproved: m.isApproved !== undefined ? m.isApproved : true,
    avatar: m.avatar,
  })),
];

export const serverGroups: Group[] = globalForDb.serverGroups || [...mockGroups];
export const serverSchedules: Schedule[] = globalForDb.serverSchedules || [...mockSchedules];
export const serverMembers: Member[] = globalForDb.serverMembers || [
  {
    id: "admin-id",
    name: "Root Dev Admin",
    username: "dev_admin",
    email: "dev@eniac.com",
    status: "online",
    statusMessage: "Root administrator node.",
    avatar: "",
    role: "admin",
    clearance: "root",
    isApproved: true,
    position: "System Administrator",
    department: "Infrastructure",
    bio: "Core system developer and network administrator.",
    skills: ["System Admin", "Security", "Infrastructure"],
    joinDate: "2024-01-01",
    metrics: { todayCommits: 5, weeklyActivity: [2, 4, 3, 5, 2, 4, 5] },
  },
  {
    id: "officer-id",
    name: "Officer Admin",
    username: "officer_admin",
    email: "officer@eniac.com",
    status: "online",
    statusMessage: "Officer administration node.",
    avatar: "",
    role: "admin",
    clearance: "officer",
    isApproved: true,
    position: "Club Officer",
    department: "Management",
    bio: "Operations manager and coordinator.",
    skills: ["Management", "Operations"],
    joinDate: "2024-01-02",
    metrics: { todayCommits: 3, weeklyActivity: [1, 2, 2, 3, 1, 2, 3] },
  },
  {
    id: "user-id",
    name: "Regular User",
    username: "user",
    email: "user@example.com",
    status: "online",
    statusMessage: "Active node in ENIAC mesh network.",
    avatar: "",
    role: "member",
    clearance: "member",
    isApproved: true,
    position: "Active Node",
    department: "Frontend",
    bio: "Frontend engineer and design system contributor.",
    skills: ["JavaScript", "HTML", "CSS"],
    joinDate: "2024-02-01",
    metrics: { todayCommits: 2, weeklyActivity: [1, 1, 0, 2, 1, 1, 2] },
  },
  {
    id: "user-id-2",
    name: "Regular User 2",
    username: "user-2",
    email: "user-2@example.com",
    status: "offline",
    statusMessage: "Awaiting activation.",
    avatar: "",
    role: "member",
    clearance: "member",
    isApproved: false,
    position: "Pending Node",
    department: "Management",
    bio: "Pending validation.",
    skills: [],
    joinDate: "2026-05-27",
    metrics: { todayCommits: 0, weeklyActivity: [0, 0, 0, 0, 0, 0, 0] },
  },
  ...mockMembers.map(m => ({ ...m, clearance: (m.role === "admin" ? "root" : "member") as ClearanceType }))
];
export const serverAnnouncements: Announcement[] = globalForDb.serverAnnouncements || [...mockAnnouncements];

if (process.env.NODE_ENV !== "production") {
  globalForDb.serverUsers = serverUsers;
  globalForDb.serverGroups = serverGroups;
  globalForDb.serverSchedules = serverSchedules;
  globalForDb.serverMembers = serverMembers;
  globalForDb.serverAnnouncements = serverAnnouncements;
}
