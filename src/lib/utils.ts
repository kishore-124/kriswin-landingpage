/** Split a multi-line textarea value into trimmed non-empty lines. */
export function lines(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Split text into paragraphs on blank lines. */
export function paragraphs(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Parse "a | b | c" lines into arrays of parts. */
export function pipeLines(text: string | null | undefined): string[][] {
  return lines(text).map((l) => l.split("|").map((p) => p.trim()));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Ensure a bootstrap-icons class name has the bi- prefix. */
export function iconClass(icon: string | null | undefined, fallback = "bi-stars") {
  const v = (icon ?? "").trim();
  if (!v) return `bi ${fallback}`;
  return `bi ${v.startsWith("bi-") ? v : `bi-${v}`}`;
}

export function safeUrl(url: string | null | undefined) {
  const v = (url ?? "").trim();
  if (!v) return "";
  if (v.startsWith("/") || /^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

/** Accepts only #rgb / #rrggbb colours; falls back to the default brand colour. */
export function safeColor(c: string | null | undefined) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test((c ?? "").trim()) ? c!.trim() : "#4f46e5";
}

/** "Kriswin Infotech Private Limited" → { name: "Kriswin Infotech", suffix: "Private Limited" } */
export function splitCompanyName(full: string) {
  const m = full.match(/^(.*?)\s+((?:Pvt\.?|Private)\s+(?:Ltd\.?|Limited)|LLP|Ltd\.?|Limited|Inc\.?|LLC)$/i);
  return m ? { name: m[1], suffix: m[2] } : { name: full, suffix: "" };
}

/** Accepts only #rgb / #rrggbb colours; falls back to the given default. */
export function colorOr(c: string | null | undefined, fallback: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test((c ?? "").trim()) ? c!.trim() : fallback;
}
