import React, { useState, useEffect } from "react";
import { Sparkles, Shuffle, Maximize2, ArrowRight, Award, Camera, Mic, BookOpen } from "lucide-react";
import { Language } from "../utils/i18n";

// Image URLs served statically via /assets/IMG/
const img65b2 = "/assets/IMG/imagine-65b2e111-231c-4923-978e-e1506b38e734.jpg";
const img4247 = "/assets/IMG/imagine-4247f796-eb04-476c-b262-98de68381c8f.jpg";
const img5849 = "/assets/IMG/imagine-58492dfb-ec10-482c-bf47-73157584108c.jpg";
const imgBdc8 = "/assets/IMG/imagine-bdc848de-0af8-4ddc-ba88-f3db6b2c366a.jpg";
const imgC980 = "/assets/IMG/imagine-c9807f1d-bcb1-40f9-8999-359f1b3ae77f.jpg";
const imgDdb6 = "/assets/IMG/imagine-ddb60b1f-7535-4e0c-9136-9a8bde3ace43.jpg";
const imgE67f = "/assets/IMG/imagine-e67feb7e-0cca-41fb-a2fd-031b7083457d.jpg";

export interface PosterItem {
  id: string;
  imgUrl: string;
  title: string;
  subtitle: string;
  badge: string;
  themeColor: string;
  glowShadow: string;
  featureRoute: "snap" | "oral" | "knowledge" | "discussion";
  icon: React.ElementType;
}

export const POSTER_DATABASE: PosterItem[] = [
  {
    id: "poster-65b2",
    imgUrl: img65b2,
    title: "從不適應，到 DSE 奪星",
    subtitle: "你的 AI 英語私人導師 • 4大核心功能全亮相",
    badge: "🔥 小紅書熱推 • 品牌旗艦",
    themeColor: "#00FF88",
    glowShadow: "shadow-[0_0_30px_rgba(0,255,136,0.3)]",
    featureRoute: "snap",
    icon: Award,
  },
  {
    id: "poster-4247",
    imgUrl: img4247,
    title: "Snap & Learn 隨手拍",
    subtitle: "即時釋義與分析 • 專為全英文授課銜接設計",
    badge: "📸 拍照即學 • OCR",
    themeColor: "#3B82F6",
    glowShadow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    featureRoute: "snap",
    icon: Camera,
  },
  {
    id: "poster-5849",
    imgUrl: img5849,
    title: "DSE 奪星：個人知識庫",
    subtitle: "間隔重複演算法 + 三十年教育經驗 ORAL 練習",
    badge: "🏆 考點積累 • 5** 題庫",
    themeColor: "#EC4899",
    glowShadow: "shadow-[0_0_30px_rgba(236,72,153,0.3)]",
    featureRoute: "knowledge",
    icon: BookOpen,
  },
  {
    id: "poster-bdc8",
    imgUrl: imgBdc8,
    title: "高頻詞彙與個人知識庫",
    subtitle: "收錄三千+ 考評局高頻生詞，隨時隨地智能溫習",
    badge: "💡 詞彙卡 • 音標導讀",
    themeColor: "#10B981",
    glowShadow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    featureRoute: "knowledge",
    icon: BookOpen,
  },
  {
    id: "poster-c980",
    imgUrl: imgC980,
    title: "AI 口語發音與流暢度評估",
    subtitle: "不怕開口尷尬，即時修正發音與 IPA 音標反饋",
    badge: "🎙️ AI 診斷 • 不怕尷尬",
    themeColor: "#A855F7",
    glowShadow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    featureRoute: "oral",
    icon: Mic,
  },
  {
    id: "poster-ddb6",
    imgUrl: imgDdb6,
    title: "DSE Paper 4 口語練習",
    subtitle: "不怕開口尷尬 • AI 即時修正發音與 IPA 反饋",
    badge: "🗣️ 三十年經驗 • 口試神幫手",
    themeColor: "#F59E0B",
    glowShadow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
    featureRoute: "discussion",
    icon: Mic,
  },
  {
    id: "poster-e67f",
    imgUrl: imgE67f,
    title: "隨手拍 ➔ 即時 OCR 釋義",
    subtitle: "AI 翻譯 + 0.8x 慢速朗讀 + 詳細錯誤診斷",
    badge: "📚 課本照相 • 0.8x 慢速",
    themeColor: "#06B6D4",
    glowShadow: "shadow-[0_0_30px_rgba(6,182,212,0.3)]",
    featureRoute: "snap",
    icon: Camera,
  },
];

interface RandomPromoCardProps {
  lang: Language;
  onOpenFullShowcase?: () => void;
  onNavigateToFeature?: (feature: "snap" | "oral" | "knowledge" | "discussion") => void;
  compactMode?: boolean;
}

export const RandomPromoCard: React.FC<RandomPromoCardProps> = ({
  lang,
  onOpenFullShowcase,
  onNavigateToFeature,
  compactMode = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  // Initialize with a random index on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * POSTER_DATABASE.length);
    setCurrentIndex(randomIndex);
  }, []);

  const currentPoster = POSTER_DATABASE[currentIndex];
  const isZh = lang !== "en";

  const handleNextRandom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        let next = Math.floor(Math.random() * POSTER_DATABASE.length);
        if (next === prev) next = (prev + 1) % POSTER_DATABASE.length;
        return next;
      });
      setIsFlipping(false);
    }, 250);
  };

  const handleCardClick = () => {
    if (onOpenFullShowcase) {
      onOpenFullShowcase();
    } else {
      setZoomImg(currentPoster.imgUrl);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group relative rounded-3xl bg-[#0d0d14] border-2 border-white/15 hover:border-[#00FF88]/60 transition-all duration-300 overflow-hidden cursor-pointer ${
          currentPoster.glowShadow
        } ${compactMode ? "max-w-[260px] p-3" : "w-full max-w-[320px] p-4"} mx-auto`}
      >
        {/* Neon Cyber Glow Header */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="px-2.5 py-1 bg-[#00FF88]/15 border border-[#00FF88]/40 rounded-xl text-[10px] font-black text-[#00FF88] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
            <span>{currentPoster.badge}</span>
          </span>

          <button
            onClick={handleNextRandom}
            title={isZh ? "隨機換一張海報" : "Randomize poster"}
            className="p-1.5 bg-white/10 hover:bg-[#00FF88] hover:text-black text-white rounded-xl text-xs font-bold transition-all active:scale-90 flex items-center gap-1 shadow-md shrink-0 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black hidden sm:inline">{isZh ? "換一張" : "Swap"}</span>
          </button>
        </div>

        {/* Poster Image Container with Cyber Frame */}
        <div className="relative rounded-2xl overflow-hidden bg-black/80 border border-white/10 group-hover:scale-[1.02] transition-transform duration-300 aspect-[9/14] flex items-center justify-center">
          <img
            src={currentPoster.imgUrl}
            alt={currentPoster.title}
            className={`w-full h-full object-cover object-center transition-all duration-300 ${
              isFlipping ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"
            }`}
            loading="lazy"
          />

          {/* Hover Overlay Hint */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
            <div className="flex items-center justify-between text-xs font-black text-[#00FF88] mb-1">
              <span>{isZh ? "點擊放大海報展 🔍" : "Click to view full poster"}</span>
              <Maximize2 className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-white/80 line-clamp-2 font-medium">
              {currentPoster.subtitle}
            </p>
          </div>
        </div>

        {/* Bottom Title & Action Button */}
        <div className="mt-3 space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-black text-white truncate group-hover:text-[#00FF88] transition-colors">
              {currentPoster.title}
            </h4>
            <span className="text-[10px] text-white/50 font-mono">#{currentIndex + 1}/7</span>
          </div>

          <p className="text-[11px] text-white/70 line-clamp-1 font-sans">
            {currentPoster.subtitle}
          </p>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onNavigateToFeature) {
                  onNavigateToFeature(currentPoster.featureRoute);
                } else if (onOpenFullShowcase) {
                  onOpenFullShowcase();
                }
              }}
              className="w-full py-2 bg-[#00FF88] hover:bg-[#00FF88]/90 text-black font-black text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>{isZh ? "🚀 試用此 AI 功能" : "Try Feature"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for direct zoom if modal callback not provided */}
      {zoomImg && (
        <div
          onClick={() => setZoomImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in cursor-pointer"
        >
          <div className="relative max-w-lg w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={zoomImg}
              alt="Zoomed Poster"
              className="max-h-[80vh] w-auto rounded-2xl shadow-2xl border-2 border-[#00FF88]/50 object-contain"
            />
            <p className="text-white/80 text-xs mt-3 font-mono">
              {isZh ? "點擊任意處關閉 • 圖片解析度 1008 × 1792" : "Click anywhere to close"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
