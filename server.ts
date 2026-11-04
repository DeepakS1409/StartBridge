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
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
let ai: GoogleGenAI | null = null;
let isAiAvailable = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

if (isAiAvailable) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'startbridge-scout',
        },
      },
    });
  } catch {
    isAiAvailable = false;
  }
}

// System knowledge base for StartBridge
const SYSTEM_KNOWLEDGE = `You are StartBridge AI Venture Scout, an empathetic, highly knowledgeable collegiate startup advisor and angel scout.
You help university student developers and angel investors in India navigate technical feasibility, Bill of Materials (BOM) budgeting in Indian Rupees (₹), patent/IP status, and investor matching.

KNOWLEDGE BASE:
1. SECTORS (5 Focus Areas):
   - Healthcare & Biotech
   - Agriculture & Climate (AgriTech)
   - Environment & CleanTech (Water/Waste)
   - Education Tech (EdTech / Assistive Tech)
   - Technology & DeepTech (Robotics/Drones/AI)

2. ACTIVE STUDENT STARTUPS IN STARTBRIDGE:
   - CardioMesh (Healthcare): Smart Wearable Heart Monitor with on-device TinyML. Founder: Aria Chen (Biomedical Student). Tech: ARM Microcontroller, Heart Signal Sensor, TinyML, FastAPI. Build BOM Cost: ₹35,000. Target Pre-Seed: ₹4,00,000. Status: Working Prototype, Provisional Patent Filed. Rating: 4.9/5.
   - CeresEdge (Agriculture): Solar-powered smart soil & farm water sensor using LoRa. Founder: Mateo Morales (AgriTech Student). Tech: ESP32 Dual-Core, Capacitive Soil Rods, 1W Solar Panel, LoRa Radio. Build BOM Cost: ₹22,000. Target Pre-Seed: ₹3,00,000. Status: Field Tested, Utility Patent Drafting. Rating: 4.8/5.
   - AquaFilter (Environment): Floating river water purity tester & pollution detector with self-cleaning lens. Founder: Nadia El-Sayed (Environmental Engineering). Tech: Raspberry Pi CM4, Light Spectrometer, Ultrasonic Cleaner. Build BOM Cost: ₹48,000. Target Pre-Seed: ₹5,50,000. Status: MVP, Provisional Patent Filed. Rating: 4.7/5.
   - CodeSculpt (Education): Talking Braille magnetic puzzle board that teaches blind students real coding. Founder: Devon Vance (Accessibility Computing). Tech: Raspberry Pi Pico, Braille Solenoid Pins, Magnetic Snap Sensors. Build BOM Cost: ₹18,000. Target Pre-Seed: ₹2,50,000. Status: Working Prototype, Open Source Granted. Rating: 5.0/5.
   - AeroRescue (Technology): Autonomous rescue drone camera box locating trapped people without GPS. Founders: Kavita Rao & Sam Miller (Robotics & AI). Tech: NVIDIA Jetson, Dual 3D Stereo Cameras, Thermal Heat Sensor, ROS2. Build BOM Cost: ₹42,000. Target Pre-Seed: ₹7,00,000. Status: Field Tested, Provisional Patent Filed. Rating: 4.9/5.
   - NeuroVibe (Healthcare): Smart steadying glove counteracting hand tremors for Parkinson's & essential tremor patients. Founder: Isaac Goldman (Biomedical Senior). Tech: Nordic low-power chip, Dual Gyro Sensors, Micro Vibration Motors. Build BOM Cost: ₹28,000. Target Pre-Seed: ₹4,50,000. Status: MVP, Utility Patent Filed. Rating: 4.9/5.

3. ACTIVE ANGEL INVESTORS IN STARTBRIDGE:
   - Dr. Vikram Patel (BioPulse Health Angels, Mumbai & Boston): Backs Healthcare & DeepTech. Check range: ₹2,50,000 – ₹25,00,000. 22 portfolio deals.
   - Sarah Jenkins (BlueHarvest Agri & Climate Angels, Bengaluru & San Francisco): Backs Agriculture & Environment. Check range: ₹1,00,000 – ₹10,00,000. 14 portfolio deals.
   - Elena Rostova (NextGen Education Fund, Hyderabad & Austin): Backs Education & Inclusive Tech. Check range: ₹1,50,000 – ₹7,50,000. 18 portfolio deals.
   - Marcus Thorne (TerraScale Green Syndicate, Delhi & Seattle): Backs CleanTech, Environment & Agri. Check range: ₹5,00,000 – ₹30,00,000. 11 portfolio deals.

4. PLATFORM FEATURES:
   - Currency: Indian Rupees (₹) everywhere.
   - Role Switcher: Developer (Submit & Pitch) vs Investor (Scout & Send Check).
   - Smart Matchmaker: Filters startups & angels by sector and ₹ check size.
   - Simulated Transactions: All commitments are prototypes for collegiate educational training.

TONE & STYLE:
- Supportive, concise, well-structured with clear bullet points.
- If the user asks in Tanglish (e.g., "idha epdi pandradhu", "medical project enna irukku"), reply warmly in natural Tanglish or simple English!
- Always quote accurate figures in Indian Rupees (₹). Keep responses under 220 words.`;

// AI Project Assistant API endpoint
app.post('/api/gemini/assist', async (req, res) => {
  const { message, role, currentCategory, activeProjectTitle, history } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  // If live AI is available, attempt to call Gemini model
  if (isAiAvailable && ai) {
    try {
      // Build conversation context from history
      let conversationContext = '';
      if (Array.isArray(history) && history.length > 0) {
        conversationContext = history
          .slice(-4)
          .map((h: any) => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
          .join('\n');
      }

      const prompt = `${SYSTEM_KNOWLEDGE}\n\nUser role: ${role || 'developer'}\nActive sector: ${
        currentCategory || 'all'
      }\nInspecting: ${activeProjectTitle || 'none'}\n\nRecent context:\n${conversationContext}\n\nUser Question: ${message}`;

      // Try modern Gemini models in order of availability
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      let replyText = '';

      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              temperature: 0.7,
            },
          });
          if (response.text) {
            replyText = response.text;
            break;
          }
        } catch {
          // Continue to next model if specific model fails
        }
      }

      if (replyText) {
        res.json({ reply: replyText, isSimulated: false, engine: 'gemini' });
        return;
      }
    } catch {
      // Fall through to smart intelligent advisor
    }
  }

  // Comprehensive Smart Knowledge Engine fallback
  const fallbackReply = generateSmartAdvisorReply(message, role, currentCategory, activeProjectTitle);
  res.json({
    reply: fallbackReply,
    isSimulated: true,
    engine: 'startbridge-knowledge-engine',
  });
});

/**
 * High-Precision StartBridge Knowledge Engine
 * Handles English, Tanglish, and Tamil queries with full platform data.
 */
function generateSmartAdvisorReply(
  message: string,
  role?: string,
  category?: string,
  projectTitle?: string
): string {
  const q = message.toLowerCase().trim();

  // Detect Tanglish query markers
  const isTanglish =
    q.includes('enna') ||
    q.includes('epdi') ||
    q.includes('sollu') ||
    q.includes('irukku') ||
    q.includes('panradhu') ||
    q.includes('yaaru') ||
    q.includes('kaasu') ||
    q.includes('panam') ||
    q.includes('paththi') ||
    q.includes('vanakkam') ||
    q.includes('kedaikkum');

  // 1. GREETINGS & CHIT-CHAT
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q.includes('vanakkam') ||
    q.includes('how are you') ||
    q.includes('epdi irukka') ||
    q.includes('who are you') ||
    q.includes('yaaru nee')
  ) {
    if (isTanglish) {
      return `வணக்கம்! நான் உங்கள் **StartBridge AI Venture Scout** 🚀

நான் உங்களுக்கு கீழ்கண்டவற்றில் வழிகாட்ட முடியும்:
• **Startups தகவல்கள்**: Healthcare, Agriculture, CleanTech, EdTech & DeepTech புராஜெக்ட்கள்.
• **BOM & Budget**: ஹார்டுவேர் பாகங்களின் செலவு மற்றும் ₹ Pre-Seed பட்ஜெட் கணக்கீடு.
• **Angel Investors**: ₹1,00,000 முதல் ₹25,00,000+ வரை முதலீடு செய்யும் ஏஞ்சல் முதலீட்டாளர்கள்.
• **Pitching Guide**: எப்படி டெமோ வீடியோ மற்றும் புராஜெக்ட் சமர்ப்பிப்பது.

உங்களுக்கு எந்த துறை அல்லது புராஜெக்ட் பற்றி தெரிந்து கொள்ள வேண்டும்?`;
    }
    return `Hello! I'm your **StartBridge AI Venture Scout** 🤖

I can help you:
• **Discover Prototypes**: Explore projects across Healthcare, AgriTech, CleanTech, EdTech, and DeepTech.
• **Validate BOM & Budget**: Verify parts cost & target funding in Indian Rupees (₹).
• **Match with Angels**: Connect with verified angels (checks from ₹1,00,000 to ₹25,00,000+).
• **Pitch Advice**: Guidelines for demo videos, patents (Provisional vs Utility), and hardware BOM.

Which sector or startup would you like to explore today?`;
  }

  // 2. SPECIFIC STARTUPS: CARDIOMESH (HEART MONITOR)
  if (q.includes('cardiomesh') || q.includes('heart') || q.includes('cardio') || q.includes('ecg')) {
    return `🩺 **CardioMesh — Smart Wearable Heart Monitor with TinyML**
• **Founder**: Aria Chen (Final Year Biomedical Student, Collegiate BioDesign Lab)
• **Problem Solved**: Early detection of irregular heartbeats for rural patients without high-speed internet.
• **Hardware BOM**: ARM Microcontroller, Heart Signal Sensor, Silicone Chest Band, Micro Battery.
• **Build BOM Cost**: **₹35,000**
• **Target Pre-Seed**: **₹4,00,000**
• **IP Status**: **Provisional Patent (Filed)** · Stage: **Working Prototype**
• **Matching Angel**: **Dr. Vikram Patel** (BioPulse Health Angels) funds medical prototypes from ₹2,50,000+.`;
  }

  // 3. SPECIFIC STARTUPS: CERESEDGE (AGRITECH SOIL SENSOR)
  if (q.includes('ceresedge') || q.includes('soil') || q.includes('soil sensor') || q.includes('vivasayam')) {
    return `🌾 **CeresEdge — Solar Smart Soil & Farm Water Sensor**
• **Founder**: Mateo Morales (Agriculture Tech Student)
• **Problem Solved**: Saves 40% irrigation water by measuring root soil moisture without expensive SIM cellular charges.
• **Hardware BOM**: ESP32 Dual-Core Chip, Capacitive Soil Rods, 1W Solar Panel, Long-Range LoRa Radio.
• **Build BOM Cost**: **₹22,000**
• **Target Pre-Seed**: **₹3,00,000**
• **IP Status**: **Utility Patent (Drafting)** · Stage: **Field Tested**
• **Matching Angel**: **Sarah Jenkins** (BlueHarvest Agri Angels) backs farm IoT from ₹1,00,000 to ₹10,00,000.`;
  }

  // 4. SPECIFIC STARTUPS: AQUAFILTER (CLEANTECH WATER BUOY)
  if (q.includes('aquafilter') || q.includes('water') || q.includes('river') || q.includes('thanni')) {
    return `🌱 **AquaFilter — Floating River Water Purity Tester**
• **Founder**: Nadia El-Sayed (Environmental Engineering Student)
• **Problem Solved**: Automatically tests river water every 15 minutes with a self-cleaning lens to prevent chemical & heavy metal poisoning.
• **Hardware BOM**: Raspberry Pi CM4, Light Spectrometer Sensor, Ultrasonic Cleaner, Recycled Floating Buoy.
• **Build BOM Cost**: **₹48,000**
• **Target Pre-Seed**: **₹5,50,000**
• **IP Status**: **Provisional Patent (Filed)** · Stage: **MVP**
• **Matching Angel**: **Marcus Thorne** (TerraScale Green Syndicate) provides ₹5,00,000+ checks for clean water tech.`;
  }

  // 5. SPECIFIC STARTUPS: CODESCULPT (BRAILLE CODING BOARD)
  if (q.includes('codesculpt') || q.includes('braille') || q.includes('blind') || q.includes('puzzle')) {
    return `🎓 **CodeSculpt — Talking Braille Computer Coding Board**
• **Founder**: Devon Vance (Accessibility Computing Student)
• **Problem Solved**: Magnetic physical puzzle blocks with popping Braille pins and audio feedback that teach visually impaired students Python.
• **Hardware BOM**: Raspberry Pi Pico, Braille Solenoid Pins, Magnetic Snap Sensors, Acrylic Enclosure.
• **Build BOM Cost**: **₹18,000**
• **Target Pre-Seed**: **₹2,50,000**
• **IP Status**: **Open Source (Granted)** · Stage: **Working Prototype**
• **Matching Angel**: **Elena Rostova** (NextGen Education Fund) funds inclusive education aids up to ₹7,50,000.`;
  }

  // 6. SPECIFIC STARTUPS: AERORESCUE (DRONE CAMERA BOX)
  if (q.includes('aerorescue') || q.includes('drone') || q.includes('rescue') || q.includes('rubble')) {
    return `⚡ **AeroRescue — Smart Rescue Camera System for Drones**
• **Founders**: Kavita Rao & Sam Miller (Aerospace & Robotics Group)
• **Problem Solved**: Scans earthquake & flood ruins 45 times/second to locate trapped survivors using thermal vision completely without GPS.
• **Hardware BOM**: NVIDIA Jetson AI Board, Dual 3D Stereo Cameras, Thermal Heat Sensor, Carbon Fiber Casing (<180g).
• **Build BOM Cost**: **₹42,00,00** (₹42,000)
• **Target Pre-Seed**: **₹7,00,000**
• **IP Status**: **Provisional Patent (Filed)** · Stage: **Field Tested**
• **Matching Angels**: **Marcus Thorne** (DeepTech) and **Dr. Vikram Patel** (Emergency Sensors).`;
  }

  // 7. SPECIFIC STARTUPS: NEUROVIBE (HAND STEADYING GLOVE)
  if (q.includes('neurovibe') || q.includes('tremor') || q.includes('glove') || q.includes('hand shake')) {
    return `🩺 **NeuroVibe — Hand Steadying Glove for Daily Independence**
• **Founder**: Isaac Goldman (Neural Devices Student Lab)
• **Problem Solved**: Counteracts hand shaking in Parkinson's & tremor patients using micro-vibrations so they can eat and write independently.
• **Hardware BOM**: Low-Power Nordic Chip, Dual Motion Gyro Sensors, Micro Vibration Motors, Breathable Glove.
• **Build BOM Cost**: **₹28,000**
• **Target Pre-Seed**: **₹4,50,000**
• **IP Status**: **Utility Patent (Filed)** · Stage: **MVP**
• **Matching Angel**: **Dr. Vikram Patel** (BioPulse Health Angels) funds medical wearable prototypes.`;
  }

  // 8. SECTOR QUERIES: HEALTHCARE
  if (q.includes('health') || q.includes('medical') || q.includes('hospital') || q.includes('biotech')) {
    return `🩺 **Healthcare & Biotech Sector on StartBridge**:
1. **CardioMesh** — Smart Heart Monitor (BOM: ₹35,000 · Pre-Seed: ₹4,00,000)
2. **NeuroVibe** — Hand Steadying Glove (BOM: ₹28,000 · Pre-Seed: ₹4,50,000)

**Key Angel Investor**:
• **Dr. Vikram Patel** (BioPulse Health Angels, Mumbai): Check sizes **₹2,50,000 to ₹25,00,000**.
• **Investor Advice**: Focus on clinical trial partnerships and keeping parts cost low with microcontrollers.`;
  }

  // 9. SECTOR QUERIES: AGRICULTURE
  if (q.includes('agri') || q.includes('farm') || q.includes('crop') || q.includes('agriculture')) {
    return `🌾 **Agriculture & Climate Sector on StartBridge**:
1. **CeresEdge** — Solar Soil & Farm Water LoRa Sensor (BOM: ₹22,000 · Pre-Seed: ₹3,00,000)

**Key Angel Investor**:
• **Sarah Jenkins** (BlueHarvest Agri Angels, Bengaluru): Check sizes **₹1,00,000 to ₹10,00,000**.
• **Investor Advice**: Farm sensors must be waterproof, solar-powered, and work without monthly SIM subscription fees.`;
  }

  // 10. SECTOR QUERIES: ENVIRONMENT & WATER
  if (q.includes('environment') || q.includes('clean') || q.includes('waste') || q.includes('river')) {
    return `🌱 **Environment & CleanTech on StartBridge**:
1. **AquaFilter** — Floating River Water Pureness Tester (BOM: ₹48,000 · Pre-Seed: ₹5,50,000)

**Key Angel Investor**:
• **Marcus Thorne** (TerraScale Green Syndicate, Delhi): Check sizes **₹5,00,000 to ₹30,00,000**.
• **Investor Advice**: Highlight automated cleaning (to prevent algae blockage) and community water dashboard integration.`;
  }

  // 11. SECTOR QUERIES: EDUCATION
  if (q.includes('education') || q.includes('edtech') || q.includes('school') || q.includes('college') || q.includes('padipu')) {
    return `🎓 **Education Tech on StartBridge**:
1. **CodeSculpt** — Braille Physical Coding Board for Blind Students (BOM: ₹18,000 · Pre-Seed: ₹2,50,000)

**Key Angel Investor**:
• **Elena Rostova** (NextGen Education Fund, Hyderabad): Check sizes **₹1,50,000 to ₹7,50,000**.
• **Investor Advice**: Special education and inclusive assistive boards must keep kit cost under ₹2,000 for government school deployment.`;
  }

  // 12. SECTOR QUERIES: TECHNOLOGY & ROBOTICS
  if (q.includes('tech') || q.includes('technology') || q.includes('robot') || q.includes('drone') || q.includes('ai')) {
    return `⚡ **Technology & DeepTech on StartBridge**:
1. **AeroRescue** — Autonomous Drone Rescue Camera Box (BOM: ₹42,000 · Pre-Seed: ₹7,00,000)

**Key Angel Investor**:
• **Marcus Thorne** (Delhi) & **Dr. Vikram Patel** (Mumbai): Checks from **₹5,00,000 to ₹25,00,000**.
• **Investor Advice**: Show working obstacle avoidance and GPS-denied SLAM mapping on your video demo.`;
  }

  // 13. INVESTORS DIRECTORY & ANGEL CHECK QUERIES
  if (
    q.includes('investor') ||
    q.includes('angel') ||
    q.includes('mentor') ||
    q.includes('patel') ||
    q.includes('sarah') ||
    q.includes('elena') ||
    q.includes('marcus') ||
    q.includes('yaaru')
  ) {
    return `👥 **Verified Angel Network on StartBridge**:
1. **Dr. Vikram Patel** (BioPulse Health Angels)
   • Sectors: Healthcare & Tech · Location: Mumbai & Boston
   • Check Bracket: **₹2,50,000 – ₹25,00,000** (22 Deals)
2. **Sarah Jenkins** (BlueHarvest Agri & Climate Angels)
   • Sectors: Agriculture & Environment · Location: Bengaluru & SF
   • Check Bracket: **₹1,00,000 – ₹10,00,000** (14 Deals)
3. **Elena Rostova** (NextGen Education Fund)
   • Sectors: Education & Tech · Location: Hyderabad & Austin
   • Check Bracket: **₹1,50,000 – ₹7,50,000** (18 Deals)
4. **Marcus Thorne** (TerraScale Green Syndicate)
   • Sectors: Environment, Agri & Tech · Location: Delhi & Seattle
   • Check Bracket: **₹5,00,000 – ₹30,00,000** (11 Deals)

💡 *Tip: Click on "Angel Network" in the top bar to send a direct pitch to any investor.*`;
  }

  // 14. FUNDING, BUDGET & RUPEES QUERIES
  if (
    q.includes('funding') ||
    q.includes('budget') ||
    q.includes('cost') ||
    q.includes('check size') ||
    q.includes('kaasu') ||
    q.includes('panam') ||
    q.includes('rupees') ||
    q.includes('inr') ||
    q.includes('₹')
  ) {
    if (isTanglish) {
      return `💰 **StartBridge-ல் ஃபண்டிங் & பட்ஜெட் வழிகாட்டுதல்**:
1. **BOM Build Cost (பாகங்கள் செலவு)**:
   • உங்கள் புரோட்டோடைப் செய்ய ஆகும் உண்மையான செலவைக் குறிப்பிடவும் (எ.கா: ₹15,000 முதல் ₹50,000).
2. **Pre-Seed Funding Target**:
   • அடுத்த 6 மாத தயாரிப்பு மற்றும் டெஸ்டிங்கிற்கு தேவையான தொகையைக் கேட்கவும் (பொதுவாக ₹2,00,000 முதல் ₹7,00,000).
3. **Investor Check Brackets**:
   • மைக்ரோ மானியங்கள்: ₹50,000 – ₹1,50,000
   • முதல் ஏஞ்சல் செக்: ₹1,00,000 – ₹5,00,000
   • ஏஞ்சல் கூட்டமைப்பு: ₹5,00,000 – ₹25,00,000

மேல் பட்டியில் உள்ள **"Smart Matchmaker"** மூலம் உங்கள் பட்ஜெட்டிற்கு ஏற்ற முதலீட்டாளர்களை உடனே பார்க்கலாம்!`;
    }
    return `💰 **Pre-Seed Budgeting & Funding Guide in Indian Rupees (₹)**:
1. **Parts BOM Cost (Bill of Materials)**:
   • Be transparent about your component costs (ESP32: ₹450, Sensors: ₹1,200, PCB: ₹800). StartBridge prototypes range from ₹18,000 to ₹48,000.
2. **Target Pre-Seed Funding**:
   • Ask for funding to cover next 6 months of lab testing and 10 field units (typically ₹2,50,000 to ₹7,00,000).
3. **Typical Check Sizes**:
   • Micro Pre-Seed: **₹50,000 – ₹1,50,000**
   • First Angel Check: **₹1,00,000 – ₹5,00,000**
   • Syndicate Seed: **₹5,00,000 – ₹25,00,000**

💡 Use our **Smart Matchmaker** tool in the top bar to filter angels by check capacity!`;
  }

  // 15. SUBMISSION & PITCH HOW-TO
  if (
    q.includes('submit') ||
    q.includes('pitch') ||
    q.includes('how to') ||
    q.includes('upload') ||
    q.includes('apply') ||
    q.includes('epdi')
  ) {
    if (isTanglish) {
      return `🚀 **புதிய புராஜெக்ட் சமர்ப்பிக்கும் முறை**:
1. மேல் பட்டியில் உள்ள **"+ Pitch Startup"** பட்டனை கிளிக் செய்யவும்.
2. **Prototype Basics**: தலைப்பு, Tagline, மற்றும் துறையை (Sector) தேர்வு செய்யவும்.
3. **Hardware BOM**: பயன்படுத்திய சிப்ஸ் (ESP32/Arduino) மற்றும் சென்சார்களைப் பட்டியலிடவும்.
4. **Budget in ₹**: பாகங்கள் செலவு (BOM Cost) மற்றும் தேவைப்படும் முதலீட்டு தொகையை உள்ளிடவும்.
5. **Demo Video**: உங்கள் ஃபோனில் எடுத்த 1-நிமிட YouTube வீடியோ லிங்கைச் சேர்க்கவும்.

சமர்ப்பித்தவுடன் அது உடனே StartBridge தளத்தில் ஏஞ்சல் முதலீட்டாளர்களுக்குத் தெரியும்!`;
    }
    return `🚀 **How to Pitch Your Startup Prototype on StartBridge**:
1. Click the **"+ Pitch Startup"** button in the top fixed navigation bar.
2. **Prototype Basics**: Provide your title, one-line tagline, and sector (Healthcare, Agri, CleanTech, EdTech, DeepTech).
3. **Hardware BOM**: List your microcontrollers (ESP32, Pico, Jetson) and sensors.
4. **Financials in ₹**: Enter estimated build cost and pre-seed request (e.g. ₹3,00,000).
5. **Demo Video**: Add a 1-minute YouTube unlisted/public video link showing your physical prototype working.
6. **Patent Status**: Select Provisional Patent, Utility Patent, or Open Source.

Your project instantly goes live on the StartBridge feed for verified angels!`;
  }

  // 16. PATENTS & IP ADVICE
  if (q.includes('patent') || q.includes('ip') || q.includes('provisional') || q.includes('utility') || q.includes('sattam')) {
    return `🛡️ **Intellectual Property (IP) & Patent Guide for Students**:
1. **Provisional Patent (12-Month Shield)**:
   • Best for university students before demo pitch day. Protects your priority filing date for 12 months with low paperwork costs.
2. **Utility Patent**:
   • Full protection for the functional mechanism. Requires formal patent claims and attorney review.
3. **Open Source**:
   • Great for accessibility boards (like CodeSculpt) where wide public adoption is the priority.
4. **StartBridge IP Policy**:
   • All patent statuses on StartBridge are self-reported for educational demo transparency.`;
  }

  // 17. HARDWARE SENSORS & BOM ADVICE
  if (q.includes('sensor') || q.includes('esp32') || q.includes('arduino') || q.includes('raspberry') || q.includes('hardware') || q.includes('parts')) {
    return `🛠️ **Hardware Prototyping & Sensor Guidelines**:
• **Compute Boards**:
  - IoT & Sensors: **ESP32 Dual-Core** (WiFi + Bluetooth, under ₹500)
  - Edge AI / Audio: **Raspberry Pi Pico** or **ARM Cortex-M4** (under ₹1,000)
  - Computer Vision / Drones: **NVIDIA Jetson Nano/Orin** or **Raspberry Pi CM4**
• **Long Range Wireless**: Use **LoRa radio** for farm soil sensors to avoid monthly SIM costs.
• **Keep BOM Low**: Early investors look for BOM costs that leave a healthy 65%+ profit margin when mass-produced.`;
  }

  // DEFAULT CONTEXT-AWARE RESPONSE
  if (isTanglish) {
    return `நான் உங்களுக்கு உதவ தயாராக உள்ளேன்! நீங்கள் கேட்க விரும்பும் தலைப்பைத் தேர்ந்தெடுக்கவும்:

• **"Healthcare"** அல்லது **"AgriTech"** என்று டைப் செய்து புராஜெக்ட்களைப் பார்க்கவும்.
• **"CardioMesh"**, **"CeresEdge"**, அல்லது **"AquaFilter"** பற்றி அறியவும்.
• **"Investors"** என்று டைப் செய்து ஏஞ்சல் முதலீட்டாளர்களின் காசோலை வரம்புகளைப் பார்க்கவும் (₹).
• **"Pitch"** என்று டைப் செய்து எப்படி உங்கள் புராஜெக்டை சமர்ப்பிப்பது என அறியவும்.

எதை பற்றி தெரிந்து கொள்ள விரும்புகிறீர்கள்?`;
  }

  return `I'm here to scout and advise on StartBridge! Here are quick things you can explore:

• **Discover Startups**: Ask about *"Healthcare"*, *"AgriTech"*, *"AquaFilter"*, *"CardioMesh"*, or *"AeroRescue"*.
• **Meet Angel Investors**: Ask about *"Dr. Vikram Patel"*, *"Sarah Jenkins"*, or *"Check sizes in ₹"*.
• **Budgeting**: Ask *"How to calculate my BOM cost in Indian Rupees?"*.
• **Pitching**: Ask *"How do I submit my hardware prototype for pre-seed funding?"*.

What would you like to explore next?`;
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
