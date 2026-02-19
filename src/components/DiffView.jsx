// export default function DiffView({ diffTokens, originalText, status }) {
//   const containerStyle = {
//     background: "linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%)",
//     border: "1.5px solid #e0e7ff",
//     borderRadius: "12px",
//     padding: "16px",
//     minHeight: "120px",
//     maxHeight: "320px",
//     overflowY: "auto",
//     fontSize: "14px",
//     lineHeight: "1.7",
//     color: "#334155",
//     whiteSpace: "pre-wrap",
//     wordWrap: "break-word",
//     scrollbarWidth: "thin",
//   };

//   // Show original text when idle or loading
//   if (status === "idle" || status === "loading") {
//     return (
//       <div style={containerStyle}>
//         {status === "loading" ? (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//               color: "#94a3b8",
//             }}
//           >
//             <span
//               style={{
//                 display: "inline-block",
//                 width: "18px",
//                 height: "18px",
//                 border: "2.5px solid rgba(99,102,241,0.2)",
//                 borderTopColor: "#6366f1",
//                 borderRightColor: "#6366f1",
//                 borderRadius: "50%",
//                 animation: "spin 0.8s linear infinite",
//               }}
//             />
//             <span style={{ fontSize: "14px", fontWeight: "500" }}>
//               Enhancing your prompt...
//             </span>
//           </div>
//         ) : (
//           <span style={{ color: "#475569" }}>
//             {originalText || "Your prompt will appear here..."}
//           </span>
//         )}
//       </div>
//     );
//   }

//   // Show diff after enhancement
//   return (
//     <div style={containerStyle}>
//       {diffTokens.map((token, i) => {
//         if (token.type === "same") {
//           return (
//             <span key={i} style={{ color: "#475569" }}>
//               {token.word}{" "}
//             </span>
//           );
//         }
//         if (token.type === "remove") {
//           return (
//             <span
//               key={i}
//               style={{
//                 backgroundColor: "#fee2e2",
//                 color: "#991b1b",
//                 textDecoration: "line-through",
//                 opacity: 0.7,
//                 padding: "2px 4px",
//                 borderRadius: "3px",
//               }}
//             >
//               {token.word}{" "}
//             </span>
//           );
//         }
//         if (token.type === "add") {
//           return (
//             <span
//               key={i}
//               style={{
//                 backgroundColor: "#dcfce7",
//                 color: "#15803d",
//                 fontWeight: "500",
//                 padding: "2px 4px",
//                 borderRadius: "3px",
//               }}
//             >
//               {token.word}{" "}
//             </span>
//           );
//         }
//         return null;
//       })}
//     </div>
//   );
// }

export default function DiffView({ diffTokens, originalText, status }) {
  // Shared container styles using Tailwind
  const containerClasses = `
    bg-gradient-to-br from-slate-50 to-indigo-50/40 
    border border-indigo-100/60 shadow-inner
    rounded-xl p-5 
    min-h-[120px] max-h-[320px] overflow-y-auto 
    text-[14.5px] leading-relaxed text-slate-700 
    whitespace-pre-wrap break-words
    custom-scrollbar
  `;

  // Show original text when idle or loading
  if (status === "idle" || status === "loading") {
    return (
      <div className={containerClasses}>
        {/* Added custom scrollbar styles to keep it clean */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `}</style>

        {status === "loading" ? (
          <div className="flex items-center gap-3 text-slate-400 h-full py-2 animate-fade-in">
            {/* Tailwind Loading Spinner */}
            <div className="w-5 h-5 border-[2.5px] border-indigo-500/20 border-t-indigo-500 border-r-indigo-500 rounded-full animate-spin" />

            {/* Pulsing Loading Text */}
            <span className="text-[14.5px] font-medium text-slate-500 animate-pulse">
              Enhancing your prompt...
            </span>
          </div>
        ) : (
          <span className="text-slate-500 transition-opacity duration-300">
            {originalText || (
              <span className="italic opacity-70">
                Your prompt will appear here...
              </span>
            )}
          </span>
        )}
      </div>
    );
  }

  // Show diff after enhancement
  return (
    <div className={containerClasses}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        @keyframes diffFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-diff { animation: diffFadeIn 0.3s ease-out forwards; }
      `}</style>

      <div className="animate-diff">
        {diffTokens.map((token, i) => {
          if (token.type === "same") {
            return (
              <span key={i} className="text-slate-600">
                {token.word}{" "}
              </span>
            );
          }
          if (token.type === "remove") {
            return (
              <span
                key={i}
                className="bg-rose-100/80 text-rose-700 line-through decoration-rose-400 opacity-70 px-1 py-[2px] rounded-[4px]"
              >
                {token.word}{" "}
              </span>
            );
          }
          if (token.type === "add") {
            return (
              <span
                key={i}
                className="bg-emerald-100/80 text-emerald-800 font-semibold px-1 py-[2px] rounded-[4px] shadow-sm"
              >
                {token.word}{" "}
              </span>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
