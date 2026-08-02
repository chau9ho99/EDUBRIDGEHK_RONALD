import express from "express";
import {
  checkDailyReset,
  providerConfig,
  providerStats,
  OPENROUTER_FREE_MODEL,
  DEFAULT_OPENROUTER_KEY,
  callGroqOCR,
  callOpenRouterAPI,
  getGeminiClient,
  safeGenerateContent,
  ProviderConfig,
} from "../aiProviders";

const router = express.Router();

router.get("/admin/provider-status", (req, res) => {
  try {
    checkDailyReset();
    const openrouterKey = process.env.OPENROUTER_API_KEY || DEFAULT_OPENROUTER_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    res.json({
      providers: providerConfig,
      stats: providerStats,
      openrouterKeyConfigured: !!openrouterKey,
      geminiKeyConfigured: !!geminiKey,
      groqKeyConfigured: !!groqKey,
      openrouterModel: OPENROUTER_FREE_MODEL,
      groqModel: "qwen/qwen3.6-27b",
    });
  } catch (err: any) {
    console.error("Error in /admin/provider-status:", err);
    res.status(500).json({ error: err.message || "Failed to fetch status" });
  }
});

router.post("/admin/set-provider", (req, res) => {
  try {
    const { feature, provider } = req.body || {};
    if (feature && (provider === "openrouter" || provider === "gemini" || provider === "groq")) {
      if (feature in providerConfig) {
        providerConfig[feature as keyof ProviderConfig] = provider as any;
      }
    }
    res.json({ success: true, providers: providerConfig });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/admin/test-provider", async (req, res) => {
  const { provider } = req.body || {};
  const startTime = Date.now();

  if (provider === "groq") {
    try {
      const resVal = await callGroqOCR({
        prompt: "Hello! Please reply in JSON format with key 'status' and value 'operational'.",
        jsonOutput: true,
      });
      const duration = Date.now() - startTime;
      providerStats.groqCount++;
      res.json({
        success: true,
        message: `Successfully connected to Groq Vision API (model: ${resVal.modelUsed}). Low-latency OCR active.`,
        responseTimeMs: duration,
        sampleOutput: resVal.content,
        modelUsed: resVal.modelUsed,
      });
    } catch (err: any) {
      providerStats.groqErrors++;
      res.status(500).json({
        success: false,
        message: `Groq connection failed: ${err.message}`,
      });
    }
  } else if (provider === "openrouter") {
    try {
      const resVal = await callOpenRouterAPI({
        prompt: "How many r's are in the word 'strawberry'? Answer in 1 short sentence.",
      });
      const duration = Date.now() - startTime;
      res.json({
        success: true,
        message: `Successfully connected to OpenRouter (model: ${resVal.modelUsed}).`,
        responseTimeMs: duration,
        sampleOutput: resVal.content,
        modelUsed: resVal.modelUsed,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: `OpenRouter connection failed: ${err.message}`,
      });
    }
  } else {
    try {
      const ai = getGeminiClient();
      const resp = await safeGenerateContent(ai, {
        contents: [{ text: "Respond with 'Gemini API operational' in 1 sentence." }],
      });
      const duration = Date.now() - startTime;
      res.json({
        success: true,
        message: "Successfully connected to Google Gemini API (gemini-3.6-flash).",
        responseTimeMs: duration,
        sampleOutput: resp.text || "",
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: `Gemini connection failed: ${err.message}`,
      });
    }
  }
});

router.post("/admin/reset-counter", (req, res) => {
  try {
    providerStats.openrouterCount = 0;
    providerStats.geminiCount = 0;
    providerStats.groqCount = 0;
    providerStats.openrouterErrors = 0;
    providerStats.groqErrors = 0;
    res.json({ success: true, stats: providerStats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
