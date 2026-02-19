// import { useState, useEffect, useCallback } from "react";
// import ToneSelector from "./ToneSelector";
// import DiffView from "./DiffView";
// import { enhancePrompt } from "../utils/api";
// import { setNativeValue } from "../utils/inputDetection";
// import { computeDiff } from "../utils/diff";

// const SparkleIcon = () => (
//   <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
//     <path d="M12 2L13.09 8.26L19 9.27L14.55 13.97L15.64 20.23L12 17.27L8.36 20.23L9.45 13.97L5 9.27L10.91 8.26L12 2Z" />
//   </svg>
// );

// const CloseIcon = () => (
//   <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//     <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
//   </svg>
// );

// const CheckIcon = () => (
//   <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
//     <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//   </svg>
// );

// export default function EnhancerPopup({
//   isOpen,
//   originalText,
//   inputElement,
//   onClose,
// }) {
//   const [selectedTone, setSelectedTone] = useState("professional");
//   const [status, setStatus] = useState("idle"); // idle | loading | done | error
//   const [enhancedText, setEnhancedText] = useState("");
//   const [diffTokens, setDiffTokens] = useState([]);
//   const [errorMsg, setErrorMsg] = useState("");

//   // Reset state when popup opens with new text
//   useEffect(() => {
//     if (isOpen) {
//       setStatus("idle");
//       setEnhancedText("");
//       setDiffTokens([]);
//       setErrorMsg("");
//       setSelectedTone("professional");
//     }
//   }, [isOpen, originalText]);

//   // Escape key to close
//   useEffect(() => {
//     const handler = (e) => {
//       if (e.key === "Escape" && isOpen) onClose();
//     };
//     document.addEventListener("keydown", handler);
//     return () => document.removeEventListener("keydown", handler);
//   }, [isOpen, onClose]);

//   const handleEnhance = useCallback(async () => {
//     if (!originalText?.trim()) return;

//     setStatus("loading");
//     setErrorMsg("");

//     try {
//       const result = await enhancePrompt(originalText, selectedTone);

//       if (result.success && result.text) {
//         setEnhancedText(result.text);
//         setDiffTokens(computeDiff(originalText, result.text));
//         setStatus("done");
//       } else {
//         setErrorMsg(result.error || "Enhancement failed. Please try again.");
//         setStatus("error");
//       }
//     } catch (err) {
//       setErrorMsg("Network error. Please check your connection.");
//       setStatus("error");
//     }
//   }, [originalText, selectedTone]);

//   const handleInsert = useCallback(() => {
//     if (inputElement && enhancedText) {
//       setNativeValue(inputElement, enhancedText);
//       onClose();
//       setTimeout(() => inputElement.focus(), 100);
//     }
//   }, [inputElement, enhancedText, onClose]);

//   const handleToneChange = useCallback(
//     (tone) => {
//       setSelectedTone(tone);
//       // Auto re-enhance on tone switch if we already have an enhancement
//       if (status === "done" && originalText?.trim()) {
//         setStatus("loading");
//         setErrorMsg("");
//         enhancePrompt(originalText, tone).then((result) => {
//           if (result.success && result.text) {
//             setEnhancedText(result.text);
//             setDiffTokens(computeDiff(originalText, result.text));
//             setStatus("done");
//           } else {
//             setErrorMsg(result.error || "Enhancement failed.");
//             setStatus("error");
//           }
//         });
//       }
//     },
//     [status, originalText],
//   );

//   if (!isOpen) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         background: "rgba(15, 23, 42, 0.7)",
//         backdropFilter: "blur(8px)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 999999,
//         animation: "pe-fade-in 0.3s ease-out",
//         pointerEvents: "auto",
//         fontFamily:
//           '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
//       }}
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       {/* Popup Card */}
//       <div
//         style={{
//           width: "520px",
//           maxWidth: "90%",
//           background: "#ffffff",
//           borderRadius: "20px",
//           boxShadow:
//             "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 15px 30px -10px rgba(0, 0, 0, 0.15)",
//           overflow: "hidden",
//           animation: "pe-pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
//           pointerEvents: "auto",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div
//           style={{
//             padding: "20px 24px",
//             background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
//             borderBottom: "1px solid #e0e7ff",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               fontWeight: 700,
//               color: "#0f172a",
//               fontSize: "16px",
//               letterSpacing: "-0.3px",
//             }}
//           >
//             <span style={{ color: "#6366f1" }}>
//               <SparkleIcon />
//             </span>
//             Enhance Prompt
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             style={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               color: "#94a3b8",
//               padding: "6px",
//               borderRadius: "6px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "all 0.2s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#fee2e2";
//               e.currentTarget.style.color = "#ef4444";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "none";
//               e.currentTarget.style.color = "#94a3b8";
//             }}
//           >
//             <CloseIcon />
//           </button>
//         </div>

//         {/* Body */}
//         <div style={{ padding: "24px" }}>
//           {/* Tone Selector */}
//           <div style={{ marginBottom: "20px" }}>
//             <ToneSelector
//               selectedTone={selectedTone}
//               onSelect={handleToneChange}
//             />
//           </div>

//           {/* Diff / Preview Area */}
//           <DiffView
//             diffTokens={diffTokens}
//             originalText={originalText}
//             status={status}
//           />

//           {/* Error Message */}
//           {status === "error" && (
//             <div
//               style={{
//                 color: "#ef4444",
//                 fontSize: "13px",
//                 fontWeight: 500,
//                 marginTop: "12px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//               }}
//             >
//               <span>❌</span> {errorMsg}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div
//           style={{
//             padding: "16px 24px",
//             borderTop: "1px solid #e2e8f0",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             background: "#f8fafc",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "13px",
//               color: "#64748b",
//               fontWeight: 500,
//             }}
//           >
//             {status === "done" && "✨ Enhancement ready"}
//             {status === "loading" && "⏳ Processing..."}
//             {status === "error" && "⚠️ Try again"}
//             {status === "idle" && "Select a tone & enhance"}
//           </div>

//           <div style={{ display: "flex", gap: "12px" }}>
//             {/* Enhance Button - visible when not done */}
//             {status !== "done" && (
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   handleEnhance();
//                 }}
//                 disabled={status === "loading"}
//                 style={{
//                   padding: "10px 22px",
//                   borderRadius: "10px",
//                   border: "none",
//                   fontWeight: 700,
//                   cursor: status === "loading" ? "wait" : "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   fontSize: "14px",
//                   letterSpacing: "0.3px",
//                   color: "#ffffff",
//                   background:
//                     status === "loading"
//                       ? "#94a3b8"
//                       : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
//                   boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
//                   transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//                   pointerEvents: "auto",
//                   opacity: status === "loading" ? 0.8 : 1,
//                 }}
//                 onMouseEnter={(e) => {
//                   if (status !== "loading") {
//                     e.currentTarget.style.transform = "translateY(-2px)";
//                     e.currentTarget.style.boxShadow =
//                       "0 8px 20px rgba(99, 102, 241, 0.4)";
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.boxShadow =
//                     "0 4px 12px rgba(99, 102, 241, 0.3)";
//                 }}
//               >
//                 {status === "loading" ? (
//                   <>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         width: "16px",
//                         height: "16px",
//                         border: "2.5px solid rgba(255,255,255,0.3)",
//                         borderTopColor: "white",
//                         borderRightColor: "white",
//                         borderRadius: "50%",
//                         animation: "spin 0.8s linear infinite",
//                       }}
//                     />
//                     <span>Enhancing...</span>
//                   </>
//                 ) : (
//                   <>
//                     <SparkleIcon />
//                     <span>Enhance</span>
//                   </>
//                 )}
//               </button>
//             )}

//             {/* Insert Button - visible when done */}
//             {status === "done" && (
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   handleInsert();
//                 }}
//                 style={{
//                   padding: "10px 22px",
//                   borderRadius: "10px",
//                   border: "none",
//                   fontWeight: 700,
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   fontSize: "14px",
//                   letterSpacing: "0.3px",
//                   color: "#ffffff",
//                   background:
//                     "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//                   boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
//                   transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//                   pointerEvents: "auto",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-2px)";
//                   e.currentTarget.style.boxShadow =
//                     "0 8px 20px rgba(16, 185, 129, 0.4)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.boxShadow =
//                     "0 4px 12px rgba(16, 185, 129, 0.3)";
//                 }}
//               >
//                 <CheckIcon />
//                 <span>Insert</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useCallback } from "react";
import ToneSelector from "./ToneSelector";
import DiffView from "./DiffView";
import { enhancePrompt } from "../utils/api";
import { setNativeValue } from "../utils/inputDetection";
import { computeDiff } from "../utils/diff";

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 2L13.09 8.26L19 9.27L14.55 13.97L15.64 20.23L12 17.27L8.36 20.23L9.45 13.97L5 9.27L10.91 8.26L12 2Z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

export default function EnhancerPopup({
  isOpen,
  originalText,
  inputElement,
  onClose,
}) {
  const [selectedTone, setSelectedTone] = useState("professional");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [enhancedText, setEnhancedText] = useState("");
  const [diffTokens, setDiffTokens] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Reset state when popup opens with new text
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setEnhancedText("");
      setDiffTokens([]);
      setErrorMsg("");
      setSelectedTone("professional");
    }
  }, [isOpen, originalText]);

  // Escape key to close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleEnhance = useCallback(async () => {
    if (!originalText?.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const result = await enhancePrompt(originalText, selectedTone);

      if (result.success && result.text) {
        setEnhancedText(result.text);
        setDiffTokens(computeDiff(originalText, result.text));
        setStatus("done");
      } else {
        setErrorMsg(result.error || "Enhancement failed. Please try again.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("error");
    }
  }, [originalText, selectedTone]);

  // --- UPGRADED INSERT FUNCTION ---
  // --- UPGRADED & CRASH-PROOF INSERT FUNCTION ---
  const handleInsert = useCallback(() => {
    if (!enhancedText || !inputElement) return;

    let targetElement = inputElement;

    // 1. If it's a Text Node (common in editors), strictly move to its parent Element
    if (targetElement.nodeType === Node.TEXT_NODE) {
      targetElement = targetElement.parentElement;
    }

    // Safety Check: If we somehow still don't have a valid element, abort
    if (!targetElement) return;

    // 2. Find the closest actual editable container
    const editableContainer =
      targetElement.closest('textarea, input, [contenteditable="true"]') ||
      targetElement;

    // 3. SAFE FOCUS: Only call focus if the method actually exists
    if (editableContainer && typeof editableContainer.focus === "function") {
      editableContainer.focus();
    }

    // 4. Handle Standard Textareas & Inputs
    if (
      editableContainer.tagName === "TEXTAREA" ||
      editableContainer.tagName === "INPUT"
    ) {
      try {
        // React Bypass: Get the native setter from the prototype
        const valueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value",
        ).set;
        const prototype = Object.getPrototypeOf(editableContainer);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(
          prototype,
          "value",
        ).set;

        // Try standard or prototype setter
        if (valueSetter) {
          valueSetter.call(editableContainer, enhancedText);
        } else if (prototypeValueSetter) {
          prototypeValueSetter.call(editableContainer, enhancedText);
        } else {
          editableContainer.value = enhancedText;
        }

        editableContainer.dispatchEvent(new Event("input", { bubbles: true }));
      } catch (e) {
        // Fallback for simple inputs
        editableContainer.value = enhancedText;
        editableContainer.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    // 5. Handle ContentEditable (ChatGPT, Claude, Notion, etc.)
    else if (editableContainer.isContentEditable) {
      // Ensure we have a valid selection inside the container
      const selection = window.getSelection();
      const range = document.createRange();

      // Select the entire contents of the container to replace it
      range.selectNodeContents(editableContainer);
      selection.removeAllRanges();
      selection.addRange(range);

      // 'insertText' is the magic command that triggers React/Framework listeners
      document.execCommand("insertText", false, enhancedText);
    }
    // 6. Last resort fallback
    else {
      console.warn(
        "Enhancer: Could not detect input type, trying direct replacement.",
      );
      editableContainer.textContent = enhancedText;
    }

    onClose();
  }, [inputElement, enhancedText, onClose]);

  const handleToneChange = useCallback(
    (tone) => {
      setSelectedTone(tone);
      // Auto re-enhance on tone switch if we already have an enhancement
      if (status === "done" && originalText?.trim()) {
        setStatus("loading");
        setErrorMsg("");
        enhancePrompt(originalText, tone).then((result) => {
          if (result.success && result.text) {
            setEnhancedText(result.text);
            setDiffTokens(computeDiff(originalText, result.text));
            setStatus("done");
          } else {
            setErrorMsg(result.error || "Enhancement failed.");
            setStatus("error");
          }
        });
      }
    },
    [status, originalText],
  );

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        animation: "pe-fade-in 0.3s ease-out",
        pointerEvents: "auto",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Popup Card */}
      <div
        style={{
          width: "520px",
          maxWidth: "90%",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 15px 30px -10px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          animation: "pe-pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
            borderBottom: "1px solid #e0e7ff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: 700,
              color: "#0f172a",
              fontSize: "16px",
              letterSpacing: "-0.3px",
            }}
          >
            <span style={{ color: "#6366f1" }}>
              <SparkleIcon />
            </span>
            Enhance Prompt
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              padding: "6px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fee2e2";
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          {/* Tone Selector */}
          <div style={{ marginBottom: "20px" }}>
            <ToneSelector
              selectedTone={selectedTone}
              onSelect={handleToneChange}
            />
          </div>

          {/* Diff / Preview Area */}
          <DiffView
            diffTokens={diffTokens}
            originalText={originalText}
            status={status}
          />

          {/* Error Message */}
          {status === "error" && (
            <div
              style={{
                color: "#ef4444",
                fontSize: "13px",
                fontWeight: 500,
                marginTop: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>❌</span> {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#64748b",
              fontWeight: 500,
            }}
          >
            {status === "done" && "✨ Enhancement ready"}
            {status === "loading" && "⏳ Processing..."}
            {status === "error" && "⚠️ Try again"}
            {status === "idle" && "Select a tone & enhance"}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {/* Enhance Button - visible when not done */}
            {status !== "done" && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEnhance();
                }}
                disabled={status === "loading"}
                style={{
                  padding: "10px 22px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 700,
                  cursor: status === "loading" ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  letterSpacing: "0.3px",
                  color: "#ffffff",
                  background:
                    status === "loading"
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "auto",
                  opacity: status === "loading" ? 0.8 : 1,
                }}
                onMouseEnter={(e) => {
                  if (status !== "loading") {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(99, 102, 241, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(99, 102, 241, 0.3)";
                }}
              >
                {status === "loading" ? (
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        border: "2.5px solid rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                        borderRightColor: "white",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    <span>Enhancing...</span>
                  </>
                ) : (
                  <>
                    <SparkleIcon />
                    <span>Enhance</span>
                  </>
                )}
              </button>
            )}

            {/* Insert Button - visible when done */}
            {status === "done" && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleInsert();
                }}
                style={{
                  padding: "10px 22px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  letterSpacing: "0.3px",
                  color: "#ffffff",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "auto",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(16, 185, 129, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(16, 185, 129, 0.3)";
                }}
              >
                <CheckIcon />
                <span>Insert</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
