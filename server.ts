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

  // API: Translate English to Chinese Tattoo Designs
  app.post("/api/translate", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Text is required" });

      console.log("Gemini translating concept:", text);

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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
        Return raw JSON only, matching the schema.

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

      const rawText = response.text || "";
      console.log("Raw Gemini Response:", rawText);
      
      // Attempt to clean JSON if backticks are present
      const cleanJson = rawText.replace(/```json\n?|```/g, "").trim();
      
      const result = JSON.parse(cleanJson || "{\"options\": []}");
      res.json(result);
    } catch (error: any) {
      console.error("Gemini Translation Error:", error);
      
      const status = error.status || 500;
      let message = "Failed to generate authentic translation. Please try another word.";
      
      if (status === 429) {
        message = "Daily AI search quota exceeded. Please try again tomorrow or contact support.";
      }
      
      res.status(status).json({ error: message });
    }
  });

  // API: Get Random Inspiration
  app.get("/api/inspiration", async (req, res) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Suggest one powerful Chinese word or idiom for a tattoo, including its characters, pinyin, and a short explanation of its strength/beauty.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              chinese: { type: Type.STRING },
              pinyin: { type: Type.STRING },
              meaning: { type: Type.STRING }
            }
          }
        }
      });
      const jsonText = response.text || "{}";
      res.json(JSON.parse(jsonText.replace(/```json\n?|```/g, "").trim()));
    } catch (error: any) {
      console.error("Gemini Inspiration Error:", error);
      const status = error.status || 500;
      res.status(status).json({ error: "Inspiration failed due to quota or server error" });
    }
  });

  // API 404 handler
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.path} not found` });
  });

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global Server Error:", err);
    res.status(err.status || 500).json({ 
      error: "An internal server error occurred",
      message: err.message
    });
  });

  // Vite integration for dev, static files for prod
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
