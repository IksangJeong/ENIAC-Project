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
export const serverMembers: Member[] = globalForDb.serverMembers || [...mockMembers.map(m => ({ ...m, clearance: (m.role === "admin" ? "root" : "member") as ClearanceType }))];
export const serverAnnouncements: Announcement[] = globalForDb.serverAnnouncements || [...mockAnnouncements];

if (process.env.NODE_ENV !== "production") {
  globalForDb.serverUsers = serverUsers;
  globalForDb.serverGroups = serverGroups;
  globalForDb.serverSchedules = serverSchedules;
  globalForDb.serverMembers = serverMembers;
  globalForDb.serverAnnouncements = serverAnnouncements;
}
