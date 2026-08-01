import React, { useState, useEffect } from "react";
import {
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Activity,
  Shield,
  Layers,
  Sparkles,
  Server,
  ArrowRight,
  Terminal,
  Clock,
  Key
} from "lucide-react";
import { Language } from "../utils/i18n";

interface AdminConsoleProps {
  lang: Language;
}

interface ProviderStatusData {
  providers: {
    text_generation: "openrouter" | "gemini";
    article_generation: "openrouter" | "gemini";
    tutor_chat: "openrouter" | "gemini";
    group_discussion: "openrouter" | "gemini";
    translation: "openrouter" | "gemini";
  };
  stats: {
    todayDate: string;
    openrouterCount: number;
    openrouterLimit: number; // 50
    geminiCount: number;
    openrouterErrors: number;
    lastUsedProvider: { [key: string]: string };
  };
  openrouterKeyConfigured: boolean;
  geminiKeyConfigured: boolean;
  openrouterModel: string;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ lang }) => {
  const [data, setData] = useState<ProviderStatusData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Testing states
  const [testingOpenRouter, setTestingOpenRouter] = useState<boolean>(false);
  const [openRouterTestResult, setOpenRouterTestResult] = useState<{
    success: boolean;
    message: string;
    responseTimeMs?: number;
    sampleOutput?: string;
    reasoningEnabled?: boolean;
  } | null>(null);

  const [testingGemini, setTestingGemini] = useState<boolean>(false);
  const [geminiTestResult, setGeminiTestResult] = useState<{
    success: boolean;
    message: string;
    responseTimeMs?: number;
    sampleOutput?: string;
  } | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/provider-status");
      if (!res.ok) throw new Error("Failed to load provider status");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Network error fetching provider status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSetProvider = async (feature: string, provider: "openrouter" | "gemini") => {
    try {
      const res = await fetch("/api/admin/set-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature, provider }),
      });
      if (!res.ok) throw new Error("Failed to update provider");
      const updated = await res.json();
      setData((prev) => (prev ? { ...prev, providers: updated.providers } : prev));
    } catch (err: any) {
      alert("Error updating provider: " + err.message);
    }
  };

  const handleTestProvider = async (provider: "openrouter" | "gemini") => {
    if (provider === "openrouter") {
      setTestingOpenRouter(true);
      setOpenRouterTestResult(null);
    } else {
      setTestingGemini(true);
      setGeminiTestResult(null);
    }

    try {
      const res = await fetch("/api/admin/test-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const json = await res.json();

      if (provider === "openrouter") {
        setOpenRouterTestResult(json);
      } else {
        setGeminiTestResult(json);
      }
      fetchStatus();
    } catch (err: any) {
      const failObj = { success: false, message: err.message || "Test call failed" };
      if (provider === "openrouter") setOpenRouterTestResult(failObj);
      else setGeminiTestResult(failObj);
    } finally {
      if (provider === "openrouter") setTestingOpenRouter(false);
      else setTestingGemini(false);
    }
  };

  const handleResetCounter = async () => {
    if (!window.confirm("Reset today's OpenRouter request counter?")) return;
    try {
      const res = await fetch("/api/admin/reset-counter", { method: "POST" });
      if (res.ok) fetchStatus();
    } catch (err: any) {
      alert("Failed to reset counter: " + err.message);
    }
  };

  const openrouterUsagePercent = data
    ? Math.min(100, Math.round((data.stats.openrouterCount / data.stats.openrouterLimit) * 100))
    : 0;

  const isNearLimit = data && data.stats.openrouterCount >= 45;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-neutral-900 via-black to-emerald-950 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#00FF88]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF88]/15 border border-[#00FF88]/40 text-[#00FF88] text-xs font-black uppercase tracking-wider">
              <Shield className="w-4 h-4 text-[#00FF88]" />
              <span>EduBridge AI Provider Abstraction Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              ⚙️ System Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl font-sans">
              Manage AI Model Providers, OpenRouter Free Tier Routing (<code className="text-[#00FF88]">nvidia/nemotron-3-ultra-550b-a55b:free</code>), Gemini Multi-Model Fallbacks, and Rate Limit Metrics.
            </p>
          </div>

          <button
            onClick={fetchStatus}
            disabled={loading}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 text-[#00FF88] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Status</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      {loading && !data ? (
        <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-12 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#00FF88] animate-spin mx-auto" />
          <p className="text-sm font-bold text-white/70">Connecting to AI Abstraction Layer...</p>
        </div>
      ) : error ? (
        <div className="bg-red-950/40 border border-red-500/50 rounded-3xl p-6 text-red-200 flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-red-400 shrink-0" />
          <div>
            <h3 className="font-bold text-base">Error Loading Admin Console</h3>
            <p className="text-xs opacity-80">{error}</p>
          </div>
        </div>
      ) : data ? (
        <>
          {/* Rate Limit Alert Banner if near 50 req/day */}
          {isNearLimit && (
            <div className="bg-amber-950/60 border-2 border-amber-500/80 rounded-3xl p-5 text-amber-200 flex items-start sm:items-center gap-4 shadow-xl animate-pulse">
              <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <div className="flex-1 space-y-1">
                <h4 className="font-black text-sm uppercase tracking-wider text-amber-300">
                  ⚠️ OpenRouter Free Tier Limit Warning ({data.stats.openrouterCount} / {data.stats.openrouterLimit} Requests Today)
                </h4>
                <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
                  You are approaching the 50 request/day limit for OpenRouter free model (<code className="text-amber-100 font-mono">nvidia/nemotron-3-ultra-550b-a55b:free</code>). Requests will automatically fall back to Gemini without interrupting student learning.
                </p>
              </div>
            </div>
          )}

          {/* Top Row: Provider Usage & Key Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: OpenRouter Status */}
            <div className="bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border-2 border-[#00FF88]/40 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#00FF88] text-black font-black flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white">OpenRouter AI</h3>
                    <p className="text-[10px] text-[#00FF88] font-mono font-bold">Default Text Model</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#00FF88]/20 border border-[#00FF88]/50 text-[#00FF88] text-[10px] font-black uppercase">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/70">Model:</span>
                  <span className="text-white font-mono text-[11px] truncate max-w-[200px]">
                    nvidia/nemotron-3-ultra-550b-a55b:free
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/70">Reasoning Mode:</span>
                  <span className="text-[#00FF88] font-mono">Enabled ( reasoning: true )</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/70">API Key Status:</span>
                  <span className="text-[#00FF88] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Configured
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-white/80">Daily Requests Used:</span>
                  <span className={isNearLimit ? "text-amber-400 font-bold" : "text-[#00FF88]"}>
                    {data.stats.openrouterCount} / {data.stats.openrouterLimit} (50 Max)
                  </span>
                </div>
                <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden border border-white/10">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isNearLimit ? "bg-amber-400" : "bg-[#00FF88]"
                    }`}
                    style={{ width: `${openrouterUsagePercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
                <span>Errors today: {data.stats.openrouterErrors}</span>
                <button
                  onClick={handleResetCounter}
                  className="text-[#00FF88] hover:underline font-bold text-[10px]"
                >
                  Reset Count
                </button>
              </div>
            </div>

            {/* Card 2: Gemini Fallback Status */}
            <div className="bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border-2 border-blue-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-500 text-white font-black flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white">Google Gemini</h3>
                    <p className="text-[10px] text-blue-300 font-mono font-bold">Auto Fallback & Vision</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/50 text-blue-300 text-[10px] font-black uppercase">
                  READY
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/70">Primary Model:</span>
                  <span className="text-white font-mono text-[11px]">gemini-3.6-flash</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/70">Fallbacks:</span>
                  <span className="text-blue-300 font-mono text-[11px]">gemini-2.5-flash</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/70">API Key Status:</span>
                  <span className="text-blue-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Configured
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-black">
                <span className="text-white/80">Requests Handled Today:</span>
                <span className="text-blue-400 font-bold text-sm">{data.stats.geminiCount}</span>
              </div>
            </div>

            {/* Card 3: Provider Strategy & Resiliency Summary */}
            <div className="bg-gradient-to-br from-neutral-900 via-black to-purple-950/40 border border-white/15 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-400" />
                  <h3 className="font-black text-base text-white">Resilience Architecture</h3>
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  All text & article features route through OpenRouter by default. If OpenRouter returns 429 rate limit or fails, the API seamless fails over to Gemini instantly with zero downtime.
                </p>
              </div>

              <div className="bg-black/60 border border-white/10 rounded-2xl p-3 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-white/80">
                  <span className="text-white/50">Strategy:</span>
                  <span className="text-[#00FF88] font-bold">OpenRouter ➔ Gemini</span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span className="text-white/50">Multimodal (OCR/Audio):</span>
                  <span className="text-blue-300 font-bold">Gemini Direct</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Feature Provider Routing Switcher */}
          <div className="bg-neutral-900/90 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Layers className="w-6 h-6 text-[#00FF88]" />
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                    Feature Provider Routing Switcher
                  </h2>
                  <p className="text-xs text-white/60 font-sans">
                    Configure preferred AI provider for each core app module.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Feature 1: Text Generation */}
              <div className="bg-black/80 border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#00FF88] font-bold uppercase">
                      text_generation
                    </span>
                    <span className="text-[10px] text-white/40 font-bold">Snap OCR / Vocab</span>
                  </div>
                  <h4 className="font-black text-sm text-white mt-1">📸 Text & Vocab Analysis</h4>
                  <p className="text-[11px] text-white/60 font-sans mt-1 leading-normal">
                    OCR text breakdown, vocabulary levels & grammar rules.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="text-[10px] text-white/50 font-bold">Active Route:</div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleSetProvider("text_generation", "openrouter")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase transition-all ${
                        data.providers.text_generation === "openrouter"
                          ? "bg-[#00FF88] text-black shadow-md"
                          : "bg-white/5 text-white/60 border border-white/10 hover:text-white"
                      }`}
                    >
                      OpenRouter
                    </button>
                    <button
                      onClick={() => handleSetProvider("text_generation", "gemini")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase transition-all ${
                        data.providers.text_generation === "gemini"
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white/5 text-white/60 border border-white/10 hover:text-white"
                      }`}
                    >
                      Gemini
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature 2: Article Generation */}
              <div className="bg-black/80 border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#00FF88] font-bold uppercase">
                      article_generation
                    </span>
                    <span className="text-[10px] text-white/40 font-bold">DSE Passages</span>
                  </div>
                  <h4 className="font-black text-sm text-white mt-1">📚 Reading Passage Generator</h4>
                  <p className="text-[11px] text-white/60 font-sans mt-1 leading-normal">
                    Generates 80-word DSE Paper 1 reading articles & topics.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="text-[10px] text-white/50 font-bold">Active Route:</div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleSetProvider("article_generation", "openrouter")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase transition-all ${
                        data.providers.article_generation === "openrouter"
                          ? "bg-[#00FF88] text-black shadow-md"
                          : "bg-white/5 text-white/60 border border-white/10 hover:text-white"
                      }`}
                    >
                      OpenRouter
                    </button>
                    <button
                      onClick={() => handleSetProvider("article_generation", "gemini")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase transition-all ${
                        data.providers.article_generation === "gemini"
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white/5 text-white/60 border border-white/10 hover:text-white"
                      }`}
                    >
                      Gemini
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature 3: Tutor Chat */}
              <div className="bg-black/80 border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#00FF88] font-bold uppercase">
                      tutor_chat
                    </span>
                    <span className="text-[10px] text-white/40 font-bold">British Voice</span>
                  </div>
                  <h4 className="font-black text-sm text-white mt-1">🎧 AI Audio Tutor Chat</h4>
                  <p className="text-[11px] text-white/60 font-sans mt-1 leading-normal">
                    Concise British English tutor explanations & Q&A.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="text-[10px] text-white/50 font-bold">Active Route:</div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleSetProvider("tutor_chat", "openrouter")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase transition-all ${
                        data.providers.tutor_chat === "openrouter"
                          ? "bg-[#00FF88] text-black shadow-md"
                          : "bg-white/5 text-white/60 border border-white/10 hover:text-white"
                      }`}
                    >
                      OpenRouter
                    </button>
                    <button
                      onClick={() => handleSetProvider("tutor_chat", "gemini")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase transition-all ${
                        data.providers.tutor_chat === "gemini"
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white/5 text-white/60 border border-white/10 hover:text-white"
                      }`}
                    >
                      Gemini
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature 4: Group Discussion */}
              <div className="bg-black/80 border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#00FF88] font-bold uppercase">
                      group_discussion
                    </span>
                    <span className="text-[10px] text-white/40 font-bold">Paper 4 Oral</span>
                  </div>
                  <h4 className="font-black text-sm text-white mt-1">💬 DSE 4-Player AI Oral</h4>
                  <p className="text-[11px] text-white/60 font-sans mt-1 leading-normal">
                    Multi-agent student persona candidates (Alex, Brenda, Chris).
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="text-[10px] text-white/50 font-bold">Active Route:</div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleSetProvider("group_discussion", "openrouter")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase transition-all ${
                        data.providers.group_discussion === "openrouter"
                          ? "bg-[#00FF88] text-black shadow-md"
                          : "bg-white/5 text-white/60 border border-white/10 hover:text-white"
                      }`}
                    >
                      OpenRouter
                    </button>
                    <button
                      onClick={() => handleSetProvider("group_discussion", "gemini")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase transition-all ${
                        data.providers.group_discussion === "gemini"
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white/5 text-white/60 border border-white/10 hover:text-white"
                      }`}
                    >
                      Gemini
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature 5: Instant Translation */}
              <div className="bg-black/80 border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#00FF88] font-bold uppercase">
                      translation
                    </span>
                    <span className="text-[10px] text-white/40 font-bold">Highlight Popover</span>
                  </div>
                  <h4 className="font-black text-sm text-white mt-1">🔤 Instant Selection Translate</h4>
                  <p className="text-[11px] text-white/60 font-sans mt-1 leading-normal">
                    Highlight text reader popover translation & IPA analysis.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="text-[10px] text-white/50 font-bold">Active Route:</div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleSetProvider("translation", "openrouter")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase transition-all ${
                        data.providers.translation === "openrouter"
                          ? "bg-[#00FF88] text-black shadow-md"
                          : "bg-white/5 text-white/60 border border-white/10 hover:text-white"
                      }`}
                    >
                      OpenRouter
                    </button>
                    <button
                      onClick={() => handleSetProvider("translation", "gemini")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase transition-all ${
                        data.providers.translation === "gemini"
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white/5 text-white/60 border border-white/10 hover:text-white"
                      }`}
                    >
                      Gemini
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Live Provider Connection Testers */}
          <div className="bg-neutral-900/90 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-[#00FF88]" />
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                    Live Provider Diagnostics & Connection Tester
                  </h2>
                  <p className="text-xs text-white/60 font-sans">
                    Execute instant API diagnostic calls to verify response time and reasoning details.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Test Box 1: OpenRouter Test */}
              <div className="bg-black/90 border border-white/15 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-[#00FF88]" />
                    <h3 className="font-black text-sm text-white">Test OpenRouter API</h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#00FF88]">
                    nvidia/nemotron-3-ultra-550b-a55b:free
                  </span>
                </div>

                <p className="text-xs text-white/60 font-sans">
                  Sends a test prompt with <code className="text-[#00FF88] font-mono">reasoning: &#123;enabled: true&#125;</code> to verify OpenRouter free tier connectivity.
                </p>

                <button
                  onClick={() => handleTestProvider("openrouter")}
                  disabled={testingOpenRouter}
                  className="w-full py-3 bg-[#00FF88] hover:bg-[#00e67a] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${testingOpenRouter ? "animate-spin" : ""}`} />
                  <span>{testingOpenRouter ? "Testing OpenRouter..." : "Run OpenRouter Test"}</span>
                </button>

                {openRouterTestResult && (
                  <div
                    className={`rounded-xl p-4 border space-y-2 text-xs font-mono ${
                      openRouterTestResult.success
                        ? "bg-emerald-950/40 border-[#00FF88]/50 text-emerald-200"
                        : "bg-red-950/40 border-red-500/50 text-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {openRouterTestResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        )}
                        {openRouterTestResult.success ? "Connection Success" : "Test Failed"}
                      </span>
                      {openRouterTestResult.responseTimeMs && (
                        <span className="text-white/60 text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#00FF88]" />
                          {openRouterTestResult.responseTimeMs} ms
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] opacity-90 leading-relaxed font-sans">
                      {openRouterTestResult.message}
                    </p>
                    {openRouterTestResult.sampleOutput && (
                      <div className="bg-black/70 p-2.5 rounded-lg border border-white/10 text-[10px] text-white/80 overflow-x-auto max-h-32 leading-relaxed">
                        {openRouterTestResult.sampleOutput}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Test Box 2: Gemini Test */}
              <div className="bg-black/90 border border-white/15 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <h3 className="font-black text-sm text-white">Test Google Gemini API</h3>
                  </div>
                  <span className="text-[10px] font-mono text-blue-300">
                    gemini-3.6-flash
                  </span>
                </div>

                <p className="text-xs text-white/60 font-sans">
                  Sends a test prompt directly to Gemini SDK to verify fallback resilience.
                </p>

                <button
                  onClick={() => handleTestProvider("gemini")}
                  disabled={testingGemini}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${testingGemini ? "animate-spin" : ""}`} />
                  <span>{testingGemini ? "Testing Gemini..." : "Run Gemini Test"}</span>
                </button>

                {geminiTestResult && (
                  <div
                    className={`rounded-xl p-4 border space-y-2 text-xs font-mono ${
                      geminiTestResult.success
                        ? "bg-blue-950/40 border-blue-500/50 text-blue-200"
                        : "bg-red-950/40 border-red-500/50 text-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {geminiTestResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        )}
                        {geminiTestResult.success ? "Connection Success" : "Test Failed"}
                      </span>
                      {geminiTestResult.responseTimeMs && (
                        <span className="text-white/60 text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-400" />
                          {geminiTestResult.responseTimeMs} ms
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] opacity-90 leading-relaxed font-sans">
                      {geminiTestResult.message}
                    </p>
                    {geminiTestResult.sampleOutput && (
                      <div className="bg-black/70 p-2.5 rounded-lg border border-white/10 text-[10px] text-white/80 overflow-x-auto max-h-32 leading-relaxed">
                        {geminiTestResult.sampleOutput}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
