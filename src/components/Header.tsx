import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  TreePine, 
  PieChart, 
  Printer, 
  PlusCircle, 
  RotateCcw,
  GraduationCap,
  BookmarkCheck,
  Users,
  ChevronDown,
  ShieldCheck,
  Lock,
  Clock
} from 'lucide-react';
import { StudentProfile, BookEntry } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: StudentProfile;
  books: BookEntry[];
  totalStudentsCount?: number;
  pendingStudentsCount?: number;
  isTeacherLoggedIn: boolean;
  onOpenAddModal: () => void;
  onOpenStudentManager: () => void;
  onOpenTeacherLogin: () => void;
  onOpenTeacherDashboard: () => void;
  onOpenFirebaseStatus?: () => void;
  onResetData: () => void;
  onTriggerPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  books,
  totalStudentsCount = 1,
  pendingStudentsCount = 0,
  isTeacherLoggedIn,
  onOpenAddModal,
  onOpenStudentManager,
  onOpenTeacherLogin,
  onOpenTeacherDashboard,
  onOpenFirebaseStatus,
  onResetData,
  onTriggerPrint
}) => {
  const totalBooks = books.length;
  const totalPages = books.reduce((acc, curr) => acc + (curr.pages || 0), 0);
  const progressPercent = Math.min(100, Math.round((totalBooks / (profile.targetCount || 50)) * 100));

  const navItems = [
    { id: 'bankbook', label: '독서 통장', icon: BookOpen, tag: `${totalBooks}권 기록` },
    { id: 'worksheet', label: '독후 활동장', icon: Sparkles, tag: '9가지 양식' },
    { id: 'tree', label: '독서 나무 & 스티커', icon: TreePine, tag: `${progressPercent}%` },
    { id: 'stats', label: '독서 분석', icon: PieChart, tag: '장르/통계' },
    { id: 'profile', label: '학생 관리 & 다짐', icon: GraduationCap, tag: `${totalStudentsCount}명 등록` },
    { id: 'print', label: '제출용 인쇄', icon: Printer, tag: 'A4 양식' },
  ];

  return (
    <header className="bg-white border-b-2 border-amber-200 shadow-sm sticky top-0 z-30 no-print">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5" />
              에듀트랙 표준 양식
            </span>
            <h1 className="font-jua text-base sm:text-lg md:text-xl tracking-wide flex items-center gap-1.5">
              <span>초등학생 독서 기록장</span>
              <span className="text-amber-200 text-sm font-normal hidden md:inline">| 즐거운 책 읽기 습관</span>
            </h1>
          </div>

          {/* Teacher Login / Admin Badge & Student Badge */}
          <div className="flex items-center gap-2 sm:gap-2.5 text-xs">
            
            {/* Teacher Auth / Admin Center Button */}
            {isTeacherLoggedIn ? (
              <button
                type="button"
                onClick={onOpenTeacherDashboard}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded-full border border-emerald-400/50 flex items-center gap-1.5 font-bold transition-all hover:scale-102 active:scale-98 shadow-sm cursor-pointer"
                title="교사 관리자 센터 (신청 승인, 비밀번호 확인, 학생 편집)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                <span>교사 관리센터</span>
                {pendingStudentsCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold animate-pulse">
                    {pendingStudentsCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenTeacherLogin}
                className="bg-stone-900/40 hover:bg-stone-900/60 backdrop-blur-sm text-amber-200 hover:text-white px-3 py-1 rounded-full border border-amber-300/40 flex items-center gap-1.5 font-bold transition-all hover:scale-102 active:scale-98 cursor-pointer"
                title="선생님 비밀번호로 로그인하여 학생 승인 및 비밀번호를 관리하세요"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>선생님 로그인</span>
                {pendingStudentsCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold animate-bounce">
                    신청 {pendingStudentsCount}
                  </span>
                )}
              </button>
            )}

            {/* Cloud DB Status Indicator Button */}
            {onOpenFirebaseStatus && (
              <button
                type="button"
                onClick={onOpenFirebaseStatus}
                className="bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 hover:text-white px-2.5 py-1 rounded-full border border-emerald-400/40 flex items-center gap-1 font-bold transition-all shadow-xs cursor-pointer"
                title="Google Firebase 클라우드 데이터베이스 실시간 연동 상태"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                <span className="text-[11px]">클라우드 DB</span>
              </button>
            )}

            {/* Student Profile Quick Switcher Button */}
            <div 
              onClick={onOpenStudentManager}
              className="bg-black/20 hover:bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98 shadow-sm group"
              title="클릭하여 다른 학생으로 전환하거나 새 학생을 등록하세요"
            >
              <span className="font-semibold hidden sm:inline">{profile.school}</span>
              <span className="text-amber-200 font-bold">{profile.grade}학년 {profile.classRoom}반 {profile.studentNumber}번</span>
              <span className="font-bold underline underline-offset-2 flex items-center gap-1">
                <span>{profile.name}</span>
                <span className="text-[11px] opacity-80 group-hover:opacity-100">{profile.avatar}</span>
              </span>
              <div className="flex items-center gap-1 pl-1 border-l border-white/20 text-amber-200 text-[11px] font-bold">
                <Users className="w-3 h-3" />
                <span className="hidden md:inline">학생 관리</span>
                <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </div>

            <button
              type="button"
              onClick={onResetData}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1"
              title="예시 데이터 다시 불러오기"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">예시 초기화</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar with Navigation & Stats */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Notebook Navigation Tabs */}
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-200 -translate-y-0.5'
                      : 'bg-stone-100 text-stone-700 hover:bg-amber-100/60 hover:text-amber-900 border border-stone-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-600'}`} />
                  <span>{item.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                    isActive ? 'bg-amber-700 text-amber-100' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {item.tag}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Goal Progress */}
          <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-3">
            {/* Reading Mini Progress bar */}
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-amber-800 font-medium">목표 달성률 ({totalBooks}/{profile.targetCount}권)</span>
                <div className="w-28 sm:w-32 bg-amber-200 rounded-full h-2 mt-0.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <span className="font-jua text-amber-900 text-base">{progressPercent}%</span>
            </div>

            {/* Add Book Button */}
            <button
              id="header-add-book-btn"
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-emerald-200 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>새 책 기록하기</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
