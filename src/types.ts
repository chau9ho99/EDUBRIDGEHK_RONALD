export interface VocabWord {
  id: string;
  word: string;
  ipa: string;
  level: string; // e.g. "DSE Level 4", "DSE Level 5**"
  meanZh: string;
  meanCn?: string;
  meanEn: string;
  exampleSentence: string;
  masteryLevel: "new" | "review" | "mastered";
  audioUrl?: string;
}

export interface SnapItem {
  id: string;
  timestamp: number;
  title: string;
  subjectCategory: string;
  ocrText: string;
  imageUrl?: string;
  hkdseContext: string;
  translation: string;
  cantoneseGuide?: string;
  vocabulary: VocabWord[];
  grammarNotes: string[];
  speechScript: string;
  knowledgeTags: string[];
  providerUsed?: string;
  suggestedQuestions: string[];
  chatHistory: Array<{ role: "user" | "tutor"; text: string; timestamp: number }>;
}

export interface DiscussionMessage {
  id: string;
  speaker: string;
  speakerRole: "Alex" | "Brenda" | "Chris" | "User" | "Examiner";
  avatar: string;
  content: string;
  hkTranslation?: string;
  dseTip?: string;
  keyVocabulary?: string[];
  timestamp: number;
  audioPlaying?: boolean;
}

export interface DSERubricReport {
  overallGrade: string;
  scores: {
    pronunciation: string;
    communication: string;
    vocabulary: string;
    ideas: string;
  };
  strengths: string[];
  improvements: string[];
  examinerCommentary: string;
}

export interface GroupDiscussionSession {
  id: string;
  topic: string;
  language: "en" | "cantonese" | "mandarin";
  messages: DiscussionMessage[];
  evalReport?: DSERubricReport;
  status: "idle" | "ongoing" | "completed";
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  billingCycle: "monthly" | "annual";
  badge?: string;
  features: string[];
  targetAudience: string;
  buttonText: string;
  highlighted?: boolean;
}
