import { scoreColor } from "../../utils/format";

interface Props {
  label: string;
  value: number;
  max?: number;
}

export function StatBar({ label, value, max = 10 }: Props) {
  const pct = Math.min((value / max) * 100, 100);
  const color = scoreColor(value);

  return (
    <div style={{ marginBottom: "0.625rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.25rem",
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--color-slate-400)",
            fontFamily: "var(--font-body)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            color,
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
          }}
        >
          {value.toFixed(1)}
        </span>
      </div>
      <div
        style={{
          height: "4px",
          background: "var(--color-ink-700)",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: "9999px",
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}
