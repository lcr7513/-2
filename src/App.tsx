import React, { useState, useEffect } from 'react';
import { 
  BookEntry, 
  ActivityData, 
  StudentProfile 
} from './types';
import { 
  initialProfile, 
  initialBooks, 
  initialActivities 
} from './data/initialData';
import { Header } from './components/Header';
import { ProfileSection } from './components/ProfileSection';
import { ReadingBankbook } from './components/ReadingBankbook';
import { ActivityWorksheetView } from './components/ActivityWorksheetView';
import { ActivityEditorModal } from './components/ActivityEditorModal';
import { ReadingTree } from './components/ReadingTree';
import { ReadingAnalytics } from './components/ReadingAnalytics';
import { PrintablePortfolio } from './components/PrintablePortfolio';

export default function App() {
  // LocalStorage initialization
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('edutrack_reading_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialProfile;
  });

  const [books, setBooks] = useState<BookEntry[]>(() => {
    const saved = localStorage.getItem('edutrack_reading_books');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialBooks;
  });

  const [activities, setActivities] = useState<ActivityData[]>(() => {
    const saved = localStorage.getItem('edutrack_reading_activities');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialActivities;
  });

  const [activeTab, setActiveTab] = useState<string>('bankbook');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedBookForActivity, setSelectedBookForActivity] = useState<BookEntry | undefined>();
  const [editingActivity, setEditingActivity] = useState<ActivityData | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('edutrack_reading_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('edutrack_reading_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('edutrack_reading_activities', JSON.stringify(activities));
  }, [activities]);

  // Book Handlers
  const handleAddBook = (newBookData: Omit<BookEntry, 'id' | 'hasActivity'>) => {
    const newBook: BookEntry = {
      ...newBookData,
      id: `book-${Date.now()}`,
      hasActivity: false,
    };
    setBooks(prev => [newBook, ...prev]);
  };

  const handleUpdateBook = (updatedBook: BookEntry) => {
    setBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
  };

  const handleDeleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    setActivities(prev => prev.filter(a => a.bookId !== id));
  };

  // Activity Handlers
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
    setActivities(prev => {
      const exists = prev.some(a => a.id === activityData.id);
      if (exists) {
        return prev.map(a => (a.id === activityData.id ? activityData : a));
      }
      return [activityData, ...prev];
    });

    // Mark corresponding book as hasActivity
    setBooks(prev => prev.map(b => {
      if (b.id === activityData.bookId) {
        return { ...b, hasActivity: true, activityId: activityData.id };
      }
      return b;
    }));

    setActiveTab('worksheet');
  };

  const handleDeleteActivity = (id: string) => {
    const targetAct = activities.find(a => a.id === id);
    setActivities(prev => prev.filter(a => a.id !== id));
    if (targetAct) {
      setBooks(prev => prev.map(b => {
        if (b.id === targetAct.bookId) {
          return { ...b, hasActivity: false, activityId: undefined };
        }
        return b;
      }));
    }
  };

  // Reset to initial sample data
  const handleResetData = () => {
    if (confirm('모든 데이터를 에듀트랙 예시 샘플 데이터로 초기화하시겠습니까?')) {
      setProfile(initialProfile);
      setBooks(initialBooks);
      setActivities(initialActivities);
      localStorage.removeItem('edutrack_reading_profile');
      localStorage.removeItem('edutrack_reading_books');
      localStorage.removeItem('edutrack_reading_activities');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-stone-800">
      {/* Top Header & Tab Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        books={books}
        onOpenAddModal={() => setIsAddBookModalOpen(true)}
        onResetData={handleResetData}
        onTriggerPrint={() => setActiveTab('print')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'bankbook' && (
          <ReadingBankbook
            books={books}
            profile={profile}
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
            profile={profile}
            onOpenCreate={handleOpenCreateActivity}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}

        {activeTab === 'tree' && (
          <ReadingTree
            books={books}
            profile={profile}
          />
        )}

        {activeTab === 'stats' && (
          <ReadingAnalytics
            books={books}
            profile={profile}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSection
            profile={profile}
            onUpdateProfile={setProfile}
            totalBooksRead={books.length}
          />
        )}

        {activeTab === 'print' && (
          <PrintablePortfolio
            profile={profile}
            books={books}
            activities={activities}
          />
        )}
      </main>

      {/* Activity Editor Modal */}
      <ActivityEditorModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        book={selectedBookForActivity}
        existingActivity={editingActivity}
        books={books}
        profile={profile}
      />

      {/* Footer (No Print) */}
      <footer className="bg-white border-t border-amber-200 py-6 text-center text-xs text-stone-500 no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-bold text-stone-700">
            초등학생 독서 기록장 • 에듀트랙(EduTrack) 교육 표준 양식
          </p>
          <p className="text-stone-400">
            독서 통장 마일리지 • 9가지 창의 독후 활동 워크시트 • 칭찬 나무 스티커판 • A4 포트폴리오 인쇄 지원
          </p>
        </div>
      </footer>
    </div>
  );
}
