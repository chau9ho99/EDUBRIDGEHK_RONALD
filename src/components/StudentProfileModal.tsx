import React, { useState, useEffect } from "react";
import { UserCheck, Sparkles, School, GraduationCap, X, Check, BookOpen } from "lucide-react";
import { StudentProfile } from "../types";
import { Language } from "../utils/i18n";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: StudentProfile) => void;
  currentProfile: StudentProfile | null;
  lang: Language;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  currentProfile,
  lang,
}) => {
  const [name, setName] = useState<string>(currentProfile?.name || "");
  const [email, setEmail] = useState<string>(currentProfile?.email || "");
  const [age, setAge] = useState<string>(currentProfile?.age ? String(currentProfile.age) : "15");
  const [gender, setGender] = useState<"male" | "female" | "other">(currentProfile?.gender || "male");
  const [schoolType, setSchoolType] = useState<"primary" | "secondary">(
    currentProfile?.schoolType || "secondary"
  );
  const [grade, setGrade] = useState<string>(
    currentProfile?.grade || (currentProfile?.schoolType === "primary" ? "小五" : "中五")
  );

  useEffect(() => {
    if (currentProfile) {
      setName(currentProfile.name || "");
      setEmail(currentProfile.email || "");
      setAge(currentProfile.age ? String(currentProfile.age) : "15");
      setGender(currentProfile.gender || "male");
      setSchoolType(currentProfile.schoolType || "secondary");
      setGrade(currentProfile.grade || (currentProfile.schoolType === "primary" ? "小五" : "中五"));
    }
  }, [currentProfile, isOpen]);

  // Handle school type switch and auto adjust grade default
  const handleSchoolTypeChange = (type: "primary" | "secondary") => {
    setSchoolType(type);
    if (type === "primary") {
      setGrade("小五");
      if (parseInt(age) > 12) setAge("10");
    } else {
      setGrade("中五");
      if (parseInt(age) <= 12) setAge("15");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profileData: StudentProfile = {
      name: name.trim() || (lang === "en" ? "Hong Kong Student" : "香港新移民學生"),
      email: email.trim(),
      age: parseInt(age) || 15,
      gender,
      schoolType,
      grade,
      updatedAt: Date.now(),
    };
    onSaveProfile(profileData);
    onClose();
  };

  if (!isOpen) return null;

  const isZh = lang !== "en";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#111115] border-2 border-[#00FF88]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(0,255,136,0.2)] relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00FF88]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00FF88] text-black flex items-center justify-center shadow-lg shadow-[#00FF88]/30 font-black">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{isZh ? "👋 歡迎使用 EduBridge HK" : "👋 Welcome to EduBridge HK"}</span>
              </h2>
              <p className="text-xs text-[#00FF88] font-bold uppercase tracking-wider">
                {isZh ? "請先設定學生個人學習檔案" : "Set Up Student Profile for Personalized AI"}
              </p>
            </div>
          </div>
          {currentProfile && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Student Name */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-white/80 mb-2">
              {isZh ? "👤 學生姓名 / 暱稱 (Student Name)" : "👤 Student Name / Nickname"} <span className="text-[#00FF88]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isZh ? "例如: 陳小明 / Alex" : "e.g. Alex Chan"}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/20 text-white font-medium focus:border-[#00FF88] focus:bg-black focus:outline-none transition-all placeholder:text-white/30"
            />
          </div>

          {/* Student Email (Optional for future Gmail / Email login link) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black uppercase tracking-wider text-white/80">
                {isZh ? "📧 學生電郵 (Student Email - 預留連繫 Login)" : "📧 Student Email (For Future Login Link)"}
              </label>
              <span className="text-[10px] text-[#00FF88] bg-[#00FF88]/10 border border-[#00FF88]/30 px-2 py-0.5 rounded-full font-mono">
                {isZh ? "選填 • 未來可連結 Gmail 登入" : "Optional • Gmail Ready"}
              </span>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isZh ? "例如: student@gmail.com (預留連結個人知識庫)" : "e.g. student@gmail.com"}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/20 text-white font-medium focus:border-[#00FF88] focus:bg-black focus:outline-none transition-all placeholder:text-white/30 text-sm"
            />
          </div>

          {/* Age & Gender Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-white/80 mb-2">
                {isZh ? "🎂 年齡 (Age)" : "🎂 Age"}
              </label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#1a1a22] border border-white/20 text-white font-medium focus:border-[#00FF88] focus:outline-none transition-all cursor-pointer"
              >
                {Array.from({ length: 15 }, (_, i) => i + 6).map((num) => (
                  <option key={num} value={num}>
                    {num} {isZh ? "歲" : "years old"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-white/80 mb-2">
                {isZh ? "⚧ 性別 (Gender)" : "⚧ Gender"}
              </label>
              <div className="grid grid-cols-3 gap-1 bg-white/5 border border-white/15 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    gender === "male"
                      ? "bg-[#00FF88] text-black font-black"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {isZh ? "男" : "M"}
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    gender === "female"
                      ? "bg-[#00FF88] text-black font-black"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {isZh ? "女" : "F"}
                </button>
                <button
                  type="button"
                  onClick={() => setGender("other")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    gender === "other"
                      ? "bg-[#00FF88] text-black font-black"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {isZh ? "其他" : "Other"}
                </button>
              </div>
            </div>
          </div>

          {/* School Type (Primary vs Secondary) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-white/80 mb-2">
              {isZh ? "🏫 就讀學校類別 (School Type)" : "🏫 School Level"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSchoolTypeChange("primary")}
                className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider transition-all ${
                  schoolType === "primary"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-lg shadow-blue-500/20"
                    : "bg-white/5 border-white/20 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{isZh ? "🏫 小學 (Primary)" : "Primary School"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSchoolTypeChange("secondary")}
                className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider transition-all ${
                  schoolType === "secondary"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400 shadow-lg shadow-purple-500/20"
                    : "bg-white/5 border-white/20 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <School className="w-4 h-4" />
                <span>{isZh ? "🏫 中學 (Secondary / DSE)" : "Secondary School"}</span>
              </button>
            </div>
          </div>

          {/* Grade Pull-down Select Dropdown */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-white/80 mb-2">
              {isZh ? "🎓 選擇就讀年級 (Select Grade)" : "🎓 Select Grade / Form"}
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-[#1a1a22] border-2 border-[#00FF88]/50 text-white font-bold text-sm focus:border-[#00FF88] focus:outline-none transition-all cursor-pointer shadow-inner"
            >
              {schoolType === "primary" ? (
                <>
                  <option value="小一">小一 (Primary 1)</option>
                  <option value="小二">小二 (Primary 2)</option>
                  <option value="小三">小三 (Primary 3)</option>
                  <option value="小四">小四 (Primary 4)</option>
                  <option value="小五">小五 (Primary 5)</option>
                  <option value="小六">小六 (Primary 6 / 升中適應)</option>
                </>
              ) : (
                <>
                  <option value="中一">中一 (Secondary 1 / S1)</option>
                  <option value="中二">中二 (Secondary 2 / S2)</option>
                  <option value="中三">中三 (Secondary 3 / S3)</option>
                  <option value="中四">中四 (Secondary 4 / S4)</option>
                  <option value="中五">中五 (Secondary 5 / S5)</option>
                  <option value="中六">中六 (Secondary 6 / DSE 應屆生)</option>
                </>
              )}
            </select>
          </div>

          {/* AI Customization Note */}
          <div className="p-3.5 rounded-2xl bg-[#00FF88]/10 border border-[#00FF88]/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#00FF88] shrink-0 mt-0.5" />
            <p className="text-xs text-white/80 leading-relaxed">
              {isZh
                ? `系統將會根據學生【${schoolType === "primary" ? "小學" : "中學"} - ${grade}】自動調整 AI 導師解說深度、DSE 考題生詞庫及語音輔導風格！`
                : "The system will automatically customize AI tutor depth, vocabulary levels, and DSE exam hints according to your grade!"}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#00FF88] text-black font-black text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#00FF88]/30 hover:bg-[#00FF88]/90 active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-5 h-5 text-black" />
            <span>{isZh ? "儲存學生檔案並開始學習" : "Save Profile & Start Learning"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
