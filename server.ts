import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK safely
let ai: GoogleGenAI | null = null;
let isAiAvailable = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');

if (isAiAvailable) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch {
    isAiAvailable = false;
  }
}

// AI Project Assistant API endpoint
app.post('/api/gemini/assist', async (req, res) => {
  const { message, role, currentCategory, activeProjectTitle } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  // If AI is not configured or key access was denied, use smart advisor instantly
  if (!isAiAvailable || !ai) {
    const fallbackReply = generateFallbackAdvice(message, role, currentCategory, activeProjectTitle);
    res.json({ reply: fallbackReply, isSimulated: true });
    return;
  }

  try {
    const systemPrompt = `You are StartBridge AI Assistant, an empathetic, highly knowledgeable startup advisor and venture scout.
You help university student developers and angel investors navigate technical validation, pitch preparation, intellectual property disclaimers, and project discovery.
Tone: Professional, supportive, constructive, concise, and clear for collegiate innovators.
Guidelines:
1. Recommend projects across Healthcare, Education, Agriculture, Environment, and Technology.
2. If reviewing a developer's pitch or budget, highlight technical feasibility, BOM components, and realistic milestones.
3. Remind users that StartBridge features simulated financial transactions and self-reported IP disclaimers.
4. Keep responses structured with clear bullet points where helpful. Keep length under 250 words.`;

    const prompt = `User role: ${role || 'general'}\nActive sector: ${currentCategory || 'all'}\nInspecting project: ${activeProjectTitle || 'none'}\n\nUser inquiry: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I'm here to help match you with suitable startup projects and advise on technical development!";
    res.json({ reply: replyText, isSimulated: false });
  } catch (err: any) {
    // Flag that live API access is restricted for this key to prevent future failed network calls
    isAiAvailable = false;
    const fallbackReply = generateFallbackAdvice(message || '', role || 'general', currentCategory, activeProjectTitle);
    res.json({
      reply: fallbackReply,
      isSimulated: true,
      note: 'Using StartBridge intelligent advisor model.'
    });
  }
});

// Fallback advisor when running offline or without an injected key
function generateFallbackAdvice(message: string, role: string, category?: string, projectTitle?: string): string {
  const query = message.toLowerCase();
  if (query.includes('pitch') || query.includes('deck') || query.includes('review') || query.includes('budget')) {
    return `**StartBridge Pitch & Budget Advice**:
1. **Show Your Working Prototype**: Early investors love to see working physical models or live software. Highlight your key parts (like ESP32, Raspberry Pi, or PyTorch).
2. **Clear Budget in Indian Rupees (₹)**: Be honest and clear about what parts cost to build and how much funding you need to reach your next step.
3. **Patent Details**: Clearly state your patent status as self-reported until paperwork is approved.`;
  }
  if (query.includes('investor') || query.includes('check') || query.includes('funding')) {
    return `**Investor Guidance**:
- For **Agriculture & Environment**, check out **Sarah Jenkins** (₹1,00,000 to ₹10,00,000 checks) who funds farm soil sensors and water tech.
- For **Healthcare & Technology**, connect with **Dr. Vikram Patel** (₹2,50,000 to ₹25,00,000 checks) for smart medical sensors.`;
  }
  if (query.includes('recommend') || query.includes('suggest') || query.includes('project')) {
    return `**Featured Student Projects**:
- **CardioMesh** (Healthcare): Smart heart monitor built for ₹35,000 with on-device AI.
- **CeresEdge** (Agriculture): Solar-powered soil sensor built for ₹22,000 saving 40% farm water.
- **CodeSculpt** (Education): Talking Braille coding board built for ₹18,000 for visually impaired students.`;
  }
  return `Welcome to StartBridge! As ${role === 'investor' ? 'an investor' : 'a startup developer'}, you can explore student projects filtered across 5 major sectors, review parts and costs in Indian Rupees (₹), and send direct messages. What area would you like to explore?`;
}

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StartBridge server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
