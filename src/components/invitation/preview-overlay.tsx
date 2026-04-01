"use client";

import { useState, useMemo } from "react";
import { X, Palette, ChevronRight } from "lucide-react";
import Basic from "./basic";
import Heritage01Jawa from "./heritage-01-jawa";
import type { SessionData } from "./types";
import {
  formDataToPreviewProps,
  COLOR_SWATCHES,
  type PreviewFormData,
} from "./preview-utils";
import {
  GOOGLE_FONTS,
  loadGoogleFont,
  loadAllPickerFonts,
  getFontStack,
} from "@/lib/utils/google-fonts";
import type { Tables } from "@/lib/supabase/database.types";

// ─── Props ──────────────────────────────────────────────────────────────────────

interface PreviewOverlayProps {
  formData: PreviewFormData;
  wedding: Tables<"weddings">;
  sessions: SessionData[];
  onClose: () => void;
  onFormDataChange: (patch: Partial<PreviewFormData>) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function PreviewOverlay({
  formData,
  wedding,
  sessions,
  onClose,
  onFormDataChange,
}: PreviewOverlayProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [fontCat, setFontCat] = useState("semua");
  const [fontSearch, setFontSearch] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [editingFont, setEditingFont] = useState<"heading" | "body" | null>(null);

  // Load picker fonts when panel opens
  function handleOpenPanel() {
    const next = !panelOpen;
    setPanelOpen(next);
    if (next && !fontsLoaded) {
      loadAllPickerFonts();
      setFontsLoaded(true);
    }
  }

  // Build InvitationPageProps from formData
  const pageData = useMemo(
    () => formDataToPreviewProps(formData, wedding, sessions),
    [formData, wedding, sessions],
  );

  // Font filtering
  const filteredFonts = useMemo(() => {
    return GOOGLE_FONTS.filter((f) => {
      const matchSearch = f.family
        .toLowerCase()
        .includes(fontSearch.toLowerCase());
      const matchCat = fontCat === "semua" || f.category === fontCat;
      return matchSearch && matchCat;
    });
  }, [fontSearch, fontCat]);

  function handleFontSelect(family: string, target: "heading" | "body") {
    loadGoogleFont(family);
    if (target === "heading") {
      onFormDataChange({ font_heading_name: family });
    } else {
      onFormDataChange({ font_body_name: family });
    }
    setEditingFont(null);
  }

  // Render the appropriate template
  function renderTemplate() {
    switch (formData.template) {
      case "classic":
        return <Heritage01Jawa data={pageData} />;
      default:
        return <Basic data={pageData} />;
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      {/* ── Close button ── */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-black/70 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black/90 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* ── Phone frame ── */}
      <div
        className="relative bg-[#FAFAF8] rounded-[2rem] shadow-2xl overflow-hidden"
        style={{
          width: 375,
          maxWidth: "calc(100vw - 2rem)",
          height: "calc(100vh - 4rem)",
          maxHeight: 812,
        }}
      >
        {/* Device notch */}
        <div className="sticky top-0 z-10 flex justify-center pt-2 pb-1 bg-[#FAFAF8]">
          <div className="w-28 h-5 rounded-full bg-black/10" />
        </div>

        {/* Invitation content */}
        <div className="overflow-y-auto" style={{ height: "calc(100% - 30px)" }}>
          {renderTemplate()}
        </div>
      </div>

      {/* ── FAB bubble button ── */}
      <button
        onClick={handleOpenPanel}
        className={`absolute z-20 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 ${
          panelOpen
            ? "right-[340px] bg-white dark:bg-zinc-800 text-foreground"
            : "right-6 bottom-6 text-white"
        }`}
        style={{ backgroundColor: panelOpen ? undefined : formData.theme_color || "#8B6F4E" }}
      >
        {panelOpen ? <ChevronRight className="w-5 h-5" /> : <Palette className="w-6 h-6" />}
      </button>

      {/* ── Edit panel ── */}
      <div
        className={`absolute right-0 top-0 h-full bg-white dark:bg-zinc-900 shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${
          panelOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: 320, maxWidth: "80vw" }}
      >
        <div className="p-5 space-y-6">
          {/* Panel header */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Edit Tampilan</h3>
            <button
              onClick={() => setPanelOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Theme Color ── */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Warna Tema</label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.hex}
                  onClick={() => onFormDataChange({ theme_color: swatch.hex })}
                  className={`relative h-10 rounded-lg border-2 transition-all ${
                    formData.theme_color === swatch.hex
                      ? "border-foreground scale-105 shadow-md"
                      : "border-transparent hover:border-muted-foreground/30"
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.label}
                >
                  {formData.theme_color === swatch.hex && (
                    <svg className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.theme_color || "#8B6F4E"}
                onChange={(e) => onFormDataChange({ theme_color: e.target.value })}
                className="w-9 h-9 rounded-lg border cursor-pointer"
              />
              <input
                type="text"
                value={formData.theme_color || ""}
                onChange={(e) => onFormDataChange({ theme_color: e.target.value })}
                placeholder="#8B6F4E"
                className="flex-1 text-sm px-3 py-2 rounded-lg border bg-background"
              />
            </div>
          </div>

          {/* ── Font Heading ── */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Font Judul</label>
            {editingFont === "heading" ? (
              <FontSelector
                value={formData.font_heading_name}
                fonts={filteredFonts}
                fontCat={fontCat}
                setFontCat={setFontCat}
                fontSearch={fontSearch}
                setFontSearch={setFontSearch}
                onSelect={(f) => handleFontSelect(f, "heading")}
                onClose={() => setEditingFont(null)}
              />
            ) : (
              <button
                onClick={() => setEditingFont("heading")}
                className="w-full flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-3 hover:bg-muted transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-md bg-muted/70 flex items-center justify-center shrink-0">
                    <span style={{ fontFamily: getFontStack(formData.font_heading_name), fontSize: 16, lineHeight: 1 }}>
                      Aa
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {formData.font_heading_name || "Pilih Font"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            )}
          </div>

          {/* ── Font Body ── */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Font Isi</label>
            {editingFont === "body" ? (
              <FontSelector
                value={formData.font_body_name}
                fonts={filteredFonts}
                fontCat={fontCat}
                setFontCat={setFontCat}
                fontSearch={fontSearch}
                setFontSearch={setFontSearch}
                onSelect={(f) => handleFontSelect(f, "body")}
                onClose={() => setEditingFont(null)}
              />
            ) : (
              <button
                onClick={() => setEditingFont("body")}
                className="w-full flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-3 hover:bg-muted transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-md bg-muted/70 flex items-center justify-center shrink-0">
                    <span style={{ fontFamily: getFontStack(formData.font_body_name), fontSize: 16, lineHeight: 1 }}>
                      Aa
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {formData.font_body_name || "Pilih Font"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Inline Font Selector Sub-component ────────────────────────────────────────

const FONT_CATS = [
  { value: "semua", label: "Semua" },
  { value: "serif", label: "Serif" },
  { value: "sans-serif", label: "Sans" },
  { value: "script", label: "Script" },
  { value: "display", label: "Display" },
];

function FontSelector({
  value,
  fonts,
  fontCat,
  setFontCat,
  fontSearch,
  setFontSearch,
  onSelect,
  onClose,
}: {
  value: string;
  fonts: typeof GOOGLE_FONTS;
  fontCat: string;
  setFontCat: (v: string) => void;
  fontSearch: string;
  setFontSearch: (v: string) => void;
  onSelect: (family: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Search */}
      <div className="p-2 border-b bg-muted/30">
        <input
          type="text"
          value={fontSearch}
          onChange={(e) => setFontSearch(e.target.value)}
          placeholder="Cari font..."
          className="w-full text-sm px-3 py-2 rounded-md border bg-background"
          autoFocus
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 p-2 border-b overflow-x-auto">
        {FONT_CATS.map((c) => (
          <button
            key={c.value}
            onClick={() => setFontCat(c.value)}
            className={`text-xs px-2 py-1 rounded-md whitespace-nowrap transition-colors ${
              fontCat === c.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Font list */}
      <div className="max-h-48 overflow-y-auto">
        {fonts.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            Font tidak ditemukan
          </p>
        )}
        {fonts.map((f) => (
          <button
            key={f.family}
            onClick={() => onSelect(f.family)}
            className={`w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center justify-between gap-2 ${
              value === f.family ? "bg-primary/10" : ""
            }`}
          >
            <span
              className="text-sm truncate"
              style={{ fontFamily: getFontStack(f.family) }}
            >
              {f.family}
            </span>
            {value === f.family && (
              <svg className="w-4 h-4 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Close */}
      <div className="p-2 border-t">
        <button
          onClick={onClose}
          className="w-full text-xs text-center text-muted-foreground hover:text-foreground py-1"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
