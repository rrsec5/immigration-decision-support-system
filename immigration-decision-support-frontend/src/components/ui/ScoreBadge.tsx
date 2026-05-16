import { scoreColor, formatScore } from "../../utils/format";

interface Props {
  score: number | null | undefined;
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ score, size = "md" }: Props) {
  const color = scoreColor(score);
  const sizes = { sm: "0.7rem", md: "0.8rem", lg: "1rem" };
  const paddings = {
    sm: "0.1rem 0.4rem",
    md: "0.15rem 0.5rem",
    lg: "0.2rem 0.65rem",
  };

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-mono)",
        fontSize: sizes[size],
        fontWeight: 500,
        color,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: "0.4rem",
        padding: paddings[size],
        letterSpacing: "0.02em",
        lineHeight: 1.4,
      }}
    >
      {formatScore(score)}
    </span>
  );
}
