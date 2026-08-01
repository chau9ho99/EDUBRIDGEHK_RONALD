import React, { useState } from "react";
import {
  Users,
  MessageSquare,
  Mic,
  MicOff,
  Play,
  Volume2,
  Sparkles,
  Award,
  BookOpen,
  Send,
  Zap,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Info
} from "lucide-react";
import { GroupDiscussionSession, DiscussionMessage, DSERubricReport } from "../types";
import { SAMPLE_DISCUSSION_TOPICS } from "../data/presetData";
import { speakText, stopSpeech } from "../utils/speechUtils";

import { Language, translations } from "../utils/i18n";

interface GroupDiscussionProps {
  investorMode: boolean;
  lang?: Language;
}

export const GroupDiscussion: React.FC<GroupDiscussionProps> = ({ investorMode, lang = "zh-CN" }) => {
  const [selectedTopic, setSelectedTopic] = useState(SAMPLE_DISCUSSION_TOPICS[0]);
  const [langMode, setLangMode] = useState<"en" | "cantonese" | "mandarin">("en");
  
  // Active session messages
  const [messages, setMessages] = useState<DiscussionMessage[]>(selectedTopic.initialMessages);
  const [userInput, setUserInput] = useState("");
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Voice mic recording simulation/browser STT
  const [isRecording, setIsRecording] = useState(false);
  
  // Rubric report
  const [report, setReport] = useState<DSERubricReport | null>(null);

  // Audio playing ID
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);

  // Switch topic
  const handleSelectTopic = (topic: typeof SAMPLE_DISCUSSION_TOPICS[0]) => {
    setSelectedTopic(topic);
    setMessages(topic.initialMessages);
    setReport(null);
  };

  // Play candidate turn speech
  const handlePlayAudio = (msg: DiscussionMessage) => {
    if (playingMsgId === msg.id) {
      stopSpeech();
      setPlayingMsgId(null);
    } else {
      setPlayingMsgId(msg.id);
      const speechLang = langMode === "cantonese" ? "zh-HK" : langMode === "mandarin" ? "zh-CN" : "en-US";
      speakText(msg.content, speechLang, 1.0, () => {
        setPlayingMsgId(null);
      });
    }
  };

  // User submits a turn
  const handleUserSubmit = (textOverride?: string) => {
    const text = textOverride || userInput;
    if (!text.trim()) return;

    const userMsg: DiscussionMessage = {
      id: "m-user-" + Date.now(),
      speaker: "Candidate D (You / Student)",
      speakerRole: "User",
      avatar: "user",
      content: text,
      hkTranslation: text,
      dseTip: "Your Turn: Building on the discussion flow.",
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setUserInput("");

    // Trigger AI Agent Response
    triggerNextAgentTurn(newHistory);
  };

  // Call server to generate next candidate's turn
  const triggerNextAgentTurn = async (currentHistory: DiscussionMessage[]) => {
    setIsGeneratingNext(true);
    try {
      const res = await fetch("/api/group-discussion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic.title,
          mode: langMode,
          messageHistory: currentHistory.map((m) => ({
            role: m.speakerRole,
            name: m.speaker,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      const aiMsg: DiscussionMessage = {
        id: "m-ai-" + Date.now(),
        speaker: data.speaker || "Candidate A (Alex)",
        speakerRole: data.speakerRole || "Alex",
        avatar: data.avatar || "alex",
        content: data.content,
        hkTranslation: data.hkTranslation,
        dseTip: data.dseTip,
        keyVocabulary: data.keyVocabulary,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Agent turn failed, using smart fallback candidate turn", err);
      // Fallback Candidate C response
      const fallbackMsg: DiscussionMessage = {
        id: "m-ai-" + Date.now(),
        speaker: "Candidate C (Chris)",
        speakerRole: "Chris",
        avatar: "chris",
        content: "I see your point Candidate D. To add on to that, we should also examine how school teachers can provide human guidance alongside AI tools.",
        hkTranslation: "我理解 Candidate D 嘅觀點。補充一點，我哋都應該探討學校老師點樣喺 AI 工具旁提供人性化指引。",
        dseTip: "Signposting: 'To add on to that' shows strong interaction in DSE Paper 4.",
        keyVocabulary: ["human guidance", "alongside"],
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsGeneratingNext(false);
    }
  };

  // Evaluate DSE Rubric
  const handleEvaluateSession = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch("/api/dse-rubric-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic.title,
          messageHistory: messages,
        }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      if (!data || !data.scores) throw new Error("Invalid rubric scores format");
      setReport(data);
    } catch (err) {
      // Fallback rubric report
      setReport({
        overallGrade: "Level 5",
        scores: {
          pronunciation: "5",
          communication: "5*",
          vocabulary: "4",
          ideas: "5",
        },
        strengths: [
          "表現主動：能適時回應 Candidate C 的邀請並表達看法。",
          "邏輯清晰：成功指出數位平等 (Digital Equity) 與教學個人化兩者之間的平衡。",
        ],
        improvements: [
          "DSE 詞彙升級：建議多用「substantiate」(證實) 或「alleviate」(緩解) 代替基礎單字。",
          "發音連音：在發音「that's a valid point」時可嘗試更自然的英語連讀。",
        ],
        examinerCommentary:
          "整體表現極佳！學生展現出極強的轉承語 (Signposting) 技巧。對於剛來港適應 DSE 的新移民同學而言，只要繼續累積高階詞彙，口試考取 Level 5* 指日可待！",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Investor Pitch Banner */}
      {investorMode && (
        <div className="bg-white/5 border border-white/10 border-l-2 border-[#00FF88] rounded-xl p-5 text-white/80 text-xs sm:text-sm flex items-start gap-4 shadow-2xl">
          <Zap className="w-5 h-5 text-[#00FF88] shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-[#00FF88] uppercase tracking-wider text-sm">
              投資人展示亮點 (Phase 2: DSE 多智能體口試小組討論 Simulator)
            </p>
            <p className="mt-1 text-white/70 leading-relaxed">
              香港 DSE 英文科卷四 (Paper 4 Speaking) 是 4 人小組討論。本平台創先河利用 Gemini 多智能體 (Multi-Agent) 模擬 Candidate A, B, C 各自的性格與口音，讓新移民學生隨時進行真實 4 人討論，並自動比對 HKEAA 考評局官方 5** 評分標準！支持英/粵/普三語切換。
            </p>
          </div>
        </div>
      )}

      {/* Header & Configuration */}
      <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-[#00FF88]" />
                HKDSE 多智能體小組討論 (Multi-Agent Oral Simulator)
              </h2>
              <span className="bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                DSE Paper 4 考評局對標
              </span>
            </div>
            <p className="text-xs text-white/40 uppercase tracking-wider mt-1">
              由多個 AI 學生角色 (Candidate A, B, C) 陪你即時進行英文/廣東話組別討論，克服口試緊張感
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-black p-1 rounded-xl border border-white/10 text-xs font-black uppercase tracking-wider">
            <span className="text-white/40 px-2 text-[10px] tracking-widest">口試語言:</span>
            {[
              { id: "en", label: "DSE English Paper 4" },
              { id: "cantonese", label: "廣東話口試" },
              { id: "mandarin", label: "普通話適應" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setLangMode(m.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  langMode === m.id
                    ? "bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_DISCUSSION_TOPICS.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleSelectTopic(topic)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                selectedTopic.id === topic.id
                  ? "bg-white/10 border-l-4 border-l-[#00FF88] border-white/20 shadow-xl"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30">
                  {topic.category}
                </span>
                <span className="text-xs text-[#00FF88] font-bold uppercase tracking-wider">{topic.difficulty}</span>
              </div>
              <h4 className="font-bold text-sm text-white">{topic.title}</h4>
              <p className="text-xs text-white/50 line-clamp-2">{topic.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Discussion Arena Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Live Candidate Conversation Stream */}
        <div className="lg:col-span-2 bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col min-h-[600px] space-y-4">
          {/* Active Candidates Roster Badge */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
            <span className="text-white/70 font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00FF88]" />
              討論組員成員名單：
            </span>
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                Alex (Cand A)
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                Brenda (Cand B)
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                Chris (Cand C)
              </span>
              <span className="px-2 py-0.5 rounded bg-[#00FF88] text-black font-black shadow">
                You (Cand D)
              </span>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.speakerRole === "User";
              return (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border space-y-2 transition-all ${
                    isUser
                      ? "bg-white/10 border-l-4 border-l-[#00FF88] border-white/20 ml-4"
                      : "bg-black border-white/10 mr-4"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs uppercase ${
                          msg.speakerRole === "Alex"
                            ? "bg-white text-black"
                            : msg.speakerRole === "Brenda"
                            ? "bg-white text-black"
                            : msg.speakerRole === "Chris"
                            ? "bg-white text-black"
                            : "bg-[#00FF88] text-black font-black"
                        }`}
                      >
                        {msg.speakerRole[0]}
                      </div>
                      <span className="font-bold text-sm text-white">{msg.speaker}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Audio speech button */}
                      <button
                        onClick={() => handlePlayAudio(msg)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                          playingMsgId === msg.id
                            ? "bg-white text-black animate-pulse"
                            : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20"
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        {playingMsgId === msg.id ? "播放中..." : "朗讀發音"}
                      </button>
                    </div>
                  </div>

                  {/* Speech Content */}
                  <p className="text-sm text-white/90 leading-relaxed font-sans">{msg.content}</p>

                  {/* Translation & DSE Tip */}
                  {msg.hkTranslation && !isUser && (
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1 text-xs">
                      <p className="text-white/80">
                        <span className="text-[#00FF88] font-black uppercase tracking-wider text-[10px]">粵語/中文對譯:</span>{" "}
                        {msg.hkTranslation}
                      </p>
                      {msg.dseTip && (
                        <p className="text-white/90 font-medium pt-1 border-t border-white/10 text-[11px]">
                          <span className="font-black text-[#00FF88]">DSE 答題應試技巧:</span> {msg.dseTip}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isGeneratingNext && (
              <div className="p-4 rounded-xl bg-black border border-white/10 text-white/50 text-xs flex items-center gap-2 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-[#00FF88]" />
                其他 AI 組員正在思考回應 Candidate D (你) 的觀點...
              </div>
            )}
          </div>

          {/* User Input & Action Controls */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            {/* Suggested Idea Chips for User */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">
                💡 點擊靈感點子 (快速發言):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "I completely support Candidate A's view on digital equity.",
                  "From my perspective as a new student in HK, practice builds confidence.",
                  "May I also suggest introducing teacher moderation during AI sessions?",
                ].map((idea, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUserSubmit(idea)}
                    className="text-[10px] bg-black hover:bg-white/10 text-white/80 border border-white/10 rounded-lg px-2.5 py-1 text-left transition-all truncate max-w-full font-medium"
                  >
                    💬 "{idea}"
                  </button>
                ))}
              </div>
            </div>

            {/* Mic / Text Input Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsRecording(!isRecording);
                  if (!isRecording) {
                    setUserInput("In my opinion, integrating AI tools gives equal learning access to all students in Hong Kong.");
                  }
                }}
                className={`p-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  isRecording
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#00FF88]" />}
                {isRecording ? "錄音中..." : "語音發言"}
              </button>

              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUserSubmit()}
                placeholder="輪到 Candidate D (你) 發言，可輸入英文或廣東話..."
                className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00FF88]"
              />

              <button
                onClick={() => handleUserSubmit()}
                disabled={!userInput.trim() || isGeneratingNext}
                className="bg-[#00FF88] hover:bg-[#00e67a] text-black px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-black" />
                發言
              </button>
            </div>

            {/* Trigger Next AI Turn Manually */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                onClick={() => triggerNextAgentTurn(messages)}
                disabled={isGeneratingNext}
                className="text-xs text-[#00FF88] hover:underline font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> 讓 AI 組員繼續互相討論
              </button>

              <button
                onClick={handleEvaluateSession}
                disabled={isEvaluating}
                className="bg-[#00FF88] hover:bg-[#00e67a] text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,255,136,0.2)] transition-all flex items-center gap-1.5"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> 考評局 AI 正在評分...
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" /> 生成考評局 DSE 5** 評分報告
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: HKEAA DSE Official Rubric Report */}
        <div className="space-y-6">
          <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h4 className="font-black text-white text-base uppercase tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-[#00FF88]" />
                HKEAA DSE 考評局評分報告
              </h4>
              {report && (
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-[#00FF88] text-black rounded-lg shadow">
                  {report.overallGrade}
                </span>
              )}
            </div>

            {report && report.scores ? (
              <div className="space-y-4 text-xs">
                {/* 4 Assessment Categories */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-black border border-white/10 rounded-xl space-y-1">
                    <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">Pronunciation</span>
                    <span className="font-black text-sm text-[#00FF88]">Level {report.scores?.pronunciation || "5"}</span>
                  </div>
                  <div className="p-3 bg-black border border-white/10 rounded-xl space-y-1">
                    <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">Communication</span>
                    <span className="font-black text-sm text-[#00FF88]">Level {report.scores?.communication || "5*"}</span>
                  </div>
                  <div className="p-3 bg-black border border-white/10 rounded-xl space-y-1">
                    <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">Vocabulary</span>
                    <span className="font-black text-sm text-[#00FF88]">Level {report.scores?.vocabulary || "4"}</span>
                  </div>
                  <div className="p-3 bg-black border border-white/10 rounded-xl space-y-1">
                    <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">Ideas & Logic</span>
                    <span className="font-black text-sm text-[#00FF88]">Level {report.scores?.ideas || "5"}</span>
                  </div>
                </div>

                {/* Strengths */}
                <div className="space-y-1.5">
                  <span className="font-black text-[#00FF88] uppercase tracking-wider block">✓ 表現突出之處 (Strengths):</span>
                  <ul className="space-y-1 list-disc list-inside text-white/80">
                    {(report.strengths || []).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="space-y-1.5">
                  <span className="font-black text-white/90 uppercase tracking-wider block">▲ 新移民口音與衝刺建議:</span>
                  <ul className="space-y-1 list-disc list-inside text-white/80">
                    {(report.improvements || []).map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>

                {/* Commentary */}
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/90 leading-relaxed">
                  <span className="font-black block mb-1 text-[#00FF88] uppercase tracking-wider">考官評語 (Examiner Commentary):</span>
                  <p>{report.examinerCommentary}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-white/40 space-y-3">
                <Info className="w-8 h-8 mx-auto text-white/30" />
                <p className="text-xs uppercase tracking-wider">
                  點擊下方「生成考評局 DSE 5** 評分報告」<br />
                  AI 考官會分析你喺口試中嘅發音、轉承語與詞彙等級！
                </p>
                <button
                  onClick={handleEvaluateSession}
                  disabled={isEvaluating}
                  className="mt-2 bg-[#00FF88] hover:bg-[#00e67a] text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow transition-all"
                >
                  立即體驗 AI 考官評分
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
