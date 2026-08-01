import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  Globe,
  Sparkles,
  X,
  Plus,
  Check,
  BookOpen,
  VolumeX,
  Zap,
  CheckCircle2,
  Copy,
  Languages
} from "lucide-react";
import { speakText, stopSpeech } from "../utils/speechUtils";
import { Language } from "../utils/i18n";
import { VocabWord } from "../types";

interface HighlightReaderPopoverProps {
  lang?: Language;
  onAddVocabToActiveItem?: (vocab: VocabWord) => void;
}

export const HighlightReaderPopover: React.FC<HighlightReaderPopoverProps> = ({
  lang = "zh-CN",
  onAddVocabToActiveItem,
}) => {
  const [selectedText, setSelectedText] = useState<string>("");
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.8); // Default 0.8x pure native slow speed
  const [speechAccent, setSpeechAccent] = useState<"en-US" | "en-GB">("en-US");
  
  // Translation & Analysis State
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translatedResult, setTranslatedResult] = useState<string | null>(null);
  const [wordDetails, setWordDetails] = useState<VocabWord | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle document text selection
  useEffect(() => {
    let timeoutId: any = null;

    const checkSelection = () => {
      // 1. Check window selection
      const selection = window.getSelection();
      let text = "";
      let rect: DOMRect | null = null;

      if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
        text = selection.toString().trim();
        if (text && text.length <= 1500) {
          try {
            const range = selection.getRangeAt(0);
            const clientRects = range.getClientRects();
            if (clientRects.length > 0) {
              rect = clientRects[0];
            } else {
              rect = range.getBoundingClientRect();
            }
          } catch (e) {
            // Range error
          }
        }
      }

      // 2. Check form input / textarea selection if window selection is empty
      if (!text) {
        const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
        if (activeEl && (activeEl.tagName === "TEXTAREA" || activeEl.tagName === "INPUT")) {
          const start = activeEl.selectionStart;
          const end = activeEl.selectionEnd;
          if (start !== null && end !== null && start !== end) {
            const fullVal = activeEl.value || "";
            text = fullVal.substring(start, end).trim();
            if (text && text.length <= 1500) {
              rect = activeEl.getBoundingClientRect();
            }
          }
        }
      }

      if (text && rect && rect.width >= 0 && rect.height >= 0) {
        const popoverWidth = Math.min(380, window.innerWidth - 32);
        const centerLeft = rect.left + rect.width / 2;
        const clampLeft = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, centerLeft - popoverWidth / 2));

        // Determine if popover should float above or below selection
        const placeAbove = rect.top > 220;
        const topPos = placeAbove ? rect.top - 10 : rect.bottom + 10;

        setSelectedText(text);
        setPosition({
          top: topPos,
          left: clampLeft,
          isAbove: placeAbove,
        });
      }
    };

    let isMouseDown = false;

    const handleMouseDown = (e: MouseEvent) => {
      if (popoverRef.current && popoverRef.current.contains(e.target as Node)) {
        return;
      }
      isMouseDown = true;
    };

    const handleMouseUp = (e: Event) => {
      isMouseDown = false;
      const targetNode = e.target as Node;
      if (popoverRef.current && popoverRef.current.contains(targetNode)) {
        return;
      }
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(checkSelection, 100);
    };

    const handleSelectionChange = () => {
      // Do NOT open selection popover while mouse button is held down (dragging selection)
      if (isMouseDown) return;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
        const isInputSelected = activeEl && (activeEl.tagName === "TEXTAREA" || activeEl.tagName === "INPUT") && activeEl.selectionStart !== activeEl.selectionEnd;
        if (!isInputSelected) {
          setSelectedText("");
          setPosition(null);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (popoverRef.current && popoverRef.current.contains(e.target as Node)) {
        return;
      }
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(checkSelection, 100);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  // Dismiss popover
  const handleClose = () => {
    setSelectedText("");
    setPosition(null);
    setTranslatedResult(null);
    setWordDetails(null);
    stopSpeech();
    setIsPlaying(false);
  };

  // Play audio for selected text ONLY
  const handlePlaySelection = () => {
    if (!selectedText) return;
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    speakText(
      selectedText,
      speechAccent,
      speechRate,
      () => setIsPlaying(false)
    );
  };

  // AI Translation call
  const handleTranslateSelection = async () => {
    if (!selectedText) return;
    setIsTranslating(true);
    setTranslatedResult(null);

    const targetLangCode = lang === "zh-HK" ? "zh-HK" : lang === "zh-CN" ? "zh-CN" : "en";

    try {
      const res = await fetch("/api/translate-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText,
          targetLang: targetLangCode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTranslatedResult(data.translation || selectedText);

        if (data.wordAnalysis && data.wordAnalysis.word) {
          const detail: VocabWord = {
            id: `sel-vocab-${Date.now()}`,
            word: data.wordAnalysis.word || selectedText,
            ipa: data.wordAnalysis.ipa || "/.../",
            level: data.wordAnalysis.level || "DSE Level 5",
            meanZh: data.wordAnalysis.meanZh || data.translation,
            meanCn: data.wordAnalysis.meanCn || (lang === "zh-CN" ? data.translation : undefined),
            meanEn: data.wordAnalysis.meanEn || selectedText,
            exampleSentence: data.wordAnalysis.exampleSentence || "",
            masteryLevel: "new"
          };
          setWordDetails(detail);
        }
      } else {
        setTranslatedResult("翻譯服務暫停，請稍後再試。");
      }
    } catch (err) {
      setTranslatedResult("翻譯連線超時，請重試。");
    } finally {
      setIsTranslating(false);
    }
  };

  // Save word details to active vocab list
  const handleSaveToVocabBank = () => {
    if (!selectedText) return;
    const vocabToAdd: VocabWord = wordDetails || {
      id: `highlight-${Date.now()}`,
      word: selectedText.trim(),
      ipa: "/.../",
      level: "DSE Level 5",
      meanZh: translatedResult || "Highlight 劃選自訂生詞",
      meanEn: selectedText,
      exampleSentence: `Selected from text: "${selectedText}"`,
      masteryLevel: "new"
    };

    if (onAddVocabToActiveItem) {
      onAddVocabToActiveItem(vocabToAdd);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  // Copy selection
  const handleCopyText = () => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!selectedText || !position) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={popoverRef}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: (position as any).isAbove ? "translateY(-100%)" : "translateY(0)",
          zIndex: 99999,
        }}
        className="w-80 sm:w-96 bg-[#0c0c0e]/95 backdrop-blur-xl border-2 border-[#00FF88]/60 rounded-2xl shadow-[0_15px_40px_rgba(0,255,136,0.3)] p-4 text-white space-y-3 font-sans select-none"
      >
        {/* Top Bar Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#00FF88]">
            <Sparkles className="w-4 h-4 text-[#00FF88] animate-pulse" />
            <span>AI Highlight 劃選局部朗讀 & 翻譯</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyText}
              className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition-all text-xs"
              title="複製選中文字"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-full text-white/60 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Text Preview Box */}
        <div className="bg-black/80 border border-white/10 rounded-xl p-2.5 max-h-24 overflow-y-auto font-mono text-xs text-white/90 leading-relaxed break-words">
          "{selectedText}"
        </div>

        {/* Primary Action Toolbar */}
        <div className="grid grid-cols-2 gap-2">
          {/* 🔊 Play Audio Button */}
          <button
            onClick={handlePlaySelection}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
              isPlaying
                ? "bg-white text-black animate-pulse"
                : "bg-[#00FF88] text-black hover:bg-[#00e67a]"
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4" /> 停止朗讀
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" /> 🔊 局部朗讀
              </>
            )}
          </button>

          {/* 🌐 AI Translate Button */}
          <button
            onClick={handleTranslateSelection}
            disabled={isTranslating}
            className="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isTranslating ? (
              <Zap className="w-4 h-4 animate-spin text-yellow-300" />
            ) : (
              <Globe className="w-4 h-4 text-purple-200" />
            )}
            <span>🌐 AI 即時翻譯</span>
          </button>
        </div>

        {/* Speed & Accent Controls */}
        <div className="flex items-center justify-between text-[10px] font-bold text-white/60 bg-white/5 p-2 rounded-xl border border-white/10">
          <span className="uppercase tracking-wider">語速:</span>
          <div className="flex items-center gap-1">
            {[0.8, 1.0, 1.2].map((rate) => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`px-2 py-0.5 rounded font-black transition-all ${
                  speechRate === rate
                    ? "bg-[#00FF88] text-black shadow"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {rate === 0.8 ? "0.8x 慢速" : `${rate}x`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            <button
              onClick={() => setSpeechAccent("en-US")}
              className={`px-2 py-0.5 rounded font-black transition-all ${
                speechAccent === "en-US"
                  ? "bg-purple-600 text-white shadow"
                  : "bg-white/10 text-white/70"
              }`}
            >
              美音 US
            </button>
            <button
              onClick={() => setSpeechAccent("en-GB")}
              className={`px-2 py-0.5 rounded font-black transition-all ${
                speechAccent === "en-GB"
                  ? "bg-purple-600 text-white shadow"
                  : "bg-white/10 text-white/70"
              }`}
            >
              英音 UK
            </button>
          </div>
        </div>

        {/* Translation Output Box */}
        {translatedResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-purple-950/60 border border-purple-500/40 rounded-xl p-3 text-xs space-y-2 shadow-inner"
          >
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-purple-300">
              <span className="flex items-center gap-1">
                <Languages className="w-3.5 h-3.5" /> AI 翻譯結果 ({lang === "zh-HK" ? "繁體中文" : lang === "zh-CN" ? "簡體中文" : "English"})
              </span>
            </div>

            <p className="text-white font-medium leading-relaxed font-sans text-sm">
              {translatedResult}
            </p>

            {wordDetails && (
              <div className="pt-2 border-t border-purple-500/30 text-[11px] space-y-1 text-purple-200">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-yellow-300 font-bold">{wordDetails.ipa}</span>
                  <span className="px-1.5 py-0.5 bg-yellow-400/20 text-yellow-300 rounded text-[9px] font-black">
                    {wordDetails.level}
                  </span>
                </div>
                {wordDetails.exampleSentence && (
                  <p className="italic text-white/80 text-[10px] leading-tight">
                    例句: "{wordDetails.exampleSentence}"
                  </p>
                )}
              </div>
            )}

            {/* Save to Vocab Bank Button */}
            <button
              onClick={handleSaveToVocabBank}
              className={`w-full py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow ${
                isSaved
                  ? "bg-[#00FF88] text-black"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" /> 已加入 DSE 生詞庫！
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-[#00FF88]" /> ➕ 存入生詞庫
                </>
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
