<div align="center">

# 🖥️ ENIAC Dashboard

### 컴퓨터공학 동아리를 위한 사이버펑크 실시간 대시보드

> eDEX-UI에서 영감을 받은 사이버펑크(시안/트론 테마, 스캔라인·글리치 효과) 디자인의
> 동아리 통합 대시보드입니다. 일정·멤버·그룹·알고리즘·GitHub 활동을 한 화면에서 관리합니다.

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

![NextAuth](https://img.shields.io/badge/NextAuth-5-purple?style=flat-square)
![Socket.IO](https://img.shields.io/badge/Socket.IO-realtime-010101?style=flat-square&logo=socketdotio)
![type](https://img.shields.io/badge/2026-team_project-orange?style=flat-square)

</div>

<!-- 📸 대시보드 스크린샷을 추가하세요: docs/images/dashboard.png -->
<!--
<div align="center">
  <img src="./docs/images/dashboard.png" width="90%" alt="ENIAC Dashboard"/>
</div>
-->

---

## 📑 목차

- [프로젝트 개요](#-프로젝트-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [실행 방법](#-실행-방법)
- [팀 & 기여](#-팀--기여)

---

## 📌 프로젝트 개요

컴퓨터공학 동아리의 일정, 멤버, 그룹 활동, 알고리즘 스터디, GitHub 활동을 한곳에서 관리하는
실시간 웹 대시보드입니다. 단순 관리 도구를 넘어, **eDEX-UI에서 영감을 받은 사이버펑크 UI**
(시안/트론 컬러, 스캔라인, 글리치, 부팅 애니메이션)로 동아리만의 개성을 표현했습니다.

---

## ✨ 주요 기능

| 모듈 | 설명 |
|------|------|
| 📅 **일정 (Schedule)** | 동아리 일정 관리 |
| 👥 **멤버 (Members)** | 멤버 정보·현황 관리 |
| 🧩 **그룹 (Groups)** | 스터디·프로젝트 그룹 관리 |
| 🧮 **알고리즘 (Algorithm)** | 알고리즘 스터디 현황 |
| 🐙 **GitHub 연동** | 멤버 GitHub 활동 표시 |
| 🔐 **인증 (Auth)** | NextAuth 기반 로그인 |
| ⚡ **실시간 업데이트** | Socket.IO 기반 실시간 데이터 |

---

## 🛠 기술 스택

| 구분 | 기술 |
|------|------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **언어** | TypeScript |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **상태관리** | Zustand, TanStack Query |
| **인증** | NextAuth 5 |
| **실시간** | Socket.IO |
| **디자인 영감** | eDEX-UI (cyberpunk / tron theme) |

---

## 🚀 실행 방법

모든 명령은 `dashboard/` 디렉터리에서 실행합니다.

```bash
git clone https://github.com/IksangJeong/ENIAC-Project.git
cd ENIAC-Project/dashboard
npm install
npm run dev        # http://localhost:3000
```

---

## 📂 프로젝트 구조

```
ENIAC-Project/
└── dashboard/              # Next.js 대시보드 (메인)
    └── src/
        ├── app/            # App Router (schedule, members, groups, algorithm, github, auth, api)
        ├── components/     # ui · layout · dashboard · modules · mobile
        ├── stores/         # Zustand 상태관리
        ├── hooks/          # 커스텀 훅
        └── lib/            # 유틸리티
```

---

## 👥 팀 & 기여

> 컴퓨터공학 동아리 **2026 팀 프로젝트**

| 이름 | 역할 |
|------|------|
| **정익상** | 메인 개발 · UI/UX 디자인 · 프로젝트 총괄 |
| seru1027 | 보조 개발 |

---

<div align="center">
<sub>2026 · ENIAC Team Project</sub>
</div>
