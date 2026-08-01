import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HomeHub } from "./components/HomeHub";
import { SnapAndLearn } from "./components/SnapAndLearn";
import { GroupDiscussion } from "./components/GroupDiscussion";
import { KnowledgeBase } from "./components/KnowledgeBase";
import { InvestorHub } from "./components/InvestorHub";
import { AdminConsole } from "./components/AdminConsole";
import { MobileStudentView } from "./components/MobileStudentView";
import { HighlightReaderPopover } from "./components/HighlightReaderPopover";
import { SnapItem, VocabWord } from "./types";
import { SAMPLE_SNAP_ITEMS } from "./data/presetData";
import { GraduationCap, ArrowLeft, LayoutGrid, Shield } from "lucide-react";
import { Language, translations } from "./utils/i18n";

type TabType = "home" | "snap" | "discussion" | "knowledge" | "investor" | "admin";

export default function App() {
  const [activeTab, setActiveTabState] = useState<TabType>(() => {
    if (typeof window !== "undefined" && (window.location.pathname === "/admin" || window.location.hash === "#admin")) {
      return "admin";
    }
    return "home";
  });
  const [investorMode, setInvestorMode] = useState<boolean>(true);
  const [isMobileMode, setIsMobileMode] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>("zh-CN"); // Default to Simplified Chinese per requirement

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    if (typeof window !== "undefined") {
      if (tab === "admin") {
        window.history.pushState({}, "", "/admin");
      } else if (window.location.pathname === "/admin") {
        window.history.pushState({}, "", "/");
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === "/admin" || window.location.hash === "#admin") {
        setActiveTabState("admin");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Load persisted snap items or fallback to sample items
  const [snapItems, setSnapItems] = useState<SnapItem[]>(() => {
    try {
      const local = localStorage.getItem("edubridge_snap_items");
      if (local !== null) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_SNAP_ITEMS;
  });

  // Save snap items to localStorage whenever updated, stripping heavy base64 strings
  useEffect(() => {
    try {
      const sanitizedItems = snapItems.map((item) => {
        if (item.imageUrl && item.imageUrl.length > 5000) {
          const { imageUrl, ...rest } = item;
          return rest;
        }
        return item;
      });
      localStorage.setItem("edubridge_snap_items", JSON.stringify(sanitizedItems));
    } catch (e) {
      console.warn("localStorage quota exceeded or blocked:", e);
      try {
        const minimalItems = snapItems.slice(0, 3).map(({ imageUrl, chatHistory, ...rest }) => rest);
        localStorage.setItem("edubridge_snap_items", JSON.stringify(minimalItems));
      } catch (_) {}
    }
  }, [snapItems]);

  const handleAddSnapItem = (newItem: SnapItem) => {
    setSnapItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateSnapItem = (updatedItem: SnapItem) => {
    setSnapItems((prev) => {
      const idx = prev.findIndex((i) => i.id === updatedItem.id);
      if (idx !== -1) {
        const newArr = [...prev];
        newArr[idx] = updatedItem;
        return newArr;
      }
      return [updatedItem, ...prev];
    });
  };

  const handleDeleteSnapItem = (id: string) => {
    setSnapItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem("edubridge_snap_items", JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const handleDeleteAllSnapItems = () => {
    setSnapItems([]);
    try {
      localStorage.setItem("edubridge_snap_items", JSON.stringify([]));
    } catch (_) {}
  };

  const handleResetSampleSnapItems = () => {
    setSnapItems(SAMPLE_SNAP_ITEMS);
    try {
      localStorage.setItem("edubridge_snap_items", JSON.stringify(SAMPLE_SNAP_ITEMS));
    } catch (_) {}
  };

  const handleSaveHighlightVocab = (vocab: VocabWord) => {
    setSnapItems((prev) => {
      const targetWord = vocab.word.trim().toLowerCase();

      // If snapItems is completely empty, create a dedicated notebook item
      if (prev.length === 0) {
        const notebookItem: SnapItem = {
          id: `notebook-${Date.now()}`,
          timestamp: Date.now(),
          title: "📓 個人生詞本 (Personal Vocab Bank)",
          subjectCategory: "Personal Vocabulary",
          ocrText: vocab.word,
          hkdseContext: "個人閱讀及對標 DSE 考評局高頻生詞本",
          translation: "個人生詞本",
          vocabulary: [vocab],
          grammarNotes: ["個人閱讀隨手收藏高頻生詞"],
          speechScript: vocab.word,
          knowledgeTags: ["#Saved_Vocab", "#Personal_Bank"],
          suggestedQuestions: [`How to use "${vocab.word}" in DSE Writing?`],
          chatHistory: [],
        };
        return [notebookItem];
      }

      // Check if word already exists in ANY item's vocabulary
      const existsInAny = prev.some((item) =>
        item.vocabulary.some((v) => v.word.trim().toLowerCase() === targetWord)
      );
      if (existsInAny) return prev;

      // Append to the first item's vocabulary list
      const first = prev[0];
      const updatedFirst = {
        ...first,
        vocabulary: [vocab, ...first.vocabulary],
      };
      return [updatedFirst, ...prev.slice(1)];
    });
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00FF88] selection:text-black flex flex-col justify-between">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        investorMode={investorMode}
        setInvestorMode={setInvestorMode}
        isMobileMode={isMobileMode}
        setIsMobileMode={setIsMobileMode}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {isMobileMode ? (
          <MobileStudentView
            snapItems={snapItems}
            onAddSnapItem={handleAddSnapItem}
            onUpdateSnapItem={handleUpdateSnapItem}
            onAddVocabToActiveItem={handleSaveHighlightVocab}
            onSwitchToPresentationMode={() => setIsMobileMode(false)}
            lang={lang}
          />
        ) : (
          <>
            {/* Top Sticky Breadcrumb Bar for Feature Sub-Pages */}
            {activeTab !== "home" && (
              <div className="bg-black/80 border-b border-white/10 sticky top-[65px] sm:top-[73px] z-40 backdrop-blur-md px-3 sm:px-4 py-2.5">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveTab("home")}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#00FF88] hover:text-black text-white text-xs font-black uppercase tracking-wider border border-white/20 transition-all shadow-md group shrink-0 active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#00FF88] group-hover:text-black group-hover:-translate-x-1 transition-transform" />
                    <span>{t.backToHome}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-white/70 uppercase text-right truncate">
                    <LayoutGrid className="w-4 h-4 text-[#00FF88] shrink-0" />
                    <span className="hidden sm:inline text-white/50">{lang === "en" ? "Current:" : "當前模組:"}</span>
                    <span className="text-[#00FF88] font-black truncate">
                      {activeTab === "snap" && t.tabSnap}
                      {activeTab === "discussion" && t.tabDiscussion}
                      {activeTab === "knowledge" && t.tabKnowledge}
                      {activeTab === "investor" && t.tabInvestor}
                      {activeTab === "admin" && (lang === "en" ? "AI Admin Console" : "AI 架构与后台控制台")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "home" && (
              <HomeHub
                lang={lang}
                onSelectFeature={(feat) => setActiveTab(feat as TabType)}
                investorMode={investorMode}
              />
            )}

            {activeTab === "snap" && (
              <SnapAndLearn
                snapItems={snapItems}
                onAddSnapItem={handleAddSnapItem}
                onUpdateSnapItem={handleUpdateSnapItem}
                onDeleteSnapItem={handleDeleteSnapItem}
                onAddVocabToActiveItem={handleSaveHighlightVocab}
                investorMode={investorMode}
                lang={lang}
              />
            )}

            {activeTab === "discussion" && (
              <GroupDiscussion investorMode={investorMode} lang={lang} />
            )}

            {activeTab === "knowledge" && (
              <KnowledgeBase
                snapItems={snapItems}
                onAddSnapItem={handleAddSnapItem}
                onDeleteSnapItem={handleDeleteSnapItem}
                onDeleteAllSnapItems={handleDeleteAllSnapItems}
                onResetSampleSnapItems={handleResetSampleSnapItems}
                onAddVocabToActiveItem={handleSaveHighlightVocab}
                investorMode={investorMode}
                lang={lang}
              />
            )}

            {activeTab === "investor" && (
              <InvestorHub investorMode={investorMode} lang={lang} />
            )}

            {activeTab === "admin" && (
              <AdminConsole lang={lang} />
            )}
          </>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="border-t border-white/10 bg-[#080808] py-8 px-4 sm:px-6 lg:px-8 text-xs text-white/50 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00FF88] text-black flex items-center justify-center font-black shadow-[0_0_15px_rgba(0,255,136,0.2)]">
              <GraduationCap className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="font-black tracking-tight text-white uppercase text-sm">
                EduBridge <span className="text-[#00FF88]">HK</span>
              </p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">
                {lang === "zh-CN"
                  ? "专为香港新移民学生适应 HKDSE 课程打造的多模态与多智能体 AI 平台"
                  : lang === "zh-HK"
                  ? "專為香港新移民學生適應 HKDSE 課程打造的多模態與多智能體 AI 平台"
                  : "Multimodal & Multi-agent AI Platform for HK New Immigrant Students Adaptability"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-widest text-white/40">
            <button onClick={() => setActiveTab("investor")} className="hover:text-[#00FF88] transition-colors font-bold">
              {lang === "zh-CN" ? "商业模式与投资人专区" : lang === "zh-HK" ? "商業模式與投資人專區" : "Business Model & Investor Hub"}
            </button>
            <span className="text-white/20">•</span>
            <button onClick={() => setActiveTab("admin")} className="hover:text-[#00FF88] text-[#00FF88]/90 transition-colors font-bold flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#00FF88]" />
              <span>{lang === "zh-CN" ? "AI 架构与后台" : lang === "zh-HK" ? "AI 架構與後台" : "Admin Console"}</span>
            </button>
            <span className="text-white/20">•</span>
            <span className="text-white/30">© 2026 EduBridge HK Tech Ltd. All Rights Reserved.</span>
          </div>
        </div>
      </footer>

      {/* Global AI Selection Highlight Reader & Instant Translator */}
      <HighlightReaderPopover
        lang={lang}
        onAddVocabToActiveItem={handleSaveHighlightVocab}
      />
    </div>
  );
}
