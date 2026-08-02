export interface ShadowingItem {
  id: string;
  title: string;
  category: "Paper 1 Reading" | "Paper 2 Writing" | "Paper 3 Listening" | "Paper 4 Oral" | "DSE Level 5**";
  text: string;
  ipa: string;
  targetWord: string;
  translation: string;
  level: "DSE Level 3" | "DSE Level 4" | "DSE Level 5" | "DSE Level 5*" | "DSE Level 5**";
  phoneticsBreakdown: Array<{
    word: string;
    ipa: string;
    score: number; // 0-100
    status: "perfect" | "slight" | "accent_fix"; // Green, Yellow, Red
    tip?: string;
  }>;
}

export const DSE_SHADOWING_100_POOL: ShadowingItem[] = [
  {
    id: "s1",
    title: "DSE 5** 核心句 1: 必要性與緊急處理",
    category: "Paper 2 Writing",
    text: "The worsening weather condition necessitates immediate suspension of all outdoor school activities in Hong Kong.",
    ipa: "/ðə ˈwɜː.sən.ɪŋ ˈweð.ər kənˈdɪʃ.ən nəˈses.ɪ.teɪts ɪˈmiː.di.ət səˈspen.ʃən əv ɔːl ˈaʊtˌdɔːr skuːl ækˈtɪv.ə.tiz ɪn hɒŋ kɒŋ/",
    targetWord: "necessitates",
    translation: "日益惡化的天氣狀況使立即暫停香港所有中學戶外活動成為必要。",
    level: "DSE Level 5**",
    phoneticsBreakdown: [
      { word: "The", ipa: "/ðə/", score: 98, status: "perfect" },
      { word: "worsening", ipa: "/ˈwɜː.sən.ɪŋ/", score: 94, status: "perfect" },
      { word: "weather", ipa: "/ˈweð.ər/", score: 91, status: "perfect" },
      { word: "condition", ipa: "/kənˈdɪʃ.ən/", score: 88, status: "slight", tip: "注意末尾 /ən/ 弱讀" },
      { word: "necessitates", ipa: "/nəˈses.ɪ.teɪts/", score: 68, status: "accent_fix", tip: "重音應在第二音節 /'ses/" },
      { word: "immediate", ipa: "/ɪˈmiː.di.ət/", score: 95, status: "perfect" },
      { word: "suspension", ipa: "/səˈspen.ʃən/", score: 85, status: "slight", tip: "注意 /ʃ/ 的吐氣音" },
      { word: "of", ipa: "/əv/", score: 99, status: "perfect" },
      { word: "all", ipa: "/ɔːl/", score: 96, status: "perfect" },
      { word: "outdoor", ipa: "/ˈaʊtˌdɔːr/", score: 92, status: "perfect" },
      { word: "school", ipa: "/skuːl/", score: 97, status: "perfect" },
      { word: "activities", ipa: "/ækˈtɪv.ə.tiz/", score: 89, status: "slight" },
      { word: "in", ipa: "/ɪn/", score: 99, status: "perfect" },
      { word: "Hong", ipa: "/hɒŋ/", score: 96, status: "perfect" },
      { word: "Kong", ipa: "/kɒŋ/", score: 98, status: "perfect" }
    ]
  },
  {
    id: "s2",
    title: "DSE 5** 核心句 2: 緩解策略與氣候風險",
    category: "Paper 1 Reading",
    text: "Proactive mitigation strategies are indispensable to alleviate the severe consequences of impending climate risks.",
    ipa: "/prəʊˈæk.tɪv ˌmɪt.ɪˈɡeɪ.ʃən stræt.ə.dʒiz ɑːr ˌɪn.dɪˈspen.sə.bəl tuː əˈliː.vi.eɪt ðə sɪˈvɪər kənˈsɪ.kwəns.ɪz əv ɪmˈpen.dɪŋ ˈklaɪ.mət rɪsks/",
    targetWord: "mitigation",
    translation: "前瞻性的緩解策略對於減輕迫在眉睫的氣候風險所帶來的嚴重後果不可或缺。",
    level: "DSE Level 5**",
    phoneticsBreakdown: [
      { word: "Proactive", ipa: "/prəʊˈæk.tɪv/", score: 93, status: "perfect" },
      { word: "mitigation", ipa: "/ˌmɪt.ɪˈɡeɪ.ʃən/", score: 72, status: "slight", tip: "次重音在第1音節，主重音在 /'ɡeɪ/" },
      { word: "strategies", ipa: "/stræt.ə.dʒiz/", score: 92, status: "perfect" },
      { word: "are", ipa: "/ɑːr/", score: 99, status: "perfect" },
      { word: "indispensable", ipa: "/ˌɪn.dɪˈspen.sə.bəl/", score: 65, status: "accent_fix", tip: "重音在第三音節 /'spen/" },
      { word: "to", ipa: "/tuː/", score: 98, status: "perfect" },
      { word: "alleviate", ipa: "/əˈliː.vi.eɪt/", score: 91, status: "perfect" },
      { word: "the", ipa: "/ðə/", score: 99, status: "perfect" },
      { word: "severe", ipa: "/sɪˈvɪər/", score: 87, status: "slight" },
      { word: "consequences", ipa: "/ˈkɒn.sɪ.kwəns.ɪz/", score: 89, status: "slight" },
      { word: "of", ipa: "/əv/", score: 99, status: "perfect" },
      { word: "impending", ipa: "/ɪmˈpen.dɪŋ/", score: 92, status: "perfect" },
      { word: "climate", ipa: "/ˈklaɪ.mət/", score: 96, status: "perfect" },
      { word: "risks", ipa: "/rɪsks/", score: 95, status: "perfect" }
    ]
  },
  {
    id: "s3",
    title: "DSE 5* 核心句 3: 口試小組討論與協作",
    category: "Paper 4 Oral",
    text: "Collaborative learning environments empower candidates to articulate their opinions while cultivating active listening skills.",
    ipa: "/kəˈlæb.ər.ə.tɪv ˈlɜː.nɪŋ ɪnˈvaɪ.rən.mənts ɪmˈpaʊ.ər ˈkæn.dɪ.dəts tuː ɑːˈtɪk.jə.leɪt ðeər əˈpɪn.jənz waɪl ˈkʌl.tɪ.veɪ.tɪŋ ˈæk.tɪv ˈlɪs.ən.ɪŋ skɪlz/",
    targetWord: "articulate",
    translation: "協作學習環境能讓考生清晰表達觀點，同時培養積極聆聽的技巧。",
    level: "DSE Level 5*",
    phoneticsBreakdown: [
      { word: "Collaborative", ipa: "/kəˈlæb.ər.ə.tɪv/", score: 88, status: "slight" },
      { word: "learning", ipa: "/ˈlɜː.nɪŋ/", score: 96, status: "perfect" },
      { word: "environments", ipa: "/ɪnˈvaɪ.rən.mənts/", score: 92, status: "perfect" },
      { word: "empower", ipa: "/ɪmˈpaʊ.ər/", score: 95, status: "perfect" },
      { word: "candidates", ipa: "/ˈkæn.dɪ.dəts/", score: 90, status: "perfect" },
      { word: "to", ipa: "/tuː/", score: 99, status: "perfect" },
      { word: "articulate", ipa: "/ɑːˈtɪk.jə.leɪt/", score: 66, status: "accent_fix", tip: "動詞讀音末尾為 /eɪt/，重音在第二音節 /'tɪk/" },
      { word: "their", ipa: "/ðeər/", score: 97, status: "perfect" },
      { word: "opinions", ipa: "/əˈpɪn.jənz/", score: 93, status: "perfect" },
      { word: "while", ipa: "/waɪl/", score: 98, status: "perfect" },
      { word: "cultivating", ipa: "/ˈkʌl.tɪ.veɪ.tɪŋ/", score: 85, status: "slight" },
      { word: "active", ipa: "/ˈæk.tɪv/", score: 96, status: "perfect" },
      { word: "listening", ipa: "/ˈlɪs.ən.ɪŋ/", score: 94, status: "perfect" },
      { word: "skills", ipa: "/skɪlz/", score: 98, status: "perfect" }
    ]
  },
  {
    id: "s4",
    title: "DSE 5** 核心句 4: 實證數據與論點支撐",
    category: "Paper 2 Writing",
    text: "To substantiate our argument, we must integrate reliable empirical evidence and statistics.",
    ipa: "/tuː səbˈstæn.ʃi.eɪt ˈaʊər ˈɑːɡ.jə.mənt wiː mʌst ˈɪn.tɪ.ɡreɪt rɪˈlaɪ.ə.bəl ɪmˈpɪr.ɪ.kəl ˈev.ɪ.dəns ænd stəˈtɪs.tɪks/",
    targetWord: "substantiate",
    translation: "為了證實我們的論點，我們必須整合可靠的實證數據與統計資料。",
    level: "DSE Level 5**",
    phoneticsBreakdown: [
      { word: "To", ipa: "/tuː/", score: 98, status: "perfect" },
      { word: "substantiate", ipa: "/səbˈstæn.ʃi.eɪt/", score: 64, status: "accent_fix", tip: "重音在第二音節 /'stæn/" },
      { word: "our", ipa: "/ˈaʊər/", score: 95, status: "perfect" },
      { word: "argument", ipa: "/ˈɑːɡ.jə.mənt/", score: 92, status: "perfect" },
      { word: "we", ipa: "/wiː/", score: 99, status: "perfect" },
      { word: "must", ipa: "/mʌst/", score: 96, status: "perfect" },
      { word: "integrate", ipa: "/ˈɪn.tɪ.ɡreɪt/", score: 88, status: "slight" },
      { word: "reliable", ipa: "/rɪˈlaɪ.ə.bəl/", score: 91, status: "perfect" },
      { word: "empirical", ipa: "/ɪmˈpɪr.ɪ.kəl/", score: 78, status: "slight", tip: "元音 /ɪmˈpɪr/ 需飽滿" },
      { word: "evidence", ipa: "/ˈev.ɪ.dəns/", score: 94, status: "perfect" },
      { word: "and", ipa: "/ænd/", score: 98, status: "perfect" },
      { word: "statistics", ipa: "/stəˈtɪs.tɪks/", score: 86, status: "slight" }
    ]
  },
  {
    id: "s5",
    title: "DSE Level 4 核心句 5: 人工智能與青年創新",
    category: "Paper 1 Reading",
    text: "Artificial intelligence accelerates innovation and transforms conventional learning paradigms.",
    ipa: "/ˌɑː.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns əkˈsel.ə.reɪts ˌɪn.əˈveɪ.ʃən ænd trænsˈfɔːmz kənˈven.ʃən.əl ˈlɜː.nɪŋ ˈpær.ə.daɪmz/",
    targetWord: "paradigms",
    translation: "人工智能加速創新並改變傳統的學習範式。",
    level: "DSE Level 4",
    phoneticsBreakdown: [
      { word: "Artificial", ipa: "/ˌɑː.tɪˈfɪʃ.əl/", score: 92, status: "perfect" },
      { word: "intelligence", ipa: "/ɪnˈtel.ɪ.dʒəns/", score: 94, status: "perfect" },
      { word: "accelerates", ipa: "/əkˈsel.ə.reɪts/", score: 89, status: "slight" },
      { word: "innovation", ipa: "/ˌɪn.əˈveɪ.ʃən/", score: 96, status: "perfect" },
      { word: "and", ipa: "/ænd/", score: 99, status: "perfect" },
      { word: "transforms", ipa: "/trænsˈfɔːmz/", score: 91, status: "perfect" },
      { word: "conventional", ipa: "/kənˈven.ʃən.əl/", score: 87, status: "slight" },
      { word: "learning", ipa: "/ˈlɜː.nɪŋ/", score: 98, status: "perfect" },
      { word: "paradigms", ipa: "/ˈpær.ə.daɪmz/", score: 62, status: "accent_fix", tip: "字母 g 不發音，讀作 /ˈpær.ə.daɪmz/" }
    ]
  }
];

// Helper to generate dynamic shadowing sentences for the ~100 sentence pool
const SUBJECTS = [
  { en: "Hong Kong secondary students", zh: "香港中學生" },
  { en: "Educational policymakers", zh: "教育政策制定者" },
  { en: "Young innovators in Asia", zh: "亞洲青年創新者" },
  { en: "Environmental campaigners", zh: "環保倡導者" },
  { en: "Academic researchers", zh: "學術研究人員" },
  { en: "Future DSE candidates", zh: "未來的 DSE 考生" },
  { en: "Community leaders", zh: "社區領袖" }
];

const VERBS = [
  { en: "strive to master", zh: "努力掌握" },
  { en: "endeavor to integrate", zh: "竭力整合" },
  { en: "advocate for", zh: "提倡" },
  { en: "implement comprehensive", zh: "實施全面的" },
  { en: "cultivate analytical", zh: "培養分析性的" },
  { en: "prioritize sustainable", zh: "優先考慮可持續的" },
  { en: "scrutinize complex", zh: "審視複雜的" }
];

const OBJECTS = [
  { en: "cutting-edge technological frameworks in classrooms.", zh: "課堂中的前沿技術框架。" },
  { en: "rigorous academic standards to ensure educational equity.", zh: "嚴謹的學術標準以確保教育公平。" },
  { en: "resilient mental health support systems for teenagers.", zh: "針對青少年的強韌心理健康支援系統。" },
  { en: "interdisciplinary knowledge across English and Science subjects.", zh: "跨越英文與科學學科的跨學科知識。" },
  { en: "critical thinking skills to evaluate global information.", zh: "評估全球資訊的批判性思維技巧。" },
  { en: "effective communication techniques for international collaboration.", zh: "國際合作中的有效溝通技巧。" }
];

const ADVANCED_TERMS = [
  { word: "indispensable", ipa: "/ˌɪn.dɪˈspen.sə.bəl/", level: "DSE Level 5**" },
  { word: "prevalent", ipa: "/ˈprev.əl.ənt/", level: "DSE Level 4" },
  { word: "paramount", ipa: "/ˈpær.ə.maʊnt/", level: "DSE Level 5*" },
  { word: "meticulous", ipa: "/məˈtɪk.jə.ləs/", level: "DSE Level 5**" },
  { word: "unprecedented", ipa: "/ʌnˈpres.ɪ.den.tɪd/", level: "DSE Level 5*" },
  { word: "pivotal", ipa: "/ˈpɪv.ə.təl/", level: "DSE Level 4" },
  { word: "holistic", ipa: "/həʊˈlɪs.tɪk/", level: "DSE Level 5*" }
];

// Dynamically seed remaining pool up to 100 items with accurate localized translations
for (let i = 6; i <= 100; i++) {
  const subjObj = SUBJECTS[(i - 6) % SUBJECTS.length];
  const verbObj = VERBS[(i - 6) % VERBS.length];
  const objObj = OBJECTS[(i - 6) % OBJECTS.length];
  const adv = ADVANCED_TERMS[(i - 6) % ADVANCED_TERMS.length];

  const text = `${subjObj.en} ${verbObj.en} ${objObj.en}`;
  const translation = `${subjObj.zh}${verbObj.zh}${objObj.zh}`;

  const words = text.split(" ");
  const breakdowns = words.map((w) => {
    const cleanWord = w.replace(/[^a-zA-Z]/g, "");
    let score = Math.floor(Math.random() * 25) + 75; // 75-100
    let status: "perfect" | "slight" | "accent_fix" = "perfect";
    if (cleanWord.toLowerCase() === adv.word.toLowerCase()) {
      score = Math.floor(Math.random() * 15) + 60; // 60-75
      status = "accent_fix";
    } else if (score < 85) {
      status = "slight";
    }
    return {
      word: w,
      ipa: `/${cleanWord.toLowerCase()}/`,
      score,
      status,
      tip: status === "accent_fix" ? `重音需精準發音 /${cleanWord}/` : undefined
    };
  });

  DSE_SHADOWING_100_POOL.push({
    id: `s${i}`,
    title: `DSE 高頻句 ${i}: ${adv.word} 句型演練`,
    category: (i % 4 === 0 ? "Paper 1 Reading" : i % 4 === 1 ? "Paper 2 Writing" : i % 4 === 2 ? "Paper 3 Listening" : "Paper 4 Oral") as any,
    text,
    ipa: `/${text.toLowerCase().slice(0, 32)}.../`,
    targetWord: adv.word,
    translation,
    level: adv.level as any,
    phoneticsBreakdown: breakdowns
  });
}
