import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { handleChatMessage } from "./src/services/chatService";

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log(`[Server] Starting... API Key configured: ${!!process.env.GEMINI_API_KEY}`);
  if (process.env.GEMINI_API_KEY) {
    console.log(`[Server] API Key starts with: ${process.env.GEMINI_API_KEY.substring(0, 4)}...`);
  }

  app.use(express.json());

  // API Route for Chat - Using shared service for Vercel/Cloud Run consistency
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      console.log(`[API] Received chat request: "${message?.substring(0, 50)}..."`);
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const result = await handleChatMessage(message, history || []);
      console.log(`[API] Successfully generated response.`);
      res.json(result);
    } catch (error: any) {
      console.error("[API] Chat API Error:", error.message || "Unknown error");
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
