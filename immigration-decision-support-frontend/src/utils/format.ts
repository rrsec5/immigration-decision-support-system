export function formatScore(score: number | null | undefined): string {
  if (score == null) return "—";
  return score.toFixed(1);
}

export function formatCost(amount: number): string {
  return `$${amount.toLocaleString()}/mo`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function scoreColor(score: number | null | undefined): string {
  if (score == null) return "#4a4f68";
  if (score >= 8) return "#34d399";
  if (score >= 6) return "#fbbf24";
  if (score >= 4) return "#fb923c";
  return "#fb7185";
}

export function scoreLabel(score: number | null | undefined): string {
  if (score == null) return "N/A";
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Good";
  if (score >= 4) return "Average";
  return "Poor";
}

export function regionLabel(region: string): string {
  if (region === "any") return "Any";
  return region.replace(/_/g, " ");
}

export function climateEmoji(climate: string): string {
  return { cold: "❄️", moderate: "🌤", warm: "☀️" }[climate] ?? "🌍";
}
