import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  PlusCircle, 
  Sparkles, 
  Award, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  FileText,
  Flame,
  ArrowUpDown,
  BookMarked
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookEntry, GenreType, StampType, StudentProfile } from '../types';
import { GENRE_COLORS } from '../data/initialData';

interface ReadingBankbookProps {
  books: BookEntry[];
  profile: StudentProfile;
  onAddBook: (book: Omit<BookEntry, 'id' | 'hasActivity'>) => void;
  onUpdateBook: (book: BookEntry) => void;
  onDeleteBook: (id: string) => void;
  onOpenActivityForBook: (book: BookEntry) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

const STAMPS: StampType[] = [
  '참 잘했어요',
  '독서왕',
  '대단해요!',
  '최고예요!',
  '노력상',
  '반짝별',
  '하트뿜뿜',
  '미확인'
];

const GENRES: GenreType[] = [
  '동화·소설',
  '과학·수학',
  '위인·역사',
  '사회·문화',
  '시·동시',
  '예술·체육',
  '학습만화',
  '철학·인성',
  '기타'
];

export const ReadingBankbook: React.FC<ReadingBankbookProps> = ({
  books,
  profile,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onOpenActivityForBook,
  isAddModalOpen,
  setIsAddModalOpen
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'rating' | 'pages'>('date_asc');
  const [editingBook, setEditingBook] = useState<BookEntry | null>(null);

  // Form State for Add / Edit Modal
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [illustrator, setIllustrator] = useState('');
  const [publisher, setPublisher] = useState('');
  const [pages, setPages] = useState(100);
  const [genre, setGenre] = useState<GenreType>('동화·소설');
  const [rating, setRating] = useState(5);
  const [oneLineReview, setOneLineReview] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [stamp, setStamp] = useState<StampType>('참 잘했어요');

  const totalPages = books.reduce((acc, curr) => acc + (curr.pages || 0), 0);
  const averageRating = books.length ? (books.reduce((acc, curr) => acc + curr.rating, 0) / books.length).toFixed(1) : '0.0';
  const totalPoints = totalPages + books.length * 10; // EduTrack mileage points logic: 1 page = 1 point, 1 book = +10 bonus pts!

  const handleOpenAdd = () => {
    setEditingBook(null);
    setTitle('');
    setAuthor('');
    setIllustrator('');
    setPublisher('');
    setPages(120);
    setGenre('동화·소설');
    setRating(5);
    setOneLineReview('');
    setDate(new Date().toISOString().split('T')[0]);
    setStamp('참 잘했어요');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (b: BookEntry) => {
    setEditingBook(b);
    setTitle(b.title);
    setAuthor(b.author);
    setIllustrator(b.illustrator || '');
    setPublisher(b.publisher);
    setPages(b.pages);
    setGenre(b.genre);
    setRating(b.rating);
    setOneLineReview(b.oneLineReview);
    setDate(b.date);
    setStamp(b.stamp);
    setIsAddModalOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingBook) {
      onUpdateBook({
        ...editingBook,
        title,
        author,
        illustrator,
        publisher,
        pages,
        genre,
        rating,
        oneLineReview,
        date,
        stamp,
      });
    } else {
      onAddBook({
        title,
        author,
        illustrator,
        publisher,
        pages,
        genre,
        rating,
        oneLineReview,
        date,
        stamp,
      });
      // Fire confetti celebration!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    }
    setIsAddModalOpen(false);
  };

  // Stamp click cycle helper
  const handleCycleStamp = (b: BookEntry) => {
    const currentIndex = STAMPS.indexOf(b.stamp);
    const nextStamp = STAMPS[(currentIndex + 1) % (STAMPS.length - 1)]; // cycle through positive stamps
    onUpdateBook({
      ...b,
      stamp: nextStamp
    });
  };

  // Filter & Sort books
  const filteredBooks = books.filter((b) => {
    const matchSearch = 
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.oneLineReview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGenre = selectedGenre === 'all' || b.genre === selectedGenre;
    return matchSearch && matchGenre;
  }).sort((a, b) => {
    if (sortBy === 'date_asc') return a.date.localeCompare(b.date);
    if (sortBy === 'date_desc') return b.date.localeCompare(a.date);
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'pages') return b.pages - a.pages;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* EduTrack Passbook Header Card */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        {/* Passbook Pattern Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-black/20 text-amber-200 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>에듀트랙 독서 마일리지 통장</span>
              <span className="font-mono text-white/80">NO. ET-{profile.grade}0{profile.classRoom}-{profile.studentNumber}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-jua text-white tracking-wide">
              {profile.name} 어린이의 독서 마일리지 통장 📒
            </h2>
            <p className="text-amber-100 text-sm mt-1">
              읽은 책을 차곡차곡 기록하고, 마일리지를 쌓아 멋진 독서왕에 도전해보세요!
            </p>
          </div>

          <button
            id="bankbook-add-entry-btn"
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-extrabold px-5 py-2.5 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 text-sm cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>새 책 등록하기</span>
          </button>
        </div>

        {/* Mileage Summary Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/20 relative z-10">
          <div className="bg-black/20 rounded-2xl p-3 text-center backdrop-blur-xs">
            <span className="text-xs text-amber-200 block font-medium">누적 독서 권수</span>
            <div className="text-xl md:text-2xl font-jua text-white mt-0.5">
              {books.length} <span className="text-xs font-normal">권</span>
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-3 text-center backdrop-blur-xs">
            <span className="text-xs text-amber-200 block font-medium">총 읽은 쪽수</span>
            <div className="text-xl md:text-2xl font-jua text-white mt-0.5">
              {totalPages.toLocaleString()} <span className="text-xs font-normal">쪽</span>
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-3 text-center backdrop-blur-xs">
            <span className="text-xs text-amber-200 block font-medium">독서 마일리지</span>
            <div className="text-xl md:text-2xl font-jua text-yellow-300 mt-0.5 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>{totalPoints.toLocaleString()}</span> <span className="text-xs font-normal text-white">P</span>
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-3 text-center backdrop-blur-xs">
            <span className="text-xs text-amber-200 block font-medium">평균 만족도</span>
            <div className="text-xl md:text-2xl font-jua text-white mt-0.5 flex items-center justify-center gap-1 text-amber-300">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>{averageRating}</span> <span className="text-xs font-normal text-white">/ 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="책 제목, 지은이, 출판사, 한 줄 생각 검색..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:bg-white focus:outline-none font-medium text-stone-700"
          >
            <option value="all">전체 분야 ({books.length})</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g} ({books.filter((b) => b.genre === g).length})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>정렬:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs font-bold bg-stone-100 border border-stone-200 rounded-xl focus:outline-none text-stone-700"
          >
            <option value="date_asc">읽은 순 (오래된 순)</option>
            <option value="date_desc">최근 읽은 순</option>
            <option value="rating">별점 높은 순</option>
            <option value="pages">쪽수 많은 순</option>
          </select>
        </div>
      </div>

      {/* Reading Ledger Table (EduTrack Tabular Format) */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-amber-50/60 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-amber-700" />
            <h3 className="font-jua text-stone-900 text-lg">나의 독서 기록 목록 ({filteredBooks.length}건)</h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            💡 확인 도장을 클릭하면 스탬프 종류를 바꿀 수 있습니다.
          </span>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="p-12 text-center text-stone-500 space-y-3">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
            <p className="font-bold text-stone-700">해당하는 독서 기록이 없습니다.</p>
            <p className="text-xs text-stone-400">새 책을 등록하거나 검색어를 변경해보세요.</p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-amber-600 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>새 책 등록하기</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[840px]">
              <thead>
                <tr className="bg-stone-100/90 text-stone-700 text-xs font-bold uppercase tracking-wider border-b border-stone-200">
                  <th className="py-3 px-3 text-center w-12">번호</th>
                  <th className="py-3 px-3 w-24">읽은 날짜</th>
                  <th className="py-3 px-4">도서명</th>
                  <th className="py-3 px-3 w-32">글 / 그림</th>
                  <th className="py-3 px-3 w-28">출판사</th>
                  <th className="py-3 px-3 text-center w-24">분야</th>
                  <th className="py-3 px-2 text-center w-16">쪽수</th>
                  <th className="py-3 px-3 text-center w-24">별점</th>
                  <th className="py-3 px-4">한 줄 생각</th>
                  <th className="py-3 px-3 text-center w-28">확인 도장</th>
                  <th className="py-3 px-3 text-center w-28">독후활동</th>
                  <th className="py-3 px-2 text-center w-16">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800 text-xs sm:text-sm">
                {filteredBooks.map((book, index) => {
                  const genreColor = GENRE_COLORS[book.genre] || { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' };
                  return (
                    <tr 
                      key={book.id} 
                      className="hover:bg-amber-50/40 transition-colors group"
                    >
                      {/* Index */}
                      <td className="py-3 px-3 text-center font-bold text-stone-500 text-xs">
                        {index + 1}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-stone-600 font-mono text-xs whitespace-nowrap">
                        {book.date}
                      </td>

                      {/* Title */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                          {book.title}
                        </div>
                      </td>

                      {/* Author */}
                      <td className="py-3 px-3 text-stone-600 text-xs">
                        <span className="font-medium text-stone-800">{book.author}</span>
                        {book.illustrator && (
                          <span className="text-stone-400 block text-[11px] font-normal">그림: {book.illustrator}</span>
                        )}
                      </td>

                      {/* Publisher */}
                      <td className="py-3 px-3 text-stone-600 text-xs">
                        {book.publisher}
                      </td>

                      {/* Genre */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border ${genreColor.bg} ${genreColor.text} ${genreColor.border}`}>
                          {book.genre}
                        </span>
                      </td>

                      {/* Pages */}
                      <td className="py-3 px-2 text-center font-mono font-semibold text-stone-700 text-xs">
                        {book.pages}p
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < book.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      {/* One Line Review */}
                      <td className="py-3 px-4 text-xs text-stone-700 max-w-xs">
                        <p className="line-clamp-2 italic text-stone-800">
                          "{book.oneLineReview || '기록된 한 줄 소감이 없습니다.'}"
                        </p>
                      </td>

                      {/* Stamp (Click to change) */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleCycleStamp(book)}
                          className="inline-flex items-center justify-center px-2 py-1 rounded-full border-2 border-rose-500 text-rose-600 font-extrabold text-[11px] shadow-xs hover:scale-105 active:scale-95 transition-all bg-rose-50/50 cursor-pointer whitespace-nowrap"
                          title="클릭하여 도장 변경하기"
                        >
                          <span className="mr-1">💮</span>
                          <span>{book.stamp}</span>
                        </button>
                      </td>

                      {/* Worksheet link */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {book.hasActivity ? (
                          <button
                            type="button"
                            onClick={() => onOpenActivityForBook(book)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg text-xs font-bold hover:bg-teal-100 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                            <span>활동지 보기</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenActivityForBook(book)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                            <span>활동지 쓰기</span>
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-2 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(book)}
                            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
                            title="수정"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`'${book.title}' 독서 기록을 삭제하시겠습니까?`)) {
                                onDeleteBook(book.id);
                              }
                            }}
                            className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Book Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border-2 border-amber-300 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
              <h3 className="text-xl font-jua text-stone-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>{editingBook ? '독서 기록 수정하기' : '새 책 독서통장 기록하기'}</span>
              </h3>
              <span className="text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full font-bold">
                에듀트랙 양식
              </span>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    도서명 (책 제목) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none font-semibold text-stone-900"
                    placeholder="예: 마당을 나온 암탉"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    글쓴이 (지은이) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    placeholder="예: 황선미"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">그린이 (선택)</label>
                  <input
                    type="text"
                    value={illustrator}
                    onChange={(e) => setIllustrator(e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    placeholder="예: 김환영"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    출판사 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    placeholder="예: 사계절"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">읽은 날짜</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">독서 분야 (장르)</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as GenreType)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">읽은 쪽수 (페이지)</label>
                  <input
                    type="number"
                    min="1"
                    max="2000"
                    required
                    value={pages}
                    onChange={(e) => setPages(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">나의 별점 평가</label>
                <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-700 ml-2">
                    {rating === 5 && '🌟 인생 최고의 책!'}
                    {rating === 4 && '👍 정말 재미있어요!'}
                    {rating === 3 && '🙂 보통이에요.'}
                    {rating === 2 && '🤔 조금 아쉬워요.'}
                    {rating === 1 && '😅 읽기 힘들었어요.'}
                  </span>
                </div>
              </div>

              {/* One line review */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  한 줄 생각 / 인상 깊은 한마디 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={oneLineReview}
                  onChange={(e) => setOneLineReview(e.target.value)}
                  placeholder="책을 읽고 마음에 와닿은 생각이나 느낌을 짧게 적어보세요."
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none"
                />
              </div>

              {/* Stamp Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">확인 도장 스탬프</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {STAMPS.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStamp(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                        stamp === st
                          ? 'border-rose-500 bg-rose-50 text-rose-600 scale-105 shadow-xs'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      💮 {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-200 transition-all hover:scale-105"
                >
                  {editingBook ? '수정 완료' : '독서통장에 기록하기 ✍️'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
