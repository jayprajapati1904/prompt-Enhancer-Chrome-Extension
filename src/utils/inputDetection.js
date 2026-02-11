// --- Universal Deep DOM Input Detection ---

export function getDeepEditableElements(root = document) {
  let elements = [];
  const candidates = root.querySelectorAll(
    'textarea, [contenteditable="true"], input[type="text"]',
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

export function scoreElement(el) {
  if (!el.getBoundingClientRect) return -1;
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);

  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    rect.width < 100 ||
    rect.height < 20
  )
    return -1;

  let score = 0;
  score += Math.min(rect.width, 1000) / 10;

  const rawAttrs = (
    (el.id || "") +
    (el.className || "") +
    (el.getAttribute("placeholder") || "") +
    (el.getAttribute("aria-label") || "")
  ).toLowerCase();

  if (
    ["prompt", "message", "chat", "ask", "composer"].some((k) =>
      rawAttrs.includes(k),
    )
  )
    score += 50;
  if (el.id === "prompt-textarea") score += 100; // ChatGPT
  if (el.classList.contains("ql-editor")) score += 80; // Gemini

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
    const proto = window.HTMLTextAreaElement.prototype;
    const nativeSetter = Object.getOwnPropertyDescriptor(proto, "value").set;
    nativeSetter.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  } else {
    el.focus();
    el.innerText = value;
    ["input", "keydown", "keyup"].forEach((evt) =>
      el.dispatchEvent(new Event(evt, { bubbles: true, composed: true })),
    );
  }
}
