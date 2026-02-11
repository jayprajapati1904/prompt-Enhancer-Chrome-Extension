// Background Service Worker for Prompt Enhancer
// Handles API calls to bypass page CSP restrictions

const API_URL = "https://api.bytez.com/models/v2/openai/gpt-4.1";
const API_KEY = "3a68d6d2a8c851e3a17b9caf8fe9b41a";

const TONE_PROMPTS = {
  professional:
    "Rewrite this prompt to be professional, formal, and unambiguous. Focus on clarity and corporate structure.",
  creative:
    "Rewrite this prompt to be more descriptive, imaginative, and engaging. Use vivid language.",
  code: "Rewrite this prompt specifically for code generation. Add technical constraints, specify the language, and ask for edge case handling.",
  concise:
    "Rewrite this prompt to be extremely concise and direct. Remove all fluff and unnecessary words.",
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ENHANCE_PROMPT") {
    handleEnhancePrompt(message.text, message.tone)
      .then((result) => sendResponse(result))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    // Return true to indicate we will send a response asynchronously
    return true;
  }
});

async function handleEnhancePrompt(text, tone) {
  try {
    const systemInstruction = `You are a prompt engineering expert. 
Task: ${TONE_PROMPTS[tone] || TONE_PROMPTS.professional}
Rules: Output ONLY the enhanced prompt. No explanations.`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: API_KEY },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Enhance: ${text}` },
        ],
      }),
    });

    const data = await response.json();
    const output =
      data.output?.content ||
      data.output ||
      data.choices?.[0]?.message?.content ||
      "";

    return {
      success: true,
      text: (typeof output === "string"
        ? output
        : JSON.stringify(output)
      ).trim(),
    };
  } catch (e) {
    console.error("[Prompt Enhancer BG] API Error:", e);
    return { success: false, error: e.message };
  }
}
