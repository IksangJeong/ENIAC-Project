export const DEPARTMENTS = [
  { id: "Backend", label: "백엔드", icon: "⚙️", color: "#3b82f6" },
  { id: "Frontend", label: "프론트엔드", icon: "🎨", color: "#10b981" },
  { id: "Design", label: "디자인", icon: "✨", color: "#ec4899" },
  { id: "Mobile", label: "모바일", icon: "📱", color: "#f59e0b" },
  { id: "Infrastructure", label: "인프라", icon: "☁️", color: "#8b5cf6" },
  { id: "Management", label: "매니지먼트", icon: "📊", color: "#64748b" },
] as const;

export type DepartmentId = (typeof DEPARTMENTS)[number]["id"];

export const POSITION_SUGGESTIONS: Record<DepartmentId, string[]> = {
  Backend: ["Lead Backend Engineer", "Server Developer", "Database Architect", "API Developer"],
  Frontend: ["Lead Frontend Engineer", "UI Developer", "React Specialist", "Web Engineer"],
  Design: ["UI/UX Designer", "Product Designer", "Brand Designer", "Visual Artist"],
  Mobile: ["iOS Developer", "Android Developer", "Flutter Developer", "React Native Engineer"],
  Infrastructure: ["DevOps Engineer", "Cloud Architect", "SRE", "System Administrator"],
  Management: ["Product Manager", "Project Manager", "Team Leader", "Developer Relations"],
};
