import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// --- Content Script Mode (Chrome Extension) ---
// When injected into a page, there's no #root element.
// We render into a regular div appended to the body.
// The Tailwind CSS is loaded globally via manifest.json's css field.
function initContentScript() {
  const container = document.createElement("div");
  container.id = "prompt-enhancer-root";
  container.style.cssText =
    "position: fixed; top: 0; left: 0; width: 0; height: 0; z-index: 999997; pointer-events: none;";
  document.body.appendChild(container);

  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

// --- Dev Mode ---
// When running with Vite dev server, #root exists
function initDevMode() {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

// Determine mode
if (document.getElementById("root")) {
  initDevMode();
} else {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContentScript);
  } else {
    initContentScript();
  }
}
