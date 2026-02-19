// import { useState, useEffect, useCallback, useRef } from "react";
// import { findBestInput, getInputText } from "../utils/inputDetection";

// const SparkleIcon = () => (
//   <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
//     <path d="M12 2L13.09 8.26L19 9.27L14.55 13.97L15.64 20.23L12 17.27L8.36 20.23L9.45 13.97L5 9.27L10.91 8.26L12 2Z" />
//   </svg>
// );

// export default function FloatingButton({ onOpen }) {
//   const [position, setPosition] = useState({ top: -100, left: -100 });
//   const [visible, setVisible] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const inputRef = useRef(null);
//   const intervalRef = useRef(null);

//   const updatePosition = useCallback(() => {
//     const best = findBestInput();
//     if (!best) {
//       setVisible(false);
//       inputRef.current = null;
//       return;
//     }

//     inputRef.current = best;
//     const rect = best.getBoundingClientRect();
//     const buttonSize = 48;
//     const gapFromInput = 10;
//     const viewportPadding = 16;
//     const viewportWidth = window.innerWidth;

//     // Default: above input, right-aligned
//     let top = rect.top + window.scrollY - buttonSize - gapFromInput;
//     let left = rect.right + window.scrollX - buttonSize - gapFromInput;

//     // If no space above, place below
//     if (rect.top < buttonSize + gapFromInput + viewportPadding) {
//       top = rect.bottom + window.scrollY + gapFromInput;
//     }

//     // If exceeds right edge
//     if (left + buttonSize + viewportPadding > viewportWidth) {
//       left = rect.left + window.scrollX + gapFromInput;
//     }

//     // Keep minimum left padding
//     if (left < viewportPadding) {
//       left = viewportPadding + window.scrollX;
//     }

//     // Only show if input is visible
//     if (rect.top >= -buttonSize && rect.width > 0 && rect.height > 0) {
//       setPosition({ top, left });
//       setVisible(true);
//     } else {
//       setVisible(false);
//     }
//   }, []);

//   useEffect(() => {
//     updatePosition();
//     intervalRef.current = setInterval(updatePosition, 800);

//     window.addEventListener("resize", updatePosition);
//     window.addEventListener("scroll", updatePosition, { passive: true });
//     document.addEventListener("focus", updatePosition, true);

//     return () => {
//       clearInterval(intervalRef.current);
//       window.removeEventListener("resize", updatePosition);
//       window.removeEventListener("scroll", updatePosition);
//       document.removeEventListener("focus", updatePosition, true);
//     };
//   }, [updatePosition]);

//   const handleClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!inputRef.current) return;
//     const text = getInputText(inputRef.current);
//     if (!text.trim()) return;

//     onOpen(text, inputRef.current);
//   };

//   if (!visible) return null;

//   return (
//     <button
//       type="button"
//       onClick={handleClick}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       title="Enhance Prompt (Alt+E)"
//       aria-label="Enhance Prompt with AI"
//       style={{
//         position: "fixed",
//         top: `${position.top}px`,
//         left: `${position.left}px`,
//         width: "56px",
//         height: "56px",
//         borderRadius: "14px",
//         background: isHovered
//           ? "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)"
//           : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
//         border: "none",
//         color: "white",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         cursor: "pointer",
//         zIndex: 999998,
//         boxShadow: isHovered
//           ? "0 10px 16px rgba(0,0,0,0.15), 0 20px 40px rgba(99,102,241,0.4), inset 0 1px 1px rgba(255,255,255,0.3)"
//           : "0 4px 6px rgba(0,0,0,0.12), 0 12px 24px rgba(99,102,241,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
//         transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
//         transform: isHovered ? "scale(1.15) translateY(-4px)" : "scale(1)",
//         backdropFilter: "blur(10px)",
//         outline: "none",
//         pointerEvents: "auto",
//         animation: "pe-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
//       }}
//     >
//       <SparkleIcon />
//     </button>
//   );
// }
import { useState, useEffect, useCallback, useRef } from "react";

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 2L13.09 8.26L19 9.27L14.55 13.97L15.64 20.23L12 17.27L8.36 20.23L9.45 13.97L5 9.27L10.91 8.26L12 2Z" />
  </svg>
);

export default function FloatingButton({ onOpen }) {
  const [position, setPosition] = useState({ top: -1000, left: -1000 });
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const popoverRef = useRef(null);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setVisible(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const buttonWidth = 46;
    const buttonHeight = 46;
    const arrowHeight = 8;
    const gap = 10;

    const selectionCenter = rect.left + rect.width / 2;

    let top = rect.top + window.scrollY - buttonHeight - gap - arrowHeight;
    let left = selectionCenter + window.scrollX - buttonWidth / 2;

    if (rect.top < buttonHeight + gap + 20) {
      top = rect.bottom + window.scrollY + gap + arrowHeight;
    }

    const padding = 10;
    left = Math.max(
      padding,
      Math.min(left, window.innerWidth - buttonWidth - padding),
    );

    setPosition({ top, left });
    setVisible(true);
  }, []);

  useEffect(() => {
    const onInteractionEnd = () => {
      setTimeout(handleSelection, 10);
    };

    const onSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setVisible(false);
      }
    };

    document.addEventListener("mouseup", onInteractionEnd);
    document.addEventListener("keyup", onInteractionEnd);
    document.addEventListener("selectionchange", onSelectionChange);
    window.addEventListener("scroll", onSelectionChange, { passive: true });

    return () => {
      document.removeEventListener("mouseup", onInteractionEnd);
      document.removeEventListener("keyup", onInteractionEnd);
      document.removeEventListener("selectionchange", onSelectionChange);
      window.removeEventListener("scroll", onSelectionChange);
    };
  }, [handleSelection]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString();
      onOpen(text, selection.anchorNode);

      // FIX 1: Clear the selection immediately so the popover hides
      selection.removeAllRanges();
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <button
      ref={popoverRef}
      type="button"
      onMouseDown={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="prompt-enhancer-popover"
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: "46px",
        height: "46px",
        borderRadius: "12px",
        background: isHovered
          ? "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)"
          : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        // FIX 2: Lowered Z-index slightly below the modal backdrop (999999)
        zIndex: 999998,
        boxShadow: "0 4px 20px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.2)",
        transition: "transform 0.2s ease, background 0.2s ease",
        transform: isHovered ? "scale(1.1) translateY(-2px)" : "scale(1)",
        pointerEvents: "auto",
        animation: "fadeInUp 0.2s ease-out forwards",
      }}
    >
      <SparkleIcon />

      <div
        style={{
          position: "absolute",
          bottom: "-6px",
          left: "50%",
          marginLeft: "-6px",
          width: "0",
          height: "0",
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: isHovered ? "6px solid #4338ca" : "6px solid #0f172a",
        }}
      />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(5px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </button>
  );
}
