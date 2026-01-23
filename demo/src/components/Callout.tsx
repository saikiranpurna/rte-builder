interface CalloutProps {
  type: "info" | "warning" | "success" | "danger" | "tip";
  title?: string;
  children: React.ReactNode;
}

const icons = {
  info: "ℹ️",
  warning: "⚠️",
  success: "✅",
  danger: "🚫",
  tip: "💡",
};

export function Callout({ type, title, children }: CalloutProps) {
  return (
    <div className={`callout callout-${type}`}>
      <div className="callout-icon">{icons[type]}</div>
      <div className="callout-content">
        {title && <div className="callout-title">{title}</div>}
        <div className="callout-body">{children}</div>
      </div>
    </div>
  );
}
