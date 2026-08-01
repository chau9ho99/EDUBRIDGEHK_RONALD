import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import {
  Brain,
  BookOpen,
  Volume2,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Tag,
  Clock,
  TrendingUp,
  FileText,
  Award,
  Zap,
  Trash2,
  Grid,
  Layers,
  X,
  Maximize2,
  MoveRight,
  MoveLeft,
  RotateCcw,
  MousePointerClick,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shuffle,
  Download,
  Upload,
  Database,
  FileSpreadsheet,
  Check,
  RefreshCw
} from "lucide-react";
import { SnapItem, VocabWord } from "../types";
import { speakText } from "../utils/speechUtils";
import { Language, translations, getVocabMeaning, toSimplifiedChinese } from "../utils/i18n";
import {
  DSE_VOCAB_DATABASE,
  getRandomDSEVocab,
  downloadDSEVocabTemplateCSV,
  downloadDSEVocabTemplateJSON,
  parseCustomVocabList
} from "../data/dseVocabDatabase";

interface KnowledgeBaseProps {
  snapItems: SnapItem[];
  onAddSnapItem?: (item: SnapItem) => void;
  onDeleteSnapItem?: (id: string) => void;
  onDeleteAllSnapItems?: () => void;
  onResetSampleSnapItems?: () => void;
  onAddVocabToActiveItem?: (vocab: VocabWord) => void;
  investorMode: boolean;
  lang?: Language;
}

// Sub-component for interactive 3D Drag-and-Drop Flashcard with Framer Motion
const DragFlashcard: React.FC<{
  vocab: VocabWord;
  isMastered: boolean;
  onToggleMaster: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCount: number;
  lang?: Language;
}> = ({ vocab, isMastered, onToggleMaster, onNext, onPrev, currentIndex, totalCount, lang }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 0.8, 1, 0.8, 0]);
  
  // Dynamic glow indicator overlay based on swipe direction
  const rightGlowOpacity = useTransform(x, [20, 150], [0, 1]);
  const leftGlowOpacity = useTransform(x, [-150, -20], [1, 0]);

  const meaningText = getVocabMeaning(vocab, lang);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 120) {
      // Swiped Right -> Mastered
      if (!isMastered) onToggleMaster();
      setIsFlipped(false);
      onNext();
    } else if (info.offset.x < -120) {
      // Swiped Left -> Review / Next
      setIsFlipped(false);
      onNext();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto py-2">
      {/* Swipe visual hints */}
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-white/40 mb-2 px-2">
        <span className="flex items-center gap-1 text-purple-400">
          <MoveLeft className="w-4 h-4 animate-pulse" /> 向左拖拽 (留待重溫)
        </span>
        <span className="text-white/60 font-mono">
          {currentIndex + 1} / {totalCount}
        </span>
        <span className="flex items-center gap-1 text-[#00FF88]">
          向右拖拽 (記熟生詞) <MoveRight className="w-4 h-4 animate-pulse" />
        </span>
      </div>

      <div className="relative h-[280px] sm:h-[320px] w-full perspective-1000">
        <motion.div
          key={vocab.word}
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileGrab={{ scale: 1.02, cursor: "grabbing" }}
          className="w-full h-full cursor-grab touch-none select-none relative"
        >
          {/* Card Container with 3D Flip effect */}
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ transformStyle: "preserve-3d" }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-full bg-[#0d0d0d] border-2 border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-[#00FF88]/50 transition-colors"
          >
            {/* Swiping Indicator Overlays */}
            <motion.div
              style={{ opacity: rightGlowOpacity }}
              className="absolute inset-0 bg-[#00FF88]/20 border-4 border-[#00FF88] rounded-3xl pointer-events-none flex items-center justify-end pr-8 z-20"
            >
              <div className="bg-[#00FF88] text-black font-black text-lg px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> 已熟記！
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: leftGlowOpacity }}
              className="absolute inset-0 bg-purple-600/20 border-4 border-purple-500 rounded-3xl pointer-events-none flex items-center justify-start pl-8 z-20"
            >
              <div className="bg-purple-600 text-white font-black text-lg px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2">
                <RotateCcw className="w-6 h-6" /> 留待重溫
              </div>
            </motion.div>

            {/* Top Bar inside Card */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-[#00FF88] border border-white/20">
                {vocab.level}
              </span>
              <span className="text-[10px] font-mono text-white/40 flex items-center gap-1">
                <MousePointerClick className="w-3 h-3 text-[#00FF88]" />
                點擊翻牌查看釋義
              </span>
            </div>

            {/* FRONT SIDE */}
            <div
              style={{ backfaceVisibility: "hidden" }}
              className="w-full h-full flex flex-col items-center justify-center space-y-3"
            >
              <h2 className="text-3xl sm:text-4xl font-black text-[#00FF88] tracking-tight uppercase">
                {vocab.word}
              </h2>
              <p className="text-sm font-mono text-white/50">{vocab.ipa}</p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(vocab.word, "en-US", 1.0);
                }}
                className="p-3 bg-white/10 hover:bg-[#00FF88] text-[#00FF88] hover:text-black rounded-2xl transition-all border border-white/20 shadow-lg active:scale-95"
                title="AI Speech"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* BACK SIDE (Rotated 180deg) */}
            <div
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              className="absolute inset-0 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-3 bg-[#0a0a0a] rounded-3xl"
            >
              <h3 className="text-2xl font-black text-white">{meaningText}</h3>
              <p className="text-xs text-white/60 italic max-w-md line-clamp-2">{vocab.meanEn}</p>
              
              {vocab.exampleSentence && (
                <div className="p-3 bg-white/5 rounded-xl text-xs text-white/90 border border-white/10 max-w-md text-left font-sans leading-relaxed">
                  <span className="text-[10px] font-black text-[#00FF88] uppercase block mb-1">DSE 實戰例句：</span>
                  "{vocab.exampleSentence}"
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Manual Control Buttons */}
      <div className="flex items-center justify-between gap-3 mt-4">
        <button
          onClick={onPrev}
          className="px-4 py-2.5 bg-white/5 hover:bg-white/15 text-white border border-white/15 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" /> 上一個
        </button>

        <button
          onClick={onToggleMaster}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-2 shadow-lg active:scale-95 ${
            isMastered
              ? "bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88]"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
          {isMastered ? "✓ 已熟記" : "標記熟記"}
        </button>

        <button
          onClick={onNext}
          className="px-5 py-2.5 bg-[#00FF88] hover:bg-[#00e67a] text-black rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
        >
          下一個 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  snapItems,
  onAddSnapItem,
  onDeleteSnapItem,
  onDeleteAllSnapItems,
  onResetSampleSnapItems,
  onAddVocabToActiveItem,
  investorMode,
  lang = "zh-CN"
}) => {
  const t = translations[lang];
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"passages" | "vocab">("vocab");
  const [vocabFilter, setVocabFilter] = useState<"all" | "review" | "mastered">("all");
  const [viewMode, setViewMode] = useState<"dense" | "cards" | "flashcard">("dense");
  const [masteredMap, setMasteredMap] = useState<Record<string, boolean>>({});

  // Active word details modal for flyout popup on double-click or click
  const [popupWord, setPopupWord] = useState<VocabWord | null>(null);

  // Batch import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importInputText, setImportInputText] = useState("");
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  // Clear all confirmation modal state
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmClearAll = () => {
    if (onDeleteAllSnapItems) {
      onDeleteAllSnapItems();
      showToast("已成功清空所有紀錄");
    }
    setIsConfirmClearOpen(false);
  };

  // Flatten and STRICTLY deduplicate all vocabulary words across all snap items
  const allVocabsDeduplicated: VocabWord[] = useMemo(() => {
    const map = new Map<string, VocabWord>();
    for (const item of [...snapItems].reverse()) {
      for (const v of item.vocabulary) {
        const key = v.word.trim().toLowerCase();
        if (!map.has(key)) {
          map.set(key, v);
        }
      }
    }
    return Array.from(map.values());
  }, [snapItems]);

  // Filtered vocabs based on review status & search
  const filteredVocabs = useMemo(() => {
    return allVocabsDeduplicated.filter((v) => {
      const isMastered = masteredMap[v.word.trim().toLowerCase()];
      if (vocabFilter === "review" && isMastered) return false;
      if (vocabFilter === "mastered" && !isMastered) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          v.word.toLowerCase().includes(q) ||
          v.meanZh.toLowerCase().includes(q) ||
          (v.meanCn && v.meanCn.toLowerCase().includes(q)) ||
          toSimplifiedChinese(v.meanZh).toLowerCase().includes(q) ||
          v.meanEn.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allVocabsDeduplicated, vocabFilter, masteredMap, searchQuery]);

  // Extract all unique knowledge tags
  const allTags = Array.from(
    new Set(["All", ...snapItems.flatMap((item) => item.knowledgeTags)])
  );

  // Filter snap items by tag and search query
  const filteredItems = snapItems.filter((item) => {
    const matchesTag = selectedTag === "All" || item.knowledgeTags.includes(selectedTag);
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ocrText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const currentFlashcard = filteredVocabs[flashcardIndex] || filteredVocabs[0];

  // Helper for popup navigation inside modal
  const handlePopupPrevNext = (direction: "prev" | "next") => {
    if (!popupWord) return;
    const currentIndex = filteredVocabs.findIndex(
      (v) => v.word.trim().toLowerCase() === popupWord.word.trim().toLowerCase()
    );
    if (currentIndex === -1) return;

    if (direction === "prev") {
      const nextIdx = currentIndex > 0 ? currentIndex - 1 : filteredVocabs.length - 1;
      setPopupWord(filteredVocabs[nextIdx]);
    } else {
      const nextIdx = currentIndex < filteredVocabs.length - 1 ? currentIndex + 1 : 0;
      setPopupWord(filteredVocabs[nextIdx]);
    }
  };

  // Handle Random Draw from Built-in Database
  const handleDrawRandomFromDatabase = (count: number = 5) => {
    const existingWordList = allVocabsDeduplicated.map((v) => v.word);
    const drawnWords = getRandomDSEVocab(count, existingWordList);

    if (drawnWords.length === 0) {
      showToast("已載入所有預設 DSE 題庫單字！");
      return;
    }

    const newSnapItem: SnapItem = {
      id: `draw-db-${Date.now()}`,
      timestamp: Date.now(),
      title: `🔀 DSE 核心題庫抽卡 (${drawnWords.length} 個單字)`,
      subjectCategory: "Offline Database Draw",
      ocrText: drawnWords.map((w) => w.word).join(", "),
      hkdseContext: "此組單字來自系統內建 HKDSE 高頻核心資料庫，無須消耗 AI 算力即刻溫習！",
      translation: "系統隨機抽樣生詞組",
      vocabulary: drawnWords,
      grammarNotes: ["內建高頻單字，附例句與國際音標 (IPA)"],
      speechScript: drawnWords.map((w) => `${w.word}: ${getVocabMeaning(w, lang)}`).join(". "),
      knowledgeTags: ["#DSE_Vocab_Bank", "#Offline_Draw"],
      suggestedQuestions: [
        `How do I use "${drawnWords[0]?.word}" in DSE Paper 2 writing?`
      ],
      chatHistory: []
    };

    if (onAddSnapItem) {
      onAddSnapItem(newSnapItem);
      showToast(`⚡ 成功從 DSE 資料庫抽取出 ${drawnWords.length} 個高頻生字！`);
    }
  };

  // Handle Batch Import Execution
  const handleExecuteBatchImport = () => {
    if (!importInputText.trim()) {
      setImportFeedback("請先貼上 CSV、JSON 或 Google Sheets 數據內容！");
      return;
    }

    const parsedVocabs = parseCustomVocabList(importInputText);
    if (parsedVocabs.length === 0) {
      setImportFeedback("未能解析任何有效單字，請檢查格式或使用模版。");
      return;
    }

    const newSnapItem: SnapItem = {
      id: `import-${Date.now()}`,
      timestamp: Date.now(),
      title: `📥 批次匯入生詞庫 (${parsedVocabs.length} 個單字)`,
      subjectCategory: "Custom Import",
      ocrText: parsedVocabs.map((w) => w.word).join(", "),
      hkdseContext: "使用者自訂批次匯入 / Google Sheets 模版單字組",
      translation: "自訂匯入單字庫",
      vocabulary: parsedVocabs,
      grammarNotes: ["批次匯入成功"],
      speechScript: parsedVocabs.map((w) => w.word).join(", "),
      knowledgeTags: ["#Custom_Import", "#Teacher_Template"],
      suggestedQuestions: [],
      chatHistory: []
    };

    if (onAddSnapItem) {
      onAddSnapItem(newSnapItem);
      setIsImportModalOpen(false);
      setImportInputText("");
      setImportFeedback(null);
      showToast(`🎉 成功匯入 ${parsedVocabs.length} 個自訂 DSE 生字！`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-[#00FF88] text-black font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,255,136,0.4)] flex items-center gap-2 border border-black/20"
          >
            <Sparkles className="w-5 h-5 text-black animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Investor Pitch Banner */}
      {investorMode && (
        <div className="bg-white/5 border border-white/10 border-l-2 border-[#00FF88] rounded-xl p-5 text-white/80 text-xs sm:text-sm flex items-start gap-4 shadow-2xl">
          <Zap className="w-5 h-5 text-[#00FF88] shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-[#00FF88] uppercase tracking-wider text-sm">
              投資人展示亮點 (Personal Memory & Knowledge Graph Data Flywheel)
            </p>
            <p className="mt-1 text-white/70 leading-relaxed">
              平台具備個人專屬「記憶庫與知識圖譜」。內建 50+ DSE 核心生字庫，支援零延遲「隨機抽字」及 Google Sheets / CSV 批量匯入模版，無需消耗 API Rate Limit 即可即時學習！
            </p>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#080808] border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#00FF88] flex items-center justify-center font-black">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white uppercase tracking-tight">{snapItems.length}</span>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">已掃描課文/通告筆記</p>
          </div>
        </div>

        <div className="bg-[#080808] border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#00FF88] flex items-center justify-center font-black">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white uppercase tracking-tight">{allVocabsDeduplicated.length}</span>
              <span className="text-[10px] text-[#00FF88] font-mono">(去重後)</span>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">DSE 核心生詞庫</p>
          </div>
        </div>

        <div className="bg-[#080808] border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#00FF88] flex items-center justify-center font-black">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#00FF88] uppercase tracking-tight">Level 5*</span>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">平均詞彙與語法目標</p>
          </div>
        </div>

        <div className="bg-[#080808] border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#00FF88] flex items-center justify-center font-black">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white uppercase tracking-tight">
              {Object.keys(masteredMap).length} / {allVocabsDeduplicated.length}
            </span>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">已熟記單字數</p>
          </div>
        </div>
      </div>

      {/* Main View Switch Tabs & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("vocab")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "vocab"
                ? "bg-[#00FF88] text-black shadow-lg"
                : "bg-black text-white/60 hover:text-white border border-white/10"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>DSE 生詞重溫庫 ({allVocabsDeduplicated.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("passages")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "passages"
                ? "bg-[#00FF88] text-black shadow-lg"
                : "bg-black text-white/60 hover:text-white border border-white/10"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>已歸檔課文與文章 ({snapItems.length})</span>
          </button>
        </div>

        {/* Quick Database Draw & Batch Import Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleDrawRandomFromDatabase(5)}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] active:scale-95"
            title="從內建 DSE 高頻題庫隨機抽出 5 個 Level 4-5* 單字"
          >
            <Shuffle className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
            <span>🔀 隨機抽 5 個 DSE 詞彙</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 border border-white/20 transition-all active:scale-95"
            title="批量匯入 Google Sheets / CSV 生詞模版"
          >
            <Upload className="w-3.5 h-3.5 text-[#00FF88]" />
            <span>📥 批次匯入 / 模版</span>
          </button>

          {/* Restore Sample Templates Button */}
          {onResetSampleSnapItems && (
            <button
              onClick={() => {
                onResetSampleSnapItems();
                showToast("已成功恢復預設示範課文與 DSE 題庫！");
              }}
              className="px-3.5 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
              title="一鍵重置為系統內建 3 篇 DSE 高階英文示範文章與標註詞庫"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>↺ 恢復示範範本</span>
            </button>
          )}

          {/* Clear All */}
          {snapItems.length > 0 && onDeleteAllSnapItems && (
            <button
              onClick={() => setIsConfirmClearOpen(true)}
              className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.deleteAll}</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: VOCABULARY & FLASHCARDS & COMPACT MATRIX */}
      {activeTab === "vocab" && (
        <div className="space-y-6">
          {/* Header Controls for Vocab View */}
          <div className="bg-[#080808] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#00FF88]" />
                <h3 className="font-black text-white text-base sm:text-lg uppercase tracking-tight">
                  DSE 生詞庫與高效視覺檢視
                </h3>
              </div>

              {/* View Layout Mode Buttons */}
              <div className="flex items-center gap-1.5 bg-black p-1 border border-white/10 rounded-xl">
                <button
                  onClick={() => setViewMode("dense")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    viewMode === "dense"
                      ? "bg-[#00FF88] text-black shadow"
                      : "text-white/60 hover:text-white"
                  }`}
                  title="高密度矩陣（一眼瀏覽數十個生字，Double-click 開啟 Popup）"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>⚡ 密集高密度清單</span>
                </button>

                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    viewMode === "cards"
                      ? "bg-[#00FF88] text-black shadow"
                      : "text-white/60 hover:text-white"
                  }`}
                  title="經典單字卡網格"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>🎴 經典卡片</span>
                </button>

                <button
                  onClick={() => setViewMode("flashcard")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    viewMode === "flashcard"
                      ? "bg-[#00FF88] text-black shadow"
                      : "text-white/60 hover:text-white"
                  }`}
                  title="3D 拖拽閃卡"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>🃏 3D 互動閃卡</span>
                </button>
              </div>
            </div>

            {/* Sub Filter & Search bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-black p-1 border border-white/10 rounded-xl">
                <button
                  onClick={() => setVocabFilter("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    vocabFilter === "all" ? "bg-white/20 text-white font-black" : "text-white/60 hover:text-white"
                  }`}
                >
                  全部 ({allVocabsDeduplicated.length})
                </button>
                <button
                  onClick={() => setVocabFilter("review")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    vocabFilter === "review" ? "bg-purple-600 text-white font-black" : "text-white/60 hover:text-white"
                  }`}
                >
                  待重溫 ({allVocabsDeduplicated.length - Object.keys(masteredMap).length})
                </button>
                <button
                  onClick={() => setVocabFilter("mastered")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    vocabFilter === "mastered" ? "bg-[#00FF88] text-black font-black" : "text-white/60 hover:text-white"
                  }`}
                >
                  已熟記 ({Object.keys(masteredMap).length})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋生詞/中文釋義..."
                  className="w-full bg-black border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00FF88]"
                />
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: 3D FLASHCARD SWIPE */}
          {viewMode === "flashcard" && (
            <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl">
              {currentFlashcard ? (
                <DragFlashcard
                  vocab={currentFlashcard}
                  isMastered={!!masteredMap[currentFlashcard.word.trim().toLowerCase()]}
                  onToggleMaster={() => {
                    const norm = currentFlashcard.word.trim().toLowerCase();
                    setMasteredMap((prev) => ({ ...prev, [norm]: !prev[norm] }));
                  }}
                  onNext={() => {
                    setFlashcardIndex((prev) => (prev < filteredVocabs.length - 1 ? prev + 1 : 0));
                  }}
                  onPrev={() => {
                    setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : filteredVocabs.length - 1));
                  }}
                  currentIndex={flashcardIndex}
                  totalCount={filteredVocabs.length}
                  lang={lang}
                />
              ) : (
                <div className="py-12 text-center text-white/40">目前無符合條件的單字</div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: DENSE HIGH-CAPACITY TILE MATRIX (一眼望曬數十個生字) */}
          {viewMode === "dense" && (
            <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between text-xs text-white/50 border-b border-white/10 pb-2 gap-2">
                <span className="flex items-center gap-1.5 text-[#00FF88] font-bold">
                  <MousePointerClick className="w-4 h-4 text-[#00FF88]" />
                  💡 提示：點擊或 Double-Click 雙擊任何單字，即可「飛出彈窗」查閱 DSE 真題例句與 AI 朗讀！
                </span>
                <span className="font-mono text-white/40">顯示 {filteredVocabs.length} 個單字</span>
              </div>

              {filteredVocabs.length === 0 ? (
                <div className="py-12 text-center text-white/40">目前無符合條件的單字</div>
              ) : (
                <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  <AnimatePresence>
                    {filteredVocabs.map((vocab) => {
                      const norm = vocab.word.trim().toLowerCase();
                      const isMastered = !!masteredMap[norm];

                      return (
                        <motion.div
                          key={vocab.id || norm}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => setPopupWord(vocab)}
                          onDoubleClick={() => setPopupWord(vocab)}
                          className={`group cursor-pointer p-3.5 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between hover:scale-[1.03] active:scale-95 shadow-lg ${
                            isMastered
                              ? "bg-black/60 border-[#00FF88]/30 hover:border-[#00FF88]"
                              : "bg-[#0f0f0f] border-white/10 hover:border-purple-500/50 hover:bg-black"
                          }`}
                        >
                          {/* Corner Mastery Indicator */}
                          {isMastered && (
                            <div className="absolute top-2 right-2 text-[#00FF88]">
                              <CheckCircle2 className="w-3.5 h-3.5 fill-[#00FF88]/20" />
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 pr-4">
                              <h4 className="font-black text-sm sm:text-base text-white group-hover:text-[#00FF88] transition-colors truncate">
                                {vocab.word}
                              </h4>
                            </div>

                            <p className="text-[10px] font-mono text-white/40">{vocab.ipa}</p>
                            <p className="text-xs font-bold text-white/80 line-clamp-1">
                              {getVocabMeaning(vocab, lang)}
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[#00FF88] font-mono font-bold">
                              {vocab.level}
                            </span>
                            <span className="text-white/40 group-hover:text-white transition-colors flex items-center gap-0.5">
                              詳情 <Eye className="w-3 h-3" />
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          )}

          {/* VIEW MODE 3: CLASSIC CARDS GRID */}
          {viewMode === "cards" && (
            <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl">
              {filteredVocabs.length === 0 ? (
                <div className="py-12 text-center text-white/40">目前無符合條件的單字</div>
              ) : (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {filteredVocabs.map((vocab) => {
                      const norm = vocab.word.trim().toLowerCase();
                      const isMastered = !!masteredMap[norm];

                      return (
                        <motion.div
                          key={vocab.id || norm}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="bg-black border border-white/10 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-extrabold text-base text-[#00FF88]">{vocab.word}</h4>
                                  <button
                                    onClick={() => speakText(vocab.word, "en-US", 1.0)}
                                    className="p-1 bg-white/5 hover:bg-white/10 text-[#00FF88] rounded transition-all"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                  </button>
                                </div>
                                <span className="text-[11px] font-mono text-white/40 block">{vocab.ipa}</span>
                              </div>

                              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 shrink-0">
                                {vocab.level}
                              </span>
                            </div>

                            <div className="text-xs text-white/80 space-y-0.5">
                              <p className="font-bold text-white">
                                {getVocabMeaning(vocab, lang)}
                              </p>
                              <p className="text-white/50 italic text-[11px]">{vocab.meanEn}</p>
                            </div>

                            {vocab.exampleSentence && (
                              <p className="text-xs text-white/70 bg-white/5 p-2 rounded border border-white/10 leading-relaxed font-sans">
                                "{vocab.exampleSentence}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => setPopupWord(vocab)}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                            >
                              <Maximize2 className="w-3.5 h-3.5" /> 彈窗
                            </button>

                            <button
                              onClick={() => {
                                setMasteredMap((prev) => ({ ...prev, [norm]: !prev[norm] }));
                              }}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                                isMastered
                                  ? "bg-[#00FF88]/20 border border-[#00FF88] text-[#00FF88]"
                                  : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
                              }`}
                            >
                              {isMastered ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88]" />
                                  <span>已標記為精通</span>
                                </>
                              ) : (
                                <span>標記為精通</span>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}

      {/* FLYOUT DETAILS MODAL (POPUP ON DOUBLE-CLICK OR CLICK) */}
      <AnimatePresence>
        {popupWord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#0e0e0e] border-2 border-[#00FF88] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-[0_20px_60px_rgba(0,255,136,0.25)] space-y-6 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setPopupWord(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Top Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40">
                    {popupWord.level}
                  </span>
                  <span className="text-xs font-mono text-white/40">DSE Vocabulary Master File</span>
                </div>

                <div className="flex items-center gap-4">
                  <h2 className="text-4xl font-black text-[#00FF88] tracking-tight uppercase">
                    {popupWord.word}
                  </h2>
                  <button
                    onClick={() => speakText(popupWord.word, "en-US", 1.0)}
                    className="p-3 bg-[#00FF88] text-black hover:bg-[#00e67a] rounded-2xl transition-all shadow-lg active:scale-95 flex items-center gap-1.5 font-black text-xs"
                  >
                    <Volume2 className="w-5 h-5" /> 朗讀發音
                  </button>
                </div>
                <p className="text-sm font-mono text-white/50">{popupWord.ipa}</p>
              </div>

              {/* Meanings */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <span className="text-[10px] font-black text-[#00FF88] uppercase tracking-wider block">
                    {lang === "zh-CN" ? "中文释义 Meaning" : "中文釋義 MeanZh"}
                  </span>
                  <p className="text-xl font-black text-white">
                    {getVocabMeaning(popupWord, lang)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-wider block">英文定義 MeanEn</span>
                  <p className="text-xs text-white/80 italic">{popupWord.meanEn}</p>
                </div>
              </div>

              {/* Example Sentence */}
              {popupWord.exampleSentence && (
                <div className="space-y-1.5 bg-purple-950/40 p-4 rounded-2xl border border-purple-500/30">
                  <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" /> DSE 文章真題實戰例句 Example
                  </span>
                  <p className="text-sm text-white font-sans leading-relaxed">
                    "{popupWord.exampleSentence}"
                  </p>
                </div>
              )}

              {/* Bottom Actions inside Modal */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handlePopupPrevNext("prev")}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase flex items-center gap-1 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> 上一個字
                </button>

                <button
                  onClick={() => {
                    const norm = popupWord.word.trim().toLowerCase();
                    setMasteredMap((prev) => ({ ...prev, [norm]: !prev[norm] }));
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-2 shadow-lg active:scale-95 ${
                    masteredMap[popupWord.word.trim().toLowerCase()]
                      ? "bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88]"
                      : "bg-[#00FF88] text-black hover:bg-[#00e67a]"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {masteredMap[popupWord.word.trim().toLowerCase()] ? "✓ 已熟記" : "標記為精通"}
                </button>

                <button
                  onClick={() => handlePopupPrevNext("next")}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase flex items-center gap-1 transition-all"
                >
                  下一個字 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BATCH IMPORT MODAL (Google Sheets / CSV / JSON) */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0e0e0e] border-2 border-white/20 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative overflow-hidden"
            >
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#00FF88]" />
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    📥 批次匯入自訂生詞庫 (Google Sheets / CSV / JSON)
                  </h3>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  老師或學生可以預先複製 Google Sheets、Excel 表格或 JSON 格式大量貼上，直接匯入個人 DSE 記憶庫！
                </p>
              </div>

              {/* Template Download Links */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-[#00FF88]" />
                  1. 下載數據標準模版 (Template):
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadDSEVocabTemplateCSV}
                    className="px-3 py-1.5 bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 hover:bg-[#00FF88] hover:text-black rounded-xl text-xs font-black uppercase flex items-center gap-1 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> 下載 CSV 模版
                  </button>
                  <button
                    onClick={downloadDSEVocabTemplateJSON}
                    className="px-3 py-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-black uppercase flex items-center gap-1 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> 下載 JSON 模版
                  </button>
                </div>
              </div>

              {/* Paste Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/80 flex items-center justify-between">
                  <span>2. 貼上複製資料 (一行一個字或標準 JSON):</span>
                  <span className="text-[10px] text-white/40 font-mono">格式: Word, IPA, Level, Meaning, English, Example</span>
                </label>
                <textarea
                  rows={6}
                  value={importInputText}
                  onChange={(e) => setImportInputText(e.target.value)}
                  placeholder={`Word, IPA, Level, MeaningZh, MeaningEn, ExampleSentence\n"necessitates", "/nəˈses.ə.teɪts/", "DSE Level 5*", "迫使；使成為必要", "To make necessary.", "The weather necessitates suspension."`}
                  className="w-full bg-black border border-white/15 rounded-2xl p-4 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#00FF88] leading-relaxed"
                />
              </div>

              {importFeedback && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-bold">
                  ⚠️ {importFeedback}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleExecuteBatchImport}
                  className="px-6 py-2.5 bg-[#00FF88] hover:bg-[#00e67a] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-black" />
                  確認匯入單字庫
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TAB 2: PASSAGES ARCHIVE */}
      {activeTab === "passages" && (
        <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#00FF88]" />
              {t.kbTitle}
            </h3>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00FF88]"
                />
              </div>
            </div>
          </div>

          {/* Knowledge Tag Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Tag className="w-4 h-4 text-white/40 shrink-0" />
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedTag === tag
                    ? "bg-[#00FF88] text-black shadow"
                    : "bg-black text-white/60 hover:text-white border border-white/10"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Item Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-[#080808] border border-white/10 rounded-2xl p-8 space-y-4">
                <Brain className="w-12 h-12 text-white/20 mx-auto" />
                <p className="text-sm font-bold text-white/60">{t.emptyHistory}</p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {onResetSampleSnapItems && (
                    <button
                      onClick={() => {
                        onResetSampleSnapItems();
                        showToast("已成功恢復預設示範課文與 DSE 題庫！");
                      }}
                      className="px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 shadow-lg"
                    >
                      <RefreshCw className="w-4 h-4 text-blue-400" />
                      <span>↺ 恢復預設示範課文與 DSE 題庫</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDrawRandomFromDatabase(5)}
                    className="px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 shadow-lg"
                  >
                    <Shuffle className="w-4 h-4 text-yellow-300" />
                    <span>🔀 隨機抽出 5 個 DSE 生字</span>
                  </button>
                </div>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-black border border-white/10 rounded-xl p-5 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between group relative shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30">
                        {item.subjectCategory}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.timestamp).toLocaleDateString("zh-HK")}
                        </span>
                        {onDeleteSnapItem && (
                          <button
                            onClick={() => {
                              if (window.confirm(t.deleteSingleConfirm)) {
                                onDeleteSnapItem(item.id);
                              }
                            }}
                            title={t.deleteSingle}
                            className="p-1 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold text-base text-white">{item.title}</h4>
                    <p className="text-xs text-white/70 line-clamp-3 bg-white/5 p-3 rounded-lg border border-white/10 font-sans">
                      "{item.ocrText}"
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.knowledgeTags.map((tagText, idx) => (
                        <span key={idx} className="text-[10px] font-bold text-[#00FF88] bg-[#00FF88]/10 px-2 py-0.5 rounded uppercase tracking-wider border border-[#00FF88]/20">
                          {tagText}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                    <span className="uppercase text-[10px] tracking-wider">收錄 {item.vocabulary.length} 個 DSE 生詞</span>
                    <button
                      onClick={() => speakText(item.speechScript || item.ocrText, "en-US", 1.0)}
                      className="text-[#00FF88] hover:underline font-black uppercase tracking-wider text-xs flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> {t.readArticleAudio}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      <AnimatePresence>
        {isConfirmClearOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e0e0e] border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 text-red-400">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">確認清空全部紀錄？</h3>
                  <p className="text-xs text-white/50">此操作不可復原</p>
                </div>
              </div>

              <div className="text-xs text-white/70 space-y-2 bg-white/5 p-3.5 rounded-xl border border-white/10 font-sans leading-relaxed">
                <p>{t.deleteConfirm}</p>
                <p className="text-[11px] text-white/40">這將會一併清除本機存儲的所有歸檔文章、掃描筆記與隨附詞典紀錄。</p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsConfirmClearOpen(false)}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
                >
                  取消
                </button>
                {onResetSampleSnapItems && (
                  <button
                    onClick={() => {
                      onResetSampleSnapItems();
                      showToast("已重置為預設示範課文與 DSE 題庫！");
                      setIsConfirmClearOpen(false);
                    }}
                    className="px-3.5 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    ↺ 重置為預設示範課文
                  </button>
                )}
                <button
                  onClick={handleConfirmClearAll}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-red-500/20 active:scale-95"
                >
                  確認清空所有紀錄
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
