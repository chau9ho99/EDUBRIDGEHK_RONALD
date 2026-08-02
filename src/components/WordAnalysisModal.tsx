import React, { useState } from "react";
import { VocabWord } from "../types";
import { Language, getVocabMeaning } from "../utils/i18n";
import { speakText } from "../utils/speechUtils";
import {
  Volume2,
  X,
  Sparkles,
  CheckCircle2,
  Bookmark,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  Lightbulb
} from "lucide-react";

interface WordAnalysisModalProps {
  vocab: VocabWord | null;
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  isMastered?: boolean;
  isBookmarked?: boolean;
  onToggleMaster?: () => void;
  onToggleBookmark?: () => void;
}

export const WordAnalysisModal: React.FC<WordAnalysisModalProps> = ({
  vocab,
  isOpen,
  onClose,
  lang = "zh-CN",
  isMastered = false,
  isBookmarked = false,
  onToggleMaster,
  onToggleBookmark,
}) => {
  if (!isOpen || !vocab) return null;

  const meaningText = getVocabMeaning(vocab, lang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f0f13] border-2 border-[#00FF88]/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-[0_0_50px_rgba(0,255,136,0.2)] text-white relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#00FF88]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#00FF88]/20 border border-[#00FF88]/40 text-[#00FF88] text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" />
            DSE AI 詞彙全方位拆解
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px] font-mono font-bold uppercase">
            {vocab.level || "DSE Level 5*"}
          </span>
        </div>

        {/* Main Word Title & Audio */}
        <div className="bg-black/60 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white uppercase">
              {vocab.word}
            </h2>
            <p className="text-sm font-mono text-[#00FF88] mt-0.5">
              [{vocab.ipa}]
            </p>
          </div>

          <button
            onClick={() => speakText(vocab.word, "en-US", 0.85)}
            className="p-3.5 bg-[#00FF88] text-black hover:scale-105 active:scale-95 rounded-2xl transition-all shadow-lg flex items-center justify-center shrink-0"
            title="朗讀標準發音"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Meanings */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-white/50 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-[#00FF88]" />
            中文釋義 & 英文詳解
          </h3>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <p className="text-xl font-black text-[#00FF88]">{meaningText}</p>
            {vocab.meanEn && (
              <p className="text-xs text-white/70 italic leading-relaxed">
                {vocab.meanEn}
              </p>
            )}
          </div>
        </div>

        {/* DSE Example Sentence */}
        {vocab.exampleSentence && (
          <div className="space-y-2">
            <h3 className="text-xs font-black text-white/50 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-yellow-300" />
              DSE 實戰真題考點例句
            </h3>
            <div className="bg-black/80 border border-yellow-500/30 rounded-2xl p-4 text-xs text-white/90 font-sans leading-relaxed">
              "{vocab.exampleSentence}"
            </div>
          </div>
        )}

        {/* Collocations & Exam Tips */}
        <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-2xl p-4 text-xs space-y-1">
          <span className="font-black text-purple-300 text-[11px] flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-300" />
            DSE 寫作 & 閱讀得分要訣：
          </span>
          <p className="text-white/80 leading-relaxed">
            此詞屬於 DSE 高分替換詞 (High-yield Synonym)。在 Paper 2 寫文中替代平庸詞彙，可大幅提升 Lexical Resource (詞彙豐富度) 評分標準。
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          {onToggleMaster && (
            <button
              onClick={onToggleMaster}
              className={`flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                isMastered
                  ? "bg-[#00FF88] text-black border-[#00FF88]"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isMastered ? "已掌握 (Mastered)" : "標記為已掌握"}</span>
            </button>
          )}

          {onToggleBookmark && (
            <button
              onClick={onToggleBookmark}
              className={`py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-2 active:scale-95 ${
                isBookmarked
                  ? "bg-yellow-400 text-black border-yellow-300 shadow-md"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isBookmarked ? "已重點標記" : "標記重點"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
