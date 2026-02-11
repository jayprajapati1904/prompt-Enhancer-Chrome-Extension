import { useState, useEffect, useCallback } from "react";
import FloatingButton from "./components/FloatingButton";
import EnhancerPopup from "./components/EnhancerPopup";
import { findBestInput, getInputText } from "./utils/inputDetection";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [inputElement, setInputElement] = useState(null);

  const handleOpen = useCallback((text, element) => {
    setOriginalText(text);
    setInputElement(element);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (inputElement) inputElement.focus();
  }, [inputElement]);

  // Keyboard shortcut: Alt+E
  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && e.code === "KeyE") {
        e.preventDefault();
        const best = findBestInput();
        if (best) {
          const text = getInputText(best);
          if (text.trim()) {
            handleOpen(text, best);
          }
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleOpen]);

  return (
    <>
      <FloatingButton onOpen={handleOpen} />
      <EnhancerPopup
        isOpen={isOpen}
        originalText={originalText}
        inputElement={inputElement}
        onClose={handleClose}
      />
    </>
  );
}
