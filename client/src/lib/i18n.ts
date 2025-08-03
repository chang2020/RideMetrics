import { createContext, useContext } from "react";

export type Language = "en" | "ko";

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.groups": "Groups",
    "nav.activities": "Activities",
    "nav.stats": "Statistics",
    "strava.connect": "Connect Strava",
    "strava.connected": "Strava Connected",

    // Dashboard
    "dashboard.connectStrava.title": "Connect with Strava to get started!",
    "dashboard.connectStrava.description": "Automatically sync your riding data and share achievements with your groups.",
    "dashboard.weeklyDistance": "This Week",
    "dashboard.avgSpeed": "Average Speed",
    "dashboard.elevation": "Total Elevation",
    "dashboard.recentActivities": "Recent Activities",
    "dashboard.noActivities": "No activities yet.",
    "dashboard.firstRide": "Record your first ride!",
    "dashboard.createGroup": "Create New Group",
    "dashboard.createGroupDescription": "Start riding with friends and share your achievements!",
    "dashboard.myGroups": "My Groups",
    "dashboard.noGroups": "You haven't joined any groups yet.",
    "dashboard.firstGroup": "Create your first group!",
    "dashboard.groupLeaderboard": "Group Leaderboard",
    "dashboard.selectGroup": "Select a group",
    "dashboard.selectGroupPrompt": "Select a group to view leaderboard.",
    "dashboard.groupActivity": "Group Activity",
    "dashboard.noGroupActivity": "No group activities yet.",
    "dashboard.joinAndStart": "Join a group and start activities!",
    "dashboard.weeklyPerformance": "Weekly Performance",
    "dashboard.lastWeek": "vs last week",

    // Groups
    "groups.title": "Groups",
    "groups.description": "Join cycling groups and enjoy riding together",
    "groups.createGroup": "Create Group",
    "groups.noGroups": "No groups yet",
    "groups.createFirstGroup": "Create your first cycling group and start riding with friends!",
    "groups.createFirstGroupButton": "Create First Group",
    "groups.public": "Public",
    "groups.private": "Private",
    "groups.inviteOnly": "Invite Only",
    "groups.member": "member",
    "groups.members": "members",
    "groups.thisWeek": "This week",
    "groups.suggestedGroups": "Suggested Groups",
    "groups.noSuggestions": "No groups to suggest.",
    "groups.moreSuggestions": "More groups will appear here as they are created.",

    // Create Group Modal
    "createGroup.title": "Create New Group",
    "createGroup.name": "Group Name",
    "createGroup.namePlaceholder": "e.g., Seoul Riders",
    "createGroup.description": "Description",
    "createGroup.descriptionPlaceholder": "Enter a brief description of your group",
    "createGroup.visibility": "Privacy Settings",
    "createGroup.cancel": "Cancel",
    "createGroup.create": "Create Group",
    "createGroup.creating": "Creating...",

    // Stats
    "stats.title": "Statistics",
    "stats.weeklyData": "Last 4 weeks",
    "stats.loading": "Loading chart...",
    "stats.noData": "No activity data available. Start your first ride!",
    "stats.distance": "Distance (km)",
    "stats.speed": "Speed (km/h)",
    "stats.avgSpeed": "Average Speed",

    // Time
    "time.week1": "Week 1",
    "time.week2": "Week 2", 
    "time.week3": "Week 3",
    "time.week4": "Week 4",

    // General
    "general.loading": "Loading...",
    "general.noDescription": "No description available.",
    "general.newGroup": "New group",
    "general.admin": "Admin",
  },
  ko: {
    // Navigation
    "nav.dashboard": "대시보드",
    "nav.groups": "그룹",
    "nav.activities": "활동",
    "nav.stats": "통계",
    "strava.connect": "Strava 연결",
    "strava.connected": "Strava 연결됨",

    // Dashboard
    "dashboard.connectStrava.title": "Strava와 연결하여 시작하세요!",
    "dashboard.connectStrava.description": "라이딩 데이터를 자동으로 동기화하고 그룹과 함께 성과를 공유하세요.",
    "dashboard.weeklyDistance": "이번 주 거리",
    "dashboard.avgSpeed": "평균 속도",
    "dashboard.elevation": "총 고도 상승",
    "dashboard.recentActivities": "최근 활동",
    "dashboard.noActivities": "아직 활동이 없습니다.",
    "dashboard.firstRide": "첫 번째 라이딩을 기록해보세요!",
    "dashboard.createGroup": "새 그룹 만들기",
    "dashboard.createGroupDescription": "친구들과 함께 라이딩하고 성과를 공유해보세요!",
    "dashboard.myGroups": "내 그룹",
    "dashboard.noGroups": "아직 그룹에 가입하지 않았습니다.",
    "dashboard.firstGroup": "첫 번째 그룹을 만들어보세요!",
    "dashboard.groupLeaderboard": "그룹 순위",
    "dashboard.selectGroup": "그룹을 선택하세요",
    "dashboard.selectGroupPrompt": "그룹 순위를 보려면 그룹을 선택하세요.",
    "dashboard.groupActivity": "그룹 활동",
    "dashboard.noGroupActivity": "아직 그룹 활동이 없습니다.",
    "dashboard.joinAndStart": "그룹에 가입하고 활동을 시작해보세요!",
    "dashboard.weeklyPerformance": "주간 성과",
    "dashboard.lastWeek": "지난 주 대비",

    // Groups
    "groups.title": "그룹",
    "groups.description": "사이클링 그룹에 참여하고 함께 라이딩을 즐겨보세요",
    "groups.createGroup": "그룹 만들기",
    "groups.noGroups": "아직 그룹이 없습니다",
    "groups.createFirstGroup": "첫 번째 사이클링 그룹을 만들어 친구들과 함께 라이딩을 시작해보세요!",
    "groups.createFirstGroupButton": "첫 번째 그룹 만들기",
    "groups.public": "공개",
    "groups.private": "비공개",
    "groups.inviteOnly": "초대만",
    "groups.member": "명",
    "groups.members": "명",
    "groups.thisWeek": "이번 주",
    "groups.suggestedGroups": "추천 그룹",
    "groups.noSuggestions": "추천할 그룹이 없습니다.",
    "groups.moreSuggestions": "더 많은 그룹이 생기면 여기에 표시됩니다.",

    // Create Group Modal
    "createGroup.title": "새 그룹 만들기",
    "createGroup.name": "그룹 이름",
    "createGroup.namePlaceholder": "예: 서울 라이더스",
    "createGroup.description": "설명",
    "createGroup.descriptionPlaceholder": "그룹에 대한 간단한 설명을 입력하세요",
    "createGroup.visibility": "공개 설정",
    "createGroup.cancel": "취소",
    "createGroup.create": "그룹 만들기",
    "createGroup.creating": "생성 중...",

    // Stats
    "stats.title": "통계",
    "stats.weeklyData": "지난 4주",
    "stats.loading": "차트를 로딩 중...",
    "stats.noData": "활동 데이터가 없습니다. 첫 번째 라이딩을 시작해보세요!",
    "stats.distance": "거리 (km)",
    "stats.speed": "속도 (km/h)",
    "stats.avgSpeed": "평균 속도",

    // Time
    "time.week1": "1주차",
    "time.week2": "2주차",
    "time.week3": "3주차", 
    "time.week4": "4주차",

    // General
    "general.loading": "로딩 중...",
    "general.noDescription": "그룹 설명이 없습니다.",
    "general.newGroup": "새 그룹",
    "general.admin": "관리자",
  }
};