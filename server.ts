import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.use((req, res, next) => {
    console.log(`[SERVER] ${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
  });

  // Initialize Gemini
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY as string,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const MODEL_NAME = "gemini-3-flash-preview";

  // Local fallback for popular concepts to save quota or handle 429
  const LOCAL_FALLBACKS: Record<string, any> = {
    "strength": {
      options: [
        { chinese: "力", traditional: "力", pinyin: "lì", literal: "Power", meaning: "Physical power, force, or energy. It represents the raw ability to move or influence.", calligraphy: "Classic Kaishu (Regular Script) looks bold and stable." },
        { chinese: "强", traditional: "強", pinyin: "qiáng", literal: "Strong", meaning: "Strong, powerful, or formidable. Implies a state of being robust.", calligraphy: "Xing-Cao (Walking-Cursive) conveys dynamic energy." },
        { chinese: "毅", traditional: "毅", pinyin: "yì", literal: "Fortitude", meaning: "Fortitude, persistence, and firmness of mind. The strength of character.", calligraphy: "Lishu (Clerical Script) for a timeless, historical feel." }
      ]
    },
    "power": {
      options: [
        { chinese: "权", traditional: "權", pinyin: "quán", literal: "Authority", meaning: "Power in the sense of authority, influence, and control.", calligraphy: "Strict, authoritative Regular Script." },
        { chinese: "力", traditional: "力", pinyin: "lì", literal: "Force", meaning: "Physical or mechanical power.", calligraphy: "Bold brush strokes." }
      ]
    },
    "peace": {
      options: [
        { chinese: "和", traditional: "和", pinyin: "hé", literal: "Harmony", meaning: "Harmony, peace, and togetherness. A central tenet of Eastern philosophy.", calligraphy: "Traditional Brush style emphasizes balance." },
        { chinese: "安", traditional: "安", pinyin: "ān", literal: "Quiet", meaning: "Safety, tranquility, and inner peace. Often used to wish for safety.", calligraphy: "Simple and elegant strokes." },
        { chinese: "宁", traditional: "寧", pinyin: "níng", literal: "Serene", meaning: "Quietude and peaceful stillness. A deep sense of calm.", calligraphy: "Fine-line script for a delicate look." }
      ]
    },
    "love": {
      options: [
        { chinese: "爱", traditional: "愛", pinyin: "ài", literal: "Love", meaning: "Universal love, affection, and devotion. Represents the deepest bond.", calligraphy: "Standard script is the most recognizable." },
        { chinese: "情", traditional: "情", pinyin: "qíng", literal: "Emotion", meaning: "Feeling, emotion, or passion. The stirrings of the heart.", calligraphy: "Cursive styles can represent the fluidity of emotion." }
      ]
    },
    "family": {
      options: [
        { chinese: "家", traditional: "家", pinyin: "jiā", literal: "Home", meaning: "Home and family; the root of one's life and the source of comfort.", calligraphy: "Large, centered characters work best." },
        { chinese: "族", traditional: "族", pinyin: "zú", literal: "Clan", meaning: "Clan, lineage, or heritage. Represents one's deep roots.", calligraphy: "Seal script (Zhuanshu) for a deeply ancestral feel." }
      ]
    },
    "courage": {
      options: [
        { chinese: "勇", traditional: "勇", pinyin: "yǒng", literal: "Brave", meaning: "Brave, courageous, or valiant. Facing fear with strength.", calligraphy: "Bold, thick strokes convey fearlessness." },
        { chinese: "坚", traditional: "堅", pinyin: "jiān", literal: "Firm", meaning: "Firm, solid, and unrelenting bravery like a rock.", calligraphy: "Square, architectural strokes." }
      ]
    },
    "brave": {
      options: [
        { chinese: "勇", traditional: "勇", pinyin: "yǒng", literal: "Valiant", meaning: "Brave and valiant. A warrior's spirit.", calligraphy: "Dynamic brush strokes." }
      ]
    },
    "freedom": {
      options: [
        { chinese: "自由", traditional: "自由", pinyin: "zì yóu", literal: "Self-reason", meaning: "Freedom and liberty. The ability to follow one's own path.", calligraphy: "Flowing Cursive script represents an unfettered spirit." },
        { chinese: "逍遥", traditional: "逍遙", pinyin: "xiāo yáo", literal: "Carefree", meaning: "Transcendental freedom and being carefree. Beyond worldly concerns.", calligraphy: "Elegant and rhythmic calligraphy." }
      ]
    },
    "wisdom": {
      options: [
        { chinese: "智", traditional: "智", pinyin: "zhì", literal: "Knowledge", meaning: "Wisdom, knowledge, and cleverness in action.", calligraphy: "Traditional script emphasizes clarity." },
        { chinese: "慧", traditional: "慧", pinyin: "huì", literal: "Insight", meaning: "Insight, intelligence, and spiritual wisdom. Seeing beyond the surface.", calligraphy: "Often paired with 'Zhi' for a complete concept." }
      ]
    },
    "hope": {
      options: [
        { chinese: "亮", traditional: "亮", pinyin: "liàng", literal: "Bright", meaning: "Brightness, light, and hope. Finding light in the dark.", calligraphy: "Radiant, open-style characters." },
        { chinese: "望", traditional: "望", pinyin: "wàng", literal: "Expectation", meaning: "To look forward to, expectation, and hope for the future.", calligraphy: "Balanced and forward-looking strokes." }
      ]
    },
    "patience": {
      options: [
        { chinese: "忍", traditional: "忍", pinyin: "rěn", literal: "Endure", meaning: "Endurance, patience, and self-restraint. Strength under pressure.", calligraphy: "The 'blade over the heart' visual is iconic." },
        { chinese: "恒", traditional: "恆", pinyin: "héng", literal: "Constant", meaning: "Perseverance and constancy. The long-term strength of will.", calligraphy: "Long, horizontal strokes symbolize duration." }
      ]
    },
    "warrior": {
      options: [
        { chinese: "武", traditional: "武", pinyin: "wǔ", literal: "Martial", meaning: "Martial, brave, and military-related strength.", calligraphy: "Sharp and aggressive brushwork." },
        { chinese: "将", traditional: "將", pinyin: "jiàng", literal: "General", meaning: "General or commander. Leadership and martial prowess.", calligraphy: "Authoritative and grand script." }
      ]
    },
    "spirit": {
      options: [
        { chinese: "神", traditional: "神", pinyin: "shén", literal: "God/Divine", meaning: "God, spirit, or divine energy. The ethereal force within.", calligraphy: "Classic and powerful script." },
        { chinese: "慧", traditional: "慧", pinyin: "huì", literal: "Spiritual", meaning: "Spiritual insight and wisdom.", calligraphy: "Delicate and meaningful strokes." }
      ]
    },
    "dream": {
      options: [
        { chinese: "梦", traditional: "夢", pinyin: "mèng", literal: "Dream", meaning: "Dream or aspiration. Following the subconscious call.", calligraphy: "Often written in a flowing, ethereal style." }
      ]
    },
    "truth": {
      options: [
        { chinese: "真", traditional: "真", pinyin: "zhēn", literal: "Real", meaning: "Truth, real, and authentic existence.", calligraphy: "Simple, honest strokes." }
      ]
    },
    "soul": {
      options: [
        { chinese: "魂", traditional: "魂", pinyin: "hún", literal: "Soul", meaning: "Soul or spirit. The eternal part of a person.", calligraphy: "Dynamic and expressive script." }
      ]
    },
    "fire": {
      options: [
        { chinese: "火", traditional: "火", pinyin: "huǒ", literal: "Fire", meaning: "Fire and passion. Destruction and creation.", calligraphy: "Sharp strokes representing flames." }
      ]
    },
    "water": {
      options: [
        { chinese: "水", traditional: "水", pinyin: "shuǐ", literal: "Water", meaning: "Water and fluidity. Adaptability and life.", calligraphy: "Smooth, wavy brushwork." }
      ]
    },
    "tiger": {
      options: [
        { chinese: "虎", traditional: "虎", pinyin: "hǔ", literal: "Tiger", meaning: "The tiger is the king of all beasts in China, symbolizing majesty and protection.", calligraphy: "Bold, predator-like strokes." }
      ]
    },
    "dragon": {
      options: [
        { chinese: "龙", traditional: "龍", pinyin: "lóng", literal: "Dragon", meaning: "The ultimate symbol of power, luck, and auspiciousness.", calligraphy: "Traditional complex characters look most powerful." }
      ]
    }
  };

  // API: Search for Chinese Tattoo Designs
  app.post("/api/search", async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Search text is required" });

    const query = text.toLowerCase().trim();
    console.log(`[API] AI Search Query: ${query}`);

    // High-priority local fallback (Exact match)
    if (LOCAL_FALLBACKS[query]) {
      console.log(`[API] Returning local fallback for: ${query}`);
      return res.json(LOCAL_FALLBACKS[query]);
    }

    // Try Fuzzy match for local fallbacks
    const fuzzyKey = Object.keys(LOCAL_FALLBACKS).find(k => query.includes(k) || k.includes(query));
    if (fuzzyKey) {
      console.log(`[API] Returning fuzzy local fallback for: ${query} (matched ${fuzzyKey})`);
      return res.json(LOCAL_FALLBACKS[fuzzyKey]);
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `You are an expert in Chinese linguistics and tattoo culture. 
        Translate the following English word or concept into 3-5 authentic Chinese tattoo-worthy options. 
        Focus on deep meanings, philosophical symbols, and classic idioms (chengyu).
        
        For each option, provide:
        1. chinese: The Chinese Characters (Simplified).
        2. traditional: Traditional Chinese Characters.
        3. pinyin: Pinyin pronunciation.
        4. literal: Literal English translation of the characters.
        5. meaning: Comprehensive philosophical or cultural context.
        6. calligraphy: Recommended calligraphy style explanation.

        IMPORTANT: If the word is already Chinese, translate it to English first, then provide authentic tattoo options based on that concept.
        Return raw JSON only.

        Input concept: "${text}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    chinese: { type: Type.STRING },
                    traditional: { type: Type.STRING },
                    pinyin: { type: Type.STRING },
                    literal: { type: Type.STRING },
                    meaning: { type: Type.STRING },
                    calligraphy: { type: Type.STRING }
                  },
                  required: ["chinese", "pinyin", "literal", "meaning", "calligraphy"]
                }
              }
            },
            required: ["options"]
          }
        }
      });

      if (!response || !response.text) {
        console.error("[API] Gemini response invalid or missing text property");
        throw new Error("AI service returned an empty response.");
      }

      const rawText = response.text.trim();
      console.log("[API] Received AI response length:", rawText.length);
      
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("[API] Could not find JSON block in response:", rawText);
        throw new Error("AI returned malformed data.");
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      res.json(parsed);
    } catch (error: any) {
      console.error("[API] Search Error:", error.message || error);
      
      // Constant fallback array to ensure user always gets a valid UI response
      const emergencyFallbacks = [
        { 
          chinese: "毅", 
          traditional: "毅", 
          pinyin: "yì", 
          literal: "Fortitude", 
          meaning: "Persistence and firmness of mind. This character represents the strength of will to endure.", 
          calligraphy: "Looks best in classic Regular Script (Kaishu)." 
        },
        { 
          chinese: "龙", 
          traditional: "龍", 
          pinyin: "lóng", 
          literal: "Dragon", 
          meaning: "The ultimate symbol of power, destiny, and cosmic energy in Chinese culture.", 
          calligraphy: "Traditional characters are highly recommended for the visual impact." 
        },
        { 
          chinese: "和", 
          traditional: "和", 
          pinyin: "hé", 
          literal: "Harmony", 
          meaning: "A state of balance and peace between oneself and the universe.", 
          calligraphy: "Walking script (Xingshu) gives it a natural, flowing feel." 
        }
      ];

      // Instead of failing and confusing the user, return these favorites as a backup
      res.json({ 
        options: emergencyFallbacks, 
        isFallback: true,
        fallbackMessage: "Our AI is experiencing high demand. Here are some timeless classic options for you."
      });
    }
  });

  // API: Get Random Inspiration
  app.get("/api/inspiration", async (req, res) => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: "Suggest one powerful Chinese word or idiom for a tattoo, including its characters, pinyin, and a short explanation of its strength/beauty. Return as JSON with keys: chinese, pinyin, meaning.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              chinese: { type: Type.STRING },
              pinyin: { type: Type.STRING },
              meaning: { type: Type.STRING }
            },
            required: ["chinese", "pinyin", "meaning"]
          }
        }
      });
      
      if (response && response.text) {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          res.json(JSON.parse(jsonMatch[0]));
          return;
        }
      }
      throw new Error("Inspiration format error");
    } catch (error: any) {
      console.error("[API] Inspiration Error:", error.message || error);
      
      // Local fallbacks for inspiration when quota is exceeded
      const inspirations = [
        { chinese: "毅", pinyin: "yì", meaning: "Persistence and fortitude. Represents the strength to endure and overcome obstacles." },
        { chinese: "和", pinyin: "hé", meaning: "Harmony and peace. A balanced state of mind and soul." },
        { chinese: "龙", pinyin: "lóng", meaning: "Dragon. Symbol of power, strength, and good luck in Chinese culture." },
        { chinese: "信", pinyin: "xìn", meaning: "Faith or trust. The foundation of loyalty and honesty." },
        { chinese: "梦", pinyin: "mèng", meaning: "Dream. Encouraging one to follow their aspirations." }
      ];
      const randomInspiration = inspirations[Math.floor(Math.random() * inspirations.length)];
      res.json(randomInspiration);
    }
  });


  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API 404 Catch-all
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
  });

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[SERVER] Fatal Error:", err);
    res.status(err.status || 500).json({ 
      error: "Internal Server Error",
      message: err.message
    });
  });


  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
