// ── Country photos ────────────────────────────────────────────────────────────
// Eagerly import all .jpg files from src/assets using Vite's import.meta.glob.
// The key is the file path, e.g. "/src/assets/germany.jpg"
const photoModules = import.meta.glob<{ default: string }>(
  "/src/assets/*.jpg",
  { eager: true },
);

// Build a lookup: "germany" → url string
const photoBySlug: Record<string, string> = {};
for (const [path, mod] of Object.entries(photoModules)) {
  // "/src/assets/south_korea.jpg" → "south_korea"
  const slug = path.replace("/src/assets/", "").replace(".jpg", "");
  photoBySlug[slug] = mod.default;
}

/**
 * Convert a country name to the slug used for the photo filename.
 * Rules (matching your file naming convention):
 *   "South Korea"  → "south_korea"
 *   "USA"          → "usa"
 *   "UK"           → "uk"
 *   "UAE"          → "uae"
 */
function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "_");
}

export function countryPhoto(name: string): string | null {
  const slug = nameToSlug(name);
  return photoBySlug[slug] ?? null;
}
