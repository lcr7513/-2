import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle, 
  Edit3, 
  Target, 
  Heart, 
  BookOpen, 
  Calendar,
  Award,
  Stamp
} from 'lucide-react';
import { StudentProfile, GenreType } from '../types';

interface ProfileSectionProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  totalBooksRead: number;
}

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

const AVATARS = ['🌱', '📚', '🦁', '🚀', '🌟', '🎨', '🐯', '🦉', '🐬', '🏆'];

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  onUpdateProfile,
  totalBooksRead
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 p-6 md:p-8 rounded-3xl border-2 border-amber-300 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setFormData(profile);
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-stone-700 text-xs md:text-sm font-bold px-3.5 py-1.5 rounded-xl border border-amber-300 shadow-sm transition-all hover:scale-105"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
            <span>내 정보 수정</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar circle */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 shadow-md flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-5xl md:text-6xl shadow-inner">
              {profile.avatar}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-200/70 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{profile.school}</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-jua text-stone-900 tracking-wide">
              {profile.grade}학년 {profile.classRoom}반 {profile.studentNumber}번 <span className="text-amber-600">{profile.name}</span>의 독서 기록장
            </h2>

            <p className="text-sm md:text-base text-stone-600 font-medium italic">
              "{profile.motto || '책 속에서 나만의 꿈을 키워요!'}"
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs md:text-sm">
              <span className="bg-white px-3 py-1 rounded-lg border border-amber-200 text-stone-700 font-medium flex items-center gap-1.5 shadow-xs">
                <Target className="w-4 h-4 text-rose-500" />
                목표: <b className="text-stone-900">{profile.targetCount}권</b> (현재 {totalBooksRead}권 달성)
              </span>
              <span className="bg-white px-3 py-1 rounded-lg border border-amber-200 text-stone-700 font-medium flex items-center gap-1.5 shadow-xs">
                <Heart className="w-4 h-4 text-pink-500" />
                좋아하는 분야: <b className="text-stone-900">{profile.favoriteGenre}</b>
              </span>
              <span className="bg-white px-3 py-1 rounded-lg border border-amber-200 text-stone-700 font-medium flex items-center gap-1.5 shadow-xs">
                <Calendar className="w-4 h-4 text-blue-500" />
                시작일: <b className="text-stone-900">{profile.startDate}</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official EduTrack Reading Pledge Certificate (독서 서약서) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-stone-200 shadow-sm relative">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-block border-b-2 border-amber-500 pb-1">
            <span className="text-xs text-amber-700 font-bold uppercase tracking-widest">EduTrack Reading Pledge</span>
            <h3 className="text-xl md:text-2xl font-jua text-stone-900">나의 소중한 독서 다짐</h3>
          </div>

          <div className="bg-amber-50/70 p-5 md:p-6 rounded-2xl border border-amber-200 text-stone-800 text-sm md:text-base leading-relaxed notebook-lines">
            <p className="font-semibold text-stone-900 mb-2">
              나 <span className="underline font-bold text-amber-800">{profile.name}</span>(은)는 지혜롭고 바른 마음을 가진 어린이로 자라나기 위해 다음 독서 약속을 실천하겠습니다.
            </p>
            <p className="text-amber-950 font-medium py-1">
              "{profile.pledge}"
            </p>
          </div>

          {/* Signature & Seal Stamp */}
          <div className="pt-4 flex items-center justify-between max-w-md mx-auto border-t border-stone-200 text-xs md:text-sm text-stone-600">
            <div className="text-left">
              <p>서약 일자: {profile.startDate}</p>
              <p className="font-bold text-stone-800 mt-0.5">서약자: {profile.name} (서명)</p>
            </div>

            {/* Red Round Stamp */}
            <div className="w-16 h-16 rounded-full border-2 border-rose-600 text-rose-600 flex flex-col items-center justify-center p-1 transform -rotate-12 select-none shadow-xs font-bold">
              <span className="text-[9px] tracking-tighter">에듀트랙</span>
              <span className="text-xs font-extrabold">참 잘했어요</span>
              <span className="text-[8px]">★확인★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-2 border-amber-300 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-jua text-stone-900 mb-4 pb-2 border-b border-stone-200 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-600" />
              <span>학생 정보 및 다짐 수정</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">학교명</label>
                  <input
                    type="text"
                    required
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    placeholder="예: 서울초등학교"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">이름</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    placeholder="예: 홍길동"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">학년</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">반</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.classRoom}
                    onChange={(e) => setFormData({ ...formData, classRoom: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">번호</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.studentNumber}
                    onChange={(e) => setFormData({ ...formData, studentNumber: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">목표 권수</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    required
                    value={formData.targetCount}
                    onChange={(e) => setFormData({ ...formData, targetCount: parseInt(e.target.value) || 50 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">좋아하는 분야</label>
                  <select
                    value={formData.favoriteGenre}
                    onChange={(e) => setFormData({ ...formData, favoriteGenre: e.target.value as GenreType })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">나만의 캐릭터 아이콘</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`w-10 h-10 rounded-xl text-xl border-2 flex items-center justify-center transition-transform ${
                        formData.avatar === av
                          ? 'border-amber-500 bg-amber-100 scale-110 shadow-sm'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">독서 좌우명 (한 줄)</label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  placeholder="예: 책 속에 나의 꿈이 가득해요!"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">나의 독서 다짐 / 약속</label>
                <textarea
                  rows={3}
                  value={formData.pledge}
                  onChange={(e) => setFormData({ ...formData, pledge: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none"
                  placeholder="매일 꾸준히 책을 읽고 실천할 약속을 적어보세요."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-200 transition-colors"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
