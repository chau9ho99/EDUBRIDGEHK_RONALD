import React, { useState } from "react";
import {
  X,
  Sparkles,
  Camera,
  Mic,
  Award,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Shuffle,
  Maximize2
} from "lucide-react";
import { Language } from "../utils/i18n";

// Image URLs served statically via /assets/IMG/
const img65b2 = "/assets/IMG/imagine-65b2e111-231c-4923-978e-e1506b38e734.jpg";
const img4247 = "/assets/IMG/imagine-4247f796-eb04-476c-b262-98de68381c8f.jpg";
const img5849 = "/assets/IMG/imagine-58492dfb-ec10-482c-bf47-73157584108c.jpg";
const imgBdc8 = "/assets/IMG/imagine-bdc848de-0af8-4ddc-ba88-f3db6b2c366a.jpg";
const imgC980 = "/assets/IMG/imagine-c9807f1d-bcb1-40f9-8999-359f1b3ae77f.jpg";
const imgDdb6 = "/assets/IMG/imagine-ddb60b1f-7535-4e0c-9136-9a8bde3ace43.jpg";
const imgE67f = "/assets/IMG/imagine-e67feb7e-0cca-41fb-a2fd-031b7083457d.jpg";

interface PromoShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onNavigateToFeature?: (feature: "snap" | "oral" | "knowledge" | "discussion") => void;
}

export const PromoShowcaseModal: React.FC<PromoShowcaseModalProps> = ({
  isOpen,
  onClose,
  lang,
  onNavigateToFeature,
}) => {
  const [activePosterIndex, setActivePosterIndex] = useState(0);
  const [zoomPosterUrl, setZoomPosterUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const isZh = lang !== "en";

  // Poster Data representing the 7 uploaded marketing promotional designs
  const promoPosters = [
    {
      id: "poster-1",
      imgUrl: img65b2,
      tag: "🔥 小紅書熱推 • 品牌核心",
      headline: "從不適應，到 DSE 奪星",
      subheadline: "你的 AI 英語私人導師 • 新來港中學生專屬",
      themeColor: "#00FF88",
      gradient: "from-[#00FF88]/20 via-emerald-950/60 to-black",
      borderColor: "border-[#00FF88]/50",
      glowColor: "shadow-[0_0_50px_rgba(0,255,136,0.25)]",
      icon: Award,
      badgeText: "HKDSE 5** 升學 AI 伴練",
      featureRoute: "snap" as const,
      highlights: [
        "即影即學 (Snap & Learn)：拍下英文課本/試卷一鍵 OCR 萃取",
        "AI 跟讀跟練與發音診斷：0.8x 慢速聽力對齊與音標糾錯",
        "DSE 4人 AI 小組口試：模擬考評局 3 位 AI 考生實時對答",
        "DSE 高頻詞彙與個人知識庫：自動整理筆記與間隔重複記憶"
      ]
    },
    {
      id: "poster-2",
      imgUrl: img4247,
      tag: "📸 核心功能 • 拍照即學",
      headline: "Snap & Learn 隨手拍，即時釋義與分析",
      subheadline: "新來港中學生專屬 AI 英語私人導師",
      themeColor: "#3B82F6",
      gradient: "from-blue-600/20 via-indigo-950/60 to-black",
      borderColor: "border-blue-500/50",
      glowColor: "shadow-[0_0_50px_rgba(59,130,246,0.25)]",
      icon: Camera,
      badgeText: "手機鏡頭即拍 / 上傳照片 / 貼上段落",
      featureRoute: "snap" as const,
      highlights: [
        "隨手拍 ➔ 即時 OCR 釋義：精準識別英文課本與考題",
        "AI 翻譯 + 0.8x 慢速朗讀：專為 EMI 全英文授課銜接設計",
        "詳細錯誤分析：標註句型結構與 DSE Level 5* 高頻生詞",
        "AI HIGHLIGHT 創選局部朗讀與即時翻譯"
      ]
    },
    {
      id: "poster-3",
      imgUrl: imgC980,
      tag: "🎙️ 口語突破 • 告別尷尬",
      headline: "AI 口語發音與流暢度評估",
      subheadline: "不怕開口尷尬，即時修正發音與 IPA 音標反饋",
      themeColor: "#A855F7",
      gradient: "from-purple-600/20 via-fuchsia-950/60 to-black",
      borderColor: "border-purple-500/50",
      glowColor: "shadow-[0_0_50px_rgba(168,85,247,0.25)]",
      icon: Mic,
      badgeText: "AI 精準診斷 • 不怕開口尷尬",
      featureRoute: "oral" as const,
      highlights: [
        "DSE 口語發音總分診斷：即時評估音標準確度、節奏流暢度",
        "IPA 音標糾錯標註：綠色=完美，黃色=輕微偏音，紅色=重音修復",
        "DSE Paper 4 口語練習：自信對答，告別全英文溝通恐懼",
        "AI 導師發音優勢診治與考評局 Level 5** 技巧提示"
      ]
    },
    {
      id: "poster-4",
      imgUrl: img5849,
      tag: "🏆 考點積累 • 奪星逆襲",
      headline: "DSE 奪星：個人知識庫 + 間隔重複",
      subheadline: "三十年教育經驗 ORAL 練習 + 生詞複習",
      themeColor: "#EC4899",
      gradient: "from-pink-600/20 via-rose-950/60 to-black",
      borderColor: "border-pink-500/50",
      glowColor: "shadow-[0_0_50px_rgba(236,72,153,0.25)]",
      icon: BookOpen,
      badgeText: "AI Mock Test + 生詞記憶卡",
      featureRoute: "knowledge" as const,
      highlights: [
        "所有掃描過的課文、高頻 DSE 考題生詞與錯題自動歸檔",
        "艾賓浩斯間隔重複演算法：自動提示溫習時間",
        "一鍵導出生詞卡片，帶有雙語音標、DSE 5** 例句與廣東話導讀",
        "多端同步，隨手利用碎片時間高效率備考"
      ]
    },
    {
      id: "poster-5",
      imgUrl: imgBdc8,
      tag: "💡 詞彙大師 • 高頻積累",
      headline: "高頻詞彙卡與個人知識庫",
      subheadline: "收錄三千+ 考評局高頻 5** 生詞，隨時隨地智能溫習",
      themeColor: "#10B981",
      gradient: "from-emerald-600/20 via-teal-950/60 to-black",
      borderColor: "border-emerald-500/50",
      glowColor: "shadow-[0_0_50px_rgba(16,185,129,0.25)]",
      icon: BookOpen,
      badgeText: "3000+ 考評局詞彙備份",
      featureRoute: "knowledge" as const,
      highlights: [
        "智能等級標籤：DSE Level 3, Level 4, Level 5*",
        "多向釋義：繁體中文、簡體中文、英文雙語對照",
        "標準語音導讀與例句朗讀，輕鬆加深記憶",
        "自訂單字卡分類與測驗模式"
      ]
    },
    {
      id: "poster-6",
      imgUrl: imgDdb6,
      tag: "🗣️ 實戰模擬 • 4人小組試",
      headline: "DSE 4 人 AI 小組口試實戰",
      subheadline: "模擬香港考評局口試，3 位 AI 考生與你進行實時討論",
      themeColor: "#F59E0B",
      gradient: "from-amber-600/20 via-orange-950/60 to-black",
      borderColor: "border-amber-500/50",
      glowColor: "shadow-[0_0_50px_rgba(245,158,11,0.25)]",
      icon: Mic,
      badgeText: "三十年經驗 • 口試神幫手",
      featureRoute: "discussion" as const,
      highlights: [
        "考官全程評估：依據考評局 5** Rubric 評分標準",
        "提供針對性評分報告：Pronunciation, Language, Consensus",
        "模擬真實 DSE Paper 4 考場氣氛與 Turn-taking 接話技巧",
        "克服與本地香港同學全英文小組討論的緊張感"
      ]
    },
    {
      id: "poster-7",
      imgUrl: imgE67f,
      tag: "📚 課本照相 • 0.8x 慢速",
      headline: "隨手拍 ➔ 即時 OCR 釋義",
      subheadline: "AI 翻譯 + 0.8x 慢速朗讀 + 詳細錯誤診斷",
      themeColor: "#06B6D4",
      gradient: "from-cyan-600/20 via-slate-950/60 to-black",
      borderColor: "border-cyan-500/50",
      glowColor: "shadow-[0_0_50px_rgba(6,182,212,0.25)]",
      icon: Camera,
      badgeText: "0.8x 慢速對齊朗讀",
      featureRoute: "snap" as const,
      highlights: [
        "拍下全英文講義或試卷，0.5秒完成多語言 OCR 識圖",
        "0.8x 慢速英式口音朗讀，完美適應 HKDSE 試題聽力對齊",
        "雙語重點提示，讓不懂的生詞不再成為學習絆腳石"
      ]
    }
  ];

  const current = promoPosters[activePosterIndex];

  const handleNext = () => {
    setActivePosterIndex((prev) => (prev + 1) % promoPosters.length);
  };

  const handlePrev = () => {
    setActivePosterIndex((prev) => (prev - 1 + promoPosters.length) % promoPosters.length);
  };

  const handleRandomize = () => {
    let nextIndex = Math.floor(Math.random() * promoPosters.length);
    if (nextIndex === activePosterIndex) {
      nextIndex = (activePosterIndex + 1) % promoPosters.length;
    }
    setActivePosterIndex(nextIndex);
  };

  const handleStartExperience = () => {
    if (onNavigateToFeature) {
      onNavigateToFeature(current.featureRoute);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
        <div className={`relative bg-[#0a0a0f] border-2 ${current.borderColor} rounded-3xl max-w-5xl w-full p-5 sm:p-8 text-white ${current.glowColor} transition-all duration-500 overflow-hidden my-auto`}>
          {/* Background Ambient Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-80 pointer-events-none`} />

          {/* Modal Header Bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-black text-[#00FF88] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span>{isZh ? "EduBridge HK 🌟 DSE 奪星海報展 (7 Poster Showcase)" : "DSE Star-Scoring Poster Showcase"}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRandomize}
                className="px-3 py-1.5 rounded-xl bg-[#00FF88]/20 border border-[#00FF88]/40 hover:bg-[#00FF88] text-[#00FF88] hover:text-black font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Shuffle className="w-4 h-4" />
                <span>{isZh ? "🎲 隨機精選" : "Randomize"}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Poster Tabs Selector */}
          <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {promoPosters.map((poster, index) => {
              const Icon = poster.icon;
              const isActive = index === activePosterIndex;
              return (
                <button
                  key={poster.id}
                  onClick={() => setActivePosterIndex(index)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#00FF88] text-black shadow-lg shadow-[#00FF88]/30 scale-105"
                      : "bg-white/5 hover:bg-white/15 text-white/70 border border-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>Poster #{index + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Main Poster Showcase Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Column: Copywriting & High Impact Features */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-black bg-[#00FF88]/15 border border-[#00FF88]/40 text-[#00FF88]">
                {current.tag}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {current.headline}
              </h1>

              <p className="text-sm font-bold text-white/80 border-l-2 border-[#00FF88] pl-3 py-1">
                {current.subheadline}
              </p>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[11px] font-black uppercase tracking-wider text-yellow-300 block mb-2 px-2">
                  🌟 {isZh ? "核心特色亮點 (Key Highlights)" : "Key Highlights"}
                </span>
                <ul className="space-y-2">
                  {current.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-white/90 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action & Navigation Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleStartExperience}
                  className="flex-1 py-3.5 bg-[#00FF88] text-black font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#00FF88]/30 hover:bg-[#00FF88]/90 active:scale-95 transition-all cursor-pointer"
                >
                  <span>{isZh ? "🚀 即刻體驗此 AI 功能" : "Try Feature Now"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Actual Real Poster Image Showcase with Phone Frame */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div
                onClick={() => setZoomPosterUrl(current.imgUrl)}
                className="group relative w-full max-w-[270px] bg-black/90 border-4 border-white/20 rounded-[32px] p-2 shadow-2xl overflow-hidden cursor-pointer hover:border-[#00FF88]/80 transition-all duration-300"
              >
                {/* Real High-Res Poster Image */}
                <div className="relative rounded-[24px] overflow-hidden aspect-[1008/1792] bg-black">
                  <img
                    src={current.imgUrl}
                    alt={current.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Zoom Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                    <Maximize2 className="w-8 h-8 text-[#00FF88] animate-bounce" />
                    <span className="text-xs font-black px-3 py-1 bg-black/80 rounded-full border border-white/20">
                      {isZh ? "點擊放大全圖 (1008×1792)" : "Click to Enlarge"}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className="text-[10px] text-white/70 font-mono flex items-center justify-center gap-1">
                    <Maximize2 className="w-3 h-3 text-[#00FF88]" />
                    {isZh ? "尺寸: 1008 × 1792 (高清宣傳海報)" : "1008 × 1792 HD Poster"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 mt-6 text-xs">
            <div className="flex items-center gap-2 text-white/60 font-mono">
              <span>Poster {activePosterIndex + 1} / {promoPosters.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl active:scale-95 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Resolution Image Lightbox Zoom Modal */}
      {zoomPosterUrl && (
        <div
          onClick={() => setZoomPosterUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 animate-fade-in cursor-pointer"
        >
          <div className="relative max-w-2xl w-full max-h-[92vh] flex flex-col items-center">
            <button
              onClick={() => setZoomPosterUrl(null)}
              className="absolute -top-10 right-0 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomPosterUrl}
              alt="Full Poster Zoom"
              className="max-h-[85vh] w-auto rounded-3xl border-2 border-[#00FF88]/60 shadow-[0_0_50px_rgba(0,255,136,0.4)] object-contain"
            />
            <p className="text-white/80 text-xs mt-3 font-mono">
              {isZh ? "點擊任意區域關閉 • 官方原圖解析度 1008 × 1792" : "Click anywhere to close"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
