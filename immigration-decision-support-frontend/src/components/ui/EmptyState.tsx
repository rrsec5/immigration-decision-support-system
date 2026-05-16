import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        textAlign: "center",
        gap: "0.75rem",
      }}
    >
      {icon && (
        <div
          style={{ fontSize: "2.5rem", marginBottom: "0.25rem", opacity: 0.4 }}
        >
          {icon}
        </div>
      )}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "var(--color-slate-300)",
          margin: 0,
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-slate-400)",
            margin: 0,
            maxWidth: "28rem",
          }}
        >
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: "0.5rem" }}>{action}</div>}
    </div>
  );
}
