import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookEntry, 
  ActivityData, 
  StudentProfile 
} from './types';
import { 
  initialStudents,
  initialBooksByStudent, 
  initialActivitiesByStudent,
  initialBooks,
  initialActivities
} from './data/initialData';
import { Header } from './components/Header';
import { ProfileSection } from './components/ProfileSection';
import { ReadingBankbook } from './components/ReadingBankbook';
import { ActivityWorksheetView } from './components/ActivityWorksheetView';
import { ActivityEditorModal } from './components/ActivityEditorModal';
import { StudentManagerModal } from './components/StudentManagerModal';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { ReadingTree } from './components/ReadingTree';
import { ReadingAnalytics } from './components/ReadingAnalytics';
import { PrintablePortfolio } from './components/PrintablePortfolio';

export default function App() {
  // 1. Teacher Authentication & Password State
  const [teacherPassword, setTeacherPassword] = useState<string>(() => {
    return localStorage.getItem('edutrack_teacher_password') || '1234';
  });

  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('edutrack_teacher_logged_in') === 'true';
  });

  const [isTeacherLoginModalOpen, setIsTeacherLoginModalOpen] = useState(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // 2. Students List
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('edutrack_students_list');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // Check old single profile
    const oldProfile = localStorage.getItem('edutrack_reading_profile');
    if (oldProfile) {
      try {
        const parsedOld = JSON.parse(oldProfile);
        return [{
          ...parsedOld,
          id: parsedOld.id || 'student-1',
          status: 'approved',
          password: '123'
        }];
      } catch (e) {}
    }
    return initialStudents;
  });

  // 3. Active Student ID
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    const saved = localStorage.getItem('edutrack_current_student_id');
    if (saved) return saved;
    return initialStudents[0].id;
  });

  // 4. Books & Activities per Student
  const [booksByStudent, setBooksByStudent] = useState<Record<string, BookEntry[]>>(() => {
    const saved = localStorage.getItem('edutrack_books_by_student');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Check old books
    const oldBooks = localStorage.getItem('edutrack_reading_books');
    if (oldBooks) {
      try {
        return {
          ...initialBooksByStudent,
          'student-1': JSON.parse(oldBooks)
        };
      } catch (e) {}
    }
    return initialBooksByStudent;
  });

  const [activitiesByStudent, setActivitiesByStudent] = useState<Record<string, ActivityData[]>>(() => {
    const saved = localStorage.getItem('edutrack_activities_by_student');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Check old activities
    const oldActs = localStorage.getItem('edutrack_reading_activities');
    if (oldActs) {
      try {
        return {
          ...initialActivitiesByStudent,
          'student-1': JSON.parse(oldActs)
        };
      } catch (e) {}
    }
    return initialActivitiesByStudent;
  });

  // Active student profile, books, and activities
  const currentProfile: StudentProfile = useMemo(() => {
    const found = students.find(s => s.id === currentStudentId);
    if (found) return found;
    const approved = students.find(s => s.status !== 'pending');
    return approved || students[0] || initialStudents[0];
  }, [students, currentStudentId]);

  const books: BookEntry[] = useMemo(() => {
    return booksByStudent[currentProfile.id] || [];
  }, [booksByStudent, currentProfile.id]);

  const activities: ActivityData[] = useMemo(() => {
    return activitiesByStudent[currentProfile.id] || [];
  }, [activitiesByStudent, currentProfile.id]);

  // Book counts map
  const booksCountByStudent = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach(st => {
      map[st.id] = (booksByStudent[st.id] || []).length;
    });
    return map;
  }, [students, booksByStudent]);

  // Pending students count
  const pendingStudentsCount = useMemo(() => {
    return students.filter(s => s.status === 'pending').length;
  }, [students]);

  // Tab & Modal State
  const [activeTab, setActiveTab] = useState<string>('bankbook');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isStudentManagerOpen, setIsStudentManagerOpen] = useState(false);
  const [selectedBookForActivity, setSelectedBookForActivity] = useState<BookEntry | undefined>();
  const [editingActivity, setEditingActivity] = useState<ActivityData | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('edutrack_students_list', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edutrack_current_student_id', currentStudentId);
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem('edutrack_books_by_student', JSON.stringify(booksByStudent));
  }, [booksByStudent]);

  useEffect(() => {
    localStorage.setItem('edutrack_activities_by_student', JSON.stringify(activitiesByStudent));
  }, [activitiesByStudent]);

  useEffect(() => {
    localStorage.setItem('edutrack_teacher_password', teacherPassword);
  }, [teacherPassword]);

  useEffect(() => {
    localStorage.setItem('edutrack_teacher_logged_in', isTeacherLoggedIn ? 'true' : 'false');
  }, [isTeacherLoggedIn]);

  // Teacher Auth Handlers
  const handleTeacherLoginSuccess = () => {
    setIsTeacherLoggedIn(true);
    setIsTeacherDashboardOpen(true);
  };

  const handleLogoutTeacher = () => {
    setIsTeacherLoggedIn(false);
    setIsTeacherDashboardOpen(false);
  };

  const handleChangeTeacherPassword = (newPw: string) => {
    setTeacherPassword(newPw);
  };

  // Student Approval Handlers
  const handleApproveStudent = (studentId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          status: 'approved',
          approvedAt: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    }));
  };

  const handleRejectStudent = (studentId: string, reason?: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          status: 'rejected',
          rejectReason: reason || '신청 정보 불일치'
        };
      }
      return s;
    }));
  };

  const handleBatchApprove = () => {
    const today = new Date().toISOString().split('T')[0];
    setStudents(prev => prev.map(s => {
      if (s.status === 'pending') {
        return {
          ...s,
          status: 'approved',
          approvedAt: today
        };
      }
      return s;
    }));
  };

  // Student Management Handlers
  const handleSelectStudent = (studentId: string) => {
    setCurrentStudentId(studentId);
  };

  const handleAddStudent = (newStudentData: Omit<StudentProfile, 'id'>, isTeacher?: boolean) => {
    const newId = `student-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const newStudent: StudentProfile = {
      ...newStudentData,
      id: newId,
      status: isTeacher ? 'approved' : 'pending',
      appliedAt: today,
      approvedAt: isTeacher ? today : undefined,
    };
    setStudents(prev => [...prev, newStudent]);
    setBooksByStudent(prev => ({
      ...prev,
      [newId]: []
    }));
    setActivitiesByStudent(prev => ({
      ...prev,
      [newId]: []
    }));
    if (isTeacher) {
      setCurrentStudentId(newId);
    }
  };

  const handleUpdateStudent = (updatedStudent: StudentProfile) => {
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => {
      const remaining = prev.filter(s => s.id !== studentId);
      if (remaining.length === 0) {
        const fallbackStudent: StudentProfile = {
          id: `student-${Date.now()}`,
          name: '새 학생',
          school: '서울초등학교',
          grade: 3,
          classRoom: 1,
          studentNumber: 1,
          avatar: '🌱',
          targetCount: 30,
          favoriteGenre: '동화·소설',
          motto: '책과 함께 꿈을 키워요!',
          pledge: '매일 즐겁게 책을 읽고 생각을 넓히겠습니다.',
          startDate: new Date().toISOString().split('T')[0],
          status: 'approved',
          password: '123'
        };
        setCurrentStudentId(fallbackStudent.id);
        return [fallbackStudent];
      } else {
        if (currentStudentId === studentId) {
          const nextApproved = remaining.find(s => s.status !== 'pending') || remaining[0];
          setCurrentStudentId(nextApproved.id);
        }
        return remaining;
      }
    });

    setBooksByStudent(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });

    setActivitiesByStudent(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });
  };

  // Book Handlers (for current student)
  const handleAddBook = (newBookData: Omit<BookEntry, 'id' | 'hasActivity'>) => {
    const newBook: BookEntry = {
      ...newBookData,
      id: `book-${Date.now()}`,
      hasActivity: false,
    };
    setBooksByStudent(prev => ({
      ...prev,
      [currentProfile.id]: [newBook, ...(prev[currentProfile.id] || [])]
    }));
  };

  const handleUpdateBook = (updatedBook: BookEntry) => {
    setBooksByStudent(prev => ({
      ...prev,
      [currentProfile.id]: (prev[currentProfile.id] || []).map(b => 
        b.id === updatedBook.id ? updatedBook : b
      )
    }));
  };

  const handleDeleteBook = (id: string) => {
    setBooksByStudent(prev => ({
      ...prev,
      [currentProfile.id]: (prev[currentProfile.id] || []).filter(b => b.id !== id)
    }));
    setActivitiesByStudent(prev => ({
      ...prev,
      [currentProfile.id]: (prev[currentProfile.id] || []).filter(a => a.bookId !== id)
    }));
  };

  // Activity Handlers (for current student)
  const handleOpenActivityForBook = (book: BookEntry) => {
    const existing = activities.find(a => a.bookId === book.id);
    if (existing) {
      setActiveTab('worksheet');
    } else {
      setSelectedBookForActivity(book);
      setEditingActivity(null);
      setIsActivityModalOpen(true);
    }
  };

  const handleOpenCreateActivity = (book?: BookEntry) => {
    setSelectedBookForActivity(book || (books.length > 0 ? books[0] : undefined));
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleEditActivity = (activity: ActivityData) => {
    const targetBook = books.find(b => b.id === activity.bookId);
    setSelectedBookForActivity(targetBook);
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = (activityData: ActivityData) => {
    setActivitiesByStudent(prev => {
      const currentList = prev[currentProfile.id] || [];
      const exists = currentList.some(a => a.id === activityData.id);
      const updatedList = exists 
        ? currentList.map(a => (a.id === activityData.id ? activityData : a))
        : [activityData, ...currentList];
      return {
        ...prev,
        [currentProfile.id]: updatedList
      };
    });

    // Mark corresponding book as hasActivity
    setBooksByStudent(prev => {
      const currentList = prev[currentProfile.id] || [];
      return {
        ...prev,
        [currentProfile.id]: currentList.map(b => {
          if (b.id === activityData.bookId) {
            return { ...b, hasActivity: true, activityId: activityData.id };
          }
          return b;
        })
      };
    });

    setActiveTab('worksheet');
  };

  const handleDeleteActivity = (id: string) => {
    const targetAct = activities.find(a => a.id === id);
    setActivitiesByStudent(prev => ({
      ...prev,
      [currentProfile.id]: (prev[currentProfile.id] || []).filter(a => a.id !== id)
    }));
    if (targetAct) {
      setBooksByStudent(prev => ({
        ...prev,
        [currentProfile.id]: (prev[currentProfile.id] || []).map(b => {
          if (b.id === targetAct.bookId) {
            return { ...b, hasActivity: false, activityId: undefined };
          }
          return b;
        })
      }));
    }
  };

  // Reset to initial sample data
  const handleResetData = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmResetData = () => {
    setStudents(initialStudents);
    setCurrentStudentId(initialStudents[0].id);
    setBooksByStudent(initialBooksByStudent);
    setActivitiesByStudent(initialActivitiesByStudent);
    setTeacherPassword('1234');
    localStorage.removeItem('edutrack_students_list');
    localStorage.removeItem('edutrack_current_student_id');
    localStorage.removeItem('edutrack_books_by_student');
    localStorage.removeItem('edutrack_activities_by_student');
    localStorage.removeItem('edutrack_reading_profile');
    localStorage.removeItem('edutrack_reading_books');
    localStorage.removeItem('edutrack_reading_activities');
    localStorage.removeItem('edutrack_teacher_password');
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-stone-800">
      {/* Top Header & Tab Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={currentProfile}
        books={books}
        totalStudentsCount={students.length}
        pendingStudentsCount={pendingStudentsCount}
        isTeacherLoggedIn={isTeacherLoggedIn}
        onOpenAddModal={() => setIsAddBookModalOpen(true)}
        onOpenStudentManager={() => setIsStudentManagerOpen(true)}
        onOpenTeacherLogin={() => setIsTeacherLoginModalOpen(true)}
        onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
        onResetData={handleResetData}
        onTriggerPrint={() => setActiveTab('print')}
      />

      {/* Teacher Active Banner if Logged in */}
      {isTeacherLoggedIn && (
        <div className="bg-emerald-800 text-white px-4 py-2 text-xs flex items-center justify-between no-print shadow-inner">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 font-extrabold px-2 py-0.5 rounded text-[11px]">
                👨‍🏫 교사 관리자 모드
              </span>
              <span className="font-medium hidden sm:inline">
                김은빛 선생님 로그인 중 | 학생 가입 승인, 비밀번호 확인 및 학생 삭제/편집 권한 활성화됨
              </span>
              {pendingStudentsCount > 0 && (
                <span className="bg-rose-500 text-white font-extrabold px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                  신청 대기 {pendingStudentsCount}건
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTeacherDashboardOpen(true)}
                className="bg-white text-emerald-900 font-extrabold px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                교사 관리센터 열기
              </button>
              <button
                type="button"
                onClick={handleLogoutTeacher}
                className="text-emerald-200 hover:text-white underline cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'bankbook' && (
          <ReadingBankbook
            books={books}
            profile={currentProfile}
            onAddBook={handleAddBook}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
            onOpenActivityForBook={handleOpenActivityForBook}
            isAddModalOpen={isAddBookModalOpen}
            setIsAddModalOpen={setIsAddBookModalOpen}
          />
        )}

        {activeTab === 'worksheet' && (
          <ActivityWorksheetView
            activities={activities}
            books={books}
            profile={currentProfile}
            onOpenCreate={handleOpenCreateActivity}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}

        {activeTab === 'tree' && (
          <ReadingTree
            books={books}
            profile={currentProfile}
          />
        )}

        {activeTab === 'stats' && (
          <ReadingAnalytics
            books={books}
            profile={currentProfile}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSection
            profile={currentProfile}
            students={students}
            onUpdateProfile={handleUpdateStudent}
            onSelectStudent={handleSelectStudent}
            onOpenAddStudentModal={() => setIsStudentManagerOpen(true)}
            onDeleteStudent={handleDeleteStudent}
            booksByStudentCount={booksCountByStudent}
            totalBooksRead={books.length}
            isTeacherLoggedIn={isTeacherLoggedIn}
            onOpenTeacherLogin={() => setIsTeacherLoginModalOpen(true)}
            onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
            onApproveStudent={handleApproveStudent}
            onRejectStudent={handleRejectStudent}
          />
        )}

        {activeTab === 'print' && (
          <PrintablePortfolio
            profile={currentProfile}
            books={books}
            activities={activities}
          />
        )}
      </main>

      {/* Student Manager & Registration Modal */}
      <StudentManagerModal
        isOpen={isStudentManagerOpen}
        onClose={() => setIsStudentManagerOpen(false)}
        students={students}
        currentStudentId={currentStudentId}
        onSelectStudent={handleSelectStudent}
        onAddStudent={handleAddStudent}
        onUpdateStudent={handleUpdateStudent}
        onDeleteStudent={handleDeleteStudent}
        booksByStudent={booksCountByStudent}
        isTeacherLoggedIn={isTeacherLoggedIn}
        onOpenTeacherLogin={() => setIsTeacherLoginModalOpen(true)}
        onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
      />

      {/* Teacher Login Modal */}
      <TeacherLoginModal
        isOpen={isTeacherLoginModalOpen}
        onClose={() => setIsTeacherLoginModalOpen(false)}
        teacherPassword={teacherPassword}
        onLoginSuccess={handleTeacherLoginSuccess}
      />

      {/* Teacher Dashboard & Student Management Modal */}
      <TeacherDashboardModal
        isOpen={isTeacherDashboardOpen}
        onClose={() => setIsTeacherDashboardOpen(false)}
        students={students}
        currentStudentId={currentStudentId}
        booksByStudent={booksCountByStudent}
        onApproveStudent={handleApproveStudent}
        onRejectStudent={handleRejectStudent}
        onBatchApprove={handleBatchApprove}
        onUpdateStudent={handleUpdateStudent}
        onDeleteStudent={handleDeleteStudent}
        onSelectStudent={handleSelectStudent}
        teacherPassword={teacherPassword}
        onChangeTeacherPassword={handleChangeTeacherPassword}
        onLogoutTeacher={handleLogoutTeacher}
      />

      {/* Activity Editor Modal */}
      <ActivityEditorModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        book={selectedBookForActivity}
        existingActivity={editingActivity}
        books={books}
        profile={currentProfile}
      />

      {/* Footer (No Print) */}
      <footer className="bg-white border-t border-amber-200 py-6 text-center text-xs text-stone-500 no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-bold text-stone-700">
            초등학생 독서 기록장 • 에듀트랙(EduTrack) 교육 표준 양식
          </p>
          <p className="text-stone-400">
            학생 신규 등록 신청 & 비밀번호 설정 • 교사 비밀번호 인증 및 관리자 모드 • 학생 신청 승인/반려 및 비밀번호 확인/편집 • 9가지 창의 독후 활동 워크시트
          </p>
        </div>
      </footer>
      {/* Data Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-rose-300 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-jua text-lg text-stone-900">샘플 데이터로 초기화</h4>
                <p className="text-xs text-rose-600 font-bold">모든 데이터가 삭제됩니다</p>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
              모든 학생, 독서 기록, 활동지 데이터가 삭제되고 처음 5명의 예시 샘플 학생 데이터로 완전히 초기화됩니다.<br/><br/>
              정말 초기화하시겠습니까?
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmResetData}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                초기화하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
