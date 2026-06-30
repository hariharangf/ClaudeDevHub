import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment. Please configure it in your Secrets / Env settings.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// AI Chat endpoint for Claude Developer assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid or empty messages history provided' });
    }

    const client = getGeminiClient();

    // Map roles to GoogleGenAI standards: user -> user, assistant -> model
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: `You are ClaudeDevAssistant, an interactive virtual assistant specialized in Anthropic's Claude AI models, SDKs, APIs, and the Model Context Protocol (MCP).
Your goal is to help developers build high-quality applications with Claude.
Topics you are an expert in:
1. Claude 3 & 3.5 models (Haiku, Sonnet, Opus), their context windows, pricing, speed, and capabilities.
2. Anthropic API Integration (Streaming, JSON Mode, System Prompts, Tool Calling / Function Calling, and Computer Use).
3. Model Context Protocol (MCP): explaining what it is, how to build and configure MCP servers, and how to connect tools to Claude.
4. Prompt Engineering for Claude: utilizing XML tags (<thinking>, <system_instructions>, <examples>, <input>, <output_format>), prompt chaining, pre-filling answers, and prompt library recipes.
5. Code Migration: converting code from OpenAI (GPT-4o/3.5) or other providers to Anthropic SDK format.

Guidance:
- Give very clear, robust, production-ready code examples in TypeScript/Node.js, Python, Go, or cURL.
- Keep your answers highly developer-oriented, precise, objective, and clean.
- Ensure your code follows the latest official Anthropic SDK guidelines (e.g. creating clients, streaming chunks, tool definitions).`,
        temperature: 0.7,
      }
    });

    res.json({ content: response.text });
  } catch (error: any) {
    console.error('Gemini API error in chat route:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while calling the AI model.',
      isConfigError: !process.env.GEMINI_API_KEY
    });
  }
});

// Configure Vite middleware or static serving
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware integrated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static files from dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start fullstack server:', err);
});
