import { SnapItem, GroupDiscussionSession, SubscriptionPlan } from "../types";

export const SAMPLE_SNAP_ITEMS: SnapItem[] = [
  {
    id: "snap-1",
    timestamp: Date.now() - 3600000 * 24,
    title: "DSE English Paper 1: Sustainable HK Urban Planning",
    subjectCategory: "DSE English Reading & Vocabulary",
    imageUrl: "https://images.unsplash.com/photo-1506158669146-619067262a00?auto=format&fit=crop&w=800&q=80",
    ocrText: "Hong Kong's rapid urban expansion necessitates an integration of vertical greening, smart transit infrastructure, and resilient climate mitigation strategies to foster sustainable community living.",
    hkdseContext: "HKDSE 英文科卷一 (Reading) 及卷二 (Writing) 經常出現「綠化城市」及「智能科技」考題。此句涵蓋 5* 級別高階地道學術詞彙。",
    translation: "香港急速的城市擴張，必須融合垂直綠化、智慧交通基礎設施及具彈性的氣候緩減策略，以促進可持續的社區生活。",
    cantoneseGuide: "口語強調：「vertical greening」喺香港建築好常見，例如太古坊同西九文化區嘅綠化樓宇樓層。",
    vocabulary: [
      {
        id: "v1",
        word: "necessitates",
        ipa: "/nəˈses.ə.teɪts/",
        level: "DSE Level 5*",
        meanZh: "迫使；使成為必要",
        meanCn: "迫使；使成为必要",
        meanEn: "To make something necessary or indispensable.",
        exampleSentence: "The severe weather condition necessitates the immediate suspension of outdoor activities in HK schools.",
        masteryLevel: "review",
      },
      {
        id: "v2",
        word: "mitigation strategies",
        ipa: "/ˌmɪt.ɪˈɡeɪ.ʃən stræt.ə.dʒiz/",
        level: "DSE Level 5**",
        meanZh: "緩減／減輕策略",
        meanCn: "缓减／减轻策略",
        meanEn: "Action plans designed to reduce the severity or impact of problems.",
        exampleSentence: "Hong Kong Observatory recommended proactive mitigation strategies against typhoon storm surges.",
        masteryLevel: "new",
      },
      {
        id: "v3",
        word: "resilient",
        ipa: "/rɪˈzɪl.jənt/",
        level: "DSE Level 4",
        meanZh: "具適應力及復原力的",
        meanCn: "具适应力及复原力的",
        meanEn: "Able to withstand or recover quickly from difficult conditions.",
        exampleSentence: "DSE candidates need to stay resilient when facing intense mock examination pressure.",
        masteryLevel: "mastered",
      }
    ],
    grammarNotes: [
      "Inversion / Complex Subject: 'Hong Kong's rapid expansion' (Noun Phrase) + 'necessitates' (Transitive Verb) + Clause",
      "Collocation Match: 'foster sustainable community living' (foster + noun phrase)"
    ],
    speechScript: "Hong Kong's rapid urban expansion necessitates an integration of vertical greening, smart transit infrastructure, and resilient climate mitigation strategies to foster sustainable community living.",
    knowledgeTags: ["#DSE_English", "#Urban_Planning", "#Vocab_Level_5_Plus", "#HK_Ecology"],
    suggestedQuestions: [
      "How do I use 'necessitates' in my DSE Paper 2 opinion essay?",
      "Can you give me 3 alternative synonyms for 'resilient'?",
      "How to pronounce 'mitigation' with correct syllable stress?"
    ],
    chatHistory: [
      {
        role: "user",
        text: "請問呢句喺 DSE Writing 第一段點用好？",
        timestamp: Date.now() - 3600000 * 23,
      },
      {
        role: "tutor",
        text: "你可以將佢改寫成 essay 嘅 Hook Sentence（引言句）：'In a high-density metropolis like Hong Kong, rapid modern development necessitates innovative environmental solutions.' 咁樣考官一睇就知道你用詞極具 DSE Level 5* 水準！",
        timestamp: Date.now() - 3600000 * 22,
      }
    ]
  },
  {
    id: "snap-2",
    timestamp: Date.now() - 3600000 * 48,
    title: "HK Campus Notice: Form 4 STEM Innovation Fair",
    subjectCategory: "School Notices & Local Adaptation",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    ocrText: "Attention all S4 to S6 students: Registration for the Inter-school STEM Robotics Competition is now open. Participants are required to submit an executive summary and a 2-minute video pitch by next Friday.",
    hkdseContext: "香港中學（S1-S6）通告常見英文詞彙。新移民學生需要適應「Inter-school」（校際）、「Executive summary」（執行摘要）及「Pitch」（簡報/推廣）等香港學校常見用語。",
    translation: "各位中四至中六學生請注意：校際 STEM 機器人比賽現已接受報名。參賽者須於下週五前提交執行摘要及 2 分鐘的影片簡報。",
    cantoneseGuide: "廣東話學校習慣：香港中學將「高中一、二、三」稱為「S4, S5, S6」(Senior Secondary 4-6)。「Pitch」喺香港職場同學校都直接叫 Pitch。",
    vocabulary: [
      {
        id: "v4",
        word: "Executive summary",
        ipa: "/ɪɡˈzek.jə.tɪv ˈsʌm.ər.i/",
        level: "DSE Level 4",
        meanZh: "執行摘要 / 概要",
        meanCn: "执行摘要 / 概要",
        meanEn: "A short document or section that summarizes a longer report or proposal.",
        exampleSentence: "Before presenting to the judges, prepare a concise executive summary highlighting your key innovation.",
        masteryLevel: "review",
      },
      {
        id: "v5",
        word: "Video pitch",
        ipa: "/ˈvɪd.i.oʊ pɪtʃ/",
        level: "DSE Level 3",
        meanZh: "影片簡報推介",
        meanCn: "影片简报推介",
        meanEn: "A brief, persuasive video presentation intended to convince an audience.",
        exampleSentence: "Our team created an engaging video pitch showcasing our AI-powered learning app.",
        masteryLevel: "mastered",
      }
    ],
    grammarNotes: [
      "Passive Construction: 'Participants are required to submit...' (Formal academic instructions)",
      "Time prepositions: 'by next Friday' (Deadline indicator)"
    ],
    speechScript: "Attention all S4 to S6 students: Registration for the Inter-school STEM Robotics Competition is now open. Participants are required to submit an executive summary and a 2-minute video pitch by next Friday.",
    knowledgeTags: ["#HK_School_Life", "#STEM_Vocab", "#Notice_Writing"],
    suggestedQuestions: [
      "What is the difference between a summary and an executive summary?",
      "How to write a formal registration email to my HK teacher in English?"
    ],
    chatHistory: []
  }
];

export const SAMPLE_DISCUSSION_TOPICS = [
  {
    id: "topic-1",
    title: "Should HK secondary schools mandate AI study tools for all DSE subjects?",
    category: "DSE Paper 4: Technology & Education",
    suggestedTime: "8 minutes",
    difficulty: "DSE Level 4 - 5**",
    description: "Hong Kong Education Bureau is contemplating integrating AI tutors into high school curricula. Discuss the benefits and potential drawbacks for student autonomy, exam fairness, and teacher roles.",
    initialMessages: [
      {
        id: "m1",
        speaker: "Candidate A (Alex)",
        speakerRole: "Alex" as const,
        avatar: "alex",
        content: "Good morning everyone. Today we are gathered to discuss whether Hong Kong secondary schools should mandate AI study tools for DSE candidates. To kick off our discussion, I believe AI tutors offer personalized feedback that traditional large-class teaching cannot provide.",
        hkTranslation: "各位早晨。今日我哋討論香港中學應否為 DSE 考生強制推出 AI 學習工具。首先，我覺得 AI 導師能提供傳統大班教學做唔到嘅個人化反饋。",
        dseTip: "Standard DSE Opening: Warm greeting + clear restatement of the prompt theme + introducing Candidate A's stance.",
        keyVocabulary: ["personalized feedback", "large-class teaching", "mandate"],
        timestamp: Date.now() - 120000,
      },
      {
        id: "m2",
        speaker: "Candidate B (Brenda)",
        speakerRole: "Brenda" as const,
        avatar: "brenda",
        content: "I completely echo Alex's sentiment! Especially for non-native English speakers or newly arrived students in HK, an interactive AI companion allows them to practice pronunciation anytime without fear of public embarrassment.",
        hkTranslation: "我非常同意 Alex 嘅睇法！特別對母語非英語或剛來港嘅新移民學生，AI 語音伴學能俾佢哋隨時練習發音，唔怕喺同學面前尷尬。",
        dseTip: "Communication Strategy: Echoing peer's opinion ('completely echo Alex's sentiment') + expanding with target user context (new immigrant HK students).",
        keyVocabulary: ["echo sentiment", "public embarrassment", "non-native speakers"],
        timestamp: Date.now() - 90000,
      },
      {
        id: "m3",
        speaker: "Candidate C (Chris)",
        speakerRole: "Chris" as const,
        avatar: "chris",
        content: "That's a valid point Brenda. However, we must also consider digital equity—not every household has equal access to high-speed devices. Candidate D, what are your thoughts on this aspect?",
        hkTranslation: "Brenda 講得好好。不過我哋都要考慮數位平等——並非每個家庭都有高清平板或高頻網絡。Candidate D，你點睇呢個問題？",
        dseTip: "DSE Level 5** Turn-taking: Counter-balancing with digital equity + directly inviting the student (Candidate D) into the conversation!",
        keyVocabulary: ["digital equity", "counter-balance", "household access"],
        timestamp: Date.now() - 60000,
      }
    ]
  },
  {
    id: "topic-2",
    title: "Preserving Hong Kong's Intangible Cultural Heritage vs. Modern Urban Development",
    category: "DSE Paper 4: Culture & Society",
    suggestedTime: "8 minutes",
    difficulty: "DSE Level 4 - 5",
    description: "Discuss how Hong Kong can strike a balance between preserving local traditions (like Cheung Chau Bun Festival, Bamboo Theatre, and Milk Tea craft) and land development.",
    initialMessages: [
      {
        id: "m2-1",
        speaker: "Candidate A (Alex)",
        speakerRole: "Alex" as const,
        avatar: "alex",
        content: "Hello team. As Hong Kong continuously modernizes its urban landscape, traditional cultural icons face displacement. How can urban planning harmonize heritage conservation with housing supply?",
        hkTranslation: "大家好。隨著香港城市發展，傳統文化標誌正面臨被淘汰嘅風險。我哋點樣平衡文物保育同房屋供應？",
        dseTip: "Strong academic vocabulary: 'urban landscape', 'displacement', 'harmonize heritage conservation'.",
        keyVocabulary: ["urban landscape", "harmonize", "heritage conservation"],
        timestamp: Date.now() - 100000,
      }
    ]
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "plan-starter",
    name: "Standard Student Pass (免費體驗)",
    tagline: "適合初來港學生試用，體驗基礎 AI 相機及發音朗讀",
    priceMonthly: 0,
    priceAnnual: 0,
    billingCycle: "monthly",
    features: [
      "每日 10 次即影即學 (Snap & Learn OCR)",
      "標準英語發音朗讀 (TTS)",
      "基礎 DSE 詞彙庫 (上限 50 詞)",
      "每週 1 次 AI 口試小組討論試玩"
    ],
    targetAudience: "中一至中六新移民初體驗學生",
    buttonText: "免費開始使用"
  },
  {
    id: "plan-pro",
    name: "DSE Master VIP Pass (衝刺高分版)",
    tagline: "全港中學考生最愛！無限次 AI 語音導師 + 5** 多智能體 DSE 口試模擬",
    priceMonthly: 148,
    priceAnnual: 1280,
    billingCycle: "monthly",
    badge: "Most Popular / 最受歡迎",
    highlighted: true,
    features: [
      "無限次即影即學 (相片/通告/試卷 OCR 解析)",
      "美式/英式純正 Accent 語音朗讀 & 慢速朗讀",
      "無限次 DSE Paper 4 多智能體小組討論 (AI Candidates A/B/C)",
      "HKEAA 考評局官方 Level 1-5** 評分報告",
      "個人化錯題庫 & 智能知識圖譜 (Knowledge Graph)",
      "三語切換：English / 廣東話 / 普通話對話導師"
    ],
    targetAudience: "準備 HKDSE 考取 5 / 5* / 5** 英文及各科學生",
    buttonText: "立即升級 VIP (可試用7天)"
  },
  {
    id: "plan-school",
    name: "Hong Kong School B2B SaaS (學校全校授權)",
    tagline: "專為香港中學、校友會及新來港學童適應計劃設計",
    priceMonthly: 2800,
    priceAnnual: 28000,
    billingCycle: "annual",
    badge: "Enterprise / 學校專用",
    features: [
      "全校學生帳號 (無限額學生使用)",
      "教師後台 (Teacher Analytics Dashboard) 追蹤學習進度",
      "配合教育局 DSE 課程指引自訂口試題目",
      "專人上門/線上系統培訓與 24/7 IT 支援",
      "校本專屬 Knowledge Base 數據庫整合"
    ],
    targetAudience: "香港中學校長、IT主任、英文科主任 (English Panel Chair)",
    buttonText: "聯絡團隊預約校園演示"
  }
];

export const INVESTOR_MARKET_DATA = {
  tamHongKong: "HK$ 380 Million / Year (HK Secondary & EdTech Adaptation Market)",
  targetAudienceStats: "Over 45,000 New Immigrant Students (Mainland to HK) enrolled in S1-S6 secondary schools annually",
  dseCandidatesPerYear: "50,000+ DSE Candidates needing English Paper 4 Speaking & Vocabulary confidence",
  partnerBackground: "Founding Partner: 30+ Years HK Education Leadership & IT Director Experience in HK Secondary Education",
  ltvCacRatio: "Projected LTV:CAC = 5.2x (High organic referral in HK parent WeChat & WhatsApp school groups)",
  scalabilityRoadmap: [
    "Phase 1 (Q3 2026): Launch EduBridge HK Snap & Voice Knowledge Base for S1-S6 Immigrant Students",
    "Phase 2 (Q4 2026): Multi-Agent DSE Paper 4 & Chinese Oral Simulator + School B2B Pilot in 20 HK Secondary Schools",
    "Phase 3 (Q1 2027): Expand to GBA (Greater Bay Area) HKDSE Schools in Shenzhen, Guangzhou & Macao",
    "Phase 4 (Q2 2027): AI Teacher Assistant Dashboard & Automated Homework Grading System"
  ]
};
