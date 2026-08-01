import React from "react";
import {
  Camera,
  Mic,
  Users,
  Brain,
  Sparkles,
  ArrowRight,
  Zap
} from "lucide-react";
import { Language, translations } from "../utils/i18n";

interface HomeHubProps {
  lang: Language;
  onSelectFeature: (feature: "snap" | "discussion" | "knowledge" | "investor") => void;
  investorMode: boolean;
}

export const HomeHub: React.FC<HomeHubProps> = ({
  lang,
  onSelectFeature,
  investorMode,
}) => {
  const t = translations[lang];

  // Title & subtitles localized for zh-CN, zh-HK, en
  const mainTitle =
    lang === "zh-HK"
      ? "HKDSE 英文升學 AI 伴練"
      : lang === "zh-CN"
      ? "HKDSE 英文升学 AI 伴练"
      : "HKDSE AI English Companion";

  const subTitle =
    lang === "zh-HK"
      ? "點選下方功能卡片，進入 Step-by-Step 專注學習對練。"
      : lang === "zh-CN"
      ? "点击下方功能卡片，进入 Step-by-Step 专注学习对练。"
      : "Tap any core feature card below to start practicing step-by-step.";

  const step1Title =
    lang === "zh-HK"
      ? "📸 拍照 OCR"
      : lang === "zh-CN"
      ? "📸 拍照 OCR"
      : "📸 Photo OCR";

  const step1Sub =
    lang === "zh-HK"
      ? "課本自動提取"
      : lang === "zh-CN"
      ? "课本自动提取"
      : "Extract Passage";

  const step2Title =
    lang === "zh-HK"
      ? "🎧 0.8x 朗讀"
      : lang === "zh-CN"
      ? "🎧 0.8x 朗读"
      : "🎧 0.8x Speech";

  const step2Sub =
    lang === "zh-HK"
      ? "慢速英音正音"
      : lang === "zh-CN"
      ? "慢速英音正音"
      : "Slow Accent TTS";

  const step3Title =
    lang === "zh-HK"
      ? "🎙️ 跟讀診斷"
      : lang === "zh-CN"
      ? "🎙️ 跟读诊断"
      : "🎙️ Shadowing Coach";

  const step3Sub =
    lang === "zh-HK"
      ? "重音音標分析"
      : lang === "zh-CN"
      ? "重音音标分析"
      : "Accent & IPA Analysis";

  const step4Title =
    lang === "zh-HK"
      ? "💬 AI 口試"
      : lang === "zh-CN"
      ? "💬 AI 口试"
      : "💬 AI Oral Exam";

  const step4Sub =
    lang === "zh-HK"
      ? "Paper 4 實戰"
      : lang === "zh-CN"
      ? "Paper 4 实战"
      : "Paper 4 Practice";

  const sectionHeader =
    lang === "zh-HK"
      ? "核心功能模組 (點擊卡片即刻進入)"
      : lang === "zh-CN"
      ? "核心功能模块 (点击卡片即刻进入)"
      : "Core Feature Modules (Tap to Enter)";

  // Card 1 Text
  const c1Tag = lang === "zh-HK" ? "Step 1 • 核心王牌" : lang === "zh-CN" ? "Step 1 • 核心王牌" : "Step 1 • Core Feature";
  const c1Mono = lang === "zh-HK" ? "即影即學" : lang === "zh-CN" ? "即影即学" : "Snap & Learn";
  const c1Title = lang === "zh-HK" ? "📸 即影即學 (Snap & Learn)" : lang === "zh-CN" ? "📸 即影即学 (Snap & Learn)" : "📸 Snap & Learn";
  const c1Sub = lang === "zh-HK" ? "拍照/上傳課本即刻 OCR 提取 & 0.8x 慢速朗讀" : lang === "zh-CN" ? "拍照/上传课本即刻 OCR 提取 & 0.8x 慢速朗读" : "Photo OCR Extraction & 0.8x Slow Narration";
  const c1Desc = lang === "zh-HK"
    ? "拍下英文課本、練習卷或學校通告，Gemini AI 多模態 OCR 提取英文，自動標註 DSE Level 5* 高頻生詞，並開啟卡拉 OK 0.8x 慢速英音朗讀。"
    : lang === "zh-CN"
    ? "拍下英文课本、练习卷或学校通告，Gemini AI 多模态 OCR 提取英文，自动标注 DSE Level 5* 高频生词，并开启卡拉 OK 0.8x 慢速英音朗读。"
    : "Snap textbook pages or school notices to extract English text via AI OCR. Auto-highlights DSE Level 5* vocabulary and launches 0.8x slow English narration.";
  const c1Footer = lang === "zh-HK" ? "點擊開始拍照/上傳" : lang === "zh-CN" ? "点击开始拍照/上传" : "Tap to snap or upload";
  const c1Btn = lang === "zh-HK" ? "進入即影即學" : lang === "zh-CN" ? "进入即影即学" : "Start Snap & Learn";

  // Card 2 Text
  const c2Tag = lang === "zh-HK" ? "Step 2 • 實時正音" : lang === "zh-CN" ? "Step 2 • 实时正音" : "Step 2 • Accent Coach";
  const c2Mono = lang === "zh-HK" ? "跟讀與發音診斷" : lang === "zh-CN" ? "跟读与发音诊断" : "Pronunciation Coach";
  const c2Title = lang === "zh-HK" ? "🎙️ AI 跟讀跟練與發音診斷" : lang === "zh-CN" ? "🎙️ AI 跟读跟练与发音诊断" : "🎙️ AI Shadowing & Pronunciation Coach";
  const c2Sub = lang === "zh-HK" ? "麥克風錄音，AI 評估 HKDSE 重音與發音精準度" : lang === "zh-CN" ? "麦克风录音，AI 评估 HKDSE 重音与发音精准度" : "Microphone recording with real-time IPA & stress diagnosis";
  const c2Desc = lang === "zh-HK"
    ? "跟隨 0.8x 原聲進行麥克風錄音，AI 即時提供音標 (IPA) 對齊標註、重音移位警告與 DSE Paper 4 口試考官建議報告！"
    : lang === "zh-CN"
    ? "跟随 0.8x 原声进行麦克风录音，AI 即时提供音标 (IPA) 对齐标注、重音移位警告与 DSE Paper 4 口试考官建议报告！"
    : "Shadow 0.8x native audio with your mic. AI provides real-time IPA alignment, syllable stress warnings, and HKDSE Paper 4 examiner reports!";
  const c2Footer = lang === "zh-HK" ? "點擊開啟麥克風跟讀" : lang === "zh-CN" ? "点击开启麦克风跟读" : "Tap to start mic shadowing";
  const c2Btn = lang === "zh-HK" ? "進入發音診斷" : lang === "zh-CN" ? "进入发音诊断" : "Start Accent Coach";

  // Card 3 Text
  const c3Tag = lang === "zh-HK" ? "Step 3 • 考場擬真" : lang === "zh-CN" ? "Step 3 • 考场拟真" : "Step 3 • Exam Simulation";
  const c3Title = lang === "zh-HK" ? "💬 DSE 4人 AI 小組口試" : lang === "zh-CN" ? "💬 DSE 4人 AI 小组口试" : "💬 DSE 4-Player AI Group Oral";
  const c3Sub = lang === "zh-HK" ? "Candidate A/B/C 角色化多智能體對答演練" : lang === "zh-CN" ? "Candidate A/B/C 角色化多智能体对答演练" : "Candidate A/B/C AI peer discussion practice";
  const c3Desc = lang === "zh-HK"
    ? "模擬香港考評局口試，3 位 AI 考生與你進行小組討論，AI 考官依據 5** Rubric 標準生成 Pronunciation, Body Language, Consensus 報告。"
    : lang === "zh-CN"
    ? "模拟香港考评局口试，3 位 AI 考生与你进行小组讨论，AI 考官依据 5** Rubric 标准生成 Pronunciation, Body Language, Consensus 报告。"
    : "Simulates HKDSE Paper 4 oral exam with 3 AI student candidates. Generates 5** Rubric diagnostic reports on Pronunciation, Strategy & Consensus.";
  const c3Footer = lang === "zh-HK" ? "點擊開始模擬口試" : lang === "zh-CN" ? "点击开始模拟口试" : "Tap to simulate Paper 4";
  const c3Btn = lang === "zh-HK" ? "進入 AI 口試場" : lang === "zh-CN" ? "进入 AI 口试场" : "Enter AI Oral Exam";

  // Card 4 Text
  const c4Tag = lang === "zh-HK" ? "Step 4 • 智能復習" : lang === "zh-CN" ? "Step 4 • 智能复习" : "Step 4 • Smart Review";
  const c4Mono = lang === "zh-HK" ? "詞彙錯題庫" : lang === "zh-CN" ? "词汇错题库" : "Vocab & Flashcards";
  const c4Title = lang === "zh-HK" ? "📚 DSE 高頻詞彙與個人知識庫" : lang === "zh-CN" ? "📚 DSE 高频词汇与个人知识库" : "📚 DSE Vocab & Knowledge Base";
  const c4Sub = lang === "zh-HK" ? "掃描歷史歸檔、考評局分級詞庫與閃卡復習" : lang === "zh-CN" ? "扫描历史归档、考评局分级词库与闪卡复习" : "Auto-archived scan history & spaced repetition flashcards";
  const c4Desc = lang === "zh-HK"
    ? "所有掃描過的課文、高頻 DSE 考題生詞與錯題筆記自動歸檔，支援手機端智能雙面翻牌閃卡，隨時隨地快速複習。"
    : lang === "zh-CN"
    ? "所有扫描过的课文、高频 DSE 考题生词与错题笔记自动归档，支持手机端智能双面翻牌闪卡，随时随地快速复习。"
    : "All scanned passages, high-frequency DSE vocab, and error logs are saved to your personal Knowledge Base with 3D flip flashcards.";
  const c4Footer = lang === "zh-HK" ? "點擊查看個人詞庫" : lang === "zh-CN" ? "点击查看个人词库" : "Tap to view saved vocab";
  const c4Btn = lang === "zh-HK" ? "進入知識庫" : lang === "zh-CN" ? "进入知识库" : "Open Knowledge Base";

  // Card 5 Investor Text
  const c5Title = lang === "zh-HK" ? "📊 商業模式與投資人展示專區 (Investor Hub)" : lang === "zh-CN" ? "📊 商业模式与投资人展示专区 (Investor Hub)" : "📊 Business Model & Investor Pitch Hub";
  const c5Sub = lang === "zh-HK"
    ? "查看香港每年 45,000+ 新移民學童市場需求、EdTech 商業估值數據、三語適應策略與平台訂閱架構。"
    : lang === "zh-CN"
    ? "查看香港每年 45,000+ 新移民学童市场需求、EdTech 商业估值数据、三语适应策略与平台订阅架构。"
    : "Explore Hong Kong's 45,000+ immigrant student market needs, EdTech valuation metrics, trilingual strategy & subscription structure.";
  const c5Btn = lang === "zh-HK" ? "查看 Pitch Deck" : lang === "zh-CN" ? "查看 Pitch Deck" : "View Pitch Deck";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Hero Welcome Banner - Clean, Concise Title with enlarged font */}
      <div className="relative bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Background Accent Lights */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#00FF88]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] text-xs sm:text-sm font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#00FF88] animate-pulse" />
            <span>EduBridge HK</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] via-emerald-200 to-indigo-300 uppercase tracking-tight leading-tight">
            {mainTitle}
          </h1>

          <p className="text-sm sm:text-base text-white/90 font-sans leading-relaxed">
            {subTitle}
          </p>

          {/* Step-by-step Visual Roadmap */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-[#00FF88] text-black font-black text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">{step1Title}</p>
                <p className="text-[11px] sm:text-xs text-white/60">{step1Sub}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">{step2Title}</p>
                <p className="text-[11px] sm:text-xs text-white/60">{step2Sub}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-purple-500 text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">{step3Title}</p>
                <p className="text-[11px] sm:text-xs text-white/60">{step3Sub}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-amber-500 text-black font-black text-xs flex items-center justify-center shrink-0">4</span>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">{step4Title}</p>
                <p className="text-[11px] sm:text-xs text-white/60">{step4Sub}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Feature Cards - High Impact, Spacious, Modern */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#00FF88]" />
            <span>{sectionHeader}</span>
          </h2>
          <span className="text-xs sm:text-sm text-[#00FF88] font-bold hidden sm:inline">
            Step-by-Step Focused Mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Feature Card 1: Snap & Learn */}
          <div
            onClick={() => onSelectFeature("snap")}
            className="group relative bg-gradient-to-br from-neutral-900/90 via-black to-emerald-950/40 border-2 border-[#00FF88]/40 hover:border-[#00FF88] rounded-3xl p-6 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.25)] hover:-translate-y-1 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-full bg-[#00FF88] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md">
                  {c1Tag}
                </span>
                <span className="text-xs sm:text-sm font-mono text-[#00FF88] font-bold">{c1Mono}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#00FF88] text-black font-black flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight group-hover:text-[#00FF88] transition-colors">
                    {c1Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#00FF88] font-bold mt-1">
                    {c1Sub}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
                {c1Desc}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-white/60 font-bold">{c1Footer}</span>
              <button className="px-5 py-3 bg-[#00FF88] group-hover:bg-[#00e67a] text-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg shrink-0">
                <span>{c1Btn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Feature Card 2: AI Shadowing Coach */}
          <div
            onClick={() => onSelectFeature("snap")}
            className="group relative bg-gradient-to-br from-neutral-900/90 via-black to-purple-950/40 border-2 border-purple-500/40 hover:border-purple-400 rounded-3xl p-6 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:-translate-y-1 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-full bg-purple-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md">
                  {c2Tag}
                </span>
                <span className="text-xs sm:text-sm font-mono text-purple-300 font-bold">{c2Mono}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-500 text-white font-black flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <Mic className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight group-hover:text-purple-300 transition-colors">
                    {c2Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-300 font-bold mt-1">
                    {c2Sub}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
                {c2Desc}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-white/60 font-bold">{c2Footer}</span>
              <button className="px-5 py-3 bg-purple-500 group-hover:bg-purple-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg shrink-0">
                <span>{c2Btn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Feature Card 3: Group Oral Practice */}
          <div
            onClick={() => onSelectFeature("discussion")}
            className="group relative bg-gradient-to-br from-neutral-900/90 via-black to-blue-950/40 border-2 border-blue-500/40 hover:border-blue-400 rounded-3xl p-6 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] hover:-translate-y-1 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-full bg-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md">
                  {c3Tag}
                </span>
                <span className="text-xs sm:text-sm font-mono text-blue-300 font-bold">DSE Paper 4</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-500 text-white font-black flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight group-hover:text-blue-300 transition-colors">
                    {c3Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-300 font-bold mt-1">
                    {c3Sub}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
                {c3Desc}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-white/60 font-bold">{c3Footer}</span>
              <button className="px-5 py-3 bg-blue-500 group-hover:bg-blue-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg shrink-0">
                <span>{c3Btn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Feature Card 4: Knowledge Base & Flashcards */}
          <div
            onClick={() => onSelectFeature("knowledge")}
            className="group relative bg-gradient-to-br from-neutral-900/90 via-black to-amber-950/40 border-2 border-amber-500/40 hover:border-amber-400 rounded-3xl p-6 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:-translate-y-1 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-full bg-amber-500 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md">
                  {c4Tag}
                </span>
                <span className="text-xs sm:text-sm font-mono text-amber-300 font-bold">{c4Mono}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500 text-black font-black flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    {c4Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-300 font-bold mt-1">
                    {c4Sub}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
                {c4Desc}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-white/60 font-bold">{c4Footer}</span>
              <button className="px-5 py-3 bg-amber-500 group-hover:bg-amber-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg shrink-0">
                <span>{c4Btn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Card 5: Investor & Pitch Hub */}
      <div
        onClick={() => onSelectFeature("investor")}
        className="group relative bg-gradient-to-r from-neutral-900 via-black to-neutral-900 border border-white/20 hover:border-[#00FF88] rounded-3xl p-6 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_0_25px_rgba(0,255,136,0.2)] flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#00FF88]/20 border border-[#00FF88]/40 text-[#00FF88] font-black flex items-center justify-center shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-xl font-black text-white">{c5Title}</h3>
              <span className="px-2.5 py-0.5 bg-[#00FF88] text-black text-xs font-black uppercase rounded-full">
                EdTech Pitch
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 font-sans mt-1.5 leading-relaxed">
              {c5Sub}
            </p>
          </div>
        </div>

        <button className="w-full sm:w-auto px-6 py-3.5 bg-white/10 group-hover:bg-[#00FF88] group-hover:text-black text-white border border-white/20 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shrink-0 flex items-center justify-center gap-2">
          <span>{c5Btn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

