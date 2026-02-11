const TONES = [
  { key: "professional", label: "Professional", emoji: "💼" },
  { key: "creative", label: "Creative", emoji: "🎨" },
  { key: "code", label: "Code", emoji: "💻" },
  { key: "concise", label: "Concise", emoji: "⚡" },
];

export default function ToneSelector({ selectedTone, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap">
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
            style={{
              padding: "8px 16px",
              borderRadius: "24px",
              fontSize: "13px",
              fontWeight: isActive ? "700" : "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
              letterSpacing: "0.3px",
              border: isActive ? "2px solid #6366f1" : "2px solid #e2e8f0",
              background: isActive
                ? "linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)"
                : "#ffffff",
              color: isActive ? "#4338ca" : "#64748b",
              boxShadow: isActive
                ? "0 4px 12px rgba(99, 102, 241, 0.15)"
                : "none",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              pointerEvents: "auto",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "#f1f5f9";
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <span>{emoji}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
