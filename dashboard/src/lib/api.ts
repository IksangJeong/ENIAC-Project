import { Member, Group, Schedule, ServerStatus, Announcement } from "@/types";

export const fetchMembers = async (): Promise<Member[]> => {
  const response = await fetch("/api/members");
  if (!response.ok) {
    throw new Error("Failed to fetch members");
  }
  return response.json();
};

export const fetchGroups = async (): Promise<Group[]> => {
  const response = await fetch("/api/groups");
  if (!response.ok) {
    throw new Error("Failed to fetch sub-clusters");
  }
  return response.json();
};

export const createGroup = async (group: Group): Promise<Group> => {
  const response = await fetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(group),
  });
  if (!response.ok) {
    throw new Error("Failed to create sub-cluster");
  }
  return response.json();
};

export const updateGroup = async (id: string, updates: Partial<Group>): Promise<Group> => {
  const response = await fetch(`/api/groups?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error("Failed to update sub-cluster");
  }
  return response.json();
};

export const deleteGroup = async (id: string): Promise<void> => {
  const response = await fetch(`/api/groups?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete sub-cluster");
  }
};

export const fetchSchedules = async (): Promise<Schedule[]> => {
  const response = await fetch("/api/schedules");
  if (!response.ok) {
    throw new Error("Failed to fetch timeline operations");
  }
  return response.json();
};

export const createSchedule = async (schedule: Schedule): Promise<Schedule> => {
  const response = await fetch("/api/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  });
  if (!response.ok) {
    throw new Error("Failed to create operation schedule");
  }
  return response.json();
};

export const updateSchedule = async (id: string, updates: Partial<Schedule>): Promise<Schedule> => {
  const response = await fetch(`/api/schedules?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error("Failed to update operation schedule");
  }
  return response.json();
};

export const deleteSchedule = async (id: string): Promise<void> => {
  const response = await fetch(`/api/schedules?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete operation schedule");
  }
};

export const fetchAnnouncements = async (): Promise<Announcement[]> => {
  const response = await fetch("/api/announcements");
  if (!response.ok) {
    throw new Error("Failed to fetch broadcasts");
  }
  return response.json();
};

export const createAnnouncement = async (announcement: Partial<Announcement>): Promise<Announcement> => {
  const response = await fetch("/api/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(announcement),
  });
  if (!response.ok) {
    throw new Error("Failed to post broadcast");
  }
  return response.json();
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  const response = await fetch(`/api/announcements?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete broadcast");
  }
};

export const fetchServerStatus = async (): Promise<ServerStatus> => {
  const response = await fetch("/api/server/status");
  if (!response.ok) {
    throw new Error("Failed to fetch server metrics");
  }
  return response.json();
};
