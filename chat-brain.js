/**
 * HABITAT IQ - "Habi" AI Field Assistant Brain & Conversation Engine
 * 
 * Hackathon: ASTRA 2026 | ANTERiX Club, VIT Bhopal
 * 
 * Personality:
 * - Name: "Habi", the assistant of HABITAT IQ.
 * - Tone: warm, calm, helpful, casual, like a knowledgeable forest-research teammate.
 * - Multilingual: English, Hindi, and Hinglish. Always mirrors user's language style.
 * - Layered Brain:
 *   - Layer 1: Real AI Mode (Gemini API with live telemetry context)
 *   - Layer 2: Smart Local Brain with fuzzy matching & rich randomized variations
 *   - Layer 3: Never-break human fallback
 */

(function () {
  'use strict';

  // Assistant State & Context Memory
  const HabiBrain = {
    memory: {
      lastMentionedRegion: 'sundarbans',
      lastTopic: 'general',
      lastLanguage: 'english',
      lastReplyHash: '',
      history: [] // [{ role: 'user'|'assistant', text: '...' }]
    },

    // Initialize
    init() {
      if (window.HABITAT_DATA && window.HABITAT_DATA.regions) {
        this.memory.lastMentionedRegion = Object.keys(window.HABITAT_DATA.regions)[0] || 'sundarbans';
      }
    },

    // Reset conversation memory
    resetMemory() {
      this.memory.lastTopic = 'general';
      this.memory.lastLanguage = 'english';
      this.memory.lastReplyHash = '';
      this.memory.history = [];
      if (window.HABITAT_DATA && window.HABITAT_DATA.regions) {
        this.memory.lastMentionedRegion = Object.keys(window.HABITAT_DATA.regions)[0] || 'sundarbans';
      }
    },

    // Detect user's language style (English, Hindi Devanagari, or Hinglish)
    detectLanguage(text) {
      if (!text) return 'english';

      // Check Devanagari script (Hindi)
      if (/[\u0900-\u097F]/.test(text)) {
        return 'hindi';
      }

      const lower = text.toLowerCase();
      // Common Hinglish / Romanized Hindi keywords and abbreviations
      const hinglishTriggers = [
        'kya', 'kaise', 'kaisa', 'kaha', 'kahan', 'khn', 'kitna', 'kitni', 'kab', 'kb',
        'hai', 'hain', 'ho', 'h', 'batao', 'btao', 'bataiye', 'dekho', 'dikh',
        'dikhao', 'sunao', 'shukriya', 'dhanyawad', 'dhanyavad', 'namaste',
        'namaskar', 'haal', 'chal', 'raha', 'rha', 'yaar', 'bhai', 'dost',
        'khatra', 'aayega', 'hoga', 'mera', 'meri', 'karo', 'kar', 'do',
        'chahiye', 'thik', 'theek', 'badhiya', 'accha', 'achha', 'nahi', 'sabse'
      ];

      const words = lower.split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, ''));
      const hasHinglish = words.some(w => hinglishTriggers.includes(w));
      if (hasHinglish) {
        return 'hinglish';
      }

      return 'english';
    },

    // Pick a randomized response from an array, avoiding consecutive duplicates
    pickVariation(arr) {
      if (!arr || arr.length === 0) return '';
      if (arr.length === 1) return arr[0];

      let picked = arr[Math.floor(Math.random() * arr.length)];
      if (picked === this.memory.lastReplyHash && arr.length > 1) {
        const filtered = arr.filter(item => item !== this.memory.lastReplyHash);
        picked = filtered[Math.floor(Math.random() * filtered.length)];
      }
      this.memory.lastReplyHash = picked;
      return picked;
    },

    // Live Snapshot of Platform State
    getPlatformContext() {
      const regId = (window.appState && window.appState.currentRegionId) 
        ? window.appState.currentRegionId 
        : this.memory.lastMentionedRegion;
      
      const regionData = (window.HABITAT_DATA && window.HABITAT_DATA.regions) 
        ? (window.HABITAT_DATA.regions[regId] || window.HABITAT_DATA.regions['sundarbans'])
        : null;

      const isDisrupted = (window.appState && window.appState.isDisruptionMode) || false;
      const pass = (regionData && regionData.satellitePasses) ? regionData.satellitePasses[0] : null;

      return {
        activeRegionId: regId,
        regionName: regionData ? regionData.name : 'Sundarbans Biosphere',
        ecoType: regionData ? regionData.ecoType : 'Mangrove Delta',
        riskScore: regionData ? regionData.overallRiskScore : 54,
        riskLevel: regionData ? regionData.overallRiskLevel : 'Moderate',
        ndvi: regionData ? regionData.vegetation.ndviCurrent : 0.73,
        canopyCover: regionData ? regionData.vegetation.canopyCover : '78.4%',
        activeAlertsCount: regionData ? regionData.threats.length : 3,
        threats: regionData ? regionData.threats : [],
        nextPassSat: pass ? pass.satellite : 'EOS-04',
        nextPassTime: pass ? pass.startTimeIST : '04:22 IST',
        nextPassCountdown: pass ? pass.passStart : 'In 12 mins',
        isDisrupted: isDisrupted,
        forecastTomorrow: (regionData && regionData.forecast7Day) ? regionData.forecast7Day.scores[1] : 62,
        forecastSummary: (regionData && regionData.forecast7Day) ? regionData.forecast7Day.summary : ''
      };
    },

    // Execute Map & Dashboard Commands safely
    executePlatformAction(cmd, payload) {
      try {
        if (cmd === 'fly_region' && payload) {
          if (typeof window.switchRegion === 'function') {
            window.switchRegion(payload);
            this.memory.lastMentionedRegion = payload;
          }
          return true;
        }

        if (cmd === 'switch_basemap' && payload) {
          if (typeof window.switchBasemap === 'function') {
            window.switchBasemap(payload);
          }
          return true;
        }

        if (cmd === 'toggle_disruption') {
          const toggle = document.getElementById('disruptionToggle');
          if (toggle) toggle.click();
          return true;
        }

        if (cmd === 'show_fire_hotspots') {
          const chk = document.getElementById('chkLayerFire');
          if (chk && !chk.checked) chk.click();
          const ctx = this.getPlatformContext();
          const fireThreat = ctx.threats.find(t => t.type.toLowerCase().includes('fire'));
          if (fireThreat && typeof window.zoomToThreat === 'function') {
            window.zoomToThreat(fireThreat.lat, fireThreat.lng);
          }
          return true;
        }

        if (cmd === 'show_threats') {
          const chk = document.getElementById('chkLayerThreats');
          if (chk && !chk.checked) chk.click();
          const sec = document.getElementById('dashboard');
          if (sec) sec.scrollIntoView({ behavior: 'smooth' });
          return true;
        }

        if (cmd === 'show_corridors') {
          const chk = document.getElementById('chkLayerCorridors');
          if (chk && !chk.checked) chk.click();
          return true;
        }

        if (cmd === 'scroll_to_section' && payload) {
          const target = document.querySelector(payload);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
      } catch (err) {
        console.warn('[Habi] Action execution failed gracefully:', err);
      }
      return false;
    },

    // ========================================================================
    // LAYER 1: REAL AI MODE (Google Gemini API with Live Telemetry Context)
    // ========================================================================
    async sendToAI(userPrompt, platformCtx) {
      const cfg = window.CHAT_CONFIG && window.CHAT_CONFIG.realAI;
      if (!cfg || !cfg.enabled || !cfg.apiKey || cfg.apiKey.trim() === '') {
        return null; // Cascades to Layer 2 Smart Fallback
      }

      const systemPrompt = `You are "Habi", the friendly, knowledgeable forest-research teammate and assistant for HABITAT IQ (ASTRA 2026 hackathon project, VIT Bhopal).
Tone: warm, calm, helpful, casual, teammate vibe. Keep replies to 2-4 sentences unless the user explicitly asks for deep detail.
Language: Match the user's language style exactly (English, Hindi, or Hinglish).
CURRENT PLATFORM STATE:
- Active Region: ${platformCtx.regionName} (${platformCtx.ecoType})
- Composite Risk Score: ${platformCtx.riskScore}/100 (${platformCtx.riskLevel})
- Vegetation NDVI: ${platformCtx.ndvi} (Canopy: ${platformCtx.canopyCover})
- Active Alerts: ${platformCtx.activeAlertsCount}
- Next Satellite Pass: ${platformCtx.nextPassSat} at ${platformCtx.nextPassTime} (${platformCtx.nextPassCountdown})
- Disruption Mode: ${platformCtx.isDisrupted ? 'ACTIVE (Store-and-forward RFC 5050 DTN)' : 'NOMINAL (Direct LEO)'}
- Tomorrow's Projected Risk: ${platformCtx.forecastTomorrow}/100

If user asks to view/zoom to a reserve (e.g. Kaziranga, Sundarbans, Corbett, Bandhavgarh, Western Ghats), include [ACTION:FLY:<region_id>].
If user asks to simulate disruption/outage, include [ACTION:OUTAGE].
If user asks to view satellite imagery, include [ACTION:BASEMAP:satellite].
If user asks to show fire hotspots, include [ACTION:SHOW_FIRE].
Never mention you are an AI or language model. Answer off-topic questions in 1-2 friendly sentences and bridge back to HABITAT IQ.`;

      // Build conversation turns
      const contents = [];
      contents.push({ role: 'user', parts: [{ text: systemPrompt }] });
      contents.push({ role: 'model', parts: [{ text: "Understood! I'm Habi, ready with live ISRO telemetry. Let's protect the habitat!" }] });

      // Add recent turns from memory
      const recentHistory = this.memory.history.slice(-8);
      recentHistory.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });

      contents.push({ role: 'user', parts: [{ text: userPrompt }] });

      try {
        const url = `${cfg.endpoint}?key=${cfg.apiKey}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: cfg.temperature || 0.7,
              maxOutputTokens: cfg.maxOutputTokens || 350
            }
          })
        });

        if (!resp.ok) {
          console.warn('[Habi] Gemini API returned non-OK status:', resp.status);
          return null;
        }

        const data = await resp.json();
        const rawReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawReply) return null;

        // Parse and execute action tags
        let cleanReply = rawReply;
        if (cleanReply.includes('[ACTION:FLY:')) {
          const match = cleanReply.match(/\[ACTION:FLY:(\w+)\]/);
          if (match && match[1]) this.executePlatformAction('fly_region', match[1].toLowerCase());
          cleanReply = cleanReply.replace(/\[ACTION:FLY:\w+\]/g, '').trim();
        }
        if (cleanReply.includes('[ACTION:OUTAGE]')) {
          this.executePlatformAction('toggle_disruption');
          cleanReply = cleanReply.replace(/\[ACTION:OUTAGE\]/g, '').trim();
        }
        if (cleanReply.includes('[ACTION:BASEMAP:')) {
          const match = cleanReply.match(/\[ACTION:BASEMAP:(\w+)\]/);
          if (match && match[1]) this.executePlatformAction('switch_basemap', match[1]);
          cleanReply = cleanReply.replace(/\[ACTION:BASEMAP:\w+\]/g, '').trim();
        }
        if (cleanReply.includes('[ACTION:SHOW_FIRE]')) {
          this.executePlatformAction('show_fire_hotspots');
          cleanReply = cleanReply.replace(/\[ACTION:SHOW_FIRE\]/g, '').trim();
        }

        return cleanReply;
      } catch (err) {
        console.warn('[Habi] Gemini API call error:', err);
        return null;
      }
    },

    // ========================================================================
    // LAYER 2: SMART LOCAL BRAIN (Fuzzy Matcher & Rich Variations)
    // ========================================================================
    generateLocalResponse(userPrompt, platformCtx) {
      const rawTrimmed = userPrompt.trim();
      const q = rawTrimmed.toLowerCase();
      const lang = this.detectLanguage(rawTrimmed);
      this.memory.lastLanguage = lang;

      // Fuzzy Region Detection (handles typos and colloquial spellings)
      let detectedRegion = null;
      if (/kazi|kzrnga|kzrng|kaziranga/i.test(q)) detectedRegion = 'kaziranga';
      else if (/sundar|sunder|sndrbn|sunderbans/i.test(q)) detectedRegion = 'sundarbans';
      else if (/corbett|corbet|jim\s*corbett/i.test(q)) detectedRegion = 'corbett';
      else if (/bandhav|bandhogarh|bandhavgarh/i.test(q)) detectedRegion = 'bandhavgarh';
      else if (/ghat|western\s*ghat|wayanad|nilgiri/i.test(q)) detectedRegion = 'western-ghats';

      if (detectedRegion) {
        this.memory.lastMentionedRegion = detectedRegion;
      }

      const activeRegKey = this.memory.lastMentionedRegion;
      const targetReg = (window.HABITAT_DATA && window.HABITAT_DATA.regions) 
        ? (window.HABITAT_DATA.regions[activeRegKey] || window.HABITAT_DATA.regions['sundarbans']) 
        : null;

      // ----------------------------------------------------------------------
      // 1. GREETINGS (hi, hello, hey, hey Habi, namaste, kaise ho, kya haal hai)
      // ----------------------------------------------------------------------
      const isGreeting = /^(hi|hello|hey|heya|yo|namaste|namaskar|good\s*(morning|afternoon|evening)|kaise\s*ho|kya\s*haal|kaisa\s*hai|kem\s*cho|hey\s*habi|hello\s*habi|hi\s*habi)\b/i.test(q)
        || q === 'hi' || q === 'hello' || q === 'hey' || q === 'namaste' || q === 'kaise ho' || q === 'hey habi';

      if (isGreeting) {
        this.memory.lastTopic = 'greetings';
        if (lang === 'hindi') {
          return {
            text: this.pickVariation([
              "नमस्ते! मैं हाबी हूँ, आपका वन अनुसंधान साथी। आज किस रिज़र्व की स्थिति देखनी है?",
              "नमस्कार! इसरो टेलीमेट्री सक्रिय है। आप आग का जोखिम, उपग्रह पास या वन्यजीव गलियारे देख सकते हैं। बताइए क्या मदद करूँ?",
              "नमस्ते! सब सुरक्षित है। मैं हाबी हूँ—सुंदरबन, काज़ीरंगा या कॉर्बेट के बारे में क्या जानना चाहते हैं?",
              "नमस्कार! मैं हाबी हूँ। लाइव सेटेलाइट मैप और वन जोखिम डेटा तैयार है। आज हम क्या जांचें?"
            ]),
            chips: ["काज़ीरंगा का जोखिम", "अगला उपग्रह पास", "आग के हॉटस्पॉट", "आउटेज सिमुलेशन"]
          };
        } else if (lang === 'hinglish') {
          return {
            text: this.pickVariation([
              "Arre hello! Main Habi hoon, aapka forest intelligence teammate. Aaj kis reserve ka live data dekhna hai?",
              "Hey! Habi yahan. Main ISRO telemetry aur forest alerts track kar raha hoon. Batao, fire risk check karein ya satellite pass?",
              "Namaste! Sab badhiya chal raha hai ground pe. Main Habi hoon—batao Corbett, Kaziranga ya Sundarbans mein kya dekhna hai?",
              "Hey dost! Main Habi hoon. Live satellite feeds ready hain. Next pass timing dekhni hai ya map pe kisi reserve pe zoom karein?",
              "Hello! Habi hazir hai. Flood alerts, fire risk, ya upcoming satellite contact—kismein madad karoon aaj?"
            ]),
            chips: ["Kaziranga ka risk", "Next satellite pass", "Fire hotspots dikhao", "Outage simulation chalao"]
          };
        } else {
          return {
            text: this.pickVariation([
              "Hey there! I'm Habi, your field intelligence teammate. What reserve are we looking at today?",
              "Hello! Habi here, ready with the latest ISRO telemetry. Want to check fire risks, satellite passes, or fly the map?",
              "Hey! Good to see you. I'm keeping an eye on Indian forest reserves and satellite passes. How can I assist your field operations?",
              "Hi! Habi at your service. Whether it's tracking tiger corridors, checking flood risk, or planning a pass uplink, I've got you covered.",
              "Hello teammate! All orbital feeds are live and nominal. What would you like to explore first?",
              "Hey! Habi here. Ready to inspect forest health, run a pass schedule, or inspect active alerts across Indian reserves?"
            ]),
            chips: ["Highest risk region today", "Next satellite pass", "Show fire hotspots", "Run outage simulation"]
          };
        }
      }

      // ----------------------------------------------------------------------
      // 2. IDENTITY & CAPABILITIES (who are you, what can you do)
      // ----------------------------------------------------------------------
      if (q.includes('who are you') || q.includes('who r u') || q.includes('tum kaun') || q.includes('aap kaun') || q.includes('what is your name') || q.includes('naam kya')) {
        this.memory.lastTopic = 'identity';
        if (lang === 'hinglish') {
          return {
            text: "Main Habi hoon, HABITAT IQ ka dedicated field assistant! Ek tarah se aapka forest-research teammate samjho. Main ISRO ke Bhuvan, MOSDAC aur VEDAS data se fire risk, wildlife corridors aur satellite passes track karta hoon.",
            chips: ["Tum kya kar sakte ho?", "Highest risk region", "Live map dikhao", "Satellite pass timing"]
          };
        } else if (lang === 'hindi') {
          return {
            text: "मैं हाबी हूँ, HABITAT IQ का सहायक! मैं इसरो के भुवन, मोसडैक और वेदास डेटा के ज़रिए वन सुरक्षा, वन्यजीव गलियारों और उपग्रह संपर्क का विश्लेषण करता हूँ।",
            chips: ["आप क्या कर सकते हैं?", "सबसे अधिक जोखिम वाला क्षेत्र", "उपग्रह पास समय"]
          };
        } else {
          return {
            text: this.pickVariation([
              "I'm Habi, the intelligence assistant for HABITAT IQ! Think of me as your forest-monitoring and satellite telemetry teammate. I help field rangers and researchers track risks, monitor wildlife corridors, and plan report transmissions using ISRO data.",
              "I'm Habi! Your forest intelligence teammate built for ASTRA 2026. I connect orbital Earth observation from ISRO with ranger ground reality—tracking fire, flood, wildlife bottlenecks, and satellite windows."
            ]),
            chips: ["What can you do?", "Highest risk region today", "Next satellite pass", "Fly to Kaziranga"]
          };
        }
      }

      if (q.includes('what can you do') || q.includes('kya kar sakte') || q.includes('kya help') || q.includes('features') || q.includes('help me')) {
        this.memory.lastTopic = 'capabilities';
        if (lang === 'hinglish') {
          return {
            text: "Main live map control kar sakta hoon, fire hotspots aur flood alerts dikha sakta hoon, satellite pass timing bata sakta hoon, aur outage ke waqt report backup test kar sakta hoon. Kuch bhi tap ya command karke dekho!",
            chips: ["Corbett pe zoom karo", "Fire hotspots dikhao", "Next pass timing", "Outage simulation"]
          };
        } else if (lang === 'hindi') {
          return {
            text: "मैं लाइव सेटेलाइट मैप नियंत्रित कर सकता हूँ, आग और बाढ़ की चेतावनी दिखा सकता हूँ, उपग्रह पास समय बता सकता हूँ, और संचार अवरोध का सिमुलेशन चला सकता हूँ।",
            chips: ["काज़ीरंगा पर ज़ूम करें", "आग के हॉटस्पॉट", "आउटेज टेस्ट"]
          };
        } else {
          return {
            text: this.pickVariation([
              "I can fly the map to Indian reserves, inspect vegetation health (NDVI), show fire hotspots and flood risks, predict upcoming satellite passes, and test our delay-tolerant backup if links go down. Try tapping one of the chips below!",
              "Plenty of things! I can command the satellite map, analyze 7-day risk forecasts, track elephant and tiger corridors, calculate field distances, and schedule sensor report uplinks to ISRO passes."
            ]),
            chips: ["Zoom to Kaziranga", "Show fire hotspots", "Next satellite pass", "Run outage simulation"]
          };
        }
      }

      // ----------------------------------------------------------------------
      // 3. GRATITUDE & COMPLIMENTS (thanks, thank you, shukriya, you are good)
      // ----------------------------------------------------------------------
      if (q.includes('thank') || q.includes('thx') || q.includes('shukriya') || q.includes('dhanyawad') || q.includes('good job') || q.includes('nice') || q.includes('you are good') || q.includes('badhiya') || q.includes('shabaash')) {
        this.memory.lastTopic = 'gratitude';
        if (lang === 'hinglish') {
          return {
            text: this.pickVariation([
              "Arre koi baat nahi! Ranger teams ki madad karna hi mera kaam hai. Aur kuch check karna hai?",
              "Shukriya dost! Khushi hui ki kaam aaya. Ground pe sab safe rahe, bas yahi mission hai.",
              "Most welcome! Agar kisi aur reserve ka data ya satellite window dekhna ho toh batao."
            ]),
            chips: ["Next satellite pass", "Highest fire risk", "Outage simulation", "Map dikhao"]
          };
        } else if (lang === 'hindi') {
          return {
            text: "आपका बहुत धन्यवाद! वन सुरक्षा में आपकी सहायता करना मेरा कर्तव्य है। आगे क्या देखना चाहेंगे?",
            chips: ["अगला उपग्रह पास", "आग का जोखिम", "वन्यजीव गलियारे"]
          };
        } else {
          return {
            text: this.pickVariation([
              "You're very welcome! Always happy to keep our field operations running smoothly. What else can I pull up for you?",
              "Glad I could help! Protecting the habitat and keeping teams connected is what I'm built for.",
              "Anytime! Let me know if you need to schedule another report or inspect telemetry elsewhere."
            ]),
            chips: ["Next satellite pass", "Highest risk region today", "Show fire hotspots", "Run outage simulation"]
          };
        }
      }

      // ----------------------------------------------------------------------
      // 4. GOODBYES (bye, see you, cya, alvida)
      // ----------------------------------------------------------------------
      if (/^(bye|goodbye|cya|see you|alvida|chalo bye|tata)\b/i.test(q)) {
        this.memory.lastTopic = 'goodbye';
        if (lang === 'hinglish') {
          return {
            text: "Chalo phir milte hain! Field patrol pe safe rehna aur satellite links check karte rehna.",
            chips: ["Hi Habi", "Next satellite pass", "Map pe jao"]
          };
        } else if (lang === 'hindi') {
          return {
            text: "अलविदा! वन क्षेत्र में सुरक्षित रहें। किसी भी उपग्रह या जोखिम जानकारी के लिए मैं यहीं हूँ।",
            chips: ["नमस्ते", "काज़ीरंगा का जोखिम"]
          };
        } else {
          return {
            text: this.pickVariation([
              "Catch you later! Stay safe out on the field, and keep your communication links clear.",
              "Goodbye! Habi is always on standby whenever you need telemetry updates. Safe patrolling!"
            ]),
            chips: ["Hi Habi", "Highest risk region today", "Open Live Map"]
          };
        }
      }

      // ----------------------------------------------------------------------
      // 5. JOKES & HUMOR (tell me a joke, joke sunao, make me laugh)
      // ----------------------------------------------------------------------
      if (q.includes('joke') || q.includes('funny') || q.includes('hanso') || q.includes('chutkula')) {
        this.memory.lastTopic = 'joke';
        const jokesEn = [
          "Why don't tigers play hide and seek in the grasslands? Because they're always spotted! 🐅 Now, want to check real tiger corridors?",
          "Why did the satellite go to school? To improve its orbit-tunity! 🛰️ Speaking of satellites, our next pass is approaching soon.",
          "What did one mangrove tree say to the other during the storm? 'Hold on tight, our roots run deep!' 🌊 How about checking Sundarbans surge risk?"
        ];
        const jokesHi = [
          "Tigers kabhi hide and seek kyun nahi khelte? Kyunki wo hamesha 'spotted' ho jaate hain! 🐅 Chalo ab real tiger tracking karein?",
          "Ek satellite ne dusre se kya kaha? 'Mujhe thoda space chahiye!' 🛰️ Chalo ab serious telemetry pe wapas aate hain."
        ];
        return {
          text: (lang === 'hinglish' || lang === 'hindi') ? this.pickVariation(jokesHi) : this.pickVariation(jokesEn),
          chips: ["Next satellite pass", "Highest risk region today", "Show wildlife corridors", "Fly to Corbett"]
        };
      }

      // ----------------------------------------------------------------------
      // 6. MATH CALCULATIONS ("what is 12 times 8", "12*8", "15 + 27", etc.)
      // ----------------------------------------------------------------------
      const mathMatch = q.match(/(\d+)\s*(times|\*|x|multiplied by|\+|\-|\/|divided by)\s*(\d+)/i)
        || q.match(/what is\s*(\d+)\s*([\+\-\*\/])\s*(\d+)/i);

      if (mathMatch) {
        this.memory.lastTopic = 'math';
        let num1 = parseFloat(mathMatch[1]);
        let op = mathMatch[2].toLowerCase();
        let num2 = parseFloat(mathMatch[3]);
        let ans = 0;

        if (op === 'times' || op === '*' || op === 'x' || op === 'multiplied by') ans = num1 * num2;
        else if (op === '+') ans = num1 + num2;
        else if (op === '-') ans = num1 - num2;
        else if (op === '/' || op === 'divided by') ans = (num2 !== 0) ? (num1 / num2).toFixed(2) : 'undefined (cannot divide by zero)';

        if (lang === 'hinglish') {
          return {
            text: `${num1} ${op} ${num2} ka answer hai **${ans}**. Quick field math ho gaya! Ab batao, kisi coordinate ya buffer zone ka calculation karna hai?`,
            chips: ["Highest risk region", "Next satellite pass", "Map pe dikhao"]
          };
        } else {
          return {
            text: `${num1} ${op} ${num2} is **${ans}**. Quick ranger math for you! Anything else you need to calculate for field coordinates or risk buffer zones?`,
            chips: ["Highest risk region today", "Next satellite pass", "Fly to Kaziranga"]
          };
        }
      }

      // ----------------------------------------------------------------------
      // 7. GENERAL KNOWLEDGE & OFF-TOPIC QUESTIONS
      // ----------------------------------------------------------------------
      if (q.includes('prime minister of india') || q.includes('pm of india') || q.includes('modi')) {
        return {
          text: (lang === 'hinglish')
            ? "India ke Prime Minister Narendra Modi hain. Waise, agar aapko Indian forest reserves ya Delhi ke upar se guzarne wale ISRO satellite passes dekhne hain, toh main bilkul ready hoon!"
            : "The Prime Minister of India is Narendra Modi. Now, if you want to inspect Indian forest reserves or upcoming ISRO satellite passes over the country, I'm right here!",
          chips: ["Highest risk region today", "Next satellite pass", "Kaziranga risk", "Corbett fire status"]
        };
      }

      if (q.includes('capital of france') || q.includes('paris')) {
        return {
          text: (lang === 'hinglish')
            ? "France ki capital Paris hai. Lekin agar natural ecosystem capitals ki baat karein, toh hamara Sundarbans mangrove delta bhi utna hi world-famous hai!"
            : "The capital of France is Paris. Though if we're talking capital ecosystems, India's Sundarbans mangrove biosphere is just as globally renowned!",
          chips: ["Sundarbans ka risk", "Next satellite pass", "Kaziranga zoom karo"]
        };
      }

      if (q.includes('vit bhopal') || q.includes('anterix') || q.includes('astra')) {
        return {
          text: "HABITAT IQ is built for **ASTRA 2026**, organized by the **ANTERiX Club at VIT Bhopal**. It pairs space-service resilience with ISRO Earth observation to safeguard endangered habitats!",
          chips: ["How it works", "ISRO data sources", "Open live map"]
        };
      }

      // ----------------------------------------------------------------------
      // 8. FOLLOW-UPS ("and what about tomorrow?", "and its risk?", "show it on the map")
      // ----------------------------------------------------------------------
      if (q.includes('tomorrow') || q.includes('kal') || q.includes('next day')) {
        this.memory.lastTopic = 'tomorrow';
        const tomorrowScore = targetReg ? targetReg.forecast7Day.scores[1] : 62;
        const conf = targetReg ? targetReg.forecast7Day.confidence : '88% confidence';

        if (lang === 'hinglish') {
          return {
            text: `Kal ke liye **${targetReg.name}** ka predicted vulnerability score **${tomorrowScore}/100** hai (${conf}). ${targetReg.forecast7Day.summary}`,
            chips: ["Day after tomorrow?", "Current fire risk", "Satellite pass timing", "Map pe dikhao"]
          };
        } else if (lang === 'hindi') {
          return {
            text: `कल के लिए **${targetReg.name}** का अनुमानित जोखिम स्कोर **${tomorrowScore}/100** है (${conf})। ${targetReg.forecast7Day.summary}`,
            chips: ["वर्तमान जोखिम", "उपग्रह पास समय"]
          };
        } else {
          return {
            text: `For **${targetReg.name}**, tomorrow's predicted vulnerability score is **${tomorrowScore}/100** (${conf}). ${targetReg.forecast7Day.summary}`,
            chips: ["What about Day +2?", "Explain this risk score", "Next satellite pass", "Show on map"]
          };
        }
      }

      if (q === 'and its risk?' || q.includes('its risk') || q.includes('iska risk') || q.includes('aur iska')) {
        this.memory.lastTopic = 'risk';
        return {
          text: `For **${targetReg.name}**, the composite risk is **${targetReg.overallRiskScore}/100 (${targetReg.overallRiskLevel})**. Fire: ${targetReg.riskBreakdown.fire.score}, Flood: ${targetReg.riskBreakdown.flood.score}, Landslide: ${targetReg.riskBreakdown.landslide.score}. ${targetReg.whyScore}`,
          chips: ["What about tomorrow?", "Next satellite pass", "Show on map"]
        };
      }

      if (q.includes('show on map') || q.includes('show it on the map') || q.includes('map pe dikhao') || q.includes('take me there') || q.includes('zoom there')) {
        this.executePlatformAction('fly_region', activeRegKey);
        return {
          text: (lang === 'hinglish') 
            ? `Done! Live map ko **${targetReg.name}** pe fly kar diya hai. Wahan ke forest boundaries aur telemetry pins active hain.`
            : `Done! Flying the live satellite map to **${targetReg.name}** now. Overlays and telemetry pins are loaded.`,
          chips: ["Next satellite pass", "Show fire hotspots", "What about tomorrow?"]
        };
      }

      // ----------------------------------------------------------------------
      // 9. MAP & DASHBOARD COMMANDS ("zoom to Corbett", "show fire hotspots", "switch to satellite view", "run outage simulation")
      // ----------------------------------------------------------------------
      if (q.includes('zoom to') || q.includes('fly to') || q.includes('go to') || q.includes('show me kaziranga') || q.includes('show me corbett') || q.includes('show me sundarbans') || q.includes('show me bandhavgarh') || q.includes('show me western ghats')) {
        this.memory.lastTopic = 'map_command';
        let targetKey = activeRegKey;
        if (q.includes('kaziranga')) targetKey = 'kaziranga';
        else if (q.includes('corbett')) targetKey = 'corbett';
        else if (q.includes('sundarban')) targetKey = 'sundarbans';
        else if (q.includes('bandhav')) targetKey = 'bandhavgarh';
        else if (q.includes('ghat') || q.includes('western')) targetKey = 'western-ghats';

        this.executePlatformAction('fly_region', targetKey);
        const name = window.HABITAT_DATA.regions[targetKey].name;

        if (lang === 'hinglish') {
          return {
            text: `Done, flying to **${name}** now! Live map center ho gaya hai aur dashboard charts sync ho gaye hain.`,
            chips: ["Wahan ka fire risk?", "Next satellite pass", "What about tomorrow?"]
          };
        } else {
          return {
            text: `Done, flying to **${name}** now. The live map, vegetation NDVI curve, and orbital pass schedules have all synced.`,
            chips: ["Explain this risk score", "Next satellite pass", "Show fire hotspots", "What about tomorrow?"]
          };
        }
      }

      if (q.includes('fire hotspot') || q.includes('fire layer') || q.includes('show fire') || q.includes('aag dikhao')) {
        this.executePlatformAction('show_fire_hotspots');
        if (lang === 'hinglish') {
          return {
            text: "Fire hotspots layer turn on kar diya hai aur active thermal anomalies map pe highlight ho gayi hain. Bandhavgarh aur Corbett mein highest thermal activity hai.",
            chips: ["Bandhavgarh zoom karo", "Corbett fire risk", "Outage simulation"]
          };
        } else {
          return {
            text: "Done, active fire hotspots layer enabled on the live map. Thermal anomalies from MOSDAC INSAT-3DR are highlighted with pulsing markers.",
            chips: ["Zoom to Bandhavgarh", "Corbett fire risk", "Next satellite pass"]
          };
        }
      }

      if (q.includes('switch to satellite') || q.includes('satellite view') || q.includes('satellite mode')) {
        this.executePlatformAction('switch_basemap', 'satellite');
        return {
          text: "Switched the live map to **Satellite Mode (ISRO Bhuvan / Global EO)**. High-resolution multispectral imagery is active.",
          chips: ["Zoom to Kaziranga", "Show fire hotspots", "Next satellite pass"]
        };
      }

      if (q.includes('switch to terrain') || q.includes('terrain view') || q.includes('terrain mode')) {
        this.executePlatformAction('switch_basemap', 'terrain');
        return {
          text: "Switched to **Terrain & Contour Mode**. Elevation and slope topography are now clearly highlighted.",
          chips: ["Switch back to satellite", "Check landslide risk", "Zoom to Western Ghats"]
        };
      }

      if (q.includes('outage') || q.includes('disruption') || q.includes('reschedule')) {
        this.executePlatformAction('toggle_disruption');
        if (lang === 'hinglish') {
          return {
            text: "Space-Service Disruption Simulation activate kar di hai! Map pe storm attenuation cloud dikh raha hai aur sabhi queued reports automatically Delay-Tolerant Networking (RFC 5050 Bundle Protocol) backup pe shift ho gayi hain.",
            chips: ["Restore normal link", "Queued reports check karo", "Next backup pass"]
          };
        } else {
          return {
            text: "Space-Service Disruption Mode engaged! The primary LEO pass is marked masked due to simulated storm fade, and reports have safely migrated to the RFC 5050 store-and-forward backup queue. Notice the storm swath on the map.",
            chips: ["Restore normal link", "Check field outbox", "Next satellite pass"]
          };
        }
      }

      // ----------------------------------------------------------------------
      // 10. PLATFORM TELEMETRY QUESTIONS (fire risk, pass timing, risk scores)
      // ----------------------------------------------------------------------

      // A. Highest Fire Risk Across All Reserves
      const isHighestFire = (q.includes('highest') || q.includes('sabse zyada') || q.includes('sabse jyada') || q.includes('max')) 
        && (q.includes('fire') || q.includes('aag') || q.includes('risk'));

      if (isHighestFire) {
        this.memory.lastTopic = 'highest_fire';
        let highest = null;
        let maxFire = -1;
        for (const k in window.HABITAT_DATA.regions) {
          const r = window.HABITAT_DATA.regions[k];
          if (r.riskBreakdown.fire.score > maxFire) {
            maxFire = r.riskBreakdown.fire.score;
            highest = r;
          }
        }
        if (lang === 'hinglish') {
          return {
            text: `Aaj sabse zyada fire risk **${highest.name}** mein hai at **${maxFire}/100** (dry bamboo fuel aur low humidity ki wajah se). Dusre number pe Jim Corbett hai (71/100). Kya aapko ${highest.name} pe zoom karna hai?`,
            chips: [`Zoom to ${highest.name.split(' ')[0]}`, "Kaziranga ka risk", "Next satellite pass"]
          };
        } else {
          return {
            text: `Based on MOSDAC thermal infrared and Bhuvan fire detection, **${highest.name}** has the highest fire risk today at **${maxFire}/100** due to dry bamboo litter and high temperatures. Corbett is also elevated at 71/100. Would you like me to fly the map there?`,
            chips: [`Zoom to ${highest.name.split(' ')[0]}`, "Show fire hotspots", "Next satellite pass", "What about tomorrow?"]
          };
        }
      }

      // B. Specific Region Fire Risk (e.g. "kaziranga ka fire risk kitna hai", "fire risk in corbett")
      const isFireSpecific = (q.includes('fire') || q.includes('aag')) && (detectedRegion || q.includes('kitna') || q.includes('score') || q.includes('kaisa') || q.includes('level') || q.includes('kaha') || q.includes('kahan') || q.includes('khn'));
      if (isFireSpecific) {
        this.memory.lastTopic = 'fire';
        const fire = targetReg.riskBreakdown.fire;
        if (lang === 'hinglish') {
          return {
            text: `**${targetReg.name}** mein fire risk filhal **${fire.score}/100 (${fire.level})** hai. ${fire.reason}. MOSDAC thermal anomaly sensors abhi stable conditions report kar rahe hain.`,
            chips: ["Show fire hotspots", "Next satellite pass", "What about tomorrow?", "Highest fire risk kahan hai?"]
          };
        } else if (lang === 'hindi') {
          return {
            text: `**${targetReg.name}** में आग का जोखिम फिलहाल **${fire.score}/100 (${fire.level})** है। ${fire.reason}। इसरो मोसडैक पर कोई सक्रिय अनियंत्रित आग दर्ज नहीं है।`,
            chips: ["आग के हॉटस्पॉट", "अगला उपग्रह पास", "कल का जोखिम"]
          };
        } else {
          return {
            text: `For **${targetReg.name}**, the fire risk currently stands at **${fire.score}/100 (${fire.level})**. Reason: ${fire.reason}. MOSDAC thermal sensors indicate no uncontained fire outbreaks at this hour.`,
            chips: ["Show fire hotspots", "Explain overall risk", "Next satellite pass", "What about tomorrow?"]
          };
        }
      }

      // C. Satellite Pass Timing (e.g. "next satellite pass kab hai", "pass timing", "satellite pass")
      if (q.includes('pass') || q.includes('satellite') || q.includes('uplink') || q.includes('timing') || q.includes('contact')) {
        this.memory.lastTopic = 'pass';
        const pass = targetReg.satellitePasses[0];
        if (lang === 'hinglish') {
          return {
            text: `**${targetReg.name}** ke liye agla ISRO pass **${pass.satellite}** (${pass.type}) hai, **${pass.startTimeIST}** pe (${pass.passStart}). Contact duration **${pass.durationFormatted}** hai aur signal quality **${pass.signalQuality}** hai.`,
            chips: ["Kaziranga ka pass", "Sundarbans ka pass", "Run outage simulation"]
          };
        } else if (lang === 'hindi') {
          return {
            text: `**${targetReg.name}** के लिए अगला इसरो उपग्रह पास **${pass.satellite}** है, जो **${pass.startTimeIST}** (${pass.passStart}) पर पहुंचेगा। सिग्नल गुणवत्ता: ${pass.signalQuality}।`,
            chips: ["सुंदरबन का पास", "आउटेज सिमुलेशन"]
          };
        } else {
          return {
            text: `For **${targetReg.name}**, the next ISRO pass is **${pass.satellite}** (${pass.type}) arriving at **${pass.startTimeIST}** (${pass.passStart}). Max elevation is **${pass.maxElevation}** with a duration of **${pass.durationFormatted}**.`,
            chips: ["Pass for Kaziranga", "Pass for Sundarbans", "Run outage simulation", "What about tomorrow?"]
          };
        }
      }

      // D. Overall Region Risk & Risk Scores (e.g. "kaziranga ka risk btao", "explain risk score")
      if (q.includes('risk') || q.includes('khatra') || q.includes('score') || q.includes('vulnerability')) {
        this.memory.lastTopic = 'risk';
        if (lang === 'hinglish') {
          return {
            text: `**${targetReg.name}** ka composite vulnerability score **${targetReg.overallRiskScore}/100 (${targetReg.overallRiskLevel})** hai. Fire: ${targetReg.riskBreakdown.fire.score}, Flood: ${targetReg.riskBreakdown.flood.score}, Landslide: ${targetReg.riskBreakdown.landslide.score}. ${targetReg.whyScore}`,
            chips: ["Kal ka risk kya hai?", "Next satellite pass", "Show on map", "Fire hotspots dikhao"]
          };
        } else if (lang === 'hindi') {
          return {
            text: `**${targetReg.name}** का कुल जोखिम स्कोर **${targetReg.overallRiskScore}/100 (${targetReg.overallRiskLevel})** है। कारण: ${targetReg.whyScore}`,
            chips: ["कल का जोखिम", "अगला उपग्रह पास", "नक्शे पर दिखाएं"]
          };
        } else {
          return {
            text: `For **${targetReg.name}**, the composite vulnerability index is **${targetReg.overallRiskScore}/100 (${targetReg.overallRiskLevel})**. Fire: ${targetReg.riskBreakdown.fire.score}, Flood: ${targetReg.riskBreakdown.flood.score}, Landslide: ${targetReg.riskBreakdown.landslide.score}. Rationale: ${targetReg.whyScore}`,
            chips: ["What about tomorrow?", "Next satellite pass", "Show on map", "Show fire hotspots"]
          };
        }
      }

      // E. Wildlife & Corridors (tiger, rhino, elephant, wildlife)
      if (q.includes('wildlife') || q.includes('corridor') || q.includes('tiger') || q.includes('rhino') || q.includes('elephant') || q.includes('animal') || q.includes('janwar')) {
        this.memory.lastTopic = 'wildlife';
        const speciesList = targetReg.wildlife.map(w => `${w.species} (${w.status})`).join(', ');
        if (lang === 'hinglish') {
          return {
            text: `**${targetReg.name}** ke wildlife corridor telemetry mein tracked species hain: **${speciesList}**. Bottleneck Index: **${targetReg.corridorHealth.bottleneckIndex}/100** with ${targetReg.corridorHealth.vulnerableSegments} sensitive migration zones.`,
            chips: ["Show corridors on map", "Next satellite pass", "Zoom to region"]
          };
        } else {
          return {
            text: `In **${targetReg.name}**, key tracked species include **${speciesList}**. The Corridor Bottleneck Index is **${targetReg.corridorHealth.bottleneckIndex}/100** with ${targetReg.corridorHealth.vulnerableSegments} vulnerable pinch-points identified via VEDAS habitat fragmentation models.`,
            chips: ["Show wildlife corridors", "Explain risk score", "Next satellite pass"]
          };
        }
      }

      // F. ISRO Portals & Data Rule
      if (q.includes('isro') || q.includes('bhuvan') || q.includes('mosdac') || q.includes('vedas') || q.includes('bhoonidhi') || q.includes('portal') || q.includes('source')) {
        this.memory.lastTopic = 'sources';
        if (lang === 'hinglish') {
          return {
            text: "HABITAT IQ sirf 4 official ISRO portals se data refer karta hai: **Bhuvan** (satellite maps & fire layers), **MOSDAC** (meteorological feeds), **VEDAS** (canopy dynamics & fragmentation), aur **Bhoonidhi** (multispectral archives). Simulated data clearly marked rehta hai.",
            chips: ["View data sources", "Highest risk region today", "Open live map"]
          };
        } else {
          return {
            text: "HABITAT IQ strictly references 4 ISRO open data portals: **Bhuvan** (geospatial layers & thermal alerts), **MOSDAC** (meteorological satellite feeds), **VEDAS** (vegetation health & canopy dynamics), and **Bhoonidhi** (open Earth observation archives).",
            chips: ["View data sources", "Highest risk region today", "Next satellite pass"]
          };
        }
      }

      // ----------------------------------------------------------------------
      // 11. CONFUSING / GIBBERISH MESSAGES ("asdfgh", "qwerty", etc.)
      // ----------------------------------------------------------------------
      const isGibberish = /^[^a-zA-Z0-9]+$/.test(q) || /^(asdf|qwerty|zxcv|1234|test|xyz)/i.test(q) || (q.length > 5 && !/[aeiouy]/.test(q));
      if (isGibberish) {
        if (lang === 'hinglish') {
          return {
            text: "Lagta hai signal thoda scramble ho gaya! Kya aap kisi specific forest reserve ka risk ya satellite pass timing check karna chahte the? Niche diye options tap karein:",
            chips: ["Highest risk region", "Next satellite pass", "Zoom to Kaziranga", "Outage simulation"]
          };
        } else {
          return {
            text: "Hmm, that message looked a bit scrambled on the field radio! Did you want to inspect a forest reserve, check a satellite pass, or view active fire hotspots? Tap one of these quick options:",
            chips: ["Highest risk region today", "Next satellite pass", "Zoom to Kaziranga", "Show fire hotspots"]
          };
        }
      }

      // ----------------------------------------------------------------------
      // 12. GENERAL FRIENDLY TELESCOPIC FALLBACK
      // ----------------------------------------------------------------------
      if (lang === 'hinglish') {
        return {
          text: `Samajh gaya! Yeh thoda alag sawal hai, par filhal main **${targetReg.name}** (Risk: ${targetReg.overallRiskScore}/100) aur ISRO satellite passes track kar raha hoon. Kya aap wahan ka fire risk ya agla contact window dekhna chahenge?`,
          chips: ["Next satellite pass", "Highest fire risk", "Live map dikhao", "Outage simulation"]
        };
      } else {
        return {
          text: `That touches something outside my immediate forestry telemetry sensors, but I'm right here monitoring **${targetReg.name}** (Vulnerability: ${targetReg.overallRiskScore}/100) and upcoming ISRO pass windows. How can I help with your field mission?`,
          chips: ["Highest risk region today", "Next satellite pass", "Zoom to Kaziranga", "Show fire hotspots"]
        };
      }
    },

    // ========================================================================
    // LAYER 3: MASTER PROCESSOR (Wraps Layer 1 & 2 in Bulletproof Safety)
    // ========================================================================
    async processMessage(userText) {
      if (!userText || !userText.trim()) return null;
      const cleanText = userText.trim();
      const platformCtx = this.getPlatformContext();

      // Store in conversation history
      this.memory.history.push({ role: 'user', text: cleanText });

      try {
        // Try Layer 1 (Real AI Mode)
        const aiResponse = await this.sendToAI(cleanText, platformCtx);
        if (aiResponse) {
          this.memory.history.push({ role: 'assistant', text: aiResponse });
          return {
            text: aiResponse,
            chips: ["Highest risk region today", "Next satellite pass", "Show on map", "Outage simulation"]
          };
        }

        // Layer 2: Smart Local Brain
        const localResp = this.generateLocalResponse(cleanText, platformCtx);
        this.memory.history.push({ role: 'assistant', text: localResp.text });
        return localResp;
      } catch (err) {
        console.error('[Habi] Unexpected error caught safely:', err);
        // Layer 3: Never-break human fallback
        return {
          text: "Hmm, my telemetry link had a small hiccup on that one! What forest reserve or satellite pass would you like to inspect?",
          chips: ["Highest risk region today", "Next satellite pass", "Zoom to Kaziranga", "Show fire hotspots"]
        };
      }
    }
  };

  // Export to window
  window.HabiBrain = HabiBrain;
})();
