import { VocabWord } from "../types";
import { toSimplifiedChinese } from "../utils/i18n";
import dseVocab100 from "./dse-vocab-100.json";
import dseVocabL3L4 from "./dse-vocab-level3-4-100.json";

export interface DSEVocabEntry {
  id: string;
  word: string;
  ipa: string;
  level: string;
  category: string;
  meanZh: string;
  meanCn?: string;
  meanEn: string;
  exampleSentence: string;
}

// Combine all JSON entries and deduplicate by word
const rawEntries: DSEVocabEntry[] = [
  ...(dseVocab100 as DSEVocabEntry[]),
  ...(dseVocabL3L4 as DSEVocabEntry[])
];

const uniqueWordsMap = new Map<string, DSEVocabEntry>();
rawEntries.forEach((entry) => {
  const key = entry.word.trim().toLowerCase();
  if (!uniqueWordsMap.has(key)) {
    uniqueWordsMap.set(key, entry);
  }
});

export const DSE_VOCAB_DATABASE: DSEVocabEntry[] = Array.from(uniqueWordsMap.values());

/**
 * Randomly pick N items from the built-in DSE database without repeating existing words
 */
export function getRandomDSEVocab(
  count: number = 5,
  excludeWords: string[] = []
): VocabWord[] {
  const normalize = (s: string) => s.trim().toLowerCase();
  const excludeSet = new Set(excludeWords.map(normalize));

  const candidates = DSE_VOCAB_DATABASE.filter(
    (item) => !excludeSet.has(normalize(item.word))
  );

  // If we excluded all or have fewer candidates, fallback to entire pool
  const pool = candidates.length > 0 ? candidates : DSE_VOCAB_DATABASE;

  // Shuffle pool (Fisher-Yates)
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((item, index) => ({
    id: `rand-dse-${Date.now()}-${index}`,
    word: item.word,
    ipa: item.ipa,
    level: item.level,
    meanZh: item.meanZh,
    meanCn: item.meanCn || toSimplifiedChinese(item.meanZh),
    meanEn: item.meanEn,
    exampleSentence: item.exampleSentence,
    masteryLevel: "new"
  }));
}

/**
 * Download a CSV template for teachers or students to batch import vocabulary
 */
export function downloadDSEVocabTemplateCSV() {
  const headers = "word,ipa,level,meanZh,meanEn,exampleSentence\n";
  const sample1 = '"necessitates","/nəˈses.ə.teɪts/","DSE Level 5*","迫使；使成為必要","To make something necessary or indispensable.","The severe weather condition necessitates the immediate suspension of outdoor activities in HK schools."\n';
  const sample2 = '"indispensable","/ˌɪn.dɪˈspen.sə.bəl/","DSE Level 5","不可或缺的","Absolutely necessary or essential.","Artificial intelligence has become an indispensable tool."\n';

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers + sample1 + sample2;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "dse_vocabulary_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download a JSON template for teachers or developers
 */
export function downloadDSEVocabTemplateJSON() {
  const sample = [
    {
      word: "necessitates",
      ipa: "/nəˈses.ə.teɪts/",
      level: "DSE Level 5*",
      meanZh: "迫使；使成為必要",
      meanEn: "To make something necessary or indispensable.",
      exampleSentence: "The severe weather condition necessitates the immediate suspension of outdoor activities in HK schools."
    },
    {
      word: "indispensable",
      ipa: "/ˌɪn.dɪˈspen.sə.bəl/",
      level: "DSE Level 5",
      meanZh: "不可或缺的",
      meanEn: "Absolutely necessary or essential.",
      exampleSentence: "Artificial intelligence has become an indispensable tool."
    }
  ];

  const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sample, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", jsonString);
  link.setAttribute("download", "dse_vocabulary_template.json");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parse text input (CSV, TSV, or JSON) pasted by user or uploaded from Google Sheets
 */
export function parseCustomVocabList(rawText: string): VocabWord[] {
  const trimmed = rawText.trim();
  if (!trimmed) return [];

  // 1. Try parsing JSON first
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      return list.map((item: any, idx: number) => ({
        id: `custom-json-${Date.now()}-${idx}`,
        word: String(item.word || item.Word || "Word").trim(),
        ipa: String(item.ipa || item.IPA || "/.../").trim(),
        level: String(item.level || item.Level || "DSE Level 4").trim(),
        meanZh: String(item.meanZh || item.MeaningZh || item.Chinese || "").trim(),
        meanEn: String(item.meanEn || item.MeaningEn || item.English || "").trim(),
        exampleSentence: String(item.exampleSentence || item.Example || item.Sentence || "").trim(),
        masteryLevel: "new"
      }));
    } catch (e) {
      console.warn("JSON parse failed, falling back to CSV/TSV parser", e);
    }
  }

  // 2. CSV / TSV / Line-by-line parsing
  const lines = trimmed.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const results: VocabWord[] = [];

  lines.forEach((line, index) => {
    // Skip header line if present
    if (index === 0 && (line.toLowerCase().includes("word") || line.toLowerCase().includes("meanzh"))) {
      return;
    }

    // Split by tab or comma (considering quotes)
    const delimiter = line.includes("\t") ? "\t" : ",";
    const parts = line.split(delimiter).map((p) => p.replace(/^["']|["']$/g, "").trim());

    if (parts.length >= 1 && parts[0]) {
      results.push({
        id: `custom-csv-${Date.now()}-${index}`,
        word: parts[0],
        ipa: parts[1] || "/.../",
        level: parts[2] || "DSE Level 4",
        meanZh: parts[3] || parts[1] || parts[0],
        meanEn: parts[4] || "",
        exampleSentence: parts[5] || "",
        masteryLevel: "new"
      });
    }
  });

  return results;
}
