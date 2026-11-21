/**
 * HABITAT IQ - AI Chat Assistant ("Habi") Configuration
 * 
 * Hackathon: ASTRA 2026 | ANTERiX Club, VIT Bhopal
 * 
 * ============================================================================
 * HOW TO TURN REAL AI MODE ON OR OFF:
 * ============================================================================
 * 1. To turn ON Real AI Mode:
 *    - Paste your Google Gemini API key into `apiKey` below (e.g. 'AIzaSy...').
 *    - Set `enabled: true`.
 * 2. To turn OFF Real AI Mode (Smart Fallback Mode):
 *    - Set `enabled: false` or leave `apiKey` blank.
 * 3. Habi automatically falls back to its built-in smart local brain whenever
 *    the key is missing, network is offline, or the API fails.
 * ============================================================================
 */

const CHAT_CONFIG = {
  // Assistant Identity
  botName: "Habi",
  roleTitle: "Forest Intelligence Teammate",
  platform: "HABITAT IQ",

  // Layer 1: Real AI Mode Configuration
  realAI: {
    enabled: false, // Set to true when you paste your API key below
    provider: "gemini", // "gemini" or "custom"
    apiKey: "", // <-- PASTE YOUR GEMINI API KEY HERE (keep it secret, never commit to git!)
    model: "gemini-1.5-flash",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    temperature: 0.7,
    maxOutputTokens: 300
  },

  // Layer 2: Typing Simulation Delays
  typingDelayMin: 500, // milliseconds
  typingDelayMax: 950,

  // Initial Suggestion Chips
  defaultChips: [
    "Highest risk region today",
    "Next satellite pass",
    "Show fire hotspots",
    "Run outage simulation"
  ]
};

// Export to window
window.CHAT_CONFIG = CHAT_CONFIG;
