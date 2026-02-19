const TONES = [
  { key: "professional", label: "Professional", emoji: "💼" },
  { key: "creative", label: "Creative", emoji: "🎨" },
  { key: "code", label: "Code", emoji: "💻" },
  { key: "concise", label: "Concise", emoji: "⚡" },
];

export default function ToneSelector({ selectedTone, onSelect }) {
  return (
    <div className="flex gap-2.5 flex-wrap">
      {TONES.map(({ key, label, emoji }) => {
        const isActive = selectedTone === key;

        return (
          <button
            key={key}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(key);
            }}
            className={`
              inline-flex items-center gap-2 px-4 py-2 
              rounded-full text-[13px] tracking-wide whitespace-nowrap 
              pointer-events-auto transition-all duration-300 ease-out border-2
              ${
                isActive
                  ? "font-bold border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700 shadow-[0_4px_12px_rgba(99,102,241,0.15)] scale-[1.02]"
                  : "font-semibold border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 hover:text-slate-700 hover:shadow-sm"
              }
            `}
          >
            <span
              className={`text-sm transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
            >
              {emoji}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
