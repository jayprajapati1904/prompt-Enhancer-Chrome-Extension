// --- Universal Deep DOM Input Detection ---
// Supports: ChatGPT, Gemini, Perplexity, DeepSeek, Claude, and any AI chat site

export function getDeepEditableElements(root = document) {
  let elements = [];
  const candidates = root.querySelectorAll(
    'textarea, [contenteditable="true"], input[type="text"], [role="textbox"]',
  );
  elements.push(...Array.from(candidates));

  const walker = document.createTreeWalker(
    root === document ? document.body : root,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) =>
        node.shadowRoot ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
    },
  );

  while (walker.nextNode()) {
    elements.push(...getDeepEditableElements(walker.currentNode.shadowRoot));
  }
  return elements;
}

// Site-specific detection helpers
function getSiteHints() {
  const host = window.location.hostname.toLowerCase();
  const hints = {
    isPerplexity: host.includes("perplexity"),
    isDeepSeek: host.includes("deepseek"),
    isChatGPT: host.includes("chatgpt") || host.includes("chat.openai"),
    isGemini: host.includes("gemini.google"),
    isClaude: host.includes("claude.ai"),
  };
  hints.isAISite =
    hints.isPerplexity ||
    hints.isDeepSeek ||
    hints.isChatGPT ||
    hints.isGemini ||
    hints.isClaude;
  return hints;
}

export function scoreElement(el) {
  if (!el.getBoundingClientRect) return -1;
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);

  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    rect.width < 80 ||
    rect.height < 16
  )
    return -1;

  let score = 0;
  const siteHints = getSiteHints();

  // Base score from width (wider inputs are more likely to be the main input)
  score += Math.min(rect.width, 1000) / 10;

  // Textarea elements on AI sites get a strong bonus
  if (el.tagName === "TEXTAREA") {
    score += 40;
    if (siteHints.isAISite) {
      score += 60; // On AI sites, any textarea is very likely the chat input
    }
  }

  // Contenteditable elements also get a bonus on AI sites
  if (el.getAttribute("contenteditable") === "true" && siteHints.isAISite) {
    score += 50;
  }

  // Role=textbox bonus
  if (el.getAttribute("role") === "textbox") {
    score += 30;
  }

  // Gather all raw attributes for keyword matching
  const rawAttrs = (
    (el.id || "") +
    " " +
    (el.className || "") +
    " " +
    (el.getAttribute("placeholder") || "") +
    " " +
    (el.getAttribute("aria-label") || "") +
    " " +
    (el.getAttribute("name") || "") +
    " " +
    (el.getAttribute("data-testid") || "")
  ).toLowerCase();

  // Extended keyword list for AI chat sites
  const highPriorityKeywords = [
    "prompt",
    "message",
    "chat",
    "composer",
    "query",
  ];
  const mediumPriorityKeywords = [
    "ask",
    "search",
    "input",
    "question",
    "text",
    "send",
    "write",
    "type",
  ];

  if (highPriorityKeywords.some((k) => rawAttrs.includes(k))) score += 50;
  if (mediumPriorityKeywords.some((k) => rawAttrs.includes(k))) score += 30;

  // Placeholder text matching common AI chat patterns
  const placeholder = (el.getAttribute("placeholder") || "").toLowerCase();
  if (
    placeholder.includes("ask") ||
    placeholder.includes("type") ||
    placeholder.includes("message") ||
    placeholder.includes("search") ||
    placeholder.includes("anything") ||
    placeholder.includes("question")
  ) {
    score += 40;
  }

  // --- Site-specific selectors ---

  // ChatGPT
  if (el.id === "prompt-textarea") score += 100;

  // Gemini
  if (el.classList.contains("ql-editor")) score += 80;

  // Perplexity: typically a <textarea> with placeholder like "Ask anything..."
  if (siteHints.isPerplexity && el.tagName === "TEXTAREA") {
    score += 80;
  }

  // DeepSeek: typically a <textarea> in the chat interface
  if (siteHints.isDeepSeek && el.tagName === "TEXTAREA") {
    score += 80;
  }

  // Claude: contenteditable div with specific attributes
  if (siteHints.isClaude && el.getAttribute("contenteditable") === "true") {
    score += 80;
  }

  // Penalize tiny elements that are probably not the main input
  if (rect.height < 30) score -= 20;

  // Prefer elements that are currently focused
  if (document.activeElement === el) score += 20;

  return score;
}

export function findBestInput() {
  const candidates = getDeepEditableElements();
  let best = null;
  let maxScore = -1;

  candidates.forEach((el) => {
    const s = scoreElement(el);
    if (s > maxScore) {
      maxScore = s;
      best = el;
    }
  });

  return maxScore > 20 ? best : null;
}

export function getInputText(el) {
  if (!el) return "";
  return el.tagName === "INPUT" || el.tagName === "TEXTAREA"
    ? el.value
    : el.innerText;
}

export function setNativeValue(el, value) {
  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
    // Use the native setter to bypass React's controlled input handling
    const inputProto = Object.getPrototypeOf(el);
    const nativeDescriptor =
      Object.getOwnPropertyDescriptor(inputProto, "value") ||
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value") ||
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");

    if (nativeDescriptor && nativeDescriptor.set) {
      nativeDescriptor.set.call(el, value);
    } else {
      el.value = value;
    }

    // Dispatch events that React's event system will recognize
    // Focus the element first
    el.focus();

    // React 16+ uses these events via its synthetic event system
    el.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
    el.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));

    // Also try InputEvent for modern frameworks
    try {
      el.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          cancelable: true,
          inputType: "insertText",
          data: value,
        }),
      );
    } catch (e) {
      // InputEvent constructor might not be supported in all contexts
    }

    // Dispatch keyboard events to trigger any keydown/keyup handlers
    ["keydown", "keypress", "keyup"].forEach((evt) => {
      el.dispatchEvent(
        new KeyboardEvent(evt, { bubbles: true, cancelable: true }),
      );
    });
  } else {
    // Contenteditable element
    el.focus();
    el.innerText = value;
    ["input", "keydown", "keyup"].forEach((evt) =>
      el.dispatchEvent(new Event(evt, { bubbles: true, composed: true })),
    );
    // Also dispatch InputEvent for React
    try {
      el.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          composed: true,
          inputType: "insertText",
          data: value,
        }),
      );
    } catch (e) {
      // Fallback silently
    }
  }
}
