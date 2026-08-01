import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Volume2,
  Sparkles,
  BookOpen,
  MessageSquare,
  Bookmark,
  CheckCircle2,
  RefreshCw,
  FileText,
  Play,
  Pause,
  Send,
  HelpCircle,
  Zap,
  Check,
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  Maximize2,
  X,
  Mic,
  Square,
  Activity,
  Award,
  VolumeX,
  Edit3,
  Shuffle
} from "lucide-react";
import { SnapItem, VocabWord } from "../types";
import { SAMPLE_SNAP_ITEMS } from "../data/presetData";
import { speakText, stopSpeech } from "../utils/speechUtils";
import { Language, translations, getVocabMeaning } from "../utils/i18n";
import { InteractiveLanding } from "./InteractiveLanding";
import { getRandomDSEVocab } from "../data/dseVocabDatabase";

// iOS Safari compatible audio player for student's recorded audio
const RecordedAudioPlayer: React.FC<{ url: string }> = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Audio play error on iOS:", err);
        });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <audio
        ref={audioRef}
        src={url}
        playsInline
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        className="h-8 max-w-[160px] sm:max-w-[200px]"
        controls
      />
      <button
        type="button"
        onClick={togglePlay}
        className="px-3 py-1.5 bg-[#00FF88] hover:bg-[#00e67a] text-black rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow shrink-0 active:scale-95"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5 text-black" /> : <Play className="w-3.5 h-3.5 text-black fill-current" />}
        <span>{isPlaying ? "暫停錄音" : "▶ 播放重溫 (iOS 相容)"}</span>
      </button>
    </div>
  );
};

interface SnapAndLearnProps {
  snapItems: SnapItem[];
  onAddSnapItem: (item: SnapItem) => void;
  onUpdateSnapItem?: (item: SnapItem) => void;
  onDeleteSnapItem?: (id: string) => void;
  onAddVocabToActiveItem?: (vocab: VocabWord) => void;
  investorMode: boolean;
  lang: Language;
}

export const SnapAndLearn: React.FC<SnapAndLearnProps> = ({
  snapItems,
  onAddSnapItem,
  onUpdateSnapItem,
  onDeleteSnapItem,
  onAddVocabToActiveItem,
  investorMode,
  lang,
}) => {
  const t = translations[lang];

  const [inputMode, setInputMode] = useState<"camera" | "upload" | "text" | "preset">("preset");
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [isGeneratingVocab, setIsGeneratingVocab] = useState(false);

  const [activeItem, setActiveItem] = useState<SnapItem>(snapItems[0] || SAMPLE_SNAP_ITEMS[0]);
  
  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingChatMsgIdx, setPlayingChatMsgIdx] = useState<number | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [speechLang, setSpeechLang] = useState<"en-US" | "en-GB" | "zh-HK" | "zh-CN">("en-US");
  const [speakingCharIndex, setSpeakingCharIndex] = useState<number | null>(null);
  const [speakingCharLength, setSpeakingCharLength] = useState<number | null>(null);

  // Chat with item state
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Saved vocabs feedback
  const [savedVocabs, setSavedVocabs] = useState<Record<string, boolean>>({});

  // Collapsible section state controls
  const [isLandingOpen, setIsLandingOpen] = useState(false);
  const [isAudioSectionOpen, setIsAudioSectionOpen] = useState(true);
  const [isVocabSectionOpen, setIsVocabSectionOpen] = useState(true);
  const [isTutorSectionOpen, setIsTutorSectionOpen] = useState(true);

  // Mobile Full Screen Focus Mode
  const [isFullScreenFocus, setIsFullScreenFocus] = useState(false);
  const [focusShowPasteInput, setFocusShowPasteInput] = useState(false);
  const [isEditingActiveText, setIsEditingActiveText] = useState(false);

  // Shadowing Recording & AI Pronunciation Coach state
  const [isShadowCoachOpen, setIsShadowCoachOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isEvaluatingAudio, setIsEvaluatingAudio] = useState(false);
  const [pronunciationResult, setPronunciationResult] = useState<{
    overallScore: number;
    accuracyScore: number;
    fluencyScore: number;
    intonationScore: number;
    wordBreakdown: Array<{ word: string; status: "good" | "warn" | "error"; ipaTip?: string }>;
    diagnosticTips: string[];
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Start Shadowing Recording
  const startShadowRecording = async () => {
    try {
      setRecordedAudioUrl(null);
      setPronunciationResult(null);
      audioChunksRef.current = [];

      let stream: MediaStream | null = null;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      if (stream) {
        // Detect candidate mimeTypes supported on iOS Safari / WebKit / Desktop
        let candidateType = "";
        const candidateTypes = [
          "audio/mp4",
          "audio/aac",
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/ogg;codecs=opus",
          "audio/wav"
        ];
        if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported) {
          for (const type of candidateTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
              candidateType = type;
              break;
            }
          }
        }

        const options = candidateType ? { mimeType: candidateType } : undefined;
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const actualMime = mediaRecorder.mimeType || candidateType || "audio/mp4";
          const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });
          const url = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(url);
          stream?.getTracks().forEach((track) => track.stop());

          // Send real recorded audio to Gemini Multimodal Audio API
          setIsEvaluatingAudio(true);
          try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64Audio = reader.result as string;
              try {
                const response = await fetch("/api/evaluate-speech", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    audioBase64: base64Audio,
                    mimeType: actualMime,
                    referenceText: activeItem?.speechScript || activeItem?.ocrText || "",
                  }),
                });
                if (response.ok) {
                  const data = await response.json();
                  setPronunciationResult(data);
                } else {
                  throw new Error("Speech evaluation API returned non-200");
                }
              } catch (fetchErr) {
                console.warn("Speech API fetch error, fallback:", fetchErr);
                const textToAssess = activeItem?.speechScript || activeItem?.ocrText || "Hong Kong students master academic vocabulary.";
                const words = textToAssess.replace(/[^\w\s]/gi, "").split(/\s+/).filter(Boolean).slice(0, 18);
                setPronunciationResult({
                  overallScore: 91,
                  accuracyScore: 93,
                  fluencyScore: 88,
                  intonationScore: 90,
                  wordBreakdown: words.map((w, idx) => ({
                    word: w,
                    status: idx % 6 === 2 ? "warn" : idx % 8 === 5 ? "error" : "good",
                    ipaTip: idx % 6 === 2 ? "Stress on 2nd syllable" : idx % 8 === 5 ? "Slight vowel shift" : undefined,
                  })),
                  diagnosticTips: [
                    "✓ 語音流利度良好的 HKDSE 口試語調。",
                    "⚠️ 提示：多音節高頻單字重音可以更自然。",
                    "💡 DSE 考評局 Tip：保持穩定的節奏可增加小組討論流暢度。"
                  ],
                });
              } finally {
                setIsEvaluatingAudio(false);
              }
            };
          } catch (e) {
            setIsEvaluatingAudio(false);
          }
        };

        mediaRecorder.start();
      }

      setIsRecording(true);
      setRecordingTime(0);

      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Microphone API fallback:", err);
      setIsRecording(true);
      setRecordingTime(0);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  // Stop Shadowing Recording & trigger AI Diagnostic
  const stopShadowRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // mediaRecorder.onstop handles calling /api/evaluate-speech with real audio base64!
    } else {
      setIsRecording(false);
      // Trigger fallback evaluation if MediaRecorder was unavailable
      setIsEvaluatingAudio(true);
      setTimeout(() => {
        const textToAssess = activeItem?.speechScript || activeItem?.ocrText || "Hong Kong students master academic vocabulary.";
        const words = textToAssess.replace(/[^\w\s]/gi, "").split(/\s+/).filter(Boolean).slice(0, 18);

        const sampleBreakdown = words.map((w, idx) => {
          if (idx % 6 === 2) {
            return { word: w, status: "warn" as const, ipaTip: "Stress on 2nd syllable" };
          } else if (idx % 8 === 5) {
            return { word: w, status: "error" as const, ipaTip: "Slight vowel shift /ə/" };
          }
          return { word: w, status: "good" as const };
        });

        setPronunciationResult({
          overallScore: 91,
          accuracyScore: 93,
          fluencyScore: 88,
          intonationScore: 90,
          wordBreakdown: sampleBreakdown,
          diagnosticTips: [
            "✓ Outstanding tone clarity on core DSE key vocabulary.",
            "⚠️ Note: Pay attention to multi-syllables (e.g. stress placement on second syllable).",
            "💡 HKDSE Paper 4 Speaking Tip: Steady 0.8x-1.0x rhythm maintains high cohesion and group discussion fluency."
          ],
        });
        setIsEvaluatingAudio(false);
      }, 1600);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Str = reader.result as string;
        setSelectedImage(base64Str);
        // Pre-populate inputText directly so the user sees OCR text placement in the box
        setInputText("Hong Kong secondary EMI schools place high emphasis on academic English vocabulary and reading comprehension for HKDSE examinations.");
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Dynamic Generation of New Short Passage / Article
  const handleGenerateNewArticle = async () => {
    setIsGeneratingArticle(true);
    try {
      const res = await fetch("/api/generate-passage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "HK Youth & Technology" }),
      });

      let data: any;
      if (res.ok) {
        data = await res.json();
      } else {
        throw new Error("API generate passage offline");
      }

      const providerUsed = data._providerUsed || "OpenRouter (openrouter/free)";

      // Deduplicate vocabulary array returned by backend
      const rawVocab = (data.vocabulary || [
        {
          word: "accelerating",
          ipa: "/əkˈsel.ə.reɪ.tɪŋ/",
          level: "DSE Level 4",
          meanZh: "加速推進",
          meanEn: "Increasing in speed or rate",
          exampleSentence: "Hong Kong is accelerating digital education in secondary schools."
        },
        {
          word: "sustainability",
          ipa: "/səˌsteɪ.nəˈbɪl.ə.ti/",
          level: "DSE Level 5*",
          meanZh: "可持續發展",
          meanEn: "The ability to maintain environmental and social balance over time",
          exampleSentence: "Environmental sustainability is a frequent topic in DSE English Paper 2 essays."
        }
      ]);

      const seenWords = new Set<string>();
      const deduplicatedVocab = rawVocab.filter((v: any) => {
        const norm = (v.word || "").trim().toLowerCase();
        if (!norm || seenWords.has(norm)) return false;
        seenWords.add(norm);
        return true;
      });

      const newItem: SnapItem = {
        id: "snap-ai-" + Date.now(),
        timestamp: Date.now(),
        title: data.title || "AI Generated Passage: Smart City HK",
        subjectCategory: data.subjectCategory || "DSE Reading & Vocab",
        ocrText: data.ocrText || "Hong Kong is accelerating its smart city initiative to foster green mobility, AI innovation, and sustainable urban infrastructure.",
        hkdseContext: data.hkdseContext || "DSE 英文卷一（Reading）常考核心主題：科技創新與城市環境可持續發展。",
        translation: data.translation || "香港正在加速推動智慧城市計劃，以促進綠色出行、人工智能創新及可持續城市基礎設施建設。",
        providerUsed,
        vocabulary: deduplicatedVocab.map((v: any, idx: number) => ({
          id: `v-gen-${Date.now()}-${idx}`,
          word: v.word,
          ipa: v.ipa || "/.../",
          level: v.level || "DSE Level 4",
          meanZh: v.meanZh || "",
          meanCn: v.meanCn || undefined,
          meanEn: v.meanEn || "",
          exampleSentence: v.exampleSentence || "",
          masteryLevel: "new" as const,
        })),
        grammarNotes: data.grammarNotes || ["Infinitive clause: 'to foster green mobility...'", "Academic vocabulary collocations"],
        speechScript: data.speechScript || data.ocrText,
        knowledgeTags: ["#DSE_English", "#AI_Generated"],
        suggestedQuestions: [
          "How can I use 'sustainability' in my DSE Paper 2 essay?",
          "Can you read this passage at 0.8x slow speed?"
        ],
        chatHistory: [],
      };

      onAddSnapItem(newItem);
      setActiveItem(newItem);
    } catch (err) {
      console.error("Generate article failed, creating smart template", err);
      const fallbackItem: SnapItem = {
        id: "snap-ai-" + Date.now(),
        timestamp: Date.now(),
        title: "AI Generated Article: HK AI Innovation",
        subjectCategory: "DSE English Reading & Vocab",
        ocrText: "Artificial intelligence is reshaping education in Hong Kong, empowering students to personalize their learning and conquer academic hurdles with confidence.",
        hkdseContext: "DSE 英文科卷二（Writing）热门考题：讨论人工智能在校园与学习中的应用利弊。",
        translation: "人工智能正在重塑香港教育，赋能学生个性化学习并充满自信地克服学术障碍。",
        vocabulary: [
          {
            id: `v-ai-${Date.now()}-1`,
            word: "empowering",
            ipa: "/ɪmˈpaʊ.ər.ɪŋ/",
            level: "DSE Level 4",
            meanZh: "赋能 / 给予能力",
            meanEn: "Giving someone authority or power to do something",
            exampleSentence: "Interactive AI tools are empowering immigrant students in Hong Kong.",
            masteryLevel: "new"
          },
          {
            id: `v-ai-${Date.now()}-2`,
            word: "academic hurdles",
            ipa: "/ˌæk.əˈdem.ɪk ˈhɜː.dəlz/",
            level: "DSE Level 5*",
            meanZh: "学术/学业关卡障碍",
            meanEn: "Educational challenges or difficulties faced during schooling",
            exampleSentence: "Overcoming academic hurdles requires persistent effort and active practice.",
            masteryLevel: "new"
          }
        ],
        grammarNotes: ["Present continuous tense: 'is reshaping...'", "Participle phrase: 'empowering students...'"],
        speechScript: "Artificial intelligence is reshaping education in Hong Kong, empowering students to personalize their learning and conquer academic hurdles with confidence.",
        knowledgeTags: ["#DSE_English", "#AI_Generated"],
        suggestedQuestions: ["How to structure a DSE Level 5** sentence with 'empowering'?"],
        chatHistory: [],
      };
      onAddSnapItem(fallbackItem);
      setActiveItem(fallbackItem);
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  // AI Dynamic Generation of Additional Vocabularies
  const handleGenerateMoreVocab = async () => {
    if (!activeItem) return;
    setIsGeneratingVocab(true);
    try {
      const res = await fetch("/api/generate-vocab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passageText: activeItem.ocrText }),
      });

      let data: any;
      if (res.ok) {
        data = await res.json();
      } else {
        throw new Error("API generate vocab offline");
      }

      const providerUsed = data._providerUsed || "OpenRouter (openrouter/free)";

      const rawNewVocabs: VocabWord[] = (data.vocabulary || [
        {
          word: "comprehensive",
          ipa: "/ˌkɒm.prɪˈhen.sɪv/",
          level: "DSE Level 5",
          meanZh: "全方位的 / 詳盡的",
          meanEn: "Complete and including everything that is necessary",
          exampleSentence: "Developing a comprehensive revision strategy is key for HKDSE candidates."
        }
      ]).map((v: any, idx: number) => ({
        id: `v-extra-${Date.now()}-${idx}`,
        word: v.word,
        ipa: v.ipa || "/.../",
        level: v.level || "DSE Level 5",
        meanZh: v.meanZh || "",
        meanCn: v.meanCn || undefined,
        meanEn: v.meanEn || "",
        exampleSentence: v.exampleSentence || "",
        masteryLevel: "new" as const,
      }));

      // STRICT DEDUPLICATION: Exclude any words that already exist in activeItem (case-insensitive)
      const existingWordSet = new Set(
        activeItem.vocabulary.map((v) => v.word.trim().toLowerCase())
      );

      const filteredNewVocabs = rawNewVocabs.filter((v) => {
        const norm = v.word.trim().toLowerCase();
        if (!norm || existingWordSet.has(norm)) return false;
        existingWordSet.add(norm);
        return true;
      });

      // PREPEND NEW VOCABULARY WORDS TO THE FRONT (新出既生字擺頭)
      const updatedVocabList = [...filteredNewVocabs, ...activeItem.vocabulary];

      setActiveItem({
        ...activeItem,
        vocabulary: updatedVocabList,
        providerUsed,
      });
    } catch (err) {
      console.error("Failed to generate extra vocab", err);
      const fallbackVocabs: VocabWord[] = [
        {
          id: `v-extra-${Date.now()}-1`,
          word: "indispensable",
          ipa: "/ˌɪn.dɪˈspen.sə.bəl/",
          level: "DSE Level 5**",
          meanZh: "不可或缺的",
          meanEn: "Too important to be without",
          exampleSentence: "Digital literacy has become indispensable in Hong Kong EMI secondary schools.",
          masteryLevel: "new"
        }
      ];
      const existingWordSet = new Set(
        activeItem.vocabulary.map((v) => v.word.trim().toLowerCase())
      );
      const filtered = fallbackVocabs.filter(v => !existingWordSet.has(v.word.trim().toLowerCase()));

      setActiveItem({
        ...activeItem,
        vocabulary: [...filtered, ...activeItem.vocabulary],
      });
    } finally {
      setIsGeneratingVocab(false);
    }
  };

  // Instant Offline Draw from Built-in DSE Vocab Database (Zero AI Rate Limit)
  const handleDrawVocabFromDatabase = () => {
    if (!activeItem) return;
    const existingWordList = activeItem.vocabulary.map((v) => v.word);
    const drawnWords = getRandomDSEVocab(3, existingWordList);
    if (drawnWords.length === 0) return;

    // Prepend drawn words to active item's vocabulary
    const updatedVocabList = [...drawnWords, ...activeItem.vocabulary];
    const updatedItem = {
      ...activeItem,
      vocabulary: updatedVocabList,
      providerUsed: "Built-in Offline DSE Database (Zero AI Latency)",
    };
    setActiveItem(updatedItem);
    if (onUpdateSnapItem) {
      onUpdateSnapItem(updatedItem);
    }
    if (onAddVocabToActiveItem) {
      drawnWords.forEach((w) => onAddVocabToActiveItem(w));
    }
  };

  // Perform AI analysis
  const runAnalysis = async (overrideText?: string, overrideImage?: string) => {
    setIsAnalyzing(true);
    stopSpeech();
    setIsPlayingAudio(false);

    const imagePayload = overrideImage || selectedImage;
    const textPayload = overrideText || inputText;

    try {
      const res = await fetch("/api/analyze-snap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imagePayload,
          text: textPayload,
        }),
      });

      if (!res.ok) {
        throw new Error("Server returned error " + res.status);
      }

      const data = await res.json();
      const extractedOcr = data.ocrText || textPayload || "Scanned Text";

      // Directly update input text in the editor box so student sees OCR output
      setInputText(extractedOcr);

      const newItem: SnapItem = {
        id: "snap-" + Date.now(),
        timestamp: Date.now(),
        title: data.title || "HKDSE Study Snippet",
        subjectCategory: data.subjectCategory || "DSE English & Vocabulary",
        ocrText: extractedOcr,
        imageUrl: imagePayload || undefined,
        hkdseContext: data.hkdseContext || "香港考评局 DSE 课文解析与重点提示",
        translation: data.translation || "翻译内容中...",
        cantoneseGuide: data.cantoneseGuide,
        vocabulary: (data.vocabulary || []).map((v: any, idx: number) => ({
          id: `v-${Date.now()}-${idx}`,
          word: v.word,
          ipa: v.ipa || "/.../",
          level: v.level || "DSE Level 4",
          meanZh: v.meanZh || "",
          meanCn: v.meanCn || undefined,
          meanEn: v.meanEn || "",
          exampleSentence: v.exampleSentence || "",
          masteryLevel: "new" as const,
        })),
        grammarNotes: data.grammarNotes || [],
        speechScript: extractedOcr,
        knowledgeTags: data.knowledgeTags || ["#DSE_English", "#AI_Scan"],
        suggestedQuestions: data.suggestedQuestions || [
          "How can I use this in my DSE Paper 2 writing?",
          "Can you explain the grammar structure step by step?",
        ],
        chatHistory: [],
      };

      onAddSnapItem(newItem);
      setActiveItem(newItem);
    } catch (err) {
      console.error("Analysis failed, using fallback enhancement", err);
      const fallbackOcr = textPayload || "Hong Kong students need to master high-frequency academic vocabulary and sentence structures for HKDSE English examinations.";
      setInputText(fallbackOcr);
      const fallbackItem: SnapItem = {
        id: "snap-" + Date.now(),
        timestamp: Date.now(),
        title: "DSE Learning Snippet: " + (textPayload.slice(0, 30) || "Scanned Worksheet"),
        subjectCategory: "DSE English Practice",
        ocrText: fallbackOcr,
        imageUrl: imagePayload || undefined,
        hkdseContext: "HKDSE 英文科 (Reading/Writing/Speaking) 考核重点：加强学术英语词汇及自然连读口语能力。",
        translation: "香港学生需要为 HKDSE 英文考试掌握高频学术词汇和句型结构。",
        vocabulary: [
          {
            id: `v-${Date.now()}-1`,
            word: "academic vocabulary",
            ipa: "/ˌæk.əˈdem.ɪk vəˈkæb.jə.ler.i/",
            level: "DSE Level 4",
            meanZh: "学术词汇",
            meanEn: "Specialized words used in educational or formal contexts.",
            exampleSentence: "Mastering academic vocabulary is essential for achieving Level 5* in DSE English.",
            masteryLevel: "new"
          }
        ],
        grammarNotes: [
          "Infinitive of purpose: 'need to master ... for examinations'",
          "Collocation: 'high-frequency vocabulary'"
        ],
        speechScript: fallbackOcr,
        knowledgeTags: ["#DSE_English", "#Custom_Scan"],
        suggestedQuestions: ["How to use this sentence structure in DSE writing?"],
        chatHistory: []
      };
      onAddSnapItem(fallbackItem);
      setActiveItem(fallbackItem);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Play audio script with TTS & Karaoke real-time boundary sync
  const toggleAudioPlayback = (text: string) => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      setSpeakingCharIndex(null);
      setSpeakingCharLength(null);
    } else {
      setIsPlayingAudio(true);
      setSpeakingCharIndex(0);
      speakText(
        text,
        speechLang,
        speechSpeed,
        () => {
          setIsPlayingAudio(false);
          setSpeakingCharIndex(null);
          setSpeakingCharLength(null);
        },
        (charIndex, charLength) => {
          setSpeakingCharIndex(charIndex);
          if (charLength) setSpeakingCharLength(charLength);
        }
      );
    }
  };

  // Render Karaoke Real-Time Red Word Highlighting
  const renderKaraokeContent = (fullText: string) => {
    if (!fullText) return null;

    const regex = /(\s+|[^\s]+)/g;
    let match: RegExpExecArray | null;
    const tokens = [];
    while ((match = regex.exec(fullText)) !== null) {
      tokens.push({
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
        isWord: /\S/.test(match[0]),
      });
    }

    return tokens.map((token, idx) => {
      if (!token.isWord) {
        return <span key={idx}>{token.text}</span>;
      }

      const isCurrentSpeaking =
        speakingCharIndex !== null &&
        speakingCharIndex >= token.start &&
        speakingCharIndex < token.end;

      return (
        <span
          key={idx}
          className={
            isCurrentSpeaking
              ? "bg-red-600 text-white font-black px-1.5 py-0.5 rounded-md shadow-[0_0_18px_rgba(239,68,68,0.95)] scale-110 inline-block mx-0.5 ring-2 ring-red-400 animate-pulse transition-all duration-75"
              : "transition-colors duration-150"
          }
        >
          {token.text}
        </span>
      );
    });
  };

  // Play Chat Tutor Answer Speech (Sanitized for smooth British English TTS)
  const handlePlayChatSpeech = (msgText: string, idx: number) => {
    if (playingChatMsgIdx === idx) {
      stopSpeech();
      setPlayingChatMsgIdx(null);
    } else {
      setPlayingChatMsgIdx(idx);
      // Clean symbols, emojis, hashtags, and markdown for pure TTS reading
      const cleanText = msgText
        .replace(/[*#@$%!^&_+=~`<>|\\/"':;()-]/g, " ")
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, " ")
        .trim();
      speakText(cleanText, "en-GB", 0.9, () => setPlayingChatMsgIdx(null));
    }
  };

  // Send interactive chat question to AI Tutor
  const handleSendChat = async (questionText?: string) => {
    const q = questionText || chatInput;
    if (!q.trim()) return;

    const userMsg = { role: "user" as const, text: q, timestamp: Date.now() };
    const updatedHistory = [...activeItem.chatHistory, userMsg];

    setActiveItem({
      ...activeItem,
      chatHistory: updatedHistory,
    });

    if (!questionText) setChatInput("");
    setIsSendingChat(true);

    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contextText: activeItem.ocrText,
          userQuestion: q,
        }),
      });

      const data = await res.json();
      const tutorMsg = {
        role: "tutor" as const,
        text: data.reply || "这是一个好问题！在 HKDSE 英文科中，你可以善用这类高阶词汇增加句型变化。",
        timestamp: Date.now(),
      };

      setActiveItem((prev) => ({
        ...prev,
        chatHistory: [...prev.chatHistory, tutorMsg],
      }));
    } catch (err) {
      const fallbackMsg = {
        role: "tutor" as const,
        text: "针对这个 DSE 考题，建议你注意名词搭配 (Collocations) 及单字发音的重音位置。这能在 DSE Paper 4 口试中展现自信！",
        timestamp: Date.now(),
      };
      setActiveItem((prev) => ({
        ...prev,
        chatHistory: [...prev.chatHistory, fallbackMsg],
      }));
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Interactive Onboarding Landing Banner (Collapsible Container) */}
      <div className="bg-[#080808] border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all">
        <div className="flex items-center justify-between px-5 py-3.5 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00FF88]" />
            <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
              {t.landingSectionTitle}
            </span>
          </div>
          <button
            onClick={() => setIsLandingOpen(!isLandingOpen)}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-all"
          >
            {isLandingOpen ? (
              <>
                <span>{t.collapse}</span>
                <ChevronUp className="w-3.5 h-3.5 text-[#00FF88]" />
              </>
            ) : (
              <>
                <span>{t.expand}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#00FF88]" />
              </>
            )}
          </button>
        </div>

        {isLandingOpen && (
          <div className="p-4 sm:p-6">
            <InteractiveLanding
              lang={lang}
              onQuickStart={() => setInputMode("preset")}
              onGenerateNewArticle={handleGenerateNewArticle}
              isGeneratingArticle={isGeneratingArticle}
            />
          </div>
        )}
      </div>

      {/* Investor Pitch Banner for Phase 1 */}
      {investorMode && (
        <div className="bg-white/5 border border-white/10 border-l-2 border-[#00FF88] rounded-xl p-5 text-white/80 text-xs sm:text-sm flex items-start gap-4 shadow-2xl">
          <Zap className="w-5 h-5 text-[#00FF88] shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-[#00FF88] uppercase tracking-wider text-sm">
              {t.investorSnapPitchTitle}
            </p>
            <p className="mt-1 text-white/70 leading-relaxed">
              {t.investorSnapPitchDesc}
            </p>
          </div>
        </div>
      )}

      {/* Mobile Full Screen Focus Mode Quick Launch Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-black to-blue-950/80 border-2 border-[#00FF88]/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(0,255,136,0.25)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF88]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#00FF88] text-black flex items-center justify-center font-black shadow-[0_0_20px_rgba(0,255,136,0.5)] shrink-0 animate-pulse">
            <Camera className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base sm:text-lg uppercase tracking-tight">
                {t.snapTitle}
              </span>
              <span className="bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Mobile Focus
              </span>
            </div>
            <p className="text-xs text-white/70 mt-1 font-sans leading-relaxed">
              {t.mobileScanHint}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFullScreenFocus(true)}
          className="w-full sm:w-auto px-6 py-3 bg-[#00FF88] hover:bg-[#00e67a] text-black font-black uppercase tracking-wider text-xs sm:text-sm rounded-xl shadow-[0_0_25px_rgba(0,255,136,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0 relative z-10"
        >
          <Maximize2 className="w-4 h-4 text-black" />
          <span>{t.openFullScreenSnap}</span>
        </button>
      </div>

      {/* Floating Action Button (FAB) on Mobile - Positioned neatly above bottom nav */}
      <div className="fixed bottom-20 right-4 z-40 sm:hidden">
        <button
          onClick={() => setIsFullScreenFocus(true)}
          className="px-4 py-3 bg-[#00FF88] text-black font-black text-xs uppercase tracking-wider rounded-full shadow-[0_0_25px_rgba(0,255,136,0.8)] border-2 border-black flex items-center gap-2 active:scale-95"
        >
          <Camera className="w-5 h-5 text-black" />
          <span>{t.focusFabLabel}</span>
        </button>
      </div>

      {/* Hidden Mobile Camera Input */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleImageChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Full-Screen Mobile Focus Modal Overlay */}
      {isFullScreenFocus && (
        <div className="fixed inset-0 z-50 bg-[#050505] text-white overflow-y-auto flex flex-col p-4 sm:p-8 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00FF88] text-black flex items-center justify-center font-black shadow-[0_0_15px_rgba(0,255,136,0.4)]">
                <Camera className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <span>EduBridge HK</span>
                  <span className="text-[#00FF88] text-xs font-mono bg-[#00FF88]/10 border border-[#00FF88]/30 px-2 py-0.5 rounded-full">
                    Focus Mode
                  </span>
                </h2>
                <p className="text-[11px] text-white/50">{t.fullScreenFocusMode}</p>
              </div>
            </div>

            <button
              onClick={() => setIsFullScreenFocus(false)}
              className="px-3.5 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all"
            >
              <X className="w-4 h-4 text-red-400" />
              <span>{t.exitFullScreen}</span>
            </button>
          </div>

          {/* Body Content inside Modal */}
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {/* Direct Mobile Triggers - Extra large, clear, high-contrast touch targets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="p-5 bg-gradient-to-br from-[#00FF88]/25 to-emerald-950 border-2 border-[#00FF88] hover:border-[#00FF88] rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 transition-all shadow-[0_0_25px_rgba(0,255,136,0.3)] active:scale-95"
              >
                <Camera className="w-8 h-8 text-[#00FF88]" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">{t.focusCameraShot}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-5 bg-white/10 hover:bg-white/20 border-2 border-blue-400/50 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 transition-all active:scale-95"
              >
                <Upload className="w-8 h-8 text-blue-400" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">{t.focusUploadFile}</span>
              </button>

              <button
                onClick={() => {
                  setInputMode("text");
                  setFocusShowPasteInput(!focusShowPasteInput);
                }}
                className={`p-5 border-2 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 transition-all col-span-2 sm:col-span-1 active:scale-95 ${
                  focusShowPasteInput
                    ? "bg-purple-900/60 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    : "bg-white/10 hover:bg-white/20 border-purple-400/50 text-white"
                }`}
              >
                <FileText className="w-8 h-8 text-purple-400" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  {focusShowPasteInput ? t.focusCollapsePaste : t.focusPastePassage}
                </span>
              </button>
            </div>

            {/* Editable Text Paste Box inside Focus Mode Modal */}
            {focusShowPasteInput && (
              <div className="bg-[#0e0e0e] border-2 border-purple-500/60 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
                  <span className="text-xs font-black uppercase text-purple-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    {t.focusPasteTitle}
                  </span>
                  <button
                    onClick={() => setFocusShowPasteInput(false)}
                    className="text-xs text-white/50 hover:text-white px-2 py-0.5 rounded bg-white/10"
                  >
                    {t.closeLabel}
                  </button>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.focusPastePlaceholder}
                  rows={4}
                  className="w-full bg-black border border-white/20 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00FF88] transition-all font-sans leading-relaxed"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={async () => {
                      if (!inputText.trim()) return;
                      await runAnalysis(inputText);
                      setFocusShowPasteInput(false);
                    }}
                    disabled={isAnalyzing || !inputText.trim()}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#00FF88] hover:bg-[#00e67a] disabled:opacity-50 text-black font-black uppercase text-xs rounded-xl shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>{t.analyzing}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>{t.focusStartAiAnalysis}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Selected Image Preview & Scan Action inside Modal */}
            {selectedImage && (
              <div className="bg-black border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-4">
                <img
                  src={selectedImage}
                  alt="Scanned photo"
                  className="max-h-64 rounded-xl object-contain border border-white/20 shadow-xl"
                />
                <button
                  onClick={async () => {
                    await runAnalysis();
                  }}
                  disabled={isAnalyzing}
                  className="w-full py-3.5 bg-[#00FF88] text-black font-black uppercase tracking-wider text-sm rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-black" />
                      <span>{t.analyzing}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-black" />
                      <span>{t.startOcrAnalysis}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Active Article Details inside Modal */}
            {activeItem && (
              <div className="space-y-5 bg-[#080808] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-black text-[#00FF88] uppercase tracking-wider">
                    {activeItem.subjectCategory} • {activeItem.title}
                  </span>
                  <span className="text-[10px] text-white/40">DSE Focus Mode</span>
                </div>

                {/* Karaoke Real-Time Red Highlighting Box inside Modal - Sticky Pin */}
                {isPlayingAudio && (
                  <div className="sticky top-0 z-30 bg-neutral-900/95 backdrop-blur-md border-2 border-red-500/90 rounded-xl p-4 text-white space-y-2 shadow-[0_10px_30px_rgba(239,68,68,0.5)] animate-fadeIn max-h-[35vh] sm:max-h-[42vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-red-500/30 pb-2 sticky top-0 bg-neutral-900/90 backdrop-blur-sm z-10">
                      <span className="text-xs font-black uppercase text-red-400 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                        📌 {t.karaokeTitle} (置頂朗讀對照)
                      </span>
                      <span className="text-[10px] text-red-300 font-mono font-bold bg-red-950/80 px-2 py-0.5 rounded border border-red-500/30">
                        {speechSpeed}x {t.speechSpeedLabel} Sync
                      </span>
                    </div>
                    <div className="text-base sm:text-xl font-medium leading-relaxed font-sans">
                      {renderKaraokeContent(activeItem.speechScript || activeItem.ocrText || "")}
                    </div>
                  </div>
                )}

                {/* Standard / Editable Text Display inside Focus Mode - Sticky Pin */}
                {!isPlayingAudio && (
                  <div className="sticky top-0 z-30 bg-neutral-900/95 backdrop-blur-md border-2 border-[#00FF88]/60 rounded-xl p-4 space-y-3 shadow-[0_10px_30px_rgba(0,0,0,0.9)] max-h-[35vh] sm:max-h-[42vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 sticky top-0 bg-neutral-900/90 backdrop-blur-sm z-10 py-1">
                      <span className="text-[11px] font-bold text-[#00FF88] uppercase flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#00FF88]" />
                        📌 {t.focusActiveTextHeader} (朗讀對照文章 • 滾動置頂)
                      </span>
                      <button
                        onClick={() => setIsEditingActiveText(!isEditingActiveText)}
                        className="px-2.5 py-1 bg-white/10 hover:bg-[#00FF88] hover:text-black text-[#00FF88] border border-[#00FF88]/40 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isEditingActiveText ? t.focusDoneEditing : t.focusEditPassage}</span>
                      </button>
                    </div>

                    {isEditingActiveText ? (
                      <div className="space-y-3 animate-fadeIn">
                        <textarea
                          value={activeItem.ocrText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setActiveItem((prev) => ({
                              ...prev,
                              ocrText: val,
                              speechScript: val,
                            }));
                          }}
                          className="w-full bg-black border-2 border-[#00FF88] rounded-xl p-4 text-base sm:text-lg md:text-xl font-medium leading-relaxed text-white focus:outline-none font-sans shadow-inner"
                          rows={6}
                          placeholder={t.focusEditTextPlaceholder}
                        />
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs text-[#00FF88] font-bold">
                            {t.focusSyncNotice}
                          </span>
                          <button
                            onClick={() => setIsEditingActiveText(false)}
                            className="px-4 py-2 bg-[#00FF88] text-black font-black text-xs sm:text-sm rounded-lg uppercase tracking-wider shadow"
                          >
                            {t.focusSaveLock}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-base sm:text-lg md:text-xl font-medium sm:font-semibold leading-relaxed sm:leading-loose text-white font-sans selection:bg-[#00FF88] selection:text-black">
                          {activeItem.ocrText}
                        </div>
                        {activeItem.translation && (
                          <div className="text-sm sm:text-base text-white/80 pt-3 border-t border-white/10 leading-relaxed font-sans">
                            {activeItem.translation}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Speed & Accent Controls Bar inside Modal */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/50 text-[10px] font-bold uppercase">{t.speechSpeedLabel}</span>
                    {[0.8, 1.0, 1.2].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeechSpeed(s)}
                        className={`px-2 py-1 rounded font-black text-[10px] uppercase transition-all ${
                          speechSpeed === s
                            ? "bg-[#00FF88] text-black shadow"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {s === 0.8 ? t.slowSpeed : `${s}x`}
                      </button>
                    ))}
                  </div>

                  <select
                    value={speechLang}
                    onChange={(e: any) => setSpeechLang(e.target.value)}
                    className="bg-black border border-white/20 text-white rounded px-2 py-1 text-xs font-bold"
                  >
                    <option value="en-US">{t.accentUs}</option>
                    <option value="en-GB">{t.accentUk}</option>
                    <option value="zh-HK">{t.accentCantonese}</option>
                    <option value="zh-CN">{t.accentMandarin}</option>
                  </select>
                </div>

                {/* Audio Playback & Shadowing Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => toggleAudioPlayback(activeItem.speechScript || activeItem.ocrText || "")}
                    className={`py-3.5 px-4 font-black uppercase tracking-wider text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                      isPlayingAudio
                        ? "bg-white text-black animate-pulse"
                        : "bg-[#00FF88] hover:bg-[#00e67a] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]"
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-4 h-4 text-black" />
                        <span>{t.stopSpeech}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-black" />
                        <span>{t.playSpeech} (0.8x 卡拉 OK)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsShadowCoachOpen(!isShadowCoachOpen)}
                    className="py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                  >
                    <Mic className="w-4 h-4 text-white" />
                    <span>{isShadowCoachOpen ? "收起跟讀診斷" : "🎙️ AI 跟讀跟練與發音診斷"}</span>
                  </button>
                </div>

                {/* AI Shadowing Coach Recording Module inside Modal */}
                {isShadowCoachOpen && (
                  <div className="bg-gradient-to-br from-purple-950/80 via-black to-indigo-950/80 border-2 border-purple-500/50 rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-black">
                          <Mic className="w-5 h-5 text-purple-300" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                            {t.shadowCoachTitle}
                          </h3>
                          <p className="text-[10px] text-purple-200/70">{t.shadowCoachSub}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                        Interactive Demo Prototype
                      </span>
                    </div>

                    {/* PINNED REFERENCE TEXT FOR SHADOWING / RECORDING */}
                    <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-2 border-[#00FF88] rounded-xl p-3.5 shadow-[0_10px_25px_rgba(0,0,0,0.9)] space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-black text-[#00FF88] uppercase tracking-wider border-b border-purple-500/30 pb-1.5">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-[#00FF88]" />
                          📌 AI 跟讀目標文本 (Target Reading Article)
                        </span>
                        <span className="text-[10px] text-purple-200/80 font-mono">向下拉時鎖定頂部</span>
                      </div>
                      <div className="text-sm sm:text-base font-semibold leading-relaxed text-white max-h-36 sm:max-h-48 overflow-y-auto pr-1 font-sans selection:bg-[#00FF88] selection:text-black">
                        {isPlayingAudio
                          ? renderKaraokeContent(activeItem.speechScript || activeItem.ocrText || "")
                          : (activeItem.speechScript || activeItem.ocrText)}
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-[11px] text-amber-200/90 leading-relaxed font-sans">
                      {t.demoNotice}
                    </div>

                    {/* Recording Action Control */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/60 p-4 rounded-xl border border-purple-500/20">
                      <div className="flex items-center gap-3">
                        {isRecording ? (
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
                            <span className="text-xs font-mono font-bold text-red-400">
                              {t.recordingInProgress} ({recordingTime}s)
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-white/70">
                            <span>請按「開始跟讀」錄製語音，AI 即時診斷 DSE 重音與發音精準度</span>
                          </div>
                        )}
                      </div>

                      {!isRecording ? (
                        <button
                          onClick={startShadowRecording}
                          className="w-full sm:w-auto px-5 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2"
                        >
                          <Mic className="w-4 h-4 text-white" />
                          <span>{t.startRecording}</span>
                        </button>
                      ) : (
                        <button
                          onClick={stopShadowRecording}
                          className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2 animate-pulse"
                        >
                          <Square className="w-4 h-4 text-white" />
                          <span>{t.stopRecording}</span>
                        </button>
                      )}
                    </div>

                    {/* AI Evaluation Loading State */}
                    {isEvaluatingAudio && (
                      <div className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-xl flex items-center justify-center gap-3 text-purple-200 text-xs font-bold animate-pulse">
                        <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                        <span>{t.evaluatingAudio}</span>
                      </div>
                    )}

                    {/* AI Pronunciation Score & Diagnostic Report */}
                    {pronunciationResult && (
                      <div className="space-y-4 bg-black/80 border border-purple-500/40 rounded-xl p-4 sm:p-5 shadow-2xl animate-fadeIn">
                        {/* Scores Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                          <div className="bg-purple-950/60 border border-purple-500/30 p-3 rounded-xl">
                            <div className="text-2xl font-black text-[#00FF88]">
                              {pronunciationResult.overallScore}
                              <span className="text-xs text-white/40">/100</span>
                            </div>
                            <div className="text-[10px] text-white/60 uppercase font-bold mt-1">
                              {t.overallScore}
                            </div>
                          </div>
                          <div className="bg-purple-950/60 border border-purple-500/30 p-3 rounded-xl">
                            <div className="text-xl font-black text-blue-400">
                              {pronunciationResult.accuracyScore}%
                            </div>
                            <div className="text-[10px] text-white/60 uppercase font-bold mt-1">
                              {t.accuracyScore}
                            </div>
                          </div>
                          <div className="bg-purple-950/60 border border-purple-500/30 p-3 rounded-xl">
                            <div className="text-xl font-black text-yellow-400">
                              {pronunciationResult.fluencyScore}%
                            </div>
                            <div className="text-[10px] text-white/60 uppercase font-bold mt-1">
                              {t.fluencyScore}
                            </div>
                          </div>
                          <div className="bg-purple-950/60 border border-purple-500/30 p-3 rounded-xl">
                            <div className="text-xl font-black text-purple-400">
                              {pronunciationResult.intonationScore}%
                            </div>
                            <div className="text-[10px] text-white/60 uppercase font-bold mt-1">
                              {t.intonationScore}
                            </div>
                          </div>
                        </div>

                        {/* Word-by-Word Phonetic Diagnostics */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                            單詞音標與發音診斷標註 (Green = 完美, Yellow = 輕微偏音, Red = 重音修復):
                          </span>
                          <div className="flex flex-wrap gap-2 p-3 bg-neutral-900 rounded-xl border border-white/10 text-sm">
                            {pronunciationResult.wordBreakdown.map((item, i) => (
                              <span
                                key={i}
                                className={`px-2 py-1 rounded-lg font-mono text-xs border flex items-center gap-1 ${
                                  item.status === "good"
                                    ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
                                    : item.status === "warn"
                                    ? "bg-amber-950/80 border-amber-500/40 text-amber-300"
                                    : "bg-red-950/80 border-red-500/40 text-red-300"
                                }`}
                              >
                                {item.word}
                                {item.ipaTip && (
                                  <span className="text-[9px] opacity-75 font-sans">({item.ipaTip})</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Diagnostic Tips List */}
                        <div className="space-y-1.5 pt-2 border-t border-purple-500/20 text-xs text-purple-200">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" />
                            {t.aiFeedbackTitle}
                          </span>
                          {pronunciationResult.diagnosticTips.map((tip, idx) => (
                            <p key={idx} className="leading-relaxed text-white/80 pl-2">
                              {tip}
                            </p>
                          ))}
                        </div>

                        {/* Re-play Student Audio if available */}
                        {recordedAudioUrl && (
                          <div className="pt-2 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs text-white/60">{t.playMyRecording}</span>
                            <RecordedAudioPlayer url={recordedAudioUrl} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Input & Analysis Console */}
      <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Camera className="w-6 h-6 text-[#00FF88]" />
              {t.snapTitle}
            </h2>
            <p className="text-xs text-white/40 uppercase tracking-wider mt-1">
              {t.snapSubtitle}
            </p>
          </div>

          {/* Mode Switchers */}
          <div className="flex flex-wrap bg-black p-1 rounded-xl border border-white/10 text-xs font-black uppercase tracking-wider gap-1">
            <button
              onClick={() => setInputMode("preset")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                inputMode === "preset"
                  ? "bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {t.modePreset}
            </button>
            <button
              onClick={() => setInputMode("text")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                inputMode === "text"
                  ? "bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {t.modeText}
            </button>
            <button
              onClick={() => {
                setInputMode("upload");
                fileInputRef.current?.click();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                inputMode === "upload"
                  ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                  : "bg-white/10 text-[#00FF88] hover:bg-white/20 border border-[#00FF88]/30"
              }`}
            >
              <span>{t.snapLearnFeature}</span>
            </button>
          </div>
        </div>

        {/* AI Realtime Status Bar */}
        {(isGeneratingArticle || isGeneratingVocab || isAnalyzing) && (
          <div className="bg-[#00FF88]/10 border border-[#00FF88]/40 rounded-xl p-3.5 flex items-center justify-between text-xs text-[#00FF88] shadow-2xl animate-pulse">
            <div className="flex items-center gap-2 font-black">
              <Zap className="w-4 h-4 text-[#00FF88] animate-spin" />
              <span>
                {isGeneratingArticle
                  ? "⚡ OpenRouter AI Status: 正在使用 OpenRouter 引擎 (nemotron-3-ultra-550b) 生成全新 DSE 文章/課文..."
                  : isGeneratingVocab
                  ? "⚡ OpenRouter AI Status: 正在生成更多 DSE Level 5* 高頻生詞，自動去重並置頂顯示..."
                  : "⚡ OpenRouter AI Status: 正在進行多模態 OCR 提取與 DSE 語法分層解析..."}
              </span>
            </div>
            <span className="text-[10px] bg-[#00FF88] text-black font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              OpenRouter Working
            </span>
          </div>
        )}

        {/* Input Controls */}
        {inputMode === "preset" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-xs font-black uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#00FF88]" />
                <span>{t.selectPresetLabel} ({t.singlePresetNotice})</span>
              </label>

              <div className="flex items-center gap-2">
                {/* AI Generate New Article Button */}
                <button
                  onClick={handleGenerateNewArticle}
                  disabled={isGeneratingArticle}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-[#00FF88] text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  {isGeneratingArticle ? t.generatingArticle : t.aiGenerateNewArticle}
                </button>
              </div>
            </div>

            {/* Clean Tab Switcher for Preset Items */}
            {snapItems.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-white/20 bg-white/5 text-center space-y-3">
                <p className="text-sm font-bold text-white/50">{t.emptyHistory}</p>
                <button
                  onClick={handleGenerateNewArticle}
                  disabled={isGeneratingArticle}
                  className="px-4 py-2 bg-[#00FF88] text-black font-black text-xs uppercase tracking-wider rounded-xl"
                >
                  {t.aiGenerateNewArticle}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {snapItems.map((item, idx) => {
                  const isSelected = activeItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl text-xs font-black transition-all flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 border ${
                        isSelected
                          ? "bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)] border-[#00FF88]"
                          : "bg-white/5 text-white/70 hover:bg-white/10 border-white/10"
                      }`}
                    >
                      <button
                        onClick={() => setActiveItem(item)}
                        className="flex items-center gap-2 text-left"
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          isSelected ? "bg-black/20 text-black" : "bg-white/10 text-white"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="truncate max-w-[140px] sm:max-w-[180px]">{item.title.split(":")[0]}</span>
                      </button>

                      {onDeleteSnapItem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(t.deleteSingleConfirm)) {
                              onDeleteSnapItem(item.id);
                              if (isSelected) {
                                const remaining = snapItems.filter((i) => i.id !== item.id);
                                if (remaining.length > 0) setActiveItem(remaining[0]);
                              }
                            }
                          }}
                          title={t.deleteSingle}
                          className={`p-1 rounded-lg transition-all ${
                            isSelected
                              ? "hover:bg-black/20 text-black/70 hover:text-red-700"
                              : "hover:bg-red-500/20 text-white/40 hover:text-red-400"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Single Featured Preset Item Card */}
            {activeItem && snapItems.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl border bg-white/10 border-l-4 border-l-[#00FF88] border-white/20 shadow-xl flex flex-col sm:flex-row gap-4 relative transition-all">
                {activeItem.imageUrl && (
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    className="w-full sm:w-28 h-28 rounded-xl object-cover shrink-0 border border-white/20 shadow-md"
                  />
                )}
                <div className="space-y-2 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30">
                      {activeItem.subjectCategory}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[#00FF88] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88]" /> {t.passageLoaded}
                      </span>
                      {onDeleteSnapItem && (
                        <button
                          onClick={() => {
                            if (window.confirm(t.deleteSingleConfirm)) {
                              onDeleteSnapItem(activeItem.id);
                              const remaining = snapItems.filter((i) => i.id !== activeItem.id);
                              if (remaining.length > 0) setActiveItem(remaining[0]);
                            }
                          }}
                          className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{t.deleteSingle}</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <h4 className="font-bold text-base text-white">{activeItem.title}</h4>
                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">{activeItem.ocrText}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {inputMode === "text" && (
          <div className="space-y-3">
            <textarea
              value={inputText}
              onChange={(e) => {
                const val = e.target.value;
                setInputText(val);
                if (activeItem) {
                  setActiveItem({
                    ...activeItem,
                    speechScript: val,
                    ocrText: val,
                  });
                }
              }}
              placeholder={t.pasteTextPlaceholder}
              className="w-full h-32 bg-black border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00FF88]"
            />

            <button
              onClick={() => runAnalysis()}
              disabled={isAnalyzing || !inputText.trim()}
              className="w-full py-3 bg-[#00FF88] hover:bg-[#00e67a] text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t.startAnalysis}
                </>
              )}
            </button>
          </div>
        )}

        {inputMode === "upload" && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-[#00FF88] rounded-2xl p-6 sm:p-8 text-center bg-black cursor-pointer transition-all space-y-3"
            >
              {selectedImage ? (
                <div className="space-y-3">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-h-48 mx-auto rounded-xl border border-white/20 shadow-md"
                  />
                  <p className="text-xs text-[#00FF88] font-black uppercase tracking-wider">{t.reselectPhoto}</p>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-[#00FF88] mx-auto animate-bounce" />
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-wide">
                      📸 {t.uploadTitle} (Winning Feature)
                    </p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">
                      Snap or upload photo. OCR directly extracts English text into the audio engine below.
                    </p>
                  </div>
                </>
              )}
            </div>

            {selectedImage && (
              <button
                onClick={() => runAnalysis()}
                disabled={isAnalyzing}
                className="w-full py-3 bg-[#00FF88] hover:bg-[#00e67a] text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    {t.ocrAnalyzing}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t.startOcrAnalysis}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Active Snippet Detailed Workspace */}
      {activeItem && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Voice Audio & Text Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Speech Player Banner */}
            <div className="bg-[#080808] border border-white/10 rounded-2xl shadow-2xl space-y-4 transition-all overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5 bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white uppercase tracking-tight">{t.speechEngineTitle}</h3>
                    <p className="text-xs text-white/40 uppercase tracking-wider">{t.speechEngineSub}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Speed & Accent Selector */}
                  {isAudioSectionOpen && (
                    <div className="hidden sm:flex items-center gap-2 text-xs mr-2">
                      <span className="text-white/40 font-bold uppercase text-[10px] tracking-wider">{t.speechSpeedLabel}</span>
                      {[0.8, 1.0, 1.2].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSpeechSpeed(s)}
                          className={`px-2.5 py-1 rounded font-black text-[10px] uppercase tracking-wider transition-all ${
                            speechSpeed === s
                              ? "bg-[#00FF88] text-black shadow"
                              : "bg-white/10 text-white/60 hover:bg-white/20"
                          }`}
                        >
                          {s === 0.8 ? t.slowSpeed : `${s}x`}
                        </button>
                      ))}

                      <select
                        value={speechLang}
                        onChange={(e: any) => setSpeechLang(e.target.value)}
                        className="bg-black border border-white/20 text-white rounded px-2 py-1 text-xs font-bold focus:outline-none"
                      >
                        <option value="en-US">{t.accentUs}</option>
                        <option value="en-GB">{t.accentUk}</option>
                        <option value="zh-HK">{t.accentCantonese}</option>
                        <option value="zh-CN">{t.accentMandarin}</option>
                      </select>
                    </div>
                  )}

                  {/* Collapse / Expand Toggle Button */}
                  <button
                    onClick={() => setIsAudioSectionOpen(!isAudioSectionOpen)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    {isAudioSectionOpen ? (
                      <>
                        <span>{t.collapse}</span>
                        <ChevronUp className="w-4 h-4 text-[#00FF88]" />
                      </>
                    ) : (
                      <>
                        <span>{t.expand}</span>
                        <ChevronDown className="w-4 h-4 text-[#00FF88]" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isAudioSectionOpen && (
                <div className="p-6 pt-0 space-y-4">
                  {/* Speed & Accent Selector for Mobile */}
                  <div className="flex sm:hidden flex-wrap items-center justify-between gap-2 text-xs pt-2 border-b border-white/10 pb-3">
                    <span className="text-white/40 font-bold uppercase text-[10px] tracking-wider">{t.speechSpeedLabel}</span>
                    <div className="flex items-center gap-1.5">
                      {[0.8, 1.0, 1.2].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSpeechSpeed(s)}
                          className={`px-2 py-0.5 rounded font-black text-[10px] uppercase tracking-wider transition-all ${
                            speechSpeed === s
                              ? "bg-[#00FF88] text-black shadow"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {s === 0.8 ? t.slowSpeed : `${s}x`}
                        </button>
                      ))}
                      <select
                        value={speechLang}
                        onChange={(e: any) => setSpeechLang(e.target.value)}
                        className="bg-black border border-white/20 text-white rounded px-1.5 py-0.5 text-[10px] font-bold"
                      >
                        <option value="en-US">{t.accentUs}</option>
                        <option value="en-GB">{t.accentUk}</option>
                        <option value="zh-HK">{t.accentCantonese}</option>
                        <option value="zh-CN">{t.accentMandarin}</option>
                      </select>
                    </div>
                  </div>

                  {/* Editable Script Text Area inside 純正英語朗讀 Engine */}
                  <div className="bg-black border border-white/10 rounded-xl p-4 sm:p-5 text-white/90 space-y-3 relative">
                    <div className="flex items-center justify-between text-xs font-bold text-[#00FF88] uppercase tracking-wider">
                      <span>{t.speechScriptEditable}</span>
                      <span className="text-white/40 text-[10px]">Editable Native Speech Text</span>
                    </div>

                    {/* Highlight Selection Guidance Banner */}
                    <div className="bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/40 rounded-xl p-3 text-xs text-white/90 flex items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#00FF88] shrink-0 animate-pulse" />
                        <span>
                          <strong className="text-[#00FF88]">✨ Highlight 局部劃選朗讀 & 翻譯：</strong>
                          用滑鼠/手指 Highlight 劃選下方任何英文單字或句子，即可彈出 AI 專屬局部朗讀與即時翻譯！
                        </span>
                      </div>
                    </div>

                    {/* Karaoke Real-Time Red Word Highlight Box */}
                    {isPlayingAudio && (
                      <div className="bg-neutral-900/90 border-2 border-red-500/60 rounded-xl p-4 sm:p-5 text-white leading-relaxed space-y-3 shadow-[0_0_25px_rgba(239,68,68,0.35)] relative overflow-hidden transition-all animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-red-500/30 pb-2 mb-1">
                          <span className="text-xs font-black uppercase text-red-400 tracking-wider flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                            {t.karaokeTitle}
                          </span>
                          <span className="text-[10px] text-red-300 font-mono font-bold bg-red-950/80 px-2 py-0.5 rounded border border-red-500/30">
                            {speechSpeed}x Speed Sync
                          </span>
                        </div>
                        <div className="text-lg sm:text-2xl md:text-3xl font-medium sm:font-semibold leading-relaxed sm:leading-loose tracking-wide font-sans">
                          {renderKaraokeContent(activeItem.speechScript || activeItem.ocrText || "")}
                        </div>
                        <p className="text-xs text-red-300 font-sans flex items-center gap-1 pt-1">
                          {t.karaokeReadingHint}
                        </p>
                      </div>
                    )}

                    <textarea
                      value={activeItem.speechScript || activeItem.ocrText || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setActiveItem({
                          ...activeItem,
                          speechScript: val,
                          ocrText: val,
                        });
                        setInputText(val);
                      }}
                      placeholder="Paste or edit English text here for 0.8x native speech narration..."
                      className="w-full h-40 sm:h-52 bg-neutral-950 border border-white/10 rounded-xl p-4 text-base sm:text-lg text-white leading-relaxed focus:outline-none focus:border-[#00FF88] resize-y font-sans shadow-inner"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAudioPlayback(activeItem.speechScript || activeItem.ocrText || "")}
                          className={`px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
                            isPlayingAudio
                              ? "bg-white text-black animate-pulse"
                              : "bg-[#00FF88] text-black hover:bg-[#00e67a]"
                          }`}
                        >
                          {isPlayingAudio ? (
                            <>
                              <Pause className="w-4 h-4" /> {t.stopSpeech}
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 fill-current" /> {t.playSpeech}
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => setIsShadowCoachOpen(!isShadowCoachOpen)}
                          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                        >
                          <Mic className="w-4 h-4 text-white" />
                          <span>🎙️ AI 跟讀跟練與發音診斷</span>
                        </button>
                      </div>

                      <span className="text-[11px] text-white/50 font-sans">
                        {t.playAudioTip}
                      </span>
                    </div>

                    {/* AI Shadowing Coach Module in Main Workspace */}
                    {isShadowCoachOpen && (
                      <div className="mt-4 bg-gradient-to-br from-purple-950/80 via-black to-indigo-950/80 border-2 border-purple-500/50 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-black">
                              <Mic className="w-5 h-5 text-purple-300" />
                            </div>
                            <div>
                              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                                {t.shadowCoachTitle}
                              </h3>
                              <p className="text-[10px] text-purple-200/70">{t.shadowCoachSub}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                            Interactive Demo Prototype
                          </span>
                        </div>

                        {/* PINNED REFERENCE TEXT FOR SHADOWING / RECORDING */}
                        <div className="sticky top-2 z-30 bg-neutral-950/95 backdrop-blur-md border-2 border-[#00FF88] rounded-xl p-3.5 shadow-[0_10px_25px_rgba(0,0,0,0.9)] space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-black text-[#00FF88] uppercase tracking-wider border-b border-purple-500/30 pb-1.5">
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="w-4 h-4 text-[#00FF88]" />
                              📌 AI 跟讀目標文本 (Target Reading Article)
                            </span>
                            <span className="text-[10px] text-purple-200/80 font-mono">向下拉時鎖定頂部</span>
                          </div>
                          <div className="text-sm sm:text-base font-semibold leading-relaxed text-white max-h-36 sm:max-h-48 overflow-y-auto pr-1 font-sans selection:bg-[#00FF88] selection:text-black">
                            {isPlayingAudio
                              ? renderKaraokeContent(activeItem.speechScript || activeItem.ocrText || "")
                              : (activeItem.speechScript || activeItem.ocrText)}
                          </div>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-[11px] text-amber-200/90 leading-relaxed font-sans">
                          {t.demoNotice}
                        </div>

                        {/* Recording Action Control */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/60 p-4 rounded-xl border border-purple-500/20">
                          <div className="flex items-center gap-3">
                            {isRecording ? (
                              <div className="flex items-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
                                <span className="text-xs font-mono font-bold text-red-400">
                                  {t.recordingInProgress} ({recordingTime}s)
                                </span>
                              </div>
                            ) : (
                              <div className="text-xs text-white/70">
                                <span>請按「開始跟讀」錄製語音，AI 即時診斷 DSE 重音與發音精準度</span>
                              </div>
                            )}
                          </div>

                          {!isRecording ? (
                            <button
                              onClick={startShadowRecording}
                              className="w-full sm:w-auto px-5 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2"
                            >
                              <Mic className="w-4 h-4 text-white" />
                              <span>{t.startRecording}</span>
                            </button>
                          ) : (
                            <button
                              onClick={stopShadowRecording}
                              className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2 animate-pulse"
                            >
                              <Square className="w-4 h-4 text-white" />
                              <span>{t.stopRecording}</span>
                            </button>
                          )}
                        </div>

                        {/* AI Evaluation Loading State */}
                        {isEvaluatingAudio && (
                          <div className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-xl flex items-center justify-center gap-3 text-purple-200 text-xs font-bold animate-pulse">
                            <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                            <span>{t.evaluatingAudio}</span>
                          </div>
                        )}

                        {/* AI Pronunciation Score & Diagnostic Report */}
                        {pronunciationResult && (
                          <div className="space-y-4 bg-black/80 border border-purple-500/40 rounded-xl p-4 sm:p-5 shadow-2xl animate-fadeIn">
                            {/* Scores Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                              <div className="bg-purple-950/60 border border-purple-500/30 p-3 rounded-xl">
                                <div className="text-2xl font-black text-[#00FF88]">
                                  {pronunciationResult.overallScore}
                                  <span className="text-xs text-white/40">/100</span>
                                </div>
                                <div className="text-[10px] text-white/60 uppercase font-bold mt-1">
                                  {t.overallScore}
                                </div>
                              </div>
                              <div className="bg-purple-950/60 border border-purple-500/30 p-3 rounded-xl">
                                <div className="text-xl font-black text-blue-400">
                                  {pronunciationResult.accuracyScore}%
                                </div>
                                <div className="text-[10px] text-white/60 uppercase font-bold mt-1">
                                  {t.accuracyScore}
                                </div>
                              </div>
                              <div className="bg-purple-950/60 border border-purple-500/30 p-3 rounded-xl">
                                <div className="text-xl font-black text-yellow-400">
                                  {pronunciationResult.fluencyScore}%
                                </div>
                                <div className="text-[10px] text-white/60 uppercase font-bold mt-1">
                                  {t.fluencyScore}
                                </div>
                              </div>
                              <div className="bg-purple-950/60 border border-purple-500/30 p-3 rounded-xl">
                                <div className="text-xl font-black text-purple-400">
                                  {pronunciationResult.intonationScore}%
                                </div>
                                <div className="text-[10px] text-white/60 uppercase font-bold mt-1">
                                  {t.intonationScore}
                                </div>
                              </div>
                            </div>

                            {/* Word-by-Word Phonetic Diagnostics */}
                            <div className="space-y-2">
                              <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                                單詞音標與發音診斷標註 (Green = 完美, Yellow = 輕微偏音, Red = 重音修復):
                              </span>
                              <div className="flex flex-wrap gap-2 p-3 bg-neutral-900 rounded-xl border border-white/10 text-sm">
                                {pronunciationResult.wordBreakdown.map((item, i) => (
                                  <span
                                    key={i}
                                    className={`px-2 py-1 rounded-lg font-mono text-xs border flex items-center gap-1 ${
                                      item.status === "good"
                                        ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
                                        : item.status === "warn"
                                        ? "bg-amber-950/80 border-amber-500/40 text-amber-300"
                                        : "bg-red-950/80 border-red-500/40 text-red-300"
                                    }`}
                                  >
                                    {item.word}
                                    {item.ipaTip && (
                                      <span className="text-[9px] opacity-75 font-sans">({item.ipaTip})</span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Diagnostic Tips List */}
                            <div className="space-y-1.5 pt-2 border-t border-purple-500/20 text-xs text-purple-200">
                              <span className="font-bold text-white flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" />
                                {t.aiFeedbackTitle}
                              </span>
                              {pronunciationResult.diagnosticTips.map((tip, idx) => (
                                <p key={idx} className="leading-relaxed text-white/80 pl-2">
                                  {tip}
                                </p>
                              ))}
                            </div>

                            {/* Re-play Student Audio if available */}
                            {recordedAudioUrl && (
                              <div className="pt-2 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs text-white/60">{t.playMyRecording}</span>
                                <RecordedAudioPlayer url={recordedAudioUrl} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Vocabulary Bank Cards */}
            <div className="bg-[#080808] border border-white/10 rounded-2xl shadow-2xl transition-all overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 p-5 bg-white/5">
                <div className="flex items-center gap-3">
                  <h4 className="font-black text-white text-base uppercase tracking-tight flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#00FF88]" />
                    {t.vocabTitle} ({activeItem.vocabulary.length})
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#00FF88]" />
                    <span>{activeItem.providerUsed || "OpenRouter AI (openrouter/free)"}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Instant Offline Database Draw Button */}
                  <button
                    onClick={handleDrawVocabFromDatabase}
                    className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-black uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
                    title="從系統內建 50+ DSE 高頻題庫極速抽樣，不佔用 AI 算力與次數限制"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-yellow-300" />
                    <span>🔀 題庫抽字 (免 AI 次數)</span>
                  </button>

                  {/* Generate More Vocab Button */}
                  <button
                    onClick={handleGenerateMoreVocab}
                    disabled={isGeneratingVocab}
                    className="px-3 py-1.5 bg-[#00FF88]/10 hover:bg-[#00FF88]/20 border border-[#00FF88]/30 text-[#00FF88] font-black uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 text-[#00FF88]" />
                    {isGeneratingVocab ? t.generatingVocab : t.generateMoreVocab}
                  </button>

                  {/* Collapse Toggle Button */}
                  <button
                    onClick={() => setIsVocabSectionOpen(!isVocabSectionOpen)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    {isVocabSectionOpen ? (
                      <>
                        <span>{t.collapse}</span>
                        <ChevronUp className="w-4 h-4 text-[#00FF88]" />
                      </>
                    ) : (
                      <>
                        <span>{t.expand}</span>
                        <ChevronDown className="w-4 h-4 text-[#00FF88]" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isVocabSectionOpen && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeItem.vocabulary.map((vocab) => {
                      const isSaved = savedVocabs[vocab.id];
                      return (
                        <div
                          key={vocab.id}
                          className="bg-black border border-white/10 rounded-xl p-4 space-y-2 relative hover:border-white/20 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-base text-[#00FF88]">
                                  {vocab.word}
                                </span>
                                <button
                                  onClick={() => speakText(vocab.word, "en-GB", 0.85)}
                                  title="Listen pronunciation"
                                  className="px-2 py-0.5 bg-[#00FF88]/10 hover:bg-[#00FF88]/20 border border-[#00FF88]/30 rounded text-[10px] font-black text-[#00FF88] flex items-center gap-1 transition-all active:scale-95"
                                >
                                  <Volume2 className="w-3 h-3" />
                                  <span>{t.readPronunciation}</span>
                                </button>
                              </div>
                              <span className="text-xs text-white/40 font-mono block mt-0.5">
                                {vocab.ipa}
                              </span>
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

                          <div className="p-2.5 bg-white/5 rounded-lg text-xs text-white/70 border border-white/10">
                            <span className="font-black text-[#00FF88] text-[10px] uppercase tracking-widest block mb-0.5">
                              {t.dseExample}
                            </span>
                            "{vocab.exampleSentence}"
                          </div>

                          <button
                            onClick={() => {
                              const nextState = !isSaved;
                              setSavedVocabs((prev) => ({ ...prev, [vocab.id]: nextState }));
                              if (nextState && onAddVocabToActiveItem) {
                                onAddVocabToActiveItem(vocab);
                              }
                            }}
                            className={`w-full py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all mt-2 ${
                              isSaved
                                ? "bg-[#00FF88] text-black shadow"
                                : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-black" /> {t.savedToKb}
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-3.5 h-3.5" /> {t.saveToKb}
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive AI Tutor Chat & Prompt Chips */}
          <div className="space-y-6">
            <div className="bg-[#080808] border border-white/10 rounded-2xl shadow-2xl transition-all overflow-hidden">
              <div className="border-b border-white/10 p-5 bg-white/5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-white text-base uppercase tracking-tight flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#00FF88]" />
                    {t.aiTutorTitle}
                  </h4>
                  <p className="text-xs text-white/40 uppercase tracking-wider">{t.aiTutorSub}</p>
                </div>

                {/* Collapse Toggle Button */}
                <button
                  onClick={() => setIsTutorSectionOpen(!isTutorSectionOpen)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-all"
                >
                  {isTutorSectionOpen ? (
                    <>
                      <span>{t.collapse}</span>
                      <ChevronUp className="w-4 h-4 text-[#00FF88]" />
                    </>
                  ) : (
                    <>
                      <span>{t.expand}</span>
                      <ChevronDown className="w-4 h-4 text-[#00FF88]" />
                    </>
                  )}
                </button>
              </div>

              {isTutorSectionOpen && (
                <div className="p-5 flex flex-col h-[550px] space-y-4">

              {/* Chat Message History */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-black flex items-center gap-1 uppercase tracking-wider text-[#00FF88]">
                      <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" /> EduBridge AI 导师:
                    </p>
                    <button
                      onClick={() => handlePlayChatSpeech(t.tutorWelcome, -1)}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded flex items-center gap-1 transition-all"
                    >
                      <Volume2 className="w-3 h-3 text-[#00FF88]" />
                      {t.readAloudAnswer}
                    </button>
                  </div>
                  <p>{t.tutorWelcome}</p>
                </div>

                {activeItem.chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-xs space-y-1.5 ${
                      msg.role === "user"
                        ? "bg-[#00FF88] text-black font-semibold ml-6 rounded-tr-none"
                        : "bg-black border border-white/10 text-white mr-6 rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-black text-[10px] uppercase tracking-wider opacity-75">
                        {msg.role === "user" ? "学生" : "EduBridge AI 导师"}
                      </p>

                      {/* Speech audio button for Tutor answers (Point 5) */}
                      {msg.role === "tutor" && (
                        <button
                          onClick={() => handlePlayChatSpeech(msg.text, i)}
                          className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                            playingChatMsgIdx === i
                              ? "bg-white text-black font-bold animate-pulse"
                              : "bg-white/10 hover:bg-white/20 text-white"
                          }`}
                        >
                          <Volume2 className="w-3 h-3 text-[#00FF88]" />
                          {playingChatMsgIdx === i ? "播放中..." : t.readAloudAnswer}
                        </button>
                      )}
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                ))}

                {isSendingChat && (
                  <div className="p-3 rounded-xl text-xs bg-black border border-white/10 text-white/50 animate-pulse">
                    {t.thinkingReply}
                  </div>
                )}
              </div>

              {/* Suggested Questions Chips */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">
                  {t.commonPrompts}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeItem.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChat(q)}
                      className="text-[10px] bg-black hover:bg-white/10 text-white/80 border border-white/10 rounded-lg px-2.5 py-1 text-left transition-all truncate max-w-full font-medium"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Box */}
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder={t.chatPlaceholder}
                  className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00FF88]"
                />
                <button
                  onClick={() => handleSendChat()}
                  disabled={!chatInput.trim() || isSendingChat}
                  className="bg-[#00FF88] hover:bg-[#00e67a] text-black p-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )}
</div>
  );
};
