export default function DiffView({ diffTokens, originalText, status }) {
  const containerStyle = {
    background: "linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%)",
    border: "1.5px solid #e0e7ff",
    borderRadius: "12px",
    padding: "16px",
    minHeight: "120px",
    maxHeight: "320px",
    overflowY: "auto",
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#334155",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    scrollbarWidth: "thin",
  };

  // Show original text when idle or loading
  if (status === "idle" || status === "loading") {
    return (
      <div style={containerStyle}>
        {status === "loading" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#94a3b8",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "18px",
                height: "18px",
                border: "2.5px solid rgba(99,102,241,0.2)",
                borderTopColor: "#6366f1",
                borderRightColor: "#6366f1",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Enhancing your prompt...
            </span>
          </div>
        ) : (
          <span style={{ color: "#475569" }}>
            {originalText || "Your prompt will appear here..."}
          </span>
        )}
      </div>
    );
  }

  // Show diff after enhancement
  return (
    <div style={containerStyle}>
      {diffTokens.map((token, i) => {
        if (token.type === "same") {
          return (
            <span key={i} style={{ color: "#475569" }}>
              {token.word}{" "}
            </span>
          );
        }
        if (token.type === "remove") {
          return (
            <span
              key={i}
              style={{
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                textDecoration: "line-through",
                opacity: 0.7,
                padding: "2px 4px",
                borderRadius: "3px",
              }}
            >
              {token.word}{" "}
            </span>
          );
        }
        if (token.type === "add") {
          return (
            <span
              key={i}
              style={{
                backgroundColor: "#dcfce7",
                color: "#15803d",
                fontWeight: "500",
                padding: "2px 4px",
                borderRadius: "3px",
              }}
            >
              {token.word}{" "}
            </span>
          );
        }
        return null;
      })}
    </div>
  );
}
