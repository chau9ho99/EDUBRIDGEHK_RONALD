import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  Volume2,
  Users,
  Brain,
  Sparkles,
  RotateCw,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Award,
  Mic,
  Smartphone,
  Monitor,
  Play,
  Square,
  Flame,
  Shuffle,
  Star,
  CheckCircle2,
  FileText,
  Upload,
  Plus,
  RefreshCw,
  VolumeX,
  Zap,
  Globe,
  ArrowRight,
  Music,
  Lightbulb,
  Wand2,
  FolderHeart
} from "lucide-react";
import { SnapItem, VocabWord } from "../types";
import { Language, translations, toSimplifiedChinese, getVocabMeaning } from "../utils/i18n";
import { speakText, stopSpeech } from "../utils/speechUtils";
import { getRandomDSEVocab } from "../data/dseVocabDatabase";

interface MobileStudentViewProps {
  snapItems: SnapItem[];
  onAddSnapItem: (item: SnapItem) => void;
  onUpdateSnapItem?: (item: SnapItem) => void;
  onAddVocabToActiveItem?: (vocab: VocabWord) => void;
  onSwitchToPresentationMode: () => void;
  lang: Language;
}

type MobileTab = "snap" | "audio" | "oral" | "flashcards" | "database";

// Sample AI DSE Passage Topics for instant generation
const DSE_AI_TOPICS = [
  {
    topic: "Artificial Intelligence in Education",
    title: "🤖 AI 考題範文: AI Ethics in Classrooms",
    text: "The integration of generative artificial intelligence in Hong Kong secondary education necessitates rigorous digital literacy frameworks. Educators emphasize that while automated tools enhance learning efficiency, students must cultivate critical thinking to evaluate algorithmic outputs.",
    translation: "生成式人工智能在香港中學教育中的融合，使嚴謹的數碼素養框架成為必要。教育工作者強調，雖然自動化工具能提高學習效率，但學生必須培養批判性思維以評估算法輸出。",
    tags: ["#DSE_AI", "#Level5**", "#Technology"]
  },
  {
    topic: "Sustainable HK Urban Transit",
    title: "🌿 AI 考題範文: Green Urban Transit in HK",
    text: "Hong Kong's urban transit system strives to mitigate carbon emissions by expanding electric bus fleets and incorporating smart energy grids, fostering a resilient infrastructure against impending climate risks.",
    translation: "香港的城市交通系統致力於透過擴大電動巴士車隊及融入智慧能源網格來減輕碳排放，從而構建能抵禦迫在眉睫的氣候風險的強韌基礎設施。",
    tags: ["#HK_Transit", "#Environment", "#DSE_Writing"]
  },
  {
    topic: "Youth Mental Well-being",
    title: "🧠 AI 考題範文: Youth Resilience & Mental Health",
    text: "Prioritizing emotional well-being enables young scholars to navigate academic stress. Schools should implement holistic support systems to alleviate anxiety and cultivate psychological resilience.",
    translation: "優先考慮情緒健康能讓青年學者應對學業壓力。學校應實施全面支援系統以緩解焦慮，並培養心理複原力。",
    tags: ["#MentalHealth", "#Youth_DSE", "#Paper2"]
  }
];

// Sample Shadowing Sentence / Paragraph Pool for Audio Tab
const SHADOWING_PRACTICE_POOL = [
  {
    id: "s1",
    title: "DSE 5** 高頻核心句 1",
    type: "sentence",
    text: "The weather condition necessitates immediate suspension of outdoor activities in Hong Kong.",
    ipa: "/ðə ˈweð.ər kənˈdɪʃ.ən nəˈses.ə.teɪts ɪˈmiː.di.ət səˈspen.ʃən əv ˈaʊtˌdɔːr ækˈtɪv.ə.tiz/",
    targetWord: "necessitates",
    level: "DSE Level 5*"
  },
  {
    id: "s2",
    title: "DSE 5** 高頻核心句 2",
    type: "sentence",
    text: "Proactive mitigation strategies are essential to alleviate the severe consequences of extreme climate events.",
    ipa: "/prəʊˈæk.tɪv ˌmɪt.ɪˈɡeɪ.ʃən stræt.ə.dʒiz ɑːr ɪˈsen.ʃəl tuː əˈliː.vi.eɪt ðə sɪˈvɪər kənˈsɪ.kwəns.ɪz/",
    targetWord: "mitigation",
    level: "DSE Level 5**"
  },
  {
    id: "s3",
    title: "DSE 5** 閱讀考題短文 3",
    type: "passage",
    text: "Collaborative learning environments empower students to articulate their perspectives effectively while fostering mutual respect and active listening skills during oral exams.",
    ipa: "/kəˈlæb.ər.ə.tɪv ˈlɜː.nɪŋ ɪnˈvaɪ.rən.mənts ɪmˈpaʊ.ər ˈstjuː.dənts tuː ɑːˈtɪk.jə.leɪt ðeər pəˈspek.tɪvz/",
    targetWord: "articulate",
    level: "DSE Level 5*"
  },
  {
    id: "s4",
    title: "DSE 5** 議論文金句 4",
    type: "sentence",
    text: "To substantiate our argument, we must integrate reliable empirical data and authoritative references.",
    ipa: "/tuː səbˈstæn.ʃi.eɪt ˈaʊər ˈɑːɡ.jə.mənt wiː mʌst ˈɪn.tɪ.ɡreɪt rɪˈlaɪ.ə.bəl ɪmˈpɪr.ɪ.kəl ˈdeɪ.tə/",
    targetWord: "substantiate",
    level: "DSE Level 5**"
  }
];

export const MobileStudentView: React.FC<MobileStudentViewProps> = ({
  snapItems,
  onAddSnapItem,
  onUpdateSnapItem,
  onAddVocabToActiveItem,
  onSwitchToPresentationMode,
  lang,
}) => {
  const t = translations[lang];

  // Helper for UI Localization (Simplified / Traditional / English)
  const L = (tradStr: string) => {
    if (lang === "zh-CN") return toSimplifiedChinese(tradStr);
    return tradStr;
  };

  // Active Bottom Tab
  const [activeTab, setActiveTab] = useState<MobileTab>("snap");

  // Selected item index
  const [activeSnapIndex, setActiveSnapIndex] = useState<number>(0);
  const activeSnap = snapItems[activeSnapIndex] || snapItems[0];

  // Karaoke Mode & Real-Time Audio Boundary State
  const [isKaraokeMode, setIsKaraokeMode] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speakingCharIndex, setSpeakingCharIndex] = useState<number | null>(null);
  const [karaokeWordIndex, setKaraokeWordIndex] = useState<number>(-1);
  const [speechRate, setSpeechRate] = useState<number>(0.8);
  const karaokeTimerRef = useRef<any>(null);

  // AI Passage Generating state
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Shadowing Audio Practice state
  const [shadowingIndex, setShadowingIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSuccess, setRecordingSuccess] = useState<boolean>(false);
  const currentShadowingItem = SHADOWING_PRACTICE_POOL[shadowingIndex % SHADOWING_PRACTICE_POOL.length];

  // 3D Flashcard State
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCount, setMasteredCount] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  // Database Tab Segmented Switch ("articles" | "vocab")
  const [dbSubTab, setDbSubTab] = useState<"articles" | "vocab">("articles");

  // Bottom Sheet Modal State
  const [selectedWord, setSelectedWord] = useState<VocabWord | null>(null);
  const [isSavedInSheet, setIsSavedInSheet] = useState<boolean>(false);

  // Oral Simulator State
  const [oralMessages, setOralMessages] = useState<Array<{ speaker: string; text: string; role: string; avatar: string }>>([
    {
      speaker: "Examiner",
      text: "Good morning candidates. Today's HKDSE Paper 4 topic is: 'Should schools prohibit mobile phone usage completely?' Candidate A, please begin.",
      role: "Examiner",
      avatar: "👨‍🏫"
    },
    {
      speaker: "Candidate A (Alex)",
      text: "Thank you. I strongly believe prohibiting phones helps students stay focused on learning during class.",
      role: "Alex",
      avatar: "👦"
    },
    {
      speaker: "Candidate B (Brenda)",
      text: "I see your point, but mobile phones can also be used as educational tools for quick research.",
      role: "Brenda",
      avatar: "👧"
    }
  ]);
  const [userOralInput, setUserOralInput] = useState<string>("");
  const [showOralReportSheet, setShowOralReportSheet] = useState<boolean>(false);

  // All vocabulary pooled from snapItems or fallback database
  const allVocabWords: VocabWord[] = React.useMemo(() => {
    const list: VocabWord[] = [];
    snapItems.forEach((item) => {
      item.vocabulary.forEach((v) => list.push(v));
    });
    if (list.length < 10) {
      const existingWordStrings = list.map((v) => v.word);
      const extra = getRandomDSEVocab(15, existingWordStrings);
      return [...list, ...extra];
    }
    return list;
  }, [snapItems]);

  const currentFlashcard = allVocabWords[cardIndex % allVocabWords.length] || allVocabWords[0];

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (karaokeTimerRef.current) clearInterval(karaokeTimerRef.current);
    };
  }, []);

  // Handle Karaoke Audio Playback with Web Speech API Boundary Sync
  const handlePlayKaraokeAudio = (textToPlay: string) => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      setSpeakingCharIndex(null);
      setKaraokeWordIndex(-1);
      if (karaokeTimerRef.current) clearInterval(karaokeTimerRef.current);
    } else {
      setIsPlayingAudio(true);
      setSpeakingCharIndex(0);
      setKaraokeWordIndex(0);

      // Speech synthesis with onBoundary real-time callback
      speakText(
        textToPlay,
        "en-US",
        speechRate,
        () => {
          setIsPlayingAudio(false);
          setSpeakingCharIndex(null);
          setKaraokeWordIndex(-1);
          if (karaokeTimerRef.current) clearInterval(karaokeTimerRef.current);
        },
        (charIndex) => {
          setSpeakingCharIndex(charIndex);
        }
      );

      // Continuous fallback timer for smooth highlighting
      if (karaokeTimerRef.current) clearInterval(karaokeTimerRef.current);
      const words = textToPlay.trim().split(/\s+/);
      let curr = 0;
      const intervalMs = Math.max(250, Math.floor(60000 / (130 * speechRate)));
      karaokeTimerRef.current = setInterval(() => {
        curr++;
        if (curr >= words.length) {
          clearInterval(karaokeTimerRef.current);
        } else {
          setKaraokeWordIndex(curr);
        }
      }, intervalMs);
    }
  };

  // Render Karaoke Real-Time Word Highlighting (Syncs with speakingCharIndex and fallback index)
  const renderKaraokeContent = (fullText: string) => {
    if (!fullText) return null;

    const regex = /(\s+|[^\s]+)/g;
    let match: RegExpExecArray | null;
    const tokens: Array<{ text: string; start: number; end: number; isWord: boolean }> = [];
    while ((match = regex.exec(fullText)) !== null) {
      tokens.push({
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
        isWord: /\S/.test(match[0]),
      });
    }

    let wordCounter = 0;
    return tokens.map((token, idx) => {
      if (!token.isWord) {
        return <span key={idx}>{token.text}</span>;
      }

      const currentWordIdx = wordCounter;
      wordCounter++;

      const isSpeakingByChar =
        speakingCharIndex !== null &&
        speakingCharIndex >= token.start &&
        speakingCharIndex < token.end;

      const isSpeakingByFallback =
        speakingCharIndex === null && isPlayingAudio && karaokeWordIndex === currentWordIdx;

      const isCurrentSpeaking = isKaraokeMode && (isSpeakingByChar || isSpeakingByFallback);

      return (
        <span
          key={idx}
          className={`inline-block px-1 py-0.5 rounded transition-all duration-100 ${
            isCurrentSpeaking
              ? "bg-[#00FF88] text-black font-black scale-110 shadow-[0_0_14px_#00FF88] ring-2 ring-[#00FF88]"
              : "text-white opacity-90"
          }`}
        >
          {token.text}
        </span>
      );
    });
  };

  // Reset shadowing evaluation state when switching sentence/passage
  const handleNextShadowing = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    setSpeakingCharIndex(null);
    setIsRecording(false);
    setRecordingSuccess(false);
    setShadowingIndex((prev) => prev + 1);
  };

  // AI Generate Article
  const handleGenerateAIEssay = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      const topicObj = DSE_AI_TOPICS[Math.floor(Math.random() * DSE_AI_TOPICS.length)];
      const extractedVocab = getRandomDSEVocab(3, []);

      const newSnap: SnapItem = {
        id: `ai-mobile-snap-${Date.now()}`,
        timestamp: Date.now(),
        title: topicObj.title,
        subjectCategory: "DSE English Paper 1 & 2 AI Generator",
        ocrText: topicObj.text,
        hkdseContext: "考評局 Level 5* 高頻真題模擬句",
        translation: topicObj.translation,
        vocabulary: extractedVocab,
        grammarNotes: ["Subject + Verb + Object Clause", "Complex Noun Phrase Structure"],
        speechScript: topicObj.text,
        knowledgeTags: topicObj.tags,
        suggestedQuestions: ["How to use this in DSE Paper 2?"],
        chatHistory: []
      };

      onAddSnapItem(newSnap);
      setActiveSnapIndex(0);
      setIsGeneratingAI(false);
      speakText("AI DSE Article generated successfully!", "en-US", 1.0);
    }, 1200);
  };

  // Draw Random Vocab into current SnapItem
  const handleDrawRandomVocabToSnap = () => {
    if (!activeSnap) return;
    const drawn = getRandomDSEVocab(2, activeSnap.vocabulary.map(v => v.word));
    const updatedVocab = [...drawn, ...activeSnap.vocabulary];
    const updatedSnap = { ...activeSnap, vocabulary: updatedVocab };
    if (onUpdateSnapItem) {
      onUpdateSnapItem(updatedSnap);
    }
    drawn.forEach((w) => {
      if (onAddVocabToActiveItem) onAddVocabToActiveItem(w);
    });
    speakText(`Added 2 DSE words: ${drawn.map(d=>d.word).join(', ')}`, "en-US", 1.0);
  };

  // Switch Flashcard
  const handleNextFlashcard = (direction: "next" | "prev" | "random") => {
    setIsFlipped(false);
    setTimeout(() => {
      if (direction === "next") {
        setCardIndex((prev) => (prev + 1) % allVocabWords.length);
      } else if (direction === "prev") {
        setCardIndex((prev) => (prev - 1 + allVocabWords.length) % allVocabWords.length);
      } else {
        setCardIndex(Math.floor(Math.random() * allVocabWords.length));
      }
    }, 100);
  };

  // Add message in Oral Simulator
  const handleSendOralMessage = (textToSend?: string) => {
    const content = textToSend || userOralInput;
    if (!content.trim()) return;

    const userMsg = {
      speaker: "You (Candidate D)",
      text: content,
      role: "User",
      avatar: "🙋‍♂️"
    };

    setOralMessages((prev) => [...prev, userMsg]);
    setUserOralInput("");

    setTimeout(() => {
      const aiResponse = {
        speaker: "Candidate C (Chris)",
        text: "That is a valid point! To substantiate your statement, we could implement designated smartphone lockers during school hours.",
        role: "Chris",
        avatar: "🧑‍💻"
      };
      setOralMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between pb-24 selection:bg-[#00FF88] selection:text-black">
      {/* Top Banner: Mode Indicator & Quick Switch Switcher */}
      <div className="sticky top-0 z-40 bg-black/95 border-b border-purple-500/30 backdrop-blur-xl px-4 py-2.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-ping" />
          <div className="flex items-center gap-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5 text-yellow-300" />
            <span>{L("手機極簡模式")}</span>
          </div>
        </div>

        <button
          onClick={onSwitchToPresentationMode}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider border border-white/20 transition-all active:scale-95"
          title={L("切換回電腦簡報模式")}
        >
          <Monitor className="w-3.5 h-3.5 text-blue-400" />
          <span>{L("切換簡報模式 🖥️")}</span>
        </button>
      </div>

      {/* Main Screen Content Area */}
      <div className="p-4 max-w-md mx-auto w-full space-y-4">
        
        {/* ==================== TAB 1: 📷 即影即學 (SNAP & READ WITH KARAOKE & AI) ==================== */}
        {activeTab === "snap" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Quick Action Control Bar: AI Generate + Random Vocab */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleGenerateAIEssay}
                disabled={isGeneratingAI}
                className="py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-all border border-purple-400/30 disabled:opacity-50"
              >
                <Wand2 className={`w-4 h-4 text-yellow-300 ${isGeneratingAI ? "animate-spin" : ""}`} />
                <span>{isGeneratingAI ? L("AI 生成文章中...") : L("✨ AI 生成 DSE 範文")}</span>
              </button>

              <button
                onClick={handleDrawRandomVocabToSnap}
                className="py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Shuffle className="w-4 h-4 text-[#00FF88]" />
                <span>{L("🔀 獲取隨機生詞")}</span>
              </button>
            </div>

            {/* Giant One-Tap Camera Trigger Button */}
            <div className="bg-gradient-to-br from-black via-[#0a0a0a] to-emerald-950/40 border-2 border-[#00FF88]/40 rounded-3xl p-5 text-center shadow-[0_0_30px_rgba(0,255,136,0.15)] relative overflow-hidden">
              <div className="absolute top-2 right-3 text-[10px] font-black uppercase tracking-widest text-[#00FF88] bg-[#00FF88]/10 border border-[#00FF88]/30 px-2 py-0.5 rounded-full">
                Gemini OCR
              </div>

              <div
                onClick={handleGenerateAIEssay}
                className="w-16 h-16 rounded-2xl bg-[#00FF88] text-black mx-auto flex items-center justify-center shadow-lg shadow-[#00FF88]/30 mb-3 active:scale-90 transition-transform cursor-pointer"
              >
                <Camera className="w-9 h-9" />
              </div>

              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                {L("拍下課本 / 試卷一鍵解析")}
              </h2>
              <p className="text-xs text-white/60 mt-1 mb-4">
                {L("大圖示單手操作 • 自動萃取 DSE 5** 考題生詞")}
              </p>

              <button
                onClick={handleGenerateAIEssay}
                className="w-full py-3.5 bg-[#00FF88] text-black font-black text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#00FF88]/20 active:scale-95 transition-all"
              >
                <Camera className="w-5 h-5" />
                <span>{L("一鍵拍攝 / 選擇相片或 AI 生成")}</span>
              </button>
            </div>

            {/* Active Snap Document Card with Karaoke Highlighting */}
            {activeSnap && (
              <div className="bg-[#0c0c0c] border border-white/15 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#00FF88]" />
                    <span className="font-black text-sm text-white truncate max-w-[180px]">
                      {activeSnap.title}
                    </span>
                  </div>
                  <span className="text-[10px] bg-white/10 text-white/70 px-2.5 py-1 rounded-full font-mono font-bold">
                    {activeSnap.vocabulary.length} {L("個生詞")}
                  </span>
                </div>

                {/* Karaoke Interactive Text Display */}
                <div className="bg-black/80 rounded-2xl p-4 border border-white/15 space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="text-[10px] font-mono text-[#00FF88] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Music className="w-3.5 h-3.5" />
                      <span>{L("Karaoke Mode (卡拉OK節奏高亮)")}</span>
                    </span>
                    <button
                      onClick={() => setIsKaraokeMode(!isKaraokeMode)}
                      className={`text-[10px] px-2 py-0.5 rounded font-black uppercase transition-all ${
                        isKaraokeMode
                          ? "bg-[#00FF88] text-black"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {isKaraokeMode ? L("🎤 卡拉OK ON") : "OFF"}
                    </button>
                  </div>

                  {/* Render Words with Live Karaoke Real-Time Highlighting */}
                  <p className="text-sm leading-relaxed font-sans text-white/90">
                    {renderKaraokeContent(activeSnap.ocrText)}
                  </p>
                </div>

                {/* Chinese Translation */}
                {activeSnap.translation && (
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-xs text-white/70">
                    <span className="text-[10px] text-white/40 font-bold block mb-0.5">{L("中文釋義:")}</span>
                    <p>{L(activeSnap.translation)}</p>
                  </div>
                )}

                {/* 0.8x Audio Karaoke Player Bar */}
                <div className="bg-emerald-950/30 border border-[#00FF88]/30 rounded-2xl p-3 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handlePlayKaraokeAudio(activeSnap.ocrText)}
                    className="w-12 h-12 rounded-xl bg-[#00FF88] text-black flex items-center justify-center shrink-0 shadow-md active:scale-90 transition-transform"
                  >
                    {isPlayingAudio ? (
                      <Square className="w-5 h-5 fill-black" />
                    ) : (
                      <Play className="w-6 h-6 fill-black ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1">
                    <p className="text-xs font-black text-[#00FF88]">
                      {isPlayingAudio ? L("🎤 慢速卡拉OK朗讀中...") : L("🎧 0.8x 慢速跟讀朗讀")}
                    </p>
                    <p className="text-[10px] text-white/50">{L("即時字詞對齊與音標跟讀")}</p>
                  </div>

                  <button
                    onClick={() => setSpeechRate(speechRate === 0.8 ? 1.0 : 0.8)}
                    className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-wider border border-white/20"
                  >
                    {speechRate}x
                  </button>
                </div>

                {/* Extracted Words Chips (Click for Bottom Sheet) */}
                <div>
                  <p className="text-xs font-black text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" />
                    <span>{L("提取生詞 (點擊彈出簡介):")}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeSnap.vocabulary.map((vocab) => (
                      <button
                        key={vocab.id || vocab.word}
                        onClick={() => {
                          setSelectedWord(vocab);
                          setIsSavedInSheet(false);
                        }}
                        className="px-3 py-2 bg-white/10 hover:bg-[#00FF88] hover:text-black border border-white/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <span className="font-black">{vocab.word}</span>
                        <span className="text-[10px] opacity-70">[{vocab.ipa}]</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: 🗣️ 語音跟讀 (SHADOWING & RANDOM SENTENCES) ==================== */}
        {activeTab === "audio" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-[#0c0c0c] border border-white/15 rounded-3xl p-5 space-y-4 shadow-xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 mx-auto flex items-center justify-center">
                <Volume2 className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-lg font-black text-white">{L("0.8x 影子跟讀與重音診斷")}</h2>
                <p className="text-xs text-white/50 mt-1">
                  {L("跟隨英音考官語速朗讀，AI 即時提供音標對齊與重音移位警告")}
                </p>
              </div>

              {/* Random Switcher Control Bar */}
              <div className="flex items-center justify-between bg-black/60 p-2 rounded-2xl border border-white/10 text-xs">
                <span className="font-bold text-blue-400 font-mono">
                  {L(currentShadowingItem.title)}
                </span>

                <button
                  onClick={handleNextShadowing}
                  className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 active:scale-95"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>{L("🎲 隨機換一句 / 短文")}</span>
                </button>
              </div>

              {/* Active Target Sentence or Passage */}
              <div className="bg-black/80 rounded-2xl p-4 border border-blue-500/30 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
                    Target {currentShadowingItem.type === "passage" ? L("Passage 考題短文") : L("Sentence 考點句")}
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded font-black">
                    {currentShadowingItem.level}
                  </span>
                </div>

                <p className="text-base font-bold text-white leading-relaxed">
                  "{currentShadowingItem.text}"
                </p>
                <p className="text-xs text-white/60 font-mono">
                  [ IPA: {currentShadowingItem.ipa} ]
                </p>
              </div>

              {/* Giant Play & Mic Recording Controls */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handlePlayKaraokeAudio(currentShadowingItem.text)}
                  className="py-3.5 bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>{isPlayingAudio ? L("停止朗讀") : L("播放 0.8x 原聲")}</span>
                </button>

                <button
                  onClick={() => {
                    setIsRecording(true);
                    setRecordingSuccess(false);
                    setTimeout(() => {
                      setIsRecording(false);
                      setRecordingSuccess(true);
                    }, 2500);
                  }}
                  className={`py-3.5 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isRecording
                      ? "bg-red-500 text-white animate-pulse"
                      : recordingSuccess
                      ? "bg-[#00FF88] text-black shadow-lg shadow-[#00FF88]/20"
                      : "bg-white/10 text-white border border-white/20"
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span>{isRecording ? L("錄音評測中...") : recordingSuccess ? L("✓ 完成評測") : L("按住跟讀錄音")}</span>
                </button>
              </div>

              {/* Speech Rating Feedback Banner */}
              {recordingSuccess && (
                <div className="bg-emerald-950/40 border border-[#00FF88]/40 rounded-2xl p-4 text-left space-y-2 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#00FF88] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
                      <span>{L("發音精準度: 94% (DSE Level 5*)")}</span>
                    </span>
                    <span className="text-[10px] bg-[#00FF88]/20 text-[#00FF88] px-2 py-0.5 rounded font-black">
                      PASSED
                    </span>
                  </div>
                  <p className="text-xs text-white/80">
                    💡 {L("考官建議：核心詞")} <span className="font-mono text-[#00FF88]">{currentShadowingItem.targetWord}</span> {L("發音清晰，節奏感優良！")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: 💬 4人 AI 口試 (ORAL SIMULATOR) ==================== */}
        {activeTab === "oral" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-[#0c0c0c] border border-white/15 rounded-3xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="font-black text-sm text-white">{L("DSE Paper 4 AI 口試")}</h3>
                    <p className="text-[10px] text-white/50">4-Player Oral Group Discussion</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowOralReportSheet(true)}
                  className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{L("5** 評分報告")}</span>
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {oralMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${
                      msg.role === "User" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm shrink-0">
                      {msg.avatar}
                    </div>

                    <div
                      className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                        msg.role === "User"
                          ? "bg-[#00FF88] text-black font-medium"
                          : msg.role === "Examiner"
                          ? "bg-purple-950/60 text-purple-200 border border-purple-500/30"
                          : "bg-white/10 text-white border border-white/10"
                      }`}
                    >
                      <p className="font-black text-[10px] opacity-70 mb-0.5">
                        {msg.speaker}
                      </p>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* One-Tap High-Scoring Response Chips */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-wider">
                  💡 {L("一鍵帶入 DSE 5** 轉承語 (Signposting):")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "To add on to that...",
                    "I agree with Candidate A...",
                    "To substantiate this statement..."
                  ].map((phrase, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSendOralMessage(phrase)}
                      className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-[10px] font-bold active:scale-95"
                    >
                      + "{phrase}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Input Box */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={userOralInput}
                  onChange={(e) => setUserOralInput(e.target.value)}
                  placeholder={L("輸入口試發言或點擊上方快選語...")}
                  className="flex-1 bg-black/80 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#00FF88]"
                  onKeyDown={(e) => e.key === "Enter" && handleSendOralMessage()}
                />
                <button
                  onClick={() => handleSendOralMessage()}
                  className="px-4 py-2.5 bg-[#00FF88] text-black font-black text-xs rounded-xl shadow-md active:scale-95 shrink-0"
                >
                  {L("發送")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: 🃏 3D 雙面閃卡 (3D FLASHCARDS WITH NAVIGATION) ==================== */}
        {activeTab === "flashcards" && (
          <div className="space-y-4 animate-in fade-in duration-200 text-center">
            {/* Header Counters */}
            <div className="flex items-center justify-between bg-[#0c0c0c] border border-white/10 rounded-2xl px-4 py-2 text-xs">
              <span className="font-mono font-bold text-white/60">
                {L("卡片:")} <span className="text-[#00FF88]">{cardIndex + 1}</span> / {allVocabWords.length}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-red-400 font-bold">❌ {L("重溫")} {reviewCount}</span>
                <span className="text-[#00FF88] font-bold">✅ {L("已掌握")} {masteredCount}</span>
              </div>
            </div>

            {/* Duolingo / Quizlet style 3D Flip Card */}
            {currentFlashcard && (
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full min-h-[300px] bg-gradient-to-b from-[#111] to-[#080808] border-2 border-white/20 hover:border-[#00FF88] rounded-3xl p-6 flex flex-col items-center justify-between shadow-2xl cursor-pointer transition-all relative overflow-hidden select-none active:scale-[0.99]"
              >
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span className="bg-white/10 px-2.5 py-1 rounded-full text-white font-bold">
                    {currentFlashcard.level || "DSE Level 5*"}
                  </span>
                  <span className="text-[#00FF88] font-bold flex items-center gap-1">
                    <RotateCw className="w-3 h-3" />
                    <span>{L("點擊卡片 3D 翻面")}</span>
                  </span>
                </div>

                {!isFlipped ? (
                  /* FRONT OF CARD */
                  <div className="my-auto space-y-3">
                    <h1 className="text-3xl font-black tracking-tight text-white">
                      {currentFlashcard.word}
                    </h1>
                    <p className="text-sm font-mono text-[#00FF88]">
                      [{currentFlashcard.ipa}]
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(currentFlashcard.word, "en-US", 0.8);
                      }}
                      className="mt-2 w-12 h-12 rounded-full bg-[#00FF88] text-black mx-auto flex items-center justify-center shadow-lg active:scale-90"
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  /* BACK OF CARD */
                  <div className="my-auto space-y-3 animate-in fade-in duration-150">
                    <p className="text-xl font-black text-[#00FF88]">
                      {getVocabMeaning(currentFlashcard, lang)}
                    </p>
                    <p className="text-xs text-white/60 italic max-w-xs mx-auto">
                      "{currentFlashcard.exampleSentence}"
                    </p>
                  </div>
                )}

                <div className="w-full text-center text-[10px] text-white/30 uppercase tracking-widest font-mono">
                  Duolingo Style 3D Interactive Card
                </div>
              </div>
            )}

            {/* Clear Navigation Buttons to Draw Next / Prev Cards */}
            <div className="flex items-center justify-between gap-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-2">
              <button
                onClick={() => handleNextFlashcard("prev")}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 text-white/70" />
                <span>{L("上一張")}</span>
              </button>

              <button
                onClick={() => handleNextFlashcard("random")}
                className="px-3.5 py-3 bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95"
                title={L("隨機抽取新卡片")}
              >
                <Shuffle className="w-4 h-4 text-yellow-300" />
                <span>{L("隨機")}</span>
              </button>

              <button
                onClick={() => handleNextFlashcard("next")}
                className="flex-1 py-3 bg-[#00FF88] text-black rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-[#00FF88]/20"
              >
                <span>{L("下一張")}</span>
                <ChevronRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: 📚 個人資料庫 (PERSONAL SAVED DATABASE) ==================== */}
        {activeTab === "database" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Segmented Controller: Articles vs Vocabulary */}
            <div className="grid grid-cols-2 p-1 bg-[#0c0c0c] border border-white/15 rounded-2xl text-xs font-black uppercase">
              <button
                onClick={() => setDbSubTab("articles")}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  dbSubTab === "articles"
                    ? "bg-[#00FF88] text-black shadow-md font-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{L("收藏文章")} ({snapItems.length})</span>
              </button>

              <button
                onClick={() => setDbSubTab("vocab")}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  dbSubTab === "vocab"
                    ? "bg-[#00FF88] text-black shadow-md font-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>{L("DSE 生詞庫")} ({allVocabWords.length})</span>
              </button>
            </div>

            {/* SUB-TAB 1: SAVED ARTICLES & SNAPS */}
            {dbSubTab === "articles" && (
              <div className="space-y-2.5">
                {snapItems.length === 0 ? (
                  <div className="text-center py-12 bg-black/60 border border-white/10 rounded-2xl p-6">
                    <BookOpen className="w-10 h-10 text-white/20 mx-auto mb-2" />
                    <p className="text-xs text-white/50">{L("暫無收藏文章，請在即影即學中新增")}</p>
                  </div>
                ) : (
                  snapItems.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveSnapIndex(idx);
                        setActiveTab("snap");
                      }}
                      className="bg-[#0c0c0c] border border-white/10 hover:border-[#00FF88]/50 rounded-2xl p-4 space-y-2 cursor-pointer active:scale-98 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-white truncate max-w-[200px]">
                          {item.title}
                        </span>
                        <span className="text-[10px] bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 px-2 py-0.5 rounded font-black">
                          {item.vocabulary.length} {L("生詞")}
                        </span>
                      </div>

                      <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                        {item.ocrText}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-white/40 pt-1 border-t border-white/10">
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        <span className="text-[#00FF88] font-bold flex items-center gap-1">
                          <span>{L("開啟載入跟讀")}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SUB-TAB 2: SAVED DSE VOCABULARY */}
            {dbSubTab === "vocab" && (
              <div className="space-y-2">
                {allVocabWords.map((vocab, vIdx) => (
                  <div
                    key={vIdx}
                    onClick={() => {
                      setSelectedWord(vocab);
                      setIsSavedInSheet(false);
                    }}
                    className="bg-[#0c0c0c] border border-white/10 hover:border-[#00FF88]/50 rounded-2xl p-3.5 flex items-center justify-between gap-3 cursor-pointer active:scale-98 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">{vocab.word}</span>
                        <span className="text-[10px] text-[#00FF88] font-mono">[{vocab.ipa}]</span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5 line-clamp-1">{getVocabMeaning(vocab, lang)}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(vocab.word, "en-US", 0.8);
                      }}
                      className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 active:scale-90"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ==================== MOBILE BOTTOM SHEET MODAL (SLIDES UP ON WORD SELECTION) ==================== */}
      <AnimatePresence>
        {selectedWord && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWord(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f] border-t-2 border-[#00FF88] rounded-t-3xl p-6 space-y-4 shadow-2xl max-w-md mx-auto"
            >
              {/* Bottom Sheet Handle */}
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-2" />

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#00FF88] bg-[#00FF88]/10 border border-[#00FF88]/30 px-2.5 py-0.5 rounded-full">
                    {selectedWord.level || "DSE Level 5*"}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">{selectedWord.word}</h2>
                  <p className="text-xs font-mono text-[#00FF88]">[{selectedWord.ipa}]</p>
                </div>

                <button
                  onClick={() => setSelectedWord(null)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white/70 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chinese Definition */}
              <div className="bg-black/60 rounded-2xl p-3.5 border border-white/10">
                <p className="text-xs font-black text-white/50 uppercase tracking-wider mb-1">{L("中文釋義 / Meaning:")}</p>
                <p className="text-base font-bold text-white">{getVocabMeaning(selectedWord, lang)}</p>
              </div>

              {/* DSE Example Sentence */}
              <div className="bg-emerald-950/20 rounded-2xl p-3.5 border border-[#00FF88]/30">
                <p className="text-xs font-black text-[#00FF88] uppercase tracking-wider mb-1">{L("DSE 真題實戰例句:")}</p>
                <p className="text-xs text-white/90 italic leading-relaxed">"{selectedWord.exampleSentence}"</p>
              </div>

              {/* Action Buttons inside Bottom Sheet */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => speakText(selectedWord.word, "en-US", 0.8)}
                  className="py-3 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 border border-white/20 active:scale-95"
                >
                  <Volume2 className="w-4 h-4 text-[#00FF88]" />
                  <span>🔊 {L("0.8x 朗讀")}</span>
                </button>

                <button
                  onClick={() => {
                    setIsSavedInSheet(true);
                    if (onAddVocabToActiveItem) {
                      onAddVocabToActiveItem(selectedWord);
                    }
                  }}
                  className={`py-3 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isSavedInSheet
                      ? "bg-[#00FF88] text-black shadow-lg"
                      : "bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40"
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>{isSavedInSheet ? L("✓ 已加入生詞庫") : L("收藏至生詞庫")}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Oral Report Sheet */}
      <AnimatePresence>
        {showOralReportSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOralReportSheet(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f] border-t-2 border-purple-500 rounded-t-3xl p-6 space-y-4 max-w-md mx-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-300" />
                  <h3 className="font-black text-base text-white">{L("考評局 5** 口試診斷報告")}</h3>
                </div>
                <button onClick={() => setShowOralReportSheet(false)} className="text-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <span className="text-white/40 block text-[10px]">Pronunciation</span>
                  <span className="text-lg font-black text-[#00FF88]">Level 5*</span>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <span className="text-white/40 block text-[10px]">Communication</span>
                  <span className="text-lg font-black text-yellow-300">Level 5**</span>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed bg-purple-950/40 p-3.5 rounded-2xl border border-purple-500/30">
                🎓 {L("考官評語：學生展現出極強的 Signposting (轉承語) 技巧。多使用高階詞彙如 substantiate，適應良好！")}
              </p>

              <button
                onClick={() => setShowOralReportSheet(false)}
                className="w-full py-3 bg-purple-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl"
              >
                {L("關閉報告")}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==================== BOTTOM STICKY MOBILE NAVIGATION BAR ==================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t border-white/15 backdrop-blur-2xl px-2 py-2 flex items-center justify-around shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
        <button
          onClick={() => setActiveTab("snap")}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all active:scale-90 ${
            activeTab === "snap"
              ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.4)] font-black"
              : "text-white/60 hover:text-white"
          }`}
        >
          <Camera className="w-6 h-6 mb-0.5" />
          <span>{L("即影即學")}</span>
        </button>

        <button
          onClick={() => setActiveTab("audio")}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all active:scale-90 ${
            activeTab === "audio"
              ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.4)] font-black"
              : "text-white/60 hover:text-white"
          }`}
        >
          <Volume2 className="w-6 h-6 mb-0.5" />
          <span>{L("語音跟讀")}</span>
        </button>

        <button
          onClick={() => setActiveTab("oral")}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all active:scale-90 ${
            activeTab === "oral"
              ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.4)] font-black"
              : "text-white/60 hover:text-white"
          }`}
        >
          <Users className="w-6 h-6 mb-0.5" />
          <span>{L("4人口試")}</span>
        </button>

        <button
          onClick={() => setActiveTab("flashcards")}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all active:scale-90 ${
            activeTab === "flashcards"
              ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.4)] font-black"
              : "text-white/60 hover:text-white"
          }`}
        >
          <Sparkles className="w-6 h-6 mb-0.5" />
          <span>{L("3D閃卡")}</span>
        </button>

        <button
          onClick={() => setActiveTab("database")}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all active:scale-90 ${
            activeTab === "database"
              ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.4)] font-black"
              : "text-white/60 hover:text-white"
          }`}
        >
          <FolderHeart className="w-6 h-6 mb-0.5" />
          <span>{L("個人庫")}</span>
        </button>
      </nav>
    </div>
  );
};
