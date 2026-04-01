import type {
  ServerStatus,
  User,
  Member,
  CrowdLevel,
  CommitRanking,
  Schedule,
  Quote,
  AlgorithmChallenge,
  Announcement,
} from "@/types";

// Mock Members
export const mockMembers: Member[] = [
  {
    id: "1",
    name: "김철수",
    username: "chulsu_kim",
    status: "online",
    statusMessage: "시스템 아키텍처 설계 중...",
    avatar: "",
    role: "admin",
    position: "Lead Developer",
    department: "Backend",
    bio: "시스템 아키텍처와 분산 처리에 관심이 많은 백엔드 개발자입니다.",
    skills: ["Node.js", "Go", "Kubernetes", "PostgreSQL"],
    joinDate: "2024-03-01",
    metrics: {
      todayCommits: 8,
      weeklyActivity: [3, 5, 2, 7, 4, 6, 8],
    },
    socialLinks: {
      github: "https://github.com",
    },
  },
  {
    id: "2",
    name: "이영희",
    username: "younghee_lee",
    status: "online",
    statusMessage: "새로운 디자인 시스템 작업 중 🎨",
    avatar: "",
    role: "member",
    position: "UI/UX Designer",
    department: "Design",
    bio: "사용자 중심의 직관적인 디자인을 지향합니다.",
    skills: ["Figma", "React", "TailwindCSS", "Framer Motion"],
    joinDate: "2024-05-15",
    metrics: {
      todayCommits: 3,
      weeklyActivity: [1, 2, 4, 1, 5, 2, 3],
    },
    socialLinks: {
      github: "https://github.com",
      website: "https://portfolio.com",
    },
  },
  {
    id: "3",
    name: "박지훈",
    username: "jihoon_park",
    status: "online",
    statusMessage: "성능 최적화 챌린지 참여 중",
    avatar: "",
    role: "member",
    position: "Frontend Developer",
    department: "Frontend",
    bio: "성능 최적화와 사용자 경험에 진심인 프론트엔드 개발자입니다.",
    skills: ["React", "Next.js", "TypeScript", "Three.js"],
    joinDate: "2024-06-20",
    metrics: {
      todayCommits: 12,
      weeklyActivity: [5, 8, 4, 9, 11, 7, 12],
    },
    socialLinks: {
      github: "https://github.com",
    },
  },
  {
    id: "4",
    name: "정민준",
    username: "minjun_jeong",
    status: "online",
    statusMessage: "Flutter 위젯 테스트 중",
    avatar: "",
    role: "member",
    position: "Mobile Developer",
    department: "Mobile",
    bio: "플러터와 코틀린을 사랑하는 모바일 개발자입니다.",
    skills: ["Flutter", "Kotlin", "Firebase", "Dart"],
    joinDate: "2024-08-10",
    metrics: {
      todayCommits: 5,
      weeklyActivity: [2, 3, 1, 4, 6, 2, 5],
    },
  },
  {
    id: "5",
    name: "강서연",
    username: "seoyeon_kang",
    status: "online",
    statusMessage: "4월 행사 일정 조율 중 📅",
    avatar: "",
    role: "member",
    position: "PM",
    department: "Management",
    bio: "효율적인 협업 프로세스와 일정 관리를 중시합니다.",
    skills: ["Agile", "Jira", "Communication", "Data Analysis"],
    joinDate: "2024-09-05",
    metrics: {
      todayCommits: 1,
      weeklyActivity: [0, 1, 0, 2, 1, 0, 1],
    },
  },
  {
    id: "6",
    name: "조현우",
    username: "hyunwoo_cho",
    status: "away",
    statusMessage: "잠시 자리 비움 (인프라 점검)",
    avatar: "",
    role: "member",
    position: "DevOps Engineer",
    department: "Infrastructure",
    bio: "자동화와 인프라 코드화에 열정을 가진 데브옵스 엔지니어입니다.",
    skills: ["Docker", "Terraform", "AWS", "CI/CD"],
    joinDate: "2025-01-12",
    metrics: {
      todayCommits: 15,
      weeklyActivity: [10, 12, 8, 14, 11, 9, 15],
    },
  },
];

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

// Mock Schedules - 반드시 Schedule 타입을 명시적으로 지정
export const mockSchedules: Schedule[] = [
  {
    id: "1",
    title: "React 심화: Server Components",
    type: "seminar",
    status: "active",
    priority: "high",
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    location: "Online (Discord)",
    description: "Next.js 14+ 서버 컴포넌트의 동작 원리와 최적화 전략에 대해 알아봅니다.",
    participants: 12,
    isOfficial: true,
  },
  {
    id: "2",
    title: "알고리즘 스터디 (A팀)",
    type: "study",
    status: "upcoming",
    priority: "normal",
    date: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    location: "동아리방",
    description: "백준 골드 난이도 동적 계획법 문제 풀이",
    participants: 6,
  },
  {
    id: "3",
    title: "ENIAC 봄 해커톤 2026",
    type: "event",
    status: "upcoming",
    priority: "critical",
    date: new Date("2026-04-15T10:00:00").toISOString(),
    endDate: new Date("2026-04-17T18:00:00").toISOString(),
    location: "IT관 B101호",
    description: "48시간 동안 진행되는 클럽 최대의 개발 축제",
    participants: 40,
    isOfficial: true,
  },
  {
    id: "4",
    title: "신입 부원 환영회",
    type: "event",
    status: "completed",
    priority: "normal",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    location: "학교 근처 식당",
    description: "새로 들어온 26기 부원들과의 첫 만남",
    participants: 35,
    isOfficial: true,
  },
  {
    id: "5",
    title: "정기 운영진 회의",
    type: "meeting",
    status: "upcoming",
    priority: "high",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    location: "Discord",
    description: "4월 행사 일정 조율 및 예산 보고",
    participants: 5,
    isOfficial: true,
  },
  {
    id: "6",
    title: "Typescript 입문 세미나",
    type: "seminar",
    status: "completed",
    priority: "normal",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    location: "공학관 201호",
    description: "자바스크립트 개발자를 위한 타입스크립트 기초",
    participants: 20,
    isOfficial: true,
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
    startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
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
];

export function getRandomServerStatus(): ServerStatus {
  return {
    cpu: Math.random() * 60 + 20,
    ram: {
      used: Math.floor(Math.random() * 4096) + 6144,
      total: 16384,
      percentage: Math.random() * 30 + 40,
    },
    uptime: mockServerStatus.uptime + Math.floor(Date.now() / 1000),
    temperature: Math.floor(Math.random() * 15) + 45,
  };
}

export function getRandomCrowdLevel(): CrowdLevel {
  const levels: CrowdLevel[] = ["low", "medium", "high"];
  return levels[Math.floor(Math.random() * 3)];
}
