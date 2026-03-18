import type {
  ServerStatus,
  User,
  CrowdLevel,
  CommitRanking,
  Schedule,
  Quote,
  AlgorithmChallenge,
  Announcement,
} from "@/types";

// Mock Server Status
export const mockServerStatus: ServerStatus = {
  cpu: 45.2,
  ram: {
    used: 8192,
    total: 16384,
    percentage: 50,
  },
  uptime: 345600, // 4 days
  temperature: 52,
};

// Mock Users
export const mockUsers: User[] = [
  { id: "1", name: "김철수", status: "online", avatar: "" },
  { id: "2", name: "이영희", status: "online", avatar: "" },
  { id: "3", name: "박지훈", status: "online", avatar: "" },
  { id: "4", name: "정민준", status: "online", avatar: "" },
  { id: "5", name: "강서연", status: "online", avatar: "" },
  { id: "6", name: "조현우", status: "away", avatar: "" },
  { id: "7", name: "윤수빈", status: "offline", avatar: "" },
  { id: "8", name: "임도현", status: "offline", avatar: "" },
];

// Mock Crowd Level
export const mockCrowdLevel: CrowdLevel = "medium";

// Mock Commit Rankings
export const mockCommitRankings: CommitRanking[] = [
  {
    rank: 1,
    userId: "1",
    username: "김철수",
    avatar: "",
    commits: 24,
    trend: "up",
  },
  {
    rank: 2,
    userId: "3",
    username: "박지훈",
    avatar: "",
    commits: 18,
    trend: "same",
  },
  {
    rank: 3,
    userId: "2",
    username: "이영희",
    avatar: "",
    commits: 15,
    trend: "up",
  },
  {
    rank: 4,
    userId: "4",
    username: "정민준",
    avatar: "",
    commits: 12,
    trend: "down",
  },
  {
    rank: 5,
    userId: "5",
    username: "강서연",
    avatar: "",
    commits: 8,
    trend: "same",
  },
];

// Mock Schedules
export const mockSchedules: Schedule[] = [
  {
    id: "1",
    title: "Spring Boot 스터디",
    type: "study",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
    location: "동아리방",
    participants: 8,
  },
  {
    id: "2",
    title: "알고리즘 세미나: 그래프 탐색",
    type: "seminar",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days
    location: "공학관 302호",
    participants: 15,
  },
  {
    id: "3",
    title: "ENIAC 정기 모임",
    type: "event",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week
    location: "학생회관 세미나실",
    participants: 25,
  },
  {
    id: "4",
    title: "React 심화 스터디",
    type: "study",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    location: "동아리방",
    participants: 6,
  },
];

// Mock Quote
export const mockQuote: Quote = {
  quote:
    "프로그래밍은 생각의 도구입니다. 컴퓨터에게 무엇을 할지 알려주는 것이 아니라, 문제를 어떻게 생각할지를 배우는 것입니다.",
  author: "Edsger W. Dijkstra",
  category: "Programming",
};

// Mock Algorithm Challenges
export const mockChallenges: AlgorithmChallenge[] = [
  {
    id: "1",
    problemTitle: "이진 탐색 트리 순회",
    difficulty: "medium",
    status: "in_progress",
    startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Started 30 min ago
    participants: [
      { userId: "1", username: "김철수", avatar: "", solved: true, solveTime: 1200 },
      { userId: "2", username: "이영희", avatar: "", solved: true, solveTime: 1450 },
      { userId: "3", username: "박지훈", avatar: "", solved: false },
      { userId: "4", username: "정민준", avatar: "", solved: false },
      { userId: "5", username: "강서연", avatar: "", solved: true, solveTime: 980 },
      { userId: "6", username: "조현우", avatar: "", solved: false },
    ],
  },
];

// Mock Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "3월 정기 모임 안내: 3/25(토) 오후 2시",
    content: "3월 정기 모임이 예정되어 있습니다.",
    createdAt: new Date().toISOString(),
    priority: "important",
    author: "운영진",
  },
  {
    id: "2",
    title: "서버 점검 예정: 3/20 새벽 2시~4시",
    content: "서버 점검이 예정되어 있습니다.",
    createdAt: new Date().toISOString(),
    priority: "urgent",
    author: "서버팀",
  },
  {
    id: "3",
    title: "신규 프로젝트 팀원 모집 중",
    content: "새로운 프로젝트 팀원을 모집합니다.",
    createdAt: new Date().toISOString(),
    priority: "normal",
    author: "프로젝트팀",
  },
  {
    id: "4",
    title: "알고리즘 스터디 신청 마감 임박",
    content: "알고리즘 스터디 신청이 곧 마감됩니다.",
    createdAt: new Date().toISOString(),
    priority: "normal",
    author: "스터디팀",
  },
];

// Function to simulate real-time data changes
export function getRandomServerStatus(): ServerStatus {
  return {
    cpu: Math.random() * 60 + 20, // 20-80%
    ram: {
      used: Math.floor(Math.random() * 4096) + 6144, // 6-10 GB
      total: 16384,
      percentage: Math.random() * 30 + 40, // 40-70%
    },
    uptime: mockServerStatus.uptime + Math.floor(Date.now() / 1000),
    temperature: Math.floor(Math.random() * 15) + 45, // 45-60°C
  };
}

export function getRandomCrowdLevel(): CrowdLevel {
  const levels: CrowdLevel[] = ["low", "medium", "high"];
  return levels[Math.floor(Math.random() * 3)];
}
