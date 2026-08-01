import React from "react";
import {
  Camera,
  Users,
  Brain,
  Sparkles,
  Award,
  Globe,
  GraduationCap,
  LayoutGrid,
  Shield,
  Smartphone,
  Monitor,
  UserCheck,
  CreditCard
} from "lucide-react";
import { Language, translations } from "../utils/i18n";
import { StudentProfile } from "../types";

interface NavbarProps {
  activeTab: "welcome" | "home" | "snap" | "discussion" | "knowledge" | "admin";
  setActiveTab: (tab: "welcome" | "home" | "snap" | "discussion" | "knowledge" | "admin") => void;
  isMobileMode?: boolean;
  setIsMobileMode?: (val: boolean) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  studentProfile?: StudentProfile | null;
  onOpenProfileModal?: () => void;
  onOpenPromoModal?: () => void;
  onOpenSubscriptionModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isMobileMode = false,
  setIsMobileMode,
  lang,
  setLang,
  studentProfile,
  onOpenProfileModal,
  onOpenPromoModal,
  onOpenSubscriptionModal,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 text-white shadow-2xl">
      {/* Top Banner */}
      <div className="bg-[#000000] px-3 sm:px-4 py-2 text-xs border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-white/80 font-medium">
          <span className="inline-flex items-center gap-1.5 bg-[#00FF88]/10 text-[#00FF88] px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border border-[#00FF88]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" />
            <span className="hidden sm:inline">{t.topBanner}</span>
            <span className="sm:hidden font-black">EduBridge HK AI</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {/* Mode Switcher Toggle Button */}
          {setIsMobileMode && (
            <button
              onClick={() => setIsMobileMode(!isMobileMode)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all border shadow-sm ${
                isMobileMode
                  ? "bg-purple-600 text-white border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  : "bg-white/10 text-white/90 border-white/20 hover:bg-white/20"
              }`}
            >
              {isMobileMode ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-yellow-300" />
                  <span>📱 手機版</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-300" />
                  <span>🖥️ 桌面版</span>
                </>
              )}
            </button>
          )}

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-xl p-1 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-[#00FF88] ml-1 shrink-0" />
            <button
              onClick={() => setLang("zh-CN")}
              className={`px-2.5 py-1 rounded-lg uppercase transition-all ${
                lang === "zh-CN"
                  ? "bg-[#00FF88] text-black font-black shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              简体
            </button>
            <button
              onClick={() => setLang("zh-HK")}
              className={`px-2.5 py-1 rounded-lg uppercase transition-all ${
                lang === "zh-HK"
                  ? "bg-[#00FF88] text-black font-black shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              繁體
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-lg uppercase transition-all ${
                lang === "en"
                  ? "bg-[#00FF88] text-black font-black shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          {/* Subscription Button */}
          {onOpenSubscriptionModal && (
            <button
              onClick={onOpenSubscriptionModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
            >
              <CreditCard className="w-3.5 h-3.5 text-yellow-300" />
              <span>{lang === "en" ? "💳 Subscription" : lang === "zh-CN" ? "💳 订阅计划" : "💳 訂閱計劃"}</span>
            </button>
          )}

          {/* Student Profile Button */}
          {onOpenProfileModal && (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5 text-yellow-300" />
              <span>
                {studentProfile
                  ? `👤 ${studentProfile.name} (${studentProfile.grade})`
                  : lang === "en"
                  ? "👤 Student Profile"
                  : lang === "zh-CN"
                  ? "👤 学生档案"
                  : "👤 學生檔案"}
              </span>
            </button>
          )}

          {/* Promo Showcase Modal Trigger */}
          {onOpenPromoModal && (
            <button
              onClick={onOpenPromoModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{lang === "en" ? "🌟 DSE Cards" : lang === "zh-CN" ? "🌟 DSE 备考卡片" : "🌟 DSE 奪星卡片"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Links to Landing Page */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab("welcome")}
            title={lang === "en" ? "Return to Landing Page" : "返回首頁"}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00FF88] to-blue-500 border-2 border-white/20 p-0.5 shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-black rounded-[9px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#00FF88]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tighter uppercase text-white group-hover:text-[#00FF88] transition-colors">
                  EduBridge<span className="text-[#00FF88]">HK</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/40 border border-white/20 px-2 py-0.5 rounded font-bold">
                  Academic Pro
                </span>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest hidden sm:block">
                {t.appSubTitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#000000] p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "home"
                  ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.25)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{lang === "en" ? "App Hub" : lang === "zh-CN" ? "🏠 功能总览" : "🏠 功能總覽"}</span>
            </button>

            <button
              onClick={() => setActiveTab("snap")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "snap"
                  ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.25)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Camera className="w-4 h-4" />
              {t.tabSnap}
            </button>

            <button
              onClick={() => setActiveTab("discussion")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all relative ${
                activeTab === "discussion"
                  ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.25)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              {t.tabDiscussion}
              <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                AI Oral
              </span>
            </button>

            <button
              onClick={() => setActiveTab("knowledge")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "knowledge"
                  ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.25)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Brain className="w-4 h-4" />
              {t.tabKnowledge}
            </button>

            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "admin"
                  ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.25)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Shield className="w-4 h-4" />
              {lang === "en" ? "Admin" : lang === "zh-CN" ? "后台" : "後台"}
            </button>
          </nav>

          {/* Language / Support Tag */}
          <div className="flex items-center gap-2">
            <div className="border border-white/20 bg-white/5 text-[#00FF88] px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#00FF88]" />
              <span className="hidden sm:inline">
                {lang === "en" ? "Trilingual:" : lang === "zh-CN" ? "三语适应:" : "三語適應:"}
              </span>{" "}
              英 / 粵 / 普
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar (Shown only in Desktop View on mobile screen sizes) */}
      {!isMobileMode && (
        <div className="md:hidden flex border-t border-white/15 bg-black/95 backdrop-blur-lg px-2 py-2 justify-around gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 min-w-[60px] flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all active:scale-95 ${
              activeTab === "home"
                ? "bg-[#00FF88] text-black shadow-[0_0_18px_rgba(0,255,136,0.4)]"
                : "text-white/70 hover:text-white bg-white/5 border border-white/10"
            }`}
          >
            <LayoutGrid className="w-5 h-5 mb-1" />
            <span>{lang === "en" ? "Hub" : lang === "zh-CN" ? "总览" : "總覽"}</span>
          </button>

          <button
            onClick={() => setActiveTab("snap")}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all active:scale-95 ${
              activeTab === "snap"
                ? "bg-[#00FF88] text-black shadow-[0_0_18px_rgba(0,255,136,0.4)]"
                : "text-white/70 hover:text-white bg-white/5 border border-white/10"
            }`}
          >
            <Camera className="w-5 h-5 mb-1" />
            <span>{lang === "en" ? "Snap" : lang === "zh-CN" ? "即影即学" : "即影即學"}</span>
          </button>

          <button
            onClick={() => setActiveTab("discussion")}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all active:scale-95 ${
              activeTab === "discussion"
                ? "bg-[#00FF88] text-black shadow-[0_0_18px_rgba(0,255,136,0.4)]"
                : "text-white/70 hover:text-white bg-white/5 border border-white/10"
            }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span>{lang === "en" ? "Oral" : lang === "zh-CN" ? "AI 口试" : "AI 口試"}</span>
          </button>

          <button
            onClick={() => setActiveTab("knowledge")}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all active:scale-95 ${
              activeTab === "knowledge"
                ? "bg-[#00FF88] text-black shadow-[0_0_18px_rgba(0,255,136,0.4)]"
                : "text-white/70 hover:text-white bg-white/5 border border-white/10"
            }`}
          >
            <Brain className="w-5 h-5 mb-1" />
            <span>{lang === "en" ? "Cards" : lang === "zh-CN" ? "知识库" : "知識庫"}</span>
          </button>

          <button
            onClick={() => setActiveTab("admin")}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all active:scale-95 ${
              activeTab === "admin"
                ? "bg-[#00FF88] text-black shadow-[0_0_18px_rgba(0,255,136,0.4)]"
                : "text-white/70 hover:text-white bg-white/5 border border-white/10"
            }`}
          >
            <Shield className="w-5 h-5 mb-1" />
            <span>{lang === "en" ? "Admin" : lang === "zh-CN" ? "后台" : "後台"}</span>
          </button>
        </div>
      )}
    </header>
  );
};

