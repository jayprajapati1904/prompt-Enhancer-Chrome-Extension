// Bytez API Configuration
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const TONE_PROMPTS = {
  professional:
    "Rewrite this prompt to be professional, formal, and unambiguous. Focus on clarity and corporate structure.",
  creative:
    "Rewrite this prompt to be more descriptive, imaginative, and engaging. Use vivid language.",
  code: "Rewrite this prompt specifically for code generation. Add technical constraints, specify the language, and ask for edge case handling.",
  concise:
    "Rewrite this prompt to be extremely concise and direct. Remove all fluff and unnecessary words.",
};

export async function enhancePrompt(text, tone) {
  try {
    const systemInstruction = `You are a prompt engineering expert. 
Task: ${TONE_PROMPTS[tone]}
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
    console.error("[Prompt Enhancer] API Error:", e);
    return { success: false, error: e.message };
  }
}
