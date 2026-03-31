export interface GoogleFont {
  family: string;
  category: "serif" | "sans-serif" | "script" | "display";
  weights: string;
}

export const GOOGLE_FONTS: GoogleFont[] = [
  // ── Serif ──────────────────────────────────────────────────────────────────
  { family: "Playfair Display",    category: "serif",      weights: "400;500;600;700" },
  { family: "Cormorant Garamond",  category: "serif",      weights: "300;400;500;600;700" },
  { family: "EB Garamond",         category: "serif",      weights: "400;500;600;700" },
  { family: "Lora",                category: "serif",      weights: "400;500;600;700" },
  { family: "Libre Baskerville",   category: "serif",      weights: "400;700" },
  { family: "Merriweather",        category: "serif",      weights: "300;400;700" },
  { family: "Bodoni Moda",         category: "serif",      weights: "400;500;600;700" },
  { family: "Spectral",            category: "serif",      weights: "300;400;500;600;700" },
  { family: "Crimson Pro",         category: "serif",      weights: "300;400;500;600;700" },
  { family: "Cardo",               category: "serif",      weights: "400;700" },
  { family: "Cinzel",              category: "serif",      weights: "400;500;600;700" },
  { family: "Gilda Display",       category: "serif",      weights: "400" },
  { family: "Forum",               category: "serif",      weights: "400" },
  { family: "Josefin Slab",        category: "serif",      weights: "300;400;600;700" },
  { family: "Source Serif 4",      category: "serif",      weights: "300;400;500;600;700" },
  { family: "Fraunces",            category: "serif",      weights: "300;400;500;600;700" },
  { family: "DM Serif Display",    category: "serif",      weights: "400" },
  { family: "Abril Fatface",       category: "display",    weights: "400" },
  // ── Sans-Serif ─────────────────────────────────────────────────────────────
  { family: "DM Sans",             category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Inter",               category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Montserrat",          category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Raleway",             category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Nunito",              category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Lato",                category: "sans-serif", weights: "300;400;700" },
  { family: "Poppins",             category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Quicksand",           category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Josefin Sans",        category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Mulish",              category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Work Sans",           category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Outfit",              category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Plus Jakarta Sans",   category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Figtree",             category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Jost",                category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Sora",                category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Nunito Sans",         category: "sans-serif", weights: "300;400;500;600;700" },
  { family: "Karla",               category: "sans-serif", weights: "300;400;500;600;700" },
  // ── Script / Handwriting ───────────────────────────────────────────────────
  { family: "Dancing Script",      category: "script",     weights: "400;500;600;700" },
  { family: "Great Vibes",         category: "script",     weights: "400" },
  { family: "Alex Brush",          category: "script",     weights: "400" },
  { family: "Pinyon Script",       category: "script",     weights: "400" },
  { family: "Sacramento",          category: "script",     weights: "400" },
  { family: "Tangerine",           category: "script",     weights: "400;700" },
  { family: "Allura",              category: "script",     weights: "400" },
  { family: "Italianno",           category: "script",     weights: "400" },
  { family: "Parisienne",          category: "script",     weights: "400" },
  { family: "Satisfy",             category: "script",     weights: "400" },
  { family: "Monsieur La Doulaise",category: "script",     weights: "400" },
  { family: "Rochester",           category: "script",     weights: "400" },
  { family: "Euphoria Script",     category: "script",     weights: "400" },
  { family: "Yellowtail",          category: "script",     weights: "400" },
  // ── Display ────────────────────────────────────────────────────────────────
  { family: "Cinzel Decorative",   category: "display",    weights: "400;700" },
  { family: "Cormorant SC",        category: "display",    weights: "300;400;500;600;700" },
  { family: "Poiret One",          category: "display",    weights: "400" },
  { family: "Philosopher",         category: "display",    weights: "400;700" },
  { family: "Marcellus",           category: "display",    weights: "400" },
  { family: "Tenor Sans",          category: "display",    weights: "400" },
  { family: "Questrial",           category: "display",    weights: "400" },
  { family: "Unica One",           category: "display",    weights: "400" },
];

/**
 * Inject a single Google Font <link> into <head>.
 * Safe to call multiple times — deduplicates by font family.
 */
export function loadGoogleFont(family: string) {
  if (typeof document === "undefined") return;
  const id = `gf-${family.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const font = GOOGLE_FONTS.find((f) => f.family === family);
  const weights = font?.weights ?? "400;700";
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weights}&display=swap`;
  document.head.appendChild(link);
}

/**
 * Inject a single <link> that loads ALL picker fonts at once.
 * Call when the font picker panel opens.
 */
export function loadAllPickerFonts() {
  if (typeof document === "undefined") return;
  const id = "gf-all-picker";
  if (document.getElementById(id)) return;
  // Split into two batches to stay within safe URL limits
  const half = Math.ceil(GOOGLE_FONTS.length / 2);
  [GOOGLE_FONTS.slice(0, half), GOOGLE_FONTS.slice(half)].forEach(
    (batch, i) => {
      const batchId = `${id}-${i}`;
      if (document.getElementById(batchId)) return;
      const params = batch
        .map(
          (f) =>
            `family=${encodeURIComponent(f.family)}:wght@${f.weights}`
        )
        .join("&");
      const link = document.createElement("link");
      link.id = batchId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?${params}&display=swap`;
      document.head.appendChild(link);
    }
  );
}

/** CSS fallback stack per category */
export function getFontStack(
  family: string,
  category?: GoogleFont["category"]
): string {
  const cat =
    category ?? GOOGLE_FONTS.find((f) => f.family === family)?.category;
  const fallback =
    cat === "script"
      ? "cursive"
      : cat === "serif" || cat === "display"
      ? "Georgia, serif"
      : "system-ui, sans-serif";
  return `"${family}", ${fallback}`;
}
