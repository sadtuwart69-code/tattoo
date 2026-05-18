import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI, SchemaType } from "@google/genai";
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
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Using a stable model name
  });

  // API: Search for Chinese Tattoo Designs
  app.post("/api/search", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Search text is required" });

      console.log(`[SEARCH] Processing query: "${text}"`);

      const prompt = `You are an expert in Chinese linguistics and tattoo culture. 
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

        Input concept: "${text}"`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              options: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    chinese: { type: SchemaType.STRING },
                    traditional: { type: SchemaType.STRING },
                    pinyin: { type: SchemaType.STRING },
                    literal: { type: SchemaType.STRING },
                    meaning: { type: SchemaType.STRING },
                    calligraphy: { type: SchemaType.STRING }
                  },
                  required: ["chinese", "pinyin", "literal", "meaning", "calligraphy"]
                }
              }
            },
            required: ["options"]
          }
        }
      });

      const rawText = result.response.text();
      console.log("[SEARCH] Gemini raw response received");
      
      const parsed = JSON.parse(rawText || "{\"options\": []}");
      res.json(parsed);
    } catch (error: any) {
      console.error("[SEARCH] Error:", error);
      
      const status = error.status || 500;
      let message = "生成翻译失败，请尝试其他词汇。";
      
      if (status === 429) {
        message = "每日 AI 搜索配额已用完，请明天再试或联系支持。";
      }
      
      res.status(status).json({ error: message });
    }
  });

  // API: Get Random Inspiration
  app.get("/api/inspiration", async (req, res) => {
    try {
      const prompt = "Suggest one powerful Chinese word or idiom for a tattoo, including its characters, pinyin, and a short explanation of its strength/beauty. Return as JSON with keys: chinese, pinyin, meaning.";
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              chinese: { type: SchemaType.STRING },
              pinyin: { type: SchemaType.STRING },
              meaning: { type: SchemaType.STRING }
            },
            required: ["chinese", "pinyin", "meaning"]
          }
        }
      });
      
      const jsonText = result.response.text();
      res.json(JSON.parse(jsonText));
    } catch (error: any) {
      console.error("[INSPIRATION] Error:", error);
      res.status(500).json({ error: "Inspiration failed" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API 404 handler
  app.all("/api/*", (req, res) => {
    console.warn(`[SERVER] 404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
  });

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[SERVER] Global Error:", err);
    res.status(err.status || 500).json({ 
      error: "服务器内部错误",
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
