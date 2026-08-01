import React from "react";
import {
  Camera,
  Users,
  Brain,
  Sparkles,
  Award,
  BarChart3,
  Globe,
  GraduationCap,
  LayoutGrid,
  Shield,
  Smartphone,
  Monitor
} from "lucide-react";
import { Language, translations } from "../utils/i18n";

interface NavbarProps {
  activeTab: "home" | "snap" | "discussion" | "knowledge" | "investor" | "admin";
  setActiveTab: (tab: "home" | "snap" | "discussion" | "knowledge" | "investor" | "admin") => void;
  investorMode: boolean;
  setInvestorMode: (val: boolean) => void;
  isMobileMode?: boolean;
  setIsMobileMode?: (val: boolean) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  investorMode,
  setInvestorMode,
  isMobileMode = false,
  setIsMobileMode,
  lang,
  setLang,
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
                  <span>📱 手機極簡模式 ON</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-300" />
                  <span className="hidden sm:inline">🖥️ 全功能簡報模式</span>
                  <span className="sm:hidden">🖥️ 簡報</span>
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

          {/* Investor Pitch Toggle */}
          <button
            onClick={() => setInvestorMode(!investorMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              investorMode
                ? "bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                : "bg-white/10 text-white/70 border border-white/20 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">{investorMode ? t.investorModeOn : t.investorModeOff}</span>
            <span className="sm:hidden">{investorMode ? "投資 ON" : "投資 OFF"}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00FF88] to-blue-500 border-2 border-white/20 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[9px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#00FF88]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tighter uppercase text-white">
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
          <nav className="hidden md:flex items-center gap-2 bg-[#000000] p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "home"
                  ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.25)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              {t.tabHome || "🏠 主頁選單"}
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
              <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.2 rounded uppercase animate-pulse">
                Phase 2
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
              onClick={() => setActiveTab("investor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "investor"
                  ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.25)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {t.tabInvestor}
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

          {/* Quick Stats / Subscription Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("investor")}
              className="border border-white/20 bg-white/5 text-[#00FF88] hover:border-[#00FF88] px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-[#00FF88]" />
              <span className="hidden sm:inline">三語適應:</span> 英 / 粵 / 普
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar - Large, High-Contrast Touchable Buttons */}
      <div className="md:hidden flex border-t border-white/15 bg-black/95 backdrop-blur-lg px-2 py-2 justify-around gap-1">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all active:scale-95 ${
            activeTab === "home"
              ? "bg-[#00FF88] text-black shadow-[0_0_18px_rgba(0,255,136,0.4)]"
              : "text-white/70 hover:text-white bg-white/5 border border-white/10"
          }`}
        >
          <LayoutGrid className="w-6 h-6 mb-1" />
          <span>{lang === "en" ? "Home" : lang === "zh-CN" ? "主页" : "主頁"}</span>
        </button>

        <button
          onClick={() => setActiveTab("snap")}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all active:scale-95 ${
            activeTab === "snap"
              ? "bg-[#00FF88] text-black shadow-[0_0_18px_rgba(0,255,136,0.4)]"
              : "text-white/70 hover:text-white bg-white/5 border border-white/10"
          }`}
        >
          <Camera className="w-6 h-6 mb-1" />
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
          <Users className="w-6 h-6 mb-1" />
          <span>{lang === "en" ? "Speaking" : lang === "zh-CN" ? "AI 口试" : "AI 口試"}</span>
        </button>

        <button
          onClick={() => setActiveTab("knowledge")}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all active:scale-95 ${
            activeTab === "knowledge"
              ? "bg-[#00FF88] text-black shadow-[0_0_18px_rgba(0,255,136,0.4)]"
              : "text-white/70 hover:text-white bg-white/5 border border-white/10"
          }`}
        >
          <Brain className="w-6 h-6 mb-1" />
          <span>{lang === "en" ? "Cards" : lang === "zh-CN" ? "知识库" : "知識庫"}</span>
        </button>

        <button
          onClick={() => setActiveTab("investor")}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all active:scale-95 ${
            activeTab === "investor"
              ? "bg-[#00FF88] text-black shadow-[0_0_18px_rgba(0,255,136,0.4)]"
              : "text-white/70 hover:text-white bg-white/5 border border-white/10"
          }`}
        >
          <Sparkles className="w-6 h-6 mb-1" />
          <span>{lang === "en" ? "Business" : lang === "zh-CN" ? "商业" : "商業"}</span>
        </button>

        <button
          onClick={() => setActiveTab("admin")}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all active:scale-95 ${
            activeTab === "admin"
              ? "bg-[#00FF88] text-black shadow-[0_0_18px_rgba(0,255,136,0.4)]"
              : "text-white/70 hover:text-white bg-white/5 border border-white/10"
          }`}
        >
          <Shield className="w-6 h-6 mb-1" />
          <span>{lang === "en" ? "Admin" : lang === "zh-CN" ? "后台" : "後台"}</span>
        </button>
      </div>
    </header>
  );
};
