import { GoogleGenAI } from "@google/genai";

// OpenRouter Configurations
export const DEFAULT_OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || "";
export const OPENROUTER_FREE_MODEL = "openrouter/free";
export const OPENROUTER_FALLBACK_MODELS = [
  "openrouter/free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
];

// Provider Abstraction State Interface
export interface ProviderConfig {
  text_generation: "openrouter" | "gemini";
  article_generation: "openrouter" | "gemini";
  tutor_chat: "openrouter" | "gemini";
  group_discussion: "openrouter" | "gemini";
  translation: "openrouter" | "gemini";
  ocr_provider: "groq" | "gemini";
}

export const hasGeminiKey = !!process.env.GEMINI_API_KEY;
export const hasOpenRouterKey = !!process.env.OPENROUTER_API_KEY;
export const hasGroqKey = !!process.env.GROQ_API_KEY;

const defaultProvider: "openrouter" | "gemini" =
  (process.env.PREFERRED_AI_PROVIDER as "openrouter" | "gemini") ||
  (hasGeminiKey ? "gemini" : hasOpenRouterKey ? "openrouter" : "gemini");

export const providerConfig: ProviderConfig = {
  text_generation: defaultProvider,
  article_generation: defaultProvider,
  tutor_chat: defaultProvider,
  group_discussion: defaultProvider,
  translation: (process.env.PREFERRED_TRANSLATION_PROVIDER as any) || defaultProvider,
  ocr_provider: (process.env.PREFERRED_OCR_PROVIDER as "groq" | "gemini") || "groq",
};

export const providerStats = {
  todayDate: new Date().toISOString().slice(0, 10),
  openrouterCount: 0,
  openrouterLimit: 50,
  geminiCount: 0,
  groqCount: 0,
  openrouterErrors: 0,
  groqErrors: 0,
  lastUsedProvider: {} as Record<string, string>,
};

export function checkDailyReset() {
  const today = new Date().toISOString().slice(0, 10);
  if (providerStats.todayDate !== today) {
    providerStats.todayDate = today;
    providerStats.openrouterCount = 0;
    providerStats.geminiCount = 0;
    providerStats.groqCount = 0;
    providerStats.openrouterErrors = 0;
    providerStats.groqErrors = 0;
  }
}

// Initialize Gemini Client server-side
export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "dummy-key-for-dev",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Safe wrapper for Gemini generateContent
export async function safeGenerateContent(ai: GoogleGenAI, params: { contents: any[]; config?: any }) {
  const models = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-2.5-pro"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      const isQuota = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded");
      const shortMessage = isQuota ? "Quota/Rate limit exceeded (429)" : errMsg.slice(0, 120);
      console.warn(`Model ${model} unavailable (${shortMessage}), attempting next...`);
      if (isQuota) {
        throw new Error("Gemini API quota/rate limit exceeded (429)");
      }
    }
  }
  throw lastError;
}

// Call Groq Vision API
export async function callGroqOCR(params: {
  systemPrompt?: string;
  prompt: string;
  imageBase64?: string;
  jsonOutput?: boolean;
}) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const model = "qwen/qwen3.6-27b";
  const messages: any[] = [];

  if (params.systemPrompt) {
    messages.push({ role: "system", content: params.systemPrompt });
  }

  const userContent: any[] = [];
  if (params.prompt) {
    userContent.push({ type: "text", text: params.prompt });
  }

  if (params.imageBase64) {
    const cleanBase64 = params.imageBase64.replace(/^data:image\/\w+;base64,/, "");
    userContent.push({
      type: "image_url",
      image_url: {
        url: `data:image/jpeg;base64,${cleanBase64}`,
      },
    });
  }

  messages.push({
    role: "user",
    content: userContent.length === 1 && userContent[0].type === "text" ? userContent[0].text : userContent,
  });

  const requestBody: any = {
    model,
    messages,
    temperature: 0.2,
  };

  if (params.jsonOutput) {
    requestBody.response_format = { type: "json_object" };
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  return { content, modelUsed: model };
}

// Call OpenRouter API
export async function callOpenRouterAPI(params: {
  systemPrompt?: string;
  prompt: string;
  jsonOutput?: boolean;
}) {
  const apiKey = process.env.OPENROUTER_API_KEY || DEFAULT_OPENROUTER_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured in environment variables.");
  }

  const messages: any[] = [];
  if (params.systemPrompt) {
    messages.push({ role: "system", content: params.systemPrompt });
  }
  messages.push({ role: "user", content: params.prompt });

  let lastError: any = null;

  for (const modelName of OPENROUTER_FALLBACK_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://aistudio.google.com/",
          "X-Title": "EduBridge HK AI Studio",
        },
        body: JSON.stringify({
          model: modelName,
          messages,
          temperature: 0.4,
          ...(params.jsonOutput ? { response_format: { type: "json_object" } } : {}),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      if (!content) {
        throw new Error("Empty response from OpenRouter");
      }

      providerStats.openrouterCount++;
      return { content, modelUsed: modelName };
    } catch (err: any) {
      lastError = err;
      console.warn(`OpenRouter model ${modelName} failed:`, err.message);
    }
  }

  providerStats.openrouterErrors++;
  throw new Error(`All OpenRouter fallback models failed: ${lastError?.message || "Unknown error"}`);
}

// Provider Abstraction Layer for Text Generation
export async function callAITextGen(params: {
  feature: keyof ProviderConfig;
  systemPrompt?: string;
  prompt: string;
  jsonOutput?: boolean;
}): Promise<{ text: string; providerUsed: string; isFallback: boolean }> {
  checkDailyReset();
  const configuredProvider = providerConfig[params.feature] || "gemini";

  const runGemini = async () => {
    const ai = getGeminiClient();
    const contents: any[] = [];
    if (params.systemPrompt) {
      contents.push({ text: params.systemPrompt });
    }
    contents.push({ text: params.prompt });

    const response = await safeGenerateContent(ai, {
      contents,
      config: params.jsonOutput ? { responseMimeType: "application/json" } : undefined,
    });

    providerStats.geminiCount++;
    providerStats.lastUsedProvider[params.feature] = "gemini (gemini-3.6-flash)";
    return {
      text: response.text || "",
      providerUsed: "gemini (gemini-3.6-flash)",
    };
  };

  const runOpenRouter = async () => {
    const res = await callOpenRouterAPI({
      systemPrompt: params.systemPrompt,
      prompt: params.prompt,
      jsonOutput: params.jsonOutput,
    });
    providerStats.lastUsedProvider[params.feature] = `openrouter (${res.modelUsed})`;
    return {
      text: res.content,
      providerUsed: `openrouter (${res.modelUsed})`,
    };
  };

  if (configuredProvider === "gemini") {
    try {
      const res = await runGemini();
      return { ...res, isFallback: false };
    } catch (geminiErr: any) {
      if (hasOpenRouterKey) {
        console.warn(`[AI Provider Abstraction] Gemini failed for feature '${params.feature}' (${geminiErr.message}). Activating OpenRouter fallback...`);
        try {
          const res = await runOpenRouter();
          return { ...res, isFallback: true };
        } catch (openRouterErr: any) {
          throw new Error(`Both Gemini (${geminiErr.message}) and OpenRouter (${openRouterErr.message}) failed.`);
        }
      }
      throw geminiErr;
    }
  } else {
    try {
      const res = await runOpenRouter();
      return { ...res, isFallback: false };
    } catch (openRouterErr: any) {
      console.warn(`[AI Provider Abstraction] OpenRouter failed for feature '${params.feature}' (${openRouterErr.message}). Activating Gemini fallback...`);
      try {
        const res = await runGemini();
        return { ...res, isFallback: true };
      } catch (geminiErr: any) {
        throw new Error(`Both OpenRouter (${openRouterErr.message}) and Gemini (${geminiErr.message}) failed.`);
      }
    }
  }
}

// Utility to cleanly parse JSON from markdown formatted text
export function parseCleanJson(text: string): any {
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (e) {
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      } catch (_) {}
    }

    const firstBracket = cleaned.indexOf("[");
    const lastBracket = cleaned.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      try {
        return JSON.parse(cleaned.substring(firstBracket, lastBracket + 1));
      } catch (_) {}
    }
    throw e;
  }
}
